import { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { StagedObject, ISODomain } from '../types';

/**
 * BIM-Helipoliedral 10D: AI Engineering Assistant Hook
 * Atua como um Compilador de Geometria processando comandos de voz e texto.
 * Opera sob métricas de Ramanujan e 24 segmentos harmônicos.
 */

interface AssistantResponse {
  type: 'GEOMETRY_CRYSTALLIZATION' | 'TECHNICAL_ADVICE';
  command?: 'revolve' | 'extrude' | 'draw';
  data?: Partial<StagedObject>;
  message?: string;
}

export const useGeminiAssistant = (onCrystallize: (obj: StagedObject) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");

  const processWithAI = useCallback(async (prompt: string, imageData?: string) => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const contents: any[] = [{ text: prompt }];
      if (imageData) {
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageData.split(',')[1] || imageData
          }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts: contents as any },
        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
          systemInstruction: `Você é o Compilador de Geometria do Kernel BIM-Helipoliedral 10D.
          Sua missão é converter comandos de voz/texto ou imagens em topologia técnica.
          
          REGRAS MATEMÁTICAS:
          - Use 24 segmentos para divisores harmônicos.
          - Siga as Projeções de Ramanujan e a Proporção Áurea.
          - Respeite as 'Precision Lines'.
          
          COMANDO 'REVOLVE':
          - Se o usuário pedir para 'revolucionar' ou criar um sólido de revolução, gere uma única linha de perfil (points) que, ao ser rotacionada 360 graus, forma o objeto desejado.
          
          FORMATO DE SAÍDA (JSON):
          {
            "type": "GEOMETRY_CRYSTALLIZATION",
            "command": "revolve",
            "data": {
              "name": "Nome do Componente",
              "points": [[x, y, z], ...],
              "domain": "BIM" | "AUTO" | "CHIP",
              "description": "Detalhes técnicos",
              "recoveryScore": 0.0-1.0
            }
          }`
        }
      });

      const result: AssistantResponse = JSON.parse(response.text || "{}");
      
      if (result.type === 'GEOMETRY_CRYSTALLIZATION' && result.data) {
        const obj: StagedObject = {
          id: `AI-SYNTH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          name: result.data.name || "AI_CRYSTAL_UNIT",
          points: result.data.points || [],
          layer: 32.5,
          domain: result.data.domain || 'BIM' as ISODomain,
          subFolder: 'm',
          description: result.data.description || "Synthesized via AI Assistant",
          recoveryScore: result.data.recoveryScore || 0.95,
          timestamp: Date.now(),
          unit: 'm'
        };
        onCrystallize(obj);
      }
      
      return result;
    } catch (error) {
      console.error("AI Assistant Failure:", error);
      return { type: 'TECHNICAL_ADVICE', message: "Erro na compilação harmônica." };
    } finally {
      setIsProcessing(false);
    }
  }, [onCrystallize]);

  const startVoiceCommand = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech API não suportada neste navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLastTranscript(transcript);
      processWithAI(transcript);
    };

    recognition.start();
  }, [processWithAI]);

  return {
    startVoiceCommand,
    isListening,
    isProcessing,
    lastTranscript,
    processWithAI
  };
};