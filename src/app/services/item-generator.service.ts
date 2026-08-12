import { Injectable } from '@angular/core';
import { Item, EquipmentSlot } from '../models/item';
import { RandomService } from './random.service';

@Injectable({
  providedIn: 'root',
})
export class ItemGeneratorService {
  private readonly minRoll = -3;
  private readonly maxRoll = 5;

  private nextItemId = 1;

  private baseItems: Item[] = [
    {
      baseItemId: 0,
      itemId: -1,
      itemName: 'Gold Coin',
      icon: 'crown-coin',
      value: 1,
      goldAmount: 1,
    },
    {
      baseItemId: 1,
      itemId: -1,
      itemName: 'Wooden Crossbow',
      icon: 'wooden-crossbow',
      value: 15,
      damage: 12,
      equipmentSlot: 'weapon',
      equipped: false,
    },

    {
      baseItemId: 2,
      itemId: -1,
      itemName: 'Gladius',
      icon: 'gladius',
      value: 19,
      damage: 15,
      equipmentSlot: 'weapon',
      equipped: false,
    },

    {
      baseItemId: 3,
      itemId: -1,
      itemName: 'Wooden Club',
      icon: 'wood-club',
      value: 15,
      damage: 10,
      equipmentSlot: 'weapon',
      equipped: false,
    },

    {
      baseItemId: 4,
      itemId: -1,
      itemName: 'Leather Armor',
      icon: 'leather-armor',
      value: 20,
      armor: 15,
      equipmentSlot: 'armor',
      equipped: false,
    },

    {
      baseItemId: 5,
      itemId: -1,
      itemName: 'Iron Armor',
      icon: 'iron-armor',
      value: 25,
      armor: 20,
      equipmentSlot: 'armor',
      equipped: false,
    },

    {
      baseItemId: 6,
      itemId: -1,
      itemName: 'Health Bottle',
      icon: 'heart-bottle',
      value: 14,
      healing: 0.25,
    },

    {
      baseItemId: 7,
      itemId: -1,
      itemName: 'Healing Root',
      icon: 'healing-root',
      value: 10,
      healing: 0.15,
    },
  ];

  constructor(private random: RandomService) {}

  generateRandomItem(): Item {
    const index = this.random.nextInt(0, this.baseItems.length - 1);

    const baseItem = this.baseItems[index];

    const variation = this.random.nextInt(-3, 5);

    const item: Item = {
      itemId: this.generateItemId(),
      baseItemId: baseItem.itemId,
      itemName: baseItem.itemName,
      icon: baseItem.icon,
      value: baseItem.value,
      damage: baseItem.damage,
      armor: baseItem.armor,
      equipmentSlot: baseItem.equipmentSlot,
      equipped: false,
      healing: baseItem.healing,
    };

    if (item.equipmentSlot != null) {
      this.generateItemName(item, this.minRoll, this.maxRoll, variation);
    }

    if (item.damage !== undefined) {
      item.damage += variation;
    }
    if (item.armor !== undefined) {
      item.armor += variation;
    }
    if (item.quantity !== undefined) {
      item.quantity += variation;

      item.quantity = Math.max(1, item.quantity);
    }

    item.value += variation;
    item.value = Math.max(1, item.value);

    return item;
  }

  private generateItemId(): number {
    return this.nextItemId++;
  }

  generateRandomGold(): Item {
    const gold = {
      baseItemId: 0,
      itemId: this.generateItemId(),
      itemName: 'Gold Coin',
      icon: 'crown-coin',
      value: Math.floor(this.random.next() * 5) + 1,
      goldAmount: Math.floor(this.random.next() * 5) + 1,
    };

    return gold;
  }

  generateRandomHealth(): Item {
    const health = {
      baseItemId: 6,
      itemId: this.generateItemId(),
      itemName: 'Health Bottle',
      icon: 'heart-bottle',
      value: 14,
      healing: 0.25,
    };

    return health;
  }

  generateItemName(item: Item, min: number, max: number, roll: number): void {
    const percentage = Math.round(1 + ((roll - min) / (max - min)) * 99);
    let surName = '';

    if (item.equipmentSlot == 'weapon') {
      console.log('weapon');
      if (percentage < 20) {
        surName = 'Rusty';
      }
      if (percentage < 40) {
        surName = 'Worn';
      }
      if (percentage < 60) {
        surName = 'Common';
      }
      if (percentage < 80) {
        surName = 'Sharpened';
      } else {
        surName = 'Exquisite';
      }
    }
    if (item.equipmentSlot == 'armor') {
      if (percentage < 20) {
        surName = 'Rusty';
      }
      if (percentage < 40) {
        surName = 'Worn';
      }
      if (percentage < 60) {
        surName = 'Common';
      }
      if (percentage < 80) {
        surName = 'Improved';
      } else {
        surName = 'Exquisite';
      }
    }

    item.itemName = `${surName} ${item.itemName}`;
  }
}
