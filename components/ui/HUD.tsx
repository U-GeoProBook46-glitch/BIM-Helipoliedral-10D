
import React from 'react';

interface HUDProps {
  status: string;
  layer: number;
  mode: string;
}

/**
 * BIM-Helipoliedral 10D: HUD (Heads-Up Display)
 * Refatorado para WCAG 2.2 / ISO 40500 Compliance.
 * Z-Index: 20
 */
export const HUD: React.FC<HUDProps> = ({ status, layer, mode }) => {
  return (
    <header 
      className="fixed top-0 left-0 w-full z-20 pointer-events-none p-6 flex justify-between items-start select-none"
      role="banner"
      aria-label="Monitor de Telemetria Helipoliedral (ISO 9241-11)"
    >
      <div 
        className="bg-black/90 border border-amber-500/40 p-4 backdrop-blur-xl shadow-2xl rounded-sm min-w-[240px]"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 bg-[#ffb000] animate-pulse" aria-hidden="true"></div>
            <h1 className="text-[10px] font-black tracking-[0.3em] text-[#ffb000] uppercase">
              KERNEL 10D v13.5
            </h1>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-1">
             <span className="text-[8px] text-amber-900 font-bold uppercase tracking-widest">Sys_Status</span>
             <span className="text-[9px] text-amber-50/90 font-mono font-bold">{status}</span>
          </div>
          <div className="flex items-center justify-between">
             <span className="text-[8px] text-amber-900 font-bold uppercase tracking-widest">Domain_Locus</span>
             <span className="text-[9px] text-[#00ff41] font-black tracking-widest uppercase">{mode}</span>
          </div>
        </div>
      </div>
      
      <div 
        className="bg-black/90 border border-amber-500/40 p-4 text-right backdrop-blur-xl shadow-2xl rounded-sm"
        aria-label="Indicador de Elevação Ramanujan"
      >
        <div className="text-[8px] text-amber-700 font-bold uppercase tracking-widest mb-1">Elevation_R</div>
        <div className="text-3xl font-black text-[#ffb000] leading-none mb-1 tracking-tighter" aria-label={`Camada Ativa: ${layer.toFixed(1)}`}>
          L{layer.toFixed(1)}
        </div>
        <div className="text-[7px] text-amber-900/60 font-black uppercase tracking-[0.2em] pt-1 border-t border-amber-900/20">
          ISO 80000 PRECISION
        </div>
      </div>
    </header>
  );
};
