import { Enemy } from './enemy';
import { LootDrop } from './loot-drop';

export enum NodeContentType {
  Empty,
  Enemy,
  Boss,
  Loot,
  LootDrop,
  Start,
  Grave,
  Exit,
}

export interface NodeContent {
  type: NodeContentType;
  enemy?: Enemy;
  lootDrop?: LootDrop | null;
}
