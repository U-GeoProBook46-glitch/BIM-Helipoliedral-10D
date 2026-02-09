import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useDisposable } from '../../hooks/useDisposable';

interface LatheSolidProps {
  points: THREE.Vector3[];
  angle: number; 
  color?: string;
}

export const LatheSolidRenderer: React.FC<LatheSolidProps> = ({ points, angle, color = "#ffb000" }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useDisposable(meshRef);

  const geometry = useMemo(() => {
    if (points.length < 2) return null;
    const points2d = points.map(p => {
        const radius = Math.sqrt(p.x * p.x + p.z * p.z);
        return new THREE.Vector2(radius, p.y);
    });
    const segments = 64; 
    const phiLength = (angle * Math.PI) / 180;
    try {
        return new THREE.LatheGeometry(points2d, segments, 0, phiLength);
    } catch (e) {
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
      />
    </mesh>
  );
};