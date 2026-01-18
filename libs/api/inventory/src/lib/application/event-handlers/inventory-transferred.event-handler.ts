import { EventHandler } from '../shared/event-bus';
import { Injectable } from '@nestjs/common';
import { InventoryTransferredDomainEvent } from '../../domain/events/inventory-transferred.domain-event';
import { InventoryTransactionLogRepository } from '../repositories/inventory-transaction-log.repository';

@Injectable()
export class InventoryTransferredEventHandler
  implements EventHandler<InventoryTransferredDomainEvent>
{
  constructor(
    private readonly logRepository: InventoryTransactionLogRepository
  ) {}

  async handle({
    payload,
    date,
  }: InventoryTransferredDomainEvent): Promise<void> {
    console.log('Inventory transferred');

    await this.logRepository.save({
      id: crypto.randomUUID(),
      itemSku: payload.itemSku,
      quantity: payload.quantity,
      transactionType: 'TRANSFER',
      sourceLocation: payload.sourceWarehouseId,
      targetLocation: payload.targetWarehouseId,
      requestedBy: payload.warehouseOperatorId,
      date,
    });
  }
}
