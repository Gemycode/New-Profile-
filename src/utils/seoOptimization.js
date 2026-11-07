// SEO optimization utilities for better search engine visibility

/**
 * Generate structured data for different content types
 */
export const structuredData = {
  // Person schema for portfolio
  person: (data) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": data.name,
    "jobTitle": data.jobTitle,
    "description": data.description,
    "url": data.url,
    "image": data.image,
    "sameAs": data.socialLinks,
    "knowsAbout": data.skills,
    "alumniOf": data.education,
    "worksFor": data.company,
    "address": data.address,
    "email": data.email,
    "telephone": data.phone
  }),

  // Organization schema
  organization: (data) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "logo": data.logo,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": data.phone,
      "contactType": "customer service",
      "email": data.email
    }
  }),

  // Project/Work schema
  project: (data) => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": data.title,
    "description": data.description,
    "url": data.url,
    "image": data.image,
    "author": {
      "@type": "Person",
      "name": data.author
    },
    "dateCreated": data.dateCreated,
    "dateModified": data.dateModified,
    "keywords": data.technologies,
    "programmingLanguage": data.technologies
  }),

  // Article schema for blog posts
  article: (data) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.description,
    "image": data.image,
    "author": {
      "@type": "Person",
      "name": data.author
    },
    "publisher": {
      "@type": "Organization",
      "name": data.publisher,
      "logo": data.publisherLogo
    },
    "datePublished": data.datePublished,
    "dateModified": data.dateModified,
    "mainEntityOfPage": data.url
  })
}

/**
 * Generate meta tags for better SEO
 */
export const generateMetaTags = (data) => {
  const {
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    author,
    publishedTime,
    modifiedTime
  } = data

  return {
    title: `${title} | Abdullah Gamal - Full-Stack Developer`,
    description,
    keywords: keywords?.join(', '),
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url,
    'og:type': type,
    'og:site_name': 'Abdullah Gamal Portfolio',
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:creator': '@abdullah_gamal',
    'article:author': author,
    'article:published_time': publishedTime,
    'article:modified_time': modifiedTime
  }
}

/**
 * Generate sitemap data
 */
export const generateSitemap = (pages) => {
  const baseUrl = 'https://abdullahgamal.com'
  
  return pages.map(page => ({
    url: `${baseUrl}${page.path}`,
    lastmod: page.lastModified || new Date().toISOString(),
    changefreq: page.changeFrequency || 'monthly',
    priority: page.priority || 0.8
  }))
}

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = (baseUrl) => {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Block admin areas
Disallow: /admin/
Disallow: /api/

# Allow search engines to crawl assets
Allow: /assets/
Allow: /images/
Allow: /css/
Allow: /js/`
}

/**
 * SEO optimization for images
 */
export const optimizeImageSEO = (imageData) => {
  const {
    src,
    alt,
    title,
    caption,
    width,
    height
  } = imageData

  return {
    src,
    alt: alt || 'Image description',
    title: title || alt,
    width,
    height,
    loading: 'lazy',
    decoding: 'async',
    // Add structured data for images
    'data-schema': JSON.stringify({
      "@type": "ImageObject",
      "url": src,
      "caption": caption,
      "width": width,
      "height": height
    })
  }
}

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbs = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}

/**
 * Performance and SEO monitoring
 */
export const seoMonitoring = {
  // Check for missing alt tags
  checkImageAltTags: () => {
    const images = document.querySelectorAll('img')
    const missingAlt = Array.from(images).filter(img => !img.alt)
    
    if (missingAlt.length > 0) {
      console.warn(`Found ${missingAlt.length} images without alt tags`)
      return missingAlt
    }
    return []
  },

  // Check for proper heading hierarchy
  checkHeadingHierarchy: () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const issues = []
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName[1])
      const prevLevel = index > 0 ? parseInt(headings[index - 1].tagName[1]) : 0
      
      if (level > prevLevel + 1) {
        issues.push({
          element: heading,
          issue: `Heading level ${level} follows level ${prevLevel} (should be ${prevLevel + 1})`
        })
      }
    })
    
    return issues
  },

  // Check for duplicate content
  checkDuplicateContent: () => {
    const titles = document.querySelectorAll('title')
    const descriptions = document.querySelectorAll('meta[name="description"]')
    
    const titleTexts = Array.from(titles).map(t => t.textContent)
    const descriptionTexts = Array.from(descriptions).map(d => d.content)
    
    return {
      duplicateTitles: titleTexts.filter((title, index) => titleTexts.indexOf(title) !== index),
      duplicateDescriptions: descriptionTexts.filter((desc, index) => descriptionTexts.indexOf(desc) !== index)
    }
  }
}

/**
 * Social media optimization
 */
export const socialMediaOptimization = {
  // Generate Open Graph tags
  generateOpenGraph: (data) => {
    return {
      'og:title': data.title,
      'og:description': data.description,
      'og:image': data.image,
      'og:url': data.url,
      'og:type': data.type || 'website',
      'og:site_name': data.siteName || 'Abdullah Gamal Portfolio',
      'og:locale': data.locale || 'en_US'
    }
  },

  // Generate Twitter Card tags
  generateTwitterCard: (data) => {
    return {
      'twitter:card': data.cardType || 'summary_large_image',
      'twitter:site': data.site || '@abdullah_gamal',
      'twitter:creator': data.creator || '@abdullah_gamal',
      'twitter:title': data.title,
      'twitter:description': data.description,
      'twitter:image': data.image,
      'twitter:image:alt': data.imageAlt || data.title
    }
  },

  // Generate LinkedIn specific tags
  generateLinkedInTags: (data) => {
    return {
      'linkedin:owner': data.owner,
      'linkedin:title': data.title,
      'linkedin:description': data.description,
      'linkedin:image': data.image
    }
  }
}

/**
 * Accessibility and SEO helpers
 */
export const accessibilitySEO = {
  // Generate ARIA labels
  generateAriaLabel: (element, context) => {
    const labels = {
      button: `Button: ${context}`,
      link: `Link to ${context}`,
      image: `Image: ${context}`,
      heading: `Heading: ${context}`
    }
    
    return labels[element] || context
  },

  // Check for proper focus management
  checkFocusManagement: () => {
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    
    return Array.from(focusableElements).map(el => ({
      element: el,
      hasTabIndex: el.hasAttribute('tabindex'),
      isVisible: el.offsetParent !== null,
      hasAriaLabel: el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')
    }))
  }
}

export default {
  structuredData,
  generateMetaTags,
  generateSitemap,
  generateRobotsTxt,
  optimizeImageSEO,
  generateBreadcrumbs,
  seoMonitoring,
  socialMediaOptimization,
  accessibilitySEO
}
