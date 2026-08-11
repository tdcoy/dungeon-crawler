import { Injectable, signal } from '@angular/core';
import { Board } from '../models/board';
import { Player } from '../models/player';
import { BoardGeneratorService } from './board-generator.service';
import { GraphNode, NodeState } from '../models/graph-node';
import { NodeContent, NodeContentType } from '../models/node-content';
import { RandomService } from './random.service';
import { LootDropType } from '../models/loot-drop';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  board!: Board;

  player = signal<Player>({
    curHealth: 25,
    maxHealth: 25,
    damage: 10,
    gold: 0,
    inventory: [],
  });

  visitedNodes = new Set<number>();

  constructor(
    private boardGenerator: BoardGeneratorService,
    private random: RandomService,
  ) {
    this.startGame();
  }

  startGame() {
    this.board = this.boardGenerator.generate(5, 5);

    this.player.update((player) => ({
      ...player,
      damage: player.damage,
    }));
  }

  private openNeighbors(node: GraphNode): void {
    for (const neighbor of node.neighbors) {
      if (neighbor.state === NodeState.Hidden) {
        neighbor.state = NodeState.Available;
      }
    }
  }

  private unblockNeighbors(node: GraphNode): void {
    for (const neighbor of node.neighbors) {
      if (neighbor.state === NodeState.Blocked) {
        neighbor.state = NodeState.Available;
      }
    }
  }

  private blockNeighbors(node: GraphNode): void {
    for (const neighbor of node.neighbors) {
      if (
        (neighbor.state === NodeState.Revealed || neighbor.state === NodeState.Defeated) &&
        node.content.enemy != null
      ) {
        continue;
      }

      neighbor.state = NodeState.Blocked;
    }
  }

  onNodeClick(node: GraphNode): void {
    if (
      node.state === NodeState.Hidden ||
      node.state === NodeState.Removed ||
      node.state === NodeState.Blocked
    ) {
      return;
    }

    if (node.content.type === NodeContentType.Enemy || node.content.type === NodeContentType.Boss) {
      switch (node.state) {
        case NodeState.Defeated:
          // Check for loot
          const lootDrop = node.content.lootDrop;
          if (!lootDrop?.looted && lootDrop?.type !== LootDropType.Grave) {
            this.lootItem(node);
          }
          return;
        case NodeState.Revealed:
          this.attackNode(node);
          return;
        // Initial clicked-on event
        default:
          this.blockNeighbors(node);
          node.state = NodeState.Revealed;
          return;
      }
    }

    if (
      node.state === NodeState.Revealed &&
      node.content.lootDrop != null &&
      !node.content.lootDrop.looted
    ) {
      this.lootItem(node);
      return;
    }

    node.state = NodeState.Revealed;
    this.openNeighbors(node);
  }

  attackNode(node: GraphNode) {
    const enemy = node.content.enemy;

    if (!enemy) {
      return;
    }

    enemy.curHealth -= this.player().damage;

    if (enemy.curHealth <= 0) {
      this.defeatNode(node);
      return;
    }

    this.player.update((player) => ({
      ...player,
      curHealth: Math.max(0, player.curHealth - enemy.damage),
    }));
  }

  defeatNode(node: GraphNode) {
    node.state = NodeState.Defeated;

    this.unblockNeighbors(node);
  }

  lootItem(node: GraphNode) {
    const lootDrop = node.content.lootDrop;
    if (lootDrop == null) {
      return;
    }

    lootDrop.looted = true;
    const value = lootDrop?.quantity ?? 0;

    switch (lootDrop.type) {
      case LootDropType.Gold:
        this.player.update((player) => ({
          ...player,
          gold: player.gold + value,
        }));
        return;

      case LootDropType.Health:
        this.player.update((player) => ({
          ...player,
          curHealth: Math.min(
            player.maxHealth,
            player.curHealth + Math.round(player.maxHealth * 0.25),
          ),
        }));
        return;

      // Add item to inventory
      default:
        return;
    }
  }
}
