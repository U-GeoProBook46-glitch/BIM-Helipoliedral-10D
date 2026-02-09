import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useBIMState } from './hooks/useBIMState';
import { HUD } from './components/ui/HUD';
import { LeftSidebar } from './components/ui/LeftSidebar';
import { RightSidebar } from './components/ui/RightSidebar';
import { FaceWorkflowModal } from './components/ui/FaceWorkflowModal';
import { DomainSelectionModal } from './components/ui/DomainSelectionModal';
import { SceneContent } from './components/scene/SceneContent';
import { AppMode } from './types';

export default function App() {
  const { appState, uiState, handlers, uiHandlers } = useBIMState();

  if (!uiState || !appState) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-[#ffb000] font-mono text-xs tracking-[0.5em] animate-pulse">
        REBOOTING KERNEL 10D...
      </div>
    );
  }

  const handleCrystallizePoint = (point: any) => {
    if (appState.mode === AppMode.Lathe) {
      handlers.addPoint(point);
    } else if (appState.mode === AppMode.Assembly && appState.selectedBlueprintId) {
      handlers.instantiate(appState.selectedBlueprintId, point);
    }
  };

  const handleNav = (point: any) => {
    handlers.setNavTarget(point);
  };

  return (
    <div className="relative w-screen h-screen bg-[#050400] overflow-hidden flex font-mono selection:bg-[#ffb000] selection:text-black">
      <HUD status={uiState.status} layer={appState.layer} mode={appState.mode} />
      
      <LeftSidebar 
        mode={appState.mode} 
        setMode={handlers.setMode}
        precisionLines={appState.precisionLines} 
        setPrecisionLines={handlers.setPrecisionLines}
        undo={handlers.undo} 
        clear={handlers.clear}
        renderMode={uiState.currentRenderMode} 
        setRenderMode={uiHandlers.setRenderMode}
        manifestation={uiState.currentManifestation} 
        setManifestation={uiHandlers.setManifestation}
        save={() => handlers.setShowWorkflowModal(true)}
      />

      <main className="flex-1 relative">
        <Canvas 
          shadows 
          frameloop="always" 
          dpr={[1, 2]} 
          camera={{ position: [70, 50, 70], fov: 35 }}
          gl={{ 
            antialias: true, 
            powerPreference: "high-performance",
            preserveDrawingBuffer: true 
          }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <SceneContent 
              state={appState} 
              uiState={uiState} 
              onClick={handleCrystallizePoint} 
              onNav={handleNav}
              onDoubleClick={() => handlers.setShowDomainModal(true)}
            />
          </Suspense>
        </Canvas>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[480px] z-50 px-10 py-5 bg-black/95 border border-amber-900/40 backdrop-blur-xl shadow-2xl text-amber-500 rounded-sm select-none">
            <div className="flex justify-between text-[8px] text-amber-900 mb-2 tracking-[0.5em] uppercase font-black">
                <span>COORD_MIN L1.0</span>
                <span>SYSTEM_ELEVATION</span>
                <span>COORD_MAX L60.0</span>
            </div>
            <input 
              type="range" min="1" max="60" step="0.5" 
              value={appState.layer} 
              onChange={(e) => handlers.setLayer(parseFloat(e.target.value))} 
              className="w-full h-1 bg-amber-950/30 appearance-none cursor-crosshair accent-[#ffb000] mb-6" 
            />

            <div className="flex justify-between text-[8px] text-amber-900 mb-2 tracking-[0.5em] uppercase font-black">
                <span>0º START</span>
                <span>REVOLUTION_ANGLE</span>
                <span>360º FULL</span>
            </div>
            <input 
              type="range" min="1" max="360" step="1" 
              value={appState.revolutionAngle} 
              onChange={(e) => handlers.setRevolutionAngle(parseInt(e.target.value))} 
              className="w-full h-1 bg-amber-950/30 appearance-none cursor-crosshair accent-[#00ff41]" 
            />

            <div className="flex justify-between mt-4 text-[#ffb000] text-[9px] font-bold tracking-[0.2em] border-t border-amber-900/10 pt-3">
                <span>R: {appState.activeRadius.toFixed(3)}u</span>
                <span className="text-[#00ff41]">REV: {appState.revolutionAngle}º</span>
                <span>DOMAIN: {appState.currentDomain || 'NOT_SET'}</span>
            </div>
        </div>
      </main>

      <RightSidebar 
        stock={appState.stagedObjects}
        onSelect={handlers.setSelectedBlueprintId}
        selectedId={appState.selectedBlueprintId}
        onAIGenerated={handlers.addObject}
      />

      {appState.showDomainModal && (
        <DomainSelectionModal onSelect={(d) => { handlers.setCurrentDomain(d); handlers.setShowDomainModal(false); }} />
      )}

      {appState.showWorkflowModal && (
        <FaceWorkflowModal 
          onContinue={handlers.continueDrawing}
          onSave={handlers.saveToISOStock}
          onCancel={() => { handlers.setShowWorkflowModal(false); handlers.clear(); }}
        />
      )}
    </div>
  );
}