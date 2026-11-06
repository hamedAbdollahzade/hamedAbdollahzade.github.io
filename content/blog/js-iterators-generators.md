---
title: Iterator و Generator
description: Iterator و Generator؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 19
---

## Iterable و Iterator

- **Iterable**: آبجکتی که متد `[Symbol.iterator]()` داره. (آرایه، رشته، Map، Set، NodeList، arguments)
- **Iterator**: آبجکتی با متد `next()` که `{ value, done }` برمی‌گردونه.

```js
const arr = ["a", "b"];
const it = arr[Symbol.iterator]();
it.next();   // → { value: "a", done: false }
it.next();   // → { value: "b", done: false }
it.next();   // → { value: undefined, done: true }
```

چیزهایی که iterable رو می‌فهمن:
```js
for (const x of iterable) {}
[...iterable];
const [a, b] = iterable;
Array.from(iterable);
new Set(iterable); new Map(iterable);
Promise.all(iterable);
```

## ساخت Iterable سفارشی
```js
const range = {
  from: 1,
  to: 4,
  [Symbol.iterator]() {
    let cur = this.from;
    const end = this.to;
    return {
      next: () =>
        cur <= end
          ? { value: cur++, done: false }
          : { value: undefined, done: true },
    };
  },
};

[...range];                 // → [1, 2, 3, 4]
for (const n of range) {}   // کار می‌کنه
```

---

## Generator

تابعی که می‌تونه **متوقف** و بعداً **ادامه** پیدا کنه. با `function*` و `yield`.

```js
function* count() {
  console.log("شروع");
  yield 1;
  yield 2;
  return 3;
}

const g = count();      // هنوز هیچی اجرا نشده
g.next();   // چاپ "شروع" → { value: 1, done: false }
g.next();   // → { value: 2, done: false }
g.next();   // → { value: 3, done: true }
g.next();   // → { value: undefined, done: true }
```
> generator خودش یک **iterable** است:
```js
[...count()];   // → [1, 2]   (مقدار return در for...of/spread نمیاد)
```

### سازنده‌ی Iterable ساده
```js
const range2 = {
  from: 1, to: 4,
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) yield i;
  },
};
[...range2]; // → [1, 2, 3, 4]
```

### دنباله‌ی بی‌نهایت (Lazy)
```js
function* naturals() {
  let n = 1;
  while (true) yield n++;
}

function* take(it, n) {
  let i = 0;
  for (const v of it) {
    if (i++ >= n) return;
    yield v;
  }
}
[...take(naturals(), 5)];   // → [1, 2, 3, 4, 5]
```
فقط مقادیری که لازمه محاسبه می‌شه (**lazy evaluation**).

### Fibonacci
```js
function* fib() {
  let [a, b] = [0, 1];
  while (true) { yield a; [a, b] = [b, a + b]; }
}
[...take(fib(), 8)];   // → [0, 1, 1, 2, 3, 5, 8, 13]
```

### `yield*` (واگذاری به iterable دیگه)
```js
function* inner() { yield 2; yield 3; }
function* outer() { yield 1; yield* inner(); yield 4; }
[...outer()];   // → [1, 2, 3, 4]

// پیمایش درخت
function* walk(node) {
  yield node.value;
  for (const child of node.children ?? []) yield* walk(child);
}
```

### ارسال مقدار به داخل generator
```js
function* chat() {
  const name = yield "اسمت چیه؟";
  const age = yield `سلام ${name}، سنت؟`;
  return `${name} ${age} ساله است`;
}
const c = chat();
c.next();          // → { value: "اسمت چیه؟", done: false }
c.next("Ali");     // → { value: "سلام Ali، سنت؟", done: false }
c.next(30);        // → { value: "Ali 30 ساله است", done: true }
```

### `return()` و `throw()`
```js
const g2 = naturals();
g2.next();
g2.return("پایان");     // → { value: "پایان", done: true }  (generator بسته می‌شه)

function* safe() {
  try { yield 1; } catch (e) { console.log("گرفتم:", e); yield "recovered"; }
}
const s = safe();
s.next();
s.throw("oops");        // → چاپ "گرفتم: oops" و { value: "recovered", done: false }
```
`finally` داخل generator هنگام `break` در `for...of` اجرا می‌شه:
```js
function* res() {
  try { yield 1; yield 2; } finally { console.log("cleanup"); }
}
for (const v of res()) break;   // → cleanup
```

---

## Async Iterator و Async Generator

### `for await...of`
```js
async function* pages() {
  for (let p = 1; p <= 3; p++) {
    const res = await fetch(`/api/items?page=${p}`);
    yield await res.json();
  }
}

for await (const items of pages()) {
  console.log(items);
}
```
### Async iterable سفارشی
```js
const stream = {
  async *[Symbol.asyncIterator]() {
    yield "a";
    await new Promise((r) => setTimeout(r, 100));
    yield "b";
  },
};
for await (const x of stream) console.log(x);
```
### روی stream ها
```js
const res = await fetch(url);
for await (const chunk of res.body) { /* Uint8Array */ }
```

---

## Iterator Helpers (ES2025)
روی هر iterator متدهای شبیه آرایه، به‌صورت lazy:
```js
naturals().filter((n) => n % 2 === 0).map((n) => n * n).take(3).toArray();
// → [4, 16, 36]
// متدها: map, filter, take, drop, flatMap, reduce, toArray, forEach, some, every, find
Iterator.from([1, 2, 3]);
```

## کاربردها
- پیمایش تنبل داده‌های بزرگ.
- صفحه‌بندی (pagination) و stream.
- state machine ها.
- پایه‌ی `async/await` (در گذشته با کتابخانه‌هایی مثل `co`).

## تمرین
1. generator ای بنویس که اعداد اول رو یکی‌یکی تولید کنه.
2. تابع `zip(a, b)` بنویس که دو iterable رو lazy ترکیب کنه.
3. یک iterable بنویس که کاراکترهای رشته رو از آخر به اول بده.
