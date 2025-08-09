<template>
  <div class="game-board">
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

    <div class="game-info">
      <div class="attempts">Attempts: {{ attempts }}/{{ MAX_ATTEMPTS }}</div>
      <div class="score">Score: {{ currentScore }}</div>
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

    <div v-if="selectedBottles.length > 0 && selectedBottles.length < 2" class="selection-help">
      Select {{ 2 - selectedBottles.length }} more bottle{{ selectedBottles.length === 1 ? '' : 's' }} to swap
    </div>

    <div v-if="feedback" class="feedback" :class="feedback.type">
      {{ feedback.message }}
    </div>

    <div class="action-buttons">
      <button
        class="swap-button"
        :disabled="!canSwap"
        @click="performSwap"
        v-show="canSwap"
      >
        Swap Bottles ({{ selectedBottles.length }}/2)
      </button>
      
      <button
        class="new-game-button"
        @click="startNewGame"
      >
        New Game
      </button>
    </div>

    <div aria-live="polite" class="sr-only">
      {{ feedback?.message || '' }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Bottle from './Bottle.vue';
import { useAnimations } from '../composables/useAnimations.js';
import { useSounds } from '../composables/useSounds.js';
import { 
  LIQUID_COLORS, 
  MODE_PENALTIES, 
  MAX_ATTEMPTS, 
  BASE_SCORE 
} from '../assets/colors.js';
// Generate random bottle shapes inline since bottleShapes was removed
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
const attempts = ref(0);
const currentScore = ref(BASE_SCORE);
const feedback = ref(null);
const bottleRefs = ref([]);

// Debug mode (can be toggled in browser console)
const DEBUG_MODE = ref(import.meta.env.DEV);

// Composables
const { swapAnimation, rowPulseAnimation, winJiggleAnimation } = useAnimations();
const { playSwap, playSubmit, playCorrect, playWin } = useSounds();

// Computed properties
const canSwap = computed(() => {
  return selectedBottles.value.length === 2 && attempts.value < MAX_ATTEMPTS;
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
  attempts.value = 0;
  currentScore.value = BASE_SCORE;
  feedback.value = null;
};

// Handle bottle selection - now supports two-step swap process
const handleBottleSelect = (index) => {
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
  } else {
    // Already have two selected, start new selection
    selectedBottles.value = [index];
  }
};

// Bottle deselection is now handled in handleBottleSelect

// Perform swap animation and logic
const performSwap = async () => {
  if (selectedBottles.value.length !== 2) return;
  if (attempts.value >= MAX_ATTEMPTS) return;
  
  const [index1, index2] = selectedBottles.value;
  
  console.log('Swapping bottles:', index1, index2);
  console.log('Before swap:', bottles.value[index1].color, bottles.value[index2].color);
  
  // Count this as an attempt
  attempts.value++;
  
  // Update score with penalty
  const penalty = MODE_PENALTIES[props.gameMode];
  currentScore.value = Math.max(0, currentScore.value - penalty);
  
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
  }, 500); // Give time for animation to finish
};

// Auto-check pattern after every swap
const autoCheckPattern = async () => {
  // Calculate correct positions
  const correctPositions = bottles.value.reduce((count, bottle, index) => {
    return count + (bottle.color === hiddenPattern.value[index] ? 1 : 0);
  }, 0);

  console.log('Correct positions:', correctPositions, '/', props.gameMode);

  // Check if won
  if (correctPositions === props.gameMode) {
    await handleWin();
    return;
  }

  // Check if lost (max attempts reached)
  if (attempts.value >= MAX_ATTEMPTS) {
    await handleLoss();
    return;
  }

  // Show progress feedback
  if (correctPositions > 0) {
    feedback.value = {
      type: 'info',
      message: `${correctPositions} bottles in correct position`
    };
    playCorrect();
  } else {
    feedback.value = {
      type: 'info', 
      message: `Keep trying! ${MAX_ATTEMPTS - attempts.value} attempts left`
    };
  }

  // Clear feedback after 3 seconds
  setTimeout(() => {
    feedback.value = null;
  }, 3000);
};

// Handle win
const handleWin = async () => {
  // Play win sound
  playWin();

  // Win animation
  const bottleElements = bottleRefs.value.map(ref => ref.element).filter(Boolean);
  await winJiggleAnimation(bottleElements);

  // Show win feedback
  feedback.value = {
    type: 'success',
    message: `Congratulations! You solved it in ${attempts.value} attempts! Score: ${currentScore.value}`
  };

  // Emit win event
  emit('game-won', {
    attempts: attempts.value,
    score: currentScore.value,
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

// Initialize on mount
onMounted(() => {
  initializeGame();
  
  // Enable debug mode in development
  if (import.meta.env.DEV) {
    window.DEBUG_MODE = DEBUG_MODE;
  }
});

// Watch for game mode changes
watch(() => props.gameMode, () => {
  initializeGame();
});
</script>

<style scoped>
.game-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.debug-pattern {
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.debug-pattern h3 {
  color: #fbbf24;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.debug-colors {
  display: flex;
  gap: 0.5rem;
}

.debug-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
}

.game-info {
  display: flex;
  gap: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f1f5f9;
}

.attempts {
  color: #fbbf24;
}

.score {
  color: #10b981;
}

.bottle-grid {
  display: grid;
  gap: 1rem;
  padding: 2rem;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feedback {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feedback.info {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.feedback.success {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.feedback.error {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.selection-help {
  padding: 0.75rem 1.5rem;
  background: rgba(59, 130, 246, 0.1);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.check-button,
.new-game-button,
.swap-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.check-button {
  background: #3b82f6;
  color: white;
}

.check-button:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.check-button:disabled {
  background: #64748b;
  cursor: not-allowed;
  opacity: 0.6;
}

.new-game-button {
  background: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.new-game-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.swap-button {
  background: #10b981;
  color: white;
}

.swap-button:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.swap-button:disabled {
  background: #64748b;
  cursor: not-allowed;
  opacity: 0.6;
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

/* Mobile responsive */
@media (max-width: 640px) {
  .game-board {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .bottle-grid {
    padding: 1rem;
    gap: 0.5rem;
  }
  
  .game-info {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .check-button,
  .new-game-button,
  .swap-button {
    width: 100%;
  }
}
</style>
