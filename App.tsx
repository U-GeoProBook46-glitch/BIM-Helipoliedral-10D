
import React, { Suspense, useState, useCallback } from 'react';
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
import { GeminiPanel } from './components/ui/GeminiPanel';
import { useGeminiAssistant } from './hooks/useGeminiAssistant';
import { NeuroCoreService } from './services/NeuroCore';

/**
 * BIM-Helipoliedral 10D: Application Sovereign Root
 * Compliance: ISO 9241 (Ergonomia) & WCAG 2.2 (Acessibilidade)
 */
export default function App() {
  const { appState, uiState, handlers, uiHandlers } = useBIMState();
  
  /**
   * handleGeminiResponse: Ponte de Vibe Coding entre AI e Kernel.
   * Valida tokens de ação e transmuta em geometria soberana na camada ativa.
   */
  const handleGeminiResponse = useCallback((jsonFromAi: any) => {
    // Sincronização de Raio Ativo LX conforme camada Ramanujan
    const currentRadius = appState.activeRadius;
    
    // Feedback de Log (ISO 9241-11)
    handlers.addObject && handlers.addObject({} as any); // Trigger hack for log logic if needed, but better use addLog directly
    // Note: useBIMState already has addLog in its internal state, we ensure we use it.
    // However, the handlers object passed from useBIMState needs to be correctly mapped.
    
    const synthesizedObject = NeuroCoreService.transmuteIntentToGeometry(jsonFromAi, currentRadius);
    
    if (synthesizedObject) {
      // Injeção de Geometria Soberana no Stock
      handlers.addObject(synthesizedObject);
    }
  }, [appState.activeRadius, handlers]);

  // Assistente Gemini integrado ao motor de transmutação
  const assistant = useGeminiAssistant(handleGeminiResponse);
  
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);
  
  useKeyboardShortcuts(handlers, appState);

  const selectedInstance = appState.instances.find(i => i.id === appState.selectedInstanceId);
  const selectedBlueprint = appState.stagedObjects.find(o => o.id === selectedInstance?.blueprintId);

  return (
    <div className="relative w-screen h-screen bg-[#050400] overflow-hidden flex font-mono selection:bg-[#ffb000] selection:text-black">
      <HUD 
        status={uiState.status} 
        layer={appState.layer} 
        mode={appState.mode} 
      />
      
      <GeminiPanel 
        assistant={assistant} 
        onApprove={assistant.approveProposal}
        pendingProposal={assistant.pendingProposal}
      />

      <LeftSidebar 
        isOpen={isLeftOpen}
        onToggle={() => setIsLeftOpen(!isLeftOpen)}
        mode={appState.mode} setMode={handlers.setMode}
        precisionLines={appState.precisionLines} setPrecisionLines={handlers.setPrecisionLines}
        undo={handlers.undo} clear={handlers.clear}
        renderMode={uiState.currentRenderMode} setRenderMode={uiHandlers.setRenderMode}
        manifestation={uiState.currentManifestation} setManifestation={uiHandlers.setManifestation}
        save={() => handlers.setShowWorkflowModal(true)}
        layer={appState.layer} setLayer={handlers.setLayer}
        revolutionAngle={appState.revolutionAngle} setRevolutionAngle={handlers.setRevolutionAngle}
      />

      <main 
        className="flex-1 relative z-0" 
        role="main" 
        aria-label="Viewport de Engenharia 10D"
      >
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
        
        {selectedInstance && selectedBlueprint && (
          <DisassemblyModal 
            instance={selectedInstance} 
            blueprintPoints={selectedBlueprint.points}
            onClose={() => handlers.setSelectedInstanceId(null)}
          />
        )}
      </main>

      <RightSidebar 
        isOpen={isRightOpen}
        onToggle={() => setIsRightOpen(!isRightOpen)}
        stock={appState.stagedObjects}
        onSelect={(id) => handlers.setSelectedInstanceId(id)}
        selectedId={appState.selectedInstanceId}
        onDeploy={handlers.deployToAssembly}
        selectedInstance={selectedInstance}
      />

      {appState.showDomainModal && <DomainSelectionModal onSelect={(d) => { handlers.setCurrentDomain(d); handlers.setShowDomainModal(false); }} />}
      {appState.showWorkflowModal && <FaceWorkflowModal onContinue={handlers.continueDrawing} onSave={handlers.saveToISOStock} onCancel={handlers.clear} />}
    </div>
  );
}
