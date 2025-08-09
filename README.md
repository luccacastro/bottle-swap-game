# Bottle Pattern Puzzle

A Wordle-style puzzle game where players arrange wine, beer, and spirit bottles to match a hidden sequence. Built with Vue 3, GSAP animations, and Howler.js audio.

## 🍷 Game Features

- **3 Difficulty Modes**: 4, 5, or 6 bottles to arrange
- **50 Beverage Colors**: Realistic wine, beer, and spirit colors
- **5 Bottle Types**: Wine, Beer, Champagne, Whiskey, and Craft Beer bottles
- **Smooth Animations**: GSAP-powered micro-animations and liquid slosh effects
- **Audio Feedback**: Gentle sounds for interactions and feedback
- **Accessible**: Keyboard navigation and screen reader support
- **Mobile Optimized**: Touch-friendly interface with responsive design

## 🎯 How to Play

1. **Choose Difficulty**: Select 4, 5, or 6 bottles
2. **Arrange Bottles**: Click to select bottles, then click another to swap them
3. **Check Your Guess**: Click "Check Guess" to see how many positions are correct
4. **Solve the Pattern**: You have 8 attempts to match the hidden sequence
5. **Score Points**: Score decreases with each move based on difficulty

## 🛠️ Tech Stack

- **Vue 3** - Reactive UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **GSAP** - Professional-grade animations
- **Howler.js** - Audio library for web
- **SVG** - Scalable bottle graphics with liquid effects

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bottle-game

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🎨 Game Architecture

```
src/
├── assets/
│   ├── colors.js          # 50 beverage colors + game constants
│   └── bottleShapes.js    # 5 alcoholic beverage bottle templates
├── components/
│   ├── Bottle.vue         # Individual bottle with animations
│   ├── GameBoard.vue      # Main game logic and grid
│   ├── ModeSelect.vue     # Difficulty selection
│   └── ScoreOverlay.vue   # Win/lose modal
├── composables/
│   ├── useAnimations.js   # GSAP animation functions
│   └── useSounds.js       # Howler.js audio management
└── App.vue               # Main application component
```

## 🍺 Bottle Types

### Wine Bottle
- Classic long neck with rounded shoulders
- Perfect for red and white wines

### Beer Bottle  
- Standard shorter neck with straight sides
- Ideal for lagers and ales

### Champagne Bottle
- Wider base with distinctive neck
- Sparkling wine and champagne

### Whiskey Bottle
- Angular shoulders with thick base
- Premium spirits and whiskey

### Craft Beer Bottle
- Thicker lip with modern design
- Artisanal and specialty beers

## 🎭 Animation System

### Bottle Animations
- **Idle Breathing**: Subtle floating and scaling
- **Hover Effects**: Tilt and lift on mouse/touch
- **Selection**: Random micro-animations (squash, spin, wiggle)
- **Swap**: Three-phase animation with liquid slosh
- **Win Celebration**: Jiggle animation for all bottles

### Liquid Physics
- **Slosh Effects**: Counter-rotation during bottle movement
- **Meniscus Curves**: Realistic liquid surface shapes
- **Clipped Rendering**: Liquid contained within bottle shapes

## 🔊 Audio Design

- **Select/Deselect**: Soft pop sounds
- **Swap**: Liquid slosh and clink effects
- **Submit**: UI feedback tick
- **Correct Positions**: Gentle ding sound
- **Win**: Short celebration cheer

## ♿ Accessibility Features

- **Keyboard Navigation**: Arrow keys, Enter, Space, Escape
- **Screen Reader Support**: ARIA labels and live regions
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects user preferences
- **High Contrast**: Supports system contrast settings

## 🐛 Debug Mode

In development, you can enable debug mode to see the hidden pattern:

```javascript
// In browser console
window.DEBUG_MODE = true;
```

## 📱 Mobile Optimizations

- **Touch Targets**: Minimum 44px for accessibility
- **Responsive Grid**: Adapts to screen size
- **Performance**: Optimized animations for mobile devices
- **Gesture Support**: Touch-friendly interactions

## 🎨 Customization

### Adding New Colors
Edit `src/assets/colors.js` to add or modify beverage colors.

### Creating New Bottle Shapes
Add new SVG paths to `src/assets/bottleShapes.js` following the existing pattern.

### Modifying Animations
Adjust timing and easing in `src/composables/useAnimations.js`.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🐛 Known Issues

- Audio may not work on first load due to browser autoplay policies
- Some animations may be reduced on low-end mobile devices

## 🚀 Future Enhancements

- [ ] Drag and drop support
- [ ] Hint system
- [ ] Statistics tracking
- [ ] Multiple themes
- [ ] Sound customization
- [ ] Multiplayer mode
- [ ] More bottle types (cider, mead, etc.)
- [ ] Seasonal beverage themes
