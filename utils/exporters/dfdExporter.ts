import * as THREE from 'three';
import { AssemblyInstance } from '../../types';

/**
 * ISO 8887-1: Technical product documentation - Design for manufacturing, assembling, disassembling.
 * Gera um SVG "Explodido" para instrução de desmontagem.
 */
export const generateDfDSVG = (instance: AssemblyInstance, points: [number, number, number][]): string => {
  const width = 800;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Vetor normal de explosão (direção da retirada)
  const normal = instance.position.clone().normalize();
  const explosionFactor = 50;

  const projectedPoints = points.map(p => {
    const v = new THREE.Vector3(p[0], p[1], p[2]);
    // Aplica o deslocamento de explosão
    const exploded = v.add(normal.clone().multiplyScalar(explosionFactor));
    return {
      x: centerX + exploded.x * 5,
      y: centerY - exploded.y * 5,
      z: exploded.z
    };
  });

  const pathData = projectedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  
  // Linhas de trajetória (Tracejadas conforme ISO 128)
  const trajectoryLines = projectedPoints.map(p => {
    const originalX = p.x - normal.x * explosionFactor * 5;
    const originalY = p.y + normal.y * explosionFactor * 5;
    return `<line x1="${originalX}" y1="${originalY}" x2="${p.x}" y2="${p.y}" stroke="#444" stroke-dasharray="5,5" />`;
  }).join('');

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#050505" />
      <text x="20" y="40" fill="#ffb000" font-family="monospace" font-size="14" font-weight="bold">ISO 8887-1: DISASSEMBLY PROTOCOL</text>
      <text x="20" y="65" fill="#666" font-family="monospace" font-size="10">COMPONENT ID: ${instance.id}</text>
      
      <g opacity="0.4">
        ${trajectoryLines}
      </g>
      
      <path d="${pathData}" fill="none" stroke="#00ff41" stroke-width="2" />
      
      <g transform="translate(20, 520)">
        <text y="0" fill="#ffb000" font-family="monospace" font-size="10">TOOL: ${instance.dfd.disassemblyTool.toUpperCase()}</text>
        <text y="15" fill="#ffb000" font-family="monospace" font-size="10">TYPE: ${instance.dfd.connectionType}</text>
        <text y="30" fill="#ffb000" font-family="monospace" font-size="10">RECYCLABILITY: ${(instance.dfd.recyclabilityIndex * 100).toFixed(0)}%</text>
      </g>
      
      <text x="780" y="580" fill="#222" font-family="monospace" font-size="8" text-anchor="end">BIM-HELIPOLIEDRAL KERNEL v13.5</text>
    </svg>
  `;
};