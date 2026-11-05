/* Learn v2 service worker — tulisan tangan (bukan Serwist/Workbox).
 *
 * Keputusan: SW tulisan tangan dipilih karena kebutuhan kami sederhana
 * (cache-first aset statis, network-first API, precache shell) — ~100 baris,
 * nol dependensi, nol integrasi build. Serwist (@serwist/next) butuh config
 * webpack khusus sementara Next 15 dev memakai Turbopack dan deploy memakai
 * next-on-pages; biaya integrasinya tidak sebanding untuk kasus ini.
 *
 * Strategi:
 *  - install : precache shell /v2 dan /v2/karier, lalu skipWaiting.
 *  - GET /_next/static/*, /v2/fonts/*, manifest, icon, *.css/js/woff2/svg/png
 *            -> cache-first (aset statis di-hash/di-versioning Next).
 *  - GET /api/* -> network-first, fallback ke cache bila offline.
 *  - navigasi (mode=navigate) -> network-first; bila gagal, sajikan cache,
 *    terakhir fallback ke shell /v2 yang di-precache (offline shell).
 *  - selain itu -> network-first dengan fallback cache.
 */
const CACHE = "learn-v2-v1";
const PRECACHE = ["/v2", "/v2/karier"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()) // offline saat install: tetap aktif
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/v2/fonts/") ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/v2/icon.svg" ||
    /\.(css|js|woff2?|svg|png|jpg|jpeg|webp|ico)$/i.test(url.pathname)
  );
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res && res.ok) cache.put(request, res.clone());
  return res;
}

async function networkFirst(request, { cacheable = true } = {}) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(request);
    if (cacheable && res && res.ok && request.method === "GET") cache.put(request, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(request);
    if (hit) return hit;
    throw err;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // CDN/fonts eksternal: biarkan browser

  if (request.mode === "navigate") {
    event.respondWith(
      networkFirst(request, { cacheable: true }).catch(async () => {
        const cache = await caches.open(CACHE);
        return (await cache.match(request)) || (await cache.match("/v2")) || Response.error();
      })
    );
    return;
  }
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  event.respondWith(networkFirst(request));
});
