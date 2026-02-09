import { GeometryGenerators } from '../utils/math/generators';
import { StagedObject, CoordinatePolar } from '../types';
import { toVec3 } from '../utils/math/polar';
import { v4 as uuidv4 } from 'uuid';

/**
 * BIM-Helipoliedral 10D: NeuroCore
 * Sistema de tradução e execução de intenções geométricas.
 */
export const NeuroCoreService = {
  transmuteIntentToGeometry: (data: any, radiusFactor: number): StagedObject | null => {
    if (data.action !== "DRAW_OBJECT" || !data.payload) return null;

    const payload = data.payload;

    // Processamento de chamadas de geradores procedurais
    if (payload.generatorCall) {
      const { function: funcName, params } = payload.generatorCall;
      
      let generatedPoints: CoordinatePolar[] = [];
      if (funcName === "generateSpiralHelix") {
        generatedPoints = GeometryGenerators.generateSpiralHelix(
          params.turns || 2,
          params.totalHeight || Math.PI / 4,
          params.startPhi || Math.PI / 2,
          params.startTheta || 0
        );
      } else if (funcName === "generateLattice") {
        generatedPoints = GeometryGenerators.generateLattice(
          params.centerTheta || 0,
          params.centerPhi || Math.PI / 2,
          params.size || 0.5,
          params.resolution || 3
        );
      }
      
      if (generatedPoints.length > 0) {
        payload.points = generatedPoints;
      }
    }

    if (!payload.points || !Array.isArray(payload.points)) return null;

    // Conversão Polar -> Cartesiano
    const cartesianPoints = payload.points.map((p: any) => {
      const v = toVec3((p.radius || 1) * radiusFactor, p.theta, p.phi);
      return [v.x, v.y, v.z] as [number, number, number];
    });

    return {
      id: payload.id || `ISO-SYNTH-${uuidv4().slice(0, 8).toUpperCase()}`,
      name: payload.id?.split('-')[0] || "AI_SYNTH_OBJECT",
      points: cartesianPoints,
      layer: payload.baseLayer || 32.5,
      domain: payload.domain || 'BIM',
      subFolder: 'm',
      description: payload.description || "Synthesized via NeuroCore Service",
      recoveryScore: 0.98,
      timestamp: Date.now(),
      unit: 'm',
      revolutionAngle: payload.revolutionAngle ?? 360
    };
  }
};
