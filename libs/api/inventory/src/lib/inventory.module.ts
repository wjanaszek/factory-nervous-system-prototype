import { Module, OnModuleInit } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { DeliverToWarehouseUseCase } from './application/use-cases/deliver-to-warehouse/deliver-to-warehouse.use-case';
import { TransferBetweenWarehousesUseCase } from './application/use-cases/transfer-between-warehouses/transfer-between-warehouses.use-case';
import { DatabaseModule } from './infrastructure/database/database.module';
import { InventoryReceivedEventHandler } from './application/event-handlers/inventory-received.event-handler';
import { InventoryTransferredEventHandler } from './application/event-handlers/inventory-transferred.event-handler';
import { ListStockForItemInLocationUseCase } from './application/use-cases/list-stock-for-item-in-location/list-stock-for-item-in-location.use-case';
import { EventBus } from './application/shared/event-bus';
import { InventoryReceivedDomainEvent } from './domain/events/inventory-received.domain-event';
import { InventoryTransferredDomainEvent } from './domain/events/inventory-transferred.domain-event';

const EventHandlers = [
  InventoryReceivedEventHandler,
  InventoryTransferredEventHandler,
];
const UseCases = [
  DeliverToWarehouseUseCase,
  ListStockForItemInLocationUseCase,
  TransferBetweenWarehousesUseCase,
];

@Module({
  imports: [DatabaseModule],
  controllers: [InventoryController],
  providers: [EventBus, ...EventHandlers, ...UseCases],
  exports: [DatabaseModule],
})
export class InventoryModule implements OnModuleInit {
  constructor(
    private readonly eventBus: EventBus,
    private readonly inventoryReceivedHandler: InventoryReceivedEventHandler,
    private readonly inventoryTransferredHandler: InventoryTransferredEventHandler
  ) {}

  onModuleInit(): void {
    this.eventBus.register(
      InventoryReceivedDomainEvent.type,
      this.inventoryReceivedHandler
    );
    this.eventBus.register(
      InventoryTransferredDomainEvent.type,
      this.inventoryTransferredHandler
    );

    console.log('✅ Event handlers registered successfully');
  }
}
