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

/**
 * BIM-Helipoliedral 10D: Left Sidebar (Control Center)
 * Refatorado para Conformidade ISO 9241-151/161.
 * Implementa indicadores de foco de alto contraste e semântica ARIA para navegação robusta.
 */
export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  mode, setMode, precisionLines, setPrecisionLines, undo, clear,
  renderMode, setRenderMode, manifestation, setManifestation, save
}) => {
  const btnClass = (active: boolean) => `
    w-full p-2.5 text-[9px] font-bold transition-all border mb-1 flex items-center justify-between
    outline-none focus-visible:ring-2 focus-visible:ring-[#00ffff] focus-visible:ring-offset-2 focus-visible:ring-offset-black
    ${active ? 'bg-[#ffb000] text-black border-[#ffb000]' : 'bg-black/40 text-amber-700 border-amber-900/20 hover:border-amber-600 hover:text-amber-500'}
  `;

  return (
    <nav 
      className="fixed left-0 top-0 h-full w-60 bg-[#050400]/95 border-r border-amber-900/20 p-5 pt-28 z-40 backdrop-blur-2xl flex flex-col gap-6 select-none shadow-[20px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar"
      aria-label="Controles Principais do Materializador"
    >
      {/* ISO 9241-11: Funções de Materialização e Stock no topo da hierarquia cognitiva */}
      <section aria-labelledby="materializer-title">
        <h3 id="materializer-title" className="text-[8px] text-amber-900 font-black mb-3 uppercase tracking-[0.2em] border-b border-amber-900/10 pb-1">
          Materialization Engine
        </h3>
        <button 
          onClick={save} 
          className="w-full p-4 bg-[#ffb000] text-black font-black text-[10px] hover:bg-[#ffcf00] focus-visible:ring-2 focus-visible:ring-[#00ffff] shadow-[0_0_20px_rgba(255,176,0,0.25)] transition-all uppercase tracking-widest mb-4"
          aria-label="Materializar Componente (Atalho: S)"
          title="Salva a geometria ativa no Stock Digital"
        >
           Materialize Component
        </button>
      </section>

      <section aria-labelledby="system-mode-title">
        <h3 id="system-mode-title" className="text-[8px] text-amber-900 font-black mb-3 uppercase tracking-[0.2em] border-b border-amber-900/10 pb-1">
          System Mode (ISO 9241-210)
        </h3>
        <button 
          onClick={() => setMode(AppMode.Lathe)} 
          className={btnClass(mode === AppMode.Lathe)}
          aria-pressed={mode === AppMode.Lathe}
          aria-label="Modo Torno Helicoidal (Atalho: L)"
        >
           <span>TORNO HELICOIDAL</span>
           {mode === AppMode.Lathe && <span className="text-[8px]" aria-hidden="true">●</span>}
        </button>
        <button 
          onClick={() => setMode(AppMode.Assembly)} 
          className={btnClass(mode === AppMode.Assembly)}
          aria-pressed={mode === AppMode.Assembly}
          aria-label="Modo Montagem BIM (Atalho: A)"
        >
           <span>MONTAGEM BIM</span>
           {mode === AppMode.Assembly && <span className="text-[8px]" aria-hidden="true">●</span>}
        </button>
      </section>

      <section aria-labelledby="snap-grid-title">
        <h3 id="snap-grid-title" className="text-[8px] text-amber-900 font-black mb-3 uppercase tracking-[0.2em] border-b border-amber-900/10 pb-1">
          Snap Grid
        </h3>
        <button 
          onClick={() => setPrecisionLines(!precisionLines)}
          className={`w-full p-2.5 text-[9px] font-bold border transition-all focus-visible:ring-2 focus-visible:ring-[#00ffff] ${precisionLines ? 'border-[#ffb000] text-[#ffb000] bg-amber-500/5' : 'border-amber-950 text-amber-950'}`}
          aria-pressed={precisionLines}
          aria-label={`Linhas de Precisão (Atalho: P): ${precisionLines ? 'Ativadas' : 'Desativadas'}`}
        >
          {precisionLines ? 'PRECISION LINES: ON' : 'PRECISION LINES: OFF'}
        </button>
      </section>

      <section aria-labelledby="manifestation-title">
        <h3 id="manifestation-title" className="text-[8px] text-amber-900 font-black mb-3 uppercase tracking-[0.2em] border-b border-amber-900/10 pb-1">
          Topology Manifestation
        </h3>
        <div className="grid grid-cols-1 gap-1" role="radiogroup" aria-labelledby="manifestation-title">
          {(Object.values(Manifestation) as Manifestation[]).map(m => (
            <button 
              key={m} 
              onClick={() => setManifestation(m)} 
              className={btnClass(manifestation === m)}
              role="radio"
              aria-checked={manifestation === m}
            >
               <span>{m.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="intent-title">
        <h3 id="intent-title" className="text-[8px] text-amber-900 font-black mb-3 uppercase tracking-[0.2em] border-b border-amber-900/10 pb-1">
          Project Intent
        </h3>
        <div className="flex gap-1" role="radiogroup" aria-labelledby="intent-title">
          <button 
            onClick={() => setRenderMode(RenderMode.Euclidian)} 
            className={btnClass(renderMode === RenderMode.Euclidian)}
            role="radio"
            aria-checked={renderMode === RenderMode.Euclidian}
            aria-label="Geometria Euclidiana"
          >
            EUCLIDEAN
          </button>
          <button 
            onClick={() => setRenderMode(RenderMode.Ramanujan)} 
            className={btnClass(renderMode === RenderMode.Ramanujan)}
            role="radio"
            aria-checked={renderMode === RenderMode.Ramanujan}
            aria-label="Projeção de Ramanujan"
          >
            RAMANUJAN
          </button>
        </div>
      </section>

      <div className="mt-auto pt-4 flex flex-col gap-1.5 border-t border-amber-900/20">
        <div className="flex gap-1">
          <button 
            onClick={undo} 
            className="flex-1 p-2 bg-zinc-900/50 text-amber-600 text-[9px] border border-amber-900/10 hover:border-amber-700 focus-visible:ring-2 focus-visible:ring-[#00ffff] transition-all"
            aria-label="Desfazer (Atalho: Ctrl+Z)"
          >
            UNDO
          </button>
          <button 
            onClick={clear} 
            className="flex-1 p-2 bg-red-950/10 text-red-900 text-[9px] border border-red-900/20 hover:border-red-600 hover:text-red-500 focus-visible:ring-2 focus-visible:ring-red-500 transition-all"
            aria-label="Limpar Espaço de Trabalho"
          >
            PURGE
          </button>
        </div>
      </div>
    </nav>
  );
};
