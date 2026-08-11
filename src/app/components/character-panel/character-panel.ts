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
  constructor(public gameState: GameStateService) {}
}
