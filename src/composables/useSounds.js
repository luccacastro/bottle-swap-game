import { Howl } from 'howler';

// Sound configuration
const SOUND_CONFIG = {
  volume: 0.6,
  rate: 1.0,
  preload: true
};

export function useSounds() {
  let sounds = {};
  let isInitialized = false;

  // Initialize sounds after first user interaction
  const initializeSounds = () => {
    if (isInitialized) return;
    
    // Temporarily disable audio to fix DOMException
    console.log('Audio disabled temporarily');
    sounds = {};
    isInitialized = true;
  };

  // Play sound with error handling
  const playSound = (soundName) => {
    if (!isInitialized) {
      initializeSounds();
    }
    
    try {
      if (sounds[soundName]) {
        sounds[soundName].play();
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${soundName}`, error);
    }
  };

  // Sound event handlers
  const playSelect = () => playSound('select');
  const playDeselect = () => playSound('deselect');
  const playSwap = () => playSound('swap');
  const playSubmit = () => playSound('submit');
  const playCorrect = () => playSound('correct');
  const playWin = () => playSound('win');

  // Set global volume
  const setVolume = (volume) => {
    Object.values(sounds).forEach(sound => {
      if (sound && typeof sound.volume === 'function') {
        sound.volume(volume);
      }
    });
  };

  // Mute/unmute all sounds
  const setMuted = (muted) => {
    Object.values(sounds).forEach(sound => {
      if (sound && typeof sound.mute === 'function') {
        sound.mute(muted);
      }
    });
  };

  // Cleanup sounds
  const cleanup = () => {
    Object.values(sounds).forEach(sound => {
      if (sound && typeof sound.unload === 'function') {
        sound.unload();
      }
    });
    sounds = {};
    isInitialized = false;
  };

  return {
    initializeSounds,
    playSelect,
    playDeselect,
    playSwap,
    playSubmit,
    playCorrect,
    playWin,
    setVolume,
    setMuted,
    cleanup
  };
}
