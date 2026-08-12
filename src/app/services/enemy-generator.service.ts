import { Injectable } from '@angular/core';
import { Enemy } from '../models/enemy';
import { RandomService } from './random.service';

@Injectable({
  providedIn: 'root',
})
export class EnemyGeneratorService {
  private baseEnemies: Enemy[] = [
    {
      name: 'Goblin',
      icon: 'goblin',
      curHealth: 15,
      maxHealth: 15,
      damage: 3,
    },

    {
      name: 'Skeleton',
      icon: 'skeleton',
      curHealth: 20,
      maxHealth: 20,
      damage: 4,
    },

    {
      name: 'Troglodyte',
      icon: 'troglodyte',
      curHealth: 25,
      maxHealth: 25,
      damage: 5,
    },

    {
      name: 'Cyclops',
      icon: 'cyclops',
      curHealth: 35,
      maxHealth: 35,
      damage: 7,
    },
  ];

  private baseBosses: Enemy[] = [
    {
      name: 'Demon',
      icon: 'boss-demon',
      curHealth: 60,
      maxHealth: 60,
      damage: 8,
    },
  ];

  constructor(private random: RandomService) {}

  generateRandomEnemy(level: number): Enemy {
    const index = this.random.nextInt(0, this.baseEnemies.length - 1);
    const baseEnemy = this.baseEnemies[index];
    const enemy: Enemy = {
      ...baseEnemy,
    };

    const healthVariation = Math.round(enemy.maxHealth * (this.random.nextInt(-10, 10) / 100));
    enemy.maxHealth += healthVariation;
    enemy.curHealth = enemy.maxHealth;

    const damageVariation = Math.round(enemy.damage * (this.random.nextInt(-10, 10) / 100));
    enemy.damage += damageVariation;

    return enemy;
  }

  generateRandomBoss(level: number): Enemy {
    const index = this.random.nextInt(0, this.baseBosses.length - 1);
    const baseEnemy = this.baseBosses[index];
    const enemy: Enemy = {
      ...baseEnemy,
    };

    return enemy;
  }
}
