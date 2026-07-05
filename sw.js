const CACHE_NAME = 'ap-portfolio-v163-god-mode';

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

// Smart Caching Strategy
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('/api/')) return;
    
    // Bypass Google Fonts to prevent CORS/opaque response loading conflicts
    if (event.request.url.includes('fonts.googleapis.com') || event.request.url.includes('fonts.gstatic.com')) return;

    // Bypass Admin page completely to prevent caching out-of-sync panels
    if (event.request.url.includes('/admin') || event.request.url.includes('/admin.html')) return;

    const url = new URL(event.request.url);
    const pathname = url.pathname;
    const lastSlash = pathname.lastIndexOf('/');
    const lastDot = pathname.lastIndexOf('.');
    const hasExtension = lastDot !== -1 && lastDot > lastSlash;

    // Detect if request is for HTML page (including pretty URLs) or dynamic content
    const isHtmlOrDynamic = event.request.mode === 'navigate' ||
                            !hasExtension ||
                            pathname.endsWith('.html') ||
                            pathname.endsWith('.json') ||
                            pathname.endsWith('.md') ||
                            pathname.includes('/blogs/');

    if (isHtmlOrDynamic) {
        // Network-First strategy: Fetch fresh content from network, update cache, fallback to cache if offline
        event.respondWith(
            fetch(event.request, { cache: 'no-cache' }).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return networkResponse;
            }).catch(() => {
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) return cachedResponse;
                    // Fallback for navigation if offline and cache is empty
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                    return new Response('Offline content unavailable.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
                });
            })
        );
    } else {
        // Stale-While-Revalidate strategy for static assets (CSS, JS, images, fonts)
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(event.request).then(cachedResponse => {
                    const fetchPromise = fetch(event.request).then(networkResponse => {
                        if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Suppress background fetch errors when offline
                    });
                    return cachedResponse || fetchPromise;
                });
            })
        );
    }
});
