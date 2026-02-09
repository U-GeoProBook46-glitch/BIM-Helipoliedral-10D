import React from 'react';

interface HUDProps {
  status: string;
  layer: number;
  mode: string;
}

export const HUD: React.FC<HUDProps> = ({ status, layer, mode }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none p-6 flex justify-between items-start select-none">
      <div className="bg-black/90 border border-amber-900/40 p-5 backdrop-blur-xl shadow-2xl rounded-sm">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-[#ffb000] animate-pulse"></div>
            <h1 className="text-[10px] font-black tracking-[0.4em] text-[#ffb000] uppercase">BIM-HELIPOLIEDRAL 10D | KERNEL v13.3</h1>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <span className="text-[8px] text-amber-900 font-bold uppercase tracking-widest">System Status:</span>
             <span className="text-[9px] text-amber-400 font-mono tracking-wider italic">{status}</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[8px] text-amber-900 font-bold uppercase tracking-widest">ISO Compliance:</span>
             <span className="text-[9px] text-[#00ff41] font-mono tracking-wider">ISO 80000 READY</span>
          </div>
        </div>
      </div>
      
      <div className="bg-black/90 border border-amber-900/40 p-5 text-right backdrop-blur-xl shadow-2xl rounded-sm">
        <div className="text-[8px] text-amber-700 font-bold uppercase tracking-widest mb-1">Active elevation</div>
        <div className="text-2xl font-black text-[#ffb000] leading-none mb-1">L{layer.toFixed(1)}</div>
        <div className="text-[8px] text-amber-500/40 font-bold uppercase tracking-widest border-t border-amber-900/20 pt-1">
            DOM: {mode}
        </div>
      </div>
    </div>
  );
};