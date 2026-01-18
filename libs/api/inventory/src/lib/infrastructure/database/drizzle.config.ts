import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './libs/api/inventory/src/lib/infrastructure/entities/*.entity.ts',
  out: './libs/api/inventory/src/lib/infrastructure/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
