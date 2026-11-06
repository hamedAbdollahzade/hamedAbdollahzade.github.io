---
title: Destructuring، Spread و Rest
description: Destructuring، Spread و Rest؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 16
---

## Array Destructuring
```js
const [a, b] = [10, 20];          // a=10, b=20
const [x, , z] = [1, 2, 3];       // رد کردن عنصر دوم → x=1, z=3
const [first, ...others] = [1, 2, 3, 4];   // others → [2, 3, 4]
const [p = 5, q = 6] = [1];       // مقدار پیش‌فرض → p=1, q=6
```
### جابه‌جایی بدون متغیر موقت
```js
let m = 1, n = 2;
[m, n] = [n, m];   // m=2, n=1
```
### از تابع
```js
const [min, max] = [Math.min(1, 2), Math.max(1, 2)];
const [key, value] = Object.entries({ a: 1 })[0];
```
### روی هر iterable
```js
const [c1, c2] = "hi";             // "h", "i"
const k1, v1 = new Map("a", 1);
```

## Object Destructuring
```js
const user = { name: "Ali", age: 30, city: "Tehran" };

const { name, age } = user;
const { name: userName } = user;          // تغییر نام → userName
const { country = "Iran" } = user;        // پیش‌فرض
const { city: town = "?" } = user;        // تغییر نام + پیش‌فرض
const { name: n, ...rest } = user;        // rest → { age:30, city:"Tehran" }
```
### تو در تو
```js
const data = { user: { id: 1, tags: ["a", "b"] } };
const { user: { id, tags: [firstTag] } } = data;
// id=1, firstTag="a"
```
### کلید پویا
```js
const key = "age";
const { [key]: val } = user;   // val = 30
```
### انتساب بدون تعریف (پرانتز لازمه)
```js
let u, v;
({ u, v } = { u: 1, v: 2 });
```

## در پارامتر تابع
```js
function draw({ x = 0, y = 0, color = "black" } = {}) {
  return `${color} @ (${x}, ${y})`;
}
draw({ x: 5 });   // → "black @ (5, 0)"
draw();           // → "black @ (0, 0)"

const pairs = [[1, 2], [3, 4]];
pairs.map(([a, b]) => a + b);   // → [3, 7]
Object.entries({ a: 1 }).map(([k, v]) => `${k}=${v}`);  // → ["a=1"]
```

## در حلقه
```js
for (const { name, age } of [{ name: "A", age: 1 }]) {}
for (const [i, v] of ["x", "y"].entries()) {}
for (const [k, v] of Object.entries({ a: 1 })) {}
```

---

## Spread `...` (باز کردن)

### آرایه
```js
const a = [1, 2];
const b = [3, 4];
[...a, ...b];            // → [1, 2, 3, 4]
[0, ...a, 99];           // → [0, 1, 2, 99]
const copy = [...a];     // کپی shallow
Math.max(...b);          // → 4
[..."abc"];              // → ["a", "b", "c"]
[...new Set([1, 1, 2])]; // → [1, 2]
```

### object
```js
const base = { a: 1, b: 2 };
const ext = { ...base, b: 20, c: 3 };   // → { a:1, b:20, c:3 }  (بعدی برنده است)
const clone = { ...base };               // کپی shallow
const without = (({ a, ...r }) => r)(base); // حذف کلید a → { b: 2 }
```
- فقط ویژگی‌های **enumerable خودی** رو کپی می‌کنه.
- کپی **عمیق** نیست:
```js
const o = { inner: { v: 1 } };
const c = { ...o };
c.inner.v = 99;
o.inner.v;   // → 99  ⚠️
```

### فراخوانی تابع
```js
function sum(a, b, c) { return a + b + c; }
sum(...[1, 2, 3]);    // → 6
```

## Rest `...` (جمع کردن)

### پارامتر
```js
const join = (sep, ...parts) => parts.join(sep);
join("-", "a", "b", "c");   // → "a-b-c"
```
باید **آخرین** پارامتر باشه (و فقط یکی).

### در destructuring
```js
const [h, ...t] = [1, 2, 3];       // t → [2, 3]
const { a, ...others } = { a: 1, b: 2, c: 3 };   // others → { b:2, c:3 }
```

## تفاوت Spread و Rest
- **Spread**: یک مجموعه رو به عناصر **باز می‌کنه** (سمت راست یا داخل فراخوانی).
- **Rest**: چند عنصر رو در یک مجموعه **جمع می‌کنه** (سمت چپ انتساب یا در پارامتر).

## الگوهای کاربردی (Immutable Update)
اساس React/Redux:
```js
const state = { user: { name: "A", age: 1 }, items: [1, 2] };

// تغییر یک ویژگی
const s1 = { ...state, user: { ...state.user, age: 2 } };

// افزودن به آرایه
const s2 = { ...state, items: [...state.items, 3] };

// حذف از آرایه
const s3 = { ...state, items: state.items.filter((x) => x !== 1) };

// جایگزینی در آرایه
const s4 = { ...state, items: state.items.map((x) => (x === 2 ? 20 : x)) };
```

## ادغام با مقدار پیش‌فرض
```js
const defaults = { theme: "light", lang: "fa" };
const opts = { ...defaults, ...userOptions };
```

## تمرین
1. تابعی بنویس که یک آرایه‌ی `[x, y]` بگیره و `{ x, y }` برگردونه.
2. از آبجکت `{ a, b, c, d }` فقط `a` و `c` رو جدا کن (با destructuring).
3. دو آبجکت تو در تو رو به‌صورت **عمیق** ادغام کن (`deepMerge`).
