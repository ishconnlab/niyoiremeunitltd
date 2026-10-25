/* eslint-env serviceworker */

/**
 * NIYO IREME UNIT COMPANY LTD ” service worker.
 *
 * Strategy
 *  - Navigations: network first, falling back to the cached app shell so the
 *    site still opens without a connection.
 *  - Same-origin static assets: stale-while-revalidate.
 *  - Third-party photography: cache first, with a bounded cache.
 *  - The waiting worker is activated on request from the update prompt.
 */

const VERSION = 'v1.0.0';
const STATIC_CACHE = `niyoireme-static-${VERSION}`;
const RUNTIME_CACHE = `niyoireme-runtime-${VERSION}`;
const IMAGE_CACHE = `niyoireme-images-${VERSION}`;
const IMAGE_CACHE_LIMIT = 60;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/offline.html',
  '/assets/brand/logo.svg',
  '/assets/brand/logo-dark.svg',
  '/assets/brand/logo-horizontal.svg',
  '/assets/brand/logo-horizontal-dark.svg',
  '/assets/brand/logo-mark.svg',
  '/assets/brand/favicon.svg',
  '/assets/brand/favicon.ico',
  '/assets/brand/icon-192.png',
  '/assets/brand/icon-512.png',
  '/assets/brand/maskable-192.png',
  '/assets/brand/maskable-512.png',
  '/assets/brand/apple-touch-icon.png',
  '/assets/brand/og-image.png',
  '/assets/brand/blueprint-construction.svg',
  '/assets/brand/blueprint-crane.svg',
  '/assets/brand/blueprint-excavator.svg',
  '/assets/brand/blueprint-section.svg',
  '/assets/brand/blueprint-siteplan.svg',
  '/assets/brand/blueprint-truss.svg',
  '/assets/brand/hero-blueprint.svg',
  '/assets/brand/loader-blueprint.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            await cache.add(new Request(url, { cache: 'reload' }));
          } catch (error) {
            // A single missing asset must not break the whole installation.
            console.warn('[sw] precache skipped', url, error);
          }
        })
      );
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith('niyoireme-') && ![STATIC_CACHE, RUNTIME_CACHE, IMAGE_CACHE].includes(key))
          .map((key) => caches.delete(key))
      );

      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }

      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const trimCache = async (cacheName, limit) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= limit) return;

  await Promise.all(keys.slice(0, keys.length - limit).map((key) => cache.delete(key)));
};

const cacheFirstImage = async (request) => {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') {
    await cache.put(request, response.clone());
    void trimCache(IMAGE_CACHE, IMAGE_CACHE_LIMIT);
  }
  return response;
};

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response.ok) {
        void cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    void network;
    return cached;
  }

  const response = await network;
  if (response) return response;

  return new Response('', { status: 504, statusText: 'Offline' });
};

const handleNavigation = async (event) => {
  try {
    const preload = await event.preloadResponse;
    if (preload) return preload;

    const response = await fetch(event.request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      void cache.put(event.request, response.clone());
    }
    return response;
  } catch {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = (await cache.match(event.request)) || (await cache.match('/index.html'));
    const shell = await caches.open(STATIC_CACHE);
    const fallback = (await shell.match('/index.html')) || (await shell.match('/offline.html'));

    return cached || fallback || Response.error();
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(event));
    return;
  }

  if (url.origin !== self.location.origin) {
    if (request.destination === 'image') {
      event.respondWith(cacheFirstImage(request));
    }
    return;
  }

  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

