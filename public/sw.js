const CACHE_NAME = 'portfolio-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/images/logo.jpg',
  '/manifest.json'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
            .map(cacheName => caches.delete(cacheName))
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Skip external requests (Firebase, etc.)
  if (!request.url.startsWith(self.location.origin)) return
  
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response
        }
        
        return fetch(request)
          .then(fetchResponse => {
            // Don't cache if not a valid response
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse
            }
            
            // Cache dynamic content
            const responseToCache = fetchResponse.clone()
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseToCache))
            
            return fetchResponse
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/index.html')
            }
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm())
  }
})

// Sync contact form submissions
async function syncContactForm() {
  try {
    const db = await openDB()
    const tx = db.transaction(['pending-contacts'], 'readonly')
    const store = tx.objectStore('pending-contacts')
    const contacts = await store.getAll()
    
    for (const contact of contacts) {
      try {
        // Try to submit to Firebase
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contact.data)
        })
        
        // Remove from pending if successful
        const deleteTx = db.transaction(['pending-contacts'], 'readwrite')
        const deleteStore = deleteTx.objectStore('pending-contacts')
        await deleteStore.delete(contact.id)
      } catch (error) {
        console.log('Still offline, will retry later')
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Helper to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('portfolio-db', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('pending-contacts')) {
        db.createObjectStore('pending-contacts', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}