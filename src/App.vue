<script setup>
import { ref, onMounted } from 'vue';
import ModeSelect from './components/ModeSelect.vue';
import GameBoard from './components/GameBoard.vue';
import ScoreOverlay from './components/ScoreOverlay.vue';
import { useSounds } from './composables/useSounds.js';

// Game state
const gameMode = ref(null);
const showOverlay = ref(false);
const overlayType = ref('win');
const gameData = ref({});

// Initialize sounds
const { initializeSounds } = useSounds();

// Start game with selected mode
const startGame = (mode) => {
  gameMode.value = mode;
  // Initialize sounds on first user interaction
  initializeSounds();
};

// Handle game win
const handleGameWon = (data) => {
  gameData.value = data;
  overlayType.value = 'win';
  showOverlay.value = true;
};

// Handle game loss
const handleGameLost = (data) => {
  gameData.value = data;
  overlayType.value = 'lose';
  showOverlay.value = true;
};

// Close overlay
const closeOverlay = () => {
  showOverlay.value = false;
};

// Play again (same mode)
const handlePlayAgain = () => {
  showOverlay.value = false;
  // The GameBoard will reset automatically
};

// Choose new mode
const handleNewMode = () => {
  showOverlay.value = false;
  gameMode.value = null;
};

// Initialize on mount
onMounted(() => {
  // Add keyboard shortcuts for accessibility
  document.addEventListener('keydown', (event) => {
    // Escape to close overlay
    if (event.key === 'Escape' && showOverlay.value) {
      closeOverlay();
    }
  });
});
</script>

<template>
  <div id="app">
    <header class="app-header">
      <h1 class="app-title">Bottle Pattern Puzzle</h1>
      <p class="app-subtitle">Arrange the wine, beer & spirit bottles to match the hidden pattern</p>
    </header>

    <main class="app-main">
      <!-- Mode Selection -->
      <ModeSelect
        v-if="!gameMode"
        :selected-mode="null"
        @select-mode="startGame"
      />

      <!-- Game Board -->
      <GameBoard
        v-else
        :game-mode="gameMode"
        @game-won="handleGameWon"
        @game-lost="handleGameLost"
      />
    </main>

    <!-- Score Overlay -->
    <ScoreOverlay
      :is-visible="showOverlay"
      :type="overlayType"
      :game-data="gameData"
      @close="closeOverlay"
      @play-again="handlePlayAgain"
      @new-mode="handleNewMode"
    />
  </div>
</template>

<style>
/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: hsl(224 71% 4%);
  min-height: 100vh;
  color: hsl(213 31% 91%);
  overflow-x: hidden;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  text-align: center;
  padding: 2rem 1rem;
  background: hsl(224 71% 4%);
  border-bottom: 1px solid hsl(215 27.9% 16.9%);
}

.app-title {
  font-size: 2.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: hsl(213 31% 91%);
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.app-subtitle {
  font-size: 1rem;
  color: hsl(215.4 16.3% 65%);
  margin: 0;
  font-weight: 400;
}

.app-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

/* Focus styles for accessibility */
button:focus-visible,
.bottle-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .app-header {
    padding: 1.5rem 1rem;
  }
  
  .app-title {
    font-size: 2rem;
  }
  
  .app-subtitle {
    font-size: 1rem;
  }
  
  .app-main {
    padding: 1rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .app-title {
    -webkit-text-fill-color: #ffffff;
    background: none;
  }
  
  button {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
