import { ItemSkuVO } from '../../domain/value-objects/item-sku.value-object';
import { QuantityVO } from '../../domain/value-objects/quantity.value-object';

export interface SaveTransactionLogPayload {
  id: string;
  itemSku: ItemSkuVO;
  quantity: QuantityVO;
  transactionType: 'INBOUND' | 'TRANSFER';
  sourceLocation?: string | null;
  targetLocation: string;
  requestedBy: string;
  date: Date;
}

export abstract class InventoryTransactionLogRepository {
  abstract save(payload: SaveTransactionLogPayload): Promise<void>;
}
