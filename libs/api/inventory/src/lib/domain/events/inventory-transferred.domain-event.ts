import { DomainEvent } from '../shared/domain-event';
import { ItemSkuVO } from '../value-objects/item-sku.value-object';
import { QuantityVO } from '../value-objects/quantity.value-object';

interface Payload {
  itemSku: ItemSkuVO;
  quantity: QuantityVO;
  sourceWarehouseId: string;
  targetWarehouseId: string;
  warehouseOperatorId: string;
}

export class InventoryTransferredDomainEvent extends DomainEvent<Payload> {
  static readonly type = 'InventoryTransferredDomainEvent' as const;
  override readonly type = InventoryTransferredDomainEvent.type;

  constructor(public readonly payload: Payload) {
    super();
    this.date = new Date();
  }
}
