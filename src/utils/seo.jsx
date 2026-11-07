import { useEffect } from 'react'

// SEO utilities for dynamic meta tag management
export class SEOManager {
  static updateTitle(title) {
    document.title = title
  }

  static updateMeta(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`) || 
               document.querySelector(`meta[property="${name}"]`)
    
    if (!meta) {
      meta = document.createElement('meta')
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        meta.setAttribute('property', name)
      } else {
        meta.setAttribute('name', name)
      }
      document.head.appendChild(meta)
    }
    
    meta.setAttribute('content', content)
  }

  static updateCanonical(url) {
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
  }

  static addStructuredData(data) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  }

  static addBreadcrumbs(items) {
    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    }
    this.addStructuredData(breadcrumbs)
  }
}

// React hook for SEO management
export const useSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  structuredData
}) => {
  useEffect(() => {
    if (title) {
      SEOManager.updateTitle(title)
      SEOManager.updateMeta('og:title', title)
      SEOManager.updateMeta('twitter:title', title)
    }

    if (description) {
      SEOManager.updateMeta('description', description)
      SEOManager.updateMeta('og:description', description)
      SEOManager.updateMeta('twitter:description', description)
    }

    if (keywords) {
      SEOManager.updateMeta('keywords', keywords)
    }

    if (image) {
      SEOManager.updateMeta('og:image', image)
      SEOManager.updateMeta('twitter:image', image)
    }

    if (url) {
      SEOManager.updateMeta('og:url', url)
      SEOManager.updateMeta('twitter:url', url)
      SEOManager.updateCanonical(url)
    }

    if (type) {
      SEOManager.updateMeta('og:type', type)
    }

    if (structuredData) {
      SEOManager.addStructuredData(structuredData)
    }
  }, [title, description, keywords, image, url, type, structuredData])
}

// Accessibility utilities
export class AccessibilityManager {
  static announceToScreenReader(message, priority = 'polite') {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.textContent = message
    
    document.body.appendChild(announcer)
    
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  }

  static focusElement(selector) {
    const element = document.querySelector(selector)
    if (element) {
      element.focus()
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  static trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
      
      if (e.key === 'Escape') {
        container.focus()
      }
    }

    container.addEventListener('keydown', handleTabKey)
    return () => container.removeEventListener('keydown', handleTabKey)
  }
}

// React hook for accessibility features
export const useAccessibility = () => {
  const announce = (message, priority = 'polite') => {
    AccessibilityManager.announceToScreenReader(message, priority)
  }

  const focusElement = (selector) => {
    AccessibilityManager.focusElement(selector)
  }

  const trapFocus = (container) => {
    return AccessibilityManager.trapFocus(container)
  }

  return { announce, focusElement, trapFocus }
}

// Skip link component
export const SkipLink = ({ href = '#main', children = 'Skip to main content' }) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:shadow-lg"
      onFocus={(e) => {
        e.target.classList.remove('sr-only')
      }}
      onBlur={(e) => {
        e.target.classList.add('sr-only')
      }}
    >
      {children}
    </a>
  )
}

// Screen reader only text component
export const ScreenReaderOnly = ({ children }) => {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

// Page structure for better SEO
export const PageStructure = ({ 
  title,
  description,
  children,
  breadcrumbs = []
}) => {
  useSEO({ title, description })

  useEffect(() => {
    if (breadcrumbs.length > 0) {
      SEOManager.addBreadcrumbs(breadcrumbs)
    }
  }, [breadcrumbs])

  return (
    <main id="main" role="main" aria-label={title}>
      {children}
    </main>
  )
}

// Lighthouse optimization utilities
export const LighthouseOptimizer = {
  // Optimize images for better Core Web Vitals
  optimizeImage: (src, alt, width, height) => ({
    src,
    alt,
    width,
    height,
    loading: 'lazy',
    decoding: 'async',
    fetchPriority: 'auto'
  }),

  // Critical resource preloading
  preloadCriticalResources: () => {
    const criticalFonts = [
      '/fonts/inter-var.woff2'
    ]

    criticalFonts.forEach(font => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = font
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  },

  // Measure performance metrics
  measureCoreWebVitals: () => {
    if ('web-vitals' in window) {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = window.webVitals
      
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    }
  }
}