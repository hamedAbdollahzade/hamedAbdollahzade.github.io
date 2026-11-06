---
title: Number و Math
description: Number و Math؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 6
---

## Number

### ثابت‌ها
```js
Number.MAX_SAFE_INTEGER;  // → 9007199254740991
Number.MIN_SAFE_INTEGER;  // → -9007199254740991
Number.MAX_VALUE;         // → 1.7976931348623157e+308
Number.MIN_VALUE;         // → 5e-324
Number.EPSILON;           // → 2.220446049250313e-16
Number.POSITIVE_INFINITY; // → Infinity
Number.NEGATIVE_INFINITY; // → -Infinity
Number.NaN;               // → NaN
```

### بررسی نوع
```js
Number.isInteger(5);        // → true
Number.isInteger(5.5);      // → false
Number.isSafeInteger(2 ** 53); // → false
Number.isFinite(10);        // → true
Number.isFinite(Infinity);  // → false
Number.isNaN(NaN);          // → true
Number.isNaN("abc");        // → false  (برخلاف isNaN سراسری)
isNaN("abc");               // → true   (اول تبدیل می‌کنه)
```

### تبدیل
```js
Number.parseInt("42px");     // → 42
Number.parseInt("ff", 16);   // → 255
Number.parseInt("101", 2);   // → 5
Number.parseFloat("3.14abc");// → 3.14
Number("12");                // → 12
+"12";                       // → 12 (میان‌بر)
```

### متدهای نمونه
```js
const n = 1234.5678;

n.toFixed(2);          // → "1234.57"  (رشته برمی‌گردونه!)
n.toPrecision(6);      // → "1234.57"
n.toExponential(2);    // → "1.23e+3"
(255).toString(16);    // → "ff"
(255).toString(2);     // → "11111111"
n.toLocaleString("en-US");   // → "1,234.568"
n.toLocaleString("fa-IR");   // → "۱٬۲۳۴٫۵۶۸"
n.toLocaleString("en-US", { style: "currency", currency: "USD" }); // → "$1,234.57"
(0.256).toLocaleString("en-US", { style: "percent" }); // → "26%"
```

### جداکننده‌ی هزارگان
```js
const fmt = (x) => x.toLocaleString("en-US");
fmt(1234567); // → "1,234,567"
```

### Numeric separator
```js
const million = 1_000_000;
```

### BigInt
```js
const a = 123456789012345678901234567890n;
a * 2n;                 // → 246913578024691357802469135780n
BigInt(10) + 5n;        // → 15n
typeof a;               // → "bigint"
// 1n + 1  → ❌ TypeError (قاطی کردن ممنوع)
```

---

## Math

### ثابت‌ها
```js
Math.PI;      // → 3.141592653589793
Math.E;       // → 2.718281828459045
Math.SQRT2;   // → 1.4142135623730951
Math.LN2;     // → 0.6931471805599453
Math.LN10;    // → 2.302585092994046
Math.LOG2E;   // → 1.4426950408889634
Math.LOG10E;  // → 0.4342944819032518
Math.SQRT1_2; // → 0.7071067811865476
```

### گرد کردن
```js
Math.round(2.5);   // → 3
Math.round(-2.5);  // → -2
Math.round(2.4);   // → 2
Math.floor(2.9);   // → 2   (به پایین)
Math.floor(-2.1);  // → -3
Math.ceil(2.1);    // → 3   (به بالا)
Math.trunc(-2.9);  // → -2  (حذف اعشار)
Math.sign(-5);     // → -1  (یا 0 یا 1)
Math.fround(5.5);  // → 5.5 (نزدیک‌ترین float32)
```

### مقدار مطلق، توان، ریشه
```js
Math.abs(-7);        // → 7
Math.pow(2, 10);     // → 1024  (مثل 2 ** 10)
Math.sqrt(16);       // → 4
Math.cbrt(27);       // → 3
Math.hypot(3, 4);    // → 5   (√(3²+4²))
Math.exp(1);         // → 2.718281828459045
Math.expm1(0);       // → 0   (e^x - 1)
```

### لگاریتم
```js
Math.log(Math.E);   // → 1   (طبیعی)
Math.log10(1000);   // → 3
Math.log2(8);       // → 3
Math.log1p(0);      // → 0   (ln(1+x))
```

### حداقل و حداکثر
```js
Math.min(3, 1, 2);        // → 1
Math.max(3, 1, 2);        // → 3
Math.max(...[4, 9, 2]);   // → 9
Math.max();               // → -Infinity
```

### مثلثاتی (رادیان)
```js
Math.sin(Math.PI / 2);   // → 1
Math.cos(0);             // → 1
Math.tan(0);             // → 0
Math.asin(1);            // → 1.5707963267948966
Math.acos(1);            // → 0
Math.atan(1);            // → 0.7853981633974483
Math.atan2(1, 1);        // → 0.7853981633974483 (زاویه‌ی نقطه (x,y))
Math.sinh(0); Math.cosh(0); Math.tanh(0);
Math.asinh(0); Math.acosh(1); Math.atanh(0);

const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;
```

### بیت و دیگر
```js
Math.clz32(1);      // → 31 (صفرهای ابتدایی در 32 بیت)
Math.imul(3, 4);    // → 12 (ضرب 32 بیتی صحیح)
```

### عدد تصادفی
```js
Math.random();                       // → [0, 1)

// عدد صحیح بین min و max (شامل هر دو)
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
randInt(1, 6); // مثل تاس

// عنصر تصادفی آرایه
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
```
> برای امنیت (توکن، رمز) از `crypto.getRandomValues()` یا `crypto.randomUUID()` استفاده کن، نه `Math.random`.

### کاربردهای ترکیبی
```js
// محدود کردن مقدار (clamp)
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
clamp(15, 0, 10); // → 10

// گرد کردن به n رقم اعشار
const roundTo = (x, d) => Math.round(x * 10 ** d) / 10 ** d;
roundTo(3.14159, 2); // → 3.14

// فاصله‌ی دو نقطه
const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

// میانگین
const avg = (...n) => n.reduce((a, b) => a + b, 0) / n.length;
avg(2, 4, 6); // → 4
```
