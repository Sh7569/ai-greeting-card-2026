"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import ImageUploader from "@/components/ImageUploader";
import ThemeSelector from "@/components/ThemeSelector";
import CardPreview from "@/components/CardPreview";
import { ThemeType } from "@/lib/prompts";

// Dynamic import for 3D component (client-side only)
const Card3DPreview = dynamic(() => import("@/components/Card3DPreview"), {
  ssr: false,
});

export default function Home() {
  const [selfie, setSelfie] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeType>("newYear");
  const [generatedCard, setGeneratedCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [show3D, setShow3D] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!selfie) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selfie, theme }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setGeneratedCard(data.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [selfie, theme]);

  const handleDownload = useCallback(() => {
    if (!generatedCard) return;

    const link = document.createElement("a");
    link.href = generatedCard;
    link.download = `before-partners-${theme}-2026.jpg`;
    link.click();
  }, [generatedCard, theme]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="p-6 flex items-center justify-center border-b border-gray-800">
        <Image
          src="/before-logo.svg"
          alt="Before Partners"
          width={150}
          height={40}
          className="opacity-90"
        />
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-amber-400">AI</span> Greeting Card Generator
          </h1>
          <p className="text-gray-400">
            Upload your photo and create a personalized greeting card
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column - Input */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3 text-amber-400">
                1. Upload Your Photo
              </h2>
              <ImageUploader onImageSelect={setSelfie} disabled={isLoading} />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-amber-400">
                2. Choose Theme
              </h2>
              <ThemeSelector
                theme={theme}
                onThemeChange={setTheme}
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selfie || isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all
                ${
                  selfie && !isLoading
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/25"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
            >
              {isLoading ? "Generating..." : "Generate Card ✨"}
            </button>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Right column - Preview */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-amber-400">
              3. Your Card
            </h2>
            <div className="bg-gray-800/50 rounded-xl p-4 min-h-[400px]">
              <CardPreview
                image={generatedCard}
                isLoading={isLoading}
                onDownload={handleDownload}
                onRegenerate={handleGenerate}
                on3DPreview={() => setShow3D(true)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Powered by{" "}
            <span className="text-amber-400">Nano Banana Pro</span> (Gemini AI)
          </p>
          <p className="mt-1">© 2026 Before Partners</p>
        </footer>
      </div>

      {/* 3D Preview Modal */}
      {show3D && generatedCard && (
        <Card3DPreview image={generatedCard} onClose={() => setShow3D(false)} theme={theme} />
      )}
    </main>
  );
}
