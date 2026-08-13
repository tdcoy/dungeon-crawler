import { Injectable } from '@angular/core';
import { Item, ItemRarity } from '../models/item';
import { RandomService } from './random.service';
import {
  WeaponDefinition,
  ConsumableDefinition,
  ArmorDefinition,
} from '../models/item-definitions';
import {
  WeaponType,
  EquippableItemComponent,
  DamageableItemComponent,
  ConsumableItemComponent,
  ArmorItemComponent,
  EquipmentSlot,
  CurrencyItemComponent,
  CurrencyType,
  SellableItemComponent,
} from '../models/item-component';

@Injectable({
  providedIn: 'root',
})
export class ItemGeneratorService {
  private nextItemId = 1;

  private swordDefinitions: WeaponDefinition[] = [
    {
      name: 'Iron Sword',
      icon: 'iron-sword',
      sellValue: 5,
      buyValue: 10,
      weaponType: WeaponType.Sword,
      minQuality: 0,
      maxQuality: 20,
      minDamage: 5,
      maxDamage: 12,
    },

    {
      name: 'Broadsword',
      icon: 'broadsword',
      sellValue: 12,
      buyValue: 20,
      weaponType: WeaponType.Sword,
      minQuality: 20,
      maxQuality: 40,
      minDamage: 8,
      maxDamage: 18,
    },

    {
      name: 'Shark Tooth Sword',
      icon: 'shark-tooth-sword',
      sellValue: 20,
      buyValue: 35,
      weaponType: WeaponType.Sword,
      minQuality: 40,
      maxQuality: 60,
      minDamage: 12,
      maxDamage: 25,
    },

    {
      name: 'Elemental Sword',
      icon: 'elemental-sword',
      sellValue: 35,
      buyValue: 50,
      weaponType: WeaponType.Sword,
      minQuality: 60,
      maxQuality: 80,
      minDamage: 18,
      maxDamage: 35,
    },

    {
      name: 'Cursed Sword',
      icon: 'cursed-sword',
      sellValue: 50,
      buyValue: 76,
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
      sellValue: 3,
      buyValue: 7,
      weaponType: WeaponType.Dagger,
      minQuality: 0,
      maxQuality: 15,
      minDamage: 5,
      maxDamage: 10,
    },

    {
      name: 'Iron Dagger',
      icon: 'iron-dagger',
      sellValue: 7,
      buyValue: 12,
      weaponType: WeaponType.Dagger,
      minQuality: 15,
      maxQuality: 32,
      minDamage: 7,
      maxDamage: 15,
    },

    {
      name: 'Curved Dagger',
      icon: 'curved-dagger',
      sellValue: 12,
      buyValue: 22,
      weaponType: WeaponType.Dagger,
      minQuality: 32,
      maxQuality: 46,
      minDamage: 13,
      maxDamage: 24,
    },

    {
      name: 'Broad Dagger',
      icon: 'broad-dagger',
      sellValue: 24,
      buyValue: 35,
      weaponType: WeaponType.Dagger,
      minQuality: 46,
      maxQuality: 68,
      minDamage: 18,
      maxDamage: 35,
    },

    {
      name: 'Sacrificial Dagger',
      icon: 'sacrificial-dagger',
      sellValue: 30,
      buyValue: 55,
      weaponType: WeaponType.Dagger,
      minQuality: 68,
      maxQuality: 82,
      minDamage: 28,
      maxDamage: 51,
    },

    {
      name: 'Cursed Dagger',
      icon: 'cursed-dagger',
      sellValue: 45,
      buyValue: 78,
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
      sellValue: 3,
      buyValue: 6,
      weaponType: WeaponType.Axe,
      minQuality: 0,
      maxQuality: 20,
      minDamage: 5,
      maxDamage: 11,
    },

    {
      name: 'Iron Axe',
      icon: 'iron-axe',
      sellValue: 10,
      buyValue: 18,
      weaponType: WeaponType.Axe,
      minQuality: 20,
      maxQuality: 40,
      minDamage: 8,
      maxDamage: 17,
    },

    {
      name: 'Battleaxe',
      icon: 'iron-battle-axe',
      sellValue: 19,
      buyValue: 26,
      weaponType: WeaponType.Axe,
      minQuality: 40,
      maxQuality: 60,
      minDamage: 13,
      maxDamage: 26,
    },

    {
      name: 'War Axe',
      icon: 'war-axe',
      sellValue: 29,
      buyValue: 49,
      weaponType: WeaponType.Axe,
      minQuality: 60,
      maxQuality: 80,
      minDamage: 23,
      maxDamage: 39,
    },

    {
      name: 'Elemental Axe',
      icon: 'elemental-axe',
      sellValue: 50,
      buyValue: 78,
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
      sellValue: 10,
      buyValue: 25,
      healing: 0.15,
    },

    {
      name: 'Health Bottle',
      icon: 'heart-bottle',
      sellValue: 15,
      buyValue: 40,
      healing: 0.25,
    },
  ];

  private armorDefinitions: ArmorDefinition[] = [
    {
      name: 'Cloth Armor',
      icon: 'cloth-armor',
      minQuality: 0,
      maxQuality: 15,
      minArmor: 1,
      maxArmor: 8,
      sellValue: 1,
      buyValue: 5,
    },

    {
      name: 'Leather Armor',
      icon: 'leather-armor',
      minQuality: 5,
      maxQuality: 22,
      minArmor: 5,
      maxArmor: 12,
      sellValue: 7,
      buyValue: 18,
    },

    {
      name: 'Chainmail Armor',
      icon: 'chain-mail',
      minQuality: 12,
      maxQuality: 26,
      minArmor: 12,
      maxArmor: 25,
      sellValue: 15,
      buyValue: 30,
    },

    {
      name: 'Padded Armor',
      icon: 'padded-armor',
      minQuality: 18,
      maxQuality: 30,
      minArmor: 15,
      maxArmor: 32,
      sellValue: 20,
      buyValue: 42,
    },

    {
      name: 'Plate Armor',
      icon: 'plate-armor',
      minQuality: 21,
      maxQuality: 50,
      minArmor: 20,
      maxArmor: 50,
      sellValue: 25,
      buyValue: 60,
    },
  ];

  private weaponDefinitions: WeaponDefinition[] = [
    ...this.swordDefinitions,
    ...this.daggerDefinitions,
    ...this.axesDefinitions,
  ];

  constructor(private random: RandomService) {}

  generateRandomEquipment(level: number): Item {
    const roll = this.random.nextBool();
    if (roll) {
      return this.generateArmorItem(level);
    }
    return this.generateWeapon(level);
  }

  generateWeapon(level: number): Item {
    // Roll quality based on the current map level
    const quality = this.generateQuality(level);

    // Pick weapon type
    const weaponType = this.generateWeaponType();

    // Find weapons of this type that fit the quality
    const possibleWeapons = this.weaponDefinitions.filter(
      (weapon) =>
        weapon.weaponType === weaponType &&
        quality >= weapon.minQuality &&
        quality <= weapon.maxQuality,
    );

    // Pick one of the possible weapons
    const index = this.random.nextInt(0, possibleWeapons.length - 1);
    const definition = possibleWeapons[index];

    // Rarity is completely independent of quality
    const rarity = this.generateRarity(level);

    // Determine where within the weapon's stat range the rarity puts us.
    const [minMultiplier, maxMultiplier] = this.getRarityRange(rarity);

    const rarityRoll = this.random.nextFloat();

    const multiplier = minMultiplier + (maxMultiplier - minMultiplier) * rarityRoll;

    // Calculate damage
    const damage = Math.round(
      definition.minDamage + (definition.maxDamage - definition.minDamage) * rarityRoll,
    );

    // Apply rarity
    const finalDamage = Math.round(damage * multiplier);

    // Calculate value
    const value = Math.round(definition.sellValue * multiplier);

    // Construct Item
    const equipableItemComponent = new EquippableItemComponent(
      false,
      EquipmentSlot.Weapon,
      quality,
      rarity,
    );

    const damagableItemComponent = new DamageableItemComponent(finalDamage, weaponType);

    const sellableItemComponent = new SellableItemComponent(definition.buyValue, value);

    const weapon = new Item(definition.name, this.generateItemId(), definition.icon, [
      equipableItemComponent,
      damagableItemComponent,
      sellableItemComponent,
    ]);

    return weapon;
  }

  generateArmorItem(level: number): Item {
    // Roll quality based on the current map level
    const quality = this.generateQuality(level);

    // Pick one of the possible weapons
    const index = this.random.nextInt(0, this.armorDefinitions.length - 1);
    const definition = this.armorDefinitions[index];

    // Rarity is completely independent of quality
    const rarity = this.generateRarity(level);

    // Determine where within the weapon's stat range the rarity puts us.
    const [minMultiplier, maxMultiplier] = this.getRarityRange(rarity);

    const rarityRoll = this.random.nextFloat();

    const multiplier = minMultiplier + (maxMultiplier - minMultiplier) * rarityRoll;

    // Calculate damage
    const armor = Math.round(
      definition.minArmor + (definition.maxArmor - definition.maxArmor) * rarityRoll,
    );

    // Apply rarity
    const finalArmor = Math.round(armor * multiplier);

    // Calculate value
    const value = Math.round(definition.sellValue * multiplier);

    // Construct Item
    const equipableItemComponent = new EquippableItemComponent(
      false,
      EquipmentSlot.Armor,
      quality,
      rarity,
    );

    const armorItemComponent = new ArmorItemComponent(finalArmor);

    const sellableItemComponent = new SellableItemComponent(definition.buyValue, value);

    const armorItem = new Item(definition.name, this.generateItemId(), definition.icon, [
      equipableItemComponent,
      armorItemComponent,
      sellableItemComponent,
    ]);

    return armorItem;
  }

  private generateItemId(): number {
    return this.nextItemId++;
  }

  generateRandomGold(level: number): Item {
    const minGold = 5 + (level - 1) * 3;
    const maxGold = 10 + (level - 1) * 5;

    const currencyItemComponent = new CurrencyItemComponent(
      CurrencyType.Gold,
      this.random.nextInt(minGold, maxGold),
    );

    const item = new Item('Gold Coin', this.generateItemId(), 'crown-coin', [
      currencyItemComponent,
    ]);

    return item;
  }

  generateRandomHealth(): Item {
    const index = Math.floor(this.random.nextFloat() * this.consumableDefinitions.length);
    const item = this.consumableDefinitions[index];

    const consumableItemComponent = new ConsumableItemComponent(item.healing);

    const sellableItemComponent = new SellableItemComponent(item.buyValue, item.sellValue);

    const consumable = new Item(item.name, this.generateItemId(), item.icon, [
      consumableItemComponent,
      sellableItemComponent,
    ]);

    return consumable;
  }

  generateMerchantItems(level: number, count: number): Item[] {
    const items: Item[] = [];

    for (let i = 0; i < count; i++) {
      items.push(this.generateWeapon(level));
    }

    items.push(this.generateRandomHealth());

    return items;
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
