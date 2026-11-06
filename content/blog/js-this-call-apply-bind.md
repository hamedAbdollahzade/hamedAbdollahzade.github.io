---
title: this، call، apply، bind
description: this یعنی «شیئی که الان تابع روش صدا زده شده». مقدارش موقع فراخوانی تعیین می‌شه (به‌جز arrow function).
date: 2026-11-06
category: JavaScript
order: 15
---

`this` یعنی «شیئی که الان تابع روش صدا زده شده». مقدارش **موقع فراخوانی** تعیین می‌شه (به‌جز arrow function).

## قواعد تعیین `this`

### ۱. فراخوانی ساده
```js
function show() { return this; }
show();   // حالت عادی: globalThis (window/global)
          // در "use strict": undefined
```

### ۲. فراخوانی به‌عنوان متد
`this` = آبجکت سمت چپ نقطه:
```js
const user = {
  name: "Ali",
  hi() { return `سلام ${this.name}`; },
};
user.hi(); // → "سلام Ali"
```

### ۳. گم شدن this
```js
const f = user.hi;
f();   // this = undefined/global → "سلام undefined" (یا خطا)

setTimeout(user.hi, 0);   // همین مشکل
[1].forEach(user.hi);      // همین مشکل
```

### ۴. سازنده (`new`)
```js
function Person(name) {
  this.name = name;   // this = آبجکت جدید
}
new Person("Sara").name; // → "Sara"
```

### ۵. صریح: `call`/`apply`/`bind`
(پایین‌تر)

### ۶. Arrow function
`this` رو از **scope بیرونی (lexical)** می‌گیره و هیچ‌وقت عوض نمی‌شه:
```js
const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++;          // this = timer ✅
    }, 1000);
  },
};
```
با تابع معمولی داخل `setInterval`، `this` درست نبود.

> arrow function رو **به‌عنوان متد object** ننویس:
```js
const bad = {
  name: "x",
  hi: () => this.name,   // this = بیرون object (undefined یا global)
};
```

### ۷. Event handler (DOM)
```js
button.addEventListener("click", function () {
  this;                    // → خود button
});
button.addEventListener("click", (e) => {
  e.currentTarget;         // → button (در arrow از این استفاده کن)
});
```

### ۸. class
```js
class Btn {
  label = "OK";
  handle = () => console.log(this.label);   // arrow field: this ثابته
  other() { console.log(this.label); }       // اگه جدا بشه this گم می‌شه
}
```

---

## `call`
فراخوانی فوری با `this` دلخواه و آرگومان‌های جدا:
```js
function intro(greet, punct) {
  return `${greet}, ${this.name}${punct}`;
}
const p = { name: "Ali" };
intro.call(p, "سلام", "!");   // → "سلام, Ali!"
```

## `apply`
مثل call ولی آرگومان‌ها در **آرایه**:
```js
intro.apply(p, ["سلام", "!"]);   // → "سلام, Ali!"
Math.max.apply(null, [1, 5, 3]); // → 5  (امروز: Math.max(...arr))
```
> حافظه: **A**pply = **A**rray.

## `bind`
**تابع جدید** با this ثابت برمی‌گردونه (فوری اجرا نمی‌کنه):
```js
const boundIntro = intro.bind(p, "سلام");
boundIntro("؟");   // → "سلام, Ali؟"
```
### Partial application
```js
function mul(a, b) { return a * b; }
const double = mul.bind(null, 2);
double(5); // → 10
```
### حل مشکل گم شدن this
```js
const safe = user.hi.bind(user);
setTimeout(safe, 0);   // ✅
```
- `bind` شده را نمی‌شه دوباره bind کرد (اولی می‌مونه).
- `bound.name` → `"bound hi"`.

## قرض گرفتن متد (Method Borrowing)
```js
function sumArgs() {
  return Array.prototype.reduce.call(arguments, (a, b) => a + b, 0);
}
sumArgs(1, 2, 3); // → 6

Array.prototype.map.call("abc", (c) => c.toUpperCase()); // → ["A","B","C"]
```

## `globalThis` و strict mode
```js
"use strict";
function f() { return this; }
f(); // → undefined (نه window)
```
ماژول‌های ES و class ها همیشه strict هستن.

## جدول خلاصه

| روش فراخوانی | مقدار this |
|---|---|
| `fn()` | `undefined` (strict) / global |
| `obj.fn()` | `obj` |
| `new Fn()` | آبجکت تازه‌ساخته |
| `fn.call(x)` / `apply(x)` / `bind(x)` | `x` |
| arrow function | this بیرونی |
| event handler (تابع معمولی) | عنصر DOM |

## تمرین
1. بدون اجرا پیش‌بینی کن خروجی چیه:
```js
const o = {
  n: 1,
  a() { return this.n; },
  b: () => typeof this,
  c() { return [1].map(() => this.n); },
};
console.log(o.a(), o.b(), o.c());
// → 1 "object" [ 1 ]
// (در Node با CommonJS. در ماژول ESM مقدار this سطح بالا undefined است و b() مقدار "undefined" برمی‌گردونه.)
```
2. تابع `myBind(fn, ctx)` بنویس که رفتار `bind` رو پیاده کنه:
```js
const myBind = (fn, ctx, ...pre) => (...args) => fn.apply(ctx, [...pre, ...args]);
```
