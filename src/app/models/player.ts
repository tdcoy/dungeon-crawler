import { GraphNode } from './graph-node';
import { Item } from './item';

export interface Player {
  curHealth: number;
  maxHealth: number;
  armor: number;
  damage: number;
  gold: number;
  inventory: Item[];
}
