import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InventoryModule } from '@org/inventory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    InventoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
