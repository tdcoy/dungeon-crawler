import { Component } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';
import { GraphNode, NodeState } from '../../models/graph-node';
import { NodeContentType } from '../../models/node-content';

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

    this.hasDragged = false;
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
      if (node.content.enemy) {
        return '#8b0000';
      }

      return '#e6c84f'; // yellow
    }

    if (node.state === NodeState.Available) {
      return '#a98d32'; // darker yellow
    }

    if (node.state === NodeState.Blocked) {
      return '#8b0000';
    }

    return '#555555'; // grey
  }

  getIcon(node: GraphNode): string | null {
    if (node.content.type === NodeContentType.Exit) {
      return 'exit-gate';
    }

    if (this.isAliveEnemy(node)) {
      const enemy = node.content.enemy;
      if (enemy == null) {
        return null;
      }

      return enemy.icon || null;
    }
    if (node.state === NodeState.Defeated) {
      return 'carrion';
    }
    if (node.content.lootDrop != null) {
      const lootDrop = node.content.lootDrop;

      if (lootDrop.looted) {
        return 'empty-chest';
      }
      return lootDrop.item?.icon || null;
    }

    return null;
  }

  hasIcon(node: GraphNode): boolean {
    return node.state === NodeState.Revealed && this.getIcon(node) !== null;
  }

  isAliveEnemy(node: GraphNode): boolean {
    const enemy = node.content.enemy;
    if (enemy != null && node.state === NodeState.Revealed) {
      return true;
    }
    return false;
  }
}
