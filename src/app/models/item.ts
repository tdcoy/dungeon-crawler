export enum LootType {
  Gold,
  Consumable,
  Weapon,
  Armor,
}

export enum ItemRarity {
  Common,
  Uncommon,
  Rare,
  Epic,
  Legendary,
}

export enum WeaponType {
  Ranged,
  Dagger,
  Sword,
  Axe,
  Improvised,
}

export enum ArmorType {
  Cloth,
  Leather,
  Chain,
  Plate,
}

export interface Item {
  name: string;
  itemId: number;
  icon: string;
  type: LootType;
  value: number;
}

export interface Equipment extends Item{
  
}

export interface Weapon extends Item {
  weaponType: WeaponType;

  quality: number;
  rarity: ItemRarity;

  damage: number;

  equipped: boolean;
}

export interface WeaponDefinition {
  name: string;
  icon: string;
  type: LootType.Weapon;
  weaponType: WeaponType;

  minQuality: number;
  maxQuality: number;

  minDamage: number;
  maxDamage: number;

  value: number;
}

export interface Armor extends Item {
  armor: number;
  equipped: boolean;
}

export interface Consumable extends Item {
  healing: number;
}

export interface ConsumableDefinition {
  name: string;
  icon: string;
  type: LootType.Consumable;
  value: number;
  healing: number;
}
