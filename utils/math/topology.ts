import * as THREE from 'three';

/**
 * BIM-Helipoliedral 10D: Topology Kernel
 * Gerencia a conectividade estrutural e fechamento de loops.
 */

export const isClosedLoop = (points: THREE.Vector3[], threshold: number): boolean => {
  if (points.length < 3) return false;
  const first = points[0];
  const last = points[points.length - 1];
  return first.distanceTo(last) < threshold;
};

export const calculateFaceNormal = (points: THREE.Vector3[]): THREE.Vector3 => {
  if (points.length < 3) return new THREE.Vector3(0, 1, 0);
  
  // Usando produto vetorial dos dois primeiros segmentos para determinar orientação
  const v1 = new THREE.Vector3().subVectors(points[1], points[0]);
  const v2 = new THREE.Vector3().subVectors(points[2], points[0]);
  return new THREE.Vector3().crossVectors(v1, v2).normalize();
};

export const getCentroid = (points: THREE.Vector3[]): THREE.Vector3 => {
  const centroid = new THREE.Vector3(0, 0, 0);
  points.forEach(p => centroid.add(p));
  return centroid.divideScalar(points.length);
};
