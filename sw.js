const CACHE_NAME = 'ap-portfolio-v104-god-mode';

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
    '/assets/css/cyber_theme.css',
    '/assets/js/cyber_ui.js',
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

// Caching Strategy
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('/api/')) return;

    const url = event.request.url;
    const isDynamicContent = url.endsWith('.json') || url.endsWith('.md') || url.includes('/blogs/');

    if (isDynamicContent) {
        // Network-First for blogs/data (forces latest version, falls back to offline cache)
        event.respondWith(
            fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return networkResponse;
            }).catch(() => {
                return caches.match(event.request);
            })
        );
        return;
    }

    // Use Network-First strategy for everything to ensure immediate updates.
    // Falls back to offline cache if network fails.
    event.respondWith(
        fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
        }).catch(() => {
            return caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Fallback for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                return new Response('Network error happened and no cache available', { status: 408, headers: { 'Content-Type': 'text/plain' } });
            });
        })
    );
});
