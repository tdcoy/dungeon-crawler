import { NodeContent } from './node-content';

export enum NodeState {
  Hidden,
  Available,
  Revealed,
  Defeated,
  Removed,
  Blocked,
}

export interface GraphNode {
  id: number;

  icon?: string;

  gridX: number;
  gridY: number;

  x: number;
  y: number;

  neighbors: GraphNode[];

  state: NodeState;
  protected: boolean;

  terrainValue: number;
  distanceFromStart: number;
  distanceFromBoss: number;

  content: NodeContent;

  danger: number;
  remainingDanger: number;
}
