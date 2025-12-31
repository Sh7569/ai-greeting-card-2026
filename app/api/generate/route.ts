import { NextRequest, NextResponse } from "next/server";
import { generateCard } from "@/lib/gemini";
import { generatePrompt, ThemeType, ToneType } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const { image, theme, tone, customMessage } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Aucune image fournie" },
        { status: 400 }
      );
    }

    const selectedTheme: ThemeType = theme || "newYear";
    const selectedTone: ToneType = tone || "elegant";

    const prompt = generatePrompt(selectedTheme, selectedTone, customMessage);

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

    const generatedImage = await generateCard(base64Image, prompt);

    return NextResponse.json({
      success: true,
      image: `data:image/jpeg;base64,${generatedImage}`,
    });
  } catch (error) {
    console.error("Erreur de génération:", error);
    return NextResponse.json(
      { error: "Échec de la génération", details: String(error) },
      { status: 500 }
    );
  }
}
