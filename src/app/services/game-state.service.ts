import { Injectable, signal } from '@angular/core';
import { Board } from '../models/board';
import { Player } from '../models/player';
import { BoardGeneratorService } from './board-generator.service';
import { GraphNode, NodeState } from '../models/graph-node';
import { NodeContent, NodeContentType } from '../models/node-content';
import { RandomService } from './random.service';
import { Item } from '../models/item';
import {
  ArmorItemComponent,
  ConsumableItemComponent,
  CurrencyItemComponent,
  CurrencyType,
  DamageableItemComponent,
  EquippableItemComponent,
  SellableItemComponent,
} from '../models/item-component';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private readonly baseDamage = 5;
  private readonly baseArmor = 0;
  private level = 1;

  board!: Board;

  player = signal<Player>({
    curHealth: 100,
    maxHealth: 100,
    damage: this.baseDamage,
    armor: this.baseArmor,
    gold: 0,
    inventory: [],
    enemiesSlain: 0,
    damageDealt: 0,
  });

  gameOver = signal(false);

  visitedNodes = new Set<number>();

  private merchantOpen = signal<boolean>(false);
  merchantItems = signal<Item[]>([]);
  readonly isMerchantOpen = this.merchantOpen.asReadonly();

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
      enemiesSlain: 0,
      damageDealt: 0,
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

  getBoardLevel(): number {
    return this.board.level;
  }

  openMerchant(node: GraphNode): void {
    this.merchantItems.set(node.content.inventory ?? []);
    this.merchantOpen.set(true);
  }

  closeMerchant(): void {
    this.merchantOpen.set(false);
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

    if (node.content.type === NodeContentType.Merchant && node.state === NodeState.Revealed) {
      this.openMerchant(node);
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
    this.player().damageDealt += this.player().damage;

    if (enemy.curHealth <= 0) {
      this.defeatNode(node);
      return;
    }

    this.damagePlayer(enemy.damage);
  }

  defeatNode(node: GraphNode) {
    node.state = NodeState.Defeated;

    this.unblockNeighbors(node);

    this.player().enemiesSlain++;

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
    if (item.hasComponent(CurrencyItemComponent)) {
      const currency = item.getComponent(CurrencyItemComponent);

      if (currency?.currencyType === CurrencyType.Gold) {
        this.changePlayerGold(currency!.amount);
        return;
      }
    }

    this.addItem(item);
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

  removeItem(item: Item): void {
    this.player.update((player) => ({
      ...player,
      inventory: player.inventory.filter((inventoryItem) => inventoryItem.itemId !== item.itemId),
    }));
  }

  useItem(item: Item): void {
    const equipment = item.getComponent(EquippableItemComponent);
    const consumbale = item.getComponent(ConsumableItemComponent);

    if (equipment) {
      this.equipItem(item);
    }
    if (consumbale) {
      this.healPlayer(consumbale.healing);
      this.removeItem(item);
    }
  }

  equipItem(item: Item): void {
    const equipment = item.getComponent(EquippableItemComponent);

    if (!equipment) {
      return;
    }

    const shouldEquip = !equipment.isEquipped;

    this.player.update((player) => {
      const updatedInventory = player.inventory.map((inventoryItem) => {
        const inventoryEquipment = inventoryItem.getComponent(EquippableItemComponent);

        if (!inventoryEquipment) {
          return inventoryItem;
        }

        // Clicked item
        if (inventoryItem.itemId === item.itemId) {
          return inventoryItem.updateItemComponent(EquippableItemComponent, {
            isEquipped: shouldEquip,
          });
        }

        // Unequip other items in the same slot
        if (shouldEquip && inventoryEquipment.equipmentSlot === equipment.equipmentSlot) {
          return inventoryItem.updateItemComponent(EquippableItemComponent, {
            isEquipped: false,
          });
        }

        return inventoryItem;
      });

      return {
        ...player,
        inventory: updatedInventory,
      };
    });

    this.updatePlayerStats();
  }

  unEquipItem(item: Item): void {
    const equipment = item.getComponent(EquippableItemComponent);

    if (!equipment || !equipment.isEquipped) {
      return;
    }

    this.player.update((player) => {
      const updatedInventory = player.inventory.map((inventoryItem) => {
        if (inventoryItem.itemId !== item.itemId) {
          return inventoryItem;
        }

        return inventoryItem.updateItemComponent(EquippableItemComponent, {
          isEquipped: false,
        });
      });

      return {
        ...player,
        inventory: updatedInventory,
      };
    });

    this.updatePlayerStats();
  }

  private updatePlayerStats(): void {
    this.player.update((player) => {
      let damage = this.baseDamage;
      let armor = this.baseArmor;

      for (const item of player.inventory) {
        const equippable = item.getComponent(EquippableItemComponent);

        if (!equippable?.isEquipped) {
          continue;
        }

        const damageable = item.getComponent(DamageableItemComponent);
        const armorItem = item.getComponent(ArmorItemComponent);

        if (damageable) {
          damage = damageable.damage;
        }

        if (armorItem) {
          armor = armorItem.armor;
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
