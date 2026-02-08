import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useDisposable } from '../../hooks/useDisposable';

interface LatheSolidProps {
  points: THREE.Vector3[];
  angle: number; // 0 a 360
  color?: string;
}

/**
 * LATHE_SOLID_RENDERER v13.3.1
 * Garante a integridade do sólido de revolução utilizando projeção radial fixa.
 */
export const LatheSolidRenderer: React.FC<LatheSolidProps> = ({ points, angle, color = "#ffb000" }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useDisposable(meshRef);

  const geometry = useMemo(() => {
    if (points.length < 2) return null;
    
    // ANTI-ESPIRAL: Fixamos o raio em relação ao eixo Y
    const points2d = points.map(p => {
        const radius = Math.sqrt(p.x * p.x + p.z * p.z);
        return new THREE.Vector2(radius, p.y);
    });

    const segments = 64; // Maior fidelidade para curvaturas helipoliedrais
    const phiLength = (angle * Math.PI) / 180;

    try {
        const geo = new THREE.LatheGeometry(points2d, segments, 0, phiLength);
        return geo;
    } catch (e) {
        console.warn("Kernel Geo-Exception: Lathe points invalid", e);
        return null;
    }
  }, [points, angle]);

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        color={color} 
        side={THREE.DoubleSide} 
        transparent 
        opacity={0.45}
        metalness={0.9}
        roughness={0.1}
        emissive={color}
        emissiveIntensity={0.15}
        envMapIntensity={1}
      />
    </mesh>
  );
};