const cacheName = 'cachAssets-v1';
self.addEventListener('install', (event) => {
    console.log('[SW] Install:', event);
    self.skipWaiting();

    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                // console.log('cache:', cache)
                cache.addAll([
                    '/',
                    '/index.html',
                    '/css/main.css',
                    '/js/script.js',
                    '/manifest.json',
                    '/img/headphone.png',
                    '/img/wave-sound.png',
                    '/icons/android-chrome-144x144.png',
                    '/icons/favicon-32x32.png',
                    '/icons/favicon-16x16.png',
                    '/js/index.js',
                    '/js/database.js'
                ]);
            })
            .catch(error => {
                console.log('cache:', error)
            })

    );

});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activate:', event)
    event.waitUntil(clients.claim());

    // Delete all old caches after taking control
    event.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(cacheNames
            .filter(item => item !== cacheName)
            .map(item => caches.delete(item))
        );
    }));
})

// Cache with Network Fallback
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // console.log('Response: ', response)
                return response || fetch(event.request);
            })
            .catch((error) => {
                console.log('Match failed: ', error)
            })
    );

});