import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { InventoryStockRepository } from '@org/api/inventory/src/lib/domain/repositories/inventory-stock.repository';
import { ItemSkuVO } from '@org/api/inventory/src/lib/domain/value-objects/item-sku.value-object';
import { InventoryStockAggregate } from '@org/api/inventory/src/lib/domain/aggregates/inventory-stock.aggregate';
import { QuantityVO } from '@org/api/inventory/src/lib/domain/value-objects/quantity.value-object';
import { InventoryModule } from '@org/api/inventory';

describe('Optimistic locking (repository)', () => {
  let moduleRef: TestingModule;
  let inventoryStockRepository: InventoryStockRepository;

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

  it('rejects an update when the version is stale', async () => {
    const itemSku = ItemSkuVO.create('SKU-APPLE-001');
    const quantityDelta = QuantityVO.create(1);

    const warehouseId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const operatorId = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

    const initial = await inventoryStockRepository.findBySkuAndWarehouse(
      itemSku,
      warehouseId
    );

    expect(initial).not.toBeNull();

    const cloneData = {
      id: initial!.data.id,
      itemSku: initial!.data.itemSku,
      quantity: initial!.data.quantity,
      warehouseId: initial!.data.warehouseId,
      version: initial!.data.version,
    };

    const firstAttempt = InventoryStockAggregate.create(cloneData);
    const secondAttempt = InventoryStockAggregate.create(cloneData);

    firstAttempt.receive({
      quantity: quantityDelta,
      warehouseOperatorId: operatorId,
    });
    secondAttempt.receive({
      quantity: quantityDelta,
      warehouseOperatorId: operatorId,
    });

    const firstSave = await inventoryStockRepository.save(firstAttempt);
    expect(firstSave.isSuccess).toBe(true);
    expect(firstSave.isFailure).toBe(false);

    const secondSave = await inventoryStockRepository.save(secondAttempt);
    expect(secondSave.isSuccess).toBe(false);
    expect(secondSave.isFailure).toBe(true);
  });
});
