
import { GeometryGenerators } from '../utils/math/generators';
import { StagedObject, CoordinatePolar } from '../types';
import { toVec3 } from '../utils/math/polar';
import { v4 as uuidv4 } from 'uuid';

/**
 * BIM-Helipoliedral 10D: NeuroCore (Sovereign Execution Engine)
 * Responsável pela transmutação determinística de intenções de IA em geometria.
 * ISO 80000-2 Compliance: Gestão de sistemas de coordenadas helipoliedrais.
 */
export const NeuroCoreService = {
  /**
   * transmuteIntentToGeometry: Converte Action Tokens JSON em StagedObjects.
   * Implementa a Proteção de Raio (Anti-Fail) e hibridização de dados.
   */
  transmuteIntentToGeometry: (data: any, radiusFactor: number | undefined): StagedObject | null => {
    // Validação estrita do protocolo de ação
    if (data.action !== "DRAW_OBJECT" || !data.payload) return null;

    const payload = data.payload;
    let finalPolarPoints: CoordinatePolar[] = payload.points || [];

    // Proteção de Raio (Anti-Fail): Garante que o radiusFactor nunca seja zero ou nulo
    const safeRadius = (radiusFactor && radiusFactor > 0) ? radiusFactor : 10.0;
    if (!radiusFactor || radiusFactor <= 0) {
      console.warn("[NeuroCore]: Warning - RadiusFactor undefined or invalid, defaulting to 10.0.");
    }

    // Processamento de chamadas procedurais (Vibe Coding Generators)
    if (payload.generatorCall) {
      const { function: funcName, params } = payload.generatorCall;
      
      try {
        if (funcName === "generateSpiralHelix") {
          finalPolarPoints = GeometryGenerators.generateSpiralHelix(
            params?.turns,
            params?.totalHeight,
            params?.startPhi,
            params?.startTheta
          );
        } else if (funcName === "generateLattice") {
          finalPolarPoints = GeometryGenerators.generateLattice(
            params?.centerTheta,
            params?.centerPhi,
            params?.size,
            params?.resolution
          );
        }
      } catch (e) {
        console.error("[NeuroCore]: Procedural Generator Failure", e);
      }
    }

    if (finalPolarPoints.length === 0) return null;

    // Hibridização de Dados: Cartesian (Rendering) + Polar (Precision)
    // ISO 80000-2: Conversão para espaço cartesiano 3D para o motor Three.js
    const cartesianPoints = finalPolarPoints.map((p: CoordinatePolar) => {
      // O radius em p.radius é um multiplicador (escala local 0.0 a 1.0)
      const v = toVec3((p.radius || 1) * safeRadius, p.theta, p.phi);
      return [v.x, v.y, v.z] as [number, number, number];
    });

    const isLathe = payload.manifestation === 'Volume' || !!payload.revolutionAngle;

    return {
      id: payload.id || `ISO-SYNTH-${uuidv4().slice(0, 8).toUpperCase()}`,
      name: payload.name || "AI_SYNTH_OBJECT",
      points: cartesianPoints,
      polarInstructions: finalPolarPoints, // Preserva a integridade polar ramanujiana
      layer: payload.baseLayer || (safeRadius / 2.5),
      domain: payload.domain || 'BIM',
      subFolder: 'm',
      description: payload.description || "Sovereign Synthesis via NeuroCore",
      recoveryScore: 0.95,
      timestamp: Date.now(),
      unit: 'm',
      revolutionAngle: payload.revolutionAngle ?? 360,
      isLathe: isLathe,
      ghostMode: true // Define como fantasma para renderização de preview
    };
  }
};
