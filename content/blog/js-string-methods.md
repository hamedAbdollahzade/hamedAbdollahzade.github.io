---
title: متدهای String
description: رشته‌ها immutable هستن: هیچ متدی رشته‌ی اصلی رو تغییر نمی‌ده، همیشه رشته‌ی جدید برمی‌گردونه.
date: 2026-11-06
category: JavaScript
order: 5
---

رشته‌ها **immutable** هستن: هیچ متدی رشته‌ی اصلی رو تغییر نمی‌ده، همیشه رشته‌ی جدید برمی‌گردونه.

```js
const s = "Hello, World";
```

## ویژگی
```js
s.length; // → 12
s[0];     // → "H"
s.at(-1); // → "d"  (اندیس منفی از آخر)
```

## جستجو

| متد | کار |
|---|---|
| `indexOf(x, from?)` | اولین اندیس، یا `-1` |
| `lastIndexOf(x)` | آخرین اندیس |
| `includes(x)` | آیا شامل هست؟ |
| `startsWith(x)` | شروع با؟ |
| `endsWith(x)` | پایان با؟ |
| `search(regex)` | اندیس اولین تطابق regex |
| `match(regex)` | تطابق‌ها |
| `matchAll(regex)` | iterator همه‌ی تطابق‌ها (با گروه‌ها) |

```js
s.indexOf("o");        // → 4
s.lastIndexOf("o");    // → 8
s.indexOf("zzz");      // → -1
s.includes("World");   // → true
s.startsWith("Hello"); // → true
s.endsWith("d");       // → true
s.search(/W/);         // → 7
"a1b22".match(/\d+/g); // → ["1", "22"]
[..."a1b22".matchAll(/(\d+)/g)].map(m => m[1]); // → ["1", "22"]
```

## استخراج بخشی از رشته
```js
s.slice(0, 5);    // → "Hello"
s.slice(-5);      // → "World"
s.slice(7);       // → "World"
s.substring(7, 12); // → "World"  (اندیس منفی رو 0 می‌گیره)
s.substr(7, 5);   // → "World"  ⚠️ منسوخ (deprecated)
s.charAt(1);      // → "e"
s.charCodeAt(0);  // → 72
s.codePointAt(0); // → 72  (برای ایموجی و یونیکد درست‌تره)
```
> `slice` رو ترجیح بده.

## تغییر حروف
```js
s.toUpperCase();   // → "HELLO, WORLD"
s.toLowerCase();   // → "hello, world"
s.toLocaleUpperCase("tr"); // با قواعد محلی زبان
"ǆ".normalize();   // نرمال‌سازی یونیکد
```

حرف اول بزرگ:
```js
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
cap("ali"); // → "Ali"
```

## حذف فاصله
```js
"  hi  ".trim();       // → "hi"
"  hi  ".trimStart();  // → "hi  "
"  hi  ".trimEnd();    // → "  hi"
```

## پر کردن (Padding)
```js
"5".padStart(3, "0");   // → "005"
"5".padEnd(3, "*");     // → "5**"
```

## تکرار
```js
"ab".repeat(3); // → "ababab"
```

## جایگزینی
```js
"a-b-c".replace("-", "+");       // → "a+b-c"  (فقط اولی)
"a-b-c".replaceAll("-", "+");    // → "a+b+c"
"a-b-c".replace(/-/g, "+");      // → "a+b+c"
"john smith".replace(/(\w+) (\w+)/, "$2 $1"); // → "smith john"
"abc".replace(/b/, (m) => m.toUpperCase());   // → "aBc"
```

## جدا کردن و چسباندن
```js
"a,b,c".split(",");        // → ["a", "b", "c"]
"abc".split("");           // → ["a", "b", "c"]
"a,b,c".split(",", 2);     // → ["a", "b"]
"a1b2".split(/\d/);        // → ["a", "b", ""]
["a", "b"].join("-");      // → "a-b"
"a".concat("b", "c");      // → "abc"
```

## مقایسه
```js
"a".localeCompare("b");    // → -1
"b".localeCompare("a");    // → 1
"a".localeCompare("a");    // → 0
["ب", "الف"].sort((x, y) => x.localeCompare(y, "fa")); // → ["الف", "ب"]
```

## یونیکد
```js
"😀".length;                 // → 2  (surrogate pair)
[..."😀"].length;            // → 1
String.fromCharCode(72, 105);       // → "Hi"
String.fromCodePoint(128512);       // → "😀"
String.raw`C:\new\table`;           // → "C:\\new\\table" (بدون escape)
"x".isWellFormed?.();               // ES2024
```

## متدهای کاربردی ترکیبی
```js
// معکوس کردن رشته
[..."hello"].reverse().join("");   // → "olleh"

// شمارش تکرار یک حرف
"banana".split("a").length - 1;    // → 3

// پالیندروم
const isPal = (t) => t === [...t].reverse().join("");
isPal("level"); // → true

// slug
"Hello World JS".toLowerCase().split(" ").join("-"); // → "hello-world-js"

// کوتاه کردن با ...
const cut = (t, n) => (t.length > n ? t.slice(0, n) + "…" : t);
cut("طولانی‌ترین متن", 5);
```

## Escape Characters
| کاراکتر | معنی |
|---|---|
| `\n` | خط جدید |
| `\t` | Tab |
| `\\` | بک‌اسلش |
| `\"` `\'` | کوتیشن |
| `\u0041` | یونیکد (`A`) |

```js
console.log("خط۱\nخط۲\tTab");
```

## خلاصه‌ی همه‌ی متدها
`at`, `charAt`, `charCodeAt`, `codePointAt`, `concat`, `endsWith`, `includes`, `indexOf`, `lastIndexOf`, `localeCompare`, `match`, `matchAll`, `normalize`, `padEnd`, `padStart`, `repeat`, `replace`, `replaceAll`, `search`, `slice`, `split`, `startsWith`, `substring`, `toLocaleLowerCase`, `toLocaleUpperCase`, `toLowerCase`, `toString`, `toUpperCase`, `trim`, `trimEnd`, `trimStart`, `valueOf`, `isWellFormed`, `toWellFormed`
