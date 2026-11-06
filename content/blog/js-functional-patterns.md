---
title: الگوهای تابعی (Functional Patterns)
description: الگوهای تابعی (Functional Patterns)؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 23
---

## اصول
- **Pure function:** بدون اثر جانبی، خروجی فقط وابسته به ورودی.
- **Immutability:** داده رو تغییر نده، نسخه‌ی جدید بساز.
- **First-class & Higher-order functions.**
- **Declarative:** «چی» می‌خوای رو بگو، نه «چطور».

```js
// imperative
const out = [];
for (const n of nums) if (n % 2 === 0) out.push(n * 2);
// declarative
const out2 = nums.filter((n) => n % 2 === 0).map((n) => n * 2);
```

## Compose و Pipe
```js
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);       // چپ → راست
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);// راست → چپ

const trim = (s) => s.trim();
const lower = (s) => s.toLowerCase();
const slugify = pipe(trim, lower, (s) => s.replace(/\s+/g, "-"));
slugify("  Hello World JS ");   // → "hello-world-js"
```
نسخه‌ی async:
```js
const pipeAsync = (...fns) => (x) => fns.reduce((p, f) => p.then(f), Promise.resolve(x));
```

## Currying
تبدیل `f(a, b, c)` به `f(a)(b)(c)`:
```js
const curry = (fn) =>
  function curried(...args) {
    return args.length >= fn.length
      ? fn.apply(this, args)
      : (...more) => curried.apply(this, [...args, ...more]);
  };

const add = curry((a, b, c) => a + b + c);
add(1)(2)(3);   // → 6
add(1, 2)(3);   // → 6
add(1)(2, 3);   // → 6

const map = curry((fn, arr) => arr.map(fn));
const double = map((x) => x * 2);
double([1, 2, 3]);   // → [2, 4, 6]
```

## Partial Application
```js
const partial = (fn, ...preset) => (...later) => fn(...preset, ...later);
const greet = (g, name) => `${g}, ${name}`;
const hello = partial(greet, "سلام");
hello("Ali");   // → "سلام, Ali"
```
(یا `fn.bind(null, ...preset)`.)

## Memoization
```js
const memoize = (fn, keyFn = (...a) => JSON.stringify(a)) => {
  const cache = new Map();
  return (...args) => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);
    const val = fn(...args);
    cache.set(key, val);
    return val;
  };
};

const slowSquare = (n) => { for (let i = 0; i < 1e7; i++); return n * n; };
const fast = memoize(slowSquare);
fast(9);   // کند
fast(9);   // فوری (cache)

// Fibonacci سریع
const fib = memoize((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2)));
fib(70);   // → 190392490709135  (بالاتر از ~78 از محدوده‌ی عدد امن خارج می‌شه؛ برای اون‌ها BigInt)
```
> فقط برای توابع **pure**. مراقب رشد بی‌پایان cache باش (`WeakMap` یا LRU).

## Debounce ⭐
فقط وقتی اجرا کن که **N میلی‌ثانیه از آخرین فراخوانی گذشته**. برای جستجوی زنده، resize:
```js
const debounce = (fn, ms) => {
  let t;
  const wrapped = (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
  wrapped.cancel = () => clearTimeout(t);
  return wrapped;
};

input.addEventListener("input", debounce((e) => search(e.target.value), 300));
```

## Throttle ⭐
حداکثر **یک بار در هر N میلی‌ثانیه** اجرا کن. برای scroll، mousemove:
```js
const throttle = (fn, ms) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
};
window.addEventListener("scroll", throttle(() => console.log("scroll"), 200));
```

## Once
```js
const once = (fn) => {
  let done = false, result;
  return (...args) => (done ? result : ((done = true), (result = fn(...args))));
};
const init = once(() => console.log("فقط یک بار"));
init(); init();
```

## Negate / Flip / Tap / Identity
```js
const not = (pred) => (...a) => !pred(...a);
const flip = (fn) => (a, b, ...r) => fn(b, a, ...r);
const tap = (fn) => (x) => (fn(x), x);          // اثر جانبی داخل pipe
const identity = (x) => x;
```

## Immutability
```js
const frozen = Object.freeze([1, 2, 3]);
const deepFreeze = (o) => {
  Object.values(o).forEach((v) => typeof v === "object" && v !== null && deepFreeze(v));
  return Object.freeze(o);
};

// به‌روزرسانی بدون تغییر
const user = { name: "A", tags: ["x"] };
const updated = { ...user, name: "B", tags: [...user.tags, "y"] };
const arr2 = [1, 2, 3].with(1, 99);   // ES2023
```

## Functor / Monad ساده (Maybe)
```js
const Maybe = (v) => ({
  map: (fn) => (v == null ? Maybe(null) : Maybe(fn(v))),
  getOrElse: (d) => (v == null ? d : v),
});
Maybe({ a: { b: 5 } })
  .map((o) => o.a)
  .map((a) => a.b)
  .getOrElse(0);   // → 5
Maybe(null).map((x) => x.y).getOrElse("هیچی");   // → "هیچی"
```
(در عمل امروز `?.` و `??` همین کار رو می‌کنن.)

## Transducer / Lazy pipeline
```js
function* lazyMap(it, f) { for (const x of it) yield f(x); }
function* lazyFilter(it, p) { for (const x of it) if (p(x)) yield x; }
```
از زنجیره‌ی `.map().filter()` روی آرایه‌های خیلی بزرگ آرایه‌ی میانی نمی‌سازه.

## Observer / Pub-Sub
```js
class Emitter {
  #h = new Map();
  on(e, fn) { (this.#h.get(e) ?? this.#h.set(e, new Set()).get(e)).add(fn); return () => this.off(e, fn); }
  off(e, fn) { this.#h.get(e)?.delete(fn); }
  emit(e, ...a) { this.#h.get(e)?.forEach((fn) => fn(...a)); }
}
const bus = new Emitter();
const unsub = bus.on("msg", (t) => console.log(t));
bus.emit("msg", "سلام");
unsub();
```

## الگوی Module و Singleton
```js
export const store = (() => {
  let state = {};
  const subs = new Set();
  return {
    get: () => state,
    set(patch) { state = { ...state, ...patch }; subs.forEach((f) => f(state)); },
    subscribe: (f) => (subs.add(f), () => subs.delete(f)),
  };
})();
```

## تمرین
1. `pipe` رو طوری بنویس که ورودی‌های async رو هم پشتیبانی کنه.
2. `debounce` با گزینه‌ی `leading` (اجرا در شروع) بنویس.
3. یک `memoize` با محدودیت اندازه (LRU) پیاده کن.
4. `curry` رو برای تابعی با پارامتر پیش‌فرض تست کن؛ چرا `fn.length` گمراه‌کننده است؟
