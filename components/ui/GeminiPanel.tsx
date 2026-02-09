import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, ChevronRight, Terminal, FileText, Check, Layers } from 'lucide-react';
import { AIMessage, ISODomain, StagedObject } from '../../types';

interface GeminiPanelProps {
  messages: AIMessage[];
  isProcessing: boolean;
  onApprove: (domain: ISODomain) => void;
  onClose: () => void;
  pendingProposal: StagedObject | null;
}

export const GeminiPanel: React.FC<GeminiPanelProps> = ({ 
  messages, isProcessing, onApprove, onClose, pendingProposal 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 left-72 ml-4 z-[100] p-3 bg-black border border-[#ffb000] rounded-full shadow-[0_0_15px_rgba(255,176,0,0.4)] hover:scale-110 transition-all group"
        aria-label="Abrir Agente de Geometria"
        title="Agente de Geometria Soberana"
      >
        <Sparkles className="text-[#ffb000] group-hover:animate-pulse" size={18} />
      </button>
    );
  }

  return (
    <div 
      className="fixed top-6 left-72 ml-4 w-[420px] h-[650px] bg-[#050400]/98 border border-[#ffb000]/30 backdrop-blur-2xl z-[100] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-in slide-in-from-left-4 rounded-sm overflow-hidden"
      role="dialog"
      aria-label="Terminal do Agente de Geometria"
    >
      <header className="p-4 border-b border-amber-900/20 flex justify-between items-center bg-black/60">
        <div className="flex items-center gap-3">
          <Sparkles size={14} className="text-[#ffb000] animate-pulse" />
          <h2 className="text-[9px] font-black tracking-[0.3em] text-[#ffb000] uppercase">Sovereign Geometry Agent</h2>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-amber-900 hover:text-[#ffb000] transition-colors p-1"
          aria-label="Minimizar Assistente"
        >
          <X size={16} />
        </button>
      </header>

      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_center,_rgba(255,176,0,0.03)_0%,_transparent_100%)]"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
            <Terminal size={40} className="text-amber-900" />
            <p className="text-[10px] uppercase tracking-widest text-center">Aguardando Intenção de Desenho...</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group`}>
            <div className={`max-w-[95%] p-4 rounded-sm text-[11px] leading-relaxed transition-all ${
              msg.role === 'user' 
                ? 'bg-amber-950/10 border border-amber-900/30 text-amber-100 shadow-[4px_4px_0px_rgba(255,176,0,0.05)]' 
                : 'bg-black/80 border border-amber-900/10 text-zinc-300 shadow-[-4px_4px_0px_rgba(255,176,0,0.02)]'
            }`}>
              {msg.type === 'geometry_proposal' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#ffb000] font-black uppercase text-[8px] tracking-[0.2em] border-b border-amber-900/10 pb-2">
                    <Terminal size={14} /> SÍNTESE GEOMÉTRICA ATIVA
                  </div>
                  <div className="font-mono text-[10px] text-zinc-400 bg-amber-950/5 p-2 italic border-l-2 border-[#ffb000]">
                    {msg.content}
                  </div>
                  <div className="relative group/code">
                    <pre className="text-[9px] bg-[#020202] p-3 border border-amber-900/20 overflow-x-auto text-amber-600/70 font-mono leading-tight custom-scrollbar">
                      {JSON.stringify(msg.proposalData, null, 2)}
                    </pre>
                    <div className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                      <Terminal size={10} className="text-amber-900" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  {msg.role === 'assistant' && <FileText size={14} className="shrink-0 mt-0.5 text-amber-800" />}
                  <p className="font-mono">{msg.content}</p>
                </div>
              )}
            </div>
            <span className="text-[7px] text-amber-900/60 mt-2 uppercase tracking-widest font-bold px-1 group-hover:text-amber-600 transition-colors">
              {msg.role === 'user' ? 'Engineering_Input' : 'AI_Kernel_Response'} | {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {isProcessing && (
          <div className="flex items-center gap-3 text-[9px] text-amber-600 animate-pulse font-mono uppercase tracking-[0.3em] pl-2">
            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce"></div>
            Processando Harmônicos de Ramanujan...
          </div>
        )}
      </div>

      {pendingProposal && (
        <div className="p-5 border-t border-[#ffb000]/20 bg-amber-500/5 space-y-4 animate-in slide-in-from-bottom-4">
          <p className="text-[9px] text-[#ffb000] font-black uppercase tracking-[0.3em] text-center mb-1">
            CRISTALIZAÇÃO SOBERANA
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(['BIM', 'AUTO', 'CHIP'] as ISODomain[]).map(d => (
              <button 
                key={d}
                onClick={() => onApprove(d)}
                className="group p-3 border border-amber-900/30 bg-black/40 text-[9px] font-black text-amber-700 hover:border-[#ffb000] hover:text-[#ffb000] hover:bg-amber-950/20 transition-all flex flex-col items-center gap-2 shadow-sm active:scale-95"
                aria-label={`Aprovar cristalização em ${d}`}
              >
                <Layers size={14} className="group-hover:scale-110 transition-transform" /> 
                <span className="tracking-widest">{d}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};