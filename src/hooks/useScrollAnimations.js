import { useEffect } from 'react'
import { useAnimation } from 'framer-motion'
import { useInView } from 'framer-motion'

// Custom hook for scroll-triggered animations
export const useScrollAnimations = () => {
  const controls = useAnimation()

  // Fade in from bottom animation
  const fadeInUp = {
    hidden: { 
      opacity: 0, 
      y: 60,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  // Fade in from left animation
  const fadeInLeft = {
    hidden: { 
      opacity: 0, 
      x: -60,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  // Fade in from right animation
  const fadeInRight = {
    hidden: { 
      opacity: 0, 
      x: 60,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  // Scale in animation
  const scaleIn = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  // Stagger container animation
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  // Float animation for decorative elements
  const floatAnimation = {
    y: [-20, 20, -20],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  // Pulse animation for attention-grabbing elements
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  // Rotate animation for icons
  const rotateAnimation = {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }

  return {
    controls,
    variants: {
      fadeInUp,
      fadeInLeft,
      fadeInRight,
      scaleIn,
      staggerContainer
    },
    animations: {
      floatAnimation,
      pulseAnimation,
      rotateAnimation
    }
  }
}

// Hook for page transitions
export const usePageTransition = () => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 30,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    out: {
      opacity: 0,
      y: -30,
      scale: 1.02,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  }

  return { pageVariants, pageTransition }
}

// Hook for navbar animations
export const useNavbarAnimations = () => {
  const navVariants = {
    hidden: {
      y: -100,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return { navVariants, navItemVariants }
}

// Hook for card hover effects
export const useCardAnimations = () => {
  const cardHover = {
    scale: 1.03,
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }

  const cardTap = {
    scale: 0.97,
    transition: {
      duration: 0.1,
      ease: "easeOut"
    }
  }

  return { cardHover, cardTap }
}

// Hook for text reveal animations
export const useTextAnimations = () => {
  const textReveal = {
    hidden: {
      opacity: 0,
      y: 100,
      skewY: 7
    },
    visible: {
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const letterAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return { textReveal, letterAnimation }
}