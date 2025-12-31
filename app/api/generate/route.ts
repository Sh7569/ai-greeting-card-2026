import { NextRequest, NextResponse } from "next/server";
import { generateCard } from "@/lib/gemini";
import { PROMPTS, ThemeType } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const { image, theme } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const selectedTheme = (theme as ThemeType) || "newYear";
    const prompt = PROMPTS[selectedTheme];

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

    const generatedImage = await generateCard(base64Image, prompt);

    return NextResponse.json({
      success: true,
      image: `data:image/jpeg;base64,${generatedImage}`,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate card", details: String(error) },
      { status: 500 }
    );
  }
}
