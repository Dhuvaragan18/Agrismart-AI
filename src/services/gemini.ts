import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function detectDisease(base64Image: string): Promise<DiseaseResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: `Analyze this plant leaf image and detect any disease. Return the result in JSON format with the following structure:
            {
              "diseaseName": "string",
              "confidence": number (0-1),
              "severity": "Low" | "Medium" | "High",
              "symptoms": ["string"],
              "causes": ["string"],
              "preventiveMeasures": ["string"],
              "treatment": {
                "organic": ["string"],
                "chemical": ["string"]
              }
            }`,
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1],
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diseaseName: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
          causes: { type: Type.ARRAY, items: { type: Type.STRING } },
          preventiveMeasures: { type: Type.ARRAY, items: { type: Type.STRING } },
          treatment: {
            type: Type.OBJECT,
            properties: {
              organic: { type: Type.ARRAY, items: { type: Type.STRING } },
              chemical: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["organic", "chemical"],
          },
        },
        required: ["diseaseName", "confidence", "severity", "symptoms", "causes", "preventiveMeasures", "treatment"],
      },
    },
  });

  const result = JSON.parse(response.text || "{}");
  return { ...result, timestamp: Date.now() };
}

export async function getFarmingAdvice(query: string, language: "en" | "ta" = "en"): Promise<string> {
  const systemInstruction = language === "ta" 
    ? "நீங்கள் ஒரு விவசாய நிபுணர். விவசாயம் தொடர்பான கேள்விகளுக்கு எளிய தமிழில் பதிலளிக்கவும்."
    : "You are a professional farming expert. Answer farming-related questions in simple, easy-to-understand language.";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      systemInstruction,
    },
  });

  return response.text || "Sorry, I couldn't generate a response.";
}

export async function getSmartFarmingPlan(location: string, month: string, weather: string, language: "en" | "ta" = "en"): Promise<string> {
  const prompt = `Location: ${location}, Month: ${month}, Weather: ${weather}. 
  Provide a detailed farming plan for this month in ${language === "ta" ? "Tamil" : "English"}. 
  Include: Suitable crops, soil preparation, watering, fertilizer, and harvest timeline. 
  Format the output in Markdown.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text || "No plan available.";
}
