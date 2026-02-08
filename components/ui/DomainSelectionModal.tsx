
import React from 'react';
import { ISODomain } from '../../types';

interface DomainSelectionModalProps {
  onSelect: (domain: ISODomain) => void;
}

const DomainSelectionModal: React.FC<DomainSelectionModalProps> = ({ onSelect }) => {
  const options: { id: ISODomain; label: string; desc: string; icon: string }[] = [
    { id: 'BIM', label: 'BIM SCALE', desc: 'Metric Architecture (mm, cm, m)', icon: '🏗️' },
    { id: 'AUTO', label: 'AUTO PRECISION', desc: 'Mechanical Engineering (ISO-Metrical)', icon: '⚙️' },
    { id: 'CHIP', label: 'CHIP NANOTECH', desc: 'Electronic Micro-structures (nm, μm)', icon: '🔬' }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="w-[500px] p-8 border border-amber-900/50 bg-[#050400] text-center shadow-[0_0_100px_rgba(255,176,0,0.1)]">
        <h2 className="text-[#ffb000] font-bold text-sm tracking-[0.5em] mb-2">BIM-HELIPOLIEDRAL 10D</h2>
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-10">Select Dimensional Domain (ISO 80000 Compliance)</p>
        
        <div className="grid grid-cols-1 gap-4">
          {options.map(opt => (
            <button 
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className="group text-left p-6 border border-zinc-800 bg-zinc-900/20 hover:border-[#ffb000] hover:bg-amber-500/5 transition-all flex items-center gap-6"
            >
              <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{opt.icon}</span>
              <div>
                <div className="text-[#ffb000] font-bold text-xs tracking-widest mb-1">{opt.label}</div>
                <div className="text-zinc-500 text-[9px] uppercase">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-10 pt-6 border-t border-zinc-900/50 flex justify-between items-center text-[8px] text-zinc-700 tracking-tighter">
          <span>PRECISION: 1:1,000,000</span>
          <span>KERNEL v13.3 ISO-READY</span>
          <span>RAMANUJAN PROJECTION</span>
        </div>
      </div>
    </div>
  );
};

export default DomainSelectionModal;
