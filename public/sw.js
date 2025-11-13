// Service Worker básico
self.addEventListener("install", (event) => {
  console.log("Service Worker instalado");
});

self.addEventListener("fetch", (event) => {
  // Dejar que las peticiones pasen normalmente
});
