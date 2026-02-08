
import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { AppMode, RenderMode, Manifestation, StagedObject, AssemblyInstance, ISODomain } from '../../../types';
import { generateCurvePoints } from '../../utils/math/geometry';

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

const SceneContent: React.FC<SceneContentProps> = ({ state, uiState, onClick, onDoubleClick }) => {
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
    onClick(intersectPoint.clone().normalize().multiplyScalar(state.activeRadius));
  };

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 10]} intensity={2} color="#ffb000" />
      
      <mesh onPointerDown={handlePointerDown}>
        <sphereGeometry args={[state.activeRadius, 64, 64]} />
        <meshBasicMaterial color="#ffb000" wireframe transparent opacity={state.precisionLines ? 0.06 : 0} />
      </mesh>

      {/* Staged Faces - Shocking Orange/Amber Translucent */}
      {state.stagedFaces.map((face, fi) => (
        <group key={`staged-${fi}`}>
          {face.map((p, i) => {
            if (i === 0) return null;
            const pts = uiState.currentRenderMode === RenderMode.Euclidian ? [face[i-1], p] : generateCurvePoints(face[i-1], p, state.activeRadius);
            return (
              <line key={i}>
                <bufferGeometry attach="geometry" onUpdate={self => self.setFromPoints(pts)} />
                <lineBasicMaterial color="#ff6600" transparent opacity={0.4} linewidth={1} />
              </line>
            );
          })}
        </group>
      ))}

      {/* Active Points - High Intensity Amber */}
      {state.points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshStandardMaterial color="#ffb000" emissive="#ffb000" emissiveIntensity={5} />
        </mesh>
      ))}

      {/* Active Drawing Line */}
      {state.points.map((p, i) => {
        if (i === 0) return null;
        const pts = uiState.currentRenderMode === RenderMode.Euclidian ? [state.points[i-1], p] : generateCurvePoints(state.points[i-1], p, state.activeRadius);
        return (
          <line key={i}>
            <bufferGeometry attach="geometry" onUpdate={self => self.setFromPoints(pts)} />
            <lineBasicMaterial color="#ffb000" linewidth={3} transparent opacity={0.9} />
          </line>
        );
      })}

      {/* Assembly Instances */}
      {state.instances.map((inst, i) => {
        const obj = state.stagedObjects.find(o => o.id === inst.blueprintId);
        if (!obj) return null;
        return (
          <group key={i} position={inst.position}>
            {obj.points.map((p, pi) => (
              <mesh key={pi} position={[p[0], p[1], p[2]]}>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshStandardMaterial color="#00ccff" emissive="#00ccff" emissiveIntensity={2} />
              </mesh>
            ))}
          </group>
        );
      })}

      <Stars radius={200} count={5000} factor={4} />
      <Grid infiniteGrid fadeDistance={100} sectionColor="#443300" cellColor="#0a0800" />
      <OrbitControls makeDefault />
    </>
  );
};

export const Scene: React.FC<SceneContentProps> = (props) => (
  <div className="w-full h-full bg-[#030200]">
    <Canvas>
      <PerspectiveCamera makeDefault position={[70, 50, 70]} fov={35} />
      <SceneContent {...props} />
    </Canvas>
  </div>
);
