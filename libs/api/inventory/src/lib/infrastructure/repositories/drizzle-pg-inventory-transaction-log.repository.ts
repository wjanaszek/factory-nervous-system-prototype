import { Inject, Injectable } from '@nestjs/common';
import {
  InventoryTransactionLogRepository,
  SaveTransactionLogPayload,
} from '../../application/repositories/inventory-transaction-log.repository';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { inventoryTransactionEntity } from '../entities/inventory-transaction.entity';
import { PostgresDb } from '../database/database.const';

@Injectable()
export class DrizzlePgInventoryTransactionLogRepository
  implements InventoryTransactionLogRepository
{
  constructor(@Inject(PostgresDb) private readonly db: NodePgDatabase) {}

  async save({
    id,
    itemSku,
    quantity,
    transactionType,
    sourceLocation,
    targetLocation,
    requestedBy,
    date,
  }: SaveTransactionLogPayload): Promise<void> {
    await this.db.insert(inventoryTransactionEntity).values({
      id,
      itemSku: itemSku.getValue(),
      quantity: quantity.getValue(),
      transactionType,
      sourceLocation,
      targetLocation,
      requestedBy,
      timestamp: date,
    });
  }
}
