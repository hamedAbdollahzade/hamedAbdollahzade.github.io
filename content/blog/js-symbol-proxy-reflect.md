---
title: Symbol، Proxy، Reflect
description: Symbol، Proxy، Reflect؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 24
---

## Symbol

یک مقدار primitive **یکتا** و تغییرناپذیر؛ معمولاً برای کلید ویژگی‌هایی که نباید با بقیه تداخل کنن.

```js
const id1 = Symbol("id");
const id2 = Symbol("id");
id1 === id2;          // → false
id1.description;      // → "id"
id1.toString();       // → "Symbol(id)"
```

### کلید object
```js
const ID = Symbol("id");
const user = { name: "Ali", [ID]: 123 };
user[ID];                   // → 123
Object.keys(user);          // → ["name"]  (symbol ها دیده نمی‌شن)
JSON.stringify(user);       // → '{"name":"Ali"}'
Object.getOwnPropertySymbols(user);   // → [Symbol(id)]
Reflect.ownKeys(user);                // → ["name", Symbol(id)]
```

### رجیستری سراسری
```js
Symbol.for("app.key") === Symbol.for("app.key");   // → true
Symbol.keyFor(Symbol.for("app.key"));              // → "app.key"
```

### Well-known Symbols
سفارشی‌سازی رفتار داخلی زبان:

| Symbol | کاربرد |
|---|---|
| `Symbol.iterator` | iterable بودن (for...of) |
| `Symbol.asyncIterator` | for await |
| `Symbol.toPrimitive` | تبدیل به primitive |
| `Symbol.toStringTag` | خروجی `Object.prototype.toString` |
| `Symbol.hasInstance` | رفتار `instanceof` |
| `Symbol.species` | سازنده‌ی خروجی متدهای مشتق |
| `Symbol.isConcatSpreadable` | رفتار `concat` |
| `Symbol.match / replace / search / split` | سفارشی‌سازی متدهای string |
| `Symbol.unscopables` | حذف از `with` |

```js
const money = {
  amount: 100,
  [Symbol.toPrimitive](hint) {          // "number" | "string" | "default"
    return hint === "string" ? `${this.amount}$` : this.amount;
  },
};
+money;          // → 100
`${money}`;      // → "100$"
money + 1;       // → 101

class Coll { get [Symbol.toStringTag]() { return "Coll"; } }
String(new Coll());   // → "[object Coll]"
```

---

## Proxy

یک **واسطه** دور یک object که عملیات پایه (خواندن، نوشتن، حذف، ...) رو شنود و سفارشی می‌کنه.

```js
const target = { name: "Ali", age: 30 };

const proxy = new Proxy(target, {
  get(t, prop, receiver) {
    console.log(`خواندن ${String(prop)}`);
    return Reflect.get(t, prop, receiver);
  },
  set(t, prop, value, receiver) {
    console.log(`نوشتن ${String(prop)} = ${value}`);
    return Reflect.set(t, prop, value, receiver);
  },
});

proxy.name;       // چاپ: خواندن name → "Ali"
proxy.age = 31;   // چاپ: نوشتن age = 31
```
> `set` باید `true` برگردونه، وگرنه در strict mode خطا می‌ده.

### Trap های موجود
`get, set, has, deleteProperty, ownKeys, getOwnPropertyDescriptor, defineProperty, getPrototypeOf, setPrototypeOf, isExtensible, preventExtensions, apply, construct`

### مثال: اعتبارسنجی
```js
const validated = new Proxy({}, {
  set(t, prop, value) {
    if (prop === "age" && (!Number.isInteger(value) || value < 0)) {
      throw new TypeError("age باید عدد صحیح مثبت باشه");
    }
    t[prop] = value;
    return true;
  },
});
validated.age = 20;       // OK
// validated.age = -5;    // ❌ TypeError
```

### مثال: مقدار پیش‌فرض
```js
const withDefault = (obj, def) =>
  new Proxy(obj, { get: (t, p) => (p in t ? t[p] : def) });
const cfg = withDefault({ a: 1 }, 0);
cfg.a;   // → 1
cfg.zzz; // → 0
```

### مثال: اندیس منفی در آرایه
```js
const neg = (arr) =>
  new Proxy(arr, {
    get(t, p, r) {
      const i = Number(p);
      return Number.isInteger(i) && i < 0
        ? t[t.length + i]
        : Reflect.get(t, p, r);
    },
  });
neg([1, 2, 3])[-1];   // → 3
```

### مثال: کلیدهای خصوصی (`_x`)
```js
const hide = (o) =>
  new Proxy(o, {
    has: (t, p) => !p.startsWith?.("_") && p in t,
    ownKeys: (t) => Reflect.ownKeys(t).filter((k) => typeof k !== "string" || !k.startsWith("_")),
    get: (t, p) => (typeof p === "string" && p.startsWith("_") ? undefined : t[p]),
  });
```

### Proxy روی تابع
```js
const logged = new Proxy(function add(a, b) { return a + b; }, {
  apply(fn, thisArg, args) {
    console.log("فراخوانی با", args);
    return fn(...args);
  },
});
logged(1, 2);  // چاپ و → 3
```

### Reactive ساده (ایده‌ی Vue 3)
```js
function reactive(obj, onChange) {
  return new Proxy(obj, {
    set(t, k, v, r) {
      const ok = Reflect.set(t, k, v, r);
      onChange(k, v);
      return ok;
    },
  });
}
const state = reactive({ count: 0 }, (k, v) => console.log(`${k} → ${v}`));
state.count++;   // چاپ: count → 1
```

### Proxy قابل لغو
```js
const { proxy: p, revoke } = Proxy.revocable({ a: 1 }, {});
p.a;        // → 1
revoke();
// p.a      // ❌ TypeError
```

### محدودیت‌ها
- کندتر از دسترسی مستقیم.
- Proxy با فیلدهای `#private` کلاس‌ها مشکل داره (this باید خود object باشه).
- برابری: `proxy !== target`.

---

## Reflect

مجموعه‌ی توابع استاتیک که **همون عملیات پایه‌ی زبان** رو به‌صورت تابع ارائه می‌کنن (متناظر trap های Proxy).

```js
const o = { a: 1 };

Reflect.get(o, "a");                 // → 1
Reflect.set(o, "b", 2);              // → true
Reflect.has(o, "a");                 // → true  (مثل "a" in o)
Reflect.deleteProperty(o, "a");      // → true  (مثل delete)
Reflect.ownKeys(o);                  // → ["b"]  (شامل Symbol و غیر enumerable)
Reflect.getPrototypeOf(o);
Reflect.setPrototypeOf(o, null);
Reflect.defineProperty(o, "x", { value: 1 });   // → true/false (بدون throw)
Reflect.getOwnPropertyDescriptor(o, "b");
Reflect.apply(Math.max, null, [1, 5, 3]);        // → 5
Reflect.construct(Date, [2024, 0, 1]);           // مثل new Date(2024,0,1)
Reflect.isExtensible(o);
Reflect.preventExtensions(o);
```
### چرا Reflect؟
- به‌جای عملگرهای پراکنده (`in`, `delete`, `new`) یک API یکدست.
- برخلاف `Object.defineProperty`، به‌جای throw کردن `true/false` برمی‌گردونه.
- داخل Proxy برای **ارسال عملیات به target** با `receiver` درست.

```js
const p = new Proxy({}, {
  get(t, k, r) { return Reflect.get(t, k, r); },   // رفتار پیش‌فرض
});
```

## خلاصه
| | کاربرد |
|---|---|
| Symbol | کلید یکتا، هوک‌های داخلی زبان |
| Proxy | شنود و سفارشی‌سازی عملیات object |
| Reflect | API تابعی برای عملیات پایه؛ همراه Proxy |
