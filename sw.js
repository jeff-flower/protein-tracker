const VERSION = 'v1';
const CACHE_NAME = `protein-tracker-${VERSION}`;
const BASE_URL = '/protein-tracker';

const APP_STATIC_RESOURCES = [
    `${BASE_URL}/`,
    `${BASE_URL}/index.html`,
    `${BASE_URL}/style.css`,
    `${BASE_URL}/app.js`,
    `${BASE_URL}/proteintracker.json`,
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async() => {
      console.log("Install event: adding static resources");
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })()
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      console.log("Activate event: removing old caches")
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
  console.log("Fetch event listener started");
  if (e.request.mode === "navigate") {
    // Return to the index page
    console.log("Fetch event: get index page from cache");
    e.respondWith(caches.match("/"));
    return;
  }

  // For every other request type
  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(e.request.url);
      if (cachedResponse) {
        console.log(`Fetch event: found ${e.request.url}`);
        return cachedResponse;
      }

      // Respond with 404 if nothing found in cache
      console.log("Fetch event: couldn't find resource");
      return new Response(null, {statue: 404});
    })()
  );
});