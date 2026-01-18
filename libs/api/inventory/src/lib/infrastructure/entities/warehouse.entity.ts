import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { warehouseOperatorEntity } from './warehouse-operator.entity';
import { relations } from 'drizzle-orm';
import { clientEntity } from './client.entity';

export const warehouseEntity = pgTable('warehouse', {
  id: uuid().primaryKey(),
  address: text().notNull(), // simplification
  name: text().notNull().default('Test warehouse'),
  clientId: uuid('client_id')
    .notNull()
    .references(() => clientEntity.id),
});

export const warehouseEntityRelations = relations(
  warehouseEntity,
  ({ one, many }) => ({
    operators: many(warehouseOperatorEntity),
    owner: one(clientEntity, {
      fields: [warehouseEntity.clientId],
      references: [clientEntity.id],
    }),
  })
);

export type Warehouse = typeof warehouseEntity.$inferSelect;
export type WarehouseInsert = typeof warehouseEntity.$inferInsert;
export const Warehouse = createSelectSchema(warehouseEntity);
export const WarehouseInsert = createInsertSchema(warehouseEntity);
