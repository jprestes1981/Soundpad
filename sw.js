// Soundpad JP — funciona offline
const VERSION="soundpad-v1";
const SHELL=["./","./index.html","./manifest.webmanifest","./apple-touch-icon.png","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin===location.origin){
    // app: rede primeiro (pega atualizações), cache se estiver offline
    e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put(req,c));return r;}).catch(()=>caches.match(req).then(r=>r||caches.match("./index.html"))));
  }else if(/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    // fontes: cache primeiro
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{const c=res.clone();caches.open(VERSION).then(x=>x.put(req,c));return res;})));
  }
});
