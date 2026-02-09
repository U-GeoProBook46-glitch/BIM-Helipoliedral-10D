import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { StagedObject } from '../../types';
import { DigitalStock } from './DigitalStock';
import { geminiService } from '../../services/geminiService';
import { Sparkles, Box, Send } from 'lucide-react';

interface RightSidebarProps {
  stock: StagedObject[];
  onSelect: (id: string) => void;
  selectedId: string | null;
  onAIGenerated?: (obj: StagedObject) => void;
  onDeploy?: (id: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ stock, onSelect, selectedId, onAIGenerated, onDeploy }) => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim() || !onAIGenerated) return;
    setIsGenerating(true);
    try {
      const data = await geminiService.synthesizeComponent(aiPrompt);
      
      onAIGenerated({
        id: `ISO-${uuidv4().slice(0,8).toUpperCase()}`,
        name: data.name || "AI_SYNTH_COMP",
        points: data.points || [],
        layer: 32.5,
        domain: data.domain || 'BIM',
        subFolder: 'm',
        description: data.description || "AI Generated via Engineering Prompt",
        recoveryScore: data.recoveryScore || 0.95,
        timestamp: Date.now(),
        unit: 'm'
      });
      setAiPrompt("");
    } catch (e: any) { 
      console.error("Engineering Kernel Exception:", e); 
      if (e.message?.includes("Requested entity was not found.")) {
        if (typeof (window as any).aistudio?.openSelectKey === 'function') {
          (window as any).aistudio.openSelectKey();
        }
      }
    } finally { 
      setIsGenerating(false); 
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-72 bg-[#050400]/95 border-l border-amber-900/20 p-6 pt-24 z-40 backdrop-blur-xl flex flex-col gap-4 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
      <section className="flex-1 overflow-hidden flex flex-col">
        <h3 className="text-[9px] text-amber-700 font-black mb-3 uppercase tracking-[0.2em] border-b border-amber-900/10 pb-1 flex items-center gap-2">
          <Box size={10} />
          ISO Digital Stock
        </h3>
        <DigitalStock stock={stock} onSelect={onSelect} selectedId={selectedId} />
      </section>

      <section className="mt-4 pt-4 border-t border-amber-900/20">
        {selectedId && onDeploy && (
          <button 
            onClick={() => onDeploy(selectedId)}
            className="w-full mb-6 p-3 bg-[#00ff41]/10 text-[#00ff41] text-[10px] font-bold border border-[#00ff41]/40 hover:bg-[#00ff41]/20 transition-all uppercase tracking-widest flex justify-between items-center group"
          >
            <span>DEPLOY TO SCENE</span>
            <Send size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        <h3 className="text-[9px] text-[#ffb000] font-black mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
          <Sparkles size={10} />
          Engineering Prompt
        </h3>
        <textarea 
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Especifique parâmetros técnicos..."
          className="w-full bg-[#0a0800] border border-amber-900/30 p-3 text-[10px] text-amber-400 font-mono h-24 focus:border-[#ffb000] outline-none resize-none transition-colors"
        />
        <button 
          onClick={handleAIGenerate}
          disabled={isGenerating}
          className="w-full mt-2 p-2 bg-amber-900/20 text-[#ffb000] text-[10px] font-bold border border-amber-900/40 hover:bg-amber-900/40 transition-colors uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGenerating ? "CRYSTALLIZING..." : "SYNTHESIZE COMPONENT"}
        </button>
      </section>
    </div>
  );
};