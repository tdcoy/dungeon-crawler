import { Item } from './item';

export enum LootDropType {
  Grave,
  Health,
  Gold,
  LargeChest,
  SmallChest,
}

export interface LootDrop {
  type: LootDropType;
  loot?: Item;
  quantity?: number;
  looted: boolean;
}
