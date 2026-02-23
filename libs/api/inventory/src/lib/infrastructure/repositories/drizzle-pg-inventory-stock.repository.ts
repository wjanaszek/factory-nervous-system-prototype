import { ItemSkuVO } from '../../domain/value-objects/item-sku.value-object';
import { InventoryStockRepository } from '../../domain/repositories/inventory-stock.repository';
import { Inject, Injectable } from '@nestjs/common';
import { InventoryStockAggregate } from '../../domain/aggregates/inventory-stock.aggregate';
import { Result } from '../../domain/shared/result';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { QuantityVO } from '../../domain/value-objects/quantity.value-object';
import { and, eq } from 'drizzle-orm';
import {
  InventoryStock,
  inventoryStockEntity,
} from '../entities/inventory-stock.entity';
import { PostgresDb } from '../database/database.const';

@Injectable()
export class DrizzlePgInventoryStockRepository
  implements InventoryStockRepository
{
  constructor(@Inject(PostgresDb) private readonly db: NodePgDatabase) {}

  async findAllByWarehouse(
    warehouseId: string
  ): Promise<InventoryStockAggregate[]> {
    const results = await this.db
      .select()
      .from(inventoryStockEntity)
      .where(eq(inventoryStockEntity.location, warehouseId));

    return results.map(this.toDomain);
  }

  async findBySkuAndWarehouse(
    sku: ItemSkuVO,
    warehouseId: string
  ): Promise<InventoryStockAggregate | null> {
    const [result] = await this.db
      .select()
      .from(inventoryStockEntity)
      .where(
        and(
          eq(inventoryStockEntity.itemSku, sku.getValue()),
          eq(inventoryStockEntity.location, warehouseId)
        )
      );

    if (!result) {
      return null;
    }

    return this.toDomain(result);
  }

  async save(
    aggregate: InventoryStockAggregate
  ): Promise<Result<InventoryStockAggregate>> {
    try {
      return await this.saveWithOptimisticLocking(this.db, aggregate);
    } catch (error) {
      return Result.fail(
        error instanceof Error
          ? error.message
          : 'Failed to save inventory stock'
      );
    }
  }

  async saveMany(
    aggregates: InventoryStockAggregate[]
  ): Promise<Result<InventoryStockAggregate[]>> {
    try {
      const results = await this.db.transaction(async (tx) => {
        const saved: InventoryStockAggregate[] = [];
        for (const aggregate of aggregates) {
          const result = await this.saveWithOptimisticLocking(tx, aggregate);
          if (result.isFailure) {
            throw new Error(result.error || 'Failed to save inventory stock');
          }
          saved.push(result.getValue());
        }
        return saved;
      });

      return Result.ok(results);
    } catch (error) {
      return Result.fail(
        error instanceof Error
          ? error.message
          : 'Failed to save inventory stock'
      );
    }
  }

  private async saveWithOptimisticLocking(
    db: NodePgDatabase,
    aggregate: InventoryStockAggregate
  ): Promise<Result<InventoryStockAggregate>> {
    const entity = this.toEntity(aggregate);

    const [result] = await db
      .insert(inventoryStockEntity)
      .values(entity)
      .onConflictDoUpdate({
        target: [inventoryStockEntity.id],
        set: {
          quantity: entity.quantity,
          version: entity.version + 1,
          updatedAt: entity.updatedAt,
        },
        setWhere: eq(inventoryStockEntity.version, entity.version),
      })
      .returning();

    if (!result) {
      return Result.fail('Inventory stock version mismatch');
    }

    return Result.ok(this.toDomain(result));
  }

  private toDomain(entity: InventoryStock): InventoryStockAggregate {
    return InventoryStockAggregate.create({
      id: entity.id,
      itemSku: ItemSkuVO.create(entity.itemSku),
      quantity: QuantityVO.create(entity.quantity),
      warehouseId: entity.location,
      version: entity.version,
    });
  }

  private toEntity(aggregate: InventoryStockAggregate): InventoryStock {
    return {
      id: aggregate.data.id,
      itemSku: aggregate.data.itemSku.getValue(),
      location: aggregate.data.warehouseId,
      quantity: aggregate.data.quantity.getValue(),
      version: aggregate.data.version,
      updatedAt: new Date(),
    };
  }
}
