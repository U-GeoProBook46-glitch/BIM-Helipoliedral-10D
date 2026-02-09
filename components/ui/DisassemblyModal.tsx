import React from 'react';
import { AssemblyInstance } from '../../types';
import { generateDfDSVG } from '../../utils/exporters/dfdExporter';

interface DisassemblyModalProps {
  instance: AssemblyInstance;
  onClose: () => void;
  blueprintPoints: [number, number, number][];
}

export const DisassemblyModal: React.FC<DisassemblyModalProps> = ({ instance, onClose, blueprintPoints }) => {
  const exportDfD = () => {
    const svg = generateDfDSVG(instance, blueprintPoints);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DfD_PROTOCOL_${instance.id}.svg`;
    a.click();
  };

  const toolIcons: Record<string, string> = {
    'Chave Allen 5mm': '🔧',
    'Maçarico': '🔥',
    'Mão': '✋',
    'Chave de Fenda': '🪛'
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] w-[90vw] max-w-2xl bg-[#0a0800] border border-[#ffb000]/40 backdrop-blur-xl shadow-2xl p-6 rounded-sm animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-4 border-b border-amber-900/20 pb-2">
        <div>
          <h2 className="text-[#ffb000] font-black text-xs tracking-[0.3em] uppercase">DfD Manual | ISO 8887-1</h2>
          <p className="text-[8px] text-zinc-600 font-mono mt-1">INSTANCE_ID: {instance.id}</p>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white text-lg">×</button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="bg-black/40 border border-zinc-900 p-3 flex-1">
          <p className="text-[8px] text-zinc-500 uppercase mb-1">Connection Type</p>
          <p className="text-[10px] text-amber-500 font-bold">{instance.dfd.connectionType.replace('_', ' ')}</p>
        </div>
        <div className="bg-black/40 border border-zinc-900 p-3 flex-1 flex items-center justify-between">
          <div>
            <p className="text-[8px] text-zinc-500 uppercase mb-1">Required Tool</p>
            <p className="text-[10px] text-amber-500 font-bold">{instance.dfd.disassemblyTool}</p>
          </div>
          <span className="text-2xl" title={instance.dfd.disassemblyTool}>
            {toolIcons[instance.dfd.disassemblyTool] || '🛠️'}
          </span>
        </div>
      </div>

      <p className="text-[9px] text-amber-900 font-bold uppercase mb-2 tracking-widest">Disassembly Sequence (ISO 8887-1):</p>
      <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar">
        {instance.dfd.steps.map((step, i) => (
          <div key={i} className="min-w-[180px] bg-zinc-900/30 border border-zinc-800 p-4 flex flex-col gap-3">
            <span className="text-[#ffb000] font-black text-xs">STEP 0{i+1}</span>
            <p className="text-[9px] text-zinc-400 leading-relaxed uppercase tracking-tighter">
              {step}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center border-t border-amber-900/10 pt-4">
        <div className="flex gap-4">
          <div className="text-[9px]">
            <span className="text-zinc-600">RECYCLABILITY: </span>
            <span className="text-[#00ff41] font-bold">{(instance.dfd.recyclabilityIndex * 100).toFixed(0)}%</span>
          </div>
          <div className="text-[9px]">
            <span className="text-zinc-600">PHASE: </span>
            <span className="text-amber-700 font-bold">{instance.dfd.lifecyclePhase}</span>
          </div>
        </div>
        <button 
          onClick={exportDfD}
          className="bg-[#ffb000] text-black text-[9px] font-black px-4 py-2 hover:bg-white transition-all uppercase tracking-widest"
        >
          Export DfD Protocol
        </button>
      </div>
    </div>
  );
};