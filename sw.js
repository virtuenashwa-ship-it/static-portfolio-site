const CACHE_NAME = 'apex-store-cache-v1';
const assetsToCache = [
    './index.html',
    './style.css',
    './script.js'
];

// Install event: cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching static assets');
            return cache.addAll(assetsToCache);
        })
    );
});

// Fetch event: serve cached assets when offline or loading
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});