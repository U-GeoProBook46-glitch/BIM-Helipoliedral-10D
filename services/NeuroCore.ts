import { GeometryGenerators } from '../utils/math/generators';
import { StagedObject, CoordinatePolar } from '../types';
import { toVec3 } from '../utils/math/polar';
import { v4 as uuidv4 } from 'uuid';

/**
 * BIM-Helipoliedral 10D: NeuroCore (Sovereign Execution Engine)
 * ISO 80000-2 Compliance: Gestão de sistemas de coordenadas helipoliedrais.
 */
export const NeuroCoreService = {
  /**
   * calculateTopologyHash: Gera um DNA único baseado na distribuição de vértices.
   * Utilizado para validação de integridade no Handshake de Cristalização.
   * Garante a imutabilidade do ID durante o modo ghostMode.
   */
  calculateTopologyHash: (points: CoordinatePolar[]): string => {
    const dna = points.map(p => `${p.theta.toFixed(4)}${p.phi.toFixed(4)}${p.radius.toFixed(2)}`).join('|');
    let hash = 0;
    for (let i = 0; i < dna.length; i++) {
      hash = ((hash << 5) - hash) + dna.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).toUpperCase();
  },

  /**
   * transmuteIntentToGeometry: Converte Action Tokens JSON em StagedObjects.
   * Implementa a Proteção de Raio (Anti-Fail) e hibridização de dados.
   */
  transmuteIntentToGeometry: (data: any, radiusFactor: number | undefined): StagedObject | null => {
    if (data.action !== "DRAW_OBJECT" || !data.payload) return null;

    const payload = data.payload;
    let finalPolarPoints: CoordinatePolar[] = payload.points || [];

    const safeRadius = (radiusFactor && radiusFactor > 0) ? radiusFactor : 10.0;
    if (!radiusFactor || radiusFactor <= 0) {
      console.warn("[NeuroCore]: Warning - RadiusFactor undefined or invalid, defaulting to 10.0.");
    }

    if (payload.generatorCall) {
      const { function: funcName, params } = payload.generatorCall;
      try {
        if (funcName === "generateSpiralHelix") {
          finalPolarPoints = GeometryGenerators.generateSpiralHelix(
            params?.turns, params?.totalHeight, params?.startPhi, params?.startTheta
          );
        } else if (funcName === "generateLattice") {
          finalPolarPoints = GeometryGenerators.generateLattice(
            params?.centerTheta, params?.centerPhi, params?.size, params?.resolution
          );
        }
      } catch (e) {
        console.error("[NeuroCore]: Generator failure", e);
      }
    }

    if (finalPolarPoints.length === 0) return null;

    const cartesianPoints = finalPolarPoints.map((p: CoordinatePolar) => {
      const v = toVec3((p.radius || 1) * safeRadius, p.theta, p.phi);
      return [v.x, v.y, v.z] as [number, number, number];
    });

    const isLathe = payload.manifestation === 'Volume' || !!payload.revolutionAngle;
    // O ID deve ser gerado de forma determinística via hash da topologia
    const topologyId = NeuroCoreService.calculateTopologyHash(finalPolarPoints);

    return {
      id: `ISO-${topologyId}`,
      name: payload.name || `SYNTH-${topologyId.slice(0, 4)}`,
      points: cartesianPoints,
      polarInstructions: finalPolarPoints,
      layer: payload.baseLayer || (safeRadius / 2.5),
      domain: payload.domain || 'BIM',
      subFolder: 'm',
      description: payload.description || "Sovereign Synthesis via NeuroCore",
      recoveryScore: 0.95,
      timestamp: Date.now(),
      unit: 'm',
      revolutionAngle: payload.revolutionAngle ?? 360,
      isLathe: isLathe,
      ghostMode: true,
      origin: 'NEURO_CORE' // Identificador crucial para a Ponte de Reconciliação
    };
  }
};