// Aura Service Worker
const CACHE_NAME = 'aura-v1';
const OFFLINE_URL = '/offline';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Aura: Caching essential assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Helper function to check if request is cacheable
function isCacheableRequest(request) {
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return false;
  
  // Skip chrome-extension and other non-http(s) schemes
  if (!url.protocol.startsWith('http')) return false;
  
  // Skip API requests
  if (url.pathname.startsWith('/api/')) return false;
  
  // Skip Supabase requests
  if (url.hostname.includes('supabase.co')) return false;
  
  // Skip authentication related
  if (url.pathname.includes('/auth/callback')) return false;
  
  return true;
}

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-cacheable requests
  if (!isCacheableRequest(event.request)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            try {
              cache.put(event.request, responseToCache);
            } catch (e) {
              console.warn('Cache put failed:', e);
            }
          });
        }

        return response;
      })
      .catch(async () => {
        // Try to get from cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          const offlinePage = await caches.match(OFFLINE_URL);
          if (offlinePage) return offlinePage;
        }

        // Return a basic offline response
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Yeni bir bildiriminiz var',
    icon: '/icons/icon.svg',
    badge: '/icons/icon.svg',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Aura', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-fortune-readings') {
    event.waitUntil(syncFortuneReadings());
  }
  if (event.tag === 'sync-journal-entries') {
    event.waitUntil(syncJournalEntries());
  }
});

async function syncFortuneReadings() {
  console.log('Syncing fortune readings...');
}

async function syncJournalEntries() {
  console.log('Syncing journal entries...');
}
