// Saved: offline app shell. Scope is ./saved.html so it never clashes with other apps in the folder.
const V="saved-v1",SHELL=["./saved.html","./saved.webmanifest","./icons/saved-192.png","./icons/saved-512.png","./icons/saved-apple.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("saved-")&&x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!=="GET")return;
 if(u.origin===location.origin){
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put("./saved.html",cp));return res}).catch(()=>caches.match("./saved.html")));return}
  e.respondWith(caches.match(r).then(h=>h||fetch(r)));return}
 if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
  e.respondWith(caches.open(V).then(c=>c.match(r).then(h=>{const n=fetch(r).then(res=>{c.put(r,res.clone());return res}).catch(()=>h);return h||n})))}});
