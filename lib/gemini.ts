import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateCard(
  imageBase64: string,
  prompt: string
): Promise<string> {
  // Combine the prompt with instruction to use the reference image
  const fullPrompt = `${prompt}

IMPORTANT: Use the person from the reference photo provided. Keep their face, hair, and likeness recognizable in the generated greeting card.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [
      {
        role: "user",
        parts: [
          { text: fullPrompt },
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
      responseModalities: ["Image"],
    },
  });

  // Extract the generated image from response
  const parts = response.candidates?.[0]?.content?.parts;
  if (parts) {
    for (const part of parts) {
      // Check for inlineData with image
      const inlineData = (part as { inlineData?: { data: string } }).inlineData;
      if (inlineData?.data) {
        return inlineData.data;
      }
    }
  }

  // If no image in response, return the text (for debugging)
  const textPart = parts?.find((p) => (p as { text?: string }).text);
  const text = (textPart as { text?: string })?.text || "No response";
  throw new Error(`No image generated. Response: ${text.substring(0, 200)}`);
}
