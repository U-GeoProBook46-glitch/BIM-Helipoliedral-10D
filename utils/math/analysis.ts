import { Vector3 } from 'three';
import { AssemblyInstance, ConnectionType } from '../../types';

/**
 * ISO 20887: Design for Disassembly and Adaptability.
 * Calcula o score de recuperabilidade baseado no tipo de conexão e acessibilidade.
 */
export const calculateRecoverabilityScore = (instance: AssemblyInstance, allInstances: AssemblyInstance[]): number => {
  const connectionWeights: Record<ConnectionType, number> = {
    'MECHANICAL_BOLT': 1.0,
    'GRAVITY_FIT': 0.9,
    'WELDED': 0.3,
    'CHEMICAL_GLUE': 0.1
  };

  const baseScore = connectionWeights[instance.dfd.connectionType];
  
  // Detecção de obstrução (Clash Detection simplificado para ISO 20887)
  // Verifica se existem peças em raios superiores na mesma zona angular (obstruindo a retirada)
  let obstructionPenalty = 1.0;
  const radius = instance.position.length();
  
  allInstances.forEach(other => {
    if (other.id === instance.id) return;
    const otherRadius = other.position.length();
    
    // Se a outra peça está mais "para fora" (raio maior) e próxima angularmente
    if (otherRadius > radius + 1) {
      const angle = instance.position.angleTo(other.position);
      if (angle < 0.2) { // ~11 graus de proximidade angular
        obstructionPenalty *= 0.8; // Penaliza acessibilidade
      }
    }
  });

  return baseScore * obstructionPenalty * instance.dfd.accessibilityLevel;
};

export const analyzeDisassembly = (points: Vector3[]): number => {
  const complexity = points.length;
  // ISO 19650: Gerenciamento de informação no ciclo de vida
  return Math.max(0.1, Math.min(1.0, 1 / (complexity * 0.05)));
};

export const calculateVolume = (points: Vector3[], radius: number): number => {
  const area = points.length > 2 ? 0.5 : 0; 
  return area * radius * 0.1;
};