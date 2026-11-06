---
title: مرورگرها و DevTools
description: مرورگرها و DevTools؛ آموزش مسیر فرانت‌اند به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 2
---

## مرورگر چطور کار می‌کنه؟
اجزای اصلی: UI، **موتور رندر** (Blink در Chrome/Edge، WebKit در Safari، Gecko در Firefox)، **موتور JavaScript** (V8، JavaScriptCore، SpiderMonkey)، شبکه، ذخیره‌سازی.

### مسیر رندر (Critical Rendering Path)
۱. Parse HTML ← **DOM**
۲. Parse CSS ← **CSSOM**
۳. DOM + CSSOM ← **Render Tree** (المان‌های `display: none` توش نیستن)
۴. **Layout** (اندازه و موقعیت)
۵. **Paint** (رنگ‌آمیزی)
۶. **Composite** (ترکیب لایه‌ها روی GPU)

- CSS **render-blocking** است؛ `<script>` معمولی **parser-blocking** است (از `defer`/`async` استفاده کن).
- جزئیات هزینه‌ی هر مرحله: [عملکرد CSS](/blog/css-performance-and-modern-features/).

### JavaScript در مرورگر
Call Stack، Web APIs، Task Queue و Event Loop: [Async JS](/blog/js-async-javascript/).

## سازگاری مرورگرها
- ویژگی‌های جدید رو در **caniuse.com** و **MDN Browser Compatibility** چک کن.
- **Progressive Enhancement**: پایه برای همه کار کنه، قابلیت‌های جدید به‌عنوان ارتقا (`@supports`، feature detection در JS).
- **Polyfill** / **Transpile** برای مرورگرهای قدیمی (Babel، SWC، Autoprefixer).
- `browserslist` تعیین می‌کنه ابزارها برای کدوم مرورگرها خروجی بدن.

## DevTools
باز کردن: `F12` یا `Ctrl+Shift+I` (در مک `Cmd+Option+I`).

| پنل | کاربرد |
|---|---|
| **Elements** | بررسی و تغییر زنده‌ی DOM و CSS، box model، حالت‌های `:hover` |
| **Console** | لاگ، خطاها، اجرای JS |
| **Sources** | دیباگ با breakpoint، step over/into، watch |
| **Network** | درخواست‌ها، زمان‌بندی، هدرها، throttling، cache |
| **Performance** | ضبط و تحلیل رندر و اجرای JS |
| **Lighthouse** | امتیاز عملکرد، دسترس‌پذیری، SEO، PWA |
| **Application** | localStorage، cookie، IndexedDB، service worker، manifest |
| **Memory** | شناسایی نشت حافظه (heap snapshot) |
| **Security** | وضعیت گواهی و محتوای mixed |

### ترفندهای Console
```js
console.log("ساده");
console.table([{ a: 1 }, { a: 2 }]);   // جدول
console.group("گروه"); console.log("x"); console.groupEnd();
console.time("t"); /* کد */ console.timeEnd("t");
console.assert(1 === 2, "این پیام نمایش داده می‌شه");
console.dir(document.body);             // ساختار شیء
$0                                       // المان انتخاب‌شده در Elements
$$("a")                                  // querySelectorAll
copy(obj)                                // کپی به clipboard
```

### دیباگ
```js
function calc(a, b) {
  debugger;                // اگه DevTools باز باشه اینجا متوقف می‌شه
  return a + b;
}
```
- Breakpoint روی خط، شرطی (Conditional)، روی رویداد (Event Listener Breakpoints)، روی تغییر DOM.
- Network: گزینه‌ی **Disable cache**، **Offline**، **Slow 4G** برای شبیه‌سازی.
- Device Toolbar (`Ctrl+Shift+M`) برای شبیه‌سازی موبایل.

### ابزارهای دیگه
- React/Vue DevTools (extension)
- Firefox: ابزار Grid و Flexbox inspector عالی
- `chrome://inspect`، دیباگ از راه دور موبایل

## تمرین
۱. در یک سایت دلخواه، با Elements رنگ یک دکمه رو زنده عوض کن.
۲. در Network ببین کدوم درخواست از همه کندتره و چرا.
۳. برنامه‌ی کوچکی با یک باگ بنویس و با breakpoint پیداش کن.
