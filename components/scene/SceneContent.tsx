
import React from 'react';
import { OrbitControls, Grid, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { AppMode, RenderMode, Manifestation, StagedObject, AssemblyInstance, ISODomain } from '../../types';
import { generateCurvePoints } from '../../utils/math/geometry';
import { InstanceManager } from './InstanceManager';
import { GeometryStaging } from './GeometryStaging';
import { PrecisionLines } from './PrecisionLines';
import { LatheSolidRenderer } from './LatheSolidRenderer';
import { InteractionSurface } from './InteractionSurface';

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

/**
 * SceneContent: O Core de Renderização do BIM-Helipoliedral 10D.
 * Integra a ferramenta 'Revolution' com preview elástico em tempo real.
 */
export const SceneContent: React.FC<SceneContentProps> = ({ state, uiState, onClick, onNav }) => {
  return (
    <>
      <color attach="background" args={["#030200"]} />
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 20, 10]} intensity={2.0} color="#ffb000" />
      <pointLight position={state.navTarget} intensity={0.8} color="#00ff41" distance={30} />
      
      <InteractionSurface 
        radius={state.activeRadius} 
        onPoint={onClick} 
        onNav={onNav}
        precisionLines={state.precisionLines}
      />

      <PrecisionLines radius={state.activeRadius} visible={state.precisionLines} />

      {/* Preview Elástico de Revolução: 'Ghost Volume' Manual */}
      {state.points.length >= 2 && state.mode === AppMode.Lathe && (
        <LatheSolidRenderer 
            points={state.points} 
            angle={state.revolutionAngle} 
            color="#ffb000" 
            isGhost={true}
        />
      )}

      {/* Renderização de Objetos no Stock (ISO Repository) */}
      {state.stagedObjects.map(obj => {
        if (!obj.isLathe || obj.points.length < 2) return null;
        
        const v3Points = obj.points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
        // Objetos sintetizados via AI (ghostMode) aparecem em âmbar pulsante.
        // Objetos cristalizados aparecem em ciano sólido.
        return (
          <LatheSolidRenderer 
            key={`lathe-${obj.id}`}
            points={v3Points}
            angle={obj.revolutionAngle || 360}
            color={obj.ghostMode ? "#ffb000" : "#00ffff"}
            isGhost={obj.ghostMode}
          />
        );
      })}

      {/* Geometria de Perfil Ativa */}
      <GeometryStaging 
        points={state.points} 
        isClosed={state.isClosed} 
        radius={state.activeRadius} 
        color="#ffb000"
      />

      {/* Renderização de Faces Estáticas em Wireframe */}
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
                <lineBasicMaterial color="#00ff41" transparent opacity={0.2} />
              </line>
            );
          })}
        </group>
      ))}

      <InstanceManager data={state.instances} />

      <Stars radius={400} count={3000} factor={5} saturation={1} fade speed={0.4} />
      <Grid 
        infiniteGrid 
        fadeDistance={200} 
        sectionColor="#221100" 
        cellColor="#050400" 
        sectionThickness={1.5}
        cellThickness={0.8}
      />

      <OrbitControls 
        makeDefault 
        minDistance={1} 
        maxDistance={1000} 
        target={state.navTarget}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
};
