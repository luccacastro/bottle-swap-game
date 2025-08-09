<template>
  <div class="game-container">
    <div class="game-board" :class="{ 'history-open': showHistory }">
    <div class="game-header">
      <div class="header-left">
        <button class="restart-btn" @click="startNewGame" title="Restart">
          ↻
        </button>
        <button class="history-btn" @click="toggleHistory" title="Toggle History">
          {{ showHistory ? '👁️' : '📋' }}
        </button>
      </div>
      <div class="bottles-matched">
        {{ correctBottlesCount }} CORRECT BOTTLES 
      </div>
      <button class="tutorial-btn" @click="showTutorial" title="Tutorial">
        ?
      </button>
    </div>

    <div v-if="DEBUG_MODE" class="debug-pattern">
      <h3>DEBUG: Hidden Pattern</h3>
      <div class="debug-colors">
        <div
          v-for="(color, index) in hiddenPattern"
          :key="index"
          class="debug-color"
          :style="{ backgroundColor: color }"
        ></div>
      </div>
    </div>

    <div class="bottle-grid" :style="{ gridTemplateColumns: `repeat(${gameMode}, 1fr)` }">
      <Bottle
        v-for="(bottle, index) in bottles"
        :key="`bottle-${index}`"
        :color="bottle.color"
        :shape-id="bottle.shapeId"
        :index="index"
        :is-selected="selectedBottles.includes(index)"
        @select="handleBottleSelect(index)"
        ref="bottleRefs"
      />
    </div>

    <div class="selection-status">
      <span v-if="selectedBottles.length === 0" class="status-text">
        Select two bottles to swap
      </span>
      <span v-else-if="selectedBottles.length === 1" class="status-text">
        Select one more bottle
      </span>
      <span v-else class="status-text ready">
        Ready to swap!
      </span>
    </div>

    <div class="action-buttons" v-if="canSwap">
      <button class="swap-button" @click="performSwap" :disabled="isSwapping">
        <span v-if="isSwapping">Swapping...</span>
        <span v-else>Swap Bottles (Enter)</span>
      </button>
    </div>

    <div v-if="showTutorialModal" class="tutorial-overlay" @click="closeTutorial">
      <div class="tutorial-modal" @click.stop>
        <div class="tutorial-header">
          <h3>How to Play</h3>
          <button class="close-btn" @click="closeTutorial">×</button>
        </div>
        <div class="tutorial-content">
          <div class="tutorial-step">
            <span class="step-number">1</span>
            <div class="step-text">
              <strong>Goal:</strong> Arrange bottles to match the hidden pattern
            </div>
          </div>
          <div class="tutorial-step">
            <span class="step-number">2</span>
            <div class="step-text">
              <strong>Select:</strong> Click two bottles to select them
            </div>
          </div>
          <div class="tutorial-step">
            <span class="step-number">3</span>
            <div class="step-text">
              <strong>Swap:</strong> Click "Swap Bottles " or press Enter
            </div>
          </div>
          <div class="tutorial-step">
            <span class="step-number">4</span>
            <div class="step-text">
              <strong>Track:</strong> Watch the counter show correct positions
            </div>
          </div>
        </div>
        <button class="tutorial-close-btn" @click="closeTutorial">
          Got it!
        </button>
      </div>
    </div>



    <div v-if="feedback" class="feedback" :class="feedback.type">
      {{ feedback.message }}
    </div>

    <div v-if="gameWon" class="victory-message">
      <div class="victory-text">Puzzle Solved!</div>
      <div class="victory-stats">{{ swapCount }} swaps used</div>
      <button class="try-again-btn" @click="startNewGame">
        Try Again
      </button>
    </div>

    <div aria-live="polite" class="sr-only">
      {{ feedback?.message || '' }}
    </div>

    <!-- History Sidebar -->
    <div class="history-sidebar" :class="{ 'open': showHistory }">
      <div class="history-sidebar-header">
        <h3>Move History</h3>
        <button class="close-btn" @click="closeHistory">×</button>
      </div>
      <div class="history-sidebar-content">
        <div v-if="moveHistory.length === 0" class="no-moves">
          No moves yet. Start swapping bottles!
        </div>
        <div v-else class="moves-list">
          <div 
            v-for="(move, index) in moveHistory.slice().reverse()" 
            :key="move.id"
            class="move-item"
            :class="{ 'latest': index === 0 }"
          >
            <div class="move-number">
              {{ moveHistory.length - index }}
            </div>
            <div class="move-details">
              <div class="move-visual">
                <div class="mini-bottle">
                  <svg viewBox="0 0 100 200" class="mini-bottle-svg">
                    <defs>
                      <clipPath :id="`miniLiqClip-${move.id}-from`">
                        <path d="M25 70 Q25 62 32 58 Q39 54 44 54 L56 54 Q61 54 68 58 Q75 62 75 70 L75 172 Q75 178 70 178 L30 178 Q25 178 25 172 Z"/>
                      </clipPath>
                    </defs>
                    <path d="M25 70 Q25 62 32 58 Q39 54 44 54 L56 54 Q61 54 68 58 Q75 62 75 70 L75 176 Q75 186 65 186 L35 186 Q25 186 25 176 Z"
                          fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                    <path d="M43 54 L43 29.2 Q43 26 46 25 L54 25 Q57 26 57 29.2 L57 54 Z"
                          fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                    <path d="M38 12 Q38 8 42 8 L58 8 Q62 8 62 12 L62 24 Q62 28 58 28 L42 28 Q38 28 38 24"
                          fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                    <g :clip-path="`url(#miniLiqClip-${move.id}-from)`">
                      <rect x="25" y="150" width="50" height="28" :fill="move.fromColor"/>
                      <ellipse cx="50" cy="150" rx="25" ry="4" :fill="move.fromColor" opacity="0.8"/>
                    </g>
                  </svg>
                </div>
                <span class="swap-arrow">↔</span>
                <div class="mini-bottle">
                  <svg viewBox="0 0 100 200" class="mini-bottle-svg">
                    <defs>
                      <clipPath :id="`miniLiqClip-${move.id}-to`">
                        <path d="M25 70 Q25 62 32 58 Q39 54 44 54 L56 54 Q61 54 68 58 Q75 62 75 70 L75 172 Q75 178 70 178 L30 178 Q25 178 25 172 Z"/>
                      </clipPath>
                    </defs>
                    <path d="M25 70 Q25 62 32 58 Q39 54 44 54 L56 54 Q61 54 68 58 Q75 62 75 70 L75 176 Q75 186 65 186 L35 186 Q25 186 25 176 Z"
                          fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                    <path d="M43 54 L43 29.2 Q43 26 46 25 L54 25 Q57 26 57 29.2 L57 54 Z"
                          fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                    <path d="M38 12 Q38 8 42 8 L58 8 Q62 8 62 12 L62 24 Q62 28 58 28 L42 28 Q38 28 38 24"
                          fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                    <g :clip-path="`url(#miniLiqClip-${move.id}-to)`">
                      <rect x="25" y="150" width="50" height="28" :fill="move.toColor"/>
                      <ellipse cx="50" cy="150" rx="25" ry="4" :fill="move.toColor" opacity="0.8"/>
                    </g>
                  </svg>
                </div>
              </div>
              <div class="move-positions">
                {{ move.from + 1 }} ↔ {{ move.to + 1 }}
              </div>
              <div class="move-result">
                {{ move.correctAfter }} correct
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="history-sidebar-footer" v-if="moveHistory.length > 0">
        <button 
          class="undo-btn" 
          @click="undoLastMove"
          :disabled="isSwapping"
        >
          ↶ Undo Last
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import Bottle from './Bottle.vue';
import { useAnimations } from '../composables/useAnimations.js';
import { useSounds } from '../composables/useSounds.js';
import { LIQUID_COLORS } from '../assets/colors.js';

const getRandomBottleShape = () => {
  const shapes = ['wine', 'beer', 'champagne', 'whiskey', 'craft'];
  const randomIndex = Math.floor(Math.random() * shapes.length);
  return { id: `bottle-${randomIndex + 1}` };
};

const props = defineProps({
  gameMode: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['game-won', 'game-lost']);

// Game state
const bottles = ref([]);
const hiddenPattern = ref([]);
const selectedBottles = ref([]);
const swapCount = ref(0);
const feedback = ref(null);
const gameWon = ref(false);
const showTutorialModal = ref(false);
const isSwapping = ref(false);
const moveHistory = ref([]);
const showHistory = ref(true);
const bottleRefs = ref([]);

const DEBUG_MODE = ref(import.meta.env.DEV);

// Composables
const { swapAnimation, rowPulseAnimation, winJiggleAnimation } = useAnimations();
const { playSwap, playSubmit, playCorrect, playWin } = useSounds();

// Computed properties
const canSwap = computed(() => {
  return selectedBottles.value.length === 2 && !gameWon.value && !isSwapping.value;
});

const correctBottlesCount = computed(() => {
  if (!hiddenPattern.value.length) return 0;
  return bottles.value.reduce((count, bottle, index) => {
    return count + (bottle.color === hiddenPattern.value[index] ? 1 : 0);
  }, 0);
});

// Initialize game
const initializeGame = () => {
  // Generate hidden pattern - ensure no duplicates
  const shuffledColors = [...LIQUID_COLORS].sort(() => Math.random() - 0.5);
  hiddenPattern.value = shuffledColors.slice(0, props.gameMode);

  // Generate bottle arrangement - same colors as pattern but shuffled
  const bottleColors = [...hiddenPattern.value].sort(() => Math.random() - 0.5);
  bottles.value = Array.from({ length: props.gameMode }, (_, index) => {
    const shape = getRandomBottleShape();
    return {
      color: bottleColors[index],
      shapeId: shape.id
    };
  });

  console.log('Hidden pattern:', hiddenPattern.value);
  console.log('Bottle colors:', bottles.value.map(b => b.color));

  // Reset game state
  selectedBottles.value = [];
  swapCount.value = 0;
  feedback.value = null;
  gameWon.value = false;
  isSwapping.value = false;
  moveHistory.value = [];
  showHistory.value = true;
  
  // Initial state - counter will be shown in the header
};

// Handle bottle selection - now supports two-step swap process
const handleBottleSelect = (index) => {
  // Prevent selection during animations
  if (isSwapping.value) return;
  
  if (selectedBottles.value.length === 0) {
    // First selection
    selectedBottles.value = [index];
  } else if (selectedBottles.value.length === 1) {
    if (selectedBottles.value[0] === index) {
      // Clicking same bottle deselects it
      selectedBottles.value = [];
    } else {
      // Second selection - add to swap queue
      selectedBottles.value = [selectedBottles.value[0], index];
    }
  } else if (selectedBottles.value.length === 2) {
    // If clicking an already selected bottle, deselect it
    if (selectedBottles.value.includes(index)) {
      // Remove this bottle from selection
      selectedBottles.value = selectedBottles.value.filter(i => i !== index);
    } else {
      // If clicking a different bottle, start new selection
      selectedBottles.value = [index];
    }
  }
};

// Bottle deselection is now handled in handleBottleSelect

const performSwap = async () => {
  if (selectedBottles.value.length !== 2) return;
  if (gameWon.value) return;
  if (isSwapping.value) return; // Prevent multiple simultaneous swaps
  
  const [index1, index2] = selectedBottles.value;
  
  // Set swapping state to disable interactions
  isSwapping.value = true;
  
  console.log('Swapping bottles:', index1, index2);
  console.log('Before swap:', bottles.value[index1].color, bottles.value[index2].color);
  
  // Record move before performing swap
  const moveRecord = {
    id: Date.now() + Math.random(),
    moveNumber: swapCount.value + 1,
    from: index1,
    to: index2,
    fromColor: bottles.value[index1].color,
    toColor: bottles.value[index2].color,
    timestamp: new Date(),
    bottlesBefore: bottles.value.map(b => ({ ...b })) // Deep copy for undo
  };
  
  swapCount.value++;
  
  // Get bottle elements
  const bottle1 = bottleRefs.value[index1];
  const bottle2 = bottleRefs.value[index2];
  
  if (!bottle1 || !bottle2) {
    console.log('Missing bottle elements:', bottle1, bottle2);
    return;
  }

  // Get liquid elements for slosh effect
  const liquid1 = bottle1.liquidElement();
  const liquid2 = bottle2.liquidElement();

  // Play swap sound
  playSwap();

  // Perform swap animation
  await swapAnimation(bottle1.element, bottle2.element, liquid1, liquid2);

  // Swap colors in data - force reactive update
  const tempColor = bottles.value[index1].color;
  const tempShapeId = bottles.value[index1].shapeId;
  
  // Create new objects to trigger reactivity
  bottles.value[index1] = {
    color: bottles.value[index2].color,
    shapeId: bottles.value[index2].shapeId
  };
  
  bottles.value[index2] = {
    color: tempColor,
    shapeId: tempShapeId
  };

  console.log('After swap:', bottles.value[index1].color, bottles.value[index2].color);

  // Clear selection
  selectedBottles.value = [];
  
  // Auto-check if pattern matches after swap
  setTimeout(async () => {
    await autoCheckPattern();
    
    // Complete the move record with results
    const correctAfter = bottles.value.reduce((count, bottle, index) => {
      return count + (bottle.color === hiddenPattern.value[index] ? 1 : 0);
    }, 0);
    
    moveRecord.correctAfter = correctAfter;
    moveHistory.value.push(moveRecord);
    
    // Keep only last 20 moves to prevent memory issues
    if (moveHistory.value.length > 20) {
      moveHistory.value = moveHistory.value.slice(-20);
    }
    
    // Re-enable interactions after everything is complete
    isSwapping.value = false;
  }, 500); // Give time for animation to finish
};

const autoCheckPattern = async () => {
  const correctPositions = bottles.value.reduce((count, bottle, index) => {
    return count + (bottle.color === hiddenPattern.value[index] ? 1 : 0);
  }, 0);

  console.log('Correct positions:', correctPositions, '/', props.gameMode);

  if (correctPositions === props.gameMode) {
    await handleWin();
    return;
  }

  // Show temporary feedback for swaps
  if (correctPositions > 0) {
    feedback.value = {
      type: 'info',
      message: `Nice! ${correctPositions} bottles in correct position`
    };
    playCorrect();
    
    setTimeout(() => {
      feedback.value = null;
    }, 2000);
  }
};

const handleWin = async () => {
  gameWon.value = true;
  
  playWin();

  const bottleElements = bottleRefs.value.map(ref => ref.element).filter(Boolean);
  await winJiggleAnimation(bottleElements);



  feedback.value = {
    type: 'success',
    message: `Puzzle solved in ${swapCount.value} swaps!`
  };

  emit('game-won', {
    swaps: swapCount.value,
    pattern: hiddenPattern.value
  });
};





// Handle loss
const handleLoss = async () => {
  // Show loss feedback
  feedback.value = {
    type: 'error',
    message: `Game over! The pattern was: ${hiddenPattern.value.map(color => 
      `<span style="color: ${color}">●</span>`
    ).join(' ')}`
  };

  // Emit loss event
  emit('game-lost', {
    attempts: attempts.value,
    score: currentScore.value,
    pattern: hiddenPattern.value
  });
};

// Start new game
const startNewGame = () => {
  initializeGame();
};

const showTutorial = () => {
  showTutorialModal.value = true;
};

const closeTutorial = () => {
  showTutorialModal.value = false;
};

const toggleHistory = () => {
  showHistory.value = !showHistory.value;
};

const closeHistory = () => {
  showHistory.value = false;
};

const undoLastMove = async () => {
  if (moveHistory.value.length === 0 || isSwapping.value) return;
  
  const lastMove = moveHistory.value.pop();
  
  // Restore the bottle state from before the move
  bottles.value = lastMove.bottlesBefore.map(b => ({ ...b }));
  
  // Decrement swap count
  swapCount.value--;
  
  // Clear selections
  selectedBottles.value = [];
  
  // Close history modal
  showHistory.value = false;
  
  // Show feedback
  feedback.value = {
    type: 'info',
    message: `Undid move ${lastMove.moveNumber}`
  };
  
  setTimeout(() => {
    feedback.value = null;
  }, 2000);
};

// Initialize on mount
onMounted(() => {
  initializeGame();
  
  // Enable debug mode in development
  if (import.meta.env.DEV) {
    window.DEBUG_MODE = DEBUG_MODE;
  }
  
  // Add keyboard event listener
  document.addEventListener('keydown', handleKeydown);
});

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});

// Handle keyboard input
const handleKeydown = (event) => {
  if (event.key === 'Enter' && canSwap.value && !isSwapping.value) {
    event.preventDefault();
    performSwap();
  }
};

// Watch for game mode changes
watch(() => props.gameMode, () => {
  initializeGame();
});
</script>

<style scoped>
.game-container {
  display: flex;
  min-height: 100vh;
  background: hsl(224 71% 4%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  position: relative;
}

.game-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 1rem;
  flex: 1;
  margin-right: 320px;
  transition: margin-right 0.3s ease-in-out;
}

.game-board:not(.history-open) {
  margin-right: 0;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.restart-btn, .tutorial-btn, .history-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: calc(0.5rem - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
  border: 1px solid hsl(215 27.9% 16.9%);
  background: hsl(217.2 32.6% 17.5%);
  color: hsl(213 31% 91%);
  height: 2.25rem;
  width: 2.25rem;
  cursor: pointer;
  position: relative;
}

.restart-btn:hover, .tutorial-btn:hover, .history-btn:hover {
  background: hsl(217.2 32.6% 25%);
  border-color: hsl(215 27.9% 25%);
}

.restart-btn:focus-visible, .tutorial-btn:focus-visible, .history-btn:focus-visible {
  outline: 2px solid hsl(213 31% 91%);
  outline-offset: 2px;
}

.bottles-matched {
  font-size: 1rem;
  font-weight: 600;
  color: hsl(213 31% 91%);
  letter-spacing: 0.025em;
  background: hsl(217.2 32.6% 17.5%);
  padding: 0.5rem 1rem;
  border-radius: calc(0.5rem - 2px);
  border: 1px solid hsl(215 27.9% 16.9%);
}

.bottle-grid {
  display: grid;
  gap: 1.5rem;
  justify-content: center;
  padding: 2rem;
  background: hsl(217.2 32.6% 17.5%);
  border-radius: 0.75rem;
  border: 1px solid hsl(215 27.9% 16.9%);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3);
}

.selection-status {
  text-align: center;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-text {
  color: hsl(215.4 16.3% 65%);
  font-size: 0.875rem;
  font-weight: 500;
}

.status-text.ready {
  color: hsl(142.1 76.2% 60%);
  font-weight: 600;
}

.action-buttons {
  display: flex;
  justify-content: center;
}

.swap-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: calc(0.5rem - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
  height: 2.5rem;
  padding: 0 1rem;
  background: hsl(142.1 76.2% 36.3%);
  color: hsl(0 0% 100%);
  border: none;
  cursor: pointer;
}

.swap-button:hover {
  background: hsl(142.1 76.2% 30%);
}

.swap-button:focus-visible {
  outline: 2px solid hsl(142.1 76.2% 36.3%);
  outline-offset: 2px;
}

.swap-button:disabled {
  background: hsl(215.4 16.3% 25%);
  color: hsl(215.4 16.3% 50%);
  cursor: not-allowed;
  border: 1px solid hsl(215 27.9% 16.9%);
}

.swap-button:disabled:hover {
  background: hsl(215.4 16.3% 25%);
}

.try-again-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: calc(0.5rem - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
  height: 2.5rem;
  padding: 0 1rem;
  background: hsl(0 0% 100%);
  color: hsl(222.2 84% 4.9%);
  border: 1px solid hsl(214.3 31.8% 91.4%);
  cursor: pointer;
  margin-top: 0.5rem;
}

.try-again-btn:hover {
  background: hsl(217.2 32.6% 25%);
  border-color: hsl(215 27.9% 25%);
}

.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.tutorial-modal {
  background: hsl(217.2 32.6% 17.5%);
  border-radius: 0.75rem;
  border: 1px solid hsl(215 27.9% 16.9%);
  max-width: 28rem;
  width: 90%;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5);
}

.tutorial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid hsl(215 27.9% 16.9%);
}

.tutorial-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(213 31% 91%);
}

.close-btn {
  background: none;
  border: none;
  color: hsl(215.4 16.3% 65%);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.15s ease-in-out;
}

.close-btn:hover {
  color: hsl(213 31% 91%);
}

.tutorial-content {
  padding: 1.5rem;
}

.tutorial-step {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
}

.tutorial-step:last-child {
  margin-bottom: 0;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: hsl(142.1 76.2% 36.3%);
  color: hsl(0 0% 100%);
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.step-text {
  color: hsl(213 31% 91%);
  font-size: 0.875rem;
  line-height: 1.4;
}

.step-text strong {
  color: hsl(142.1 76.2% 60%);
  font-weight: 600;
}

.tutorial-close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: calc(0.5rem - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
  height: 2.5rem;
  padding: 0 1rem;
  background: hsl(142.1 76.2% 36.3%);
  color: hsl(0 0% 100%);
  border: none;
  cursor: pointer;
  width: 100%;
  margin: 0 1.5rem 1.5rem 1.5rem;
}

.tutorial-close-btn:hover {
  background: hsl(142.1 76.2% 30%);
}

.history-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background: hsl(217.2 32.6% 17.5%);
  border-left: 1px solid hsl(215 27.9% 16.9%);
  box-shadow: -4px 0 6px -1px rgb(0 0 0 / 0.3);
  transition: right 0.3s ease-in-out;
  z-index: 50;
  display: flex;
  flex-direction: column;
}

.history-sidebar:not(.open) {
  right: -320px;
}

.history-sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid hsl(215 27.9% 16.9%);
  flex-shrink: 0;
}

.history-sidebar-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: hsl(213 31% 91%);
}

.history-sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.no-moves {
  text-align: center;
  color: hsl(215.4 16.3% 65%);
  font-size: 0.875rem;
  padding: 2rem;
}

.moves-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.move-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: hsl(217.2 32.6% 20%);
  border-radius: 0.5rem;
  border: 1px solid hsl(215 27.9% 16.9%);
  transition: all 0.15s ease-in-out;
  margin-bottom: 0.5rem;
}

.move-item.latest {
  border-color: hsl(142.1 76.2% 36.3%);
  box-shadow: 0 0 0 1px hsl(142.1 76.2% 36.3% / 0.3);
}

.move-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: hsl(215.4 16.3% 25%);
  color: hsl(213 31% 91%);
  font-weight: 600;
  font-size: 0.7rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.move-item.latest .move-number {
  background: hsl(142.1 76.2% 36.3%);
  color: hsl(0 0% 100%);
}

.move-details {
  flex: 1;
  min-width: 0;
}

.move-visual {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.25rem;
}

.mini-bottle {
  width: 1.5rem;
  height: 3rem;
  flex-shrink: 0;
}

.mini-bottle-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.swap-arrow {
  color: hsl(215.4 16.3% 65%);
  font-size: 0.75rem;
  font-weight: 600;
}

.move-positions {
  color: hsl(213 31% 91%);
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.125rem;
}

.move-result {
  color: hsl(215.4 16.3% 65%);
  font-size: 0.7rem;
}

.history-sidebar-footer {
  padding: 1rem;
  border-top: 1px solid hsl(215 27.9% 16.9%);
  flex-shrink: 0;
}

.undo-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: calc(0.5rem - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
  height: 2.5rem;
  padding: 0 1rem;
  background: hsl(217.2 32.6% 17.5%);
  color: hsl(213 31% 91%);
  border: 1px solid hsl(215 27.9% 16.9%);
  cursor: pointer;
  width: 100%;
}

.undo-btn:hover:not(:disabled) {
  background: hsl(217.2 32.6% 25%);
  border-color: hsl(215 27.9% 25%);
}

.undo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.feedback {
  background: hsl(0 0% 100%);
  color: hsl(222.2 84% 4.9%);
  padding: 0.75rem 1rem;
  border-radius: calc(0.5rem - 2px);
  text-align: center;
  font-weight: 500;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  max-width: 24rem;
  font-size: 0.875rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.feedback.success {
  background: hsl(142.1 76.2% 36.3%);
  color: hsl(0 0% 100%);
  border-color: hsl(142.1 76.2% 36.3%);
}

.feedback.error {
  background: hsl(0 84.2% 60.2%);
  color: hsl(0 0% 100%);
  border-color: hsl(0 84.2% 60.2%);
}

.victory-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: hsl(0 0% 100%);
  color: hsl(222.2 84% 4.9%);
  padding: 2rem;
  border-radius: 0.75rem;
  text-align: center;
  border: 1px solid hsl(214.3 31.8% 91.4%);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  max-width: 24rem;
}

.victory-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(142.1 76.2% 36.3%);
}

.victory-stats {
  font-size: 0.875rem;
  color: hsl(215.4 16.3% 46.9%);
  font-weight: 500;
}

.debug-pattern {
  background: hsl(0 0% 100%);
  padding: 1rem;
  border-radius: calc(0.5rem - 2px);
  border: 1px solid hsl(214.3 31.8% 91.4%);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.debug-pattern h3 {
  color: hsl(222.2 84% 4.9%);
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 500;
}

.debug-colors {
  display: flex;
  gap: 0.5rem;
}

.debug-color {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: calc(0.25rem - 1px);
  border: 1px solid hsl(214.3 31.8% 91.4%);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 768px) {
  .game-board {
    padding: 0.5rem;
    gap: 1rem;
    margin-right: 280px;
  }

  .game-board:not(.history-open) {
    margin-right: 0;
  }
  
  .bottle-grid {
    gap: 1rem;
    padding: 1rem;
  }
  
  .game-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .swap-button, .hint-button {
    width: 100%;
    max-width: 300px;
  }

  .history-sidebar {
    width: 280px;
  }

  .history-sidebar:not(.open) {
    right: -280px;
  }

  .history-sidebar-header h3 {
    font-size: 1rem;
  }

  .move-item {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .move-number {
    width: 1.25rem;
    height: 1.25rem;
    font-size: 0.65rem;
  }

  .mini-bottle {
    width: 1.25rem;
    height: 2.5rem;
  }

  .move-positions {
    font-size: 0.7rem;
  }

  .move-result {
    font-size: 0.65rem;
  }
}
</style>
