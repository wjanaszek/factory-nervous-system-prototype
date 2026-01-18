export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface Warehouse {
  id: string;
  name: string;
  stocks?: StockItem[];
}

export interface StockItem {
  id: string;
  itemSku: string;
  quantity: number;
  locationId: string;
}

export interface TransferRequest {
  itemSku: string;
  fromLocationId: string;
  toLocationId: string;
  quantity: number;
  operatorId: string;
}

export interface DeliverRequest {
  itemSku: string;
  locationId: string;
  quantity: number;
  operatorId: string;
}
