---
title: PWA و Service Worker
description: Progressive Web App: سایتی که با فناوری‌های وب تجربه‌ای شبیه اپ ارائه می‌ده: نصب‌شدنی، کارکردن آفلاین، سریع، اعلان.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 17
---

**Progressive Web App**: سایتی که با فناوری‌های وب تجربه‌ای شبیه اپ ارائه می‌ده: نصب‌شدنی، کارکردن آفلاین، سریع، اعلان.

## الزامات
۱. **HTTPS** (یا localhost)
۲. **Web App Manifest**
۳. **Service Worker** (با handler برای fetch در بعضی مرورگرها برای نصب)
۴. ریسپانسیو و سریع

## Manifest
```json
// manifest.webmanifest
{
  "name": "برنامه‌ی من",
  "short_name": "اپ من",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1a73e8",
  "lang": "fa",
  "dir": "rtl",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```
```html
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#1a73e8" />
```
`display`: `standalone` (بدون نوار مرورگر)، `fullscreen`، `minimal-ui`، `browser`.

## Service Worker
اسکریپتی که در پس‌زمینه و جدا از صفحه اجرا می‌شه و **پروکسی شبکه** است. DOM ندارد، فقط روی HTTPS، رویداد‌محور و غیرهمزمان.

### ثبت
```js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    const reg = await navigator.serviceWorker.register("/sw.js");
    console.log("scope:", reg.scope);
  });
}
```

### چرخه‌ی عمر
`register` → **install** → (waiting) → **activate** → کنترل fetchها
```js
// sw.js
const CACHE = "app-v1";
const ASSETS = ["/", "/index.html", "/style.css", "/app.js", "/offline.html"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();                       // فعال شدن بدون انتظار
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(hit => hit ?? fetch(e.request).catch(() => caches.match("/offline.html")))
  );
});
```

## استراتژی‌های Cache
| استراتژی | رفتار | مناسب |
|---|---|---|
| **Cache First** | اول cache، وگرنه شبکه | فایل‌های استاتیک و فونت |
| **Network First** | اول شبکه، وگرنه cache | داده‌های تازه (API، HTML) |
| **Stale-While-Revalidate** | cache فوری + به‌روزرسانی در پس‌زمینه | تصاویر، داده‌های نیمه‌پویا |
| **Network Only** | فقط شبکه | پرداخت، عملیات حساس |
| **Cache Only** | فقط cache | دارایی‌های precache شده |

```js
// Stale-While-Revalidate
self.addEventListener("fetch", e => {
  e.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(e.request);
    const network = fetch(e.request).then(res => { cache.put(e.request, res.clone()); return res; });
    return cached || network;
  }));
});
```

## به‌روزرسانی
- مرورگر هر بار فایل `sw.js` را بررسی می‌کنه؛ اگر حتی یک بایت فرق کند، نسخه‌ی جدید نصب می‌شه ولی تا بسته‌شدن تب‌های قدیمی در حالت waiting می‌ماند.
- نسخه‌ی cache (`app-v2`) را عوض کن و قدیمی‌ها را در activate پاک کن.
- به کاربر پیام «نسخه‌ی جدید آماده است» بده.

## قابلیت‌های بیشتر
- **Push Notifications**: `PushManager.subscribe()` + سرور Push + رویداد `push` در SW
- **Background Sync**: ارسال درخواست‌های آفلاین وقتی اینترنت برگشت
- **Periodic Sync**، **Badging**، **Share Target**، **File Handling**
- نصب: رویداد `beforeinstallprompt`:
```js
let deferred;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; installBtn.hidden = false; });
installBtn.onclick = () => deferred.prompt();
```

## ابزار
- **Workbox** (Google): کتابخانه‌ی آماده‌ی استراتژی‌ها و precache
- **vite-plugin-pwa**: ساخت manifest و SW خودکار در Vite
- DevTools ← Application: Service Workers, Manifest, Cache Storage, «Offline», Lighthouse ← PWA

```js
// با Workbox
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
registerRoute(({ request }) => request.destination === "image", new StaleWhileRevalidate({ cacheName: "images" }));
```

## نکات و خطاها
- SW را اشتباه cache نکن؛ `sw.js` باید `Cache-Control: no-cache` داشته باشد.
- از cache کردن پاسخ‌های POST/API حساس خودداری کن.
- scope: SW فقط مسیر خودش و زیرمسیرها را کنترل می‌کند (پس در ریشه بگذار).
- برای دیباگ: «Update on reload» و «Bypass for network» در DevTools.

## تمرین
۱. سایت ساده‌ات را PWA کن (manifest + SW) و در Lighthouse بررسی کن.
۲. صفحه‌ی `offline.html` نشان بده وقتی اینترنت قطع است.
۳. استراتژی Stale-While-Revalidate را برای تصاویر پیاده کن.
