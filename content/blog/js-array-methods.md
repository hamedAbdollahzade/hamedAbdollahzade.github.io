---
title: متدهای Array
description: متدهای Array؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 7
---

## ساخت آرایه
```js
const a = [1, 2, 3];
const b = new Array(3);          // → [ <3 empty items> ]
const c = Array.of(7);           // → [7]
const d = Array.from("abc");     // → ["a", "b", "c"]
const e = Array.from({ length: 3 }, (_, i) => i * 2); // → [0, 2, 4]
const f = new Array(3).fill(0);  // → [0, 0, 0]
const g = [...Array(3).keys()];  // → [0, 1, 2]
```

## بررسی
```js
Array.isArray([]);   // → true
a.length;            // → 3
a.at(-1);            // → 3
```

## ⚠️ متدها دو دسته‌ان
- **Mutating (آرایه‌ی اصلی رو تغییر می‌دن):** `push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin`
- **Non-mutating (آرایه‌ی جدید برمی‌گردونن):** `map, filter, slice, concat, flat, ...` و نسخه‌های ES2023: `toSorted, toReversed, toSpliced, with`

---

## افزودن و حذف

```js
const arr = [1, 2, 3];

arr.push(4, 5);     // → 5 (طول جدید)  arr = [1,2,3,4,5]
arr.pop();          // → 5             arr = [1,2,3,4]
arr.unshift(0);     // → 5 (طول)       arr = [0,1,2,3,4]
arr.shift();        // → 0             arr = [1,2,3,4]
```

### `splice(start, deleteCount, ...items)`
حذف/درج/جایگزینی در هر نقطه (آرایه رو **تغییر می‌ده**):
```js
const x = [1, 2, 3, 4, 5];
x.splice(1, 2);           // → [2, 3]    x = [1,4,5]   (حذف)
x.splice(1, 0, "a", "b"); // → []        x = [1,"a","b",4,5]  (درج)
x.splice(1, 2, "z");      // → ["a","b"] x = [1,"z",4,5]      (جایگزینی)
x.splice(-1);             // حذف آخری
```

### `slice(start, end)` (بدون تغییر)
```js
const y = [10, 20, 30, 40];
y.slice(1, 3);   // → [20, 30]
y.slice(-2);     // → [30, 40]
y.slice();       // → کپی کامل (shallow)
```

### `concat`
```js
[1, 2].concat([3], 4, 5);  // → [1, 2, 3, 4, [5]]
[...[1, 2], ...[3, 4]];        // → [1, 2, 3, 4]  (spread)
```

### `fill` و `copyWithin`
```js
[1, 2, 3, 4].fill(0, 1, 3);       // → [1, 0, 0, 4]
[1, 2, 3, 4, 5].copyWithin(0, 3); // → [4, 5, 3, 4, 5]
```

---

## جستجو

```js
const n = [5, 12, 8, 130, 44];

n.indexOf(8);         // → 2
n.lastIndexOf(8);     // → 2
n.includes(12);       // → true
n.includes(NaN);      // کار می‌کنه (indexOf نه)

n.find((v) => v > 10);        // → 12     (اولین عنصر)
n.findIndex((v) => v > 10);   // → 1
n.findLast((v) => v > 10);    // → 44     (ES2023)
n.findLastIndex((v) => v > 10); // → 4
```

## بررسی شرط
```js
n.some((v) => v > 100);    // → true   (حداقل یکی)
n.every((v) => v > 0);     // → true   (همه)
```
> روی آرایه‌ی خالی: `some → false` و `every → true`.

---

## پیمایش و تبدیل

### `forEach`
```js
[1, 2, 3].forEach((v, i, arr) => console.log(i, v));
```
مقدار برنمی‌گردونه (`undefined`)، با `break` نمی‌شه متوقفش کرد.

### `map` ← تبدیل هر عنصر
```js
[1, 2, 3].map((v) => v * 2);          // → [2, 4, 6]
["1", "2", "3"].map(Number);          // → [1, 2, 3]
const users = [{ n: "A" }, { n: "B" }];
users.map((u) => u.n);                // → ["A", "B"]
```
دام معروف:
```js
["1", "2", "3"].map(parseInt); // → [1, NaN, NaN]  ❌ (index به‌عنوان radix میره)
```

### `filter` ← نگه‌داشتن عناصر
```js
[1, 2, 3, 4].filter((v) => v % 2 === 0);   // → [2, 4]
[0, 1, "", "a", null].filter(Boolean);     // → [1, "a"]
```

### `reduce` ← تبدیل به یک مقدار
```js
[1, 2, 3, 4].reduce((acc, v) => acc + v, 0);   // → 10

// شمارش تکرار
["a", "b", "a"].reduce((acc, ch) => {
  acc[ch] = (acc[ch] || 0) + 1;
  return acc;
}, {});   // → { a: 2, b: 1 }

// گروه‌بندی
const people = [{ n: "A", c: "x" }, { n: "B", c: "y" }, { n: "C", c: "x" }];
people.reduce((g, p) => {
  (g[p.c] ??= []).push(p.n);
  return g;
}, {});   // → { x: ["A","C"], y: ["B"] }
```
`reduceRight` از آخر شروع می‌کنه:
```js
["a", "b", "c"].reduceRight((acc, v) => acc + v, ""); // → "cba"
```
> بدون مقدار اولیه روی آرایه‌ی خالی: `TypeError`. همیشه مقدار اولیه بده.

### `flat` و `flatMap`
```js
[1, [2, [3, [4]]]].flat();         // → [1, 2, [3, [4]]]
[1, [2, [3, [4]]]].flat(2);        // → [1, 2, 3, [4]]
[1, [2, [3, [4]]]].flat(Infinity); // → [1, 2, 3, 4]

["a b", "c d"].flatMap((s) => s.split(" ")); // → ["a", "b", "c", "d"]
```

### `join`
```js
[1, 2, 3].join("-");   // → "1-2-3"
[1, 2, 3].join("");    // → "123"
```

---

## مرتب‌سازی

### `sort`
⚠️ **پیش‌فرض: مرتب‌سازی به‌صورت رشته‌ای!**
```js
[10, 9, 1, 100].sort();                 // → [1, 10, 100, 9]  ❌
[10, 9, 1, 100].sort((a, b) => a - b);  // → [1, 9, 10, 100]  ✅ صعودی
[10, 9, 1, 100].sort((a, b) => b - a);  // → [100, 10, 9, 1]  نزولی
```
مرتب‌سازی object ها:
```js
const people = [{ n: "B", a: 30 }, { n: "A", a: 25 }];
people.sort((x, y) => x.a - y.a);
people.sort((x, y) => x.n.localeCompare(y.n));
```
- `sort` پایدار (stable) است.
- **آرایه‌ی اصلی رو تغییر می‌ده.** نسخه‌ی بدون تغییر: `toSorted`.

### `reverse`
```js
[1, 2, 3].reverse();    // → [3, 2, 1]  (تغییر می‌ده)
[1, 2, 3].toReversed(); // → [3, 2, 1]  (بدون تغییر)
```

---

## متدهای ES2023 (بدون تغییر آرایه‌ی اصلی)
```js
const o = [3, 1, 2];
o.toSorted();            // → [1, 2, 3]
o.toReversed();          // → [2, 1, 3]
o.toSpliced(1, 1, "x");  // → [3, "x", 2]
o.with(0, 99);           // → [99, 1, 2]
console.log(o);          // → [3, 1, 2] (دست‌نخورده)
```

## ES2024+
```js
Object.groupBy([1, 2, 3, 4], (n) => (n % 2 ? "odd" : "even"));
// → { odd: [1, 3], even: [2, 4] }
```

---

## Iterator ها
```js
const arr = ["a", "b"];
[...arr.keys()];      // → [0, 1]
[...arr.values()];    // → ["a", "b"]
[...arr.entries()];   // → [[0,"a"], [1,"b"]]
for (const [i, v] of arr.entries()) console.log(i, v);
```

## تبدیل به رشته
```js
[1, [2, 3]].toString();           // → "1,2,3"
[1, 2].toLocaleString("fa-IR");   // → "۱,۲"  (ارقام فارسی)
```

---

## الگوهای رایج

```js
// حذف تکراری‌ها
[...new Set([1, 2, 2, 3, 3])];      // → [1, 2, 3]

// کپی (shallow)
const copy = [...arr];            // یا arr.slice()

// کپی عمیق
structuredClone([[1], [2]]);

// جمع
const sum = (a) => a.reduce((x, y) => x + y, 0);

// بزرگ‌ترین/کوچک‌ترین
Math.max(...[3, 9, 2]);

// تکه تکه کردن (chunk)
const chunk = (a, n) =>
  Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));
chunk([1, 2, 3, 4, 5], 2);          // → [[1,2],[3,4],[5]]

// zip
const zip = (a, b) => a.map((v, i) => [v, b[i]]);
zip([1, 2], ["a", "b"]);            // → [[1,"a"],[2,"b"]]

// اشتراک و اختلاف
const A = [1, 2, 3], B = [2, 3, 4];
A.filter((x) => B.includes(x));     // → [2, 3]
A.filter((x) => !B.includes(x));    // → [1]

// جابه‌جایی دو عنصر
[arr[0], arr[1]] = [arr[1], arr[0]];

// شافل ساده (برای کار جدی Fisher–Yates)
[...arr].sort(() => Math.random() - 0.5);
```

## خلاصه‌ی همه‌ی متدها
`at, concat, copyWithin, entries, every, fill, filter, find, findIndex, findLast, findLastIndex, flat, flatMap, forEach, includes, indexOf, join, keys, lastIndexOf, map, pop, push, reduce, reduceRight, reverse, shift, slice, some, sort, splice, toLocaleString, toReversed, toSorted, toSpliced, toString, unshift, values, with` + استاتیک: `Array.from, Array.isArray, Array.of`
