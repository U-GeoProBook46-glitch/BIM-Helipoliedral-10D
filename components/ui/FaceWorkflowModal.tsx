import React, { useLayoutEffect, useRef } from 'react';
import { ISODomain } from '../../types';
import { Sparkles, Layers, Box, Cpu } from 'lucide-react';

interface FaceWorkflowModalProps {
  onContinue: () => void;
  onSave: (domain: ISODomain, sub: string) => void;
  onCancel: () => void;
}

/**
 * FaceWorkflowModal: Handshake de Cristalização (ISO 9241-11).
 * Estética Translucid Glass Neon com pointer-events auto.
 * Garante que o usuário possa interagir com o modal mesmo em Context Lock de 3D.
 */
export const FaceWorkflowModal: React.FC<FaceWorkflowModalProps> = ({ onContinue, onSave, onCancel }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // ISO 9241-171: Foco e Desbloqueio de Interface
  useLayoutEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
    // Garante que os pointer-events estejam habilitados para o modal em nível global
    document.body.style.pointerEvents = 'auto';
    return () => {
      document.body.style.pointerEvents = '';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 backdrop-blur-md transition-all duration-500 animate-in fade-in"
      onClick={(e) => e.stopPropagation()}
      style={{ pointerEvents: 'auto' }}
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="w-[440px] bg-[#050400]/95 border-2 border-amber-500/60 p-10 shadow-[0_0_150px_rgba(255,176,0,0.25)] rounded-sm overflow-hidden outline-none relative pointer-events-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wf-title"
      >
        {/* Glow Line Animada */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse"></div>
        
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 id="wf-title" className="text-[#ffb000] font-black text-[15px] tracking-[0.5em] flex items-center gap-3 uppercase">
              <Sparkles size={18} className="animate-pulse" /> Topology Ready
            </h2>
            <span className="text-[8px] text-amber-900 font-bold tracking-widest">ISO 80000 STABLE</span>
          </div>
          <div className="h-[1px] w-full bg-amber-500/20 mb-4"></div>
          <p className="text-zinc-400 text-[10px] uppercase tracking-[0.15em] leading-relaxed">
            Awaiting Sovereign Materialization. Synchronize vectors to finalize the assembly instance.
          </p>
        </header>

        <div className="space-y-4">
          <button 
            onClick={onContinue}
            className="w-full p-5 bg-amber-500/5 border border-amber-500/30 text-amber-500 text-[11px] font-black hover:bg-amber-500/10 hover:border-amber-500 transition-all flex justify-between items-center group active:scale-95 pointer-events-auto focus:ring-1 focus:ring-amber-500 outline-none"
          >
            <span className="tracking-[0.2em]">CONTINUE_SEQUENCING</span>
            <Box size={16} className="group-hover:rotate-45 transition-transform" />
          </button>
          
          <div className="pt-8 mt-4 border-t border-amber-500/20">
            <p className="text-[9px] text-amber-600 mb-5 uppercase tracking-[0.3em] font-bold">Materialize to Sovereign Stock:</p>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => onSave('BIM', 'm')} 
                className="group flex items-center justify-between p-5 bg-zinc-900/60 border border-zinc-800 text-zinc-500 text-[11px] font-black hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/5 transition-all active:scale-95 pointer-events-auto focus:ring-1 focus:ring-amber-500 outline-none"
              >
                <div className="flex items-center gap-4">
                  <Layers size={16} className="group-hover:scale-110 transition-all text-amber-900 group-hover:text-amber-500" />
                  <span className="tracking-widest">COMMIT_TO_BIM [m]</span>
                </div>
              </button>
              <button 
                onClick={() => onSave('AUTO', 'ISO')} 
                className="group flex items-center justify-between p-5 bg-zinc-900/60 border border-zinc-800 text-zinc-500 text-[11px] font-black hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/5 transition-all active:scale-95 pointer-events-auto focus:ring-1 focus:ring-amber-500 outline-none"
              >
                <div className="flex items-center gap-4">
                  <Cpu size={16} className="group-hover:scale-110 transition-all text-amber-900 group-hover:text-amber-500" />
                  <span className="tracking-widest">COMMIT_TO_AUTO [ISO]</span>
                </div>
              </button>
            </div>
          </div>

          <button 
            onClick={onCancel} 
            className="w-full mt-8 p-3 text-zinc-700 text-[9px] font-bold uppercase hover:text-red-500 tracking-[0.4em] transition-colors border-t border-amber-900/10 pt-6 pointer-events-auto outline-none"
          >
            Purge Active Topology Buffer
          </button>
        </div>
      </div>
    </div>
  );
};