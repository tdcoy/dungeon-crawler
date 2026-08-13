import { Component, inject } from '@angular/core';
import { Item } from '../../models/item';
import {
  ArmorItemComponent,
  ConsumableItemComponent,
  DamageableItemComponent,
  SellableItemComponent,
} from '../../models/item-component';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-merchant',
  imports: [],
  templateUrl: './merchant.html',
  styleUrl: './merchant.css',
})
export class Merchant {
  private gameStateService = inject(GameStateService);

  merchantItems = this.gameStateService.merchantItems;

  buyItem(item: Item): void {
    const price = this.getItemPrice(item);

    if (!this.canAfford(item)) {
      return;
    }

    this.gameStateService.changePlayerGold(-price);
    this.gameStateService.addItem(item);

    this.merchantItems.update((items) =>
      items.filter((merchantItem) => merchantItem.itemId !== item.itemId),
    );
  }

  canAfford(item: Item): boolean {
    const sellable = item.getComponent(SellableItemComponent);
    if (!sellable) {
      return false;
    }

    if (sellable.buyValue <= this.gameStateService.player().gold) {
      return true;
    }
    return false;
  }

  getItemPrice(item: Item): number {
    return item.getComponent(SellableItemComponent)?.buyValue ?? 0;
  }

  closeMerchant(): void {
    console.log('close');
    this.gameStateService.closeMerchant();
  }

  getWeaponDamage(item: Item): number {
    const damage = item.getComponent(DamageableItemComponent);
    if (!damage) {
      return 0;
    }
    return damage.damage;
  }

  getArmorValue(item: Item): number {
    const armor = item.getComponent(ArmorItemComponent);
    if (!armor) {
      return 0;
    }
    return armor.armor;
  }

  getHealingValue(item: Item): number {
    const healing = item.getComponent(ConsumableItemComponent);
    if (!healing) {
      return 0;
    }
    return healing.healing * 100;
  }
}
