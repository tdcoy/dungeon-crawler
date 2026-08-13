import { Component } from '@angular/core';
import { Sidebar } from '../components/sidebar/sidebar';
import { GameBoardComponent } from '../components/game-board/game-board';

@Component({
  selector: 'app-home',
  imports: [Sidebar, GameBoardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
