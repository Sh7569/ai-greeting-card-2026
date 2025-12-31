"use client";

import { ThemeType } from "@/lib/prompts";

interface ThemeSelectorProps {
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  disabled?: boolean;
}

const themes = [
  {
    id: "newYear" as ThemeType,
    name: "New Year 2026",
    emoji: "🎆",
    colors: "from-blue-900 to-amber-500",
    description: "Gold & midnight blue, champagne, fireworks",
  },
  {
    id: "lunar" as ThemeType,
    name: "Lunar New Year",
    emoji: "🧧",
    colors: "from-red-600 to-amber-400",
    description: "Red & gold, lanterns, dragons",
  },
];

export default function ThemeSelector({
  theme,
  onThemeChange,
  disabled,
}: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => onThemeChange(t.id)}
          disabled={disabled}
          className={`relative p-4 rounded-xl border-2 transition-all text-left
            ${
              theme === t.id
                ? "border-amber-400 bg-gradient-to-br " + t.colors + " bg-opacity-20"
                : "border-gray-700 hover:border-gray-500 bg-gray-800/50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="text-3xl mb-2">{t.emoji}</div>
          <h3 className="font-bold text-white">{t.name}</h3>
          <p className="text-xs text-gray-400 mt-1">{t.description}</p>
          {theme === t.id && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-amber-400 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
