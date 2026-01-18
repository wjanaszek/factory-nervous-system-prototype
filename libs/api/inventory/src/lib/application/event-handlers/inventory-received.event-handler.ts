import { EventHandler } from '../shared/event-bus';
import { InventoryReceivedDomainEvent } from '../../domain/events/inventory-received.domain-event';
import { Injectable } from '@nestjs/common';
import { InventoryTransactionLogRepository } from '../repositories/inventory-transaction-log.repository';

@Injectable()
export class InventoryReceivedEventHandler
  implements EventHandler<InventoryReceivedDomainEvent>
{
  constructor(
    private readonly logRepository: InventoryTransactionLogRepository
  ) {}

  async handle({ payload, date }: InventoryReceivedDomainEvent): Promise<void> {
    console.log('Inventory delivered');

    await this.logRepository.save({
      id: crypto.randomUUID(),
      itemSku: payload.itemSku,
      quantity: payload.quantity,
      transactionType: 'INBOUND',
      sourceLocation: null,
      targetLocation: payload.warehouseId,
      requestedBy: payload.warehouseOperatorId,
      date,
    });
  }
}
