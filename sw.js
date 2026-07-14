const CACHE_NAME = 'ap-portfolio-v1468-god-mode';

const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/articles.html',
    '/resume.html',
    '/certificates.html',
    '/contact.html',
    '/games.html',
    '/assets/css/core/style.css',
    '/assets/css/features/intense_pack.css',
    '/assets/js/core/script.js',
    '/assets/js/core/particles.js',
    '/assets/js/features/terminal.js',
    '/assets/js/features/sound_haptics.js',
    '/assets/js/pages/resume.js',
    '/assets/js/data/resume_data.js',
    '/assets/css/core/cyber_theme.css',
    '/assets/js/ui/cyber_ui.js',
    '/assets/js/ui/evervault_portrait.js',
    '/manifest.json'
];

// Install: pre-cache assets individually so one failure doesn't break everything
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[ServiceWorker] Pre-caching core assets');
            // Use individual adds so one failure doesn't break the whole install
            return Promise.allSettled(
                PRECACHE_ASSETS.map(url =>
                    cache.add(url).catch(err => {
                        console.warn('[ServiceWorker] Failed to cache:', url, err);
                    })
                )
            );
        })
    );
});

// Activate: clear old caches and immediately claim all clients
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log('[ServiceWorker] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('/api/')) return;

    // Pass through Google Fonts — CORS/opaque response conflicts
    if (
        event.request.url.includes('fonts.googleapis.com') ||
        event.request.url.includes('fonts.gstatic.com') ||
        event.request.url.includes('cdnjs.cloudflare.com') ||
        event.request.url.includes('kit.fontawesome.com')
    ) return;

    // Pass through admin panel
    if (event.request.url.includes('/admin')) return;

    const url = new URL(event.request.url);
    const pathname = url.pathname;

    const isNavigation = event.request.mode === 'navigate' ||
                         pathname.endsWith('.html') ||
                         pathname === '/';

    if (isNavigation) {
        // NETWORK-FIRST for HTML pages: always try to get fresh HTML
        // Fall back to cache only if completely offline
        event.respondWith(
            fetch(event.request, { cache: 'no-cache' })
                .then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return networkResponse;
                })
                .catch(() => {
                    return caches.match(event.request, { ignoreSearch: true })
                        .then(cached => cached || caches.match('/index.html'));
                })
        );
    } else {
        // NETWORK-FIRST for all static assets (CSS, JS, images):
        // Try network first to always get fresh styles/scripts.
        // Fall back to cache (with ignoreSearch:true so ?v=XXXX variants still hit cache).
        event.respondWith(
            fetch(event.request)
                .then(networkResponse => {
                    if (
                        networkResponse &&
                        networkResponse.status === 200 &&
                        (networkResponse.type === 'basic' || networkResponse.type === 'cors')
                    ) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Network failed — serve from cache (ignore ?v= query string)
                    return caches.match(event.request, { ignoreSearch: true })
                        .then(cached => {
                            if (cached) return cached;
                            // Last resort: empty 200 response to avoid ERR_FAILED
                            return new Response('', { status: 200 });
                        });
                })
        );
    }
});

// Handle skipWaiting messages from the page
self.addEventListener('message', event => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
