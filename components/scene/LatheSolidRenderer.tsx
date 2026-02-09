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
 * Converte perfis polares/cartesianos em volumes sólidos de revolução.
 * Utiliza o shader "Mock Theta" para feedback técnico harmônico.
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

  // Geração de Geometria de Revolução (Lathe)
  const geometry = useMemo(() => {
    if (points.length < 2) return null;
    
    // Projeção do Perfil no Plano 2D (Radial-Y)
    const points2d = points.map(p => {
        // O raio (X no plano Lathe) é a distância horizontal ao centro
        const radius = Math.sqrt(p.x * p.x + p.z * p.z);
        return new THREE.Vector2(radius, p.y);
    });

    const segments = 48; // Ramanujan Multiplier (2 * 24)
    const phiLength = (angle * Math.PI) / 180;
    
    try {
        const geo = new THREE.LatheGeometry(points2d, segments, 0, phiLength);
        geo.computeVertexNormals();
        return geo;
    } catch (e) {
        console.error("Lathe Construction Error:", e);
        return null;
    }
  }, [points, angle]);

  // Animação do Material "Mock Theta" (Pulsação Harmônica)
  useFrame((state) => {
    if (matRef.current) {
      const time = state.clock.getElapsedTime();
      const pulse = 0.5 + 0.5 * Math.sin(time * 3);
      matRef.current.emissiveIntensity = isGhost ? 0.05 + pulse * 0.1 : 0.1 + pulse * 0.2;
      
      if (isGhost) {
        matRef.current.opacity = 0.2 + pulse * 0.1;
      }
    }
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        ref={matRef}
        color={color} 
        side={THREE.DoubleSide} 
        transparent 
        opacity={isGhost ? 0.3 : 0.6}
        metalness={0.9}
        roughness={0.1}
        emissive={color}
        emissiveIntensity={0.2}
        wireframe={isGhost}
      />
    </mesh>
  );
};