import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useDisposable } from '../../hooks/useDisposable';

interface InteractionSurfaceProps {
  radius: number;
  onPoint: (p: THREE.Vector3) => void;
  onNav: (p: THREE.Vector3) => void;
  precisionLines: boolean;
}

/**
 * BIM-Helipoliedral 10D: Interaction Kernel
 * Implementa Raycasting Híbrido conforme proximidade r da câmera ao centro.
 */
export const InteractionSurface: React.FC<InteractionSurfaceProps> = ({ 
  radius, 
  onPoint, 
  onNav, 
  precisionLines 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  useDisposable(meshRef);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    // Navegação e Foco do Kernel
    onNav(e.point);
  };

  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    
    const camDist = camera.position.length();
    const targetPoint = e.point.clone();

    // Raycasting Híbrido:
    // Se a câmera estiver fora (r > R), projetamos o ponto na casca da esfera (Desenho Externo).
    // Se estiver dentro (r < R), mantemos o ponto exato da colisão (Desenho Interno de Cavidades).
    if (camDist > radius) {
      targetPoint.normalize().multiplyScalar(radius);
    }

    onPoint(targetPoint);
  };

  return (
    <mesh 
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      visible={true}
      name="KERNEL_INTERACTION_ZONE"
    >
      <sphereGeometry args={[radius, 64, 64]} />
      <meshBasicMaterial 
        side={THREE.DoubleSide} 
        transparent 
        opacity={precisionLines ? 0.08 : 0.01} 
        color="#ffb000"
        depthWrite={false}
        wireframe={precisionLines}
      />
    </mesh>
  );
};
