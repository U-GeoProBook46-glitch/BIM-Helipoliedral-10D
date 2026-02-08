import React, { useState } from 'react';
import { StagedObject, ISODomain } from '../../types';
import { generateISOBoardSVG } from '../../utils/exporters/isoExporter';

interface DigitalStockProps {
  stock: StagedObject[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

const DigitalStock: React.FC<DigitalStockProps> = ({ stock, onSelect, selectedId }) => {
  const [expanded, setExpanded] = useState<string[]>(['BIM', 'AUTO', 'CHIP']);
  const toggle = (folder: string) => setExpanded(prev => prev.includes(folder) ? prev.filter(f => f !== folder) : [...prev, folder]);

  const exportSVG = (obj: StagedObject) => {
    const svg = generateISOBoardSVG(obj);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${obj.name}_${obj.id}.svg`;
    a.click();
  };

  const renderFolder = (name: ISODomain) => {
    const items = stock.filter(o => o.domain === name);
    const isOpen = expanded.includes(name);

    return (
      <div className="mb-3">
        <button onClick={() => toggle(name)} className="w-full flex justify-between items-center text-[10px] font-bold text-amber-700 hover:text-amber-500 py-2 border-b border-amber-900/10 uppercase tracking-widest">
          <span>{isOpen ? '▼' : '▶'} {name} REGISTRY</span>
          <span className="opacity-40">{items.length}</span>
        </button>
        {isOpen && (
          <div className="mt-2 space-y-1">
            {items.length === 0 && <div className="text-[8px] text-zinc-800 italic p-3 border border-dashed border-zinc-900">NO CRYSTALLIZED ATOMS</div>}
            {items.map(obj => (
              <div 
                key={obj.id}
                className={`group p-3 border cursor-pointer transition-all ${selectedId === obj.id ? 'border-[#ffb000] bg-amber-500/5' : 'border-zinc-900 bg-zinc-900/10 hover:border-amber-900/40'}`}
                onClick={() => onSelect(obj.id)}
              >
                <div className="flex justify-between text-[8px] mb-1">
                  <span className="text-zinc-600 font-mono tracking-tighter">{obj.id}</span>
                  <button onClick={(e) => { e.stopPropagation(); exportSVG(obj); }} className="text-[#ffb000] opacity-0 group-hover:opacity-100 hover:underline">EXPORT ISO</button>
                </div>
                <div className="text-[10px] font-bold text-amber-100 truncate">{obj.name}</div>
                <div className="flex justify-between text-[8px] text-zinc-700 mt-2">
                  <span>SCALE: {obj.subFolder}</span>
                  <span>{obj.recoveryScore.toFixed(3)} DfD</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">{renderFolder('BIM')}{renderFolder('AUTO')}{renderFolder('CHIP')}</div>;
};

export default DigitalStock;