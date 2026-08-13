import { Component, inject } from '@angular/core';
import { Sidebar } from '../components/sidebar/sidebar';
import { GameBoardComponent } from '../components/game-board/game-board';
import { Merchant } from '../components/merchant/merchant';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-home',
  imports: [Sidebar, GameBoardComponent, Merchant],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(public gameState: GameStateService) {}
}
