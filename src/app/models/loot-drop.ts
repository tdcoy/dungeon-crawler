import { Item } from './item';

export interface LootDrop {
  item?: Item;
  looted: boolean;
}
