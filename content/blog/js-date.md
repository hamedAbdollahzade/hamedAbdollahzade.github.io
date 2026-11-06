---
title: Date (تاریخ و زمان)
description: Date تعداد میلی‌ثانیه از 1970-01-01T00:00:00Z (Unix Epoch) رو نگه می‌داره.
date: 2026-11-06
category: JavaScript
order: 9
---

> `Date` تعداد میلی‌ثانیه از **1970-01-01T00:00:00Z** (Unix Epoch) رو نگه می‌داره.

## ساخت
```js
new Date();                          // الان
new Date(0);                         // → 1970-01-01T00:00:00.000Z
new Date("2024-03-15");              // رشته‌ی ISO (UTC)
new Date("2024-03-15T10:30:00");     // زمان محلی
new Date("2024-03-15T10:30:00Z");    // UTC
new Date(2024, 2, 15, 10, 30, 0);    // سال، ماه (۰-۱۱ !)، روز، ساعت، دقیقه، ثانیه
Date.now();                          // میلی‌ثانیه‌ی الان (عدد)
Date.parse("2024-03-15");            // → عدد میلی‌ثانیه
Date.UTC(2024, 2, 15);               // → عدد میلی‌ثانیه (UTC)
```
> ⚠️ **ماه از ۰ شروع می‌شه** (ژانویه = 0، دسامبر = 11) ولی **روز از ۱**.

## خواندن (Getters)
```js
const d = new Date("2024-03-15T10:30:45.123");

d.getFullYear();      // → 2024
d.getMonth();         // → 2   (مارس)
d.getDate();          // → 15  (روز ماه)
d.getDay();           // → 5   (روز هفته؛ 0=یکشنبه … 6=شنبه)
d.getHours();         // → 10
d.getMinutes();       // → 30
d.getSeconds();       // → 45
d.getMilliseconds();  // → 123
d.getTime();          // → timestamp (ms)
d.valueOf();          // مثل getTime
d.getTimezoneOffset();// اختلاف با UTC به دقیقه

// نسخه‌ی UTC:
d.getUTCFullYear(); d.getUTCMonth(); d.getUTCDate(); d.getUTCDay();
d.getUTCHours();    d.getUTCMinutes(); d.getUTCSeconds(); d.getUTCMilliseconds();
```

## نوشتن (Setters)
```js
const t = new Date(2024, 0, 31);
t.setFullYear(2025);
t.setMonth(5);              // ژوئن
t.setDate(10);
t.setHours(8, 30, 0, 0);    // ساعت، دقیقه، ثانیه، ms
t.setMinutes(15);
t.setSeconds(0);
t.setMilliseconds(0);
t.setTime(0);               // ست کردن با timestamp
// نسخه‌ی UTC: setUTCFullYear, setUTCMonth, setUTCDate, setUTCHours, ...
```
سرریز خودکار محاسبه می‌شه:
```js
const x = new Date(2024, 0, 31);
x.setDate(x.getDate() + 1);   // → 1 فوریه
x.setMonth(x.getMonth() + 13);// به سال بعد می‌ره
```

## تبدیل به رشته
```js
const d2 = new Date("2024-03-15T10:30:45Z");

d2.toISOString();        // → "2024-03-15T10:30:45.000Z"
d2.toJSON();             // مثل toISOString
d2.toString();           // → "Fri Mar 15 2024 ... (زمان محلی)"
d2.toDateString();       // → "Fri Mar 15 2024"
d2.toTimeString();
d2.toUTCString();        // → "Fri, 15 Mar 2024 10:30:45 GMT"
d2.toLocaleDateString("en-US");   // → "3/15/2024"
d2.toLocaleTimeString("en-US");   // → "10:30:45 AM"  (بسته به timezone)
d2.toLocaleString("en-GB");       // → "15/03/2024, 10:30:45"
```

## فرمت زیبا با `Intl.DateTimeFormat`
```js
const d3 = new Date("2024-03-15T10:30:00Z");

d3.toLocaleDateString("fa-IR");   // تاریخ شمسی با ارقام فارسی
d3.toLocaleDateString("fa-IR", {
  year: "numeric", month: "long", day: "numeric", weekday: "long",
});                                // تاریخ شمسی، مثلاً «جمعه ۲۵ اسفند ۱۴۰۲»
                                // (ترتیب دقیق اجزا بسته به مرورگر/Node فرق می‌کنه)

new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Asia/Tehran",
}).format(d3);

d3.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
// → "Mar 15, 2024"
```
زمان نسبی:
```js
const rtf = new Intl.RelativeTimeFormat("fa", { numeric: "auto" });
rtf.format(-1, "day");   // → "دیروز"
rtf.format(2, "hour");   // → "۲ ساعت بعد"
```

## مقایسه و محاسبه
```js
const a = new Date("2024-01-01");
const b = new Date("2024-03-01");

a < b;                   // → true   (با valueOf مقایسه می‌شه)
a === new Date("2024-01-01");  // → false ⚠️ (دو object مختلف)
a.getTime() === new Date("2024-01-01").getTime(); // → true

// اختلاف به روز
const diffDays = Math.round((b - a) / (1000 * 60 * 60 * 24)); // → 60

// افزودن روز
const addDays = (date, n) => {
  const r = new Date(date);
  r.setDate(r.getDate() + n);
  return r;
};
```

## الگوهای کاربردی
```js
// آخرین روز ماه
const lastDay = (y, m) => new Date(y, m + 1, 0).getDate();
lastDay(2024, 1); // → 29 (فوریه‌ی کبیسه)

// آیا سال کبیسه است؟
const isLeap = (y) => new Date(y, 1, 29).getDate() === 29;

// سن
const age = (birth) => {
  const n = new Date();
  let a = n.getFullYear() - birth.getFullYear();
  const m = n.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && n.getDate() < birth.getDate())) a--;
  return a;
};

// فرمت YYYY-MM-DD
const fmt = (d) => d.toISOString().slice(0, 10);

// شروع روز
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// اعتبارسنجی
const valid = (d) => d instanceof Date && !Number.isNaN(d.getTime());
valid(new Date("abc")); // → false
```

## نکات مهم
- رشته‌ی `"YYYY-MM-DD"` به‌صورت **UTC** پارس می‌شه ولی `"YYYY-MM-DDTHH:mm"` به‌صورت **محلی**.
- Date تغییرپذیره (mutable). قبل از setter کپی بگیر: `new Date(d)`.
- برای کار جدی با timezone و تقویم شمسی: `Intl`، یا کتابخانه‌هایی مثل `date-fns`، `dayjs`، `luxon`، `jalali-moment`.
- API جدید **Temporal** در حال استانداردسازیه و جایگزین Date خواهد شد.

## خلاصه‌ی متدها
`Date.now, Date.parse, Date.UTC` + `get/set{FullYear,Month,Date,Day*,Hours,Minutes,Seconds,Milliseconds,Time}` (و نسخه‌ی UTC) + `getTimezoneOffset, toISOString, toJSON, toString, toDateString, toTimeString, toUTCString, toLocaleString, toLocaleDateString, toLocaleTimeString, valueOf`
