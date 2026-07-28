/*
 * CareConnect service worker (dependency-free).
 * Strategy per the WEB_RESPONSIVE_PWA_PLAN:
 *   - App shell navigations → Network-First, fall back to cached shell, then /offline.html
 *   - Static assets (script/style/font/image) → Stale-While-Revalidate
 * The data layer is an in-memory mock, so there is no API to cache here yet;
 * a Network-First API route would slot into the fetch handler the same way.
 *
 * BUILD and HASHED_ASSETS are injected at build time by the inline Vite plugin
 * in vite.config.ts (keep each marker line intact and single-line). In dev the
 * file stays valid as-is; the SW is only registered in production builds.
 */
const BUILD = 'dev' /* @build */
const HASHED_ASSETS = [] /* @assets */

const VERSION = `cc-web-${BUILD}`
const SHELL_CACHE = `${VERSION}-shell`
const ASSET_CACHE = `${VERSION}-assets`
const SHELL_PRECACHE = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon.svg',
  '/icon-maskable.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_PRECACHE)),
      // Hashed build assets go in the asset cache so the fetch handler's
      // cache.match(request) finds them offline on first navigation.
      caches.open(ASSET_CACHE).then((cache) => cache.addAll(HASHED_ASSETS))
    ]).then(() => self.skipWaiting())
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
  // Every client route serves the same index.html and lets the in-app router
  // resolve the path, so we must NOT pass a host 404 straight through. A 404/500
  // is still a *resolved* response (the .catch only fires on network failure),
  // so treat any non-OK navigation as a miss and fall back to the cached shell —
  // otherwise a deep-link refresh (e.g. /medications) shows the host's
  // "Not Found" page. Only an OK response is cached as the shell, so a 404 can
  // never poison it.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (!res.ok) throw new Error(`navigation ${res.status}`)
          const copy = res.clone()
          caches.open(SHELL_CACHE).then((c) => c.put('/', copy))
          return res
        })
        .catch(async () => (await caches.match('/')) ?? (await caches.match('/offline.html')))
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
