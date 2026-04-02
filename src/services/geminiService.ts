import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const compareProducts = async (productA: string, productB: string, location?: { lat: number; lng: number }) => {
  const prompt = `Compare ${productA} and ${productB}. Focus on features and price ranges. DO NOT provide any links to stores or websites.`;
  
  const config: any = {
    systemInstruction: "You are a specialized product comparison assistant. Your ONLY purpose is to compare products, analyze prices, and suggest similar items. You must NEVER discuss topics outside of product comparisons, shopping, or retail. If a user asks about anything else, politely decline and steer the conversation back to products. NEVER include any links to stores, websites, or affiliate programs in your responses."
  };

  if (location) {
    config.tools = [{ googleMaps: {} }];
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.lat,
          longitude: location.lng
        }
      }
    };
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config
  });
  
  return {
    text: response.text,
    groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const getSimilarProducts = async (product: string) => {
  const prompt = `List 10 similar products to ${product} sorted from A to Z.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      systemInstruction: "You are a specialized product comparison assistant. Return ONLY a JSON array of 10 similar product names sorted A-Z."
    }
  });
  
  return JSON.parse(response.text || '[]');
};
