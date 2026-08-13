import { Injectable } from '@angular/core';
import { Board } from '../models/board';
import { RandomService } from './random.service';
import { GraphNode, NodeState } from '../models/graph-node';
import { NodeContentType, NodeContent } from '../models/node-content';
import { LootDrop } from '../models/loot-drop';
import { ItemGeneratorService } from './item-generator.service';
import { EnemyGeneratorService } from './enemy-generator.service';

@Injectable({
  providedIn: 'root',
})
export class BoardGeneratorService {
  private readonly spacing = 120;
  private readonly offset = 30;
  private readonly bossSpawnDistanceThreshold = 0.7;
  private merchantSpawned = false;

  constructor(
    private random: RandomService,
    private itemGeneratorService: ItemGeneratorService,
    private enemyGeneratorService: EnemyGeneratorService,
  ) {}

  generate(width: number, height: number, level: number): Board {
    const board: Board = {
      width,
      height,
      nodes: [],
      level,
    };

    this.merchantSpawned = false;

    this.generateNodes(board);
    this.connectOrthogonal(board);
    this.connectDiagonals(board);
    this.chooseStartNode(board);
    this.chooseBossNode(board);
    this.assignNodeContent(board);

    //this.removeRandomNodes(board, 2);
    return board;
  }
  generateNodes(board: Board): void {
    let id = 0;

    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        const position = this.getNodePosition(x, y);

        board.nodes.push({
          id: id++,

          gridX: x,
          gridY: y,

          x: position.x,
          y: position.y,

          neighbors: [],

          state: NodeState.Hidden,
          protected: false,

          terrainValue: this.random.next(),
          distanceFromStart: -1,
          distanceFromBoss: -1,
          danger: 0,
          remainingDanger: 0,

          content: {
            type: NodeContentType.Empty,
          },
        });
      }
    }
  }

  private chooseStartNode(board: Board): void {
    const edgeNodes = board.nodes.filter(
      (node) =>
        node.gridX === 0 ||
        node.gridY === 0 ||
        node.gridX === board.width - 1 ||
        node.gridY === board.height - 1,
    );

    const startNode = edgeNodes[this.random.nextInt(0, edgeNodes.length - 1)];

    startNode.state = NodeState.Revealed;
    startNode.protected = true;
    startNode.neighbors.forEach((node) => {
      node.protected = true;
    });

    startNode.content.type = NodeContentType.Start;

    this.calculateDistanceFromStart(startNode);
    this.openNeighbors(startNode);
  }

  private chooseBossNode(board: Board): void {
    const maxDistance = Math.max(...board.nodes.map((node) => node.distanceFromStart));

    // Candidate nodes picked from the 75% furthest nodes from start
    const minDistance = Math.floor(maxDistance * this.bossSpawnDistanceThreshold);

    let candidates = board.nodes.filter(
      (node) => node.state !== NodeState.Removed && node.distanceFromStart >= minDistance,
    );

    // Fallback for small maps
    if (candidates.length === 0) {
      candidates = board.nodes.filter((node) => node.state !== NodeState.Removed);
    }

    const index = Math.floor(this.random.next() * candidates.length);
    const node = candidates[index];

    // Every 3rd level has a boss
    if (board.level % 3 === 0) {
      node.content.type = NodeContentType.Boss;
      node.content.enemy = this.enemyGeneratorService.generateRandomBoss(board.level);
    } else {
      // All other levels have an exit
      node.content.type = NodeContentType.Exit;
    }

    this.calculateDistanceFromBoss(node);
  }

  private openNeighbors(node: GraphNode): void {
    for (const neighbor of node.neighbors) {
      if (neighbor.state !== NodeState.Revealed) {
        neighbor.state = NodeState.Available;
      }
    }
  }

  private calculateDistanceFromStart(start: GraphNode): void {
    const queue: GraphNode[] = [];
    start.distanceFromStart = 0;

    queue.push(start);
    while (queue.length > 0) {
      const current = queue.shift()!;

      for (const neighbor of current.neighbors) {
        if (neighbor.state === NodeState.Removed || neighbor.distanceFromStart !== -1) {
          continue;
        }

        neighbor.distanceFromStart = current.distanceFromStart + 1;
        queue.push(neighbor);
      }
    }
  }

  private calculateDistanceFromBoss(boss: GraphNode): void {
    const queue: GraphNode[] = [];
    boss.distanceFromBoss = 0;

    queue.push(boss);
    while (queue.length > 0) {
      const current = queue.shift()!;

      for (const neighbor of current.neighbors) {
        if (neighbor.state === NodeState.Removed || neighbor.distanceFromBoss !== -1) {
          continue;
        }

        neighbor.distanceFromBoss = current.distanceFromBoss + 1;
        queue.push(neighbor);
      }
    }
  }

  private connectOrthogonal(board: Board): void {
    for (const node of board.nodes) {
      const right = this.getNode(board, node.gridX + 1, node.gridY);

      if (right) {
        this.connect(node, right);
      }

      const down = this.getNode(board, node.gridX, node.gridY + 1);

      if (down) {
        this.connect(node, down);
      }
    }
  }

  private connectDiagonals(board: Board): void {
    for (let y = 0; y < board.height - 1; y++) {
      for (let x = 0; x < board.width - 1; x++) {
        const tl = this.getNode(board, x, y)!;
        const tr = this.getNode(board, x + 1, y)!;
        const bl = this.getNode(board, x, y + 1)!;
        const br = this.getNode(board, x + 1, y + 1)!;

        if (this.random.nextBool()) {
          this.connect(tl, br);
        } else {
          this.connect(tr, bl);
        }
      }
    }
  }

  private removeRandomNodes(board: Board, amount: number): void {
    const candidates = board.nodes.filter((node) => !node.protected);

    let removed = 0;

    while (removed < amount && candidates.length > 0) {
      const index = this.random.nextInt(0, candidates.length - 1);
      const node = candidates[index];

      candidates.splice(index, 1);

      if (!this.canRemoveNode(board, node)) {
        continue;
      }

      node.state = NodeState.Removed;
      removed++;
    }
  }

  private getNode(board: Board, x: number, y: number): GraphNode | undefined {
    return board.nodes.find((node) => node.gridX === x && node.gridY === y);
  }

  private getNodePosition(gridX: number, gridY: number) {
    const warpX = Math.sin(gridX * 1.5 + gridY + this.random.next() * 10000) * 30;

    const warpY = Math.cos(gridY * 1.3 + gridX + this.random.next() * 10000) * 30;

    return {
      x: gridX * this.spacing + warpX,

      y: gridY * this.spacing + warpY,
    };
  }

  private connect(a: GraphNode, b: GraphNode): void {
    if (!a.neighbors.includes(b)) {
      a.neighbors.push(b);
    }

    if (!b.neighbors.includes(a)) {
      b.neighbors.push(a);
    }
  }

  private canRemoveNode(board: Board, node: GraphNode): boolean {
    const oldConnections = this.disconnectNode(node);

    node.state = NodeState.Removed;

    const start = board.nodes.find((n) => n.state !== NodeState.Removed);

    const visited = new Set<number>();

    if (start) {
      this.traverse(start, visited);
    }

    const remaining = board.nodes.filter((n) => n.state !== NodeState.Removed);

    const valid = visited.size === remaining.length;

    if (!valid) {
      node.state = NodeState.Available;

      this.restoreConnections(node, oldConnections);
    }

    return valid;
  }

  private traverse(node: GraphNode, visited: Set<number>): void {
    if (visited.has(node.id)) {
      return;
    }

    if (node.state === NodeState.Removed) {
      return;
    }

    visited.add(node.id);

    for (const neighbor of node.neighbors) {
      this.traverse(neighbor, visited);
    }
  }

  private disconnectNode(node: GraphNode): Map<GraphNode, GraphNode[]> {
    const connections = new Map<GraphNode, GraphNode[]>();

    for (const neighbor of node.neighbors) {
      connections.set(neighbor, [...neighbor.neighbors]);

      neighbor.neighbors = neighbor.neighbors.filter((n) => n !== node);
    }

    node.neighbors = [];

    return connections;
  }

  private restoreConnections(node: GraphNode, connections: Map<GraphNode, GraphNode[]>): void {
    for (const [neighbor, neighbors] of connections) {
      neighbor.neighbors = neighbors;
    }

    node.neighbors = Array.from(connections.keys());
  }

  private shouldRemoveNode(node: GraphNode): boolean {
    const value = Math.sin(node.gridX * 0.8) + Math.cos(node.gridY * 0.7);

    return value > 1.2;
  }

  private assignNodeContent(board: Board): void {
    for (const node of board.nodes) {
      if (node.state === NodeState.Removed) {
        continue;
      }

      if (node.content.type === NodeContentType.Empty) {
        if (node.distanceFromStart <= 1) {
          node.content.type = this.getRandomSafeNodeContent();
        } else {
          node.content = this.getRandomNodeContent(board);
        }
      }
    }
  }

  private getRandomNodeContent(board: Board): NodeContent {
    const roll = this.random.next();

    // 40% chance
    if (roll < 0.4) {
      return {
        type: NodeContentType.Enemy,
        enemy: this.enemyGeneratorService.generateRandomEnemy(board.level),
        lootDrop: this.generateLootDrop(board),
      };
    }

    // 25% chance
    if (roll < 0.65) {
      return {
        type: NodeContentType.Loot,
        lootDrop: {
          item: this.itemGeneratorService.generateRandomGold(board.level),
          looted: false,
        },
      };
    }

    // 20% chance
    if (roll < 0.85) {
      return {
        type: NodeContentType.Loot,
        lootDrop: {
          item: this.itemGeneratorService.generateRandomHealth(),
          looted: false,
        },
      };
    }

    // 5% chance
    if (roll < 0.9) {
      return {
        type: NodeContentType.Loot,
        lootDrop: { item: this.itemGeneratorService.generateRandomEquipment(board.level), looted: false },
      };
    }

    // 3% chance
    if (roll < 0.93) {
      if (this.merchantSpawned) {
        return { type: NodeContentType.Empty };
      }

      this.merchantSpawned = true;

      return {
        type: NodeContentType.Merchant,
        inventory: this.itemGeneratorService.generateMerchantItems(board.level, 10),
      };
    }

    return { type: NodeContentType.Empty };
  }

  private getRandomSafeNodeContent(): NodeContentType {
    const roll = this.random.next();

    if (roll < 0.6) {
      return NodeContentType.Empty;
    }

    return NodeContentType.Empty;
  }

  private generateLootDrop(board: Board): LootDrop | null {
    const roll = this.random.next();

    if (roll < 0.5) {
      return null;
    }
    if (roll < 0.65) {
      return {
        item: this.itemGeneratorService.generateRandomGold(board.level),
        looted: false,
      };
    }
    return {
      item: this.itemGeneratorService.generateRandomEquipment(board.level),
      looted: false,
    };
  }
}
