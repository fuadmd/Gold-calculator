const CACHE_NAME = 'gold-price-v2'; // تغيير الإصدار هنا يجبر المتصفح على التحديث
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  // إجبار الـ Service Worker الجديد على أن يصبح نشطاً فوراً
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  // حذف التخزين المؤقت القديم
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  // السيطرة على جميع الصفحات المفتوحة فوراً
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
