// RAiDOS sw.js — injects COOP/COEP headers for WebLLM SharedArrayBuffer support
// Required on GitHub Pages which doesn't serve these headers by default

const CACHE_NAME = 'raidOS-v2';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // For cross-origin requests (HuggingFace model weights, CDN scripts)
  // just pass through — we can't modify their response headers
  if (url.origin !== location.origin) {
    e.respondWith(fetch(e.request));
    return;
  }

  // For same-origin requests, add cross-origin isolation headers
  e.respondWith(
    fetch(e.request).then(res => {
      const h = new Headers(res.headers);
      h.set('Cross-Origin-Opener-Policy',   'same-origin');
      h.set('Cross-Origin-Embedder-Policy', 'credentialless');
      h.set('Cross-Origin-Resource-Policy', 'cross-origin');
      return new Response(res.body, {
        status: res.status, statusText: res.statusText, headers: h
      });
    }).catch(() => fetch(e.request))
  );
});
