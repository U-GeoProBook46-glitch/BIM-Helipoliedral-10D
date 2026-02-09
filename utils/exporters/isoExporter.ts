import * as THREE from 'three';
import { StagedObject } from '../../types';

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
 * ISO Visualizer Engine
 * Especializado em projeções documentais 2D para pranchas técnicas.
 */
export class ISOVisualizer {
  /**
   * projectToSvg: Projeta coordenadas 3D em um plano 2D ortográfico.
   */
  static projectToSvg(points: [number, number, number][], sectorId: number): string {
    return points.map(p => {
      // Deslocamento de setor para múltiplas vistas na mesma prancha
      const x = p[0]! + (sectorId * 60); 
      const y = p[1]!;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
  }
}

export const generateISOBoardSVG = (obj: StagedObject): string => {
  const pointsStr = ISOVisualizer.projectToSvg(obj.points, 0);
  return `
    <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0a0800" />
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a1400" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      <text x="20" y="40" fill="#ffb000" font-family="monospace" font-size="12" font-weight="bold">ISO 80000 TECHNICAL DOCUMENT | ${obj.id}</text>
      <text x="20" y="55" fill="#443300" font-family="monospace" font-size="8">BIM-HELIPOLIEDRAL 10D KERNEL v13.5</text>
      
      <polyline points="${pointsStr}" fill="none" stroke="#ffb000" stroke-width="1.2" stroke-dasharray="4,2" />
      
      <g transform="translate(20, 540)">
        <text y="0" fill="#8a5d00" font-family="monospace" font-size="9">DOMAIN: ${obj.domain} | SCALE: ${obj.subFolder}</text>
        <text y="15" fill="#8a5d00" font-family="monospace" font-size="9">DfD RECOVERY SCORE: ${obj.recoveryScore.toFixed(4)}</text>
        <text y="30" fill="#8a5d00" font-family="monospace" font-size="9">TIMESTAMP: ${new Date(obj.timestamp).toISOString()}</text>
      </g>
      
      <line x1="20" y1="525" x2="780" y2="525" stroke="#1a1400" stroke-width="1" />
      <text x="780" y="580" fill="#221100" font-family="monospace" font-size="8" text-anchor="end">RAMANUJAN PROJECTION SYSTEM v13.5</text>
    </svg>
  `;
};
