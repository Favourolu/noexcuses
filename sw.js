const CACHE_NAME = ‘noexcuse-v1’;
const ASSETS = [
‘/noexcuses/’,
‘/noexcuses/index.html’,
‘/noexcuses/login.html’,
‘/noexcuses/register.html’,
‘/noexcuses/dashboard.html’,
‘/noexcuses/partner.html’,
‘/noexcuses/privacy.html’,
‘/noexcuses/favicon.ico’,
‘/noexcuses/favicon-32x32.png’,
‘/noexcuses/favicon-16x16.png’,
‘/noexcuses/apple-touch-icon.png’,
‘/noexcuses/android-chrome-192x192.png’,
‘/noexcuses/android-chrome-512x512.png’
];

self.addEventListener(‘install’, function(e) {
e.waitUntil(
caches.open(CACHE_NAME).then(function(cache) {
return cache.addAll(ASSETS);
})
);
self.skipWaiting();
});

self.addEventListener(‘activate’, function(e) {
e.waitUntil(
caches.keys().then(function(keys) {
return Promise.all(
keys.filter(function(k) { return k !== CACHE_NAME; })
.map(function(k) { return caches.delete(k); })
);
})
);
self.clients.claim();
});

self.addEventListener(‘fetch’, function(e) {
e.respondWith(
fetch(e.request)
.then(function(res) {
const clone = res.clone();
caches.open(CACHE_NAME).then(function(cache) {
cache.put(e.request, clone);
});
return res;
})
.catch(function() {
return caches.match(e.request);
})
);
});
