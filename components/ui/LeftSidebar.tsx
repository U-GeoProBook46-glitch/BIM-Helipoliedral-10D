import React from 'react';
import { AppMode, RenderMode, Manifestation } from '../../types';

interface LeftSidebarProps {
  mode: AppMode;
  setMode: (m: AppMode) => void;
  precisionLines: boolean;
  setPrecisionLines: (v: boolean) => void;
  undo: () => void;
  clear: () => void;
  renderMode: RenderMode;
  setRenderMode: (r: RenderMode) => void;
  manifestation: Manifestation;
  setManifestation: (m: Manifestation) => void;
  save: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  mode, setMode, precisionLines, setPrecisionLines, undo, clear,
  renderMode, setRenderMode, manifestation, setManifestation, save
}) => {
  const btnClass = (active: boolean) => `
    w-full p-2.5 text-[9px] font-bold transition-all border mb-1 flex items-center justify-between
    ${active ? 'bg-[#ffb000] text-black border-[#ffb000]' : 'bg-black/40 text-amber-700 border-amber-900/20 hover:border-amber-600 hover:text-amber-500'}
  `;

  return (
    <div className="fixed left-0 top-0 h-full w-60 bg-[#050400]/95 border-r border-amber-900/20 p-5 pt-28 z-40 backdrop-blur-2xl flex flex-col gap-6 select-none shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
      <section>
        <h3 className="text-[8px] text-amber-900 font-black mb-3 uppercase tracking-[0.2em] border-b border-amber-900/10 pb-1">System Mode</h3>
        <button onClick={() => setMode(AppMode.Lathe)} className={btnClass(mode === AppMode.Lathe)}>
           <span>TORNO HELICOIDAL</span>
           {mode === AppMode.Lathe && <span className="text-[8px]">●</span>}
        </button>
        <button onClick={() => setMode(AppMode.Assembly)} className={btnClass(mode === AppMode.Assembly)}>
           <span>MONTAGEM BIM</span>
           {mode === AppMode.Assembly && <span className="text-[8px]">●</span>}
        </button>
      </section>

      <section>
        <h3 className="text-[8px] text-amber-900 font-black mb-3 uppercase tracking-[0.2em] border-b border-amber-900/10 pb-1">Snap Grid</h3>
        <button 
          onClick={() => setPrecisionLines(!precisionLines)}
          className={`w-full p-2.5 text-[9px] font-bold border transition-all ${precisionLines ? 'border-[#ffb000] text-[#ffb000] bg-amber-500/5' : 'border-amber-950 text-amber-950'}`}
        >
          {precisionLines ? 'PRECISION LINES: ON' : 'PRECISION LINES: OFF'}
        </button>
      </section>

      <section>
        <h3 className="text-[8px] text-amber-900 font-black mb-3 uppercase tracking-[0.2em] border-b border-amber-900/10 pb-1">Manifestation</h3>
        <div className="grid grid-cols-1 gap-1">
          {(Object.values(Manifestation) as Manifestation[]).map(m => (
            <button key={m} onClick={() => setManifestation(m)} className={btnClass(manifestation === m)}>
               <span>{m.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[8px] text-amber-900 font-black mb-3 uppercase tracking-[0.2em] border-b border-amber-900/10 pb-1">Project Intent</h3>
        <div className="flex gap-1">
          <button onClick={() => setRenderMode(RenderMode.Euclidian)} className={btnClass(renderMode === RenderMode.Euclidian)}>EUCLIDEAN</button>
          <button onClick={() => setRenderMode(RenderMode.Ramanujan)} className={btnClass(renderMode === RenderMode.Ramanujan)}>RAMANUJAN</button>
        </div>
      </section>

      <div className="mt-auto flex flex-col gap-1.5">
        <div className="flex gap-1">
          <button onClick={undo} className="flex-1 p-2 bg-zinc-900/50 text-amber-600 text-[9px] border border-amber-900/10 hover:border-amber-700 transition-all">UNDO</button>
          <button onClick={clear} className="flex-1 p-2 bg-red-950/10 text-red-900 text-[9px] border border-red-900/20 hover:border-red-600 hover:text-red-500 transition-all">PURGE</button>
        </div>
        <button onClick={save} className="w-full p-4 bg-[#ffb000] text-black font-black text-[10px] hover:bg-[#ffcf00] shadow-[0_0_20px_rgba(255,176,0,0.25)] transition-all uppercase tracking-widest">
           Materializer Component
        </button>
      </div>
    </div>
  );
};