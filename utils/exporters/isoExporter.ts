import * as THREE from 'three';
import { StagedObject } from '../../types';

/**
 * @service UnitFormatter
 * Conformidade com ISO/IEC 80000 para formatação SI
 */
export class UnitFormatter {
  static formatMeasure(value: number, unit: 'm' | 'mm' | 'm2' | 'm3'): string {
    const precision = 3; 
    const formattedValue = value.toFixed(precision);
    const unitMap: Record<string, string> = {
      'm': 'm',
      'mm': 'mm',
      'm2': 'm²',
      'm3': 'm³'
    };
    return `${formattedValue} ${unitMap[unit]}`;
  }
}

/**
 * @service ProjectionEngine
 * Converte hiperesfera Ramanujan para plano técnico SVG
 */
export class ProjectionEngine {
  static projectToSvg(points: [number, number, number][], sectorId: number): string {
    return points.map(p => {
      // Projeção Mercator-like para planificação de face
      const x = p[0] + (sectorId * 50); 
      const y = p[1];
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
  }
}

export const generateISOBoardSVG = (obj: StagedObject): string => {
  const pointsStr = ProjectionEngine.projectToSvg(obj.points, 0);
  return `
    <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0a0800" />
      <text x="20" y="40" fill="#ffb000" font-family="monospace" font-size="12">ISO 80000 TECHNICAL BOARD | ${obj.id}</text>
      <polyline points="${pointsStr}" fill="none" stroke="#ffb000" stroke-width="1" stroke-dasharray="4,2" />
      <text x="20" y="560" fill="#8a5d00" font-family="monospace" font-size="10">SCALE: ${obj.subFolder} | DfD SCORE: ${obj.recoveryScore}</text>
    </svg>
  `;
};