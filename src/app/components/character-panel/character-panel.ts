import { Component } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-character-panel',
  standalone: true,
  imports: [],
  templateUrl: './character-panel.html',
  styleUrl: './character-panel.css',
})
export class CharacterPanel {
  tooltipVisible = false;
  tooltipTitle = '';
  tooltipText = '';

  tooltipX = 0;
  tooltipY = 0;

  constructor(public gameState: GameStateService) {}

  getPlayerHealthPercent(): number {
    return (this.gameState.player().curHealth / this.gameState.player().maxHealth) * 100;
  }

  showTooltip(event: MouseEvent, title: string, text: string): void {
    this.tooltipVisible = true;
    this.tooltipTitle = title;
    this.tooltipText = text;

    this.moveTooltip(event);
  }

  moveTooltip(event: MouseEvent): void {
    this.tooltipX = event.clientX + 15;
    this.tooltipY = event.clientY + 15;
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
  }
}
