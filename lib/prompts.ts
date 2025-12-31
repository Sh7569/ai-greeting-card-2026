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

export function generatePrompt(theme: ThemeType, tone: ToneType, customMessage?: string): string {
  const toneStyle = TONE_STYLES[tone];
  const themeElements = THEME_ELEMENTS[theme];

  const greetingText = theme === 'lunar'
    ? "Bonne Année du Serpent !"
    : "Bonne Année 2026 !";

  const defaultMessage = customMessage || "Before Conseil vous souhaite une année riche en succès et en belles opportunités.";

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
- Titre principal en haut : "${greetingText}" en lettres dorées élégantes
- Message secondaire : "${defaultMessage}"
- Signature : "Before Conseil" en bas

⚠️ RÈGLES CRITIQUES :
1. TOUT le texte doit être EN FRANÇAIS - jamais d'anglais (pas de "Happy", "Success", "Wishes")
2. Utiliser "succès" (avec accent), jamais "success"
3. L'image doit être PLATE (pas de perspective 3D, pas d'effet carte pliée)
4. Format : portrait 3:4
5. Qualité : professionnelle, prête à imprimer
6. Le texte doit être lisible et bien intégré au design`;
}

// Legacy export for backward compatibility
export const PROMPTS = {
  newYear: generatePrompt('newYear', 'elegant'),
  lunar: generatePrompt('lunar', 'elegant'),
};
