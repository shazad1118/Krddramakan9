/* =====================================================
   KRDDramakan — Service Worker
   داتاکان کاش دەکات بۆ خێرایی و کارکردن بەبێ ئینتەرنێت
   ===================================================== */

const CACHE_NAME = "krd-dramakan-v1";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./json/drama.json",
  "./json/admin.json",
  "./json/icon.json"
];

/* دامەزراندن — فایلە ستاتیکەکان کاش بکە */
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

/* چالاکبوون — کاشی کۆن پاک بکە */
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* داوا — Cache First بۆ ستاتیک، Network First بۆ json داتا */
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);

  /* json/drama.json — هەمیشە لە نێتووەرک بهێنە (داتای زیندوو) */
  if (url.pathname.endsWith("drama.json") || url.pathname.includes("/api/")) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  /* هەموو شتێکی تر — Cache First */
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
