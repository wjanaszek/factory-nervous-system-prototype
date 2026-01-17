import React from 'react';
import { MapPin } from 'lucide-react';
import { Location } from '@/app/types';

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-800">{location.name}</h3>
        <span className="ml-auto text-sm text-gray-500">({location.id})</span>
      </div>
      {location.items.length === 0 ? (
        <p className="text-gray-400 text-sm italic">Empty location</p>
      ) : (
        <ul className="space-y-2">
          {location.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded"
            >
              <span className="text-gray-700">{item.name}</span>
              <span className="font-semibold text-blue-600">
                ×{item.quantity}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
