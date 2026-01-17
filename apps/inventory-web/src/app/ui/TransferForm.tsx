'use client';

import React, { useState, useTransition } from 'react';
import { ArrowRight } from 'lucide-react';
import { Location } from '@/app/types/warehouse';
import { executeTransfer } from '@/app/actions/warehouse';

interface TransferFormProps {
  locations: Location[];
}

export default function TransferForm({ locations }: TransferFormProps) {
  const [selectedItem, setSelectedItem] = useState('');
  const [sourceLocation, setSourceLocation] = useState('');
  const [targetLocation, setTargetLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  const getAllItems = () => {
    const itemsMap = new Map();
    locations.forEach((loc) => {
      loc.items.forEach((item) => {
        if (!itemsMap.has(item.id)) {
          itemsMap.set(item.id, item.name);
        }
      });
    });
    return Array.from(itemsMap, ([id, name]) => ({ id, name }));
  };

  const getAvailableQuantity = () => {
    if (!selectedItem || !sourceLocation) return 0;
    const loc = locations.find((l) => l.id === sourceLocation);
    if (!loc) return 0;
    const item = loc.items.find((i) => i.id === selectedItem);
    return item ? item.quantity : 0;
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!selectedItem || !sourceLocation || !targetLocation || !quantity) {
      setError('Please fill all fields');
      return;
    }

    if (sourceLocation === targetLocation) {
      setError('Source and target locations must be different');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    const available = getAvailableQuantity();
    if (qty > available) {
      setError(`Not enough quantity. Available: ${available}`);
      return;
    }

    startTransition(async () => {
      const result = await executeTransfer({
        itemId: selectedItem,
        sourceLocationId: sourceLocation,
        targetLocationId: targetLocation,
        quantity: qty,
      });

      if (result.success) {
        setSuccess(result.message!);
        setSelectedItem('');
        setSourceLocation('');
        setTargetLocation('');
        setQuantity('');
      } else {
        setError(result.error || 'Transfer failed');
      }
    });
  };

  const allItems = getAllItems();
  const availableQty = getAvailableQuantity();

  return (
    <div className="bg-white rounded-lg shadow sticky top-6">
      <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <ArrowRight className="w-5 h-5" />
          Transfer Items
        </h2>
      </div>
      <div className="p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item
          </label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Select item...</option>
            {allItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source Location
          </label>
          <select
            value={sourceLocation}
            onChange={(e) => setSourceLocation(e.target.value)}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Select source...</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Location
          </label>
          <select
            value={targetLocation}
            onChange={(e) => setTargetLocation(e.target.value)}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Select target...</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
            {availableQty > 0 && (
              <span className="ml-2 text-xs text-gray-500">
                (Available: {availableQty})
              </span>
            )}
          </label>
          <input
            type="number"
            min="1"
            max={availableQty || undefined}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Enter quantity..."
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Processing...' : 'Execute Transfer'}
        </button>
      </div>
    </div>
  );
}
