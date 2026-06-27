const CACHE_NAME = 'ap-portfolio-v18-god-mode';

const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/articles.html',
    '/resume.html',
    '/certificates.html',
    '/contact.html',
    '/games.html',
    '/admin.html',
    '/assets/css/style.css',
    '/assets/css/intense_features/intense_pack.css',
    '/assets/js/script.js',
    '/assets/js/particles.js',
    '/assets/js/intense_features/terminal.js',
    '/assets/js/intense_features/sound_haptics.js',
    '/assets/js/resume.js',
    '/assets/js/resume_data.js',
    '/manifest.json'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[ServiceWorker] Pre-caching core assets');
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                          .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Stale-While-Revalidate Strategy
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('/api/')) return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                // Only cache successful, basic/cors GET requests
                if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Ignore network errors (offline)
            });

            // Return cached immediately if available, otherwise wait for network
            return cachedResponse || fetchPromise.then(res => {
                if (res) return res;
                // Only fallback to index.html for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                return new Response('Network error happened', { status: 408, headers: { 'Content-Type': 'text/plain' } });
            });
        })
    );
});
