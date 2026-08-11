import { Component } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-inventory-panel',
  imports: [],
  templateUrl: './inventory-panel.html',
  styleUrl: './inventory-panel.css',
  standalone: true,
})
export class InventoryPanel {
  constructor(public gameState: GameStateService) {}
}
