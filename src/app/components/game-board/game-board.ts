import { Component } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';
import { GraphNode, NodeState } from '../../models/graph-node';
import { NodeContentType } from '../../models/node-content';
import { LootDropType } from '../../models/loot-drop';

@Component({
  selector: 'app-game-board',
  imports: [],
  templateUrl: './game-board.html',
  styleUrl: './game-board.css',
})
export class GameBoardComponent {
  constructor(public gameState: GameStateService) {}

  NodeState = NodeState;

  zoom = 1;
  panX = 0;
  panY = 0;

  private isPanning = false;
  private hasDragged = false;

  private lastMouseX = 0;
  private lastMouseY = 0;

  private readonly minZoom = 0.5;
  private readonly maxZoom = 3;

  onPointerDown(event: PointerEvent): void {
    this.isPanning = true;
    this.hasDragged = false;

    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;

    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);
  }

  onBoardPointerDown(event: PointerEvent): void {
    const target = event.target as HTMLElement;

    // Don't start panning when clicking a node
    if (target.closest('.point') || target.closest('.node-icon')) {
      return;
    }

    this.onPointerDown(event);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isPanning) {
      return;
    }

    const dx = event.clientX - this.lastMouseX;
    const dy = event.clientY - this.lastMouseY;

    // Consider it a drag once the mouse has moved a few pixels
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      this.hasDragged = true;
    }

    this.panX += dx;
    this.panY += dy;

    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }

  onPointerUp(event: PointerEvent): void {
    this.isPanning = false;

    const target = event.currentTarget as HTMLElement;

    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
  }

  onNodePointerUp(event: PointerEvent, node: GraphNode): void {
    if (this.hasDragged) {
      return;
    }

    this.gameState.onNodeClick(node);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();

    const oldZoom = this.zoom;

    const zoomAmount = 0.1;

    if (event.deltaY < 0) {
      this.zoom += zoomAmount;
    } else {
      this.zoom -= zoomAmount;
    }

    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom));

    // Don't adjust the pan if the zoom didn't actually change
    if (this.zoom === oldZoom) {
      return;
    }

    const board = event.currentTarget as HTMLElement;
    const rect = board.getBoundingClientRect();

    // Mouse position relative to the center of the board
    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;

    // Keep the point underneath the mouse stationary
    this.panX = mouseX - (mouseX - this.panX) * (this.zoom / oldZoom);
    this.panY = mouseY - (mouseY - this.panY) * (this.zoom / oldZoom);
  }

  getNodeColor(node: GraphNode): string {
    if (node.state === NodeState.Revealed) {
      return '#e6c84f'; // yellow
    }

    if (node.state === NodeState.Available) {
      return '#a98d32'; // darker yellow
    }

    return '#555555'; // grey
  }

  getIcon(node: GraphNode): string | null {
    const lootDrop = node.content.lootDrop;

    if (lootDrop?.looted) {
      console.log('return looted icon');
      return null;
    }

    if (node.content.enemy && node.state === NodeState.Defeated) {
      if (lootDrop === null) {
        return 'carrion';
      }

      switch (node.content.lootDrop?.type) {
        case LootDropType.Gold:
          return 'crown-coin';
        case LootDropType.LargeChest:
          return 'large-chest';
        case LootDropType.SmallChest:
          return 'small-chest';
        case LootDropType.Health:
          return 'health-bottle';
        default:
          return 'carrion';
      }
    }

    switch (node.content.type) {
      case NodeContentType.Enemy:
        return this.getEnemyIcon(node);
      case NodeContentType.Boss:
        return 'diablo-skull';
      case NodeContentType.Gold:
        return 'crown-coin';
      case NodeContentType.Health:
        return 'heart-bottle';
      default:
        return null;
    }
  }

  getEnemyIcon(node: GraphNode): string | null {
    const enemy = node.content.enemy;
    switch (enemy?.name) {
      case 'Troglodyte':
        return 'troglodyte';
      case 'Skeleton':
        return 'skeleton';
      case 'Goblin':
        return 'goblin';
      default:
        return null;
    }
  }

  hasIcon(node: GraphNode): boolean {
    return node.state === NodeState.Revealed && this.getIcon(node) !== null;
  }
}
