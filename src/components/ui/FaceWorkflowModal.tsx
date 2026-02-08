
import React from 'react';
import { ISODomain } from '../../../types';

interface FaceWorkflowModalProps {
  onContinue: () => void;
  onSave: (domain: ISODomain, sub: string) => void;
  onCancel: () => void;
}

const FaceWorkflowModal: React.FC<FaceWorkflowModalProps> = ({ onContinue, onSave, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-96 bg-[#0a0800] border-2 border-[#ffb000] p-6 shadow-[0_0_60px_rgba(255,176,0,0.3)]">
        <h2 className="text-[#ffb000] font-bold text-xs tracking-[0.4em] mb-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-[#ffb000] rounded-full animate-ping"></div>
          FACE CRYSTALLIZED
        </h2>
        
        <p className="text-zinc-500 text-[10px] mb-8 uppercase tracking-widest leading-relaxed">
          The helipoliedral loop is stabilized. Synchronize the next vector or materialize to repository.
        </p>

        <div className="space-y-3">
          <button 
            onClick={onContinue}
            className="w-full p-4 bg-amber-500/10 border border-[#ffb000] text-[#ffb000] text-[10px] font-bold hover:bg-amber-500/30 transition-all flex justify-between items-center"
          >
            <span>CONTINUE DRAWING</span>
            <span>+ VECTOR</span>
          </button>
          
          <div className="pt-6 border-t border-amber-900/30">
            <p className="text-[8px] text-amber-900 mb-3 uppercase tracking-widest">Digital Stock Dispatch (ISO 1000):</p>
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => onSave('BIM', 'm')} className="text-left p-3 bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-[9px] hover:border-[#ffb000] hover:text-[#ffb000]">MATERIALIZE BIM [m]</button>
              <button onClick={() => onSave('AUTO', 'ISO-Metrical')} className="text-left p-3 bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-[9px] hover:border-[#ffb000] hover:text-[#ffb000]">MATERIALIZE AUTO [ISO]</button>
              <button onClick={() => onSave('CHIP', 'Micrometer')} className="text-left p-3 bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-[9px] hover:border-[#ffb000] hover:text-[#ffb000]">MATERIALIZE CHIP [μm]</button>
            </div>
          </div>

          <button onClick={onCancel} className="w-full mt-6 p-2 text-zinc-800 text-[8px] font-bold uppercase hover:text-red-900 tracking-widest transition-colors">
            PURGE ACTIVE TOPOLOGY
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceWorkflowModal;
