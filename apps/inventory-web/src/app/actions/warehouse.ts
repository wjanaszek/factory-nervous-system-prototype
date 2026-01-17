'use server';

import { revalidatePath } from 'next/cache';
import { TransferRequest } from '@/app/types/warehouse';
import { transferItem } from '@/app/lib/warehouse-service';

export async function executeTransfer(transfer: TransferRequest) {
  try {
    if (
      !transfer.itemId ||
      !transfer.sourceLocationId ||
      !transfer.targetLocationId ||
      !transfer.quantity
    ) {
      return { success: false, error: 'Missing required fields' };
    }

    if (transfer.sourceLocationId === transfer.targetLocationId) {
      return { success: false, error: 'Source and target must be different' };
    }

    if (transfer.quantity <= 0) {
      return { success: false, error: 'Quantity must be positive' };
    }

    const result = await transferItem(
      transfer.itemId,
      transfer.sourceLocationId,
      transfer.targetLocationId,
      transfer.quantity
    );

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath('/');

    return {
      success: true,
      message: `Successfully transferred ${transfer.quantity} items from ${transfer.sourceLocationId} to ${transfer.targetLocationId}`,
    };
  } catch (error) {
    console.error('Transfer error:', error);
    return { success: false, error: 'Transfer failed. Please try again.' };
  }
}
