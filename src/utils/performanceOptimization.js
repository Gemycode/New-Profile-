// Performance optimization utilities

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Preload critical resources
 * @param {string[]} resources - Array of resource URLs
 */
export const preloadResources = (resources) => {
  resources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource.url
    link.as = resource.type || 'script'
    if (resource.crossorigin) {
      link.crossOrigin = resource.crossorigin
    }
    document.head.appendChild(link)
  })
}

/**
 * Optimize scroll performance
 * @param {Function} callback - Scroll callback function
 * @param {number} throttleTime - Throttle time in milliseconds
 * @returns {Function} Optimized scroll handler
 */
export const optimizeScroll = (callback, throttleTime = 16) => {
  let ticking = false
  
  const updateScroll = () => {
    callback()
    ticking = false
  }
  
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll)
      ticking = true
    }
  }
  
  return throttle(requestTick, throttleTime)
}

/**
 * Lazy load components with React.lazy
 * @param {Function} importFunc - Dynamic import function
 * @returns {React.Component} Lazy loaded component
 */
export const lazyLoadComponent = (importFunc) => {
  return React.lazy(() => importFunc().catch(() => ({
    default: () => <div>Failed to load component</div>
  })))
}

/**
 * Optimize animations for better performance
 * @param {object} animationConfig - Animation configuration
 * @returns {object} Optimized animation config
 */
export const optimizeAnimations = (animationConfig) => {
  return {
    ...animationConfig,
    transition: {
      ...animationConfig.transition,
      // Use transform and opacity for better performance
      willChange: 'transform, opacity',
      // Reduce motion for users who prefer it
      ...(window.matchMedia('(prefers-reduced-motion: reduce)').matches && {
        duration: 0.1
      })
    }
  }
}

/**
 * Memory management utilities
 */
export const memoryManagement = {
  // Clear unused event listeners
  clearEventListeners: (element, events = []) => {
    events.forEach(event => {
      element.removeEventListener(event.type, event.handler)
    })
  },

  // Cleanup intervals and timeouts
  clearTimers: (timers = []) => {
    timers.forEach(timer => {
      if (timer.type === 'interval') {
        clearInterval(timer.id)
      } else if (timer.type === 'timeout') {
        clearTimeout(timer.id)
      }
    })
  },

  // Force garbage collection (use sparingly)
  forceGC: () => {
    if (window.gc) {
      window.gc()
    }
  }
}

/**
 * Bundle size optimization
 */
export const bundleOptimization = {
  // Dynamic imports for code splitting
  dynamicImport: (path) => {
    return import(path).catch(error => {
      console.warn(`Failed to load module: ${path}`, error)
      return null
    })
  },

  // Tree shaking optimization
  importOnly: (module, exports) => {
    return exports.reduce((acc, exportName) => {
      acc[exportName] = module[exportName]
      return acc
    }, {})
  }
}

/**
 * Network optimization
 */
export const networkOptimization = {
  // Check if user is on slow connection
  isSlowConnection: () => {
    if ('connection' in navigator) {
      const connection = navigator.connection
      return connection.effectiveType === 'slow-2g' || 
             connection.effectiveType === '2g' ||
             connection.saveData
    }
    return false
  },

  // Adaptive loading based on connection
  adaptiveLoading: (fastCallback, slowCallback) => {
    if (networkOptimization.isSlowConnection()) {
      slowCallback()
    } else {
      fastCallback()
    }
  }
}

/**
 * Performance monitoring
 */
export const performanceMonitoring = {
  // Measure component render time
  measureRender: (componentName, renderFunction) => {
    const start = performance.now()
    const result = renderFunction()
    const end = performance.now()
    
    console.log(`${componentName} render time: ${end - start}ms`)
    return result
  },

  // Monitor memory usage
  getMemoryUsage: () => {
    if ('memory' in performance) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      }
    }
    return null
  },

  // Monitor Core Web Vitals
  monitorWebVitals: () => {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log('LCP:', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          console.log('CLS:', entry.value)
        }
      })
    }).observe({ entryTypes: ['layout-shift'] })
  }
}

/**
 * Critical resource hints
 */
export const resourceHints = {
  // Add DNS prefetch
  dnsPrefetch: (domain) => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = domain
    document.head.appendChild(link)
  },

  // Add preconnect
  preconnect: (url, crossorigin = false) => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = url
    if (crossorigin) {
      link.crossOrigin = 'anonymous'
    }
    document.head.appendChild(link)
  },

  // Add prefetch for next page
  prefetch: (url) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  }
}

export default {
  debounce,
  throttle,
  preloadResources,
  optimizeScroll,
  lazyLoadComponent,
  optimizeAnimations,
  memoryManagement,
  bundleOptimization,
  networkOptimization,
  performanceMonitoring,
  resourceHints
}
