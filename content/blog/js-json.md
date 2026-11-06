---
title: JSON
description: JSON (JavaScript Object Notation) یک فرمت متنی برای تبادل داده است. قوانین
date: 2026-11-06
category: JavaScript
order: 10
---

**JSON** (JavaScript Object Notation) یک فرمت متنی برای تبادل داده است. قوانین:
- کلیدها **حتماً** داخل `"` دوتایی.
- رشته‌ها فقط با `"` دوتایی.
- بدون کامنت، بدون کاما‌ی آخر (trailing comma)، بدون `undefined`، تابع، `NaN`.
- مقادیر مجاز: رشته، عدد، `true/false`، `null`، آرایه، object.

```json
{
  "name": "Ali",
  "age": 30,
  "skills": ["js", "css"],
  "address": { "city": "Tehran" },
  "active": true,
  "spouse": null
}
```

## `JSON.stringify` (object → رشته)
```js
const user = { name: "Ali", age: 30, skills: ["js"] };

JSON.stringify(user);
// → '{"name":"Ali","age":30,"skills":["js"]}'

JSON.stringify(user, null, 2);    // زیبا با ۲ فاصله
JSON.stringify(user, null, "\t"); // با Tab
```

### رفتار با مقادیر خاص
```js
JSON.stringify({ a: undefined, b: () => {}, c: Symbol("x") });
// → '{}'   (در object حذف می‌شن)
JSON.stringify([undefined, () => {}]);
// → '[null,null]'  (در آرایه به null تبدیل می‌شن)
JSON.stringify({ n: NaN, i: Infinity });
// → '{"n":null,"i":null}'
JSON.stringify(new Date(0));
// → '"1970-01-01T00:00:00.000Z"'   (از toJSON استفاده می‌کنه)
JSON.stringify(new Map(1, 2));
// → '{}'  ❌ (Map و Set رو نمی‌فهمه)
JSON.stringify("hi");  // → '"hi"'
JSON.stringify(10n);   // ❌ TypeError (BigInt)
```

### آرگومان دوم: `replacer`
**آرایه** → فقط این کلیدها:
```js
JSON.stringify(user, ["name"]);   // → '{"name":"Ali"}'
```
**تابع** → هر کلید/مقدار از فیلتر رد می‌شه:
```js
JSON.stringify({ a: 1, secret: "x", b: 2 }, (key, value) =>
  key === "secret" ? undefined : value
);
// → '{"a":1,"b":2}'
```

### `toJSON` سفارشی
```js
class Temp {
  constructor(c) { this.c = c; }
  toJSON() { return { celsius: this.c, f: this.c * 1.8 + 32 }; }
}
JSON.stringify(new Temp(100)); // → '{"celsius":100,"f":212}'
```

### مرجع دایره‌ای (Circular)
```js
const a = {}; a.self = a;
// JSON.stringify(a) → ❌ TypeError: Converting circular structure to JSON
```

## `JSON.parse` (رشته → object)
```js
JSON.parse('{"a":1,"b":[1,2]}');  // → { a: 1, b: [1, 2] }
JSON.parse("123");                // → 123
JSON.parse('"hi"');               // → "hi"
JSON.parse("true");               // → true
JSON.parse("null");               // → null
```
### خطا
```js
try {
  JSON.parse("{name: 'Ali'}");   // کلید و رشته بدون " دوتایی
} catch (e) {
  console.log(e.name);           // → "SyntaxError"
}
```
تابع امن:
```js
const safeParse = (str, fallback = null) => {
  try { return JSON.parse(str); } catch { return fallback; }
};
```

### آرگومان دوم: `reviver`
```js
const text = '{"d":"2024-03-15T00:00:00.000Z","n":5}';
JSON.parse(text, (key, value) =>
  key === "d" ? new Date(value) : value
);
// → { d: Date(...), n: 5 }
```

## کپی عمیق (محدودیت‌دار)
```js
const copy = JSON.parse(JSON.stringify({ a: [1, { b: 2 }] }));
```
خراب می‌کنه: `Date` (رشته می‌شه)، `undefined`، توابع، `Map/Set`، `NaN`، مرجع دایره‌ای. بهتر: `structuredClone()`.

## کاربرد: localStorage
```js
localStorage.setItem("user", JSON.stringify({ name: "Ali" }));
const u = JSON.parse(localStorage.getItem("user") ?? "null");
```

## کاربرد: fetch
```js
const res = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Ali" }),
});
const data = await res.json();   // معادل JSON.parse(await res.text())
```

## تبدیل Map و Set
```js
const m = new Map("a", 1);
JSON.stringify([...m]);                  // → '"a",1'
JSON.stringify(Object.fromEntries(m));   // → '{"a":1}'
new Map(JSON.parse('"a",1'));        // بازسازی
JSON.stringify([...new Set([1, 2])]);    // → '[1,2]'
```

## `JSON.rawJSON` / `JSON.isRawJSON`
(قابلیت جدید؛ در Node 24 و مرورگرهای تازه موجوده) برای نوشتن عدد خیلی بزرگ بدون از دست رفتن دقت:
```js
JSON.stringify({ big: JSON.rawJSON("12345678901234567890") });
```

## فایل `.json` در Node
```js
import fs from "node:fs";
const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
fs.writeFileSync("out.json", JSON.stringify(data, null, 2));
```
