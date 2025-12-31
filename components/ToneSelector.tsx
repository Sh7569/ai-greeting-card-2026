"use client";

export type ToneType = "corporate" | "elegant" | "fun" | "warm";

interface ToneSelectorProps {
  tone: ToneType;
  onToneChange: (tone: ToneType) => void;
  disabled?: boolean;
}

const TONE_OPTIONS: { value: ToneType; label: string; emoji: string; description: string }[] = [
  {
    value: "corporate",
    label: "Professionnel",
    emoji: "💼",
    description: "Sobre et institutionnel"
  },
  {
    value: "elegant",
    label: "Élégant",
    emoji: "✨",
    description: "Raffiné et luxueux"
  },
  {
    value: "fun",
    label: "Festif",
    emoji: "🎉",
    description: "Joyeux et dynamique"
  },
  {
    value: "warm",
    label: "Chaleureux",
    emoji: "❤️",
    description: "Personnel et sincère"
  },
];

export default function ToneSelector({
  tone,
  onToneChange,
  disabled = false,
}: ToneSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TONE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onToneChange(option.value)}
          disabled={disabled}
          className={`p-3 rounded-lg border-2 transition-all text-left ${
            tone === option.value
              ? "border-amber-500 bg-amber-500/20"
              : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{option.emoji}</span>
            <span className={`font-medium ${tone === option.value ? "text-amber-400" : "text-gray-300"}`}>
              {option.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-7">{option.description}</p>
        </button>
      ))}
    </div>
  );
}
