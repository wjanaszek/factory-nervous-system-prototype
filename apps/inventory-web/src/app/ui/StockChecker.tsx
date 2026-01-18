'use client';

import { useState, useTransition } from 'react';
import { getStockForItemInLocation } from '@/app/actions/inventory';
import { Warehouse } from '@/app/types/api';

interface StockCheckerProps {
  warehouses: Warehouse[];
}

export function StockChecker({ warehouses }: StockCheckerProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    itemSku?: string;
    locationId?: string;
    stock?: any;
    error?: string;
  } | null>(null);

  async function handleCheck(formData: FormData) {
    const itemSku = formData.get('itemSku') as string;
    const locationId = formData.get('locationId') as string;

    startTransition(async () => {
      const stock = await getStockForItemInLocation(itemSku, locationId);

      if (stock) {
        setResult({ itemSku, locationId, stock });
      } else {
        setResult({
          itemSku,
          locationId,
          error: 'No stock found for this item in this location',
        });
      }
    });
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Check Stock</h2>

      <form action={handleCheck} className="space-y-4">
        <div>
          <label htmlFor="itemSku" className="block text-sm font-medium mb-1">
            Item SKU
          </label>
          <input
            type="text"
            id="itemSku"
            name="itemSku"
            required
            placeholder="SKU-001"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="locationId"
            className="block text-sm font-medium mb-1"
          >
            Location
          </label>
          <select
            id="locationId"
            name="locationId"
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select warehouse</option>
            {warehouses?.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400"
        >
          {isPending ? 'Checking...' : 'Check Stock'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <div>
              <h3 className="font-semibold mb-2">Stock Information</h3>
              <p>
                <span className="font-medium">Item SKU:</span>{' '}
                {result.stock.itemSku}
              </p>
              <p>
                <span className="font-medium">Quantity:</span>{' '}
                <span className="text-2xl font-bold text-green-600">
                  {result.stock.quantity}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
