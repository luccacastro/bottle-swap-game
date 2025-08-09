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
        <div class="mode-penalty">-{{ modePenalties[mode] }} per move</div>
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
const modePenalties = MODE_PENALTIES;

const selectMode = (mode) => {
  emit('select-mode', mode);
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
  font-size: 2rem;
  font-weight: 600;
  color: #f8fafc;
  margin: 0;
  text-align: center;
}

.mode-options {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.mode-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: 2px solid #475569;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.5);
  color: #f1f5f9;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  backdrop-filter: blur(8px);
}

.mode-button:hover {
  border-color: #64748b;
  background: rgba(30, 41, 59, 0.7);
  transform: translateY(-2px);
}

.mode-button.selected {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

.mode-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.mode-label {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mode-penalty {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.selected .mode-number {
  color: #60a5fa;
}

.selected .mode-label {
  color: #cbd5e1;
}

.selected .mode-penalty {
  color: #94a3b8;
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
