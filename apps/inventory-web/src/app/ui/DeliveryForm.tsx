'use client';

import { useFormStatus } from 'react-dom';
import { deliverToWarehouse } from '@/app/actions/inventory';
import { useActionState, useEffect, useRef } from 'react';
import { Warehouse } from '@/app/types/api';

interface DeliveryFormProps {
  warehouses: Warehouse[];
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? 'Delivering...' : 'Deliver'}
    </button>
  );
}

export function DeliveryForm({ warehouses }: DeliveryFormProps) {
  const [state, formAction] = useActionState(deliverToWarehouse, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      alert('Delivery successful!');
    }
  }, [state]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Deliver to Warehouse</h2>

      <form ref={formRef} action={formAction} className="space-y-4">
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
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="locationId"
            className="block text-sm font-medium mb-1"
          >
            Warehouse Location
          </label>
          <select
            id="locationId"
            name="locationId"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select warehouse</option>
            {warehouses?.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            required
            min="1"
            placeholder="100"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <input
          type="hidden"
          name="operatorId"
          value="dddddddd-dddd-dddd-dddd-dddddddddddd"
        />

        {state && !state.success && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{state.error}</p>
          </div>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
