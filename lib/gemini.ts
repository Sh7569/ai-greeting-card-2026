import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface PartWithInlineData {
  inlineData?: {
    mimeType: string;
    data: string;
  };
  text?: string;
}

export async function generateCard(
  imageBase64: string,
  prompt: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64,
      },
    },
  ]);

  const response = result.response;

  // Extract the generated image from response
  const parts = response.candidates?.[0]?.content?.parts as PartWithInlineData[] | undefined;
  if (parts) {
    for (const part of parts) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }
  }

  // If no image in response, return the text (for debugging)
  const text = response.text();
  throw new Error(`No image generated. Response: ${text.substring(0, 200)}`);
}
