import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useDisposable } from '../../hooks/useDisposable';

interface GeometryStagingProps {
  points: THREE.Vector3[];
  isClosed: boolean;
  radius: number;
  color?: string;
}

export const GeometryStaging: React.FC<GeometryStagingProps> = ({ 
  points, 
  isClosed, 
  radius, 
  color = "#ffb000" 
}) => {
  const lineRef = useRef<THREE.Line>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useDisposable(lineRef);
  useDisposable(meshRef);

  const activeLine = useMemo(() => new THREE.Line(), []);

  const vertices = useMemo(() => {
    if (points.length < 2) return new Float32Array(0);
    const v3Points = [...points];
    if (isClosed && points.length > 2) {
      v3Points.push(points[0].clone());
    }
    const positions = new Float32Array(v3Points.length * 3);
    v3Points.forEach((v, i) => {
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    });
    return positions;
  }, [points, isClosed]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    if (vertices.length > 0) {
      geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    }
    return geo;
  }, [vertices]);

  if (points.length < 1) return null;

  return (
    <group name="BIM_STAGING_LAYER">
      <primitive object={activeLine} ref={lineRef}>
        <primitive object={lineGeometry} attach="geometry" />
        <lineBasicMaterial 
          color={color} 
          linewidth={2} 
          transparent 
          opacity={0.8} 
          depthTest={false} 
        />
      </primitive>
      {isClosed && points.length >= 3 && (
        <mesh ref={meshRef}>
          <primitive object={lineGeometry} attach="geometry" />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.2} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      {points.map((p, i) => (
        <mesh key={`node-${i}`} position={p}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial color={i === 0 ? "#00ffff" : color} />
        </mesh>
      ))}
    </group>
  );
};