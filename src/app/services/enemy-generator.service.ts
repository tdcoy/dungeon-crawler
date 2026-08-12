import { Injectable } from '@angular/core';
import { Enemy, EnemyRarity } from '../models/enemy';
import { RandomService } from './random.service';

@Injectable({
  providedIn: 'root',
})
export class EnemyGeneratorService {
  private baseCommonEnemies: Enemy[] = [
    {
      name: 'Slime',
      icon: 'slime',
      curHealth: 18,
      maxHealth: 18,
      damage: 3,
      minSpawnLevel: 1,
      maxSpawnLevel: 5,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Worm',
      icon: 'worm',
      curHealth: 24,
      maxHealth: 24,
      damage: 4,
      minSpawnLevel: 1,
      maxSpawnLevel: 4,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Earwig',
      icon: 'earwig',
      curHealth: 30,
      maxHealth: 30,
      damage: 5,
      minSpawnLevel: 2,
      maxSpawnLevel: 7,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Rat',
      icon: 'rat',
      curHealth: 34,
      maxHealth: 34,
      damage: 6,
      minSpawnLevel: 2,
      maxSpawnLevel: 8,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Frog',
      icon: 'frog',
      curHealth: 40,
      maxHealth: 40,
      damage: 7,
      minSpawnLevel: 3,
      maxSpawnLevel: 9,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Chicken',
      icon: 'chicken',
      curHealth: 46,
      maxHealth: 46,
      damage: 8,
      minSpawnLevel: 4,
      maxSpawnLevel: 8,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Scorpion',
      icon: 'scorpion',
      curHealth: 58,
      maxHealth: 58,
      damage: 10,
      minSpawnLevel: 5,
      maxSpawnLevel: 12,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Eyestalk',
      icon: 'eyestalk',
      curHealth: 72,
      maxHealth: 72,
      damage: 12,
      minSpawnLevel: 7,
      maxSpawnLevel: 16,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Bat',
      icon: 'bat',
      curHealth: 82,
      maxHealth: 82,
      damage: 14,
      minSpawnLevel: 9,
      maxSpawnLevel: 18,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Trilobite',
      icon: 'trilobite',
      curHealth: 105,
      maxHealth: 105,
      damage: 12,
      minSpawnLevel: 11,
      maxSpawnLevel: 20,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Tortoise',
      icon: 'tortoise',
      curHealth: 135,
      maxHealth: 135,
      damage: 10,
      minSpawnLevel: 12,
      maxSpawnLevel: 22,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Spider',
      icon: 'spider',
      curHealth: 115,
      maxHealth: 115,
      damage: 18,
      minSpawnLevel: 14,
      maxSpawnLevel: 23,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Bear',
      icon: 'bear',
      curHealth: 170,
      maxHealth: 170,
      damage: 22,
      minSpawnLevel: 16,
      maxSpawnLevel: 28,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Harpy',
      icon: 'harpy',
      curHealth: 155,
      maxHealth: 155,
      damage: 25,
      minSpawnLevel: 19,
      maxSpawnLevel: 31,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Leech',
      icon: 'leech',
      curHealth: 190,
      maxHealth: 190,
      damage: 20,
      minSpawnLevel: 23,
      maxSpawnLevel: 35,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Gorilla',
      icon: 'gorilla',
      curHealth: 240,
      maxHealth: 240,
      damage: 30,
      minSpawnLevel: 26,
      maxSpawnLevel: 37,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Shrimp',
      icon: 'shrimp',
      curHealth: 275,
      maxHealth: 275,
      damage: 26,
      minSpawnLevel: 30,
      maxSpawnLevel: 43,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Anglerfish',
      icon: 'anglerfish',
      curHealth: 320,
      maxHealth: 320,
      damage: 34,
      minSpawnLevel: 34,
      maxSpawnLevel: 47,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Crab',
      icon: 'crab',
      curHealth: 380,
      maxHealth: 380,
      damage: 28,
      minSpawnLevel: 37,
      maxSpawnLevel: 51,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Manta Ray',
      icon: 'manta-ray',
      curHealth: 350,
      maxHealth: 350,
      damage: 38,
      minSpawnLevel: 39,
      maxSpawnLevel: 53,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Haunting',
      icon: 'haunting',
      curHealth: 300,
      maxHealth: 300,
      damage: 45,
      minSpawnLevel: 41,
      maxSpawnLevel: 53,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Troglodyte',
      icon: 'troglodyte',
      curHealth: 450,
      maxHealth: 450,
      damage: 38,
      minSpawnLevel: 45,
      maxSpawnLevel: 56,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Skeleton',
      icon: 'skeleton',
      curHealth: 400,
      maxHealth: 400,
      damage: 45,
      minSpawnLevel: 48,
      maxSpawnLevel: 59,
      rarity: EnemyRarity.Common,
    },
    {
      name: 'Imp',
      icon: 'imp',
      curHealth: 350,
      maxHealth: 350,
      damage: 55,
      minSpawnLevel: 49,
      maxSpawnLevel: 60,
      rarity: EnemyRarity.Common,
    },
  ];

  private baseUncommonEnemies: Enemy[] = [
    {
      name: 'Bee',
      icon: 'bee',
      curHealth: 42,
      maxHealth: 42,
      damage: 8,
      minSpawnLevel: 2,
      maxSpawnLevel: 9,
      rarity: EnemyRarity.Uncommon,
    },
    {
      name: 'Raven',
      icon: 'raven',
      curHealth: 55,
      maxHealth: 55,
      damage: 11,
      minSpawnLevel: 4,
      maxSpawnLevel: 12,
      rarity: EnemyRarity.Uncommon,
    },
    {
      name: 'Centipede',
      icon: 'centipede',
      curHealth: 125,
      maxHealth: 125,
      damage: 16,
      minSpawnLevel: 10,
      maxSpawnLevel: 20,
      rarity: EnemyRarity.Uncommon,
    },
    {
      name: 'Crawling Corpse',
      icon: 'crawling-corpse',
      curHealth: 165,
      maxHealth: 165,
      damage: 18,
      minSpawnLevel: 15,
      maxSpawnLevel: 24,
      rarity: EnemyRarity.Uncommon,
    },
    {
      name: 'Spirit Jar',
      icon: 'spirit-jar',
      curHealth: 145,
      maxHealth: 145,
      damage: 25,
      minSpawnLevel: 20,
      maxSpawnLevel: 32,
      rarity: EnemyRarity.Uncommon,
    },
    {
      name: 'Cyclops',
      icon: 'cyclops',
      curHealth: 300,
      maxHealth: 300,
      damage: 32,
      minSpawnLevel: 25,
      maxSpawnLevel: 40,
      rarity: EnemyRarity.Uncommon,
    },
    {
      name: 'Floating Tenticles',
      icon: 'floating-tenticles',
      curHealth: 270,
      maxHealth: 270,
      damage: 35,
      minSpawnLevel: 30,
      maxSpawnLevel: 44,
      rarity: EnemyRarity.Uncommon,
    },
    {
      name: 'Fangs',
      icon: 'fangs',
      curHealth: 330,
      maxHealth: 330,
      damage: 42,
      minSpawnLevel: 35,
      maxSpawnLevel: 48,
      rarity: EnemyRarity.Uncommon,
    },
    {
      name: 'Waning Crescent',
      icon: 'waning-crescent',
      curHealth: 400,
      maxHealth: 400,
      damage: 48,
      minSpawnLevel: 40,
      maxSpawnLevel: 55,
      rarity: EnemyRarity.Uncommon,
    },
    {
      name: 'Zombie',
      icon: 'zombie',
      curHealth: 500,
      maxHealth: 500,
      damage: 42,
      minSpawnLevel: 45,
      maxSpawnLevel: 60,
      rarity: EnemyRarity.Uncommon,
    },
  ];

  private baseRareEnemies: Enemy[] = [
    {
      name: 'Axolotl',
      icon: 'axolotl',
      curHealth: 70,
      maxHealth: 70,
      damage: 12,
      minSpawnLevel: 5,
      maxSpawnLevel: 14,
      rarity: EnemyRarity.Rare,
    },
    {
      name: 'Elephant',
      icon: 'elephant',
      curHealth: 230,
      maxHealth: 230,
      damage: 24,
      minSpawnLevel: 15,
      maxSpawnLevel: 24,
      rarity: EnemyRarity.Rare,
    },
    {
      name: 'Golem',
      icon: 'golem',
      curHealth: 420,
      maxHealth: 420,
      damage: 35,
      minSpawnLevel: 25,
      maxSpawnLevel: 34,
      rarity: EnemyRarity.Rare,
    },
    {
      name: 'Gluttonous Smile',
      icon: 'gluttonous-smile',
      curHealth: 450,
      maxHealth: 450,
      damage: 48,
      minSpawnLevel: 35,
      maxSpawnLevel: 44,
      rarity: EnemyRarity.Rare,
    },
    {
      name: 'Living Mass',
      icon: 'living-mass',
      curHealth: 650,
      maxHealth: 650,
      damage: 55,
      minSpawnLevel: 45,
      maxSpawnLevel: 60,
      rarity: EnemyRarity.Rare,
    },
  ];

  private baseBossEnemies: Enemy[] = [
    {
      name: 'Maggot',
      icon: 'maggot',
      curHealth: 100,
      maxHealth: 100,
      damage: 10,
      minSpawnLevel: 3,
      maxSpawnLevel: 3,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Imprisoned Insect',
      icon: 'imprisoned-insect',
      curHealth: 150,
      maxHealth: 150,
      damage: 14,
      minSpawnLevel: 6,
      maxSpawnLevel: 6,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Barnacle',
      icon: 'barnacle',
      curHealth: 210,
      maxHealth: 210,
      damage: 18,
      minSpawnLevel: 9,
      maxSpawnLevel: 9,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Blazing Eye',
      icon: 'blazing-eye',
      curHealth: 260,
      maxHealth: 260,
      damage: 24,
      minSpawnLevel: 12,
      maxSpawnLevel: 12,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Living Tree',
      icon: 'living-tree',
      curHealth: 350,
      maxHealth: 350,
      damage: 25,
      minSpawnLevel: 15,
      maxSpawnLevel: 15,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Living Earth',
      icon: 'living-earth',
      curHealth: 430,
      maxHealth: 430,
      damage: 30,
      minSpawnLevel: 18,
      maxSpawnLevel: 18,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Living Stone',
      icon: 'living-stone',
      curHealth: 520,
      maxHealth: 520,
      damage: 34,
      minSpawnLevel: 21,
      maxSpawnLevel: 21,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Corrupted Mask',
      icon: 'corrupted-mask',
      curHealth: 480,
      maxHealth: 480,
      damage: 42,
      minSpawnLevel: 24,
      maxSpawnLevel: 24,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Possessed Tome',
      icon: 'possessed-tome',
      curHealth: 550,
      maxHealth: 550,
      damage: 48,
      minSpawnLevel: 27,
      maxSpawnLevel: 27,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Man O War',
      icon: 'man-o-war',
      curHealth: 650,
      maxHealth: 650,
      damage: 45,
      minSpawnLevel: 30,
      maxSpawnLevel: 30,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Giant Squid',
      icon: 'giant-squid',
      curHealth: 750,
      maxHealth: 750,
      damage: 52,
      minSpawnLevel: 33,
      maxSpawnLevel: 33,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Sea Serpent',
      icon: 'sea-serpent',
      curHealth: 850,
      maxHealth: 850,
      damage: 58,
      minSpawnLevel: 36,
      maxSpawnLevel: 36,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Starving Shark',
      icon: 'starving-shark',
      curHealth: 780,
      maxHealth: 780,
      damage: 68,
      minSpawnLevel: 39,
      maxSpawnLevel: 39,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Gargoyle',
      icon: 'gargoyle',
      curHealth: 950,
      maxHealth: 950,
      damage: 62,
      minSpawnLevel: 42,
      maxSpawnLevel: 42,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Ogre',
      icon: 'ogre',
      curHealth: 1100,
      maxHealth: 1100,
      damage: 72,
      minSpawnLevel: 45,
      maxSpawnLevel: 45,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Behold',
      icon: 'behold',
      curHealth: 1000,
      maxHealth: 1000,
      damage: 85,
      minSpawnLevel: 48,
      maxSpawnLevel: 48,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Mimic',
      icon: 'mimic',
      curHealth: 1150,
      maxHealth: 1150,
      damage: 78,
      minSpawnLevel: 51,
      maxSpawnLevel: 51,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Tormented Soul',
      icon: 'tormented-soul',
      curHealth: 1250,
      maxHealth: 1250,
      damage: 92,
      minSpawnLevel: 54,
      maxSpawnLevel: 54,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Delighted Grin',
      icon: 'delighted-grin',
      curHealth: 1400,
      maxHealth: 1400,
      damage: 100,
      minSpawnLevel: 57,
      maxSpawnLevel: 57,
      rarity: EnemyRarity.Boss,
    },
    {
      name: 'Demonic Skull',
      icon: 'demonic-skull',
      curHealth: 1600,
      maxHealth: 1600,
      damage: 115,
      minSpawnLevel: 60,
      maxSpawnLevel: 60,
      rarity: EnemyRarity.Boss,
    },
  ];

  private allBaseEnemies: Enemy[] = [
    ...this.baseCommonEnemies,
    ...this.baseUncommonEnemies,
    ...this.baseRareEnemies,
  ];

  constructor(private random: RandomService) {}

  generateRandomEnemy(level: number): Enemy {
    const candidates = this.allBaseEnemies.filter(
      (enemy) => level >= enemy.minSpawnLevel && level <= enemy.maxSpawnLevel,
    );

    if (candidates.length === 0) {
      throw new Error(`No enemies available for level ${level}`);
    }

    const weightedCandidates = candidates.map((enemy) => {
      const rarityWeight = this.getRarityWeight(enemy.rarity);

      // Distance from the center of the enemy's spawn range
      const spawnCenter = (enemy.minSpawnLevel + enemy.maxSpawnLevel) / 2;

      const distance = Math.abs(level - spawnCenter);

      // Controls how quickly probability falls off with distance
      const levelWeight = Math.exp(-(distance * distance) / (2 * 5 * 5));

      return {
        enemy,
        weight: levelWeight * rarityWeight,
      };
    });

    const selected = this.weightedRandom(weightedCandidates);

    const enemy: Enemy = {
      ...selected,
    };

    const healthVariation = Math.round(enemy.maxHealth * (this.random.nextInt(-10, 10) / 100));
    enemy.maxHealth += healthVariation;
    enemy.curHealth = enemy.maxHealth;

    const damageVariation = Math.round(enemy.damage * (this.random.nextInt(-10, 10) / 100));
    enemy.damage += damageVariation;

    return enemy;
  }

  generateRandomBoss(level: number): Enemy {
    const baseEnemy = this.baseBossEnemies.find((enemy) => enemy.minSpawnLevel === level);

    if (!baseEnemy) {
      throw new Error(`No boss found for level ${level}`);
    }

    const enemy: Enemy = {
      ...baseEnemy,
    };

    enemy.curHealth = enemy.maxHealth;

    return enemy;
  }

  private getRarityWeight(rarity: EnemyRarity): number {
    switch (rarity) {
      case EnemyRarity.Common:
        return 1.0;

      case EnemyRarity.Uncommon:
        return 0.35;

      case EnemyRarity.Rare:
        return 0.1;

      default:
        return 0;
    }
  }

  private weightedRandom(candidates: { enemy: Enemy; weight: number }[]): Enemy {
    const totalWeight = candidates.reduce((sum, candidate) => sum + candidate.weight, 0);

    let random = this.random.nextFloat() * totalWeight;

    for (const candidate of candidates) {
      random -= candidate.weight;

      if (random <= 0) {
        return candidate.enemy;
      }
    }

    return candidates[candidates.length - 1].enemy;
  }
}
