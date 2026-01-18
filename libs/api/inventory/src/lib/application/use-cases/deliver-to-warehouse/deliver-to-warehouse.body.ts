import z from 'zod';

export const DeliverToWarehouseBody = z.object({
  item: z.object({
    sku: z.string(),
    quantity: z.int(),
  }),
  location: z.object({
    id: z.uuid(),
  }),
  operator: z.object({
    id: z.uuid(),
  }),
});
export type DeliverToWarehouseBody = z.infer<typeof DeliverToWarehouseBody>;
