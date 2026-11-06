---
title: Map، Set، WeakMap، WeakSet
description: Map، Set، WeakMap، WeakSet؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 11
---

## Map
دیکشنری کلید-مقدار که **کلید می‌تونه هر نوعی** باشه (حتی object و تابع) و **ترتیب درج** رو حفظ می‌کنه.

```js
const m = new Map();
m.set("name", "Ali");
m.set(42, "عدد");
m.set({ id: 1 }, "object key");
m.set("a", 1).set("b", 2);        // قابل زنجیره

m.get("name");     // → "Ali"
m.get("zzz");      // → undefined
m.has(42);         // → true
m.delete(42);      // → true
m.size;            // → تعداد (property است، نه متد)
m.clear();         // حذف همه
```

### ساخت از آرایه
```js
const m2 = new Map([["a", 1], ["b", 2]]);
const fromObj = new Map(Object.entries({ x: 1, y: 2 }));
```

### پیمایش
```js
for (const [k, v] of m2) console.log(k, v);
m2.forEach((v, k) => console.log(k, v));   // دقت: ترتیب (value, key)
[...m2.keys()];      // → ["a", "b"]
[...m2.values()];    // → [1, 2]
[...m2.entries()];   // → [["a",1],["b",2]]
```

### تبدیل
```js
Object.fromEntries(m2);   // → { a: 1, b: 2 }
[...m2];                  // → [["a",1],["b",2]]
```

### Map در برابر Object

| | Map | Object |
|---|---|---|
| نوع کلید | هر چیزی | رشته/Symbol |
| ترتیب | درج | (عددی‌ها اول) |
| تعداد | `m.size` | `Object.keys(o).length` |
| عملکرد با افزودن/حذف زیاد | بهتر | ضعیف‌تر |
| JSON | مستقیم نه | مستقیم |
| کلیدهای پیش‌فرض | ندارد | prototype دارد |

### مثال: شمارنده با Map
```js
const count = new Map();
for (const w of "a b a c b a".split(" ")) {
  count.set(w, (count.get(w) ?? 0) + 1);
}
// → Map { "a" => 3, "b" => 2, "c" => 1 }
```
### Map.groupBy (ES2024)
```js
Map.groupBy([1, 2, 3, 4], (n) => (n % 2 ? "odd" : "even"));
// → Map { "odd" => [1,3], "even" => [2,4] }
```

---

## Set
مجموعه‌ای از مقادیر **یکتا**.

```js
const s = new Set([1, 2, 2, 3, 3]);
s;                // → Set(3) { 1, 2, 3 }

s.add(4).add(1);  // افزودن (تکراری نادیده گرفته می‌شه)
s.has(2);         // → true
s.delete(2);      // → true
s.size;           // → 3
s.clear();
```
تساوی با `SameValueZero`: `NaN` با `NaN` برابره و `0` با `-0` یکیه. object ها با ارجاع مقایسه می‌شن.
```js
new Set([NaN, NaN]).size;           // → 1
new Set([{}, {}]).size;             // → 2
```

### پیمایش
```js
for (const v of new Set(["a", "b"])) console.log(v);
new Set([1, 2]).forEach((v) => console.log(v));
[...new Set([3, 4]).values()];   // → [3, 4]
```

### کاربردها
```js
// حذف تکراری
const unique = [...new Set([1, 1, 2, 3, 3])];   // → [1, 2, 3]

// تعداد حروف یکتا
new Set("mississippi").size;   // → 4

// بررسی سریع عضویت (O(1) به جای includes با O(n))
const allowed = new Set(["admin", "editor"]);
allowed.has(role);
```

### عملیات مجموعه‌ای
```js
const A = new Set([1, 2, 3]);
const B = new Set([2, 3, 4]);

const union = new Set([...A, ...B]);                    // → {1,2,3,4}
const inter = new Set([...A].filter((x) => B.has(x)));  // → {2,3}
const diff  = new Set([...A].filter((x) => !B.has(x))); // → {1}
const subset = [...A].every((x) => B.has(x));           // → false
```
ES2025 متدهای داخلی اضافه کرده:
```js
A.union(B); A.intersection(B); A.difference(B);
A.symmetricDifference(B); A.isSubsetOf(B);
A.isSupersetOf(B); A.isDisjointFrom(B);
```

---

## WeakMap
مثل Map ولی:
- کلیدها **فقط object** (یا symbol غیر ثبت‌شده).
- ارجاع به کلید **ضعیفه**: اگه هیچ جای دیگه‌ای به object ارجاعی نباشه، Garbage Collector اجازه داره پاکش کنه.
- **قابل پیمایش نیست** و `size` نداره.
- متدها: `get, set, has, delete`.

```js
const priv = new WeakMap();

class User {
  constructor(name, pass) {
    this.name = name;
    priv.set(this, { pass });   // داده‌ی خصوصی
  }
  check(p) { return priv.get(this).pass === p; }
}
```
کاربرد: cache یا metadata برای object ها بدون نشت حافظه:
```js
const cache = new WeakMap();
function heavy(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const result = JSON.stringify(obj);     // محاسبه‌ی سنگین
  cache.set(obj, result);
  return result;
}
```

## WeakSet
مثل Set با کلیدهای ضعیف؛ فقط `add, has, delete`.
```js
const visited = new WeakSet();
function visit(node) {
  if (visited.has(node)) return;
  visited.add(node);
}
```

## WeakRef و FinalizationRegistry
```js
let target = { big: new Array(1e6) };
const ref = new WeakRef(target);
ref.deref();                // → target (یا undefined اگه جمع‌آوری شده)

const reg = new FinalizationRegistry((held) => console.log("پاک شد:", held));
reg.register(target, "my-object");
```
> کاربردشون محدود و پیشرفته‌ست. زمان GC قابل پیش‌بینی نیست.

---

## خلاصه
| ساختار | کلید | تکرار مجاز | پیمایش | کاربرد |
|---|---|---|---|---|
| Object | رشته/Symbol | کلید نه | بله | داده‌ی ساختاریافته |
| Array | اندیس | بله | بله | لیست مرتب |
| Map | هر چیز | کلید نه | بله | دیکشنری انعطاف‌پذیر |
| Set | — | مقدار نه | بله | مجموعه‌ی یکتا |
| WeakMap | object | کلید نه | **خیر** | metadata / cache |
| WeakSet | object | مقدار نه | **خیر** | نشان‌گذاری object ها |
