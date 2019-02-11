// files to be cached
const files = [
  '/',
  '/manifest.json',
  '/index.html',
  '/favicon.ico',
  '/css/style.css',
  '/js/install-sw.js',
  '/images/icons/android-192x192.png',
  '/images/icons/android-512x512.png',
  '/images/icons/apple-touch-icon.png',
  '/images/icons/favicon-16x16.png',
  '/images/icons/favicon-32x32.png',
  '/images/icons/msapplication-tile.png',
  '/images/category.svg',
  '/images/favorite.svg',
  '/images/home.svg',
  '/images/more.svg',
  '/images/search.svg'
];

const cacheName = "v0.1.0-alpha";

// listen for install event and cache all files
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("Using cache " + cacheName + ".");
      return cache.addAll(files)
        .then(() => {
          console.info("All files are cached.");
          return self.skipWaiting(); // force the waiting sw to become the active one
        })
        .catch((error) =>  {
          console.error("Failed to cache. " + error);
        })
    })
  );
});

// listen for install event and delete all the old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cachesKeys) {
      return Promise.all(
        cachesKeys.filter(function(cache) {
          if (cache !== cacheName) {
            console.log("Deleted old cache " + cache + ".")
            console.log("Service worker correctly updated. Reload the page to load the new version of the app.")
            return true;
          }
        }).map(function(cache) {
          return caches.delete(cache);
        })
      );
    })
  );
});

// listen for fetch event and serve the cache if required
self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        console.log("Resource not found in cache, loaded from web.");
        return response;
      }).catch(function () {
        console.error("Resource not found in cache nor online.");
        return caches.match('/');
      });
    }
  }));
});
