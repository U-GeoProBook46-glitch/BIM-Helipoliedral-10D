
import { StagedObject } from '../../../types';

export const generateTechnicalBoardSVG = (obj: StagedObject): string => {
  const width = 800;
  const height = 600;
  const pointsStr = obj.points.map(p => `${p[0] + 400},${p[1] + 300}`).join(' ');
  
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#050505" />
      <text x="20" y="40" fill="#00ff41" font-family="monospace" font-size="16">BIM-HELIPOLIEDRAL DOCUMENTATION</text>
      <text x="20" y="70" fill="#888" font-family="monospace" font-size="12">ID: ${obj.id}</text>
      <polyline points="${pointsStr}" fill="none" stroke="#00ff41" stroke-width="2" />
      <text x="20" y="550" fill="#00ff41" font-family="monospace" font-size="10">RECOVERY SCORE: ${obj.recoveryScore.toFixed(4)}</text>
    </svg>
  `;
};
