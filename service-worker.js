const serverRoot = typeof SERVER_ROOT != "undefined" ? SERVER_ROOT : ""
const cacheName = typeof CACHE_NAME != "undefined" ? CACHE_NAME : "v1.0.0"

// files to be cached
const files = [
  "/",
  `${serverRoot}/css/loading.css`,
  `${serverRoot}/css/style.css`,
  `${serverRoot}/images/icons/android-192x192.png`,
  `${serverRoot}/images/icons/android-512x512.png`,
  `${serverRoot}/images/icons/apple-touch-icon.png`,
  `${serverRoot}/images/icons/favicon-16x16.png`,
  `${serverRoot}/images/icons/favicon-32x32.png`,
  `${serverRoot}/images/icons/favicon-48x48.png`,
  `${serverRoot}/images/icons/favicon-64x64.png`,
  `${serverRoot}/images/icons/msapplication-tile.png`,
  `${serverRoot}/images/nav/arrow-back.svg`,
  `${serverRoot}/images/nav/categories.svg`,
  `${serverRoot}/images/nav/home.svg`,
  `${serverRoot}/images/nav/more.svg`,
  `${serverRoot}/images/nav/search.svg`,
  `${serverRoot}/images/nav/tags.svg`,
  `${serverRoot}/images/logo.png`,
  `${serverRoot}/js/cache.js`,
  `${serverRoot}/js/content-provider.js`,
  `${serverRoot}/js/main.js`,
  `${serverRoot}/js/navigator.js`,
  `${serverRoot}/js/search.js`,
  `/manifest.json`
]

// listen for install event and cache all files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log("Using cache " + cacheName + ".")
        return cache.addAll(files)
          .then(() => {
            console.info("All files are cached.")
            return self.skipWaiting() // force the waiting sw to become the active one
          })
          .catch(err => {
            console.error("Failed to cache. ", err)
          })
      })
  )
})

// listen for install event and delete all the old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(cachesKeys => {
        return Promise.all(
          cachesKeys
            .filter(cache => {
              if (cache !== cacheName) {
                console.log("Deleted old cache " + cache + ".")
                console.log("Service worker correctly updated. Reload the page to load the new version of the app.")
                return true
              }
            })
            .map(cache => caches.delete(cache))
        )
      })
  )
})

// listen for fetch event and serve the cache
self.addEventListener('fetch', event => {
  // Do not use the service worker for /wp-*
  if (
    event.request.url.includes("/wp-admin") ||
    event.request.url.includes("/wp-login") ||
    event.request.url.includes("?rest_route=") ||
    event.request.url.includes("/service-worker.js")
  ) return console.log(`${event.request.url} skipped.`)
  // Else check in cache for matching
  event.respondWith(caches.match(event.request)
    .then(res => {
      // Cache hit - return response
      if (res) return res
      // Not in cache, fetch for Internet and cache it
      return fetch(event.request)
        .then(async res => {
          // Cache only valid basic responses (not cross-origin)
          if (res && res.status === 200 && res.type === "basic") {
            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = res.clone()
            await caches.open(cacheName)
              .then(cache => cache.put(event.request, responseToCache))
            console.log("Cached: " + event.request.url)
          }
          // In any case return the response
          return res
        })
    })
    .catch(() => {
      console.warn("Resource not found in cache nor online, using home: " + event.request.url)
      return caches.match("/")
    })
  )
})
