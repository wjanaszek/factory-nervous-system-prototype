import z from 'zod';

export const TransferBetweenWarehousesBody = z.object({
  fromLocation: z.object({
    id: z.uuid(),
  }),
  toLocation: z.object({
    id: z.uuid(),
  }),
  item: z.object({
    sku: z.string(),
    quantity: z.int(),
  }),
  operatorId: z.uuid(),
});
export type TransferBetweenWarehousesBody = z.infer<
  typeof TransferBetweenWarehousesBody
>;
