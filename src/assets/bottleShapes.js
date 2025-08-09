// bottles.js
// Duolingo-style: soft radii, clean silhouette, limited detail.
// All viewBoxes are "0 0 100 200". Liquid fills via clipPath using liquidClip.
// Colors are controlled via CSS variables on the <svg>.

export const BOTTLE_SHAPES = [
  // Wine: slim neck, rounded shoulders, gentle belly.
  {
    id: 'bottle-wine',
    name: 'Wine Bottle',
    viewBox: '0 0 100 200',
    glass: `
      M30,190
      Q20,190 20,178
      L20,88
      Q20,78 26,70
      Q32,62 40,58
      L40,47
      Q40,40 44,36
      Q48,32 55,32
      Q62,32 66,36
      Q70,40 70,47
      L70,58
      Q78,62 84,70
      Q90,78 90,88
      L90,178
      Q90,190 78,190
      Z
    `,
    liquidClip: `
      M28,188
      L28,95
      Q28,84 36,77
      Q44,70 50,68
      L50,55
      Q50,50 54,47
      Q58,44 63,44
      Q68,44 72,47
      Q76,50 76,55
      L76,68
      Q82,70 90,77
      Q92,80 92,95
      L92,188
      Z
    `,
    cap: `
      M52,30
      Q48,30 46,28
      Q44,26 44,24
      L44,20
      L76,20
      L76,24
      Q76,26 74,28
      Q72,30 68,30
      Z
    `,
    shine: `
      M26,100
      Q28,80 36,70
      Q38,68 38,90
      Q38,120 32,150
      Q30,160 28,160
      Z
    `,
    labelMask: `
      M36,128
      Q36,118 44,112
      Q52,106 64,106
      Q76,106 84,112
      Q92,118 92,128
      Q92,138 84,144
      Q76,150 64,150
      Q52,150 44,144
      Q36,138 36,128
      Z
    `,
    features: { type: 'wine', style: 'duolingo-min' }
  },

  // Beer (longneck): straighter sides, crown cap.
  {
    id: 'bottle-beer',
    name: 'Beer Bottle',
    viewBox: '0 0 100 200',
    glass: `
      M28,190
      Q18,190 18,178
      L18,84
      Q18,72 26,66
      Q34,60 40,60
      L40,46
      Q40,38 45,34
      Q50,30 58,30
      Q66,30 71,34
      Q76,38 76,46
      L76,60
      Q82,60 90,66
      Q98,72 98,84
      L98,178
      Q98,190 88,190
      Z
    `,
    liquidClip: `
      M26,188
      L26,90
      Q26,80 32,76
      Q38,72 44,72
      L44,56
      Q44,50 49,47
      Q54,44 59,44
      Q64,44 69,47
      Q74,50 74,56
      L74,72
      Q80,72 86,76
      Q92,80 92,90
      L92,188
      Z
    `,
    cap: `
      M52,20
      Q45,20 42,24
      Q40,26 40,30
      L76,30
      Q76,26 74,24
      Q71,20 64,20
      Z
    `,
    shine: `
      M22,110
      Q24,92 30,84
      Q32,82 32,104
      Q32,132 26,156
      Q24,164 22,164
      Z
    `,
    labelMask: `
      M34,132
      Q34,120 42,114
      Q50,108 64,108
      Q78,108 86,114
      Q94,120 94,132
      Q94,144 86,150
      Q78,156 64,156
      Q50,156 42,150
      Q34,144 34,132
      Z
    `,
    features: { type: 'beer', style: 'duolingo-min' }
  },

  // Champagne: wide body, tapered neck, chunky punt base.
  {
    id: 'bottle-champagne',
    name: 'Champagne Bottle',
    viewBox: '0 0 100 200',
    glass: `
      M22,190
      Q12,190 12,178
      L12,100
      Q12,84 22,74
      Q32,64 44,62
      L44,48
      Q44,40 50,36
      Q56,32 64,32
      Q72,32 78,36
      Q84,40 84,48
      L84,62
      Q96,64 106,74
      Q116,84 116,100
      L116,178
      Q116,190 106,190
      Z
    `,
    liquidClip: `
      M20,188
      L20,104
      Q20,92 28,84
      Q36,76 48,74
      L48,56
      Q48,50 54,47
      Q60,44 66,44
      Q72,44 78,47
      Q84,50 84,56
      L84,74
      Q96,76 104,84
      Q112,92 112,104
      L112,188
      Z
    `,
    cap: `
      M56,26
      Q50,26 48,30
      Q46,34 46,36
      L84,36
      Q84,34 82,30
      Q80,26 74,26
      Z
    `,
    shine: `
      M16,120
      Q18,98 26,88
      Q28,86 28,110
      Q28,144 22,166
      Q20,174 18,174
      Z
    `,
    labelMask: `
      M30,134
      Q30,120 40,112
      Q50,104 68,104
      Q86,104 96,112
      Q106,120 106,134
      Q106,148 96,156
      Q86,164 68,164
      Q50,164 40,156
      Q30,148 30,134
      Z
    `,
    features: { type: 'champagne', style: 'duolingo-min' }
  },

  // Whiskey: squarer shoulders, shorter neck.
  {
    id: 'bottle-whiskey',
    name: 'Whiskey Bottle',
    viewBox: '0 0 100 200',
    glass: `
      M24,190
      Q14,190 14,178
      L14,110
      Q14,96 22,88
      Q30,80 44,80
      L44,64
      Q44,54 51,49
      Q58,44 68,44
      Q78,44 85,49
      Q92,54 92,64
      L92,80
      Q106,80 114,88
      Q122,96 122,110
      L122,178
      Q122,190 112,190
      Z
    `,
    liquidClip: `
      M22,188
      L22,112
      Q22,102 28,96
      Q34,90 46,90
      L46,70
      Q46,60 54,56
      Q62,52 68,52
      Q74,52 82,56
      Q90,60 90,70
      L90,90
      Q102,90 108,96
      Q114,102 114,112
      L114,188
      Z
    `,
    cap: `
      M52,40
      L84,40
      L84,34
      Q84,30 80,28
      Q76,26 68,26
      Q60,26 56,28
      Q52,30 52,34
      Z
    `,
    shine: `
      M18,130
      Q20,110 28,102
      Q30,100 30,122
      Q30,148 24,168
      Q22,174 20,174
      Z
    `,
    labelMask: `
      M32,138
      Q32,124 42,116
      Q52,108 72,108
      Q92,108 102,116
      Q112,124 112,138
      Q112,152 102,160
      Q92,168 72,168
      Q52,168 42,160
      Q32,152 32,138
      Z
    `,
    features: { type: 'whiskey', style: 'duolingo-min' }
  },

  // Craft (stubby): shorter, friendlier proportions.
  {
    id: 'bottle-craft',
    name: 'Craft Stubby',
    viewBox: '0 0 100 200',
    glass: `
      M26,190
      Q16,190 16,178
      L16,112
      Q16,96 28,88
      Q40,80 52,80
      L52,62
      Q52,54 56,50
      Q60,46 68,46
      Q76,46 80,50
      Q84,54 84,62
      L84,80
      Q96,80 108,88
      Q120,96 120,112
      L120,178
      Q120,190 110,190
      Z
    `,
    liquidClip: `
      M24,188
      L24,114
      Q24,104 32,98
      Q40,92 54,92
      L54,70
      Q54,62 58,58
      Q62,54 68,54
      Q74,54 78,58
      Q82,62 82,70
      L82,92
      Q96,92 104,98
      Q112,104 112,114
      L112,188
      Z
    `,
    cap: `
      M58,44
      Q54,44 52,46
      Q50,48 50,50
      L86,50
      Q86,48 84,46
      Q82,44 78,44
      Z
    `,
    shine: `
      M20,136
      Q22,118 30,110
      Q32,108 32,128
      Q32,152 26,170
      Q24,176 22,176
      Z
    `,
    labelMask: `
      M34,142
      Q34,128 44,120
      Q54,112 74,112
      Q94,112 104,120
      Q114,128 114,142
      Q114,156 104,164
      Q94,172 74,172
      Q54,172 44,164
      Q34,156 34,142
      Z
    `,
    features: { type: 'craft', style: 'duolingo-min' }
  }
];

// A gentle, consistent wave for the liquid surface (you can translate Y for level).
export const LIQUID_SURFACE = 'M 26 120 Q 45 116 64 120 Q 83 124 112 120';

// Get a random bottle shape
export const getRandomBottleShape = () => {
  return BOTTLE_SHAPES[Math.floor(Math.random() * BOTTLE_SHAPES.length)];
};

// Get bottle shape by ID
export const getBottleShapeById = (id) => {
  return BOTTLE_SHAPES.find(shape => shape.id === id);
};
