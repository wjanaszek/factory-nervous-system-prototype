import { Module } from '@nestjs/common';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { inventoryTransactionEntity } from '../entities/inventory-transaction.entity';
import { warehouseOperatorEntity } from '../entities/warehouse-operator.entity';
import { warehouseEntity } from '../entities/warehouse.entity';
import { clientEntity } from '../entities/client.entity';
import { InventoryStockRepository } from '../../domain/repositories/inventory-stock.repository';
import { DrizzlePgInventoryStockRepository } from '../repositories/drizzle-pg-inventory-stock.repository';
import { InventoryTransactionLogRepository } from '../../application/repositories/inventory-transaction-log.repository';
import { DrizzlePgInventoryTransactionLogRepository } from '../repositories/drizzle-pg-inventory-transaction-log.repository';
import { ConfigService } from '@nestjs/config';
import { PostgresDb } from './database.const';
import { DrizzlePgWarehouseRepository } from '../repositories/drizzle-pg-warehouse.repository';
import { WarehouseRepository } from '../../application/repositories/warehouse.repository';

@Module({
  imports: [
    DrizzlePostgresModule.registerAsync({
      tag: PostgresDb,
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        const host = config.get('DB_HOST');
        const port = config.get('DB_PORT');
        const user = config.get('DB_USER');
        const password = config.get('DB_PASSWORD');
        const database = config.get('DB_NAME');

        const url = `postgresql://${user}:${password}@${host}:${port}/${database}`;

        return {
          postgres: { url },
          config: {
            schema: [
              clientEntity,
              inventoryTransactionEntity,
              warehouseEntity,
              warehouseOperatorEntity,
            ],
            logger: true,
          },
        };
      },
    }),
  ],
  providers: [
    DrizzlePgInventoryStockRepository,
    DrizzlePgInventoryTransactionLogRepository,
    DrizzlePgWarehouseRepository,
    {
      provide: InventoryStockRepository,
      useClass: DrizzlePgInventoryStockRepository,
    },
    {
      provide: InventoryTransactionLogRepository,
      useClass: DrizzlePgInventoryTransactionLogRepository,
    },
    {
      provide: WarehouseRepository,
      useClass: DrizzlePgWarehouseRepository,
    },
  ],
  exports: [
    DrizzlePostgresModule,
    InventoryStockRepository,
    InventoryTransactionLogRepository,
    WarehouseRepository,
  ],
})
export class DatabaseModule {}
