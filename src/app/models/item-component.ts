import { ItemRarity } from './item';

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

export enum EquipmentSlot {
  Weapon,
  Armor,
}

export enum CurrencyType {
  Gold,
}

export abstract class ItemComponent {}

export class CurrencyItemComponent extends ItemComponent {
  constructor(
    public currencyType: CurrencyType,
    public amount: number,
  ) {
    super();
  }
}

export class SellableItemComponent extends ItemComponent {
  constructor(
    public buyValue: number,
    public sellValue: number,
  ) {
    super();
  }
}

export class EquippableItemComponent extends ItemComponent {
  constructor(
    public isEquipped: boolean,
    public equipmentSlot: EquipmentSlot,
    public quality: number,
    public rarity: ItemRarity,
  ) {
    super();
  }
}

export class DamageableItemComponent extends ItemComponent {
  constructor(
    public damage: number,
    public weaponType: WeaponType,
  ) {
    super();
  }
}

export class ArmorItemComponent extends ItemComponent {
  constructor(public armor: number) {
    super();
  }
}

export class ConsumableItemComponent extends ItemComponent {
  constructor(public healing: number) {
    super();
  }
}
