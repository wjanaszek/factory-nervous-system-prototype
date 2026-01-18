import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DeliverToWarehouseUseCase } from './application/use-cases/deliver-to-warehouse/deliver-to-warehouse.use-case';
import { TransferBetweenWarehousesUseCase } from './application/use-cases/transfer-between-warehouses/transfer-between-warehouses.use-case';
import { DeliverToWarehouseBody } from './application/use-cases/deliver-to-warehouse/deliver-to-warehouse.body';
import { TransferBetweenWarehousesBody } from './application/use-cases/transfer-between-warehouses/transfer-between-warehouses.body';
import { ListStockForItemInLocationUseCase } from './application/use-cases/list-stock-for-item-in-location/list-stock-for-item-in-location.use-case';
import { ListWarehousesUseCase } from './application/use-cases/list-warehouses/list-warehouses.use-case';

/**
 * Assuming there will be some kind of authorization/roles etc.
 */
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly deliverToWarehouseUseCase: DeliverToWarehouseUseCase,
    private readonly transferBetweenWarehousesUseCase: TransferBetweenWarehousesUseCase,
    private readonly listStockForItemInLocationUseCase: ListStockForItemInLocationUseCase,
    private readonly listWarehousesUseCase: ListWarehousesUseCase
  ) {}

  @Post('deliver-to-warehouse')
  async deliverToWarehouse(@Body() body: DeliverToWarehouseBody) {
    await this.deliverToWarehouseUseCase.execute({ body });
  }

  @Post('transfer-between-warehouses')
  async transferBetweenWarehouses(@Body() body: TransferBetweenWarehousesBody) {
    await this.transferBetweenWarehousesUseCase.execute({ body });
  }

  @Get('stock/:itemSku/:locationId')
  async listStockFor(
    @Param('itemSku') itemSku: string,
    @Param('locationId') locationId: string
  ) {
    return this.listStockForItemInLocationUseCase.execute({
      body: { itemSku, locationId },
    });
  }

  @Get('warehouses')
  async listWarehouses() {
    return this.listWarehousesUseCase.execute();
  }
}
