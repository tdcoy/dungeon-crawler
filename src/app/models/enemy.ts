export enum EnemyRarity {
  Common,
  Uncommon,
  Rare,
  Boss
}

export interface Enemy {
  name: string;
  icon: string;
  curHealth: number;
  maxHealth: number;
  damage: number;
  minSpawnLevel: number;
  maxSpawnLevel: number;
  rarity: EnemyRarity;
}
