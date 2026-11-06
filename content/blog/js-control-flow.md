---
title: کنترل جریان: شرط‌ها و حلقه‌ها
description: کنترل جریان: شرط‌ها و حلقه‌ها؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 3
---

## `if / else if / else`
```js
const score = 85;

if (score >= 90) {
  console.log("عالی");
} else if (score >= 70) {
  console.log("خوب");   // ← این اجرا می‌شه
} else {
  console.log("تلاش بیشتر");
}
```
بدون آکولاد فقط یک دستور بعدی رو کنترل می‌کنه (توصیه نمی‌شه):
```js
if (score > 50) console.log("قبول");
```

### Early return (Guard Clause)
به جای تو در تو کردن، زود خارج شو:
```js
function process(user) {
  if (!user) return "کاربر نیست";
  if (!user.active) return "غیرفعال";
  return "OK";
}
```

## `switch`
```js
const day = 3;
switch (day) {
  case 1:
    console.log("شنبه");
    break;
  case 2:
  case 3:                    // fall-through برای چند case
    console.log("یکشنبه یا دوشنبه");
    break;
  default:
    console.log("نامعتبر");
}
// → یکشنبه یا دوشنبه
```
بدون `break` اجرا به case بعدی می‌ره (fall-through).

الگوی `switch(true)`:
```js
const n = 15;
switch (true) {
  case n < 10: console.log("کوچک"); break;
  case n < 20: console.log("متوسط"); break;   // ← این
  default: console.log("بزرگ");
}
```

جایگزین ساده‌تر: **object lookup**
```js
const names = { 1: "شنبه", 2: "یکشنبه" };
console.log(names[2] ?? "نامعتبر"); // → یکشنبه
```

## حلقه‌ها

### `for`
```js
for (let i = 0; i < 3; i++) {
  console.log(i);   // → 0, 1, 2
}
```
ساختار: `for (مقداردهی اولیه; شرط; گام)`.

### `while`
```js
let n = 3;
while (n > 0) {
  console.log(n);   // → 3, 2, 1
  n--;
}
```

### `do...while`
حداقل یک بار اجرا می‌شه:
```js
let k = 10;
do {
  console.log(k);   // → 10 (فقط یک بار)
  k++;
} while (k < 5);
```

### `for...of` (مقادیر)
روی هر **iterable** (آرایه، رشته، Map، Set):
```js
for (const ch of "abc") console.log(ch);        // → a, b, c
for (const x of [10, 20]) console.log(x);       // → 10, 20

// با index:
for (const [i, v] of ["a", "b"].entries()) {
  console.log(i, v);   // → 0 a ، 1 b
}
```

### `for...in` (کلیدها)
روی کلیدهای **object** (برای آرایه توصیه نمی‌شه):
```js
const user = { name: "Ali", age: 30 };
for (const key in user) {
  console.log(key, user[key]);  // → name Ali ، age 30
}
```
> `for...in` کلیدهای ارث‌برده‌شده (inherited) رو هم می‌گیره. برای فقط کلیدهای خودی: `Object.keys(obj)` یا `Object.hasOwn(obj, key)`.

### `break` و `continue`
```js
for (let i = 0; i < 10; i++) {
  if (i === 2) continue;   // این دور رو رد کن
  if (i === 5) break;      // کل حلقه رو تمام کن
  console.log(i);          // → 0, 1, 3, 4
}
```

### Label
خروج از حلقه‌ی تو در تو:
```js
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) continue outer;
    if (i === 2) break outer;
    console.log(i, j);   // → 0 0 ، 1 0
  }
}
```

## حلقه‌های مدرن (متدهای آرایه)
```js
[1, 2, 3].forEach((n) => console.log(n * 2));   // → 2, 4, 6
```
جزئیات: [Array methods](/blog/js-array-methods/).

## الگوهای رایج

### جمع اعداد
```js
let sum = 0;
for (const n of [1, 2, 3, 4]) sum += n;
console.log(sum); // → 10
```

### پیدا کردن بزرگ‌ترین
```js
const arr = [4, 9, 2];
let max = -Infinity;
for (const n of arr) if (n > max) max = n;
console.log(max); // → 9
```

### FizzBuzz
```js
for (let i = 1; i <= 15; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}
```

### حلقه‌ی بی‌نهایت با خروج
```js
let tries = 0;
while (true) {
  tries++;
  if (tries >= 3) break;
}
```

## نکته‌ی `let` در حلقه
هر دور یک `let` جدا داره، برخلاف `var`:
```js
const fnsLet = [];
for (let i = 0; i < 3; i++) fnsLet.push(() => i);
fnsLet.map((f) => f());   // → [0, 1, 2]

const fnsVar = [];
for (var j = 0; j < 3; j++) fnsVar.push(() => j);
fnsVar.map((f) => f());   // → [3, 3, 3]
```
