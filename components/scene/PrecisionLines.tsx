import React, { useRef } from 'react';
import * as THREE from 'three';
import { useDisposable } from '../../hooks/useDisposable';

interface InternalGuidesProps {
  radius: number;
  visible: boolean;
}

export const PrecisionLines: React.FC<InternalGuidesProps> = ({ radius, visible }) => {
  const groupRef = useRef<THREE.Group>(null);
  useDisposable(groupRef);

  if (!visible) return null;

  return (
    <group ref={groupRef} name="INTERNAL_PRECISION_AXIS">
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
      <primitive object={new THREE.AxesHelper(radius * 0.15)} />
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffb000" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};
