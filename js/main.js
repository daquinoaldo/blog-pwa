const nav = new Navigator()

// Install service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
    .then(reg => console.info("Service worker registered."))
    .catch(err => console.error('Service worker error: ', err))
}