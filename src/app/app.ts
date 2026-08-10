import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { GameBoardComponent } from './components/game-board/game-board';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, GameBoardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('dungeon-crawler');
}
