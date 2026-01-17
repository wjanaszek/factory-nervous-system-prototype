import { Location } from '@/app/types';

let warehouseData: Location[] = [
  {
    id: 'A1',
    name: 'Warehouse A - Rack 1',
    items: [
      { id: 'item1', name: 'Laptop Dell XPS', quantity: 15 },
      { id: 'item2', name: 'Monitor 24"', quantity: 30 },
    ],
  },
  {
    id: 'A2',
    name: 'Warehouse A - Rack 2',
    items: [
      { id: 'item3', name: 'Keyboard Mechanical', quantity: 50 },
      { id: 'item1', name: 'Laptop Dell XPS', quantity: 5 },
    ],
  },
  {
    id: 'B1',
    name: 'Warehouse B - Rack 1',
    items: [{ id: 'item2', name: 'Monitor 24"', quantity: 20 }],
  },
  {
    id: 'B2',
    name: 'Warehouse B - Rack 2',
    items: [],
  },
];

export async function getLocations(): Promise<Location[]> {
  // Simulate database query
  await new Promise((resolve) => setTimeout(resolve, 100));

  // In production: return await db.query('SELECT * FROM locations...')
  return JSON.parse(JSON.stringify(warehouseData));
}

export async function transferItem(
  itemId: string,
  sourceLocationId: string,
  targetLocationId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  // Simulate database operation
  await new Promise((resolve) => setTimeout(resolve, 300));

  const sourceLoc = warehouseData.find((l) => l.id === sourceLocationId);
  const targetLoc = warehouseData.find((l) => l.id === targetLocationId);

  if (!sourceLoc || !targetLoc) {
    return { success: false, error: 'Location not found' };
  }

  const sourceItemIdx = sourceLoc.items.findIndex((i) => i.id === itemId);
  if (sourceItemIdx === -1) {
    return { success: false, error: 'Item not found in source location' };
  }

  const sourceItem = sourceLoc.items[sourceItemIdx];
  if (sourceItem.quantity < quantity) {
    return { success: false, error: 'Insufficient quantity' };
  }

  // Execute transfer
  if (sourceItem.quantity === quantity) {
    sourceLoc.items.splice(sourceItemIdx, 1);
  } else {
    sourceItem.quantity -= quantity;
  }

  const targetItemIdx = targetLoc.items.findIndex((i) => i.id === itemId);
  if (targetItemIdx === -1) {
    targetLoc.items.push({
      id: itemId,
      name: sourceItem.name,
      quantity: quantity,
    });
  } else {
    targetLoc.items[targetItemIdx].quantity += quantity;
  }

  return { success: true };
}
