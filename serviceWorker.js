// files to be cached
const files = [
  "/",
  "/css/loading.css",
  "/css/style.css",
  "/images/icons/android-192x192.png",
  "/images/icons/android-512x512.png",
  "/images/icons/apple-touch-icon.png",
  "/images/icons/favicon-16x16.png",
  "/images/icons/favicon-32x32.png",
  "/images/icons/msapplication-tile.png",
  "/images/nav/arrow-back.svg",
  "/images/nav/categories.svg",
  "/images/nav/home.svg",
  "/images/nav/more.svg",
  "/images/nav/search.svg",
  "/images/nav/tags.svg",
  "/images/logo.svg",
  "/js/content-provider.js",
  "/js/install-sw.js",
  "/js/navigator.js",
  "/js/search.js",
  "/js/wordpress.js",
  "/favicon.ico",
  "/index.html",
  "/manifest.json"
]

const cacheName = "v0.1.0-alpha"

// listen for install event and cache all files
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("Using cache " + cacheName + ".")
      return cache.addAll(files)
        .then(() => {
          console.info("All files are cached.")
          return self.skipWaiting() // force the waiting sw to become the active one
        })
        .catch((error) =>  {
          console.error("Failed to cache. " + error)
        })
    })
  )
})

// listen for install event and delete all the old caches
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cachesKeys) {
      return Promise.all(
        cachesKeys.filter(function(cache) {
          if (cache !== cacheName) {
            console.log("Deleted old cache " + cache + ".")
            console.log("Service worker correctly updated. Reload the page to load the new version of the app.")
            return true
          }
        }).map(function(cache) {
          return caches.delete(cache)
        })
      )
    })
  )
})

// listen for fetch event and serve the cache
self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request)
    .then(function(response) {
      // Cache hit - return response
      if (response) return response
      // Not in cache, fetch for Internet and cache it
      return fetch(event.request)
        .then(function(response) {
          // Check if we received a valid response, in that case we will cache it
          if (response && response.status === 200) {
            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone()
            caches.open(cacheName)
              .then(cache => cache.put(event.request, responseToCache))
            console.log("Cached: " + event.request.url)
          }
          // In any case return the response
          return response
        })
    })
    .catch(function () {
      console.warn("Resource not found in cache nor online, using home: " + event.request.url)
      return caches.match("/")
    })
  )
})
