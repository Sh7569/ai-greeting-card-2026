export const PROMPTS = {
  newYear: `Create a luxurious New Year 2026 greeting card featuring this person.
Style: Elegant, sophisticated, gold and midnight blue color scheme.
Elements: Champagne glasses, fireworks, golden confetti.
The person should be dressed in formal/festive attire, looking celebratory.

IMPORTANT TEXT REQUIREMENTS:
- Include large, elegant golden text saying "Happy New Year 2026!" prominently displayed
- Add "Best Wishes from Before Partners" in smaller elegant text at the bottom
- Text must be clearly visible and beautifully integrated into the design

Image must be FLAT (no 3D perspective, no folded card look).
Aspect ratio: 3:4 portrait orientation.
High quality, professional greeting card aesthetic.`,

  lunar: `Create a festive Lunar New Year greeting card featuring this person.
Style: Traditional Chinese New Year celebration, red and gold color scheme.
Elements: Red lanterns, cherry blossoms, golden dragons, lucky coins, firecrackers.
The person should be wearing traditional or festive red attire, looking joyful.

IMPORTANT TEXT REQUIREMENTS:
- Include large, elegant golden text saying "Happy Lunar New Year!" prominently displayed
- Add Chinese characters "新年快乐" (Happy New Year) in traditional calligraphy style
- Add "Best Wishes from Before Partners" in smaller elegant text at the bottom
- Text must be clearly visible and beautifully integrated into the design

Image must be FLAT (no 3D perspective, no folded card look).
Aspect ratio: 3:4 portrait orientation.
High quality, professional greeting card aesthetic with traditional Chinese patterns.`
};

export type ThemeType = 'newYear' | 'lunar';
