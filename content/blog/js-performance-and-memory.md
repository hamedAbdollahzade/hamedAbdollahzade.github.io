---
title: عملکرد (Performance) و مدیریت حافظه
description: عملکرد (Performance) و مدیریت حافظه؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 26
---

## اندازه‌گیری اول، بهینه‌سازی بعد
> «بهینه‌سازی زودرس ریشه‌ی همه‌ی بدی‌هاست.» — Knuth

```js
console.time("sort");
bigArray.sort();
console.timeEnd("sort");

const t0 = performance.now();
work();
console.log(`${(performance.now() - t0).toFixed(2)}ms`);

performance.mark("a"); work(); performance.mark("b");
performance.measure("work", "a", "b");
```
ابزارها: **Chrome DevTools** (Performance، Memory، Lighthouse)، `node --prof`، `node --inspect`، `clinic.js`.

## مدیریت حافظه

### چرخه‌ی عمر
تخصیص → استفاده → آزادسازی (توسط **Garbage Collector**).
GC با الگوریتم **Mark & Sweep**: هر چیزی که از «ریشه‌ها» (global, stack) قابل دسترسی نباشه پاک می‌شه.

### نشت حافظه (Memory Leak)

۱. متغیر سراسری ناخواسته
```js
function f() { leaked = [1, 2, 3]; }   // بدون let/const → global (در strict خطا)
```
۲. Listener و تایمر فراموش‌شده
```js
const id = setInterval(tick, 1000);
// حتماً: clearInterval(id)

const handler = () => {};
el.addEventListener("click", handler);
// قبل از حذف el: el.removeEventListener("click", handler)
// یا { signal } با AbortController
```
۳. Closure که داده‌ی بزرگ نگه می‌داره
```js
function make() {
  const big = new Array(1e6);
  return () => big.length;       // big تا زنده بودن تابع آزاد نمی‌شه
}
```
۴. cache بی‌انتها
```js
const cache = {};                          // ❌ بی‌حد رشد می‌کنه
const cacheOk = new WeakMap();             // ✅ با GC پاک می‌شه
// یا LRU با سقف مشخص
```
۵. ارجاع به عناصر DOM حذف‌شده
```js
let detached = document.getElementById("x");
document.body.removeChild(detached);   // اگه detached رو نگه داری، حافظه آزاد نمی‌شه
detached = null;
```

### یافتن نشت
DevTools ← Memory ← **Heap snapshot** (قبل و بعد از عملیات مقایسه کن) ← Allocation timeline.

---

## بهینه‌سازی کد

### الگوریتم و ساختار داده
```js
// ❌ O(n²)
arr.forEach((x) => other.includes(x));
// ✅ O(n)
const set = new Set(other);
arr.forEach((x) => set.has(x));

// lookup با Map/Object به‌جای find روی آرایه
const byId = new Map(users.map((u) => [u.id, u]));
byId.get(5);
```

### حلقه‌ها
```js
// طول رو در حلقه‌ی داغ cache کن (مزیت ناچیز در موتورهای مدرن، ولی بی‌ضرره)
for (let i = 0, n = arr.length; i < n; i++) {}
// زنجیره‌ی map/filter/reduce روی داده‌ی خیلی بزرگ: یک پاس با reduce یا generator
```

### رشته‌ها
```js
// ❌ الحاق در حلقه‌ی خیلی بزرگ
let s = ""; for (const part of items) s += part;
// ✅
const parts = []; for (const part of items) parts.push(part); const s2 = parts.join("");
```

### آرایه
- `push/pop` سریع‌ان، `shift/unshift` کند (O(n)).
- آرایه‌ی «holey» (`new Array(1000)`) کندتره؛ از `Array.from`/`fill` استفاده کن.
- آرایه‌ی یکنواخت (فقط عدد) بهینه‌تر از آرایه‌ی ترکیبی.
- داده‌ی عددی سنگین: Typed Arrays.

### شکل Object ثابت (Hidden Classes)
موتور V8 برای object هایی با **شکل یکسان** کد بهینه می‌سازه:
```js
// ✅ همیشه با همان ترتیب ویژگی بساز
const mk = (x, y) => ({ x, y });
// ❌ اضافه/حذف پویا ویژگی و delete
delete obj.x;   // به‌جاش obj.x = undefined / null
```

### جلوگیری از کار تکراری
- `memoize` برای توابع pure.
- محاسبه‌ی سنگین رو بیرون حلقه ببر.
- regex رو بیرون حلقه بساز.

---

## بهینه‌سازی DOM
```js
// ❌ تغییر پشت سر هم
for (let i = 0; i < 1000; i++) list.appendChild(makeLi());
// ✅ یک‌جا
const frag = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) frag.append(makeLi());
list.append(frag);

// ❌ Layout Thrashing: خواندن و نوشتن متناوب
els.forEach((e) => { e.style.width = e.offsetWidth + 10 + "px"; });
// ✅ اول همه رو بخون، بعد بنویس
const widths = els.map((e) => e.offsetWidth);
els.forEach((e, i) => { e.style.width = widths[i] + 10 + "px"; });
```
- انیمیشن با `transform`/`opacity` و CSS به‌جای `top/left`.
- `requestAnimationFrame` برای به‌روزرسانی‌های بصری.
- **Virtual scrolling** برای لیست‌های طولانی.
- `debounce` / `throttle` برای رویدادهای پرتکرار.
- `IntersectionObserver` برای lazy load.
- listener های `{ passive: true }` برای scroll/touch.

## بهینه‌سازی بارگذاری
- Code splitting با `import()`.
- Tree shaking (ESM + باندلر).
- Minify و gzip/brotli.
- `defer` / `async` برای script ها، `type="module"`.
- Cache و CDN، تصاویر بهینه (WebP/AVIF).
- Core Web Vitals: **LCP، INP، CLS**.

## کار سنگین خارج از رشته‌ی اصلی
- **Web Workers** / `worker_threads`.
- تکه‌تکه کردن کار با `setTimeout`/`scheduler.postTask`/`requestIdleCallback`:
```js
async function processChunks(items, size = 1000) {
  for (let i = 0; i < items.length; i += size) {
    items.slice(i, i + size).forEach(heavy);
    await new Promise((r) => setTimeout(r));   // فرصت به UI/event loop
  }
}
```
- `OffscreenCanvas`، WebAssembly برای محاسبات خیلی سنگین.

## Big-O یادآوری

| عملیات | پیچیدگی |
|---|---|
| دسترسی به اندیس آرایه | O(1) |
| `push` / `pop` | O(1) |
| `shift` / `unshift` / `splice` | O(n) |
| `includes` / `indexOf` / `find` | O(n) |
| `Set.has` / `Map.get` | O(1) میانگین |
| `sort` | O(n log n) |
| حلقه‌ی تودرتو | O(n²) |

## چک‌لیست
- [ ] اول اندازه بگیر (profiler).
- [ ] ساختار داده‌ی مناسب (Map/Set).
- [ ] listener/timer ها رو پاک کن.
- [ ] کارهای DOM رو دسته‌ای کن.
- [ ] کار سنگین رو به Worker بده.
- [ ] باندل رو کوچیک نگه دار و lazy load کن.
- [ ] نشت حافظه رو با Heap Snapshot بررسی کن.
