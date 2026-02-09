import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useBIMState } from './hooks/useBIMState';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { HUD } from './components/ui/HUD';
import { LeftSidebar } from './components/ui/LeftSidebar';
import { RightSidebar } from './components/ui/RightSidebar';
import { FaceWorkflowModal } from './components/ui/FaceWorkflowModal';
import { DomainSelectionModal } from './components/ui/DomainSelectionModal';
import { SceneContent } from './components/scene/SceneContent';
import { DisassemblyModal } from './components/ui/DisassemblyModal';
import { LogPanel } from './components/ui/LogPanel';
import { AssistantControl } from './components/ui/AssistantControl';
import { AppMode } from './types';

export default function App() {
  const { appState, uiState, handlers, uiHandlers } = useBIMState();
  
  useKeyboardShortcuts(handlers, appState);

  const selectedInstance = appState.instances.find(i => i.id === appState.selectedInstanceId);
  const selectedBlueprint = appState.stagedObjects.find(o => o.id === selectedInstance?.blueprintId);

  return (
    <div className="relative w-screen h-screen bg-[#050400] overflow-hidden flex font-mono selection:bg-[#ffb000] selection:text-black">
      <HUD status={uiState.status} layer={appState.layer} mode={appState.mode} />
      
      <LeftSidebar 
        mode={appState.mode} setMode={handlers.setMode}
        precisionLines={appState.precisionLines} setPrecisionLines={handlers.setPrecisionLines}
        undo={handlers.undo} clear={handlers.clear}
        renderMode={uiState.currentRenderMode} setRenderMode={uiHandlers.setRenderMode}
        manifestation={uiState.currentManifestation} setManifestation={uiHandlers.setManifestation}
        save={() => handlers.setShowWorkflowModal(true)}
      />

      <main className="flex-1 relative" role="main">
        <Canvas shadows camera={{ position: [70, 50, 70], fov: 35 }} className="w-full h-full">
          <Suspense fallback={null}>
            <SceneContent 
              state={{...appState, selectedBlueprintId: appState.selectedInstanceId}} 
              uiState={uiState} 
              onClick={(p) => handlers.addPoint(p)} 
              onNav={handlers.setNavTarget}
            />
          </Suspense>
        </Canvas>
        
        <LogPanel logs={appState.logs} />
        
        <AssistantControl onCrystallize={handlers.addObject} />

        {/* Modal de Desmontagem ISO 8887-1 */}
        {selectedInstance && selectedBlueprint && (
          <DisassemblyModal 
            instance={selectedInstance} 
            blueprintPoints={selectedBlueprint.points}
            onClose={() => handlers.setSelectedInstanceId(null)}
          />
        )}

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[480px] z-50 px-10 py-5 bg-black/95 border border-amber-900/40 backdrop-blur-xl shadow-2xl text-amber-500 rounded-sm">
            <div className="flex justify-between text-[8px] mb-2 uppercase tracking-widest text-amber-900 font-bold">
              <span>Elevation L1-L60</span>
              <span>Revolution 0-360º</span>
            </div>
            <input type="range" min="1" max="60" step="0.5" value={appState.layer} onChange={(e) => handlers.setLayer(parseFloat(e.target.value))} className="w-full h-1 bg-amber-950/30 accent-[#ffb000] mb-6" />
            <input type="range" min="1" max="360" step="1" value={appState.revolutionAngle} onChange={(e) => handlers.setRevolutionAngle(parseInt(e.target.value))} className="w-full h-1 bg-amber-950/30 accent-[#00ff41]" />
        </div>
      </main>

      <RightSidebar 
        stock={appState.stagedObjects}
        onSelect={(id) => handlers.setSelectedInstanceId(id)}
        selectedId={appState.selectedInstanceId}
        onAIGenerated={handlers.addObject}
        onDeploy={handlers.deployToAssembly}
      />

      {appState.showDomainModal && <DomainSelectionModal onSelect={(d) => { handlers.setCurrentDomain(d); handlers.setShowDomainModal(false); }} />}
      {appState.showWorkflowModal && <FaceWorkflowModal onContinue={handlers.continueDrawing} onSave={handlers.saveToISOStock} onCancel={handlers.clear} />}
    </div>
  );
}