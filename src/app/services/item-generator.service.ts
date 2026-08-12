import { Injectable } from '@angular/core';
import {
  Item,
  LootType,
  Weapon,
  Armor,
  Consumable,
  ItemRarity,
  WeaponType,
  ArmorType,
  WeaponDefinition,
  ConsumableDefinition,
} from '../models/item';
import { RandomService } from './random.service';

@Injectable({
  providedIn: 'root',
})
export class ItemGeneratorService {
  private readonly minRoll = -3;
  private readonly maxRoll = 5;

  private nextItemId = 1;

  private swordDefinitions: WeaponDefinition[] = [
    {
      name: 'Iron Sword',
      icon: 'iron-sword',
      value: 5,
      type: LootType.Weapon,
      weaponType: WeaponType.Sword,
      minQuality: 0,
      maxQuality: 20,
      minDamage: 5,
      maxDamage: 12,
    },

    {
      name: 'Broadsword',
      icon: 'broadsword',
      value: 12,
      type: LootType.Weapon,
      weaponType: WeaponType.Sword,
      minQuality: 20,
      maxQuality: 40,
      minDamage: 8,
      maxDamage: 18,
    },

    {
      name: 'Shark Tooth Sword',
      icon: 'shark-tooth-sword',
      value: 20,
      type: LootType.Weapon,
      weaponType: WeaponType.Sword,
      minQuality: 40,
      maxQuality: 60,
      minDamage: 12,
      maxDamage: 25,
    },

    {
      name: 'Elemental Sword',
      icon: 'elemental-sword',
      value: 35,
      type: LootType.Weapon,
      weaponType: WeaponType.Sword,
      minQuality: 60,
      maxQuality: 80,
      minDamage: 18,
      maxDamage: 35,
    },

    {
      name: 'Cursed Sword',
      icon: 'cursed-sword',
      value: 50,
      type: LootType.Weapon,
      weaponType: WeaponType.Sword,
      minQuality: 80,
      maxQuality: 100,
      minDamage: 25,
      maxDamage: 50,
    },
  ];

  private daggerDefinitions: WeaponDefinition[] = [
    {
      name: 'Bone Dagger',
      icon: 'bone-dagger',
      value: 3,
      type: LootType.Weapon,
      weaponType: WeaponType.Dagger,
      minQuality: 0,
      maxQuality: 15,
      minDamage: 5,
      maxDamage: 10,
    },

    {
      name: 'Iron Dagger',
      icon: 'iron-dagger',
      value: 7,
      type: LootType.Weapon,
      weaponType: WeaponType.Dagger,
      minQuality: 15,
      maxQuality: 32,
      minDamage: 7,
      maxDamage: 15,
    },

    {
      name: 'Curved Dagger',
      icon: 'curved-dagger',
      value: 12,
      type: LootType.Weapon,
      weaponType: WeaponType.Dagger,
      minQuality: 32,
      maxQuality: 46,
      minDamage: 13,
      maxDamage: 24,
    },

    {
      name: 'Broad Dagger',
      icon: 'broad-dagger',
      value: 24,
      type: LootType.Weapon,
      weaponType: WeaponType.Dagger,
      minQuality: 46,
      maxQuality: 68,
      minDamage: 18,
      maxDamage: 35,
    },

    {
      name: 'Sacrificial Dagger',
      icon: 'sacrificial-dagger',
      value: 30,
      type: LootType.Weapon,
      weaponType: WeaponType.Dagger,
      minQuality: 68,
      maxQuality: 82,
      minDamage: 28,
      maxDamage: 51,
    },

    {
      name: 'Cursed Dagger',
      icon: 'cursed-dagger',
      value: 35,
      type: LootType.Weapon,
      weaponType: WeaponType.Sword,
      minQuality: 82,
      maxQuality: 100,
      minDamage: 35,
      maxDamage: 65,
    },
  ];

  private axesDefinitions: WeaponDefinition[] = [
    {
      name: 'Stone Axe',
      icon: 'stone-axe',
      value: 3,
      type: LootType.Weapon,
      weaponType: WeaponType.Axe,
      minQuality: 0,
      maxQuality: 20,
      minDamage: 5,
      maxDamage: 11,
    },

    {
      name: 'Iron Axe',
      icon: 'iron-axe',
      value: 10,
      type: LootType.Weapon,
      weaponType: WeaponType.Axe,
      minQuality: 20,
      maxQuality: 40,
      minDamage: 8,
      maxDamage: 17,
    },

    {
      name: 'Battleaxe',
      icon: 'iron-battle-axe',
      value: 19,
      type: LootType.Weapon,
      weaponType: WeaponType.Axe,
      minQuality: 40,
      maxQuality: 60,
      minDamage: 13,
      maxDamage: 26,
    },

    {
      name: 'War Axe',
      icon: 'war-axe',
      value: 29,
      type: LootType.Weapon,
      weaponType: WeaponType.Axe,
      minQuality: 60,
      maxQuality: 80,
      minDamage: 23,
      maxDamage: 39,
    },

    {
      name: 'Elemental Axe',
      icon: 'elemental-axe',
      value: 50,
      type: LootType.Weapon,
      weaponType: WeaponType.Axe,
      minQuality: 80,
      maxQuality: 100,
      minDamage: 31,
      maxDamage: 52,
    },
  ];

  private consumableDefinitions: ConsumableDefinition[] = [
    {
      name: 'Healing Root',
      icon: 'healing-root',
      type: LootType.Consumable,
      value: 10,
      healing: 0.15,
    },

    {
      name: 'Health Bottle',
      icon: 'heart-bottle',
      type: LootType.Consumable,
      value: 10,
      healing: 0.25,
    },
  ];

  private weaponDefinitions: WeaponDefinition[] = [
    ...this.swordDefinitions,
    ...this.daggerDefinitions,
    ...this.axesDefinitions,
  ];

  constructor(private random: RandomService) {}

  generateWeapon(level: number): Weapon {
    // 1. Roll quality based on the current map level
    const quality = this.generateQuality(level);

    // 2. Pick weapon type
    const weaponType = this.generateWeaponType();

    // 3. Find weapons of this type that fit the quality
    const possibleWeapons = this.weaponDefinitions.filter(
      (weapon) =>
        weapon.weaponType === weaponType &&
        quality >= weapon.minQuality &&
        quality <= weapon.maxQuality,
    );

    // 4. Pick one of the possible weapons
    const index = this.random.nextInt(0, possibleWeapons.length - 1);
    const definition = possibleWeapons[index];

    // 5. Rarity is completely independent of quality
    const rarity = this.generateRarity(level);

    // 6. Determine where within the weapon's stat range the rarity puts us.
    const [minMultiplier, maxMultiplier] = this.getRarityRange(rarity);

    const rarityRoll = this.random.nextFloat();

    const multiplier = minMultiplier + (maxMultiplier - minMultiplier) * rarityRoll;

    // 7. Calculate damage
    const damage = Math.round(
      definition.minDamage + (definition.maxDamage - definition.minDamage) * rarityRoll,
    );

    // Apply rarity
    const finalDamage = Math.round(damage * multiplier);

    // 8. Calculate value
    const value = Math.round(definition.value * multiplier);

    return {
      name: definition.name,
      itemId: this.generateItemId(),
      icon: definition.icon,
      type: LootType.Weapon,
      weaponType: definition.weaponType,
      rarity: rarity,
      quality: quality,
      damage: finalDamage,
      value: value,
      equipped: false,
    };
  }

  private generateItemId(): number {
    return this.nextItemId++;
  }

  generateRandomGold(level: number): Item {
    const minGold = 5 + (level - 1) * 3;
    const maxGold = 10 + (level - 1) * 5;

    const gold: Item = {
      name: 'Gold Coin',
      itemId: this.generateItemId(),
      icon: 'crown-coin',
      type: LootType.Gold,
      value: this.random.nextInt(minGold, maxGold),
    };

    return gold;
  }

  generateRandomHealth(): Item {
    const index = Math.floor(this.random.nextFloat() * this.consumableDefinitions.length);
    const item = this.consumableDefinitions[index];
    const consumable: Consumable = {
      name: item.name,
      itemId: this.generateItemId(),
      icon: item.icon,
      value: item.value,
      type: item.type,
      healing: item.healing,
    };

    return consumable;
  }

  private generateLootType(): LootType {
    const roll = this.random.nextFloat();

    if (roll < 0.35) {
      return LootType.Weapon;
    }

    if (roll < 0.6) {
      return LootType.Armor;
    }

    if (roll < 0.85) {
      return LootType.Consumable;
    }

    return LootType.Gold;
  }

  private generateWeaponType(): WeaponType {
    const roll = this.random.nextFloat();

    if (roll < 0.3) {
      return WeaponType.Dagger;
    }

    if (roll < 0.6) {
      return WeaponType.Sword;
    }

    return WeaponType.Axe;
  }

  private getRarityRange(rarity: ItemRarity): [number, number] {
    switch (rarity) {
      case ItemRarity.Common:
        return [0.8, 1.0];

      case ItemRarity.Uncommon:
        return [0.95, 1.15];

      case ItemRarity.Rare:
        return [1.1, 1.3];

      case ItemRarity.Epic:
        return [1.25, 1.5];

      case ItemRarity.Legendary:
        return [1.45, 1.8];
    }
  }

  private generateQuality(level: number): number {
    const mean = Math.min(100, 10 + level * 1.5);
    const standardDeviation = 15;

    const quality = this.random.nextNormal(mean, standardDeviation);

    return Math.max(0, Math.min(100, quality));
  }

  private generateRarity(level: number): ItemRarity {
    const legendaryChance = Math.min(0.02 + level * 0.002, 0.15);
    const epicChance = Math.min(0.03 + level * 0.004, 0.27);
    const rareChance = 0.3;
    const uncommonChance = 0.2;

    const roll = this.random.nextFloat();

    if (roll < legendaryChance) {
      return ItemRarity.Legendary;
    }

    if (roll < legendaryChance + epicChance) {
      return ItemRarity.Epic;
    }

    if (roll < legendaryChance + epicChance + rareChance) {
      return ItemRarity.Rare;
    }

    if (roll < legendaryChance + epicChance + rareChance + uncommonChance) {
      return ItemRarity.Uncommon;
    }

    return ItemRarity.Common;
  }
}
