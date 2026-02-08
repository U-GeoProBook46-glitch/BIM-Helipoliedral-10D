
import React from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { AppMode, RenderMode, Manifestation, StagedObject, AssemblyInstance, ISODomain } from '../../types';
import { generateCurvePoints } from '../../utils/math/geometry';
import { InstanceManager } from '../scene/InstanceManager';
import { GeometryStaging } from '../scene/GeometryStaging';

interface SceneContentProps {
  state: {
    mode: AppMode;
    layer: number;
    points: THREE.Vector3[];
    stagedFaces: THREE.Vector3[][];
    isClosed: boolean;
    precisionLines: boolean;
    stagedObjects: StagedObject[];
    instances: AssemblyInstance[];
    selectedBlueprintId: string | null;
    activeRadius: number;
    currentDomain: ISODomain | null;
  };
  uiState: {
    status: string;
    currentManifestation: Manifestation;
    currentRenderMode: RenderMode;
  };
  onClick: (p: THREE.Vector3) => void;
  onDoubleClick?: () => void;
}

export const SceneContent: React.FC<SceneContentProps> = ({ state, uiState, onClick, onDoubleClick }) => {
  const { mouse, raycaster, camera } = useThree();

  const handlePointerDown = (e: any) => {
    if (e.detail === 2 && onDoubleClick) {
      onDoubleClick();
      return;
    }
    
    raycaster.setFromCamera(mouse, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectPoint);
    
    const projectedPoint = intersectPoint.clone().normalize().multiplyScalar(state.activeRadius);
    onClick(projectedPoint);
  };

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 10]} intensity={2} color="#ffb000" />
      
      {/* Esfera de Precisão / Superfície de Interação */}
      <mesh onPointerDown={handlePointerDown}>
        <sphereGeometry args={[state.activeRadius, 64, 64]} />
        <meshBasicMaterial 
          color="#ffb000" 
          wireframe 
          transparent 
          opacity={state.precisionLines ? 0.06 : 0.01} 
          depthWrite={false}
        />
      </mesh>

      {/* Faces Estagiadas (Topologia em Cache) */}
      {state.stagedFaces.map((face, fi) => (
        <group key={`staged-group-${fi}`}>
          {face.map((p, i) => {
            if (i === 0) return null;
            const pts = uiState.currentRenderMode === RenderMode.Euclidian 
              ? [face[i-1], p] 
              : generateCurvePoints(face[i-1], p, state.activeRadius);
            return (
              <line key={`face-${fi}-line-${i}`}>
                <bufferGeometry attach="geometry" onUpdate={self => self.setFromPoints(pts)} />
                <lineBasicMaterial color="#ff6600" transparent opacity={0.5} linewidth={1} />
              </line>
            );
          })}
        </group>
      ))}

      {/* Rascunho Geométrico Otimizado (Pontos e Linhas Ativas) */}
      <GeometryStaging 
        points={state.points} 
        isClosed={state.isClosed} 
        radius={state.activeRadius} 
        color="#ffb000"
      />

      {/* Instâncias de Montagem (Assembly) */}
      <InstanceManager data={state.instances} />

      <Stars radius={200} count={5000} factor={4} saturation={0} fade speed={1} />
      <Grid 
        infiniteGrid 
        fadeDistance={100} 
        sectionColor="#443300" 
        cellColor="#0a0800" 
        sectionThickness={1}
        cellThickness={0.5}
      />
      <OrbitControls makeDefault minDistance={5} maxDistance={500} />
    </>
  );
};
