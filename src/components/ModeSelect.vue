<template>
  <div class="mode-select">
    <h2 class="mode-title">Choose Difficulty</h2>
    <div class="mode-options">
      <button
        v-for="mode in gameModes"
        :key="mode"
        class="mode-button"
        :class="{ 'selected': selectedMode === mode }"
        @click="selectMode(mode)"
      >
        <div class="mode-number">{{ mode }}</div>
        <div class="mode-label">bottles</div>
        <div class="mode-difficulty">{{ getDifficultyText(mode) }}</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { GAME_MODES, MODE_PENALTIES } from '../assets/colors.js';

const props = defineProps({
  selectedMode: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['select-mode']);

const gameModes = Object.keys(GAME_MODES).map(Number);

const selectMode = (mode) => {
  emit('select-mode', mode);
};

const getDifficultyText = (mode) => {
  const difficulties = {
    4: 'Easy',
    5: 'Medium', 
    6: 'Hard'
  };
  return difficulties[mode] || 'Normal';
};
</script>

<style scoped>
.mode-select {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.mode-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: hsl(213 31% 91%);
  margin: 0;
  text-align: center;
  line-height: 1.2;
}

.mode-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.mode-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid hsl(215 27.9% 16.9%);
  border-radius: 0.75rem;
  background: hsl(217.2 32.6% 17.5%);
  color: hsl(213 31% 91%);
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  min-width: 7.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3);
}

.mode-button:hover {
  border-color: hsl(215 27.9% 25%);
  background: hsl(217.2 32.6% 25%);
  box-shadow: 0 6px 10px -1px rgb(0 0 0 / 0.4), 0 4px 6px -2px rgb(0 0 0 / 0.4);
}

.mode-button.selected {
  border-color: hsl(142.1 76.2% 36.3%);
  background: hsl(142.1 76.2% 36.3%);
  color: hsl(0 0% 100%);
}

.mode-number {
  font-size: 2rem;
  font-weight: 700;
  color: hsl(213 31% 91%);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.mode-label {
  font-size: 0.875rem;
  color: hsl(215.4 16.3% 65%);
  margin-bottom: 0.25rem;
  text-transform: lowercase;
  letter-spacing: 0.025em;
  font-weight: 500;
}

.mode-difficulty {
  font-size: 0.75rem;
  color: hsl(215.4 16.3% 65%);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.selected .mode-number {
  color: hsl(0 0% 100%);
}

.selected .mode-label {
  color: hsl(0 0% 100% / 0.8);
}

.selected .mode-difficulty {
  color: hsl(0 0% 100% / 0.7);
}

/* Mobile responsive */
@media (max-width: 640px) {
  .mode-options {
    flex-direction: column;
    width: 100%;
  }
  
  .mode-button {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
  }
  
  .mode-number {
    font-size: 2rem;
    margin-bottom: 0;
  }
  
  .mode-label {
    margin-bottom: 0;
  }
}
</style>
