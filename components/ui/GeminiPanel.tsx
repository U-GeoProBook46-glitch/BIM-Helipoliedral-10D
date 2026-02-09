
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Terminal, Mic, MicOff, Camera, Loader2, Layers, Cpu, Maximize2, Minimize2 } from 'lucide-react';
import { ISODomain, StagedObject } from '../../types';

interface GeminiPanelProps {
  assistant: any; 
  onApprove: (domain: ISODomain) => void;
  pendingProposal: StagedObject | null;
}

/**
 * GeminiPanel: O "Cérebro" (Brain) Multimodal do BIM-Helipoliedral 10D.
 * Conformidade ISO 9241 & WCAG 2.2.
 */
export const GeminiPanel: React.FC<GeminiPanelProps> = ({ 
  assistant, onApprove, pendingProposal 
}) => {
  const { messages, isProcessing, startVoiceCommand, isListening, processWithAI } = assistant;
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isProcessing]);

  const captureVision = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => videoRef.current!.onloadedmetadata = resolve);
        videoRef.current.play();
        setTimeout(() => {
          if (canvasRef.current && videoRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            ctx?.drawImage(videoRef.current, 0, 0);
            processWithAI("Analise a topologia visual e extraia geometria ISO 80000 para materialização.", canvasRef.current.toDataURL('image/jpeg'));
            stream.getTracks().forEach(track => track.stop());
          }
        }, 1000);
      }
    } catch (err) { console.error("Vision Access Denied", err); }
  };

  // Ícone Neon Flutuante (Estado Minimizado)
  if (isMinimized) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="fixed top-6 left-20 z-50 p-3 bg-black/90 border-2 border-[#ffb000] rounded-full shadow-[0_0_15px_rgba(255,176,0,0.4)] hover:scale-110 transition-all group"
        aria-label="Abrir Cérebro AI (Gemini Kernel)"
        title="Abrir Terminal de IA Soberana"
      >
        <Sparkles size={20} className="text-[#ffb000] group-hover:rotate-12 transition-transform" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#ffb000] rounded-full animate-ping opacity-20"></div>
      </button>
    );
  }

  return (
    <div 
      className={`fixed top-6 left-20 z-50 w-[420px] max-h-[85vh] bg-[#050400]/95 border-2 border-[#ffb000]/30 backdrop-blur-3xl flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-sm animate-in slide-in-from-top-4 duration-300`}
      role="dialog"
      aria-label="Sovereign NeuroCore Terminal"
    >
      <header className="p-4 border-b border-amber-500/10 flex justify-between items-center bg-amber-500/5">
        <div className="flex items-center gap-3">
          <Cpu size={16} className="text-[#ffb000]" />
          <div>
            <h2 className="text-[10px] font-black tracking-[0.2em] text-[#ffb000] uppercase">NEURO-CORE BRAIN</h2>
            <p className="text-[7px] text-amber-900 font-bold uppercase">ISO 9241-171 Sovereign Interface</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsMinimized(true)} 
            className="text-amber-900 hover:text-white p-1 transition-colors"
            aria-label="Minimizar Cérebro"
          >
            <Minimize2 size={14} />
          </button>
          <button 
            onClick={() => setIsMinimized(true)} 
            className="text-amber-900 hover:text-red-500 p-1 transition-colors"
            aria-label="Fechar Terminal"
          >
            <X size={14} />
          </button>
        </div>
      </header>

      {/* Multimodal Command Hub */}
      <div className="grid grid-cols-2 gap-px bg-amber-500/10">
        <button 
          onClick={startVoiceCommand}
          className={`flex flex-col items-center justify-center p-4 transition-all bg-[#050400] hover:bg-amber-500/5 ${isListening ? 'text-red-500' : 'text-amber-500'}`}
          aria-label={isListening ? "Desativar Microfone" : "Ativar Comando de Voz"}
        >
          {isListening ? (
            <div className="relative">
              <MicOff size={18} />
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
            </div>
          ) : <Mic size={18} />}
          <span className="text-[7px] font-bold mt-2 uppercase tracking-widest">{isListening ? 'Listening...' : 'Voice Command'}</span>
        </button>
        
        <button 
          onClick={captureVision}
          disabled={isProcessing}
          className="flex flex-col items-center justify-center p-4 transition-all bg-[#050400] hover:bg-amber-500/5 text-amber-500 disabled:opacity-30"
          aria-label="Capturar Visão para Análise"
        >
          {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
          <span className="text-[7px] font-bold mt-2 uppercase tracking-widest">Vision Analysis</span>
        </button>
      </div>

      {/* Memory Scroll (AI Responses) */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar bg-black/20"
        style={{ scrollBehavior: 'smooth' }}
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 pointer-events-none">
            <Sparkles size={40} className="text-amber-900 mb-4" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em]">Awaiting Geometry Intent</p>
          </div>
        )}
        
        {messages.map((msg: any) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[92%] p-3 border-l-2 ${
              msg.role === 'user' 
                ? 'bg-amber-500/5 border-amber-500/40 text-amber-100' 
                : 'bg-zinc-900/60 border-zinc-700 text-zinc-300'
            }`}>
              <span className="text-[6px] block mb-2 opacity-50 font-black uppercase tracking-[0.2em]">{msg.role}</span>
              
              {/* Formatação Condicional de Dados/Texto */}
              {msg.type === 'geometry_proposal' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#ffb000] text-[9px] font-black">
                    <Terminal size={10} /> ISO_GEOMETRY_PROPOSAL
                  </div>
                  <p className="text-[10px] leading-relaxed font-mono italic opacity-80">{msg.content}</p>
                </div>
              ) : (
                <p className="text-[11px] leading-relaxed font-mono whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex items-center gap-2 text-amber-500/40 px-2">
            <Loader2 size={10} className="animate-spin" />
            <span className="text-[8px] font-black uppercase animate-pulse">NeuroCore_Processing...</span>
          </div>
        )}
      </div>

      {/* Crystallization Workflow: Interceptação do Gemini Proposal */}
      {pendingProposal && (
        <div className="p-5 border-t-2 border-[#ffb000]/20 bg-[#0a0800] space-y-4 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[9px] text-[#ffb000] font-black uppercase tracking-[0.3em]">Crystallization Workflow</h3>
            <span className="text-[7px] text-amber-900 font-bold">24 PARTITIONS RAMANUJAN</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {(['BIM', 'AUTO', 'CHIP'] as ISODomain[]).map(domain => (
              <button 
                key={domain} 
                onClick={() => onApprove(domain)} 
                className="group p-3 border border-amber-900/40 bg-black/40 text-[8px] font-black text-amber-700 hover:border-[#ffb000] hover:text-[#ffb000] transition-all flex flex-col items-center gap-2"
                aria-label={`Cristalizar no domínio ${domain}`}
              >
                <Layers size={14} className="group-hover:scale-110 transition-transform" />
                <span>{domain}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hidden processing buffers */}
      <video ref={videoRef} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.4); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,176,0,0.3); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,176,0,0.6); }
      `}</style>
    </div>
  );
};
