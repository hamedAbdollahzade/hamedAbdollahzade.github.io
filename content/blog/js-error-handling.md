---
title: مدیریت خطا (Error Handling)
description: مدیریت خطا (Error Handling)؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 17
---

## `try / catch / finally`
```js
try {
  const data = JSON.parse("{bad json}");
} catch (err) {
  console.log("خطا:", err.message);
} finally {
  console.log("همیشه اجرا می‌شه");   // حتی با return داخل try
}
```
- `catch` بدون پارامتر (ES2019): `catch { ... }`
- `finally` برای آزاد کردن منابع (بستن فایل، قطع اتصال، پنهان کردن loading).

## `throw`
می‌تونی هر مقداری throw کنی ولی **همیشه Error بنداز**:
```js
function divide(a, b) {
  if (b === 0) throw new Error("تقسیم بر صفر");
  return a / b;
}
try { divide(1, 0); } catch (e) { console.log(e.message); }
```

## ساختار Error
```js
const e = new Error("پیام", { cause: originalError });
e.name;      // → "Error"
e.message;   // → "پیام"
e.stack;     // → رشته‌ی stack trace
e.cause;     // → خطای اصلی (ES2022)
```

## انواع داخلی

| نوع | وقتی... |
|---|---|
| `Error` | عمومی |
| `TypeError` | نوع اشتباه: `null.x`، `5()` |
| `ReferenceError` | متغیر تعریف نشده |
| `SyntaxError` | ساختار نادرست (`JSON.parse`, `eval`) |
| `RangeError` | خارج از محدوده (`new Array(-1)`, recursion بی‌نهایت) |
| `URIError` | `decodeURI` ناصحیح |
| `EvalError` | قدیمی |
| `AggregateError` | چند خطا (Promise.any) |

```js
try { null.x; }          catch (e) { e instanceof TypeError;      } // true
try { undefinedVar; }    catch (e) { e instanceof ReferenceError; } // true
try { new Array(-1); }   catch (e) { e instanceof RangeError;     } // true
```

## خطای سفارشی
```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class HttpError extends Error {
  constructor(status, message, options) {
    super(message, options);
    this.name = "HttpError";
    this.status = status;
  }
}

try {
  throw new ValidationError("ایمیل نامعتبر", "email");
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(`${e.field}: ${e.message}`);
  } else {
    throw e;                    // خطایی که نمی‌شناسی رو دوباره بنداز
  }
}
```

## Re-throw و wrap کردن
```js
try {
  JSON.parse(text);
} catch (err) {
  throw new Error("فایل تنظیمات خراب است", { cause: err });
}
```

## خطا در کد ناهمزمان

### Callback / setTimeout
`try/catch` معمولی **نمی‌گیره**:
```js
try {
  setTimeout(() => { throw new Error("x"); }, 0);   // ❌ گرفته نمی‌شه
} catch {}
```

### Promise
```js
fetch("/x")
  .then((r) => r.json())
  .catch((e) => console.log("خطا:", e))
  .finally(() => console.log("تمام"));
```

### async/await
```js
async function load() {
  try {
    const res = await fetch("/api");
    if (!res.ok) throw new HttpError(res.status, "خطای سرور");
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}
```
> `fetch` فقط روی خطای شبکه reject می‌شه؛ `404`/`500` رو خودت با `res.ok` چک کن.

### الگوی Go-style
```js
async function to(promise) {
  try { return [null, await promise]; }
  catch (e) { return [e]; }
}
const [err, data] = await to(fetch("/api"));
if (err) { /* ... */ }
```

## خطاهای مدیریت‌نشده (Global)
```js
// مرورگر
window.addEventListener("error", (e) => console.log(e.message));
window.addEventListener("unhandledrejection", (e) => console.log(e.reason));

// Node
process.on("uncaughtException", (e) => { /* لاگ و خروج */ });
process.on("unhandledRejection", (reason) => { /* ... */ });
```

## Promise.allSettled
وقتی نمی‌خوای با اولین خطا همه‌چیز fail بشه:
```js
const results = await Promise.allSettled([p1, p2, p3]);
results.filter((r) => r.status === "rejected");
```

## بهترین روش‌ها
- فقط جایی `catch` کن که **می‌تونی کاری باهاش بکنی**.
- خطا رو **قورت نده**: `catch {}` خالی ممنوع.
- پیام خطا رو برای کاربر و جزئیات رو برای لاگ جدا نگه دار.
- از `Error` استفاده کن (stack trace داره)، نه رشته.
- با `cause` زنجیره‌ی خطا رو حفظ کن.
- ورودی‌ها رو **زود validate** کن (Guard clause).

## دیباگ
```js
console.error(err);
console.trace("از کجا صدا زده شد؟");
console.assert(x > 0, "x باید مثبت باشه");
debugger;      // نقطه‌ی توقف در DevTools
```
