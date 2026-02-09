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
    // Navegação Simples (1-Clique)
    onNav(e.point);
  };

  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    
    const camDist = camera.position.length();
    const targetPoint = e.point.clone();

    // Raycasting Híbrido:
    // Se a câmera estiver fora, projetamos o ponto na casca da esfera.
    // Se estiver dentro (zoom in), mantemos o ponto exato da colisão (guides internos).
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
    >
      <sphereGeometry args={[radius, 64, 64]} />
      <meshBasicMaterial 
        side={THREE.DoubleSide} 
        transparent 
        opacity={precisionLines ? 0.04 : 0.005} 
        color="#ffb000"
        depthWrite={false}
      />
    </mesh>
  );
};
