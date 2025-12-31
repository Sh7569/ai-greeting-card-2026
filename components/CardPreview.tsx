"use client";

import { CardFormat, CardStyle } from "./FormatSelector";

interface CardPreviewProps {
  image: string | null;
  isLoading: boolean;
  onDownload: () => void;
  onRegenerate: () => void;
  on3DPreview: () => void;
  format?: CardFormat;
  style?: CardStyle;
}

export default function CardPreview({
  image,
  isLoading,
  onDownload,
  onRegenerate,
  on3DPreview,
  format = "bifold",
  style = "foldable",
}: CardPreviewProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-400/30 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-amber-400 font-medium">Génération en cours...</p>
        <p className="text-sm text-gray-500">Cela peut prendre 10-30 secondes</p>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <div className="text-5xl mb-4">🎴</div>
        <p>Votre carte générée apparaîtra ici</p>
      </div>
    );
  }

  const show3DButton = format !== "single" && style === "foldable";

  return (
    <div className="space-y-4">
      <div className="relative group">
        <img
          src={image}
          alt="Carte de voeux générée"
          className="w-full rounded-xl shadow-2xl"
        />
        {show3DButton && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
            <button
              onClick={on3DPreview}
              className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-amber-400 transition-colors"
            >
              Voir en 3D
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onDownload}
          className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors"
        >
          Télécharger
        </button>
        {show3DButton && (
          <button
            onClick={on3DPreview}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
          >
            Aperçu 3D
          </button>
        )}
        <button
          onClick={onRegenerate}
          className="py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          title="Régénérer"
        >
          🔄
        </button>
      </div>
    </div>
  );
}
