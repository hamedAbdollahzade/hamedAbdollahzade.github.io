---
title: Scope، Hoisting و Closure
description: Scope، Hoisting و Closure؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 14
---

## Scope (محدوده‌ی دید متغیر)

### انواع
```js
const global = "سراسری";            // Global scope

function fn() {
  const local = "محلی";             // Function scope
  if (true) {
    let block = "بلوک";             // Block scope (let/const)
    var leaky = "نشت می‌کنه";       // var به بلوک محدود نیست
  }
  // console.log(block);            // ❌ ReferenceError
  console.log(leaky);               // ✅ → "نشت می‌کنه"
}
```

### Scope Chain
وقتی متغیری پیدا نشه، JS به scope بیرونی‌تر می‌ره تا به global برسه:
```js
const a = 1;
function outer() {
  const b = 2;
  function inner() {
    const c = 3;
    return a + b + c;   // inner → outer → global
  }
  return inner();
}
outer(); // → 6
```

### Shadowing
```js
const x = "بیرونی";
function f() {
  const x = "درونی";   // x بیرونی رو می‌پوشونه
  return x;
}
f(); // → "درونی"
```

### Lexical Scope
scope بر اساس **محل نوشتن کد** تعیین می‌شه، نه محل صدا زدن:
```js
const v = "global";
function show() { return v; }
function wrapper() {
  const v = "local";
  return show();
}
wrapper(); // → "global"
```

---

## Hoisting

مفسر قبل از اجرا، **تعریف‌ها** رو به بالای scope می‌کشه.

### `var`
```js
console.log(a); // → undefined (نه خطا)
var a = 5;
// معادل:  var a;  console.log(a);  a = 5;
```

### `let` / `const` و TDZ
```js
// console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 5;
```
فاصله‌ی ابتدای scope تا خط تعریف = **Temporal Dead Zone (TDZ)**.

### توابع
```js
hello();                 // ✅ کار می‌کنه
function hello() { console.log("hi"); }

// bye();                // ❌ TypeError: bye is not a function  (var → undefined)
var bye = function () {};

// arrow();              // ❌ ReferenceError (const در TDZ)
const arrow = () => {};
```

### class هم TDZ داره
```js
// new A();  // ❌ ReferenceError
class A {}
```

### اولویت: تابع بالاتر از var
```js
console.log(typeof foo);   // → "function"
var foo = 1;
function foo() {}
```

---

## Closure

> **Closure** یعنی تابع، متغیرهای scope‌ی که در آن ساخته شده رو **حتی بعد از پایان اون scope** به یاد می‌داره.

### مثال پایه
```js
function makeCounter() {
  let count = 0;             // متغیر خصوصی
  return function () {
    count++;
    return count;
  };
}

const c1 = makeCounter();
c1(); // → 1
c1(); // → 2
const c2 = makeCounter();    // شمارنده‌ی مستقل
c2(); // → 1
```

### کاربرد ۱: داده‌ی خصوصی (Encapsulation)
```js
function createAccount(balance) {
  return {
    deposit(n) { balance += n; return balance; },
    withdraw(n) {
      if (n > balance) throw new Error("موجودی کافی نیست");
      balance -= n;
      return balance;
    },
    get balance() { return balance; },
  };
}
const acc = createAccount(100);
acc.deposit(50);   // → 150
acc.balance;       // → 150
// acc.balance = 0  → تأثیری نداره؛ به متغیر داخلی دسترسی مستقیم نیست
```

### کاربرد ۲: Function Factory
```js
const power = (exp) => (base) => base ** exp;
const square = power(2);
const cube = power(3);
square(4); // → 16
cube(2);   // → 8
```

### کاربرد ۳: ماژول (الگوی قدیمی)
```js
const counterModule = (function () {
  let n = 0;
  return {
    inc: () => ++n,
    reset: () => (n = 0),
  };
})();
```

### کاربرد ۴: Memoization
```js
function memo(fn) {
  const cache = new Map();
  return (arg) => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg);
  };
}
```

### دام معروف: closure داخل حلقه
```js
// ❌ با var همه به یک i اشاره می‌کنن
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);   // → 3, 3, 3
}

// ✅ راه‌حل ۱: let (برای هر دور یک i جدا)
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0);   // → 0, 1, 2
}

// ✅ راه‌حل ۲: IIFE
for (var k = 0; k < 3; k++) {
  ((n) => setTimeout(() => console.log(n), 0))(k);
}
```

### Closure و حافظه
تا وقتی تابعی که closure داره زنده‌ست، متغیرهای گرفته‌شده هم زنده می‌مونن. اگه داده‌ی بزرگی رو ناخواسته نگه می‌داره:
```js
function leak() {
  const big = new Array(1e6).fill("x");
  return () => big.length;   // big تا زنده‌ بودن این تابع آزاد نمی‌شه
}
```
بعد از استفاده ارجاع‌ها رو `null` کن یا از `WeakRef` استفاده کن.

## تمرین
1. تابع `once(fn)` بنویس که فقط بار اول اجرا بشه و بعد همون نتیجه رو برگردونه.
2. یک `createCounter` با متدهای `inc`, `dec`, `value` بنویس بدون اینکه `count` از بیرون قابل دسترس باشه.
3. توضیح بده چرا خروجی `for (var i...)` با `setTimeout` همیشه یک عدد تکراریه.
