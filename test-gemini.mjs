import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: "Create a simple New Year 2026 greeting card with fireworks and golden text",
      config: {
        responseModalities: ["Image"],
      },
    });
    
    console.log("Full response:", JSON.stringify(response, null, 2));
    
    const parts = response.candidates?.[0]?.content?.parts;
    console.log("\nParts:", JSON.stringify(parts, null, 2));
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          console.log("\n✅ Image found! MIME:", part.inlineData.mimeType);
          console.log("Data length:", part.inlineData.data?.length);
        }
        if (part.text) {
          console.log("\n❌ Text found:", part.text);
        }
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Full error:", error);
  }
}

test();
