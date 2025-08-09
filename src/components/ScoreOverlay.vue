<template>
  <Transition name="overlay">
    <div v-if="isVisible" class="score-overlay">
      <div class="overlay-backdrop" @click="handleBackdropClick"></div>
      
      <div class="overlay-content" :class="type">
        <div class="overlay-header">
          <h2 class="overlay-title">{{ title }}</h2>
          <button class="close-button" @click="handleClose" aria-label="Close">
            ×
          </button>
        </div>
        
        <div class="overlay-body">
          <div class="result-icon">
            <div v-if="type === 'win'" class="win-icon">🎉</div>
            <div v-else class="lose-icon">💔</div>
          </div>
          
          <div class="result-message">{{ message }}</div>
          
          <div class="result-stats">
            <div class="stat">
              <span class="stat-label">Attempts:</span>
              <span class="stat-value">{{ gameData.attempts }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Score:</span>
              <span class="stat-value">{{ gameData.score }}</span>
            </div>
          </div>
          
          <div v-if="type === 'lose'" class="pattern-reveal">
            <h3>Hidden Pattern:</h3>
            <div class="pattern-colors">
              <div
                v-for="(color, index) in gameData.pattern"
                :key="index"
                class="pattern-color"
                :style="{ backgroundColor: color }"
              ></div>
            </div>
          </div>
        </div>
        
        <div class="overlay-actions">
          <button class="play-again-button" @click="handlePlayAgain">
            Play Again
          </button>
          <button class="new-mode-button" @click="handleNewMode">
            Choose Mode
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { useAnimations } from '../composables/useAnimations.js';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['win', 'lose'].includes(value)
  },
  gameData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'play-again', 'new-mode']);

const { overlayFadeAnimation } = useAnimations();

// Computed properties
const title = computed(() => {
  return props.type === 'win' ? 'Congratulations!' : 'Game Over';
});

const message = computed(() => {
  if (props.type === 'win') {
    return `You solved the puzzle in ${props.gameData.attempts} attempts!`;
  } else {
    return 'You ran out of attempts. Better luck next time!';
  }
});

// Event handlers
const handleClose = () => {
  emit('close');
};

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close');
  }
};

const handlePlayAgain = () => {
  emit('play-again');
};

const handleNewMode = () => {
  emit('new-mode');
};
</script>

<style scoped>
.score-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.overlay-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.overlay-content {
  position: relative;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.overlay-content.win {
  border-color: rgba(16, 185, 129, 0.3);
  box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.2);
}

.overlay-content.lose {
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.2);
}

.overlay-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.overlay-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
}

.overlay-body {
  text-align: center;
  margin-bottom: 2rem;
}

.result-icon {
  margin-bottom: 1rem;
}

.win-icon,
.lose-icon {
  font-size: 3rem;
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.result-message {
  font-size: 1.1rem;
  color: #e2e8f0;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
}

.pattern-reveal {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.pattern-reveal h3 {
  font-size: 1rem;
  color: #94a3b8;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pattern-colors {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.pattern-color {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.overlay-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.play-again-button,
.new-mode-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  min-width: 120px;
}

.play-again-button {
  background: #3b82f6;
  color: white;
}

.play-again-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.new-mode-button {
  background: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.new-mode-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

/* Transition animations */
.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.3s ease;
}

.overlay-enter-from {
  opacity: 0;
}

.overlay-enter-to {
  opacity: 1;
}

.overlay-leave-from {
  opacity: 1;
}

.overlay-leave-to {
  opacity: 0;
}

.overlay-enter-from .overlay-content {
  transform: scale(0.9) translateY(20px);
}

.overlay-enter-to .overlay-content {
  transform: scale(1) translateY(0);
}

.overlay-leave-from .overlay-content {
  transform: scale(1) translateY(0);
}

.overlay-leave-to .overlay-content {
  transform: scale(0.9) translateY(20px);
}

/* Mobile responsive */
@media (max-width: 640px) {
  .score-overlay {
    padding: 0.5rem;
  }
  
  .overlay-content {
    padding: 1.5rem;
  }
  
  .overlay-title {
    font-size: 1.5rem;
  }
  
  .result-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .overlay-actions {
    flex-direction: column;
  }
  
  .play-again-button,
  .new-mode-button {
    width: 100%;
  }
}
</style>
