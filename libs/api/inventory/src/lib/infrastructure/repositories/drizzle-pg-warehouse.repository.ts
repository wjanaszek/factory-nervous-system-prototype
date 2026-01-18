import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { WarehouseRepository } from '../../application/repositories/warehouse.repository';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresDb } from '../database/database.const';
import { warehouseEntity } from '../entities/warehouse.entity';

@Injectable()
export class DrizzlePgWarehouseRepository implements WarehouseRepository {
  constructor(@Inject(PostgresDb) private readonly db: NodePgDatabase) {}

  async list(): Promise<any> {
    const result = await this.db.select().from(warehouseEntity);

    return result;
  }
}
