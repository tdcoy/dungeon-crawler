import { Component } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';
import { Item } from '../../models/item';

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
    this.gameState.equipItem(item);
  }
}
