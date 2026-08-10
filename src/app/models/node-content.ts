import { Enemy } from './enemy';
import { LootDrop } from './loot-drop';

export enum NodeContentType {
  Empty,
  Enemy,
  Gold,
  Health,
  Mana,
  Boss,
  Start,
  ChestSmall,
  ChestLarge,
}

export interface NodeContent {
  type: NodeContentType;
  enemy?: Enemy;
  lootDrop?: LootDrop;
}
