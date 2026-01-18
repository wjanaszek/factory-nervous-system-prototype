import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { warehouseOperatorEntity } from './warehouse-operator.entity';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { warehouseEntity } from './warehouse.entity';

export const transactionTypeEnum = pgEnum('transaction_type', [
  'INBOUND',
  'TRANSFER',
]);

export const inventoryTransactionEntity = pgTable('inventory_transaction', {
  id: uuid().primaryKey(),
  itemSku: varchar('item_sku', { length: 30 }).notNull(),
  quantity: integer('quantity').notNull(),
  transactionType: transactionTypeEnum('transaction_type').notNull(),
  sourceLocation: uuid('source_location').references(() => warehouseEntity.id),
  targetLocation: uuid('target_location')
    .notNull()
    .references(() => warehouseEntity.id),
  requestedBy: uuid('requested_by')
    .notNull()
    .references(() => warehouseOperatorEntity.id),
  timestamp: timestamp('timestamp').notNull(),
});
// TODO add unique index on itemSku & targetLocationId

export const inventoryTransactionEntityRelations = relations(
  inventoryTransactionEntity,
  ({ one, many }) => ({
    requester: one(warehouseOperatorEntity, {
      fields: [inventoryTransactionEntity.requestedBy],
      references: [warehouseOperatorEntity.id],
    }),
  })
);

export type InventoryTransaction =
  typeof inventoryTransactionEntity.$inferSelect;
export type InventoryTransactionInsert =
  typeof inventoryTransactionEntity.$inferInsert;
export const InventoryTransaction = createSelectSchema(
  inventoryTransactionEntity
);
export const InventoryTransactionInsert = createInsertSchema(
  inventoryTransactionEntity
);
