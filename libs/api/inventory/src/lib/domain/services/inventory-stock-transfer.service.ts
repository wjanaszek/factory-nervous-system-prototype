import { InventoryStockAggregate } from '../aggregates/inventory-stock.aggregate';
import { QuantityVO } from '../value-objects/quantity.value-object';
import { Result } from '../shared/result';
import { DomainEvent } from '../shared/domain-event';
import { InventoryTransferredDomainEvent } from '../events/inventory-transferred.domain-event';
import { ItemSkuVO } from '../value-objects/item-sku.value-object';

export class InventoryStockTransferService {
  static transfer({
    fromStock,
    toStock,
    itemSku,
    quantity,
    warehouseOperatorId,
  }: {
    fromStock: InventoryStockAggregate;
    toStock: InventoryStockAggregate;
    itemSku: ItemSkuVO;
    quantity: QuantityVO;
    warehouseOperatorId: string;
  }): Result<DomainEvent> {
    const getResult = fromStock.take({ quantity, warehouseOperatorId });

    if (getResult.isFailure) {
      return Result.fail(getResult.error!);
    }

    const transferResult = toStock.receive({
      quantity,
      warehouseOperatorId,
    });

    if (transferResult.isFailure) {
      return Result.fail(transferResult.error!);
    }

    return Result.ok(
      new InventoryTransferredDomainEvent({
        itemSku,
        quantity,
        sourceWarehouseId: fromStock.warehouseId,
        targetWarehouseId: toStock.warehouseId,
        warehouseOperatorId,
      })
    );
  }
}
