
import React from 'react';

interface HUDProps {
  status: string;
  layer: number;
  mode: string;
}

const HUD: React.FC<HUDProps> = ({ status, layer, mode }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none p-4 flex justify-between items-start">
      <div className="bg-black/80 border-l-4 border-[#ffb000] p-4 backdrop-blur-md">
        <h1 className="text-xs font-bold tracking-widest text-[#ffb000]">BIM-HELIPOLIEDRAL 10D | KERNEL v13.3</h1>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-[10px] text-[#8a5d00]">PRECISION STATUS:</span>
          <span className="text-xs text-[#ffb000] animate-pulse">{status}</span>
        </div>
      </div>
      
      <div className="bg-black/80 border-r-4 border-amber-600 p-4 text-right backdrop-blur-md">
        <div className="text-[10px] text-amber-700">ACTIVE LAYER</div>
        <div className="text-xl font-bold text-[#ffb000]">L{layer.toFixed(1)}</div>
        <div className="text-[10px] text-amber-400/60 mt-1 uppercase tracking-tighter">ENV: {mode}</div>
      </div>
    </div>
  );
};

export default HUD;
