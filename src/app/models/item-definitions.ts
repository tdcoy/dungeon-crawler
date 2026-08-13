import { WeaponType } from './item-component';

export interface WeaponDefinition {
  name: string;
  icon: string;

  weaponType: WeaponType;

  minQuality: number;
  maxQuality: number;

  minDamage: number;
  maxDamage: number;

  sellValue: number;
  buyValue: number;
}

export interface ArmorDefinition {
  name: string;
  icon: string;
  minQuality: number;
  maxQuality: number;
  minArmor: number;
  maxArmor: number;
  sellValue: number;
  buyValue: number;
}

export interface ConsumableDefinition {
  name: string;
  icon: string;
  sellValue: number;
  buyValue: number;
  healing: number;
}
