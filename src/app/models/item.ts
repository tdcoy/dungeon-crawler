export type EquipmentSlot = 'weapon' | 'armor';

export interface Item {
  itemId: number;
  baseItemId: number;
  itemName: string;
  icon: string;

  value: number;

  damage?: number;
  healing?: number;
  armor?: number;
  quantity?: number;
  goldAmount?: number;

  equipmentSlot?: EquipmentSlot;
  equipped?: boolean;
}
