
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useDisposable } from '../../hooks/useDisposable';

interface GeometryStagingProps {
  points: THREE.Vector3[];
  isClosed: boolean;
  radius: number;
  color?: string;
}

/**
 * COMPONENTE DE ALTA PERFORMANCE PARA RASCUNHO GEOMÉTRICO
 * Utiliza BufferGeometry dinâmica para evitar instâncias infinitas e garantir limpeza de GPU.
 */
export const GeometryStaging: React.FC<GeometryStagingProps> = ({ 
  points, 
  isClosed, 
  radius, 
  color = "#ffb000" 
}) => {
  const lineRef = useRef<THREE.Line>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Garantir descarte imediato de recursos ao desmontar ou resetar rascunho
  useDisposable(lineRef);
  useDisposable(meshRef);

  // 1. Gerar os vértices a partir do estado de pontos snapped (Cartesianos)
  const vertices = useMemo(() => {
    if (points.length < 2) return new Float32Array(0);
    
    const v3Points = [...points];
    
    // Se a face estiver fechada, conectamos ao primeiro ponto
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

  // 2. Criar Geometria de Linha (Estrutura de Precisão)
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
      {/* Esqueleto do rascunho (Wireframe ativo) */}
      {/* Fix: Explicitly cast ref to any to resolve conflict between Three.js and SVG line element types */}
      <line ref={lineRef as any} geometry={lineGeometry}>
        <lineBasicMaterial 
          color={color} 
          linewidth={2} 
          transparent 
          opacity={0.8} 
          depthTest={false} 
        />
      </line>

      {/* Pele temporária / Ghost Mesh (Visualização de Face) */}
      {isClosed && points.length >= 3 && (
        <mesh ref={meshRef}>
          <bufferGeometry attach="geometry" {...lineGeometry} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.2} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Indicadores de Vértice (Node Snap Markers) */}
      {points.map((p, i) => (
        <mesh key={`node-${i}`} position={p}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial color={i === 0 ? "#00ffff" : color} />
        </mesh>
      ))}
    </group>
  );
};
