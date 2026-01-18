import { UseCase } from '../../shared/use-case';
import { Injectable } from '@nestjs/common';
import { WarehouseRepository } from '../../repositories/warehouse.repository';

@Injectable()
export class ListWarehousesUseCase implements UseCase<void, any> {
  constructor(private readonly warehouseRepository: WarehouseRepository) {}

  async execute(): Promise<any> {
    return this.warehouseRepository.list();
  }
}
