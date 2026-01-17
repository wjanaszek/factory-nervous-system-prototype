import React from 'react';
import { Location } from '@/app/types';
import LocationCard from './LocationCard';

interface StockOverviewProps {
  locations: Location[];
}

export default function StockOverview({ locations }: StockOverviewProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Stock Overview</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </div>
    </div>
  );
}
