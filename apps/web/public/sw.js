/*
 * CareConnect service worker (dependency-free).
 * Strategy per the WEB_RESPONSIVE_PWA_PLAN:
 *   - App shell navigations → Network-First, fall back to cached shell, then /offline.html
 *   - Static assets (script/style/font/image) → Stale-While-Revalidate
 * The data layer is an in-memory mock, so there is no API to cache here yet;
 * a Network-First API route would slot into the fetch handler the same way.
 */
const VERSION = 'cc-web-v1'
const SHELL_CACHE = `${VERSION}-shell`
const ASSET_CACHE = `${VERSION}-assets`
const PRECACHE = ['/', '/offline.html', '/manifest.webmanifest', '/favicon.svg', '/icon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // App-shell navigations: Network-First → cached shell → offline page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(SHELL_CACHE).then((c) => c.put('/', copy))
          return res
        })
        .catch(async () => (await caches.match('/')) ?? caches.match('/offline.html'))
    )
    return
  }

  // Static assets: Stale-While-Revalidate.
  if (['script', 'style', 'font', 'image'].includes(request.destination)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        const network = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone())
            return res
          })
          .catch(() => cached)
        return cached ?? network
      })
    )
  }
})
