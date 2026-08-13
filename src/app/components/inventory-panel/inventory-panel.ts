import { Component } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';
import { Item } from '../../models/item';
import {
  ArmorItemComponent,
  ConsumableItemComponent,
  DamageableItemComponent,
  EquippableItemComponent,
  SellableItemComponent,
} from '../../models/item-component';

@Component({
  selector: 'app-inventory-panel',
  imports: [],
  templateUrl: './inventory-panel.html',
  styleUrl: './inventory-panel.css',
  standalone: true,
})
export class InventoryPanel {
  itemTooltipVisible = false;
  itemTooltipX = 0;
  itemTooltipY = 0;
  selectedItem: Item | null = null;

  constructor(public gameState: GameStateService) {}

  showItemTooltip(event: MouseEvent, item: Item): void {
    this.selectedItem = item;
    this.itemTooltipVisible = true;

    this.moveItemTooltip(event);
  }

  moveItemTooltip(event: MouseEvent): void {
    this.itemTooltipX = event.clientX + 15;
    this.itemTooltipY = event.clientY + 15;
  }

  hideItemTooltip(): void {
    this.itemTooltipVisible = false;
    this.selectedItem = null;
  }

  selectItem(item: Item): void {
    this.gameState.useItem(item);
    this.hideItemTooltip();
  }

  isItemEquipped(item: Item): boolean {
    const equipment = item.getComponent(EquippableItemComponent);

    if (!equipment) {
      return false;
    }

    return equipment.isEquipped;
  }

  getWeaponDamage(item: Item): number {
    const damagable = item.getComponent(DamageableItemComponent);
    if (!damagable) {
      return 0;
    }

    return damagable.damage;
  }

  getArmorValue(item: Item): number {
    const armorItem = item.getComponent(ArmorItemComponent);
    if (!armorItem) {
      return 0;
    }

    return armorItem.armor;
  }

  getHealingValue(item: Item): number {
    const healingItem = item.getComponent(ConsumableItemComponent);
    if (!healingItem) {
      return 0;
    }

    return healingItem.healing * 100;
  }

  getSellValue(item: Item): number {
    const sellable = item.getComponent(SellableItemComponent);

    if (!sellable) {
      return 0;
    }

    return sellable.sellValue;
  }

  sellItem(item: Item, event: MouseEvent): void {
    event.stopPropagation();

    this.hideItemTooltip();

    const sellable = item.getComponent(SellableItemComponent);
    this.gameState.unEquipItem(item);
    this.gameState.changePlayerGold(sellable!.sellValue);
    this.gameState.removeItem(item);
  }

  trashItem(item: Item, event: MouseEvent): void {
    event.stopPropagation();
    this.hideItemTooltip();
    this.gameState.removeItem(item);
  }
}
