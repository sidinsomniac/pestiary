// Minimal service worker — required for PWA installability and TWA packaging.
// Strategy: network-first for API routes; cache-first for static assets.

const CACHE = "pestiary-v1";
const STATIC = ["/", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Always network-first for API routes — never serve stale triage results.
  if (url.pathname.startsWith("/api/")) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Cache-first for everything else (shell, assets).
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (res.ok && e.request.method === "GET") {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
