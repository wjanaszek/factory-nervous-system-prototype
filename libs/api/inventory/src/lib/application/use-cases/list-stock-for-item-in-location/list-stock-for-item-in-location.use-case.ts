import { UseCase } from '../../shared/use-case';
import { Injectable } from '@nestjs/common';
import { Result } from '../../../domain/shared/result';
import { ListStockForItemInLocationBody } from './list-stock-for-item-in-location.body';
import { InventoryStockRepository } from '../../../domain/repositories/inventory-stock.repository';
import { ItemSkuVO } from '../../../domain/value-objects/item-sku.value-object';

type ListStockForItemInLocationInput = {
  body: ListStockForItemInLocationBody;
};

@Injectable()
export class ListStockForItemInLocationUseCase
  implements UseCase<ListStockForItemInLocationInput, Result<any>>
{
  constructor(
    private readonly inventoryStockRepository: InventoryStockRepository
  ) {}

  async execute({
    body,
  }: ListStockForItemInLocationInput): Promise<Result<any>> {
    try {
      const data = await this.inventoryStockRepository.findBySkuAndWarehouse(
        ItemSkuVO.create(body.itemSku),
        body.locationId
      );

      return Result.ok(data);
    } catch (e) {
      return Result.fail(e as string);
    }
  }
}
