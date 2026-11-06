---
title: دسترس‌پذیری (Accessibility / a11y) و ARIA
description: هدف: همه‌ی کاربران (نابینا، کم‌بینا، ناشنوا، کاربران کیبورد، اختلالات حرکتی/شناختی) بتونن از سایت استفاده کنن. استاندارد: WCAG 2.2 (سطوح A / AA / AAA).…
date: 2026-11-06
category: HTML
order: 7
---

هدف: همه‌ی کاربران (نابینا، کم‌بینا، ناشنوا، کاربران کیبورد، اختلالات حرکتی/شناختی) بتونن از سایت استفاده کنن. استاندارد: **WCAG 2.2** (سطوح A / AA / AAA). معمولاً هدف AA است.

## چهار اصل WCAG (POUR)
- **Perceivable** (قابل درک): متن جایگزین، کنتراست، زیرنویس.
- **Operable** (قابل استفاده): کیبورد، زمان کافی، بدون چشمک‌زنی خطرناک.
- **Understandable** (قابل فهم): زبان، پیش‌بینی‌پذیری، کمک به خطاها.
- **Robust** (مقاوم): سازگار با فناوری‌های کمکی.

## قانون اول ARIA
> اگه یک تگ HTML بومی همون کار رو می‌کنه، **از اون استفاده کن** نه `div` + ARIA.

```html
<!-- ❌ -->
<div role="button" tabindex="0" onclick="go()">ارسال</div>
<!-- ✅ -->
<button type="button" onclick="go()">ارسال</button>
```
`<button>` خودکار: فوکوس‌پذیر، Enter/Space، نقش، حالت‌ها.

---

## ۱. متن جایگزین
```html
<img src="chart.png" alt="رشد فروش از ۱۰ به ۳۰ میلیون در سال ۱۴۰۲" />
<img src="divider.png" alt="" />                          <!-- تزئینی -->
<svg aria-hidden="true">…</svg>                           <!-- آیکن تزئینی -->
<button><svg aria-hidden="true">…</svg><span class="sr-only">حذف</span></button>
<button aria-label="بستن"><svg aria-hidden="true">✕</svg></button>
```
alt خوب: **هدف تصویر** رو بگو، نه «تصویر ...». برای نمودار پیچیده: توضیح کامل در متن یا `<figcaption>`.

## ۲. کنتراست رنگ
- متن معمولی ≥ **4.5:1**، متن بزرگ (۱۸pt+ یا ۱۴pt بولد) ≥ **3:1**، اجزای UI و آیکن ≥ **3:1**.
- فقط با رنگ اطلاعات نده (قرمز/سبز) → آیکن/متن هم بذار.
- ابزار: DevTools (Contrast ratio)، WebAIM Contrast Checker.

## ۳. کیبورد

### ترتیب فوکوس
- فقط عناصر **تعاملی** باید فوکوس بگیرن: `a[href]`, `button`, `input`, `select`, `textarea`, `summary`.
- ترتیب Tab = ترتیب DOM (با CSS ترتیب بصری رو زیاد بهم نزن).

### `tabindex`
```html
<div tabindex="0">قابل فوکوس (در ترتیب طبیعی)</div>
<div tabindex="-1">فقط با JS (element.focus())، نه با Tab</div>
<!-- tabindex > 0 : ❌ استفاده نکن -->
```

### نشانگر فوکوس
```css
:focus-visible { outline: 3px solid #1a73e8; outline-offset: 2px; }
/* ❌ outline: none  بدون جایگزین */
```

### Skip link
[Semantic](/blog/html-semantic-html/) را ببین.

### الگوی مدیریت فوکوس (دیالوگ/مودال)
```js
// باز شدن: فوکوس به اولین عنصر
dialog.showModal();                 // <dialog> خودش focus trap و Esc رو داره
// بسته شدن: فوکوس به دکمه‌ی بازکننده برگرده
opener.focus();
```
کلیدهای مورد انتظار: `Enter/Space` (دکمه)، `Esc` (بستن)، `Arrow` (منو/tab/radio)، `Tab` (حرکت).

## ۴. ARIA

### Role (نقش)
```html
<div role="alert">پیام فوری</div>
<div role="status">در حال ذخیره…</div>
<ul role="list">…</ul>                        <!-- وقتی CSS list-style:none زده شده (Safari) -->
<div role="tablist">…</div>
<div role="dialog" aria-modal="true" aria-labelledby="t">…</div>
<div role="search">…</div>
```

### Property ها و State ها
| ویژگی | کاربرد |
|---|---|
| `aria-label` | نام دسترسی (رشته) |
| `aria-labelledby="id"` | نام از المان دیگر |
| `aria-describedby="id"` | توضیح تکمیلی |
| `aria-hidden="true"` | پنهان از فناوری کمکی (المان فوکوس‌پذیر رو نباید پنهان کنی) |
| `aria-expanded="true/false"` | باز/بسته (منو، accordion) |
| `aria-controls="id"` | المان تحت کنترل |
| `aria-pressed` | دکمه‌ی toggle |
| `aria-selected` | تب/گزینه‌ی انتخاب‌شده |
| `aria-checked` | چک‌باکس سفارشی |
| `aria-current="page\|step\|true"` | آیتم جاری |
| `aria-disabled="true"` | غیرفعال (ولی فوکوس‌پذیر) |
| `aria-invalid="true"` | فیلد نامعتبر |
| `aria-required="true"` | اجباری |
| `aria-live="polite\|assertive"` | اعلان تغییر پویا |
| `aria-busy="true"` | در حال بارگذاری |
| `aria-haspopup` | منوی بازشونده |
| `aria-modal="true"` | مودال |

### Live Regions
اعلام تغییر بدون جابه‌جایی فوکوس:
```html
<div id="status" role="status" aria-live="polite"></div>
<div id="err" role="alert"></div>      <!-- assertive: فوراً -->
```
```js
status.textContent = "۳ مورد به سبد اضافه شد";   // صفحه‌خوان می‌خونه
```
> region باید **از قبل در DOM** باشه، بعد محتواش عوض بشه.

### مثال: دکمه‌ی Toggle منو
```html
<button aria-expanded="false" aria-controls="menu" id="btn">منو</button>
<ul id="menu" hidden>…</ul>
```
```js
btn.addEventListener("click", () => {
  const open = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", String(!open));
  menu.hidden = open;
});
```

### مثال: Tabs
```html
<div role="tablist" aria-label="تنظیمات">
  <button role="tab" id="t1" aria-selected="true"  aria-controls="p1">عمومی</button>
  <button role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1">امنیت</button>
</div>
<div role="tabpanel" id="p1" aria-labelledby="t1">…</div>
<div role="tabpanel" id="p2" aria-labelledby="t2" hidden>…</div>
```
رفتار: `←/→` بین تب‌ها، فقط تب فعال `tabindex="0"`. (الگوهای کامل: **ARIA Authoring Practices Guide**.)

### مثال: Accordion
```html
<h3><button aria-expanded="false" aria-controls="s1" id="h1">بخش ۱</button></h3>
<div id="s1" role="region" aria-labelledby="h1" hidden>محتوا</div>
```
(یا ساده‌تر: `<details>`.)

---

## ۵. متن مخفی برای صفحه‌خوان (Visually Hidden)
```css
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  margin: -1px; padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```
- `display:none` / `visibility:hidden` / `hidden` → از صفحه‌خوان هم پنهان.
- `.sr-only` → فقط از دید بصری پنهان.

## ۶. فرم و خطا
- `label` برای همه‌ی فیلدها، `fieldset/legend` برای گروه.
- خطا را اعلام کن: `aria-invalid`, `aria-describedby`, `role="alert"`.
- در فرم‌های چندخطایی، فوکوس رو به خلاصه‌ی خطاها یا اولین فیلد خطادار ببر.
- `autocomplete` مناسب بذار (WCAG 1.3.5).

## ۷. ساختار و زبان
- `<html lang="fa">`، و `lang="en"` روی عبارت‌های انگلیسی.
- تیترها سلسله‌مراتبی، landmark ها (`main`, `nav`, ...).
- لینک‌ها متن معنادار، نه «اینجا».
- جدول: `caption`, `th scope`.

## ۸. حرکت و زمان
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
@media (prefers-contrast: more) { /* کنتراست بالاتر */ }
@media (prefers-color-scheme: dark) { }
@media (forced-colors: active) { /* حالت High Contrast ویندوز */ }
```
- ویدیو/انیمیشن خودکار: امکان توقف.
- بیش از ۳ چشمک در ثانیه ممنوع.
- مهلت زمانی (session timeout) قابل تمدید باشه.

## ۹. اندازه‌ی هدف لمسی
- WCAG 2.2: حداقل **۲۴×۲۴ پیکسل** (توصیه‌ی عملی: ۴۴×۴۴).
```css
button, a.btn { min-block-size: 44px; min-inline-size: 44px; }
```

## ۱۰. تست
| روش | ابزار |
|---|---|
| خودکار | Lighthouse، axe DevTools، WAVE، eslint-plugin-jsx-a11y |
| کیبورد | فقط با Tab/Shift+Tab/Enter/Space/Esc/Arrow کل سایت را بپیما |
| صفحه‌خوان | NVDA (ویندوز، رایگان)، VoiceOver (Mac/iOS)، TalkBack (Android) |
| بزرگ‌نمایی | Zoom ۲۰۰٪ و ۴۰۰٪ |
| رنگ | شبیه‌ساز کوررنگی در DevTools |

> ابزارهای خودکار فقط حدود ۳۰–۴۰٪ مشکلات رو پیدا می‌کنن؛ تست دستی ضروریه.

## چک‌لیست سریع
- [ ] همه‌ی تصاویر `alt` مناسب دارن
- [ ] کنتراست ≥ 4.5:1
- [ ] همه‌چیز با کیبورد قابل استفاده است و فوکوس دیده می‌شه
- [ ] تگ‌های بومی به‌جای div+role
- [ ] label برای همه‌ی فیلدها
- [ ] تیترها و landmark ها درست
- [ ] `lang` و `dir` تنظیم شده
- [ ] انیمیشن‌ها `prefers-reduced-motion` رو رعایت می‌کنن
- [ ] پیام‌های پویا با live region اعلام می‌شن
- [ ] zoom تا ۲۰۰٪ بدون شکستن چیدمان
