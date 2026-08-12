import { Injectable, signal } from '@angular/core';
import { Board } from '../models/board';
import { Player } from '../models/player';
import { BoardGeneratorService } from './board-generator.service';
import { GraphNode, NodeState } from '../models/graph-node';
import { NodeContent, NodeContentType } from '../models/node-content';
import { RandomService } from './random.service';
import { Consumable, Item, LootType, Weapon, Armor } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private readonly baseDamage = 5;
  private readonly baseArmor = 0;
  private readonly baseBoardSizeX = 5;
  private readonly baseBoardSizeY = 5;
  private level = 1;

  board!: Board;

  player = signal<Player>({
    curHealth: 100,
    maxHealth: 100,
    damage: this.baseDamage,
    armor: this.baseArmor,
    gold: 0,
    inventory: [],
  });

  gameOver = signal(false);

  visitedNodes = new Set<number>();

  constructor(
    private boardGenerator: BoardGeneratorService,
    private random: RandomService,
  ) {
    this.startGame();
  }

  startGame() {
    this.board = this.boardGenerator.generate(5, 5, this.level);

    this.player.update((player) => ({
      ...player,
      damage: player.damage,
    }));
  }

  endGame(): void {
    this.gameOver.set(true);
  }

  restartGame(): void {
    this.gameOver.set(false);

    this.player.set({
      curHealth: 25,
      maxHealth: 25,
      damage: 5,
      armor: 0,
      gold: 0,
      inventory: [],
    });

    this.level = 1;
    this.startGame();
  }

  goToNextLevel(): void {
    this.level++;

    const roll = this.random.nextBool();
    let directionX = 0;
    let directionY = 0;
    if (roll) {
      directionX++;
    } else {
      directionY++;
    }

    this.board = this.boardGenerator.generate(
      this.board.width + directionX,
      this.board.height + directionY,
      this.level,
    );
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

  private updateDangerCounts(node: GraphNode): void {
    if (this.isDangerous(node)) {
      // A danger node was revealed.
      // Recalculate the danger count for each neighbor.
      for (const neighbor of node.neighbors) {
        neighbor.danger = this.getDangerCount(neighbor);
      }
    }
    node.danger = this.getDangerCount(node);
  }

  getDangerCount(node: GraphNode): number {
    return node.neighbors.filter(
      (neighbor) =>
        this.isDangerous(neighbor) &&
        neighbor.state !== NodeState.Revealed &&
        neighbor.state !== NodeState.Defeated,
    ).length;
  }

  onNodeClick(node: GraphNode): void {
    if (
      node.state === NodeState.Hidden ||
      node.state === NodeState.Removed ||
      node.state === NodeState.Blocked
    ) {
      return;
    }

    if (
      node.content.type === NodeContentType.Exit &&
      (node.state === NodeState.Revealed || node.state === NodeState.Defeated)
    ) {
      this.goToNextLevel();
      return;
    }

    if (node.content.type === NodeContentType.Enemy || node.content.type === NodeContentType.Boss) {
      switch (node.state) {
        case NodeState.Defeated:
          return;
        case NodeState.Revealed:
          this.attackNode(node);
          return;
        // Initial clicked-on event
        default:
          this.blockNeighbors(node);
          node.state = NodeState.Revealed;
          this.updateDangerCounts(node);
          return;
      }
    }

    if (
      node.state === NodeState.Revealed &&
      node.content.lootDrop?.item != null &&
      !node.content.lootDrop.looted
    ) {
      this.lootItem(node.content.lootDrop?.item);
      node.content.lootDrop.looted = true;
      return;
    }

    node.state = NodeState.Revealed;
    this.updateDangerCounts(node);
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

    this.damagePlayer(enemy.damage);
  }

  defeatNode(node: GraphNode) {
    node.state = NodeState.Defeated;

    this.unblockNeighbors(node);

    if (node.content.type === NodeContentType.Boss) {
      node.content.type = NodeContentType.Exit;
      return;
    }

    const lootDrop = node.content.lootDrop;

    if (lootDrop != null) {
      node.content = {
        type: NodeContentType.LootDrop,
        lootDrop: lootDrop,
      };

      node.state = NodeState.Revealed;
    } else {
      node.state = NodeState.Defeated;
    }
  }

  lootItem(item: Item) {
    if (item.name === 'Gold Coin') {
      this.changePlayerGold(item.value);
    } else if (item.type === LootType.Consumable) {
      const consumable = item as Consumable;
      this.healPlayer(consumable.healing);
    } else {
      this.addItem(item);
    }
  }

  damagePlayer(amount: number): void {
    const armor = this.player().armor ?? 0;

    const damageMultiplier = 100 / (100 + armor);
    const damageTaken = Math.max(1, Math.round(amount * damageMultiplier));

    Math.max(1, damageTaken);

    this.player.update((player) => ({
      ...player,
      curHealth: Math.max(0, player.curHealth - damageTaken),
    }));

    if (this.player().curHealth <= 0) {
      this.endGame();
    }
  }

  healPlayer(amount: number): void {
    this.player.update((player) => ({
      ...player,
      curHealth: Math.min(
        player.maxHealth,
        player.curHealth + Math.round(player.maxHealth * amount),
      ),
    }));
  }

  changePlayerGold(amount: number): void {
    const value = (this.player().gold += amount);
    this.player.update((player) => ({
      ...player,
      gold: value,
    }));
  }

  addItem(item: Item): void {
    this.player.update((player) => ({
      ...player,

      inventory: [...player.inventory, item],
    }));
  }

  equipItem(item: Item): void {
    if (item.type === LootType.Armor) {
      this.equipArmor(item as Armor);
    } else if (item.type === LootType.Weapon) {
      this.equipWeapon(item as Weapon);
    } else {
      return;
    }

    this.updatePlayerStats();
  }

  private equipWeapon(weapon: Weapon): void {
    this.player.update((player) => {
      const updatedInventory = player.inventory.map((item) => {
        // The weapon that was clicked
        if (item.itemId === weapon.itemId) {
          return {
            ...item,
            equipped: !weapon.equipped,
          };
        }

        // If we're equipping the clicked weapon,
        // unequip the currently equipped weapon.
        if (!weapon.equipped && item.type === LootType.Weapon) {
          return {
            ...item,
            equipped: false,
          };
        }

        return item;
      });

      return {
        ...player,
        inventory: updatedInventory,
      };
    });

    this.updatePlayerStats();
  }

  private equipArmor(armor: Armor): void {
    this.player.update((player) => {
      const updatedInventory = player.inventory.map((inventoryItem) => {
        // Clicked weapon
        if (inventoryItem.itemId === armor.itemId) {
          return {
            ...inventoryItem,
            equipped: !armor.equipped,
          };
        }

        // Unequip other weapons
        if (!armor.equipped && inventoryItem.type === LootType.Weapon) {
          return {
            ...inventoryItem,
            equipped: false,
          };
        }

        return inventoryItem;
      });

      return {
        ...player,
        inventory: updatedInventory,
      };
    });
  }

  private updatePlayerStats(): void {
    this.player.update((player) => {
      let damage = this.baseDamage;
      let armor = this.baseArmor;

      for (const item of player.inventory) {
        if (item.type === LootType.Weapon) {
          const weapon = item as Weapon;

          if (weapon.equipped) {
            damage = weapon.damage;
          }
        }

        if (item.type === LootType.Armor) {
          const armorItem = item as Armor;

          if (armorItem.equipped) {
            armor = armorItem.armor;
          }
        }
      }

      return {
        ...player,
        damage,
        armor,
      };
    });
  }

  private isDangerous(node: GraphNode): boolean {
    if (node.content.type === NodeContentType.Boss || node.content.type === NodeContentType.Enemy) {
      return true;
    }
    return false;
  }
}
