/* Saved - service worker.
   Opens instantly from the cache, but when you are online it fetches the newest saved.html first
   (waits at most 2.5 s), so updates show up on the next open without touching this file.
   Change V only when you replace the icons or the manifest. */
const V = "saved-v6";
const PAGE = "./saved.html";
const EXTRA = ["./saved.webmanifest", "./icons/saved-192.png", "./icons/saved-512.png", "./icons/saved-512-maskable.png", "./icons/saved-apple.png"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    await c.add(PAGE);                                   // required
    await Promise.allSettled(EXTRA.map(u => c.add(u)));  // optional: a missing file never blocks install
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("saved-") && k !== V) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;              // YouTube, Supabase, fonts... are never touched

  if (r.mode === "navigate") { e.respondWith(openPage(e, r, u)); return; }
  e.respondWith(caches.match(r).then(c => c || fetch(r)));
});

async function openPage(e, r, u) {
  const cached = await caches.match(PAGE);
  const net = fetch(r).then(res => {
    if (!res.ok) return null;
    if (u.pathname.endsWith("saved.html")) { const cp = res.clone(); caches.open(V).then(c => c.put(PAGE, cp)); }
    return res;
  }).catch(() => null);
  e.waitUntil(net);
  if (!cached) return (await net) || Response.error();
  const slow = new Promise(ok => setTimeout(() => ok(null), 2500));
  return (await Promise.race([net, slow])) || cached;
}
