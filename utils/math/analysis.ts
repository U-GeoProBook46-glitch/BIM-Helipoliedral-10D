
import { Vector3 } from 'three';

export const analyzeDisassembly = (points: Vector3[]): number => {
  const complexity = points.length;
  return Math.max(0.1, Math.min(1.0, 1 / (complexity * 0.1)));
};
