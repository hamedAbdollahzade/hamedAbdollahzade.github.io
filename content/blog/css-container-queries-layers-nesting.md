---
title: Container Queries، Cascade Layers و Nesting
description: Container Queries، Cascade Layers و Nesting؛ آموزش CSS به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: CSS
order: 10
---

## Container Queries ⭐
Media query بر اساس **viewport** است؛ Container Query بر اساس **اندازه‌ی والد (کانتینر)**. کامپوننت واقعاً قابل استفاده‌ی مجدد می‌شه.

```html
<div class="card-wrap">
  <article class="card">
    <img src="a.jpg" alt="" />
    <div><h3>عنوان</h3><p>متن</p></div>
  </article>
</div>
```
```css
.card-wrap {
  container-type: inline-size;     /* بر اساس عرض */
  container-name: card;            /* اختیاری */
  /* container: card / inline-size;  ← shorthand */
}

.card { display: grid; gap: 1rem; }

@container card (min-width: 500px) {
  .card { grid-template-columns: 200px 1fr; }
}
@container (width > 700px) { .card h3 { font-size: 1.5rem; } }
```
- `container-type`: `inline-size` (عرض)، `size` (عرض و ارتفاع)، `normal`.
- المانی که container است **نمی‌تونه** خودش رو stylize کنه با query؛ فقط **فرزندانش**.
- container رو خودش `contain` می‌کنه (layout/style/inline-size) ← ممکنه روی اندازه‌ی ذاتی تأثیر بذاره.

### واحدهای container
```css
.title { font-size: clamp(1rem, 5cqi, 2rem); }     /* cqi = ۱٪ عرض inline کانتینر */
/* cqw, cqh, cqi, cqb, cqmin, cqmax */
```

### Style Queries (جدید)
```css
.card-wrap { --variant: featured; }
@container style(--variant: featured) { .card { border: 2px solid gold; } }
```

### چه زمانی Media، چه زمانی Container؟
| | Media Query | Container Query |
|---|---|---|
| چیدمان کلی صفحه (سایدبار، ناوبار) | ✅ | |
| کامپوننت قابل استفاده در جاهای مختلف | | ✅ |
| تنظیمات کاربر (dark، reduced motion، print) | ✅ | |

---

## Cascade Layers (`@layer`) ⭐
کنترل **ترتیب اولویت** گروه‌های CSS **مستقل از specificity**.

```css
@layer reset, base, components, utilities;       /* ترتیب: آخری قوی‌تر */

@layer reset {
  * { margin: 0; box-sizing: border-box; }
}
@layer base {
  body { font: 1rem/1.6 system-ui; }
  a { color: blue; }
}
@layer components {
  .btn { padding: .5em 1em; background: var(--brand); }
}
@layer utilities {
  .mt-4 { margin-top: 1rem; }
  .hidden { display: none; }
}
```
قوانین:
- **لایه‌ی بعدی** (در ترتیب اعلام) از لایه‌ی قبلی **قوی‌تره**، حتی با specificity کمتر.
- CSS **بدون layer** از همه‌ی لایه‌ها قوی‌تره.
- `!important` معکوس می‌شه: لایه‌ی اول قوی‌تر.

```css
@layer base { #main a { color: red; } }       /* specificity بالا ولی لایه‌ی ضعیف */
@layer components { a { color: blue; } }      /* برنده: آبی */
```
### کاربرد: کتابخانه‌ی شخص ثالث
```css
@import url("bootstrap.css") layer(vendor);
@layer vendor, app;
@layer app { .btn { /* به‌راحتی override می‌کنه، بدون !important */ } }
```
### Nested layers و anonymous
```css
@layer framework.base { }
@layer framework.theme { }
@layer { /* بی‌نام */ }
```
### کنترل در HTML
```html
<link rel="stylesheet" href="vendor.css" layer="vendor" />
```
> `@layer` اولین خط CSS باشه تا ترتیب مشخص بشه.

---

## CSS Nesting ⭐
بدون Sass:
```css
.card {
  padding: 1rem;
  background: #fff;

  h3 { margin: 0; }                    /* .card h3 */
  &:hover { box-shadow: 0 4px 12px #0002; }    /* .card:hover */
  &.featured { border: 2px solid gold; }       /* .card.featured */
  & + & { margin-top: 1rem; }                  /* .card + .card */
  .dark & { background: #222; }                /* .dark .card */
  > p { color: #555; }                         /* .card > p */
  &::after { content: ""; }

  @media (min-width: 768px) { padding: 2rem; }
  @container (min-width: 400px) { display: flex; }
  @supports (display: grid) { display: grid; }
  @layer components { }
}
```
- `&` اشاره به سلکتور والد.
- ترکیب نام (BEM با `&__elem`) **پشتیبانی نمی‌شه**: `&__title` کار نمی‌کنه (برخلاف Sass).
- specificity: `&` مثل `:is(parent)`.
```css
.nav {
  ul { display: flex; gap: 1rem; list-style: none; }
  a {
    color: inherit;
    &:hover, &:focus-visible { text-decoration: underline; }
    &[aria-current="page"] { font-weight: bold; }
  }
}
```

---

## `@scope`
محدود کردن استایل به یک زیردرخت (و «donut scope»):
```css
@scope (.card) to (.card-footer) {
  img { border-radius: 8px; }          /* فقط داخل .card تا قبل از .card-footer */
  :scope { padding: 1rem; }
}
```
مزیت: بدون BEM و بدون نام‌های طولانی، اولویت منطقی (proximity).

## `@supports`
```css
.grid { display: flex; flex-wrap: wrap; }
@supports (display: grid) { .grid { display: grid; } }
@supports not (backdrop-filter: blur(4px)) { .glass { background: #fff; } }
@supports selector(:has(a)) { }
@supports (container-type: inline-size) { }
```
Progressive Enhancement: پایه‌ی کار کنه، قابلیت‌های جدید بالاش اضافه بشن.

## `@import`
```css
@import url("reset.css");
@import url("theme.css") layer(theme);
@import url("print.css") print;
```
(برای عملکرد: بهتره build tool یا چند `<link>`؛ `@import` درخواست‌ها رو زنجیره می‌کنه.)

## `@font-face`, `@keyframes`, `@property`, `@media`, `@container`, `@layer`, `@scope`, `@supports`, `@counter-style`, `@page`, `@starting-style`
مرور @-rule ها:
```css
@counter-style fa-alpha { system: alphabetic; symbols: "الف" "ب" "پ" "ت"; suffix: ") "; }
ol { list-style: fa-alpha; }

@page { size: A4; margin: 2cm; }
```

## ترکیب همه
```css
@layer reset, tokens, base, components, utilities;

@layer tokens { :root { --brand: oklch(60% .2 255); } }

@layer components {
  .product-card {
    container: product / inline-size;
    display: grid; gap: 1rem;

    img { width: 100%; aspect-ratio: 1; object-fit: cover; }

    @container product (min-width: 420px) {
      grid-template-columns: 160px 1fr;
    }
    &:has(.badge-sale) { border: 2px solid var(--brand); }
  }
}
```

## تمرین
۱. کارت محصولی بساز که در کانتینر کوچک عمودی و در کانتینر بزرگ افقی باشه، و آن را در سایدبار و محتوای اصلی استفاده کن.
۲. یک ساختار لایه‌بندی (`reset → base → components → utilities`) بساز و ثابت کن utility بدون `!important` استایل کامپوننت رو override می‌کنه.
۳. CSS یک کامپوننت منوی تودرتو را با Nesting بنویس.
