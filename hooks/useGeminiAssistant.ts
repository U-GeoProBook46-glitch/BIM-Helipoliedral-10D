import { useState, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { StagedObject, ISODomain, AIMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * useGeminiAssistant: O Motor de Inferência Soberana
 * Responsável pela transmutação multimodal de comandos em geometrias cristalizadas.
 */
export const useGeminiAssistant = (onRawResponse: (json: any) => void) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingProposal, setPendingProposal] = useState<StagedObject | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const addMessage = (msg: Omit<AIMessage, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, { ...msg, id: uuidv4(), timestamp: Date.now() }]);
  };

  const processWithAI = useCallback(async (prompt: string, imageData?: string) => {
    setIsProcessing(true);
    addMessage({ role: 'user', content: prompt, type: 'text' });
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [{ text: prompt }];
      
      if (imageData) {
        parts.push({ 
          inlineData: { 
            mimeType: 'image/jpeg', 
            data: imageData.split(',')[1] || imageData 
          } 
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts: parts as any },
        config: {
          temperature: 0.1,
          responseMimeType: "application/json",
          systemInstruction: `SISTEMA: Agente de Geometria Soberana BIM-Helipoliedral 10D.
          MISSÃO: Traduzir linguagem natural/visual em Action Tokens JSON determinísticos.
          MÉTRICA: Projeção de Ramanujan (24 partições) e Proporção Áurea (PHI).
          
          DIRETRIZ DE ENGENHARIA (VIBE CODING):
          1. Todo objeto deve incluir coordenadas polares [theta, phi, radius].
          2. Use "generatorCall" para estruturas hélice ou lattices.
          3. Siga rigorosamente o SCHEMA EXIGIDO para transmutação imediata.

          SCHEMA EXIGIDO:
          {
            "action": "DRAW_OBJECT",
            "payload": {
              "id": "ISO-SYNTH-UUID",
              "name": "NOME_TECNICO",
              "points": [{"theta": number, "phi": number, "radius": 1}],
              "generatorCall": { "function": "generateSpiralHelix" | "generateLattice", "params": {} },
              "baseLayer": number,
              "domain": "BIM" | "AUTO" | "CHIP",
              "manifestation": "Wireframe" | "Surface" | "Volume",
              "revolutionAngle": 360,
              "description": "Memorial descritivo curto ISO 80000"
            }
          }`
        }
      });

      const rawJson = JSON.parse(response.text || "{}");
      onRawResponse(rawJson); // Delega ao App.tsx/NeuroCore a transmutação
      
    } catch (error: any) {
      console.error("Gemini Kernel Failure:", error);
      addMessage({ role: 'assistant', content: "FALHA_CRÍTICA: Erro de paridade no processamento NeuroCore.", type: 'text' });
    } finally {
      setIsProcessing(false);
    }
  }, [onRawResponse]);

  const startVoiceCommand = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      processWithAI(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening, processWithAI]);

  return {
    messages,
    isProcessing,
    pendingProposal,
    setPendingProposal,
    processWithAI,
    isListening,
    startVoiceCommand,
    approveProposal: (domain: ISODomain) => {
      if (pendingProposal) {
        // Logica de aprovação pode ser integrada conforme necessário
      }
    }
  };
};