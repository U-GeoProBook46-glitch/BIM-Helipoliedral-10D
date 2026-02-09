import React, { useEffect, useRef } from 'react';

interface LogPanelProps {
  logs: string[];
}

/**
 * BIM-Helipoliedral 10D: Terminal de Logs de Engenharia
 * Exibe interações em tempo real com o Canvas 3D.
 */
export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div 
      className="fixed bottom-32 right-6 w-64 h-48 bg-black/80 border border-amber-900/30 backdrop-blur-md p-3 z-30 flex flex-col pointer-events-none select-none"
      aria-label="Console de Logs Técnicos"
    >
      <div className="text-[8px] text-amber-900 font-bold uppercase tracking-widest mb-2 border-b border-amber-900/10 pb-1 flex justify-between">
        <span>System Log</span>
        <span className="animate-pulse">ONLINE</span>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1"
      >
        {logs.length === 0 && (
          <div className="text-[8px] text-amber-900/40 italic uppercase">Awaiting topology input...</div>
        )}
        {logs.map((log, i) => (
          <div 
            key={i} 
            className="text-[9px] font-mono leading-tight text-amber-500/80 border-l border-amber-900/20 pl-2 py-0.5"
          >
            <span className="text-amber-900 mr-1">[{new Date().toLocaleTimeString()}]</span>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
