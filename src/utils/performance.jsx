import { useState, useEffect, useRef } from 'react'

// Performance monitoring and optimization utilities

export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = new Map()
    this.init()
  }

  init() {
    // Initialize performance observers
    this.initIntersectionObserver()
    this.initPerformanceObserver()
    this.trackWebVitals()
  }

  // Track Web Vitals (LCP, FID, CLS)
  trackWebVitals() {
    // Check if PerformanceObserver is supported
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported')
      return
    }

    // Largest Contentful Paint
    this.observeMetric('largest-contentful-paint', (entry) => {
      this.metrics.set('LCP', entry.startTime)
      console.log('LCP:', entry.startTime)
    })

    // First Input Delay (using first-input)
    this.observeMetric('first-input', (entry) => {
      this.metrics.set('FID', entry.processingStart - entry.startTime)
      console.log('FID:', entry.processingStart - entry.startTime)
    })

    // Cumulative Layout Shift
    this.observeMetric('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        const currentCLS = this.metrics.get('CLS') || 0
        this.metrics.set('CLS', currentCLS + entry.value)
        console.log('CLS:', currentCLS + entry.value)
      }
    })
  }

  observeMetric(entryType, callback) {
    try {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach(callback)
        })
        
        // Try to observe the entry type
        try {
          observer.observe({ type: entryType, buffered: true })
          this.observers.set(entryType, observer)
        } catch (error) {
          console.warn(`Could not observe ${entryType}:`, error.message)
        }
      }
    } catch (error) {
      console.warn(`Performance observer error for ${entryType}:`, error)
    }
  }

  // Intersection Observer for lazy loading
  initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Element is visible, trigger loading
              entry.target.dispatchEvent(new CustomEvent('elementVisible'))
            }
          })
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      )
    }
  }

  // Performance Observer for navigation and resource timing
  initPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.trackNavigationTiming(entry)
          } else if (entry.entryType === 'resource') {
            this.trackResourceTiming(entry)
          }
        })
      })

      observer.observe({ entryTypes: ['navigation', 'resource'] })
    }
  }

  trackNavigationTiming(entry) {
    const metrics = {
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      tcp: entry.connectEnd - entry.connectStart,
      request: entry.responseStart - entry.requestStart,
      response: entry.responseEnd - entry.responseStart,
      dom: entry.domContentLoadedEventEnd - entry.responseEnd,
      load: entry.loadEventEnd - entry.loadEventStart,
      total: entry.loadEventEnd - entry.navigationStart
    }

    this.metrics.set('navigation', metrics)
    console.table(metrics)
  }

  trackResourceTiming(entry) {
    if (entry.duration > 100) { // Only log slow resources
      console.warn('Slow resource:', {
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize
      })
    }
  }

  // Observe element for lazy loading
  observe(element) {
    if (this.intersectionObserver && element) {
      this.intersectionObserver.observe(element)
    }
  }

  // Unobserve element
  unobserve(element) {
    if (this.intersectionObserver && element) {
      this.intersectionObserver.unobserve(element)
    }
  }

  // Get performance metrics
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }

  // Track custom metrics
  mark(name) {
    performance.mark(name)
  }

  measure(name, startMark, endMark) {
    performance.measure(name, startMark, endMark)
    const measure = performance.getEntriesByName(name, 'measure')[0]
    this.metrics.set(name, measure.duration)
    return measure.duration
  }

  // Cleanup
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
    }
  }
}

// Image optimization utility
export class ImageOptimizer {
  static createOptimizedSrc(src, width = 800, quality = 80) {
    // For development, return original
    if (import.meta.env.DEV) {
      return src
    }

    // Add query parameters for optimization services
    const url = new URL(src)
    url.searchParams.set('w', width)
    url.searchParams.set('q', quality)
    url.searchParams.set('f', 'webp')
    
    return url.toString()
  }

  static generateSrcSet(src, sizes = [400, 800, 1200]) {
    return sizes
      .map(size => `${this.createOptimizedSrc(src, size)} ${size}w`)
      .join(', ')
  }
}

// Lazy loading component wrapper
export const LazyWrapper = ({ children, fallback = null, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef()
  const monitor = useRef(new PerformanceMonitor())

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  )
}

// Create global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('ServiceWorker registered:', registration)
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available, prompt user to refresh
            if (confirm('New version available! Refresh to update?')) {
              window.location.reload()
            }
          }
        })
      })
    } catch (error) {
      console.error('ServiceWorker registration failed:', error)
    }
  }
}

// Resource preloading
export const preloadResource = (url, as = 'fetch') => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = url
  link.as = as
  if (as === 'fetch') {
    link.crossOrigin = 'anonymous'
  }
  document.head.appendChild(link)
}

// Critical resource hints
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const domains = [
    'firebaseapp.com',
    'googleapis.com',
    'fonts.gstatic.com'
  ]
  
  domains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = `//${domain}`
    document.head.appendChild(link)
  })
}