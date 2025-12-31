"use client";

export type CardFormat = "single" | "bifold" | "quadfold";
export type CardStyle = "flat" | "foldable";

interface FormatSelectorProps {
  format: CardFormat;
  style: CardStyle;
  onFormatChange: (format: CardFormat) => void;
  onStyleChange: (style: CardStyle) => void;
  disabled?: boolean;
}

const FORMAT_OPTIONS: { value: CardFormat; label: string; panels: number; description: string }[] = [
  { value: "single", label: "1 Panneau", panels: 1, description: "Image seule" },
  { value: "bifold", label: "2 Panneaux", panels: 2, description: "Couverture + intérieur" },
  { value: "quadfold", label: "4 Panneaux", panels: 4, description: "Carte complète" },
];

const STYLE_OPTIONS: { value: CardStyle; label: string; icon: string }[] = [
  { value: "flat", label: "Aperçu plat", icon: "🖼️" },
  { value: "foldable", label: "Carte 3D", icon: "📖" },
];

export default function FormatSelector({
  format,
  style,
  onFormatChange,
  onStyleChange,
  disabled = false,
}: FormatSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Format Selection */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Format de la carte</label>
        <div className="grid grid-cols-3 gap-2">
          {FORMAT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onFormatChange(option.value)}
              disabled={disabled}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                format === option.value
                  ? "border-amber-500 bg-amber-500/20 text-amber-400"
                  : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="text-2xl mb-1">{option.panels}</div>
              <div className="text-xs font-medium">{option.label}</div>
              <div className="text-xs text-gray-500 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection (only for bifold and quadfold) */}
      {format !== "single" && (
        <div>
          <label className="block text-sm text-gray-400 mb-2">Style d'aperçu</label>
          <div className="grid grid-cols-2 gap-2">
            {STYLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onStyleChange(option.value)}
                disabled={disabled}
                className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  style === option.value
                    ? "border-amber-500 bg-amber-500/20 text-amber-400"
                    : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span className="text-xl">{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
