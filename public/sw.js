// CollabSpace Service Worker
// Provides offline support, caching, and background sync

const CACHE_NAME = 'collabspace-v1';
const STATIC_CACHE = 'collabspace-static-v1';
const DYNAMIC_CACHE = 'collabspace-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/login',
  '/manifest.json',
  '/favicon.ico',
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Network first, fallback to cache
  networkFirst: async (request) => {
    try {
      const response = await fetch(request);
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      return cached || new Response('Offline', { status: 503 });
    }
  },

  // Cache first, fallback to network
  cacheFirst: async (request) => {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      return new Response('Offline', { status: 503 });
    }
  },

  // Stale while revalidate
  staleWhileRevalidate: async (request) => {
    const cached = await caches.match(request);
    
    const fetchPromise = fetch(request).then((response) => {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then((c) => c.put(request, response.clone()));
      return response;
    });

    return cached || fetchPromise;
  },
};

// Install event
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('📦 Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );

  // Skip waiting and activate immediately
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated');

  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('🗑️ Service Worker: Removing old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );

  // Claim all clients
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Chrome extensions and other origins
  if (!url.origin.includes(self.location.origin)) return;

  // API requests - Network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(CACHE_STRATEGIES.networkFirst(request));
    return;
  }

  // Static assets - Cache first
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff)$/) ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(CACHE_STRATEGIES.cacheFirst(request));
    return;
  }

  // Pages - Stale while revalidate
  event.respondWith(CACHE_STRATEGIES.staleWhileRevalidate(request));
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync:', event.tag);

  if (event.tag === 'sync-documents') {
    event.waitUntil(syncDocuments());
  }
});

// Sync offline document changes
async function syncDocuments() {
  try {
    // Get pending changes from IndexedDB
    const db = await openDB();
    const pendingChanges = await db.getAll('pending-changes');

    for (const change of pendingChanges) {
      await fetch('/api/documents/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(change),
      });

      await db.delete('pending-changes', change.id);
    }

    console.log('✅ Service Worker: Documents synced');
  } catch (error) {
    console.error('❌ Service Worker: Sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('📬 Service Worker: Push received');

  const data = event.data?.json() || {};
  const title = data.title || 'CollabSpace';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data.url || '/dashboard',
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Service Worker: Notification clicked');

  event.notification.close();

  if (event.action === 'dismiss') return;

  const urlToOpen = event.notification.data || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if app is already open
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Helper: Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('collabspace-offline', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-changes')) {
        db.createObjectStore('pending-changes', { keyPath: 'id' });
      }
    };
  });
}

console.log('🚀 CollabSpace Service Worker loaded');
