import React from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { AppMode, RenderMode, Manifestation, StagedObject, AssemblyInstance, ISODomain } from '../../types';
import { generateCurvePoints } from '../../utils/math/geometry';
import { InstanceManager } from '../scene/InstanceManager';
import { GeometryStaging } from '../scene/GeometryStaging';
import { InternalPlanarGuides } from '../scene/InternalPlanarGuides';
import { LatheSolidRenderer } from '../scene/LatheSolidRenderer';

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
    revolutionAngle: number;
    navTarget: THREE.Vector3;
  };
  uiState: {
    status: string;
    currentManifestation: Manifestation;
    currentRenderMode: RenderMode;
  };
  onClick: (p: THREE.Vector3) => void;
  onNav: (p: THREE.Vector3) => void;
  onDoubleClick?: () => void;
}

export const SceneContent: React.FC<SceneContentProps> = ({ state, uiState, onClick, onNav, onDoubleClick }) => {
  const { mouse, raycaster, camera } = useThree();

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    const intersectionPoint = e.point;

    // LÓGICA SOBERANA: 1-CLIQUE = FOCO, 2-CLIQUES = DESENHO
    if (e.detail === 1) {
      onNav(intersectionPoint);
    } else if (e.detail === 2) {
      const projectedPoint = intersectionPoint.clone().normalize().multiplyScalar(state.activeRadius);
      onClick(projectedPoint);
    }
  };

  return (
    <>
      <color attach="background" args={["#030200"]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffb000" />
      <pointLight position={state.navTarget} intensity={0.5} color="#00ff41" distance={20} />
      
      {/* Esfera de Interação - Atua como o 'Mecanismo de Arrastre' do Lathe */}
      <mesh onPointerDown={handlePointerDown}>
        <sphereGeometry args={[state.activeRadius, 64, 64]} />
        <meshBasicMaterial 
          color="#ffb000" 
          wireframe 
          transparent 
          opacity={state.precisionLines ? 0.04 : 0.005} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <InternalPlanarGuides radius={state.activeRadius} visible={state.precisionLines} />

      {/* Sólido de Revolução Anti-Espiral */}
      {state.points.length >= 2 && (
        <LatheSolidRenderer 
            points={state.points} 
            angle={state.revolutionAngle} 
            color="#ffb000" 
        />
      )}

      {/* Rascunho Geométrico e Faces Estagiadas */}
      <GeometryStaging 
        points={state.points} 
        isClosed={state.isClosed} 
        radius={state.activeRadius} 
        color="#ffb000"
      />

      {state.stagedFaces.map((face, fi) => (
        <group key={`staged-${fi}`}>
          {face.map((p, i) => {
            if (i === 0) return null;
            const pts = uiState.currentRenderMode === RenderMode.Euclidian 
              ? [face[i-1], p] 
              : generateCurvePoints(face[i-1], p, state.activeRadius);
            return (
              <line key={`face-l-${fi}-${i}`}>
                <bufferGeometry attach="geometry" onUpdate={s => s.setFromPoints(pts)} />
                <lineBasicMaterial color="#00ff41" transparent opacity={0.3} />
              </line>
            );
          })}
        </group>
      ))}

      <InstanceManager data={state.instances} />

      <Stars radius={300} count={2000} factor={4} saturation={1} fade speed={0.5} />
      <Grid 
        infiniteGrid 
        fadeDistance={150} 
        sectionColor="#221100" 
        cellColor="#050400" 
        sectionThickness={1}
        cellThickness={0.5}
      />

      <OrbitControls 
        makeDefault 
        minDistance={0.1} 
        maxDistance={800} 
        target={state.navTarget}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
};