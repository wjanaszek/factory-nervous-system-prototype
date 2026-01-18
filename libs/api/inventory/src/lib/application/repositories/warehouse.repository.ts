export interface Warehouse {
  id: string;
  name: string;
}

export abstract class WarehouseRepository {
  abstract list(): Promise<Warehouse[]>;
}
