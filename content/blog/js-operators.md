---
title: عملگرها (Operators)
description: عملگرها (Operators)؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 2
---

## ریاضی
```js
5 + 2;   // → 7
5 - 2;   // → 3
5 * 2;   // → 10
5 / 2;   // → 2.5
5 % 2;   // → 1   (باقیمانده)
2 ** 3;  // → 8   (توان)
```
### افزایش و کاهش
```js
let i = 5;
i++;  // → 5 (مقدار قبلی رو برمی‌گردونه، بعد i=6)
++i;  // → 7 (اول زیاد می‌کنه، بعد برمی‌گردونه)
i--;  // کاهش
```
### دقت اعشاری
```js
0.1 + 0.2;                         // → 0.30000000000000004
(0.1 + 0.2).toFixed(2);            // → "0.30"
Math.abs(0.3 - (0.1 + 0.2)) < Number.EPSILON; // → true
```

## انتساب
```js
let x = 10;
x += 5;   // x = x + 5  → 15
x -= 3;   // 12
x *= 2;   // 24
x /= 4;   // 6
x %= 4;   // 2
x **= 3;  // 8
```
### انتساب منطقی (ES2021)
```js
let a = null;
a ??= 5;   // اگه null/undefined بود → 5
let b = 0;
b ||= 7;   // اگه falsy بود → 7
let c = 1;
c &&= 9;   // اگه truthy بود → 9
```

## مقایسه
```js
5 == "5";    // → true   (با تبدیل نوع)
5 === "5";   // → false  (بدون تبدیل، توصیه می‌شه)
5 != "5";    // → false
5 !== "5";   // → true
5 > 3;  5 >= 5;  3 < 5;  3 <= 3;   // → true
```
> **همیشه `===` و `!==` استفاده کن.**

نکات خاص:
```js
NaN === NaN;           // → false  (برای تشخیص: Number.isNaN)
Object.is(NaN, NaN);   // → true
null == undefined;     // → true
null === undefined;    // → false
[] == false;           // → true (!)
```

## منطقی
```js
true && false;  // → false  (AND)
true || false;  // → true   (OR)
!true;          // → false  (NOT)
```
### Short-circuit
`&&` و `||` **مقدار خود عملوند** رو برمی‌گردونن، نه فقط boolean:
```js
"a" && "b";     // → "b"
0 && "b";       // → 0
"" || "پیش‌فرض"; // → "پیش‌فرض"
"x" || "y";     // → "x"

user && user.save();   // فقط اگه user وجود داشت
const name = input || "ناشناس";
```

## Nullish Coalescing `??`
فقط برای `null` و `undefined` مقدار پیش‌فرض می‌ده:
```js
0 || 10;      // → 10   (0 falsy است)
0 ?? 10;      // → 0
null ?? 10;   // → 10
"" ?? "x";    // → ""
```

## Optional Chaining `?.`
```js
const user = { profile: { city: "Tehran" } };
user.profile?.city;        // → "Tehran"
user.address?.city;        // → undefined (بدون خطا)
user.getName?.();          // → undefined اگه تابع نبود
user.list?.[0];            // → undefined
```

## شرطی (Ternary)
```js
const age = 20;
const status = age >= 18 ? "بزرگسال" : "نوجوان";
```

## رشته‌ای
```js
"سلام " + "دنیا";   // → "سلام دنیا"
let t = "a"; t += "b"; // → "ab"
```

## bitwise
```js
5 & 3;   // → 1  (AND)
5 | 3;   // → 7  (OR)
5 ^ 3;   // → 6  (XOR)
~5;      // → -6 (NOT)
5 << 1;  // → 10 (شیفت چپ = ×2)
5 >> 1;  // → 2  (شیفت راست = ÷2)
5 >>> 1; // → 2  (شیفت بدون علامت)
```
کاربرد: flag ها و permission ها
```js
const READ = 1, WRITE = 2, EXEC = 4;
let perm = READ | WRITE;      // → 3
(perm & WRITE) !== 0;         // → true
```

## سایر عملگرها
```js
// comma
let r = (1, 2, 3);   // → 3

// typeof / instanceof / in
typeof 5;                   // → "number"
[] instanceof Array;        // → true
"name" in { name: "a" };    // → true

// delete
const o = { a: 1, b: 2 };
delete o.a;                 // o → { b: 2 }

// void
void 0;                     // → undefined

// spread
const arr = [1, 2];
[...arr, 3];                // → [1, 2, 3]
```

## اولویت عملگرها (خلاصه)
از زیاد به کم:
1. `()` پرانتز
2. `++ -- !` یکانی
3. `**`
4. `* / %`
5. `+ -`
6. `< <= > >=`
7. `== != === !==`
8. `&&`
9. `||` و `??`
10. `?:` شرطی
11. `=` و انتسابی‌ها

> وقتی مطمئن نیستی، پرانتز بذار.
