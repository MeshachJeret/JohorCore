const CACHE_NAME = 'causewayiq-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap'
];

fetch('http://localhost:8080/weather') // Make sure the PORT matches your server.js port
  .then(response => response.json())
  .then(data => {
    console.log("Data received:", data);
    // This is where you put the data into your HTML elements
    document.getElementById('weather-display').innerText = data.temp;
  })
  .catch(err => console.error("Fetch error:", err));
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

fetch('http://localhost:8080/weather') // Make sure the PORT matches your server.js port
  .then(response => response.json())
  .then(data => {
    console.log("Data received:", data);
    // This is where you put the data into your HTML elements
    document.getElementById('weather-display').innerText = data.temp;
  })
  .catch(err => console.error("Fetch error:", err));
