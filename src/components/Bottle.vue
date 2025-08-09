<template>
  <button
    ref="bottleRef"
    class="bottle-button"
    :class="{ 'selected': isSelected }"
    :style="{
      '--liquid': liquidColor,
      '--glass': bottleColors.glass,
      '--outline': bottleColors.outline,
      '--cap': bottleColors.cap,
      '--label': bottleColors.label,
      '--shine': 'rgba(255,255,255,.45)'
    }"
    :aria-pressed="isSelected"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <svg viewBox="0 0 100 200" class="bottle-svg">
      <defs>
        <clipPath :id="`liqClip-${uniqueId}`">
          <path d="M25 70 Q25 62 32 58 Q39 54 44 54 L56 54 Q61 54 68 58 Q75 62 75 70 L75 172 Q75 178 70 178 L30 178 Q25 178 25 172 Z"/>
        </clipPath>
        <clipPath id="rimTopHalf">
          <rect x="0" y="0" width="100" height="28"/>
        </clipPath>
      </defs>
      
      <!-- Glass body -->
      <path d="M25 70 Q25 62 32 58 Q39 54 44 54 L56 54 Q61 54 68 58 Q75 62 75 70 L75 176 Q75 186 65 186 L35 186 Q25 186 25 176 Z"
            fill="var(--glass)" stroke="var(--outline)" stroke-width="3" stroke-linejoin="round"/>
      
      <!-- Neck -->
      <path d="M43 54 L43 29.2 Q43 26 46 25 L54 25 Q57 26 57 29.2 L57 54 Z"
            fill="var(--glass)" stroke="var(--outline)" stroke-width="3" stroke-linejoin="round"/>
      
      <!-- Cap body -->
      <path d="M38 12 Q38 8 42 8 L58 8 Q62 8 62 12 L62 24 Q62 28 58 28 L42 28 Q38 28 38 24"
            fill="var(--cap)" stroke="var(--outline)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
      
      <!-- Rim -->
      <g clip-path="url(#rimTopHalf)">
        <ellipse cx="50" cy="28" rx="10" ry="3.2"
                 fill="none" stroke="var(--outline)" stroke-width="2" opacity="0.95"/>
      </g>
      
      <!-- Liquid -->
      <g :clip-path="`url(#liqClip-${uniqueId})`" class="liquid-wrap">
        <rect x="20" y="104" width="60" height="84" fill="var(--liquid)" class="liquid-fill"/>
        <path d="M25 104 Q40 100 50 104 Q60 108 75 104"
              fill="none" stroke="var(--outline)" stroke-opacity=".08" stroke-width="2" class="liquid-surface"/>
      </g>
      
      <!-- Shine strip -->
      <path d="M29 76 Q29 72 33 72 L40 72 Q43 72 43 76 L43 150 Q43 154 40 154 L33 154 Q29 154 29 150 Z"
            fill="var(--shine)"/>
      
      <!-- Label -->
      <rect x="33" y="118" width="34" height="28" rx="6"
            fill="var(--label)" stroke="var(--outline)" stroke-width="3"/>
      
      <!-- Highlight line -->
      <path d="M35 156 Q36 162 33 166" fill="none"
            stroke="var(--outline)" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
    </svg>
  </button>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useAnimations } from '../composables/useAnimations.js';
import { useSounds } from '../composables/useSounds.js';

const props = defineProps({
  color: {
    type: String,
    required: true
  },
  shapeId: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select']);

const bottleRef = ref(null);
const uniqueId = ref(`bottle-${Date.now()}-${Math.random()}`);

const { 
  hoverAnimation, 
  selectAnimation, 
  deselectAnimation,
  setSelectionState,
  liquidSlosh
} = useAnimations();

const { playSelect, playDeselect } = useSounds();

// Liquid color - passed as CSS custom property
const liquidColor = computed(() => props.color);

// Bottle type for styling
const bottleType = computed(() => {
  const types = ['wine', 'beer', 'champagne', 'whiskey', 'craft'];
  const shapeIndex = parseInt(props.shapeId.split('-')[1]) - 1;
  return types[shapeIndex] || 'wine';
});

// CSS variables for bottle colors - Theme entire bottle to match liquid color
const bottleColors = computed(() => {
  const liquidColor = props.color;
  
  // Function to darken a color
  const darkenColor = (color, amount = 0.3) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(255 * amount);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };
  
  // Function to lighten a color
  const lightenColor = (color, amount = 0.3) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(255 * amount);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };
  
  return {
    glass: darkenColor(liquidColor, 0.4), // Dark version of liquid color
    outline: darkenColor(liquidColor, 0.6), // Very dark version
    cap: darkenColor(liquidColor, 0.2), // Medium dark version  
    label: lightenColor(liquidColor, 0.4) // Light version of liquid color
  };
});

let isHovered = false;

// Handle click events
const handleClick = async () => {
  // Always emit select and let GameBoard handle the logic
  emit('select');
  
  if (props.isSelected) {
    // Play deselect feedback
    await deselectAnimation(bottleRef.value);
    playDeselect();
  } else {
    // Play select feedback
    await selectAnimation(bottleRef.value);
    playSelect();
  }
};

// Handle hover events
const handleMouseEnter = async () => {
  if (isHovered) return;
  isHovered = true;
  
  if (!props.isSelected) {
    await hoverAnimation(bottleRef.value, true);
    // Animate the entire bottle
    if (bottleRef.value) {
      liquidSlosh(bottleRef.value, 2, 'hover');
    }
  }
};

const handleMouseLeave = async () => {
  if (!isHovered) return;
  isHovered = false;
  
  if (!props.isSelected) {
    await hoverAnimation(bottleRef.value, false);
    // Animate the entire bottle back
    if (bottleRef.value) {
      liquidSlosh(bottleRef.value, 0, 'hover');
    }
  }
};

// Handle touch events for mobile
const handleTouchStart = () => {
  handleMouseEnter();
};

const handleTouchEnd = () => {
  handleMouseLeave();
};

// Initialize component
onMounted(async () => {
  await nextTick();
  
  if (bottleRef.value) {
    // Set initial selection state
    setSelectionState(bottleRef.value, props.isSelected);
  }
});

// Watch for selection changes
watch(() => props.isSelected, (newValue) => {
  if (bottleRef.value) {
    setSelectionState(bottleRef.value, newValue);
  }
});

// Expose methods for parent components
defineExpose({
  element: bottleRef,
  liquidElement: () => bottleRef.value
});
</script>

<style scoped>
.bottle-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: none; /* GSAP handles all animations */
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 280px;
  position: relative;
}

.bottle-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 4px;
}

.bottle-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: none; /* GSAP handles animations */
  /* Smooth rendering */
  shape-rendering: geometricPrecision;
  text-rendering: optimizeLegibility;
  transform-origin: center bottom;
}

.selected .bottle-svg {
  filter: drop-shadow(0 0 12px var(--liquid)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  transform: scale(1.05);
}

/* Mobile touch optimizations */
@media (hover: none) and (pointer: coarse) {
  .bottle-button {
    min-height: 44px; /* Touch target size */
  }
}
</style>
