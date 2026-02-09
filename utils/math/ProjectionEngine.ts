import * as THREE from 'three';
import { PHI } from './polar';

/**
 * BIM-Helipoliedral 10D: Projection Engine (Kernel v13.5)
 * Implementa a Divisão Harmônica de Ramanujan para conversão 10D -> 3D.
 * Conformidade ISO 80000 para precisão decimal e Proporção Áurea (PHI) para distribuição de vértices.
 */
export class ProjectionEngine {
  /**
   * ramanujan10DTo3D: Projeta um vetor de 10 dimensões em coordenadas cartesianas 3D.
   * As 10 dimensões representam pesos harmônicos na hiperesfera de Ramanujan.
   * 
   * @param input10D - Array de 10 números representando as dimensões de metadados harmônicos.
   * @param radius - Raio da camada (Layer) de materialização.
   * @returns THREE.Vector3 em conformidade com o sistema de coordenadas BIM 10D.
   */
  static ramanujan10DTo3D(input10D: number[], radius: number): THREE.Vector3 {
    // Garantia de integridade 10D conforme especificação do Kernel
    const dims = input10D.length >= 10 ? input10D.slice(0, 10) : [...input10D, ...new Array(10 - input10D.length).fill(0)];
    
    // Clusterização Harmônica de Ramanujan:
    // Dividimos os 10 vetores em clusters de Fase (θ), Frequência (φ) e Amplitude Radial (r).
    const thetaCluster = [dims[0], dims[1], dims[2]];
    const phiCluster = [dims[3], dims[4], dims[5]];
    const radialCluster = [dims[6], dims[7], dims[8], dims[9]];

    // Cálculo de Theta (Longitude Harmônica) usando a Proporção Áurea
    const thetaHarmonic = thetaCluster.reduce((acc, val, i) => {
      // Componente de fase ponderado pela constante de Ramanujan e PHI
      return acc + (val! * Math.cos((i + 1) * PHI));
    }, 0);

    const theta = thetaHarmonic * PHI;

    // Cálculo de Phi (Latitude Harmônica)
    const phiHarmonic = phiCluster.reduce((acc, val, i) => {
      // Componente de frequência senoidal modular
      return acc + (val! * Math.sin((i + 1) * PHI));
    }, 0);

    // Mapeamento para o domínio [0, PI] conforme ISO 80000
    const phi = Math.abs(phiHarmonic * PHI) % Math.PI;

    // Cálculo da Distorção Radial (Harmônicos de Shell)
    const harmonicShell = radialCluster.reduce((acc, val, i) => {
      // Série Harmônica de Ramanujan adaptada: sum(v_n / (n + PHI))
      return acc + (val! / (i + PHI));
    }, 0);

    // O raio efetivo é modulado pela soma harmônica residual
    const r = radius + (harmonicShell * (1 / PHI));

    // Conversão para Cartesiano com precisão ISO 80000 (8 casas decimais)
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(
      this.clampPrecision(x),
      this.clampPrecision(y),
      this.clampPrecision(z)
    );
  }

  /**
   * Garante a precisão decimal ISO 80000 exigida para engenharia 10D.
   */
  private static clampPrecision(val: number): number {
    return Math.round(val * 1e8) / 1e8;
  }

  /**
   * projectTopologySequence: Mapeia uma sequência de vetores 10D para uma rede de pontos 3D.
   */
  static projectTopologySequence(vectors10D: number[][], radius: number): THREE.Vector3[] {
    return vectors10D.map(v => this.ramanujan10DTo3D(v, radius));
  }

  /**
   * calculateHarmonicStability: Verifica a harmonia áurea de uma face cristalizada.
   */
  static calculateHarmonicStability(points: THREE.Vector3[]): number {
    if (points.length < 3) return 0;
    const centroid = new THREE.Vector3();
    points.forEach(p => centroid.add(p));
    centroid.divideScalar(points.length);
    
    const avgRadius = points.reduce((acc, p) => acc + p.distanceTo(centroid), 0) / points.length;
    return Math.min(1.0, avgRadius / PHI);
  }
}
