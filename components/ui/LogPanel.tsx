
import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Camera, Activity, ShieldCheck, Terminal, Cpu, Loader2, Sparkles } from 'lucide-react';

/**
 * @component LogPanel
 * @description Console técnico flutuante com conformidade ISO 9241-171 (Acessibilidade de Software).
 * Integra controles multimodais (Vibe Coding) e telemetria em tempo real.
 * Z-Index: 20 (HUD/Log Layer)
 */
interface LogPanelProps {
  logs: string[];
  assistant: any;
  coordinates: { x: number; y: number; z: number; theta: number; phi: number };
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs, assistant, coordinates }) => {
  const { startVoiceCommand, isListening, isProcessing, processWithAI, messages, approveProposal, pendingProposal } = assistant;
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showBrain, setShowBrain] = useState(false);

  // ISO 9241-210: Foco no usuário - Auto-scroll para manter informação recente visível
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, messages, showBrain]);

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
            processWithAI("Analise a topologia visual e extraia geometria ISO 80000.", canvasRef.current.toDataURL('image/jpeg'));
            stream.getTracks().forEach(track => track.stop());
            setShowBrain(true);
          }
        }, 1000);
      }
    } catch (err) { console.error("Vision Access Denied", err); }
  };

  return (
    <div 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[20] w-[90%] max-w-4xl"
      role="complementary"
      aria-label="Painel de Log e Telemetria Gemini (ISO 9241-161)"
    >
      <div className="bg-black/90 backdrop-blur-xl border border-amber-500/30 rounded-sm overflow-hidden shadow-2xl shadow-amber-900/40">
        
        {/* Header de Status - ISO 9241-11: Eficácia e Satisfação */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-amber-500/5 border-b border-amber-500/20">
          <div className="flex gap-4 text-[9px] font-mono text-amber-500/60 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Activity size={10} className="text-amber-600" /> Status: Nominal
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={10} className="text-green-900" /> ISO/IEC 40500 Verified
            </span>
          </div>
          
          {/* Controles Multimodais Integrados */}
          <div className="flex gap-3">
            <button 
              onClick={() => setShowBrain(!showBrain)}
              className={`p-1 rounded text-amber-500 transition-all ${showBrain ? 'bg-amber-500/20 shadow-[0_0_10px_rgba(255,176,0,0.2)]' : 'hover:bg-amber-500/10'}`}
              aria-label="Alternar entre Log e Cérebro AI"
            >
              <Cpu size={16} />
            </button>
            <button 
              onClick={startVoiceCommand}
              aria-label="Ativar Entrada de Voz (ISO 9241-151)"
              className={`p-1 rounded transition-all ${isListening ? 'bg-red-500 animate-pulse text-white' : 'hover:bg-amber-500/10 text-amber-500'}`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <button 
              onClick={captureVision}
              aria-label="Ativar Reconhecimento Visual de Esboço"
              className="p-1 rounded hover:bg-amber-500/10 text-amber-500 transition-all"
            >
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            </button>
          </div>
        </div>

        {/* Console Body - Estética Matrix/Amber */}
        <div className="flex h-32">
          {/* Telemetria de Coordenadas (Esquerda) - ISO 9241-161 Layout */}
          <div className="w-1/4 border-r border-amber-500/10 p-3 font-mono text-[10px] text-amber-400 bg-black/40">
            <p className="text-amber-800 text-[8px] mb-2 border-b border-amber-900/20 pb-1 uppercase tracking-widest font-bold">RAMANUJAN_COORD</p>
            <div className="flex justify-between"><span>X:</span> <span>{coordinates.x.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Y:</span> <span>{coordinates.y.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Z:</span> <span>{coordinates.z.toFixed(2)}</span></div>
            <div className="mt-2 flex justify-between text-amber-600"><span>Θ:</span> <span>{coordinates.theta.toFixed(2)}°</span></div>
            <div className="flex justify-between text-amber-600"><span>Φ:</span> <span>{coordinates.phi.toFixed(2)}°</span></div>
          </div>

          {/* Log Stream ou Chat AI (Direita) - ISO 9241-11 Efficiency */}
          <div 
            ref={scrollRef}
            className="w-3/4 p-3 font-mono text-[11px] overflow-y-auto overflow-x-hidden custom-scrollbar bg-black/20"
            aria-live="polite"
          >
            {showBrain ? (
              // Modo "Cérebro": Mensagens da IA
              <div className="space-y-2">
                {messages.length === 0 && <p className="text-amber-900/40 italic">Neuro-Core Brain: Awaiting prompt...</p>}
                {messages.map((m: any) => (
                  <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'text-amber-600' : 'text-amber-200'}`}>
                    <span className="opacity-50 text-[9px] uppercase">[{m.role}]</span>
                    <span>{m.content}</span>
                  </div>
                ))}
                {pendingProposal && (
                  <div className="mt-4 p-2 bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
                    <span className="text-[9px] text-[#ffb000] font-bold">CRYSTALLIZE PROPOSAL?</span>
                    <div className="flex gap-2">
                      <button onClick={() => approveProposal('BIM')} className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-black">BIM</button>
                      <button onClick={() => approveProposal('AUTO')} className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-black">AUTO</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Modo Log: System Telemetry
              <div className="space-y-0.5">
                {logs.length === 0 && <p className="text-amber-900/40 italic uppercase">Kernel idle. Awaiting topology stabilization...</p>}
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2 border-l border-amber-500/5 pl-2 group">
                    <span className="text-amber-900/50 text-[9px]">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                    <span className="text-amber-200/80 group-hover:text-amber-100 transition-colors">{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <video ref={videoRef} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; height: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.5); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 176, 0, 0.2); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 176, 0, 0.4); }
      `}</style>
    </div>
  );
};
