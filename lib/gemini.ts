import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateCard(
  imageBase64: string,
  prompt: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64,
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  // Extract the generated image from response
  const parts = response.candidates?.[0]?.content?.parts;
  if (parts) {
    for (const part of parts) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }
  }

  // If no image in response, return the text (for debugging)
  const textPart = parts?.find((p) => p.text);
  const text = textPart?.text || "No response";
  throw new Error(`No image generated. Response: ${text.substring(0, 200)}`);
}
