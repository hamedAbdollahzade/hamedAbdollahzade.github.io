---
title: توابع (Functions)
description: تابع یک بلوک کد قابل استفاده‌ی مجدده. در JS توابع first-class هستن: می‌شه در متغیر ذخیره، به تابع دیگه پاس داد، و برگردوند.
date: 2026-11-06
category: JavaScript
order: 4
---

تابع یک بلوک کد قابل استفاده‌ی مجدده. در JS توابع **first-class** هستن: می‌شه در متغیر ذخیره، به تابع دیگه پاس داد، و برگردوند.

## روش‌های تعریف

### ۱. Function Declaration
```js
function add(a, b) {
  return a + b;
}
add(2, 3); // → 5
```
**Hoist** می‌شه: قبل از خطی که تعریف شده هم می‌شه صداش زد.

### ۲. Function Expression
```js
const multiply = function (a, b) {
  return a * b;
};
multiply(2, 3); // → 6
```
Hoist نمی‌شه (قبل از تعریف خطا می‌ده).

### ۳. Arrow Function
```js
const square = (x) => x * x;        // return ضمنی
const sum = (a, b) => {             // با بدنه‌ی کامل
  return a + b;
};
const one = x => x + 1;             // یک پارامتر: پرانتز اختیاری
const obj = () => ({ a: 1 });       // برگردوندن object: پرانتز دور آکولاد
```
تفاوت‌های arrow با تابع معمولی:
- `this` خودش رو نداره (از اطرافش می‌گیره).
- `arguments` نداره.
- با `new` نمی‌شه صدا زد.

### ۴. Method (داخل object)
```js
const calc = {
  double(n) { return n * 2; },
};
calc.double(4); // → 8
```

### ۵. IIFE (اجرای فوری)
```js
(function () {
  console.log("بلافاصله اجرا شد");
})();

(() => console.log("arrow IIFE"))();
```

## پارامتر و آرگومان

### مقدار پیش‌فرض
```js
function greet(name = "مهمان") {
  return `سلام ${name}`;
}
greet();        // → "سلام مهمان"
greet("Ali");   // → "سلام Ali"
```
پیش‌فرض می‌تونه به پارامترهای قبلی ارجاع بده:
```js
function area(w, h = w) { return w * h; }
area(4); // → 16
```

### Rest parameters
```js
function total(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
total(1, 2, 3, 4); // → 10
```

### Spread در فراخوانی
```js
const arr = [5, 1, 9];
Math.max(...arr); // → 9
```

### Destructuring در پارامتر
```js
function show({ name, age = 18 }) {
  return `${name} (${age})`;
}
show({ name: "Ali" }); // → "Ali (18)"
```
الگوی «Options object» برای تابع‌های با پارامتر زیاد:
```js
function createUser({ name, role = "user", active = true } = {}) {
  return { name, role, active };
}
```

### `arguments` (قدیمی، فقط در تابع معمولی)
```js
function old() {
  return arguments.length;
}
old(1, 2, 3); // → 3
```
به‌جاش از rest استفاده کن.

## مقدار برگشتی
```js
function noReturn() {}
noReturn();   // → undefined

function early(n) {
  if (n < 0) return "منفی";
  return "غیرمنفی";
}
```
فقط **یک مقدار** برمی‌گردونه. برای چندتا، آرایه یا object:
```js
function minMax(arr) {
  return { min: Math.min(...arr), max: Math.max(...arr) };
}
const { min, max } = minMax([3, 1, 8]); // min=1, max=8
```

## Pass by value / reference
```js
function change(n, o) {
  n = 100;          // کپی تغییر می‌کنه
  o.value = 100;    // آبجکت اصلی تغییر می‌کنه
}
let num = 1;
const obj = { value: 1 };
change(num, obj);
console.log(num, obj.value); // → 1 100
```

## توابع به‌عنوان مقدار

### Callback
```js
function repeat(n, action) {
  for (let i = 0; i < n; i++) action(i);
}
repeat(3, (i) => console.log("دور", i));
```

### Higher-Order Function
تابعی که تابع می‌گیره یا برمی‌گردونه:
```js
function multiplier(factor) {
  return (n) => n * factor;
}
const triple = multiplier(3);
triple(5); // → 15
```

## Recursion (بازگشتی)
```js
function factorial(n) {
  if (n <= 1) return 1;       // شرط پایان
  return n * factorial(n - 1);
}
factorial(5); // → 120

function fib(n) {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
}
fib(7); // → 13
```
> بدون شرط پایان: `RangeError: Maximum call stack size exceeded`.

## ویژگی‌های خود تابع
```js
function foo(a, b) {}
foo.name;     // → "foo"
foo.length;   // → 2 (تعداد پارامترهای بدون پیش‌فرض)
foo.toString(); // متن تابع

foo.counter = 0;   // تابع هم یک object است
```

## Pure در برابر Impure
```js
// Pure: خروجی فقط به ورودی بستگی داره و اثر جانبی نداره
const add = (a, b) => a + b;

// Impure
let total = 0;
function addToTotal(n) { total += n; }   // تغییر متغیر بیرونی
```
توابع pure راحت‌تر تست می‌شن و قابل پیش‌بینی‌ترن.

## Default + Required
```js
function required(name) {
  throw new Error(`پارامتر ${name} الزامیه`);
}
function send(to = required("to")) { return to; }
// send() → Error
```

## تمرین‌ها
1. تابعی بنویس که یک رشته بگیره و تعداد حروف صدادار رو برگردونه.
2. تابع `compose(f, g)` بنویس که `x => f(g(x))` رو برگردونه.
3. فاکتوریل رو بدون recursion و با حلقه بنویس.
