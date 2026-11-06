---
title: Object و متدهای آن
description: Object و متدهای آن؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 8
---

## ساخت Object
```js
const user = {
  name: "Ali",
  age: 30,
  "full-name": "Ali Rezaei",         // کلید با خط تیره
  [`id_${1}`]: 101,                  // computed key
  greet() { return `سلام ${this.name}`; },
  get upper() { return this.name.toUpperCase(); },   // getter
  set nick(v) { this._nick = v; },                   // setter
};
```
میان‌بر مقدار:
```js
const name = "Sara", age = 22;
const p = { name, age };   // → { name: "Sara", age: 22 }
```

## دسترسی و تغییر
```js
user.name;            // → "Ali"
user["full-name"];    // → "Ali Rezaei"
user.city = "Tehran"; // افزودن
delete user.age;      // حذف
"name" in user;       // → true
Object.hasOwn(user, "name"); // → true  (جایگزین hasOwnProperty)
user.zzz?.x;          // → undefined (ایمن)
```

---

## متدهای استاتیک `Object.*`

### کلید و مقدار
```js
const o = { a: 1, b: 2 };
Object.keys(o);      // → ["a", "b"]
Object.values(o);    // → [1, 2]
Object.entries(o);   // → [["a", 1], ["b", 2]]
Object.fromEntries([["a", 1], ["b", 2]]); // → { a: 1, b: 2 }
```
ترکیب‌های پرکاربرد:
```js
// map روی مقادیر object
Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v * 10]));
// → { a: 10, b: 20 }

// filter روی object
Object.fromEntries(Object.entries(o).filter(([, v]) => v > 1));
// → { b: 2 }

// Map ↔ Object
new Map(Object.entries(o));
Object.fromEntries(new Map("x", 1));
```

### کپی و ادغام
```js
Object.assign({}, { a: 1 }, { b: 2 });   // → { a: 1, b: 2 }  (shallow)
const merged = { ...{ a: 1 }, ...{ a: 9, b: 2 } };  // → { a: 9, b: 2 }
structuredClone(o);                       // کپی عمیق
```
> کپی عمیق: `structuredClone` (توابع و DOM رو پشتیبانی نمی‌کنه). `JSON.parse(JSON.stringify(x))` فقط داده‌ی ساده رو درست کپی می‌کنه (`Date`, `undefined`, `Map` رو خراب می‌کنه).

### ساخت با prototype مشخص
```js
const animal = { speak() { return "..."; } };
const dog = Object.create(animal);
dog.speak();                        // → "..."
Object.getPrototypeOf(dog) === animal; // → true
Object.setPrototypeOf(dog, null);   // کند، توصیه نمی‌شه
const dict = Object.create(null);   // آبجکت بدون prototype (دیکشنری تمیز)
```

### قفل کردن
| متد | افزودن | حذف | تغییر مقدار |
|---|---|---|---|
| `Object.preventExtensions(o)` | ❌ | ✅ | ✅ |
| `Object.seal(o)` | ❌ | ❌ | ✅ |
| `Object.freeze(o)` | ❌ | ❌ | ❌ |

```js
const f = Object.freeze({ a: 1, inner: { b: 2 } });
f.a = 99;          // نادیده گرفته می‌شه (در strict mode خطا)
f.inner.b = 99;    // freeze سطحیه! این کار می‌کنه
Object.isFrozen(f);      // → true
Object.isSealed(f);      // → true
Object.isExtensible(f);  // → false
```

### Property Descriptor
هر ویژگی ۴ attribute داره: `value, writable, enumerable, configurable`.
```js
const obj = {};
Object.defineProperty(obj, "id", {
  value: 1,
  writable: false,      // قابل تغییر نیست
  enumerable: false,    // در keys و for...in نمیاد
  configurable: false,  // قابل حذف/تنظیم مجدد نیست
});
obj.id = 5;             // بی‌اثر
Object.keys(obj);       // → []

Object.defineProperties(obj, {
  a: { value: 1, enumerable: true },
  b: { get() { return this.a + 1; }, enumerable: true },
});

Object.getOwnPropertyDescriptor(obj, "id");
// → { value: 1, writable: false, enumerable: false, configurable: false }
Object.getOwnPropertyDescriptors(obj);
Object.getOwnPropertyNames(obj);     // شامل غیر enumerable
Object.getOwnPropertySymbols(obj);
```

### مقایسه
```js
Object.is(NaN, NaN);   // → true
Object.is(0, -0);      // → false
```

### گروه‌بندی (ES2024)
```js
Object.groupBy(
  [{ n: "A", t: 1 }, { n: "B", t: 2 }, { n: "C", t: 1 }],
  (x) => x.t
);
// → { 1: [A, C], 2: [B] }
```

---

## متدهای نمونه (روی هر object)
```js
const o2 = { a: 1 };
o2.hasOwnProperty("a");        // → true (قدیمی؛ Object.hasOwn بهتره)
o2.isPrototypeOf({});          // → false
o2.propertyIsEnumerable("a");  // → true
o2.toString();                 // → "[object Object]"
o2.toLocaleString();
o2.valueOf();
```

### `toString` و `valueOf` و `toJSON` سفارشی
```js
const money = {
  amount: 50,
  valueOf() { return this.amount; },
  toString() { return `${this.amount}$`; },
  toJSON() { return { amt: this.amount }; },
};
money + 10;               // → 60      (valueOf)
`${money}`;               // → "50$"   (toString)
JSON.stringify(money);    // → '{"amt":50}'
```

---

## Destructuring
```js
const { name, age: years, city = "نامشخص", ...rest } = {
  name: "Ali", age: 30, x: 1, y: 2,
};
// name="Ali", years=30, city="نامشخص", rest={x:1,y:2}

// تو در تو
const { addr: { zip } } = { addr: { zip: 123 } };
```
جزئیات: [Destructuring](/blog/js-destructuring-spread-rest/).

## پیمایش
```js
for (const [k, v] of Object.entries(o)) console.log(k, v);
Object.entries(o).forEach(([k, v]) => {});
for (const k in o) if (Object.hasOwn(o, k)) {}
```
ترتیب کلیدها: اول کلیدهای عددی (صعودی)، بعد رشته‌ها به ترتیب درج، بعد symbol ها.

## `this` در object
```js
const counter = {
  n: 0,
  inc() { this.n++; return this; },   // chaining
};
counter.inc().inc().n; // → 2
```

## Shorthand و ویژگی‌های مدرن
```js
const key = "dyn";
const o3 = { [key + "1"]: 1 };           // computed
const { a } = { a: 1 };                  // destructuring
const cloned = { ...o3, extra: true };   // spread
const val = o3?.deep?.value ?? "default";
```

## الگوی رایج: شمارش و فهرست
```js
const inventory = { apple: 3, pear: 0, kiwi: 5 };
Object.keys(inventory).length;   // → 3
Object.entries(inventory)
  .filter(([, n]) => n > 0)
  .map(([name]) => name);        // → ["apple", "kiwi"]
```

## خلاصه‌ی `Object.*`
`assign, create, defineProperties, defineProperty, entries, freeze, fromEntries, getOwnPropertyDescriptor(s), getOwnPropertyNames, getOwnPropertySymbols, getPrototypeOf, groupBy, hasOwn, is, isExtensible, isFrozen, isSealed, keys, preventExtensions, seal, setPrototypeOf, values`
