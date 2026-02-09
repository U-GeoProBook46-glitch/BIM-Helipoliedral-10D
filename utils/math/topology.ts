import * as THREE from 'three';

/**
 * BIM-Helipoliedral 10D: Topology Kernel
 * Gerencia a conectividade estrutural e fechamento de loops conforme ISO 19650.
 */

/**
 * Verifica se o grafo de pontos forma um loop fechado (Face).
 */
export const isClosedLoop = (points: THREE.Vector3[], threshold: number): boolean => {
  if (points.length < 3) return false;
  const first = points[0];
  const last = points[points.length - 1];
  return first.distanceTo(last) < threshold;
};

/**
 * Calcula a normal de uma face cristalizada para orientação de materiais.
 */
export const calculateFaceNormal = (points: THREE.Vector3[]): THREE.Vector3 => {
  if (points.length < 3) return new THREE.Vector3(0, 1, 0);
  
  // Implementação simplificada para polígonos coplanares helipoliedrais
  const v1 = new THREE.Vector3().subVectors(points[1], points[0]);
  const v2 = new THREE.Vector3().subVectors(points[2], points[0]);
  return new THREE.Vector3().crossVectors(v1, v2).normalize();
};

/**
 * Retorna o centroide geométrico de um conjunto de vértices.
 */
export const getCentroid = (points: THREE.Vector3[]): THREE.Vector3 => {
  const centroid = new THREE.Vector3(0, 0, 0);
  points.forEach(p => centroid.add(p));
  return centroid.divideScalar(points.length);
};
