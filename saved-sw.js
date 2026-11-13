const V="saved-v3",FILES=["./saved.html","./saved.webmanifest","./icons/saved-192.png","./icons/saved-512.png","./icons/saved-apple.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 if(r.mode==="navigate"){e.respondWith(caches.match("./saved.html").then(c=>{const net=fetch(r).then(res=>{if(res.ok&&u.pathname.endsWith("saved.html")){const cp=res.clone();caches.open(V).then(x=>x.put("./saved.html",cp))}return res}).catch(()=>c);return c||net}));return}
 e.respondWith(caches.match(r).then(c=>c||fetch(r)))});
