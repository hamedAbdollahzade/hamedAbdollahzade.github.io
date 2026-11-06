---
title: Web APIها
description: APIهایی که مرورگر به JavaScript می‌ده. (DOM و رویدادها: DOM؛ async: Async)
date: 2026-11-06
category: مسیر فرانت‌اند
order: 16
---

APIهایی که مرورگر به JavaScript می‌ده. (DOM و رویدادها: [DOM](/blog/js-dom-and-events/)؛ async: [Async](/blog/js-async-javascript/))

> همیشه پشتیبانی مرورگر را چک کن (caniuse / MDN) و feature detection بزن.

## Fetch
```js
const res = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Ali" }),
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);   // fetch برای 404 هم reject نمی‌کنه!
const data = await res.json();
```
لغو درخواست:
```js
const ctrl = new AbortController();
fetch(url, { signal: ctrl.signal });
ctrl.abort();
AbortSignal.timeout(5000);        // timeout
```

## Storage
| | ظرفیت | ماندگاری | به سرور می‌ره؟ |
|---|---|---|---|
| `localStorage` | ~۵MB | دائمی | ❌ |
| `sessionStorage` | ~۵MB | تا بستن تب | ❌ |
| Cookie | ~۴KB | تنظیم‌پذیر | ✅ هر درخواست |
| IndexedDB | زیاد | دائمی | ❌ |
| Cache API | زیاد | دائمی | ❌ (برای service worker) |

```js
localStorage.setItem("theme", "dark");
localStorage.getItem("theme");
localStorage.setItem("user", JSON.stringify({ a: 1 }));   // فقط رشته
```
- داده‌ی حساس (token) را در localStorage نذار (در برابر XSS آسیب‌پذیر): [احراز هویت](/blog/roadmap-authentication/).
- IndexedDB (غیرهمزمان، شیء‌محور) — با کتابخانه‌ی `idb` ساده‌تره.

## URL و History
```js
const url = new URL("https://a.com/p?x=1&y=2#top");
url.searchParams.get("x");       // "1"
url.searchParams.set("z", "3");

history.pushState({ id: 1 }, "", "/page/1");   // تغییر URL بدون reload
window.addEventListener("popstate", e => {});
```
پایه‌ی routing در SPA.

## IntersectionObserver (دیده‌شدن المان)
```js
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } });
}, { threshold: 0.2 });
document.querySelectorAll(".lazy").forEach(el => io.observe(el));
```
کاربردها: lazy load، infinite scroll، انیمیشن ورود.

## ResizeObserver و MutationObserver
```js
new ResizeObserver(entries => console.log(entries[0].contentRect.width)).observe(el);
new MutationObserver(m => console.log(m)).observe(el, { childList: true, subtree: true });
```

## Clipboard
```js
await navigator.clipboard.writeText("متن");     // نیازمند HTTPS و تعامل کاربر
const t = await navigator.clipboard.readText();
```

## Geolocation
```js
navigator.geolocation.getCurrentPosition(
  pos => console.log(pos.coords.latitude, pos.coords.longitude),
  err => console.error(err.message),
);
```
نیازمند اجازه‌ی کاربر و HTTPS.

## Notifications و Permissions
```js
const perm = await Notification.requestPermission();
if (perm === "granted") new Notification("سلام!", { body: "پیام" });
const st = await navigator.permissions.query({ name: "geolocation" });
```

## Web Workers
اجرای کد سنگین بدون مسدود کردن UI:
```js
// main.js
const w = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
w.postMessage({ n: 40 });
w.onmessage = e => console.log(e.data);
// worker.js
self.onmessage = e => { self.postMessage(fib(e.data.n)); };
```
Worker به DOM دسترسی ندارد.

## Canvas و گرافیک
```js
const ctx = document.querySelector("canvas").getContext("2d");
ctx.fillStyle = "tomato";
ctx.fillRect(10, 10, 100, 50);
```
SVG برای گرافیک برداری؛ **WebGL / WebGPU** برای سه‌بعدی.

## Media
```js
const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
video.srcObject = stream;
```
Audio API، MediaRecorder، WebRTC (تماس همتا به همتا)، Picture-in-Picture.

## WebSocket و SSE
```js
const ws = new WebSocket("wss://example.com/chat");
ws.onopen = () => ws.send("سلام");
ws.onmessage = e => console.log(e.data);

const es = new EventSource("/events");     // Server-Sent Events: یک‌طرفه سرور ← کلاینت
es.onmessage = e => console.log(e.data);
```

## سایر APIها
- **Web Share** `navigator.share({ title, url })`
- **File API / Drag & Drop**: `<input type="file">`, `FileReader`, `URL.createObjectURL`
- **Page Visibility** `document.visibilityState`
- **Intl**: قالب‌بندی تاریخ/عدد/زبان (`Intl.DateTimeFormat("fa-IR")`)
- **Performance API** `performance.now()`, `PerformanceObserver`
- **BroadcastChannel**: ارتباط بین تب‌ها
- **requestAnimationFrame** برای انیمیشن، **requestIdleCallback**
- **Custom Elements و Shadow DOM** ([pwa-service-workers](/blog/roadmap-pwa-service-workers/) و [Web Components](/blog/html-modern-elements-and-web-components/))

## Web Components
```js
class UserCard extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });          // Shadow DOM: استایل ایزوله
    root.innerHTML = `<style>p{color:tomato}</style><p>${this.getAttribute("name")}</p>`;
  }
}
customElements.define("user-card", UserCard);   // نام باید خط‌تیره داشته باشد
```
```html
<user-card name="سارا"></user-card>
```
`<template>` و `<slot>` هم بخشی از آن‌هاست. قابل استفاده در هر فریم‌ورکی.

## تمرین
۱. lazy load تصاویر با IntersectionObserver.
۲. دکمه‌ی «کپی» که متن را در clipboard می‌گذارد.
۳. یک Web Worker که محاسبه‌ی سنگین انجام دهد و UI یخ نزند.
