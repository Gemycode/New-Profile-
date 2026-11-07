// Image optimization utilities for better performance

/**
 * Optimize image loading with lazy loading and placeholder
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {object} options - Additional options
 * @returns {object} Optimized image props
 */
export const optimizeImage = (src, alt, options = {}) => {
  const {
    width = 'auto',
    height = 'auto',
    quality = 80,
    format = 'webp',
    placeholder = 'blur',
    priority = false,
    className = '',
    ...rest
  } = options

  // Convert Unsplash URLs to optimized versions
  const optimizedSrc = src.includes('unsplash.com') 
    ? `${src}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&q=${quality}&fm=${format}`
    : src

  return {
    src: optimizedSrc,
    alt,
    width,
    height,
    loading: priority ? 'eager' : 'lazy',
    className: `transition-opacity duration-300 ${className}`,
    onLoad: (e) => {
      e.target.style.opacity = '1'
    },
    onError: (e) => {
      e.target.style.display = 'none'
      console.warn('Image failed to load:', src)
    },
    style: {
      opacity: 0,
      transition: 'opacity 0.3s ease-in-out'
    },
    ...rest
  }
}

/**
 * Generate responsive image sources for different screen sizes
 * @param {string} baseSrc - Base image source
 * @param {object} sizes - Different sizes for responsive images
 * @returns {object} Responsive image configuration
 */
export const generateResponsiveImage = (baseSrc, sizes = {}) => {
  const defaultSizes = {
    mobile: 400,
    tablet: 800,
    desktop: 1200,
    large: 1600
  }

  const responsiveSizes = { ...defaultSizes, ...sizes }

  return {
    srcSet: Object.entries(responsiveSizes)
      .map(([breakpoint, width]) => {
        const optimizedSrc = baseSrc.includes('unsplash.com')
          ? `${baseSrc}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&q=80&fm=webp`
          : baseSrc
        return `${optimizedSrc} ${width}w`
      })
      .join(', '),
    sizes: '(max-width: 768px) 400px, (max-width: 1024px) 800px, (max-width: 1440px) 1200px, 1600px'
  }
}

/**
 * Preload critical images for better performance
 * @param {string[]} imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  })
}

/**
 * Generate blur placeholder for images
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Base64 blur placeholder
 */
export const generateBlurPlaceholder = (width = 400, height = 300) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  canvas.width = width
  canvas.height = height
  
  // Create a simple gradient placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f3f4f6')
  gradient.addColorStop(1, '#e5e7eb')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL('image/jpeg', 0.1)
}

/**
 * Lazy load images with intersection observer
 * @param {string} selector - CSS selector for images to lazy load
 */
export const initLazyLoading = (selector = 'img[data-src]') => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove('lazy')
          img.classList.add('loaded')
          observer.unobserve(img)
        }
      })
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    })

    document.querySelectorAll(selector).forEach(img => {
      imageObserver.observe(img)
    })
  }
}

/**
 * Optimize images for different use cases
 */
export const imageOptimization = {
  // Hero section images
  hero: (src) => optimizeImage(src, 'Hero image', {
    width: 1200,
    height: 800,
    quality: 90,
    priority: true,
    className: 'w-full h-full object-cover'
  }),

  // Portfolio project images
  portfolio: (src) => optimizeImage(src, 'Portfolio project', {
    width: 800,
    height: 600,
    quality: 85,
    className: 'w-full h-56 object-cover rounded-t-3xl'
  }),

  // Profile images
  profile: (src) => optimizeImage(src, 'Profile image', {
    width: 400,
    height: 400,
    quality: 90,
    className: 'w-full h-full object-cover rounded-full'
  }),

  // Thumbnail images
  thumbnail: (src) => optimizeImage(src, 'Thumbnail', {
    width: 300,
    height: 200,
    quality: 80,
    className: 'w-full h-full object-cover'
  })
}

export default {
  optimizeImage,
  generateResponsiveImage,
  preloadImages,
  generateBlurPlaceholder,
  initLazyLoading,
  imageOptimization
}
