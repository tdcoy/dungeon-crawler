import { ItemComponent } from './item-component';

export type ComponentConstructor<T extends ItemComponent> = new (...args: any[]) => T;

export enum ItemRarity {
  Common,
  Uncommon,
  Rare,
  Epic,
  Legendary,
}

export class Item {
  constructor(
    public name: string,
    public itemId: number,
    public icon: string,
    public components: ItemComponent[] = [],
  ) {}

  hasComponent<T extends ItemComponent>(componentType: ComponentConstructor<T>): boolean {
    return this.components.some((component) => component instanceof componentType);
  }

  getComponent<T extends ItemComponent>(componentType: ComponentConstructor<T>): T | undefined {
    return this.components.find((component): component is T => component instanceof componentType);
  }
  updateItemComponent<T extends ItemComponent>(
    componentType: new (...args: any[]) => T,
    updates: Partial<T>,
  ): Item {
    const updatedComponents = this.components.map((component) => {
      if (!(component instanceof componentType)) {
        return component;
      }

      return Object.assign(Object.create(Object.getPrototypeOf(component)), component, updates);
    });

    return new Item(this.name, this.itemId, this.icon, updatedComponents);
  }
}
