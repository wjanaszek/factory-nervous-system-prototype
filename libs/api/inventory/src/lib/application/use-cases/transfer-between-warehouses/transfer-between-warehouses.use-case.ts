import { UseCase } from '../../shared/use-case';
import { Injectable } from '@nestjs/common';
import { TransferBetweenWarehousesBody } from './transfer-between-warehouses.body';
import { EventBus } from '../../shared/event-bus';
import { InventoryStockRepository } from '../../../domain/repositories/inventory-stock.repository';
import { Result } from '../../../domain/shared/result';
import { ItemSkuVO } from '../../../domain/value-objects/item-sku.value-object';
import { QuantityVO } from '../../../domain/value-objects/quantity.value-object';
import { InventoryStockTransferService } from '../../../domain/services/inventory-stock-transfer.service';
import { InventoryStockAggregate } from '../../../domain/aggregates/inventory-stock.aggregate';

type TransferBetweenWarehousesInput = {
  body: TransferBetweenWarehousesBody;
};

@Injectable()
export class TransferBetweenWarehousesUseCase
  implements UseCase<TransferBetweenWarehousesInput, Result<void>>
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly inventoryStockRepository: InventoryStockRepository
  ) {}

  async execute({
    body,
  }: TransferBetweenWarehousesInput): Promise<Result<void>> {
    try {
      const itemSku = ItemSkuVO.create(body.item.sku);
      const quantity = QuantityVO.create(body.item.quantity);
      const warehouseOperatorId = body.operatorId;

      const fromStock =
        await this.inventoryStockRepository.findBySkuAndWarehouse(
          itemSku,
          body.fromLocation.id
        );

      if (!fromStock) {
        return Result.fail('No stock to get items from found');
      }

      if (!fromStock.canTransfer(quantity)) {
        return Result.fail('No enough stock items');
      }

      let toStock = await this.inventoryStockRepository.findBySkuAndWarehouse(
        itemSku,
        body.toLocation.id
      );

      if (!toStock) {
        toStock = InventoryStockAggregate.create({
          itemSku,
          quantity: QuantityVO.zero(),
          warehouseId: body.toLocation.id,
          version: 1,
        });
      }

      if (fromStock.warehouseId === toStock.warehouseId) {
        return Result.fail('Cannot move between the same locations');
      }

      const transferResult = InventoryStockTransferService.transfer({
        fromStock,
        toStock,
        itemSku,
        quantity,
        warehouseOperatorId,
      });

      if (transferResult.isFailure) {
        return Result.fail(transferResult.error!);
      }

      const saveResult = await this.inventoryStockRepository.saveMany([
        fromStock,
        toStock,
      ]);

      if (saveResult.isFailure) {
        return Result.fail(saveResult.error!);
      }

      await this.eventBus.publishAll([
        ...fromStock.domainEvents,
        ...toStock.domainEvents,
        transferResult.getValue(),
      ]);
      fromStock.clearEvents();
      toStock.clearEvents();

      return Result.ok();
    } catch (e) {
      return Result.fail(e as string);
    }
  }
}
