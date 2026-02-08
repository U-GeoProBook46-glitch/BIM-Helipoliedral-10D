import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import HUD from './components/ui/HUD';
import LeftSidebar from './components/ui/LeftSidebar';
import RightSidebar from './components/ui/RightSidebar';
import FaceWorkflowModal from './components/ui/FaceWorkflowModal';
import DomainSelectionModal from './components/ui/DomainSelectionModal';
import { SceneContent } from './components/3d/Scene';
import { useBIMState } from './hooks/useBIMState';
import { AppMode } from './types';

export default function App() {
  const { appState, uiState, handlers, uiHandlers } = useBIMState();

  // Rendering block if state is not ready (Prevents Error #185)
  if (!uiState || !appState) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-[#ffb000] font-mono text-xs tracking-[0.5em] animate-pulse">
        REBOOTING KERNEL 10D...
      </div>
    );
  }

  const handleCanvasClick = (point: any) => {
    if (appState.mode === AppMode.Lathe) {
      handlers.addPoint(point);
    } else if (appState.mode === AppMode.Assembly && appState.selectedBlueprintId) {
      handlers.instantiate(appState.selectedBlueprintId, point);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#050400] overflow-hidden flex font-mono selection:bg-[#ffb000] selection:text-black">
      {/* UI OVERLAYS */}
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

      {/* CORE 3D ENGINE CONTAINER */}
      <main className="flex-1 relative">
        <Canvas 
          shadows 
          frameloop="always" 
          dpr={[1, 2]} 
          camera={{ position: [70, 50, 70], fov: 35 }}
          gl={{ 
            antialias: true, 
            powerPreference: "high-performance",
            preserveDrawingBuffer: true // Required for Technical Board Exporter
          }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <SceneContent 
              state={appState} 
              uiState={uiState} 
              onClick={handleCanvasClick} 
              onDoubleClick={() => handlers.setShowDomainModal(true)}
            />
          </Suspense>
        </Canvas>
        
        {/* Elevation Controller HUD - Layer Navigation */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[450px] z-50 px-10 py-5 bg-black/90 border border-amber-900/40 backdrop-blur-xl shadow-2xl text-amber-500">
            <div className="flex justify-between text-[8px] text-amber-900 mb-3 tracking-[0.5em] uppercase font-bold">
                <span>COORD_MIN L1.0</span>
                <span>SPHERICAL_DOMAIN</span>
                <span>COORD_MAX L60.0</span>
            </div>
            <input 
              type="range" min="1" max="60" step="0.5" 
              value={appState.layer} 
              onChange={(e) => handlers.setLayer(parseFloat(e.target.value))} 
              className="w-full h-1 bg-amber-950/30 appearance-none cursor-crosshair accent-[#ffb000]" 
            />
            <div className="flex justify-between mt-3 text-[#ffb000] text-[9px] font-bold tracking-[0.2em] border-t border-amber-900/10 pt-2">
                <span>R: {appState.activeRadius.toFixed(3)}u</span>
                <span className="text-zinc-600">UNIT: {appState.currentDomain === 'CHIP' ? 'nm' : 'm'}</span>
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

      {/* MODAL WORKFLOWS */}
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
      
      {/* Visual Calibration & Noise Layer */}
      <div className="fixed inset-0 pointer-events-none border border-[#ffb000]/10 z-[60] flex flex-col justify-between p-4">
         <div className="flex justify-between">
            <div className="w-16 h-16 border-t border-l border-[#ffb000]/40"></div>
            <div className="w-16 h-16 border-t border-r border-[#ffb000]/40"></div>
         </div>
         <div className="flex justify-between">
            <div className="w-16 h-16 border-b border-l border-[#ffb000]/40"></div>
            <div className="w-16 h-16 border-b border-r border-[#ffb000]/40"></div>
         </div>
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[100]"></div>
    </div>
  );
}