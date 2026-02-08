import React from 'react';
import * as THREE from 'three';

interface InternalGuidesProps {
  radius: number;
  visible: boolean;
}

/**
 * INTERNAL_PLANAR_GUIDES
 * Kernel BIM-Helipoliedral 10D: Referenciamento Axial Interno.
 * Fornece guias visuais nos planos XZ e XY para alinhamento com a origem.
 */
export const InternalPlanarGuides: React.FC<InternalGuidesProps> = ({ radius, visible }) => {
  if (!visible) return null;

  return (
    <group name="INTERNAL_PRECISION_AXIS">
      {/* Plano Horizontal (Eixo XZ) - Verde Neon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshBasicMaterial 
          color="#00ff41" 
          wireframe 
          transparent 
          opacity={0.1} 
          depthWrite={false}
        />
      </mesh>

      {/* Plano Vertical (Eixo XY) - Cyan */}
      <mesh rotation={[0, 0, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshBasicMaterial 
          color="#00ffff" 
          wireframe 
          transparent 
          opacity={0.1} 
          depthWrite={false}
        />
      </mesh>

      {/* Cruz de Eixos Centrais (Kernel Origin Marker) */}
      <primitive object={new THREE.AxesHelper(radius * 0.15)} />
      
      {/* Ponto Zero Central */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffb000" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};