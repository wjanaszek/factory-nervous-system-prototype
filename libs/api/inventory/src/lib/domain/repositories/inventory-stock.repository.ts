import { ItemSkuVO } from '../value-objects/item-sku.value-object';
import { InventoryStockAggregate } from '../aggregates/inventory-stock.aggregate';
import { Result } from '../shared/result';

export abstract class InventoryStockRepository {
  abstract findAllByWarehouse(
    warehouseId: string
  ): Promise<InventoryStockAggregate[]>;

  abstract findBySkuAndWarehouse(
    sku: ItemSkuVO,
    warehouseId: string
  ): Promise<InventoryStockAggregate | null>;

  abstract save(
    inventoryStock: InventoryStockAggregate
  ): Promise<Result<InventoryStockAggregate>>;
}
