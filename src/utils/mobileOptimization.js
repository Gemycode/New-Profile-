// Mobile optimization utilities for better mobile experience

/**
 * Detect mobile device and capabilities
 */
export const mobileDetection = {
  // Check if device is mobile
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  // Check if device is tablet
  isTablet: () => {
    return /iPad|Android(?=.*\bMobile\b)/i.test(navigator.userAgent)
  },

  // Check if device supports touch
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  },

  // Get device orientation
  getOrientation: () => {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  },

  // Check for slow connection
  isSlowConnection: () => {
    if ('connection' in navigator) {
      const connection = navigator.connection
      return connection.effectiveType === 'slow-2g' || 
             connection.effectiveType === '2g' ||
             connection.saveData
    }
    return false
  }
}

/**
 * Touch gesture handling
 */
export const touchGestures = {
  // Handle swipe gestures
  handleSwipe: (element, callbacks) => {
    let startX, startY, endX, endY
    
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
    
    const handleTouchEnd = (e) => {
      endX = e.changedTouches[0].clientX
      endY = e.changedTouches[0].clientY
      
      const deltaX = endX - startX
      const deltaY = endY - startY
      const minSwipeDistance = 50
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0 && callbacks.onSwipeRight) {
            callbacks.onSwipeRight()
          } else if (deltaX < 0 && callbacks.onSwipeLeft) {
            callbacks.onSwipeLeft()
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0 && callbacks.onSwipeDown) {
            callbacks.onSwipeDown()
          } else if (deltaY < 0 && callbacks.onSwipeUp) {
            callbacks.onSwipeUp()
          }
        }
      }
    }
    
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  },

  // Handle pinch zoom
  handlePinch: (element, callbacks) => {
    let initialDistance = 0
    
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        initialDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
      }
    }
    
    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        
        const scale = currentDistance / initialDistance
        
        if (callbacks.onPinch) {
          callbacks.onPinch(scale)
        }
      }
    }
    
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
    }
  }
}

/**
 * Mobile-specific optimizations
 */
export const mobileOptimizations = {
  // Optimize images for mobile
  optimizeImagesForMobile: () => {
    const images = document.querySelectorAll('img')
    const isMobile = mobileDetection.isMobile()
    const isSlowConnection = mobileDetection.isSlowConnection()
    
    images.forEach(img => {
      if (isMobile) {
        // Add mobile-specific attributes
        img.setAttribute('loading', 'lazy')
        img.setAttribute('decoding', 'async')
        
        // Reduce quality for slow connections
        if (isSlowConnection && img.src.includes('unsplash.com')) {
          const optimizedSrc = img.src.replace(/q=\d+/, 'q=60')
          img.src = optimizedSrc
        }
      }
    })
  },

  // Optimize animations for mobile
  optimizeAnimationsForMobile: (animationConfig) => {
    const isMobile = mobileDetection.isMobile()
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (isMobile || prefersReducedMotion) {
      return {
        ...animationConfig,
        transition: {
          ...animationConfig.transition,
          duration: Math.min(animationConfig.transition?.duration || 0.3, 0.2),
          ease: 'easeOut'
        }
      }
    }
    
    return animationConfig
  },

  // Optimize font sizes for mobile
  optimizeFontSizes: () => {
    const isMobile = mobileDetection.isMobile()
    
    if (isMobile) {
      document.documentElement.style.setProperty('--font-size-base', '14px')
      document.documentElement.style.setProperty('--font-size-lg', '16px')
      document.documentElement.style.setProperty('--font-size-xl', '18px')
    } else {
      document.documentElement.style.setProperty('--font-size-base', '16px')
      document.documentElement.style.setProperty('--font-size-lg', '18px')
      document.documentElement.style.setProperty('--font-size-xl', '20px')
    }
  },

  // Optimize spacing for mobile
  optimizeSpacing: () => {
    const isMobile = mobileDetection.isMobile()
    
    if (isMobile) {
      document.documentElement.style.setProperty('--spacing-sm', '0.5rem')
      document.documentElement.style.setProperty('--spacing-md', '1rem')
      document.documentElement.style.setProperty('--spacing-lg', '1.5rem')
      document.documentElement.style.setProperty('--spacing-xl', '2rem')
    }
  }
}

/**
 * Mobile navigation optimizations
 */
export const mobileNavigation = {
  // Handle mobile menu toggle
  handleMobileMenu: (menuElement, toggleButton) => {
    const isOpen = () => menuElement.classList.contains('open')
    
    const openMenu = () => {
      menuElement.classList.add('open')
      document.body.style.overflow = 'hidden'
      toggleButton.setAttribute('aria-expanded', 'true')
    }
    
    const closeMenu = () => {
      menuElement.classList.remove('open')
      document.body.style.overflow = ''
      toggleButton.setAttribute('aria-expanded', 'false')
    }
    
    const toggleMenu = () => {
      if (isOpen()) {
        closeMenu()
      } else {
        openMenu()
      }
    }
    
    toggleButton.addEventListener('click', toggleMenu)
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (isOpen() && !menuElement.contains(e.target) && !toggleButton.contains(e.target)) {
        closeMenu()
      }
    })
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        closeMenu()
      }
    })
    
    return { openMenu, closeMenu, toggleMenu }
  },

  // Handle mobile-friendly scrolling
  handleMobileScrolling: (container) => {
    let isScrolling = false
    
    const handleScroll = () => {
      if (!isScrolling) {
        requestAnimationFrame(() => {
          // Smooth scroll behavior
          container.style.scrollBehavior = 'smooth'
          isScrolling = false
        })
        isScrolling = true
      }
    }
    
    container.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }
}

/**
 * Mobile performance monitoring
 */
export const mobilePerformance = {
  // Monitor mobile-specific metrics
  monitorMobileMetrics: () => {
    const metrics = {
      isMobile: mobileDetection.isMobile(),
      isTouchDevice: mobileDetection.isTouchDevice(),
      orientation: mobileDetection.getOrientation(),
      connectionType: navigator.connection?.effectiveType || 'unknown',
      memoryUsage: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576)
      } : null
    }
    
    console.log('Mobile Metrics:', metrics)
    return metrics
  },

  // Optimize for mobile performance
  optimizeForMobile: () => {
    // Reduce animation complexity
    const animations = document.querySelectorAll('[data-animation]')
    animations.forEach(animation => {
      if (mobileDetection.isMobile()) {
        animation.style.animationDuration = '0.2s'
      }
    })
    
    // Optimize images
    mobileOptimizations.optimizeImagesForMobile()
    
    // Optimize fonts
    mobileOptimizations.optimizeFontSizes()
    
    // Optimize spacing
    mobileOptimizations.optimizeSpacing()
  }
}

/**
 * Mobile accessibility
 */
export const mobileAccessibility = {
  // Ensure proper touch targets
  ensureTouchTargets: () => {
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea')
    
    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect()
      const minSize = 44 // Minimum touch target size in pixels
      
      if (rect.width < minSize || rect.height < minSize) {
        element.style.minWidth = `${minSize}px`
        element.style.minHeight = `${minSize}px`
      }
    })
  },

  // Handle focus management on mobile
  handleMobileFocus: () => {
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        // Scroll element into view on focus
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    })
  }
}

export default {
  mobileDetection,
  touchGestures,
  mobileOptimizations,
  mobileNavigation,
  mobilePerformance,
  mobileAccessibility
}
