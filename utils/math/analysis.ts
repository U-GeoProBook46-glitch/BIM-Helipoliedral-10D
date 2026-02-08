import { Vector3 } from 'three';

export const calculateVolume = (points: Vector3[], radius: number): number => {
  const area = points.length > 2 ? 0.5 : 0; // Simplified
  return area * radius * 0.1;
};

export const calculateCurvature = (p1: Vector3, p2: Vector3, p3: Vector3): number => {
  const v1 = new Vector3().subVectors(p2, p1);
  const v2 = new Vector3().subVectors(p3, p2);
  return v1.angleTo(v2);
};

export const analyzeDisassembly = (points: Vector3[]): number => {
  const complexity = points.length;
  return Math.max(0.1, Math.min(1.0, 1 / (complexity * 0.1)));
};