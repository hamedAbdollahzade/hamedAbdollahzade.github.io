---
title: متغیرها و انواع داده
description: متغیرها و انواع داده؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 1
---

## اجرای اولین کد
```js
console.log("Hello, JavaScript!"); // → Hello, JavaScript!
```
- در **مرورگر**: کلید `F12` ← تب Console.
- در **Node.js**: فایل `app.js` بساز و با `node app.js` اجرا کن.

## کامنت‌ها
```js
// کامنت تک‌خطی
/* کامنت
   چندخطی */
```

## تعریف متغیر: `var`، `let`، `const`

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | تابع (function) | بلوک (block) | بلوک (block) |
| تغییر مقدار | بله | بله | **نه** (دوباره‌ریزی ممنوع) |
| تعریف مجدد در یک scope | بله | خیر | خیر |
| Hoisting | بله، با مقدار `undefined` | بله ولی در TDZ | بله ولی در TDZ |

```js
let age = 25;
age = 26;            // مجازه

const PI = 3.14159;
// PI = 3;           // ❌ TypeError: Assignment to constant variable

var old = "قدیمی"; // در کد جدید استفاده نکن
```

> **قانون طلایی:** پیش‌فرض `const`. فقط اگه لازم شد مقدار عوض بشه `let`. از `var` استفاده نکن.

### `const` با آبجکت و آرایه
`const` فقط **ارجاع (reference)** رو قفل می‌کنه، نه محتوا رو:
```js
const user = { name: "Ali" };
user.name = "Reza";   // مجازه
// user = {};         // ❌ خطا

const nums = [1, 2];
nums.push(3);         // مجازه → [1, 2, 3]
```
برای قفل کردن واقعی: `Object.freeze(user)` (در [Object](/blog/js-object-methods/) توضیح داده شده).

## قوانین نام‌گذاری
- با حرف، `_` یا `$` شروع بشه (نه عدد).
- حساس به حروف بزرگ و کوچیکه: `age` ≠ `Age`.
- کلمات رزرو شده (`class`, `return`, ...) ممنوع.
- قرارداد: `camelCase` برای متغیر و تابع، `PascalCase` برای class، `UPPER_SNAKE` برای ثابت‌ها.

```js
let firstName = "Sara";
const MAX_RETRY = 3;
class UserAccount {}
```

---

## انواع داده (Data Types)

جاوا اسکریپت **۸ نوع** داره: ۷ نوع **primitive** و ۱ نوع **object**.

### Primitive ها
```js
// 1) string
const s = "سلام";
const s2 = 'single';
const s3 = `template ${1 + 2}`; // → "template 3"

// 2) number (عدد صحیح و اعشاری، هر دو)
const n = 42;
const f = 3.14;
const inf = Infinity;
const notNum = NaN;            // Not a Number

// 3) bigint (عدد بسیار بزرگ)
const big = 9007199254740993n;

// 4) boolean
const yes = true;
const no = false;

// 5) undefined (مقدار نگرفته)
let x;
console.log(x); // → undefined

// 6) null (خالی بودن عمدی)
const empty = null;

// 7) symbol (شناسه‌ی یکتا)
const id = Symbol("id");
```

### Object
همه‌چیز غیر از primitive ها: آبجکت، آرایه، تابع، Date، Map و ...
```js
const person = { name: "Ali", age: 30 };
const list = [1, 2, 3];
function hello() {}
```

## `typeof`
```js
typeof "hi";        // → "string"
typeof 10;          // → "number"
typeof 10n;         // → "bigint"
typeof true;        // → "boolean"
typeof undefined;   // → "undefined"
typeof Symbol();    // → "symbol"
typeof {};          // → "object"
typeof [];          // → "object"  (آرایه هم object است)
typeof function(){};// → "function"
typeof null;        // → "object"  ⚠️ باگ تاریخی زبان
```
تشخیص دقیق‌تر:
```js
Array.isArray([]);                       // → true
Object.prototype.toString.call(null);    // → "[object Null]"
Number.isNaN(NaN);                       // → true
```

## تبدیل نوع (Type Conversion)

### صریح (Explicit)
```js
Number("42");     // → 42
Number("abc");    // → NaN
Number("");       // → 0
Number(true);     // → 1
String(123);      // → "123"
String(null);     // → "null"
Boolean("");      // → false
Boolean("0");     // → true (رشته‌ی غیرخالی)
parseInt("42px"); // → 42
parseFloat("3.14abc"); // → 3.14
```

### ضمنی (Implicit / Coercion)
```js
"5" + 2;    // → "52"  (+ با رشته = الحاق)
"5" - 2;    // → 3     (- فقط عددیه)
"5" * "2";  // → 10
true + 1;   // → 2
[] + {};    // → "[object Object]"
```

### مقادیر Falsy
فقط این ۸ مقدار در شرط‌ها `false` حساب می‌شن:
```js
false, 0, -0, 0n, "", null, undefined, NaN
```
هر چیز دیگه‌ای **truthy**ـه (حتی `"0"`, `[]`, `{}`).

## Primitive در برابر Reference

```js
// primitive: کپی مقدار
let a = 10;
let b = a;
b = 20;
console.log(a); // → 10

// object: کپی ارجاع (هر دو به یک آبجکت اشاره می‌کنن)
const o1 = { v: 1 };
const o2 = o1;
o2.v = 99;
console.log(o1.v); // → 99
```

## Template Literals
```js
const name = "Ali";
const msg = `سلام ${name}
این یک رشته‌ی چندخطیه و حاصل 2+3 برابر ${2 + 3} است`;
console.log(msg);
```

### Tagged template
```js
function tag(strings, ...values) {
  return strings.raw.join("|") + " :: " + values.join(",");
}
tag`a${1}b${2}c`; // → "a|b|c :: 1,2"
```

## خروجی و ورودی ساده
```js
console.log("log");
console.error("خطا");
console.warn("هشدار");
console.table([{ a: 1 }, { a: 2 }]);   // جدول
console.group("گروه"); console.log("داخل"); console.groupEnd();
console.time("t"); /* کد */ console.timeEnd("t");

// فقط در مرورگر
// alert("پیام"); confirm("مطمئنی؟"); prompt("اسمت؟");
```
