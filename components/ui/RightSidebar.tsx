
import React, { useState } from 'react';
import { StagedObject } from '../../types';
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import DigitalStock from './DigitalStock';

interface RightSidebarProps {
  stock: StagedObject[];
  onSelect: (id: string) => void;
  selectedId: string | null;
  onAIGenerated?: (obj: StagedObject) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ stock, onSelect, selectedId, onAIGenerated }) => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim() || !onAIGenerated) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: aiPrompt,
        config: {
          systemInstruction: "Você é o Kernel BIM-Helipoliedral 10D. Retorne JSON estruturado para engenharia.",
          responseMimeType: "application/json"
        }
      });
      
      const responseText = response.text;
      const data = JSON.parse(responseText || "{}");
      
      onAIGenerated({
        id: `AI-${uuidv4().slice(0,4)}`,
        name: data.name || "AI_SYNTH",
        points: data.points || [],
        layer: 32.5,
        domain: data.domain || 'BIM',
        subFolder: 'm',
        description: data.desc || "AI Generated",
        recoveryScore: 0.9,
        timestamp: Date.now()
      } as any);
      setAiPrompt("");
    } catch (e) { 
      console.error("AI Generation Error:", e); 
      if (e instanceof Error && e.message.includes("Requested entity was not found.")) {
        if (typeof (window as any).aistudio?.openSelectKey === 'function') {
          await (window as any).aistudio.openSelectKey();
        }
      }
    } finally { 
      setIsGenerating(false); 
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-72 bg-black/95 border-l border-amber-900/30 p-6 pt-24 z-40 backdrop-blur-xl flex flex-col gap-4">
      <section className="flex-1 overflow-hidden flex flex-col">
        <h3 className="text-[9px] text-amber-700 mb-3 uppercase tracking-widest border-b border-amber-900/20 pb-1">ISO Digital Stock</h3>
        <DigitalStock stock={stock} onSelect={onSelect} selectedId={selectedId} />
      </section>

      <section className="mt-4 pt-4 border-t border-amber-900/20">
        <h3 className="text-[9px] text-[#ffb000] mb-3 uppercase tracking-widest">AI Engineering Kernel</h3>
        <textarea 
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Enter design specs..."
          className="w-full bg-[#0a0800] border border-amber-900/30 p-3 text-[10px] text-amber-400 font-mono h-24 focus:border-[#ffb000] outline-none resize-none"
        />
        <button 
          onClick={handleAIGenerate}
          disabled={isGenerating}
          className="w-full mt-2 p-2 bg-amber-900/20 text-[#ffb000] text-[10px] font-bold border border-amber-900/40 hover:bg-amber-900/40 transition-colors"
        >
          {isGenerating ? "PROCESSING..." : "SYNTHESIZE FROM TEXT"}
        </button>
      </section>
    </div>
  );
};

export default RightSidebar;
