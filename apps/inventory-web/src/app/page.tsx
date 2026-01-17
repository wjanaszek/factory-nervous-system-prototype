import React from 'react';
import { Package } from 'lucide-react';
import StockOverview from '@/app/server/StockOverview';
import TransferForm from '@/app/ui/TransferForm';
import { getLocations } from '@/app/lib/warehouse-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Warehouse Management System',
  description: 'Real-time inventory tracking and transfers',
};

export default async function WarehousePage() {
  const locations = await getLocations();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-8 h-8" />
            Warehouse Management System
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time inventory tracking and transfers
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StockOverview locations={locations} />
          </div>

          <div className="lg:col-span-1">
            <TransferForm locations={locations} />
          </div>
        </div>
      </div>
    </div>
  );
}
