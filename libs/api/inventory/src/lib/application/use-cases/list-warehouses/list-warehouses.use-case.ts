import { UseCase } from '../../shared/use-case';
import { Injectable } from '@nestjs/common';
import { WarehouseRepository } from '../../repositories/warehouse.repository';
import { InventoryStockRepository } from '../../../domain/repositories/inventory-stock.repository';

@Injectable()
export class ListWarehousesUseCase implements UseCase<void, any> {
  constructor(
    private readonly inventoryStockRepository: InventoryStockRepository,
    private readonly warehouseRepository: WarehouseRepository
  ) {}

  async execute(): Promise<any> {
    const warehouses = await this.warehouseRepository.list();

    const result = [];

    for (const warehouse of warehouses) {
      const stocks = await this.inventoryStockRepository.findAllByWarehouse(
        warehouse.id
      );

      result.push({
        ...warehouse,
        stocks: stocks.map((stock) => ({
          id: stock.data.id,
          itemSku: stock.data.itemSku.getValue(),
          quantity: stock.data.quantity.getValue(),
        })),
      });
    }

    return result;
  }
}
