import { Injectable } from '@angular/core';
import { Board } from '../models/board';
import { RandomService } from './random.service';
import { GraphNode, NodeState } from '../models/graph-node';
import { NodeContentType, NodeContent } from '../models/node-content';
import { Enemy } from '../models/enemy';
import { LootDrop, LootDropType } from '../models/loot-drop';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class BoardGeneratorService {
  private readonly spacing = 120;
  private readonly offset = 30;
  private readonly bossSpawnDistanceThreshold = 0.7;

  constructor(private random: RandomService) {}

  generate(width: number, height: number): Board {
    const board: Board = {
      width,
      height,
      nodes: [],
    };

    this.generateNodes(board);
    this.connectOrthogonal(board);
    this.connectDiagonals(board);
    this.chooseStartNode(board);
    this.chooseBossNode(board);
    this.assignNodeContent(board);
    this.removeRandomNodes(board, 5);
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

    this.calculateDistances(startNode);
    this.openNeighbors(startNode);
  }

  private chooseBossNode(board: Board): void {
    const maxDistance = Math.max(...board.nodes.map((node) => node.distanceFromStart));

    // Candidate boss nodes picked from the 75% furthest nodes from start
    const minDistance = Math.floor(maxDistance * this.bossSpawnDistanceThreshold);
    let candidates = board.nodes.filter(
      (node) => node.state !== NodeState.Removed && node.distanceFromStart >= minDistance,
    );

    // Fallback for small maps
    if (candidates.length === 0) {
      candidates = board.nodes.filter((node) => node.state !== NodeState.Removed);
    }

    const index = Math.floor(this.random.next() * candidates.length);
    candidates[index].content.type = NodeContentType.Boss;
  }

  private openNeighbors(node: GraphNode): void {
    for (const neighbor of node.neighbors) {
      if (neighbor.state !== NodeState.Revealed) {
        neighbor.state = NodeState.Available;
      }
    }
  }

  private calculateDistances(start: GraphNode): void {
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

    for (let i = 0; i < amount; i++) {
      const index = this.random.nextInt(0, candidates.length - 1);

      const node = candidates[index];

      if (this.canRemoveNode(board, node)) {
        node.state === NodeState.Removed;
      }

      candidates.splice(index, 1);
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

    node.state === NodeState.Removed;

    const start = board.nodes.find((n) => n.state !== NodeState.Removed);

    const visited = new Set<number>();

    if (start) {
      this.traverse(start, visited);
    }

    const remaining = board.nodes.filter((n) => n.state !== NodeState.Removed);

    const valid = visited.size === remaining.length;

    if (!valid) {
      node.state === NodeState.Available;

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
          node.content = this.getRandomNodeContent();
        }
      }
    }
  }

  private getRandomNodeContent(): NodeContent {
    const roll = this.random.next();

    if (roll < 0.45) {
      return {
        type: NodeContentType.Enemy,
        enemy: this.generateEnemy(),
        lootDrop: this.generateLootDrop(),
      };
    }
    if (roll < 0.6) {
      return {
        type: NodeContentType.Gold,
        lootDrop: { type: LootDropType.Gold, quantity: this.generateGoldAmount(), looted: false },
      };
    }
    if (roll < 0.75) {
      return {
        type: NodeContentType.Health,
        lootDrop: {
          type: LootDropType.Health,
          looted: false,
        },
      };
    }
    if (roll < 0.9) {
      return { type: NodeContentType.ChestLarge };
    }

    return { type: NodeContentType.Empty };
  }

  private getRandomSafeNodeContent(): NodeContentType {
    const roll = this.random.next();

    if (roll < 0.6) {
      return NodeContentType.Empty;
    }
    if (roll < 0.75) {
      return NodeContentType.Gold;
    }

    return NodeContentType.Empty;
  }

  private generateEnemy(): Enemy {
    const roll = this.random.next();

    if (roll < 0.3) {
      return {
        name: 'Goblin',
        icon: 'goblin',
        maxHealth: 20,
        curHealth: 20,
        damage: 5,
      };
    }

    if (roll < 0.6) {
      return {
        name: 'Skeleton',
        icon: 'skeleton',
        maxHealth: 15,
        curHealth: 15,
        damage: 8,
      };
    }

    return {
      name: 'Troglodyte',
      icon: 'troglodyte',
      maxHealth: 25,
      curHealth: 25,
      damage: 3,
    };
  }

  private generateLootDrop(): LootDrop {
    const roll = this.random.next();

    if (roll < 0.5) {
      return { type: LootDropType.Grave, looted: false };
    }
    if (roll < 0.65) {
      return { type: LootDropType.Gold, quantity: this.generateGoldAmount(), looted: false };
    }
    if (roll < 0.7) {
      return {
        type: LootDropType.SmallChest,
        loot: this.generateLoot(LootDropType.SmallChest),
        looted: false,
      };
    }
    return {
      type: LootDropType.LargeChest,
      loot: this.generateLoot(LootDropType.LargeChest),
      looted: false,
    };
  }

  private generateLoot(type: LootDropType): Item {
    switch (type) {
      case LootDropType.LargeChest:
        const sword: Item = {
          itemId: 1,
          itemName: 'Gladius',
          icon: 'gladius',
        };
        return sword;
      case LootDropType.SmallChest:
        const crossbow: Item = {
          itemId: 2,
          itemName: 'Crossbow',
          icon: 'crossbow',
        };
        return crossbow;

      default:
        const woodClub: Item = {
          itemId: 3,
          itemName: 'Wood Club',
          icon: 'wood-club',
        };
        return woodClub;
    }
  }

  private generateGoldAmount(): number {
    return Math.floor(this.random.next() * 5) + 1;
  }
}
