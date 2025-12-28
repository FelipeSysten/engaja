
import { GoogleGenAI, Type } from "@google/genai";
import { TaskType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const AIService = {
  async verifyInstagramAction(base64Image: string, taskType: TaskType): Promise<{ success: boolean; reason: string }> {
    const prompt = `
      Analise este print do Instagram. 
      O usuário afirma ter realizado uma tarefa do tipo: ${taskType}.
      
      Regras de validação:
      - Se LIKE: Verifique se o ícone de coração está preenchido (vermelho).
      - Se FOLLOW: Verifique se o botão diz "Seguindo", "Following" ou mostra um ícone de perfil com check.
      - Se COMMENT: Verifique se há um comentário recente visível.

      Responda estritamente em JSON com o formato:
      {
        "success": boolean,
        "reason": "breve explicação do que foi detectado ou por que falhou"
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image.split(',')[1] || base64Image,
              },
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              success: { type: Type.BOOLEAN },
              reason: { type: Type.STRING }
            },
            required: ["success", "reason"]
          }
        }
      });

      return JSON.parse(response.text || '{"success": false, "reason": "Erro na análise"}');
    } catch (error) {
      console.error("AI Verification Error:", error);
      return { success: false, reason: "Falha ao conectar com o servidor de validação visual." };
    }
  }
};
