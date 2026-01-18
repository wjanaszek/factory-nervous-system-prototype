import { getWarehouses } from '@/app/actions/inventory';

export async function WarehouseList() {
  const warehouses = await getWarehouses();

  if (warehouses?.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-500">No warehouses found</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Warehouses</h2>
      <div className="grid gap-4">
        {warehouses?.map((warehouse) => (
          <div
            key={warehouse.id}
            className="p-4 border rounded-md hover:bg-gray-50"
          >
            <h3 className="font-semibold text-lg">{warehouse.name}</h3>
            <p className="text-sm text-gray-600">ID: {warehouse.id}</p>

            <h3 className="font-semibold text-lg">Stock items</h3>
            {!warehouse.stocks?.length && 'No stock items'}
            {!!warehouse.stocks?.length &&
              warehouse.stocks.map((stock) => (
                <>
                  <p className="font-semibold text-sm text-gray-600">
                    SKU: {stock.itemSku}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {stock.quantity}
                  </p>
                </>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
