'use server';

import { revalidatePath } from 'next/cache';
import { ApiResponse, StockItem, Warehouse } from '@/app/types/api';

const API_URL = process.env.API_URL || 'http://localhost:3000';

type FormState = {
  success: boolean;
  error?: string;
} | null;

export async function getWarehouses(): Promise<Warehouse[]> {
  try {
    const response = await fetch(`${API_URL}/inventory/warehouses`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch warehouses');
    }

    const result: Warehouse[] = await response.json();

    return result;
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return [];
  }
}

export async function getStockForItemInLocation(
  itemSku: string,
  locationId: string
): Promise<StockItem | null> {
  try {
    const response = await fetch(
      `${API_URL}/inventory/stock/${itemSku}/${locationId}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch stock');
    }

    const result: ApiResponse<StockItem> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching stock:', error);
    return null;
  }
}

export async function transferBetweenWarehouses(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const itemSku = formData.get('itemSku') as string;
  const fromLocationId = formData.get('fromLocationId') as string;
  const toLocationId = formData.get('toLocationId') as string;
  const quantity = parseInt(formData.get('quantity') as string);
  const operatorId = formData.get('operatorId') as string;

  try {
    const response = await fetch(
      `${API_URL}/inventory/transfer-between-warehouses`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item: {
            sku: itemSku,
            quantity,
          },
          fromLocation: {
            id: fromLocationId,
          },
          toLocation: {
            id: toLocationId,
          },
          operatorId,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Transfer failed',
      };
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Transfer error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function deliverToWarehouse(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const itemSku = formData.get('itemSku') as string;
  const locationId = formData.get('locationId') as string;
  const quantity = parseInt(formData.get('quantity') as string);
  const operatorId = formData.get('operatorId') as string;

  try {
    const response = await fetch(`${API_URL}/inventory/deliver-to-warehouse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item: {
          sku: itemSku,
          quantity,
        },
        location: {
          id: locationId,
        },
        operator: {
          id: operatorId,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Delivery failed',
      };
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delivery error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
