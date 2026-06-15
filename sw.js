const CACHE_NAME = 'duitku-v1'
const ASSETS = [
  '/duitku/',
  '/duitku/index.html'
]

// Install — cache assets
self.addEventListener('install', e => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  )
})

// Activate — delete old cache
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// Fetch — network first, fallback cache
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone))
        return res
      })
      .catch(() => caches.match(e.request))
  )
})

// Auto update — notify client bila ada version baru
self.addEventListener('message', e => {
  if(e.data === 'skipWaiting') self.skipWaiting()
})
