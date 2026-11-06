---
title: برنامه‌نویسی ناهمزمان (Async) و Event Loop
description: JavaScript تک‌رشته‌ای (single-threaded) است: در هر لحظه یک کد اجرا می‌شه. عملیات کند (شبکه، فایل، تایمر) به محیط (مرورگر/Node) سپرده می‌شه و نتیجه بعداً…
date: 2026-11-06
category: JavaScript
order: 22
---

JavaScript **تک‌رشته‌ای (single-threaded)** است: در هر لحظه یک کد اجرا می‌شه. عملیات کند (شبکه، فایل، تایمر) به محیط (مرورگر/Node) سپرده می‌شه و نتیجه بعداً برمی‌گرده.

## Event Loop

اجزا:
- **Call Stack**: کدی که الان در حال اجراست.
- **Web APIs / libuv**: تایمر، شبکه، DOM events (بیرون از موتور JS).
- **Macrotask Queue**: `setTimeout`, `setInterval`, رویدادهای UI/IO.
- **Microtask Queue**: `Promise.then`, `queueMicrotask`, `await`, `MutationObserver`.

الگوریتم:
1. یک task از stack اجرا می‌شه تا خالی بشه.
2. **همه‌ی microtask ها** اجرا می‌شن (تا صف کاملاً خالی بشه).
3. در صورت نیاز رندر.
4. **یک** macrotask بعدی.
5. تکرار.

```js
console.log("1");
setTimeout(() => console.log("2: timeout"), 0);
Promise.resolve().then(() => console.log("3: promise"));
queueMicrotask(() => console.log("4: microtask"));
console.log("5");
// → 1, 5, 3: promise, 4: microtask, 2: timeout
```
> sync اول، بعد microtask ها، بعد macrotask ها.

مسدود کردن loop:
```js
while (true) {}   // ❌ کل صفحه/سرور قفل می‌شه
```
کار سنگین رو به Web Worker / Worker Thread / تکه‌تکه کردن بسپار.

---

## ۱. Callback
```js
function readLater(cb) {
  setTimeout(() => cb(null, "data"), 100);
}
readLater((err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```
مشکل: **Callback Hell** (تودرتوی عمیق، مدیریت خطای تکراری):
```js
a(() => b(() => c(() => d(() => { /* ... */ }))));
```

---

## ۲. Promise

سه حالت: **pending** ← **fulfilled** (با مقدار) یا **rejected** (با خطا). فقط یک بار settle می‌شه.

### ساخت
```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    Math.random() > 0.5 ? resolve("موفق") : reject(new Error("ناموفق"));
  }, 100);
});

Promise.resolve(5);                    // از قبل fulfilled
Promise.reject(new Error("x"));        // از قبل rejected
```

### مصرف
```js
p.then((val) => console.log(val))
 .catch((err) => console.error(err.message))
 .finally(() => console.log("تمام"));
```
### زنجیره (Chaining)
هر `then` یک Promise **جدید** برمی‌گردونه. مقدار برگشتی به بعدی می‌ره؛ اگه Promise برگردونی، منتظرش می‌مونه:
```js
fetch("/user")
  .then((r) => r.json())
  .then((u) => fetch(`/posts/${u.id}`))
  .then((r) => r.json())
  .catch(console.error);
```
خطا در هر نقطه تا نزدیک‌ترین `catch` پایین می‌ره. `catch` اگه مقدار برگردونه، زنجیره از حالت خطا خارج می‌شه.

### Promisify
```js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(500);

import { promisify } from "node:util";
const readFileP = promisify(fs.readFile);
```

### متدهای ترکیبی

| متد | رفتار |
|---|---|
| `Promise.all([...])` | منتظر **همه**؛ با اولین خطا reject می‌شه |
| `Promise.allSettled([...])` | منتظر همه؛ هیچ‌وقت reject نمی‌شه (`{status, value/reason}`) |
| `Promise.race([...])` | نتیجه‌ی **اولین** settle شده (موفق یا خطا) |
| `Promise.any([...])` | **اولین موفق**؛ اگه همه fail → `AggregateError` |
| `Promise.withResolvers()` | (ES2024) `{ promise, resolve, reject }` |
| `Promise.try(fn)` | (ES2025) اجرای fn و تبدیل نتیجه/خطا به Promise |

```js
const [u, p] = await Promise.all([fetch("/u"), fetch("/p")]);   // موازی

const results = await Promise.allSettled([a(), b()]);
results.forEach((r) =>
  r.status === "fulfilled" ? console.log(r.value) : console.log(r.reason)
);

// timeout با race
const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);

const first = await Promise.any([fetch(mirror1), fetch(mirror2)]);
```

---

## ۳. async / await

قند نحوی روی Promise؛ کد ناهمزمان رو شبیه کد همزمان می‌نویسه.

```js
async function getUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();       // تابع async همیشه Promise برمی‌گردونه
  } catch (e) {
    console.error(e);
    throw e;
  }
}

getUser(1).then(console.log);
```
- `await` فقط داخل `async function` یا بالاترین سطح ماژول ESM.
- مقدار await شده می‌تونه Promise یا هر مقدار دیگه باشه.
- `return value` در async ≡ `return Promise.resolve(value)`.

### ترتیبی در برابر موازی ⭐
```js
// ❌ ترتیبی (کند): ۲ ثانیه
const a = await sleepAndReturn(1000);
const b = await sleepAndReturn(1000);

// ✅ موازی: ۱ ثانیه
const [a2, b2] = await Promise.all([sleepAndReturn(1000), sleepAndReturn(1000)]);

// شروع هر دو، بعد await
const pa = sleepAndReturn(1000);
const pb = sleepAndReturn(1000);
const x = await pa, y = await pb;
```

### حلقه با await
```js
// ترتیبی
for (const id of ids) {
  const u = await getUser(id);
}
// موازی
const users = await Promise.all(ids.map(getUser));

// ❌ forEach با async صبر نمی‌کنه
ids.forEach(async (id) => { await getUser(id); });
```

### محدود کردن همزمانی
```js
async function pool(tasks, limit) {
  const results = [];
  const running = new Set();
  for (const task of tasks) {
    const p = task().then((r) => { running.delete(p); return r; });
    running.add(p);
    results.push(p);
    if (running.size >= limit) await Promise.race(running);
  }
  return Promise.all(results);
}
```

### Retry با backoff
```js
async function retry(fn, tries = 3, delay = 500) {
  for (let i = 0; i < tries; i++) {
    try { return await fn(); }
    catch (e) {
      if (i === tries - 1) throw e;
      await sleep(delay * 2 ** i);
    }
  }
}
```

---

## لغو عملیات: AbortController
```js
const ac = new AbortController();
const promise = fetch("/slow", { signal: ac.signal });
ac.abort();    // promise با AbortError reject می‌شه

fetch("/x", { signal: AbortSignal.timeout(3000) });
```

## fetch در عمل
```js
const res = await fetch("/api/items", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ name: "x" }),
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```

## async iteration
```js
for await (const chunk of stream) {}
```
جزئیات: [Generators](/blog/js-iterators-generators/).

## Web Workers (کار سنگین بدون قفل کردن UI)
```js
// main.js
const w = new Worker("worker.js");
w.postMessage({ n: 40 });
w.onmessage = (e) => console.log(e.data);

// worker.js
onmessage = (e) => postMessage(fib(e.data.n));
```
در Node: `worker_threads`.

## خطاهای رایج
- فراموش کردن `await` (با Promise به‌جای مقدار کار می‌کنی).
- `async` در `forEach`.
- نگرفتن خطای Promise → `unhandledrejection`.
- await ترتیبی در حالی که می‌شد موازی باشه.
- مسدود کردن event loop با حلقه‌ی سنگین.

## پرسش مصاحبه: خروجی چیه؟
```js
async function a() { console.log("a1"); await b(); console.log("a2"); }
async function b() { console.log("b"); }
console.log("start");
a();
console.log("end");
// → start, a1, b, end, a2
```
دلیل: بعد از `await`، ادامه‌ی تابع به صف microtask می‌ره و اول کد sync جاری تموم می‌شه.
