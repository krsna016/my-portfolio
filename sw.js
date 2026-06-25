const CACHE_NAME = 'ap-portfolio-v1';
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
    '/assets/images/profile.jpg',
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

// Fetch Event - Serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Only intercept GET requests
    if (event.request.method !== 'GET') return;
    
    // API requests bypass the service worker cache (so admin edits are live)
    if (event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found
                if (response) {
                    return response;
                }
                
                // Otherwise fetch from network
                return fetch(event.request).then(
                    function(networkResponse) {
                        // Check if valid response
                        if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clone and cache the new response dynamically (optional, but good for unseen assets)
                        var responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                );
            }).catch(() => {
                // If offline and request fails, fallback to index.html for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});
