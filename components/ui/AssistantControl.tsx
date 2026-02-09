
import React, { useRef } from 'react';
import { Mic, MicOff, Camera, Loader2 } from 'lucide-react';

interface AssistantControlProps {
  assistant: any; // Shared instance from App.tsx
}

/**
 * BIM-Helipoliedral 10D: Assistant Control Unit
 * Provides multimodal entry points for voice and vision commands.
 */
export const AssistantControl: React.FC<AssistantControlProps> = ({ assistant }) => {
  const { startVoiceCommand, isListening, isProcessing, lastTranscript, processWithAI } = assistant;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * captureVision: Captures a video frame and sends it to Gemini for topology analysis.
   */
  const captureVision = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => videoRef.current!.onloadedmetadata = resolve);
        videoRef.current.play();
        
        // Brief delay for visual focus stability
        setTimeout(() => {
          if (canvasRef.current && videoRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            ctx?.drawImage(videoRef.current, 0, 0);
            const imageData = canvasRef.current.toDataURL('image/jpeg');
            processWithAI("Analise este esboço ou componente e extraia a topologia helipoliedral para síntese 10D.", imageData);
            
            // Cleanup media stream resources
            stream.getTracks().forEach(track => track.stop());
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Vision Access Denied:", err);
    }
  };

  return (
    <div className="fixed bottom-32 left-6 z-50 flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={startVoiceCommand}
          disabled={isProcessing}
          className={`p-4 rounded-full shadow-2xl transition-all border-2 ${
            isListening 
              ? 'bg-red-900/40 border-red-500 animate-pulse' 
              : 'bg-black/90 border-amber-900/40 hover:border-[#ffb000]'
          } disabled:opacity-50`}
          title="Comando de Voz (Compilador de Geometria)"
        >
          {isListening ? <MicOff className="text-red-500" /> : <Mic className="text-[#ffb000]" />}
        </button>

        <button
          onClick={captureVision}
          disabled={isProcessing}
          className="p-4 rounded-full bg-black/90 border-2 border-amber-900/40 hover:border-[#ffb000] shadow-2xl transition-all disabled:opacity-50"
          title="Vision-to-BIM (Análise de Topologia)"
        >
          {isProcessing ? <Loader2 className="text-[#ffb000] animate-spin" /> : <Camera className="text-[#ffb000]" />}
        </button>
      </div>

      {lastTranscript && (
        <div className="bg-black/80 border border-amber-900/30 p-2 text-[9px] text-amber-500 font-mono max-w-[200px] backdrop-blur-md animate-in fade-in slide-in-from-left-2">
          <span className="text-amber-900 mr-1 uppercase">Vocal_Input:</span>
          "{lastTranscript}"
        </div>
      )}

      {/* Hidden helper elements for media processing */}
      <video ref={videoRef} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
