const CACHE_NAME = 'ap-portfolio-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/articles.html',
    '/resume.html',
    '/certificates.html',
    '/contact.html',
    '/games.html',
    '/assets/css/style.css',
    '/assets/js/script.js',
    '/assets/js/particles.js',
    '/assets/js/logo_effect.js',
    '/assets/js/blog_logic.js',
    '/assets/js/experience_data.js',
    '/assets/js/projects_data.js',
    '/assets/js/skills_data.js',
    '/assets/images/profile.webp',
    '/manifest.json'
];

// Install Event - Precache all static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting(); // Force new service worker to activate immediately
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Take control of all open pages immediately
});

// Fetch Event - Network First, fallback to cache
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    
    // API requests always bypass cache completely
    if (event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});
