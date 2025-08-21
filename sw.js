const VERSION = 'v1';
const CACHE_NAME = `protein-tracker-${VERSION}`;

const APP_STATIC_RESOURCES = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/proteintracker.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async() => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })()
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const cache_names = await caches.keys();

      await Promise.all(
        cache_names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }

          return undefined
        })
      );

      await clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (e) => {
  console.log("sw fetch listener");
  if (e.request.mode === "navigate") {
    // Return to the index page
    console.log("sw index page");
    e.respondWith(caches.match("/"));
    return;
  }

  // For every other request type
  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(e.request.url);
      if (cachedResponse) {
        console.log(`Found ${e.request.url}`);
        return cachedResponse;
      }

      // Respond with 404 if nothing found in cache
      return new Response(null, {statue: 404});
    })()
  );
});