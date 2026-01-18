import { Injectable } from '@nestjs/common';
import { UseCase } from '../../shared/use-case';
import { DeliverToWarehouseBody } from './deliver-to-warehouse.body';
import { InventoryStockRepository } from '../../../domain/repositories/inventory-stock.repository';
import { ItemSkuVO } from '../../../domain/value-objects/item-sku.value-object';
import { InventoryStockAggregate } from '../../../domain/aggregates/inventory-stock.aggregate';
import { QuantityVO } from '../../../domain/value-objects/quantity.value-object';
import { Result } from '../../../domain/shared/result';
import { EventBus } from '../../shared/event-bus';

type DeliverToWarehouseInput = {
  body: DeliverToWarehouseBody;
};

@Injectable()
export class DeliverToWarehouseUseCase
  implements UseCase<DeliverToWarehouseInput, Result<void>>
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly inventoryStockRepository: InventoryStockRepository
  ) {}

  async execute({ body }: DeliverToWarehouseInput): Promise<Result<void>> {
    try {
      const itemSku = ItemSkuVO.create(body.item.sku);
      const quantity = QuantityVO.create(body.item.quantity);
      const warehouseId = body.location.id;

      let stock = await this.inventoryStockRepository.findBySkuAndWarehouse(
        itemSku,
        warehouseId
      );

      if (!stock) {
        stock = InventoryStockAggregate.create({
          itemSku,
          quantity: QuantityVO.zero(),
          warehouseId,
          version: 1,
        });
      }

      const deliveryResult = stock.receive({
        quantity,
        warehouseOperatorId: body.operator.id,
      });

      if (deliveryResult.isFailure) {
        return Result.fail(deliveryResult.error!);
      }

      const saveResult = await this.inventoryStockRepository.save(stock);

      if (saveResult.isFailure) {
        return Result.fail(saveResult.error!);
      }

      await this.eventBus.publishAll(stock.domainEvents);
      stock.clearEvents();

      return Result.ok();
    } catch (e) {
      console.error(e);
      return Result.fail(e as string);
    }
  }
}
