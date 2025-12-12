// Service Worker MEJORADO para Rutina Gym
const CACHE_NAME = "rutina-gym-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// Instalación - Cachear recursos esenciales
self.addEventListener("install", (event) => {
  console.log("🔄 Service Worker V2 instalado");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Cacheando recursos esenciales");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log("❌ Error cacheando:", error);
      })
  );
  self.skipWaiting(); // Forzar activación inmediata
});

// Estrategia mejorada: Network First con fallback a Cache
self.addEventListener("fetch", (event) => {
  // Solo manejar peticiones GET y del mismo origen
  if (event.request.method !== "GET") return;

  // Evitar extensiones de Chrome
  if (event.request.url.includes("chrome-extension")) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si la red funciona, actualizar cache y devolver respuesta
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Si falla la red, buscar en cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Para rutas SPA (React), devolver index.html
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }

          // Para otros recursos, devolver respuesta vacía
          return new Response("Offline", {
            status: 408,
            statusText: "Offline",
          });
        });
      })
  );
});

// Limpiar caches viejos
self.addEventListener("activate", (event) => {
  console.log("🧹 Service Worker V2 activado");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("🗑️ Eliminando cache viejo:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Tomar control inmediato de todas las pestañas
});
