import { DomainEvent } from '../shared/domain-event';
import { ItemSkuVO } from '../value-objects/item-sku.value-object';
import { QuantityVO } from '../value-objects/quantity.value-object';

interface Payload {
  itemSku: ItemSkuVO;
  quantity: QuantityVO;
  warehouseId: string;
  warehouseOperatorId: string;
}

export class InventorySentFromWarehouseDomainEvent extends DomainEvent<Payload> {
  static readonly type = 'InventorySentFromWarehouseDomainEvent' as const;
  override readonly type = InventorySentFromWarehouseDomainEvent.type;

  constructor(public readonly payload: Payload) {
    super();
    this.date = new Date();
  }
}
