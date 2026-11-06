---
title: توابع و آبجکت‌های سراسری (Global)
description: توابع و آبجکت‌های سراسری (Global)؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 13
---

## توابع تبدیل و بررسی
```js
parseInt("42.9px");     // → 42
parseInt("0xFF", 16);   // → 255
parseInt("101", 2);     // → 5
parseFloat("3.14.15");  // → 3.14
isNaN("abc");           // → true  (اول تبدیل به عدد)
isFinite("12");         // → true
Number.isNaN("abc");    // → false (دقیق‌تر)
```

## Encode / Decode URL
```js
encodeURIComponent("a b&c=d/ف");   // → "a%20b%26c%3Dd%2F%D9%81"  (برای مقدار پارامتر)
decodeURIComponent("a%20b");       // → "a b"
encodeURI("https://x.com/a b?q=ف");// URL کامل رو encode می‌کنه ولی : / ? & = رو نه
decodeURI("%D9%81");               // → "ف"
```
بهتره برای query string:
```js
const url = new URL("https://example.com/search");
url.searchParams.set("q", "جاوا اسکریپت");
url.searchParams.append("page", 2);
url.toString();  // → https://example.com/search?q=...&page=2
new URLSearchParams({ a: 1, b: 2 }).toString(); // → "a=1&b=2"
```

## Base64
```js
btoa("hello");            // → "aGVsbG8="
atob("aGVsbG8=");         // → "hello"
// برای یونیکد:
btoa(String.fromCharCode(...new TextEncoder().encode("سلام")));
// Node: Buffer.from("سلام").toString("base64")
```

## تایمرها
```js
const t1 = setTimeout(() => console.log("بعد از ۱ ثانیه"), 1000);
clearTimeout(t1);

const t2 = setInterval(() => console.log("هر ثانیه"), 1000);
clearInterval(t2);

setTimeout((a, b) => console.log(a + b), 100, 1, 2);   // پاس دادن آرگومان

queueMicrotask(() => console.log("microtask"));
setImmediate?.(() => {});                     // فقط Node
requestAnimationFrame?.(() => {});            // فقط مرورگر (قبل از رندر بعدی)
```
نکته‌ی `setTimeout(fn, 0)`: بلافاصله اجرا نمی‌شه؛ بعد از پایان کد جاری و microtask ها. جزئیات: [Event Loop](/blog/js-async-javascript/).

## کپی عمیق
```js
const copy = structuredClone({ d: new Date(), s: new Set([1]), n: [1, 2] });
```
پشتیبانی: Date, Map, Set, RegExp, آرایه، object ساده، مرجع دایره‌ای. **نه:** توابع، کلاس‌های سفارشی (prototype از بین می‌ره)، DOM.

## `globalThis`
شیء سراسری در هر محیطی:
```js
globalThis;   // مرورگر: window ، Node: global
```

## Intl (بین‌المللی‌سازی)
```js
new Intl.NumberFormat("fa-IR").format(1234567.89);  // → "۱٬۲۳۴٬۵۶۷٫۸۹"
new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(9.5); // → "€9.50"
new Intl.NumberFormat("en", { notation: "compact" }).format(1500000);               // → "1.5M"
new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date());
new Intl.PluralRules("en").select(1);      // → "one"
new Intl.ListFormat("en", { type: "conjunction" }).format(["a", "b", "c"]); // → "a, b, and c"
new Intl.Collator("fa").compare("الف", "ب");     // برای sort رشته‌ها
new Intl.RelativeTimeFormat("en").format(-3, "day"); // → "3 days ago"
```

## Crypto و شناسه
```js
crypto.randomUUID();                       // → "3b241101-e2bb-4255-8caf-4136c566a962"
crypto.getRandomValues(new Uint8Array(4)); // عدد تصادفی امن
```

## Text Encoding
```js
const bytes = new TextEncoder().encode("سلام");   // → Uint8Array
new TextDecoder().decode(bytes);                  // → "سلام"
```

## AbortController
لغو درخواست یا کار طولانی:
```js
const ac = new AbortController();
fetch("/api", { signal: ac.signal }).catch((e) => console.log(e.name)); // → AbortError
setTimeout(() => ac.abort(), 100);

// ساده‌تر:
fetch("/api", { signal: AbortSignal.timeout(5000) });
```

## fetch (شبکه)
```js
const res = await fetch("https://api.example.com/users");
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
// سایر: res.text(), res.blob(), res.arrayBuffer(), res.formData()
```
جزئیات: [Async](/blog/js-async-javascript/).

## ذخیره‌سازی مرورگر
```js
localStorage.setItem("k", "v");  localStorage.getItem("k");
localStorage.removeItem("k");    localStorage.clear();
sessionStorage.setItem("k", "v");   // تا بستن تب
document.cookie = "a=1; max-age=3600; path=/";
```

## تایپ‌ها: Typed Arrays و ArrayBuffer
```js
const buf = new ArrayBuffer(8);
const view = new Uint8Array(buf);
view[0] = 255;
new Int32Array([1, 2, 3]);
new Float64Array(2);
// Int8Array, Uint8ClampedArray, Int16Array, Uint16Array, Uint32Array, Float32Array, BigInt64Array
```

## Eval و Function (نه!)
```js
eval("1 + 2");                       // → 3  ❌ ناامن، استفاده نکن
new Function("a", "b", "return a + b")(1, 2); // → 3  ❌ همینطور
```

## جدول سریع آبجکت‌های سراسری
| دسته | موارد |
|---|---|
| اولیه | `Object, Function, Boolean, Symbol, String, Number, BigInt, Math, Date, RegExp` |
| مجموعه‌ها | `Array, Map, Set, WeakMap, WeakSet, WeakRef` + Typed Arrays |
| کنترل | `Promise, Proxy, Reflect, JSON, Intl, Atomics, SharedArrayBuffer` |
| خطا | `Error, TypeError, RangeError, SyntaxError, ReferenceError, EvalError, URIError, AggregateError` |
| توابع | `parseInt, parseFloat, isNaN, isFinite, encodeURI(Component), decodeURI(Component), eval` |
| مقادیر | `undefined, NaN, Infinity, globalThis` |
