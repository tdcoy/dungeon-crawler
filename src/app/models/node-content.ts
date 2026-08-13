import { Enemy } from './enemy';
import { LootDrop } from './loot-drop';
import { Item } from './item';

export enum NodeContentType {
  Empty,
  Enemy,
  Boss,
  Loot,
  LootDrop,
  Start,
  Grave,
  Exit,
  Merchant,
}

export interface NodeContent {
  type: NodeContentType;
  enemy?: Enemy;
  lootDrop?: LootDrop | null;
  inventory?: Item[];
}
