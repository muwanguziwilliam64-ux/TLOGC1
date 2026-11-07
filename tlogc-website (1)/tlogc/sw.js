var C="tlogc-v4",F=["index.html","about.html","photos.html","videos.html","forms.html","give.html","style.css","forms.js","manifest.json","icon-192.png","media.js","gallery.json","videos.json","admin.html","testimonies.html","testimonies.json"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(F)}))});
self.addEventListener("fetch",function(e){e.respondWith(fetch(e.request).then(function(r){var k=r.clone();caches.open(C).then(function(c){c.put(e.request,k)});return r}).catch(function(){return caches.match(e.request)}))});
