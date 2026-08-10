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

  selectNode(node: GraphNode): void {
    this.gameState.selectNode(node);
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
      console.log("return looted icon");
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
