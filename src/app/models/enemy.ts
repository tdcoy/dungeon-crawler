import { LootTable } from "./loot-table";

export interface Enemy{
    name: string;
    icon: string;
    curHealth: number;
    maxHealth: number;
    damage: number;
}