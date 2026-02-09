import { useEffect } from 'react';
import { AppMode } from '../types';

/**
 * BIM-Helipoliedral 10D: Keyboard A11y Engine
 * Implementa navegação por atalhos conforme ISO 9241-161.
 */
export const useKeyboardShortcuts = (handlers: any, appState: any) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evitar gatilhos durante digitação em campos de texto
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

      const key = e.key.toLowerCase();

      switch (key) {
        case 'l':
          handlers.setMode(AppMode.Lathe);
          break;
        case 'a':
          handlers.setMode(AppMode.Assembly);
          break;
        case 'p':
          handlers.setPrecisionLines(!appState.precisionLines);
          break;
        case 'z':
          if (e.ctrlKey || e.metaKey) handlers.undo();
          break;
        case 's':
          handlers.setShowWorkflowModal(true);
          break;
        case 'escape':
          if (appState.showWorkflowModal) handlers.setShowWorkflowModal(false);
          else if (appState.showDomainModal) handlers.setShowDomainModal(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, appState]);
};
