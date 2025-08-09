import { gsap } from 'gsap';

// Animation constants - smoother and more fluid
const DEFAULT_EASE = 'power3.out';
const MICRO_DURATION = 0.15;
const SWAP_DURATION = 0.35;

export function useAnimations() {
  
  // Hover animation - smoother and more fluid
  const hoverAnimation = async (element, isHovering) => {
    if (!element) return;

    if (isHovering) {
      await gsap.to(element, {
        y: -6,
        scale: 1.08,
        rotation: 1,
        duration: MICRO_DURATION,
        ease: DEFAULT_EASE
      });
    } else {
      await gsap.to(element, {
        y: 0,
        scale: 1,
        rotation: 0,
        duration: MICRO_DURATION,
        ease: DEFAULT_EASE
      });
    }
  };

  // Select animation - smoother bounce
  const selectAnimation = async (element) => {
    if (!element) return;

    await gsap.to(element, {
      scale: 1.15,
      y: -12,
      duration: MICRO_DURATION,
      ease: 'back.out(1.5)'
    });
  };

  // Deselect animation - smooth return
  const deselectAnimation = async (element) => {
    if (!element) return;

    await gsap.to(element, {
      scale: 1,
      y: 0,
      duration: MICRO_DURATION,
      ease: DEFAULT_EASE
    });
  };

  // Set selection state - immediate
  const setSelectionState = (element, isSelected) => {
    if (!element) return;

    gsap.set(element, {
      scale: isSelected ? 1.15 : 1,
      y: isSelected ? -12 : 0
    });
  };

  // Liquid slosh animation - smoother physics
  const liquidSlosh = (liquidElement, intensity = 3, type = 'hover') => {
    if (!liquidElement) return;

    const timeline = gsap.timeline();
    
    if (type === 'hover') {
      timeline.to(liquidElement, {
        rotation: intensity,
        duration: 0.25,
        ease: 'power2.out'
      });
    } else if (type === 'swap') {
      // Smoother swap slosh
      timeline.to(liquidElement, {
        rotation: -intensity * 1.5,
        duration: 0.15,
        ease: 'power2.out'
      }).to(liquidElement, {
        rotation: intensity,
        duration: 0.25,
        ease: 'elastic.out(1, 0.4)'
      }).to(liquidElement, {
        rotation: 0,
        duration: 0.15,
        ease: 'power2.out'
      });
    }
  };

  // Swap animation - smoother and more fluid
  const swapAnimation = async (bottle1, bottle2, liquid1, liquid2) => {
    if (!bottle1 || !bottle2) return;

    const timeline = gsap.timeline();
    
    // Phase 1: Lift both bottles
    timeline.to([bottle1, bottle2], {
      y: -25,
      scale: 1.12,
      duration: 0.12,
      ease: 'power2.out'
    });

    // Phase 2: Cross paths with smoother easing
    const bottle1Rect = bottle1.getBoundingClientRect();
    const bottle2Rect = bottle2.getBoundingClientRect();
    const deltaX = bottle2Rect.left - bottle1Rect.left;
    const deltaY = bottle2Rect.top - bottle1Rect.top;

    timeline.to(bottle1, {
      x: deltaX,
      y: deltaY - 25,
      duration: 0.25,
      ease: 'power2.inOut'
    }, '-=0.08');

    timeline.to(bottle2, {
      x: -deltaX,
      y: -deltaY - 25,
      duration: 0.25,
      ease: 'power2.inOut'
    }, '-=0.25');

    // Liquid slosh during movement
    if (liquid1) liquidSlosh(liquid1, 6, 'swap');
    if (liquid2) liquidSlosh(liquid2, 6, 'swap');

    // Phase 3: Land smoothly
    timeline.to([bottle1, bottle2], {
      y: 0,
      scale: 1,
      duration: 0.12,
      ease: 'power2.out'
    });

    // Reset x positions
    timeline.set([bottle1, bottle2], { x: 0 });

    return timeline;
  };

  // Row pulse animation - smoother feedback
  const rowPulseAnimation = (rowElement) => {
    if (!rowElement) return;

    gsap.to(rowElement, {
      scale: 1.03,
      duration: 0.15,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    });
  };

  // Win jiggle animation - smoother celebration
  const winJiggleAnimation = (bottles) => {
    if (!bottles || !bottles.length) return;

    const timeline = gsap.timeline();
    
    bottles.forEach((bottle, index) => {
      timeline.to(bottle, {
        rotation: 4,
        duration: 0.08,
        ease: 'power2.out'
      }, index * 0.04);
      
      timeline.to(bottle, {
        rotation: -4,
        duration: 0.08,
        ease: 'power2.out'
      }, index * 0.04 + 0.08);
      
      timeline.to(bottle, {
        rotation: 2,
        duration: 0.08,
        ease: 'power2.out'
      }, index * 0.04 + 0.16);
      
      timeline.to(bottle, {
        rotation: -2,
        duration: 0.08,
        ease: 'power2.out'
      }, index * 0.04 + 0.24);
      
      timeline.to(bottle, {
        rotation: 0,
        duration: 0.08,
        ease: 'power2.out'
      }, index * 0.04 + 0.32);
    });

    return timeline;
  };

  // Overlay fade animation - smoother transitions
  const overlayFadeAnimation = (overlay, isVisible) => {
    if (!overlay) return;

    if (isVisible) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out'
      });
    } else {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.15,
        ease: 'power2.out'
      });
    }
  };

  return {
    hoverAnimation,
    selectAnimation,
    deselectAnimation,
    setSelectionState,
    liquidSlosh,
    swapAnimation,
    rowPulseAnimation,
    winJiggleAnimation,
    overlayFadeAnimation
  };
}
