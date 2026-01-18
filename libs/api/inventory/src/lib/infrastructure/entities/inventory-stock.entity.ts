import {
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { warehouseEntity } from './warehouse.entity';

export const inventoryStockEntity = pgTable(
  'inventory_stock',
  {
    id: uuid('id').primaryKey(),
    itemSku: varchar('item_sku', { length: 30 }).notNull(),
    quantity: integer('quantity').notNull(),
    version: integer('version').notNull().default(1), // Optimistic locking
    location: uuid('location')
      .notNull()
      .references(() => warehouseEntity.id),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    itemSkuLocationIdx: uniqueIndex('item_sku_location_idx').on(
      table.itemSku,
      table.location
    ),
    itemSkuIdx: index('item_sku_idx').on(table.itemSku),
    locationIdx: index('location_idx').on(table.location),
  })
);

export const inventoryStockEntityRelations = relations(
  inventoryStockEntity,
  ({ one, many }) => ({
    // transactions: many(inventoryTransactionEntity),
  })
);

export type InventoryStock = typeof inventoryStockEntity.$inferSelect;
export type InventoryStockInsert = typeof inventoryStockEntity.$inferInsert;
export const InventoryStock = createSelectSchema(inventoryStockEntity);
export const InventoryStockInsert = createInsertSchema(inventoryStockEntity);
