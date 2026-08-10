import { Component } from '@angular/core';
import { CharacterPanel } from '../character-panel/character-panel';
import { InventoryPanel } from '../inventory-panel/inventory-panel';

@Component({
  selector: 'app-sidebar',
  imports: [CharacterPanel, InventoryPanel],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  standalone: true,
})
export class Sidebar {}
