import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { InventoryModule } from '@org/api/inventory';
import { InventoryStockRepository } from '@org/api/inventory/src/lib/domain/repositories/inventory-stock.repository';
import { ItemSkuVO } from '@org/api/inventory/src/lib/domain/value-objects/item-sku.value-object';
import { InventoryStockAggregate } from '@org/api/inventory/src/lib/domain/aggregates/inventory-stock.aggregate';
import { QuantityVO } from '@org/api/inventory/src/lib/domain/value-objects/quantity.value-object';

describe('Transfer persistence (repository)', () => {
  let moduleRef: TestingModule;
  let inventoryStockRepository: InventoryStockRepository;

  const itemSku = ItemSkuVO.create('SKU-APPLE-001');
  const fromWarehouseId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const toWarehouseId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  const operatorId = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        InventoryModule,
      ],
    }).compile();

    inventoryStockRepository = moduleRef.get(InventoryStockRepository);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('rolls back both updates when one save fails', async () => {
    const quantityDelta = QuantityVO.create(1);

    const fromInitial = (await inventoryStockRepository.findBySkuAndWarehouse(
      itemSku,
      fromWarehouseId
    ))!;
    const toInitial = (await inventoryStockRepository.findBySkuAndWarehouse(
      itemSku,
      toWarehouseId
    ))!;

    const toBump = InventoryStockAggregate.create({
      id: toInitial.data.id,
      itemSku: toInitial.data.itemSku,
      quantity: toInitial.data.quantity,
      warehouseId: toInitial.data.warehouseId,
      version: toInitial.data.version,
    });

    toBump.receive({
      quantity: quantityDelta,
      warehouseOperatorId: operatorId,
    });
    const bumpResult = await inventoryStockRepository.save(toBump);
    expect(bumpResult.isSuccess).toBe(true);

    const fromAttempt = InventoryStockAggregate.create({
      id: fromInitial.data.id,
      itemSku: fromInitial.data.itemSku,
      quantity: fromInitial.data.quantity,
      warehouseId: fromInitial.data.warehouseId,
      version: fromInitial.data.version,
    });
    const toAttempt = InventoryStockAggregate.create({
      id: toInitial.data.id,
      itemSku: toInitial.data.itemSku,
      quantity: toInitial.data.quantity,
      warehouseId: toInitial.data.warehouseId,
      version: toInitial.data.version,
    });

    fromAttempt.take({
      quantity: quantityDelta,
      warehouseOperatorId: operatorId,
    });
    toAttempt.receive({
      quantity: quantityDelta,
      warehouseOperatorId: operatorId,
    });

    const saveManyResult = await inventoryStockRepository.saveMany([
      fromAttempt,
      toAttempt,
    ]);
    // because we bumped version earlier
    expect(saveManyResult.isFailure).toBe(true);

    const fromAfter = (await inventoryStockRepository.findBySkuAndWarehouse(
      itemSku,
      fromWarehouseId
    ))!;
    const toAfter = (await inventoryStockRepository.findBySkuAndWarehouse(
      itemSku,
      toWarehouseId
    ))!;

    expect(fromAfter.data.quantity.getValue()).toBe(
      fromInitial.data.quantity.getValue()
    );
    expect(fromAfter.data.version).toBe(fromInitial.data.version);

    expect(toAfter.data.quantity.getValue()).toBe(
      toInitial.data.quantity.getValue() + 1
    );
    expect(toAfter.data.version).toBe(toInitial.data.version + 1);
  });
});
