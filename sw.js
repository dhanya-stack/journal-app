const CACHE='my-notebook-shell-v1';
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['./','./index.html','./manifest.json']))));
self.addEventListener('fetch',event=>{if(event.request.method==='GET')event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)))});
