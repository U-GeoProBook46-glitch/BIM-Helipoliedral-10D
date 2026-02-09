import { GoogleGenAI } from "@google/genai";

/**
 * BIM-Helipoliedral 10D: AI Engineering Service
 * Motor de inferência para síntese de componentes e análise DfD.
 */
export const geminiService = {
  async synthesizeComponent(prompt: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: `Você é o Kernel BIM-Helipoliedral 10D. 
          Sua função é atuar como um tradutor de engenharia multimodal de alta precisão. 
          Converta comandos de texto em um objeto JSON puro seguindo rigorosamente as normas ISO 80000.
          
          FORMATO DE SAÍDA:
          {
            "name": "Nome técnico",
            "points": [[x, y, z], ...],
            "domain": "BIM" | "AUTO" | "CHIP",
            "description": "Explicação técnica",
            "recoveryScore": 0.0 a 1.0
          }`,
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from Engineering Kernel");
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini Service Error:", error);
      throw error;
    }
  }
};