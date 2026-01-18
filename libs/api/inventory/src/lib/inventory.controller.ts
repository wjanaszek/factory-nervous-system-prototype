import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
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
    const result = await this.deliverToWarehouseUseCase.execute({ body });

    if (result.isFailure) {
      throw new HttpException(
        result.error || 'Failed to deliver to warehouse',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      success: true,
      data: result.getValue(),
    };
  }

  @Post('transfer-between-warehouses')
  async transferBetweenWarehouses(@Body() body: TransferBetweenWarehousesBody) {
    const result = await this.transferBetweenWarehousesUseCase.execute({
      body,
    });

    if (result.isFailure) {
      throw new HttpException(
        result.error || 'Failed to transfer',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      success: true,
      data: result.getValue(),
    };
  }

  @Get('stock/:itemSku/:locationId')
  async listStockFor(
    @Param('itemSku') itemSku: string,
    @Param('locationId') locationId: string
  ) {
    const result = await this.listStockForItemInLocationUseCase.execute({
      body: { itemSku, locationId },
    });

    if (result.isFailure) {
      throw new HttpException(
        result.error || 'Failed to get stock',
        HttpStatus.NOT_FOUND
      );
    }

    return {
      success: true,
      data: result.getValue(),
    };
  }

  @Get('warehouses')
  async listWarehouses() {
    return this.listWarehousesUseCase.execute();
  }
}
