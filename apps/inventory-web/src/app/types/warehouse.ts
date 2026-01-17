import { Id } from './id';

export interface Item {
  id: Id;
  name: string;
  quantity: number;
}

export interface Location {
  id: Id;
  name: string;
  items: Item[];
}

export interface TransferRequest {
  itemId: Id;
  sourceLocationId: string;
  targetLocationId: string;
  quantity: number;
}
