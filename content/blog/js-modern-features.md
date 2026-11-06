---
title: قابلیت‌های مدرن (ES2015 تا ES2025)
description: قابلیت‌های مدرن (ES2015 تا ES2025)؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 25
---

## ES2015 (ES6)
`let/const`، arrow function، class، template literal، destructuring، spread/rest، default params، Promise، Map/Set، Symbol، generator، ماژول، `for...of`، object shorthand، computed property.
```js
const o = { name, [`k${1}`]: 1, method() {} };
```

## ES2016
```js
2 ** 3;                    // → 8
[1, 2, 3].includes(2);     // → true
```

## ES2017
```js
async function f() { await x; }
Object.entries({ a: 1 });  // → "a", 1
Object.values({ a: 1 });   // → [1]
"5".padStart(3, "0");      // → "005"
Object.getOwnPropertyDescriptors(obj);
function g(a, b,) {}       // trailing comma در پارامترها
```

## ES2018
```js
const { a, ...rest } = { a: 1, b: 2 };     // rest در object
const merged = { ...x, ...y };              // spread در object
for await (const v of asyncIterable) {}
promise.finally(() => {});
/(?<year>\d{4})/.exec("2024").groups.year;  // named groups
/(?<=\$)\d+/;                               // lookbehind
/./s;                                       // dotAll
```

## ES2019
```js
[1, [2, [3]]].flat(Infinity);
[1, 2].flatMap((x) => [x, x * 2]);
Object.fromEntries("a", 1);
"  hi ".trimStart();
try {} catch {}                  // catch بدون پارامتر
Symbol("x").description;
```

## ES2020
```js
const big = 12345678901234567890n;            // BigInt
a ?? b;                                       // nullish coalescing
obj?.prop?.[0]?.();                           // optional chaining
Promise.allSettled([p1, p2]);
globalThis;
const m = await import("./m.js");             // dynamic import
for (const m of "a1b2".matchAll(/\d/g)) {}
export * as ns from "./m.js";
```

## ES2021
```js
a ||= 1;  a &&= 2;  a ??= 3;                  // logical assignment
"a-b".replaceAll("-", "+");
Promise.any([p1, p2]);
1_000_000;                                    // numeric separator
new WeakRef(obj);
```

## ES2022
```js
class A {
  #priv = 1;                    // فیلد خصوصی
  static count = 0;             // فیلد استاتیک
  static { A.ready = true; }    // static block
  #m() {}                       // متد خصوصی
  has(o) { return #priv in o; } // بررسی خصوصی
}
[1, 2, 3].at(-1);               // → 3
Object.hasOwn(o, "x");
await fetch(url);               // top-level await
new Error("x", { cause: err });
/a/d.exec("a").indices;         // match indices
```

## ES2023
```js
[3, 1, 2].toSorted();           // بدون تغییر آرایه‌ی اصلی
[1, 2].toReversed();
[1, 2, 3].toSpliced(1, 1);
[1, 2, 3].with(0, 9);
[1, 2, 3].findLast((x) => x < 3);
[1, 2, 3].findLastIndex((x) => x < 3);
// #!shebang در فایل اسکریپت
// Symbol به‌عنوان کلید WeakMap
```

## ES2024
```js
Object.groupBy(items, (i) => i.type);
Map.groupBy(items, (i) => i.type);
Promise.withResolvers();        // { promise, resolve, reject }
"abc".isWellFormed();
const buf = new ArrayBuffer(8, { maxByteLength: 16 }); buf.resize(12);
/[\p{L}--[a-z]]/v;              // flag v: عملیات روی مجموعه‌ی کاراکتر
Atomics.waitAsync;
```

## ES2025
```js
// متدهای Set
new Set([1, 2]).union(new Set([2, 3]));
new Set([1, 2]).intersection(new Set([2, 3]));
// Iterator helpers
Iterator.from([1, 2, 3, 4]).filter((x) => x % 2).map((x) => x * 10).toArray();
// import attributes
import cfg from "./c.json" with { type: "json" };
// Promise.try
Promise.try(() => mightThrowSyncOrAsync());
// RegExp.escape
RegExp.escape("a.b*c");
// Float16Array و Math.f16round
```

## Stage 3 / در حال ورود
- **Temporal API** — جایگزین Date: `Temporal.Now.plainDateISO()`, `Temporal.ZonedDateTime`.
- **Decorators** (`@log method() {}`).
- **Explicit Resource Management**: `using file = openFile();` (آزادسازی خودکار با `Symbol.dispose`).
- **Records & Tuples** (`#{a: 1}`) — هنوز نامطمئن.
- **Pipeline operator** (`x |> f |> g`).
- **Pattern Matching**.
- **Array.fromAsync**.

```js
// Array.fromAsync
const arr = await Array.fromAsync(asyncGenerator());

// using (resource management)
{
  using conn = await db.connect();   // در پایان بلوک conn[Symbol.dispose]() صدا زده می‌شه
}
```

## ابزارهای کاربردی مدرن

### `structuredClone`
```js
const copy = structuredClone(complexObject);
```

### `Intl`
```js
new Intl.NumberFormat("fa-IR").format(12345);
```

### `AbortSignal.any / timeout`
```js
fetch(url, { signal: AbortSignal.any([ac.signal, AbortSignal.timeout(5000)]) });
```

### `URL` و `URLSearchParams`
```js
const u = new URL("https://a.com/p?x=1");
u.searchParams.get("x");   // → "1"
URL.canParse("http://x");  // → true
```

### `Array.prototype` ترکیبی
```js
const total = items
  .filter((i) => i.active)
  .map((i) => i.price * i.qty)
  .reduce((a, b) => a + b, 0);
```

## چک‌لیست ماژولار برای کد مدرن
- [ ] `const`/`let` به‌جای `var`
- [ ] `===` و `??` و `?.`
- [ ] `async/await` به‌جای callback
- [ ] ESM (`import/export`)
- [ ] `Object.hasOwn`, `.at()`, `structuredClone`
- [ ] متدهای غیرمتغیر آرایه (`toSorted`, `with`)
- [ ] فیلدهای `#private` در class
- [ ] `AbortController` برای لغو
- [ ] TypeScript برای پروژه‌های بزرگ

> برای بررسی پشتیبانی مرورگرها: caniuse.com و MDN (developer.mozilla.org).
