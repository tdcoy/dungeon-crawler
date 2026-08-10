import { GraphNode } from './graph-node';

export interface Board {
  nodes: GraphNode[];

  width: number;
  height: number;
}
