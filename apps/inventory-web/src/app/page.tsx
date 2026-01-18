import { TransferForm } from './ui/TransferForm';
import { DeliveryForm } from './ui/DeliveryForm';
import { WarehouseList } from './ui/WarehouseList';
import { StockChecker } from './ui/StockChecker';
import { getWarehouses } from './actions/inventory';

export default async function DashboardPage() {
  const warehouses = await getWarehouses();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Inventory Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DeliveryForm warehouses={warehouses} />
          <TransferForm warehouses={warehouses} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StockChecker warehouses={warehouses} />
          <WarehouseList />
        </div>
      </div>
    </div>
  );
}
