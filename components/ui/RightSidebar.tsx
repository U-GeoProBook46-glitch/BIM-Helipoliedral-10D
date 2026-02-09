
import React from 'react';
import { ChevronRight, ChevronLeft, Package, Activity, Wrench, AlertTriangle, Info } from 'lucide-react';
import { StagedObject, AssemblyInstance } from '../../types';
import { DigitalStock } from './DigitalStock';

interface RightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  stock: StagedObject[];
  onSelect: (id: string) => void;
  selectedId: string | null;
  onDeploy?: (id: string) => void;
  selectedInstance?: AssemblyInstance;
}

/**
 * RightSidebar: Gestão de Ativos e Sustentabilidade (ISO 20887).
 * Integra o Stock Digital e o painel fixo de Desmontagem.
 * Z-Index: 10
 */
export const RightSidebar: React.FC<RightSidebarProps> = ({ 
  isOpen, onToggle, stock, onSelect, selectedId, onDeploy, selectedInstance 
}) => {
  return (
    <div 
      className={`relative transition-all duration-300 z-10 flex flex-row-reverse ${isOpen ? 'w-72' : 'w-12'}`}
      role="complementary"
      aria-label="Inventário e Análise de Sustentabilidade"
    >
      <nav 
        className={`h-full w-full bg-[#050400]/95 border-l border-amber-900/30 p-6 pt-24 flex flex-col gap-4 backdrop-blur-3xl overflow-y-auto custom-scrollbar ${!isOpen && 'hidden'}`}
        aria-hidden={!isOpen}
      >
        <section className="flex-1 overflow-hidden flex flex-col">
          <header className="mb-4 flex items-center justify-between border-b border-amber-900/20 pb-1">
            <h3 className="text-[9px] text-amber-900 font-black uppercase tracking-widest flex items-center gap-2">
              <Package size={12} /> Digital Stock
            </h3>
          </header>
          <DigitalStock stock={stock} onSelect={onSelect} selectedId={selectedId} />
        </section>

        {/* Painel DfD Integrado (ISO 20887) - Requisito da Missão */}
        <section 
          className="mt-4 pt-4 border-t border-amber-900/20 bg-amber-500/5 p-3 rounded-sm space-y-3"
          aria-labelledby="dfd-panel-title"
        >
          <div className="flex items-center justify-between">
            <h3 id="dfd-panel-title" className="text-[9px] text-[#ffb000] font-black uppercase tracking-widest flex items-center gap-2">
              <Activity size={12} /> Disassembly (DfD)
            </h3>
            {/* Fix: Wrapped Info icon in a span because Lucide icons do not support the 'title' prop directly in this context. */}
            <span title="ISO 20887 Analysis">
              <Info size={10} className="text-amber-900" />
            </span>
          </div>
          
          {selectedInstance ? (
            <div className="space-y-2 animate-in fade-in duration-500">
              <div 
                className="flex justify-between items-center bg-black/40 p-2 border border-amber-900/30"
                aria-label={`Índice de Recuperação: ${(selectedInstance.dfd.recyclabilityIndex * 100).toFixed(0)}%`}
              >
                <span className="text-[8px] text-amber-800 uppercase font-bold">Recovery_Index:</span>
                <span className="text-[11px] text-[#00ff41] font-black">{(selectedInstance.dfd.recyclabilityIndex * 100).toFixed(0)}%</span>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[8px] text-zinc-500 uppercase font-bold">
                  <Wrench size={10} className="text-amber-700" />
                  <span>Tool: {selectedInstance.dfd.disassemblyTool}</span>
                </div>

                <div className="flex items-center gap-2 text-[8px] text-zinc-500 uppercase font-bold">
                  <AlertTriangle size={10} className="text-red-900" />
                  <span>Phase: {selectedInstance.dfd.lifecyclePhase}</span>
                </div>
              </div>

              {onDeploy && selectedId && (
                <button 
                  onClick={() => onDeploy(selectedId)}
                  className="w-full mt-2 p-2.5 bg-[#ffb000] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all active:scale-95"
                  aria-describedby="iso-9241-11-efficiency"
                >
                  Materialize Instance
                </button>
              )}
            </div>
          ) : (
            <div className="py-6 text-center border border-dashed border-amber-900/10">
              <p className="text-[8px] text-amber-900/40 uppercase italic">
                Select Asset for DfD Analysis
              </p>
            </div>
          )}
        </section>
      </nav>

      {/* Botão de Toggle Sidebar (ISO 9241-161) */}
      <button 
        onClick={onToggle}
        className="absolute top-1/2 -left-3 w-6 h-12 bg-amber-900/10 border border-amber-900/40 text-amber-500 flex items-center justify-center backdrop-blur-md rounded-r-md hover:bg-amber-900/30 transition-all z-10"
        aria-label={isOpen ? "Recolher Painel de Inventário" : "Expandir Painel de Inventário"}
      >
        {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );
};
