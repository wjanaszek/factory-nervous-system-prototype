import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { warehouseEntity } from './warehouse.entity';

export const clientEntity = pgTable('client', {
  id: uuid().primaryKey(),
  name: text().notNull(),
});

export const clientEntityRelations = relations(
  clientEntity,
  ({ one, many }) => ({
    warehouses: many(warehouseEntity),
  })
);

export type Client = typeof clientEntity.$inferSelect;
export type ClientInsert = typeof clientEntity.$inferInsert;
export const Client = createSelectSchema(clientEntity);
export const ClientInsert = createInsertSchema(clientEntity);
