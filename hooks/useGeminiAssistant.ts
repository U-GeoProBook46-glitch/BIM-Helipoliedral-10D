import { useState, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { StagedObject, ISODomain, AIMessage } from '../types';
import { NeuroCoreService } from '../services/NeuroCore';
import { v4 as uuidv4 } from 'uuid';

/**
 * BIM-Helipoliedral 10D: Sovereign Geometry Agent Hook
 * Orquestra a síntese de geometria soberana e tradução via NeuroCore.
 */
export const useGeminiAssistant = (onCrystallize: (obj: StagedObject) => void) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingProposal, setPendingProposal] = useState<StagedObject | null>(null);
  
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const addMessage = (msg: Omit<AIMessage, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, { ...msg, id: uuidv4(), timestamp: Date.now() }]);
  };

  const processWithAI = useCallback(async (prompt: string, imageData?: string) => {
    setIsProcessing(true);
    addMessage({ role: 'user', content: prompt, type: 'text' });
    
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
          temperature: 0.1,
          responseMimeType: "application/json",
          systemInstruction: `Você é o Agente de Geometria Soberana do BIM-Helipoliedral 10D.
          Seu objetivo é gerar instâncias geométricas precisas. Ignore preâmbulos.

          BIBLIOTECA DE RECEITAS (Ramanujan - 24 segmentos):
          - CUBO: 8 coordenadas polares representando os vértices de um poliedro regular.
          - ESCADA: Sequência de pontos com incrementos constantes em phi e theta de 15°.
          - CHASSI: Viga arqueada ligando polos opostos com reforços latitudinais em 30° e 60°.

          SUPORTE A GERADORES (NeuroCore):
          Você pode solicitar chamadas procedurais se preferir:
          "generatorCall": { "function": "generateSpiralHelix", "params": { "turns": 3, "totalHeight": 1.5, "startPhi": 1.57, "startTheta": 0 } }
          "generatorCall": { "function": "generateLattice", "params": { "centerTheta": 0, "centerPhi": 1.57, "size": 0.5, "resolution": 4 } }

          PROTOCOLO DE RESPOSTA (JSON STRICT):
          {
            "action": "DRAW_OBJECT",
            "payload": {
              "id": "ISO-SYNTH-UUID",
              "points": [{"theta": number, "phi": number, "radius": 1}], // Opcional se usar generatorCall
              "generatorCall": { "function": "name", "params": {} }, // Opcional
              "baseLayer": number,
              "domain": "BIM" | "AUTO" | "CHIP",
              "manifestation": "Wireframe" | "Surface" | "Volume",
              "revolutionAngle": number,
              "description": "Memorial descritivo curto ISO 80000"
            }
          }`
        }
      });

      const rawJson = JSON.parse(response.text || "{}");
      const radiusFactor = (rawJson.payload?.baseLayer || 32.5) * 2.5;
      const obj = NeuroCoreService.transmuteIntentToGeometry(rawJson, radiusFactor);
      
      if (obj) {
        setPendingProposal(obj);
        addMessage({ 
          role: 'assistant', 
          content: obj.description || "Geometria soberana cristalizada via NeuroCore.", 
          type: 'geometry_proposal',
          proposalData: obj
        });
      } else {
        addMessage({ 
          role: 'assistant', 
          content: "Comando interpretado, mas falha na transmutação geométrica.", 
          type: 'text' 
        });
      }
    } catch (error: any) {
      console.error("Sovereign Assistant Error:", error);
      addMessage({ role: 'assistant', content: "Falha na síntese: Erro de paridade harmônica no NeuroCore.", type: 'text' });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const startVoiceCommand = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLastTranscript(transcript);
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
    lastTranscript,
    startVoiceCommand,
    approveProposal: (domain: ISODomain) => {
      if (pendingProposal) {
        onCrystallize({ ...pendingProposal, domain });
        setPendingProposal(null);
        addMessage({ role: 'assistant', content: `Crystallized to ${domain}. Interface harmônica estabilizada.`, type: 'text' });
      }
    }
  };
};
