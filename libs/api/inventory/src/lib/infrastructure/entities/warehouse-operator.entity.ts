import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { inventoryTransactionEntity } from './inventory-transaction.entity';
import { warehouseEntity } from './warehouse.entity';

export const warehouseOperatorEntity = pgTable('warehouse_operator', {
  id: uuid().primaryKey(),
  name: text().notNull(),
  locationId: uuid()
    .notNull()
    .references(() => warehouseEntity.id),
  createdAt: timestamp({ withTimezone: true }).notNull(),
});

export const warehouseOperatorEntityRelations = relations(
  warehouseOperatorEntity,
  ({ one, many }) => ({
    requestedTransferRequests: many(inventoryTransactionEntity),
    warehouse: one(warehouseEntity, {
      fields: [warehouseOperatorEntity.locationId],
      references: [warehouseEntity.id],
    }),
  })
);

export type WarehouseOperator = typeof warehouseOperatorEntity.$inferSelect;
export type WarehouseOperatorInsert =
  typeof warehouseOperatorEntity.$inferInsert;
export const WarehouseOperator = createSelectSchema(warehouseOperatorEntity);
export const WarehouseOperatorInsert = createInsertSchema(
  warehouseOperatorEntity
);
