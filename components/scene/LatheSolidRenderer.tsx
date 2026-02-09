import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useDisposable } from '../../hooks/useDisposable';

interface LatheSolidProps {
  points: THREE.Vector3[];
  angle: number; 
  color?: string;
  isGhost?: boolean;
}

/**
 * BIM-Helipoliedral 10D: Lathe Solid Renderer
 * Motor de revolução 3D baseado na Assinatura de Ramanujan.
 * Suporta 'ghostMode' para objetos sintetizados via AI (Vibe Coding).
 * Compliance ISO 9241: Feedback visual de estado de sistema via shader pulsante.
 */
export const LatheSolidRenderer: React.FC<LatheSolidProps> = ({ 
  points, 
  angle, 
  color = "#ffb000",
  isGhost = false 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  useDisposable(meshRef);

  const geometry = useMemo(() => {
    if (points.length < 2) return null;
    const points2d = points.map(p => {
        // ISO 80000-2: Projeção de raio radial no plano Y (Eixo de Revolução)
        const radialDist = Math.sqrt(p.x * p.x + p.z * p.z);
        return new THREE.Vector2(radialDist, p.y);
    });
    // Menos segmentos no ghostMode para maior fluidez de preview
    const segments = isGhost ? 32 : 64; 
    const phiLength = (angle * Math.PI) / 180;
    try {
        const geo = new THREE.LatheGeometry(points2d, segments, 0, phiLength);
        geo.computeVertexNormals();
        return geo;
    } catch (e) {
        console.error("LATHE_STABILITY_FAILURE:", e);
        return null;
    }
  }, [points, angle, isGhost]);

  useFrame((state) => {
    if (matRef.current) {
      const time = state.clock.getElapsedTime();
      // Pulsação Harmônica baseada em PHI (1.618) para feedback orgânico
      const pulse = 0.5 + 0.5 * Math.sin(time * 1.618);
      
      // Emissão pulsante para o Ghost
      matRef.current.emissiveIntensity = isGhost ? 0.05 + pulse * 0.15 : 0.1 + pulse * 0.4;
      
      if (isGhost) {
        // REQUISITO: Opacidade 0.5 com variação harmônica para o fantasma
        matRef.current.opacity = 0.45 + pulse * 0.1;
      }
    }
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        ref={matRef}
        color={isGhost ? "#ffb000" : color} // REQUISITO: Cor Âmbar forçada no ghostMode
        side={THREE.DoubleSide} 
        transparent 
        opacity={isGhost ? 0.5 : 0.8}
        metalness={isGhost ? 0.4 : 0.9}
        roughness={isGhost ? 0.6 : 0.1}
        emissive={isGhost ? "#ffb000" : color}
        emissiveIntensity={0.2}
        wireframe={isGhost} // Opcional: wireframe ajuda na visualização de "fantasma"
      />
    </mesh>
  );
};