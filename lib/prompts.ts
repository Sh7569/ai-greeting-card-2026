export type ThemeType = 'newYear' | 'lunar';
export type ToneType = 'corporate' | 'elegant' | 'fun' | 'warm';

// Tone-specific style instructions
const TONE_STYLES = {
  corporate: {
    style: "professionnel, sobre, institutionnel",
    attire: "tenue business formelle (costume, tailleur)",
    mood: "confiant et professionnel, sourire mesuré",
    colors: "tons neutres avec touches dorées subtiles",
    elements: "lignes épurées, design minimaliste",
  },
  elegant: {
    style: "luxueux, raffiné, haute couture",
    attire: "tenue de gala, smoking ou robe de soirée glamour",
    mood: "sophistiqué et charismatique",
    colors: "or, champagne, noir profond, touches de bordeaux",
    elements: "ornements art déco, motifs géométriques dorés",
  },
  fun: {
    style: "festif, dynamique, joyeux",
    attire: "tenue de fête colorée, accessoires pailletés",
    mood: "éclatant de joie, grand sourire, pose dynamique",
    colors: "couleurs vives, paillettes, effets lumineux",
    elements: "confettis, serpentins, bulles de champagne",
  },
  warm: {
    style: "chaleureux, authentique, personnel",
    attire: "tenue élégante mais décontractée",
    mood: "sourire sincère et chaleureux, regard bienveillant",
    colors: "tons chauds, ambre, cuivre, touches de crème",
    elements: "lumière douce, ambiance cosy, détails personnalisés",
  },
};

// Theme-specific base elements
const THEME_ELEMENTS = {
  newYear: {
    setting: "décor de Nouvel An 2026",
    elements: "feux d'artifice, champagne, étoiles dorées, horloge à minuit",
    colors: "bleu nuit profond et or",
  },
  lunar: {
    setting: "décor du Nouvel An Lunaire, Année du Serpent",
    elements: "lanternes rouges, fleurs de prunier, dragons dorés, pièces porte-bonheur",
    colors: "rouge impérial et or",
  },
};

export function generatePrompt(theme: ThemeType, tone: ToneType, _customMessage?: string): string {
  const toneStyle = TONE_STYLES[tone];
  const themeElements = THEME_ELEMENTS[theme];

  const greetingText = theme === 'lunar'
    ? "Bonne Année du Serpent !"
    : "Bonne Année 2026 !";

  // Note: customMessage is NOT included in AI image - it will appear only on the 3D card inside panel
  // This avoids duplicate messages

  return `Crée une carte de vœux ${themeElements.setting} mettant en scène cette personne.

STYLE ET AMBIANCE :
- Style général : ${toneStyle.style}
- Palette de couleurs : ${themeElements.colors}, ${toneStyle.colors}
- Éléments décoratifs : ${themeElements.elements}, ${toneStyle.elements}

PERSONNAGE :
- Tenue : ${toneStyle.attire}
- Expression et pose : ${toneStyle.mood}
- Le visage et les traits de la personne doivent être parfaitement reconnaissables

TEXTE À INCLURE (OBLIGATOIRE - EN FRANÇAIS UNIQUEMENT) :
- Titre principal bien visible : "${greetingText}" en grandes lettres dorées élégantes
- Signature discrète en bas : "Before Conseil"
- PAS d'autre texte (le message personnalisé sera ajouté séparément)

⚠️ RÈGLES CRITIQUES :
1. TOUT le texte doit être EN FRANÇAIS avec accents corrects
2. Utiliser "Année" (pas "Annee"), "succès" (pas "success"), "opportunités" (pas "opportunites")
3. JAMAIS de mots anglais (pas de "Happy", "Success", "Wishes", "New Year")
4. L'image doit être PLATE (pas de perspective 3D, pas d'effet carte pliée)
5. Format : portrait 3:4
6. Qualité : professionnelle, haute résolution
7. Le texte "${greetingText}" doit être très lisible et bien intégré`;
}

// Legacy export for backward compatibility
export const PROMPTS = {
  newYear: generatePrompt('newYear', 'elegant'),
  lunar: generatePrompt('lunar', 'elegant'),
};
