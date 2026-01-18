import { AggregateRoot } from '../shared/aggregate';
import { Result } from '../shared/result';
import { ItemSkuVO } from '../value-objects/item-sku.value-object';
import { QuantityVO } from '../value-objects/quantity.value-object';
import { InventoryReceivedDomainEvent } from '../events/inventory-received.domain-event';
import { InventorySentFromWarehouseDomainEvent } from '../events/inventory-sent-from-warehouse.domain-event';

export interface CreateInventoryStockAggregate {
  id?: string;
  itemSku: ItemSkuVO;
  quantity: QuantityVO;
  warehouseId: string;
  version: number;
}

interface InventoryStock {
  id: string;
  itemSku: ItemSkuVO;
  quantity: QuantityVO;
  warehouseId: string;
  version: number;
}

export class InventoryStockAggregate extends AggregateRoot {
  private constructor(private _data: InventoryStock) {
    super();
  }

  static create(data: CreateInventoryStockAggregate): InventoryStockAggregate {
    return new InventoryStockAggregate({
      ...data,
      id: data.id ? data.id : crypto.randomUUID(),
    });
  }

  canTransfer(quantity: QuantityVO): boolean {
    return this._data.quantity.isGreaterThanOrEqual(quantity);
  }

  take({
    quantity,
    warehouseOperatorId,
  }: {
    quantity: QuantityVO;
    warehouseOperatorId: string;
  }): Result<void> {
    try {
      this._data.quantity = this._data.quantity.subtract(quantity);

      this.addDomainEvent(
        new InventorySentFromWarehouseDomainEvent({
          itemSku: this._data.itemSku,
          quantity: this._data.quantity,
          warehouseId: this._data.warehouseId,
          warehouseOperatorId,
        })
      );

      return Result.ok();
    } catch (e) {
      return Result.fail(e as string);
    }
  }

  receive({
    quantity,
    warehouseOperatorId,
  }: {
    quantity: QuantityVO;
    warehouseOperatorId: string;
  }): Result<void> {
    try {
      this._data.quantity = this._data.quantity.add(quantity);

      this.addDomainEvent(
        new InventoryReceivedDomainEvent({
          itemSku: this._data.itemSku,
          quantity: this._data.quantity,
          warehouseId: this._data.warehouseId,
          warehouseOperatorId,
        })
      );

      return Result.ok();
    } catch (e) {
      return Result.fail(e as string);
    }
  }

  get warehouseId(): string {
    return this._data.warehouseId;
  }

  get data(): InventoryStock {
    return this._data;
  }
}
