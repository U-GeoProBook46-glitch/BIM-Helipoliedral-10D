
import React from 'react';
import { ChevronLeft, ChevronRight, Save, Undo2, Trash2, Box, Layers, Settings2, Eye, Compass, MoveUp } from 'lucide-react';
import { AppMode, RenderMode, Manifestation } from '../../types';

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
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
  layer: number;
  setLayer: (l: number) => void;
  revolutionAngle: number;
  setRevolutionAngle: (a: number) => void;
}

/**
 * LeftSidebar: Controle de Operação ISO 9241-161.
 * Consolida controles de geometria, parâmetros helipoliedrais e materialização.
 * Z-Index: 10
 */
export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isOpen, onToggle, mode, setMode, precisionLines, setPrecisionLines, undo, clear,
  renderMode, setRenderMode, manifestation, setManifestation, save,
  layer, setLayer, revolutionAngle, setRevolutionAngle
}) => {
  const btnClass = (active: boolean) => `
    w-full p-2.5 text-[9px] font-bold transition-all border mb-1 flex items-center justify-between
    outline-none focus-visible:ring-1 focus-visible:ring-[#ffb000]
    ${active ? 'bg-[#ffb000] text-black border-[#ffb000]' : 'bg-black/40 text-amber-800 border-amber-900/20 hover:border-amber-600/50 hover:bg-amber-500/5'}
  `;

  return (
    <div 
      className={`relative transition-all duration-300 z-10 flex ${isOpen ? 'w-64' : 'w-12'}`}
      role="navigation"
      aria-label="Barra de Ferramentas de Engenharia"
    >
      <nav 
        className={`h-full w-full bg-[#050400]/95 border-r border-amber-900/30 p-5 pt-28 flex flex-col gap-6 backdrop-blur-3xl overflow-y-auto custom-scrollbar ${!isOpen && 'hidden'}`}
        aria-hidden={!isOpen}
      >
        <section aria-labelledby="materializer-title">
          <h3 id="materializer-title" className="text-[9px] text-amber-900 font-black mb-3 uppercase tracking-widest border-b border-amber-900/10 pb-1">
            ISO Materializer
          </h3>
          <button 
            onClick={save} 
            className="w-full p-3.5 bg-[#ffb000] text-black font-black text-[10px] hover:bg-white transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,176,0,0.1)] active:scale-95"
          >
             <Save size={14} /> Crystallize
          </button>
        </section>

        {/* Parâmetros Helipoliedrais 10D */}
        <section aria-labelledby="params-title">
          <h3 id="params-title" className="text-[9px] text-amber-900 font-black mb-4 uppercase tracking-widest border-b border-amber-900/10 pb-1 flex items-center gap-2">
            <Compass size={10} /> 10D Parameters
          </h3>
          
          <div className="mb-4">
            <div className="flex justify-between text-[7px] mb-2 uppercase tracking-widest text-amber-600 font-bold">
              <span className="flex items-center gap-1"><MoveUp size={8}/> Elevation L{layer.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="1" max="60" step="0.5" 
              value={layer} 
              onChange={(e) => setLayer(parseFloat(e.target.value))} 
              className="w-full h-1 bg-amber-950/30 accent-[#ffb000] cursor-pointer appearance-none hover:accent-white transition-all" 
              aria-label="Ajustar Camada de Elevação Ramanujan" 
            />
          </div>

          <div>
            <div className="flex justify-between text-[7px] mb-2 uppercase tracking-widest text-amber-600 font-bold">
              <span className="flex items-center gap-1"><Box size={8}/> Revolve {revolutionAngle}°</span>
            </div>
            <input 
              type="range" min="0" max="360" step="1" 
              value={revolutionAngle} 
              onChange={(e) => setRevolutionAngle(parseFloat(e.target.value))} 
              className="w-full h-1 bg-amber-950/30 accent-[#ffb000] cursor-pointer appearance-none hover:accent-white transition-all" 
              aria-label="Ajustar Ângulo de Revolução" 
            />
          </div>
        </section>

        <section aria-labelledby="mode-title">
          <h3 id="mode-title" className="text-[9px] text-amber-900 font-black mb-3 uppercase tracking-widest border-b border-amber-900/10 pb-1 flex items-center gap-2">
            <Settings2 size={10} /> Mode
          </h3>
          <button onClick={() => setMode(AppMode.Lathe)} className={btnClass(mode === AppMode.Lathe)}>
             <span>LATHE_TORNO</span>
             <Box size={10} />
          </button>
          <button onClick={() => setMode(AppMode.Assembly)} className={btnClass(mode === AppMode.Assembly)}>
             <span>ASSEMBLY_BIM</span>
             <Layers size={10} />
          </button>
        </section>

        <section aria-labelledby="render-title">
          <h3 id="render-title" className="text-[9px] text-amber-900 font-black mb-3 uppercase tracking-widest border-b border-amber-900/10 pb-1 flex items-center gap-2">
            <Eye size={10} /> Visualization
          </h3>
          <button 
            onClick={() => setPrecisionLines(!precisionLines)} 
            className={btnClass(precisionLines)}
            aria-pressed={precisionLines}
          >
            <span>SNAPPING_LINES</span>
          </button>
          {Object.values(Manifestation).map(m => (
            <button key={m} onClick={() => setManifestation(m)} className={btnClass(manifestation === m)}>
               <span>{m.toUpperCase()}</span>
            </button>
          ))}
        </section>

        <section className="mt-auto pt-4 flex flex-col gap-1.5 border-t border-amber-900/20">
          <button onClick={undo} className="w-full p-2.5 bg-zinc-900/50 text-amber-700 text-[10px] font-bold border border-amber-900/10 hover:border-amber-600 flex items-center justify-center gap-2 transition-all active:scale-95">
            <Undo2 size={12} /> UNDO
          </button>
          <button onClick={clear} className="w-full p-2.5 bg-red-950/20 text-red-900 text-[10px] font-bold border border-red-900/20 hover:text-red-500 hover:border-red-600 flex items-center justify-center gap-2 transition-all active:scale-95">
            <Trash2 size={12} /> PURGE
          </button>
        </section>
      </nav>

      <button 
        onClick={onToggle}
        className="absolute top-1/2 -right-3 w-6 h-12 bg-amber-900/10 border border-amber-900/40 text-amber-500 flex items-center justify-center backdrop-blur-md rounded-r-md hover:bg-amber-900/30 transition-all z-10"
        aria-label={isOpen ? "Recolher Painel de Controle" : "Expandir Painel de Controle"}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </div>
  );
};
