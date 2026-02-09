
import { CoordinatePolar } from '../../types';

/**
 * BIM-Helipoliedral 10D: Geometry Generators
 * Implementa algoritmos de geração de malhas e curvas harmônicas baseadas na Métrica de Ramanujan.
 */
export const GeometryGenerators = {
  /**
   * generateSpiralHelix: Gerador de Escala Caracol / Hélice
   * Ideal para escadas helicoidais e dutos técnicos em domínios BIM/AUTO.
   */
  generateSpiralHelix: (
    turns: number = 2,
    totalHeight: number = Math.PI / 2, // Delta Phi
    startPhi: number = Math.PI / 4,
    startTheta: number = 0,
    pointsPerTurn: number = 24
  ): CoordinatePolar[] => {
    const points: CoordinatePolar[] = [];
    const totalPoints = Math.floor(turns * pointsPerTurn);

    for (let i = 0; i <= totalPoints; i++) {
      const progress = i / totalPoints;
      points.push({
        theta: startTheta + (progress * turns * 2 * Math.PI),
        phi: startPhi + (progress * totalHeight),
        radius: 1
      });
    }
    return points;
  },

  /**
   * generateLattice: Gerador de Lattice (Grade de Reforço)
   * Cria uma malha de pontos tipo treliça para reforço estrutural helipoliedral.
   */
  generateLattice: (
    centerTheta: number = 0,
    centerPhi: number = Math.PI / 2,
    size: number = 0.5,
    resolution: number = 4
  ): CoordinatePolar[] => {
    const points: CoordinatePolar[] = [];
    const step = size / (resolution - 1);

    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        points.push({
          theta: centerTheta + (i * step) - (size / 2),
          phi: centerPhi + (j * step) - (size / 2),
          radius: 1
        });
      }
    }
    return points;
  }
};
