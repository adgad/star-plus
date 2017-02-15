var cacheName = 'star-plus-filter';
var filesToCache = [
	'/star-plus',
	'/star-plus/index.html',
	'/star-plus/dramatic.mp3',
	'/star-plus/build/js/main.min.js'
];

self.addEventListener('install', function(e) {
	//Install worker and cache all the things
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('activate', function(e) {
	e.waitUntil(
		caches.keys().then(function(keyList) {
			//Remove old cache
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName) {
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.open(cacheName).then(function(cache) {
			//stale-while-revalidate caching
      return cache.match(event.request).then(function(response) {
        var fetchPromise = fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        return response || fetchPromise;
      })
    })
	);
});