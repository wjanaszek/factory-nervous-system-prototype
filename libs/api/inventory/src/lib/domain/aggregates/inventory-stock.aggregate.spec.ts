import { InventoryStockAggregate } from './inventory-stock.aggregate';
import { ItemSkuVO } from '../value-objects/item-sku.value-object';
import { QuantityVO } from '../value-objects/quantity.value-object';
import { InventoryReceivedDomainEvent } from '../events/inventory-received.domain-event';
import { InventorySentFromWarehouseDomainEvent } from '../events/inventory-sent-from-warehouse.domain-event';

describe(InventoryStockAggregate.name, () => {
  const sku = ItemSkuVO.create('SKU-1');
  const warehouseId = 'WH-1';

  const createAggregate = (quantity: number) =>
    InventoryStockAggregate.create({
      itemSku: sku,
      quantity: QuantityVO.create(quantity),
      warehouseId,
      version: 1,
    });

  describe('create', () => {
    it('should create aggregate with generated id', () => {
      const aggregate = createAggregate(10);

      expect(aggregate.data.id).toBeDefined();
      expect(aggregate.data.itemSku).toBe(sku);
      expect(aggregate.data.quantity.getValue()).toBe(10);
    });
  });

  describe('canTransfer', () => {
    it('should return true if quantity is sufficient', () => {
      const aggregate = createAggregate(10);

      expect(aggregate.canTransfer(QuantityVO.create(5))).toBe(true);
    });

    it('should return false if quantity is insufficient', () => {
      const aggregate = createAggregate(3);

      expect(aggregate.canTransfer(QuantityVO.create(5))).toBe(false);
    });
  });

  describe('take', () => {
    it('should subtract quantity and emit InventorySentFromWarehouseDomainEvent', () => {
      const aggregate = createAggregate(10);

      const result = aggregate.take({
        quantity: QuantityVO.create(4),
        warehouseOperatorId: 'OP-1',
      });

      expect(result.isSuccess).toBe(true);
      expect(aggregate.data.quantity.getValue()).toBe(6);

      const events = aggregate.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(InventorySentFromWarehouseDomainEvent);
    });

    it('should return failed Result if quantity is insufficient', () => {
      const aggregate = createAggregate(3);

      const result = aggregate.take({
        quantity: QuantityVO.create(5),
        warehouseOperatorId: 'OP-1',
      });

      expect(result.isFailure).toBe(true);
      expect(aggregate.data.quantity.getValue()).toBe(3);
      expect(aggregate.domainEvents).toHaveLength(0);
    });
  });

  describe('receive', () => {
    it('should add quantity and emit InventoryReceivedDomainEvent', () => {
      const aggregate = createAggregate(5);

      const result = aggregate.receive({
        quantity: QuantityVO.create(7),
        warehouseOperatorId: 'OP-2',
      });

      expect(result.isSuccess).toBe(true);
      expect(aggregate.data.quantity.getValue()).toBe(12);

      const events = aggregate.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(InventoryReceivedDomainEvent);
    });
  });

  describe('domain events lifecycle', () => {
    it('should accumulate domain events for multiple operations', () => {
      const aggregate = createAggregate(10);

      aggregate.receive({
        quantity: QuantityVO.create(2),
        warehouseOperatorId: 'OP-1',
      });

      aggregate.take({
        quantity: QuantityVO.create(3),
        warehouseOperatorId: 'OP-1',
      });

      expect(aggregate.domainEvents).toHaveLength(2);
    });

    it('should not emit event when operation fails', () => {
      const aggregate = createAggregate(2);

      aggregate.take({
        quantity: QuantityVO.create(5),
        warehouseOperatorId: 'OP-1',
      });

      expect(aggregate.domainEvents).toHaveLength(0);
    });
  });
});
