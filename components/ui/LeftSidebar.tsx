
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

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  mode, setMode, precisionLines, setPrecisionLines, undo, clear,
  renderMode, setRenderMode, manifestation, setManifestation, save
}) => {
  const btnClass = (active: boolean) => `
    p-3 text-[10px] font-bold transition-all border
    ${active ? 'bg-[#ffb000] text-black border-[#ffb000]' : 'bg-zinc-900/50 text-amber-600/70 border-zinc-800 hover:border-amber-900'}
  `;

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-black/95 border-r border-amber-900/30 p-6 pt-24 z-40 backdrop-blur-xl flex flex-col gap-6">
      <section>
        <h3 className="text-[9px] text-amber-700 mb-3 uppercase tracking-widest border-b border-amber-900/20 pb-1">Context Mode</h3>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setMode(AppMode.Lathe)} className={btnClass(mode === AppMode.Lathe)}>LATHE</button>
          <button onClick={() => setMode(AppMode.Assembly)} className={btnClass(mode === AppMode.Assembly)}>ASSEMBLY</button>
        </div>
      </section>

      <section>
        <h3 className="text-[9px] text-amber-700 mb-3 uppercase tracking-widest border-b border-amber-900/20 pb-1">Precision Overlay</h3>
        <button 
          onClick={() => setPrecisionLines(!precisionLines)}
          className={`w-full p-3 text-[10px] border transition-colors ${precisionLines ? 'border-[#ffb000] text-[#ffb000] bg-amber-500/10' : 'border-zinc-800 text-zinc-700'}`}
        >
          {precisionLines ? 'LINES: ACTIVE' : 'LINES: BYPASS'}
        </button>
      </section>

      <section>
        <h3 className="text-[9px] text-amber-700 mb-3 uppercase tracking-widest border-b border-amber-900/20 pb-1">Manifestation</h3>
        <div className="flex flex-col gap-1">
          {(Object.values(Manifestation) as Manifestation[]).map(m => (
            <button key={m} onClick={() => setManifestation(m)} className={btnClass(manifestation === m)}>{m.toUpperCase()}</button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[9px] text-amber-700 mb-3 uppercase tracking-widest border-b border-amber-900/20 pb-1">Geometric Intent</h3>
        <div className="flex gap-2">
          <button onClick={() => setRenderMode(RenderMode.Euclidian)} className={btnClass(renderMode === RenderMode.Euclidian)}>EUCLIDEAN</button>
          <button onClick={() => setRenderMode(RenderMode.Ramanujan)} className={btnClass(renderMode === RenderMode.Ramanujan)}>RAMANUJAN</button>
        </div>
      </section>

      <div className="mt-auto flex flex-col gap-2">
        <div className="flex gap-2">
          <button onClick={undo} className="flex-1 p-2 bg-zinc-900 text-amber-600 text-[10px] border border-zinc-800 hover:bg-zinc-800">UNDO</button>
          <button onClick={clear} className="flex-1 p-2 bg-red-950/20 text-red-500 text-[10px] border border-red-900/30 hover:bg-red-900/40">PURGE</button>
        </div>
        <button onClick={save} className="w-full p-4 bg-[#ffb000] text-black font-bold text-xs hover:bg-[#ffcf00] shadow-[0_0_15px_rgba(255,176,0,0.2)]">MATERIALIZE COMPONENT</button>
      </div>
    </div>
  );
};

export default LeftSidebar;
