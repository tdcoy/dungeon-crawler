import { GraphNode } from './graph-node';
import { Item } from './item';

export interface Player {
    curHealth: number;
    maxHealth: number;
    damage: number;
    inventory: Item[];
}