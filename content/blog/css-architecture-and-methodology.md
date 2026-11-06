---
title: معماری CSS: BEM، Specificity و قراردادها
description: معماری CSS: BEM، Specificity و قراردادها؛ آموزش CSS به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: CSS
order: 11
---

## چرا معماری؟
CSS سراسری است؛ در پروژه‌ی بزرگ مشکلاتی مثل **تداخل نام‌ها، specificity جنگ، کد مرده، غیرقابل پیش‌بینی بودن** پیش میاد. معماری، قواعد نام‌گذاری و سازمان‌دهی ارائه می‌ده.

## اصول
- **کم‌اولویت و تخت**: سلکتورهای کوتاه (ترجیحاً یک کلاس).
- **سلکتور بر اساس کلاس**، نه تگ یا id.
- **جداسازی**: چیدمان / ظاهر / رفتار.
- **قابل‌پیش‌بینی** و **قابل حذف**: حذف یک کامپوننت نباید جای دیگه رو خراب کنه.

---

## BEM (Block Element Modifier)
```
block            .card
block__element   .card__title
block--modifier  .card--featured
element--mod     .card__title--large
```
```html
<article class="card card--featured">
  <h3 class="card__title">عنوان</h3>
  <p class="card__text">متن</p>
  <a class="card__button button button--primary" href="#">ادامه</a>
</article>
```
```css
.card { padding: 1rem; border-radius: 8px; }
.card--featured { border: 2px solid gold; }
.card__title { margin: 0 0 .5rem; }
.card__button { margin-top: 1rem; }
```
- **Block**: کامپوننت مستقل. **Element**: بخشی از block (بدون معنی مستقل). **Modifier**: تغییر ظاهر/رفتار.
- مزایا: specificity یکنواخت (یک کلاس)، بدون وابستگی به ساختار DOM، خوانا.
- عیب: نام‌های طولانی.
- حالت‌ها: `is-active`, `is-open`, `has-error` (یا `[aria-expanded="true"]`، `[data-state]`).

## سایر روش‌ها
| روش | ایده |
|---|---|
| **SMACSS** | دسته‌بندی: Base / Layout / Module / State / Theme |
| **OOCSS** | جدا کردن ساختار از ظاهر، ارث‌بری کلاس‌ها |
| **ITCSS** | لایه‌بندی بر اساس specificity از کم به زیاد: Settings → Tools → Generic → Elements → Objects → Components → Utilities |
| **Utility-first** (Tailwind) | کلاس‌های کوچک تک‌منظوره در HTML: `flex gap-4 p-4` |
| **CUBE CSS** | Composition / Utility / Block / Exception |
| **Atomic CSS** | هر کلاس = یک declaration |
| **CSS Modules** | کلاس‌ها به‌صورت خودکار scope محلی می‌گیرن |
| **CSS-in-JS** | styled-components، Emotion (runtime) / vanilla-extract، Panda (build-time) |

### ITCSS: مثال پوشه‌بندی
```
styles/
├─ 00-settings/   tokens, variables
├─ 01-tools/      mixins (Sass)
├─ 02-generic/    reset, box-sizing
├─ 03-elements/   h1, a, p (بدون کلاس)
├─ 04-layouts/    container, grid, stack
├─ 05-components/ button, card, nav
├─ 06-utilities/  .sr-only, .mt-4
└─ main.css
```
با Cascade Layers این ترتیب رو **مستقیماً** اعمال کن:
```css
@layer settings, generic, elements, layouts, components, utilities;
```

### Utility-first (Tailwind) — مقایسه
```html
<button class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">ذخیره</button>
```
- ✅ سرعت، سیستم طراحی ثابت، بدون نام‌گذاری، حذف خودکار CSS استفاده‌نشده.
- ❌ HTML شلوغ، یادگیری کلاس‌ها، استخراج کامپوننت لازمه.
- ترکیب رایج: utilities برای چیدمان/فاصله + کامپوننت برای المان‌های پیچیده.

---

## Specificity: مدیریت

### قوانین
- کلاس‌ها رو انتخاب کن؛ از `#id` و `!important` و سلکتور تودرتو و `div.a.b` اجتناب کن.
- عمق سلکتور ≤ ۲–۳.
- جهت: **کم‌اولویت** و با اتکا به **ترتیب/لایه** override کن.

```css
/* ❌ جنگ specificity */
#sidebar .widget ul li a { }
.page .sidebar a.link { }
a { color: red !important; }

/* ✅ */
.widget-link { }
```
### ابزارها
- `:where()` برای کاهش specificity.
- `@layer` برای ترتیب مستقل از specificity.
- `@scope` برای محدوده.
- DevTools ← Styles ← قانون‌های خط‌خورده.

## `!important` — کجا مجازه؟
- کلاس‌های utility ‌ (`.hidden { display: none !important }`).
- override کردن استایل inline/شخص ثالث (در موارد ضروری).
- `prefers-reduced-motion` (ریست کامل).

---

## قراردادهای نوشتن CSS

### ترتیب ویژگی‌ها (پیشنهادی)
```css
.el {
  /* ۱. موقعیت */      position: relative; inset: 0; z-index: 1;
  /* ۲. box model */   display: flex; width: 100%; margin: 0; padding: 1rem;
  /* ۳. تایپوگرافی */  font: 1rem/1.5 sans-serif; color: #222; text-align: center;
  /* ۴. ظاهر */        background: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: …;
  /* ۵. سایر */        transition: …; cursor: pointer;
}
```
(ابزار: Stylelint با `stylelint-config-recess-order` ترتیب را خودکار می‌کند.)

### نام‌گذاری
- `kebab-case`، نام‌ها معنایی (چه هست، نه چه شکلی: `.alert-danger` نه `.red-box`).
- پیشوند برای namespace: `c-` (component)، `l-` (layout)، `u-` (utility)، `js-` (hook برای JS).
- قطعات JS رو از CSS جدا کن: `js-open-menu`.

### ساختار فایل‌ها
```
css/
├─ main.css               (@layer + imports)
├─ base/    reset.css  typography.css
├─ layout/  container.css  grid.css
├─ components/ button.css  card.css  nav.css
└─ utilities.css
```
### سازگاری و Fallback
```css
.x { width: 100%; width: min(100%, 60rem); }      /* مرورگر قدیمی مقدار اول رو نگه می‌داره */
@supports (display: grid) { }
```
Autoprefixer / PostCSS / Lightning CSS برای پیشوندها و ترجمه.

---

## ابزارها

| دسته | ابزار |
|---|---|
| پیش‌پردازنده | Sass/SCSS، Less (امروزه کمتر لازم) |
| پس‌پردازش | PostCSS، Lightning CSS، Autoprefixer |
| لینت | Stylelint |
| فرمت | Prettier |
| حذف کد مرده | PurgeCSS، Tailwind JIT، Chrome DevTools Coverage |
| باندل | Vite، esbuild، webpack |
| نمونه‌سازی | Storybook |

### Sass: سینتکس رایج (مرور)
```scss
$brand: #1a73e8;
@mixin flex-center { display: flex; justify-content: center; align-items: center; }
.card {
  @include flex-center;
  &__title { color: $brand; }      // BEM در Sass
  &:hover { box-shadow: 0 2px 8px rgb(0 0 0 / .2); }
}
@use "variables" as v;
```
> با Custom Properties، Nesting و `color-mix()` بومی، نیاز به Sass خیلی کمتر شده.

## Code Smells در CSS
- `!important` همه‌جا
- سلکتور طولانی `.a .b .c .d`
- مقادیر جادویی (`margin-top: 37px`) به‌جای توکن
- تکرار کد (کپی-پیست)
- `z-index: 99999`
- تکیه بر ساختار DOM (`div > div > span`)
- override کردن زیاد

## Checklist بازبینی (Code Review)
- [ ] از توکن/متغیر استفاده شده؟
- [ ] ریسپانسیو (mobile-first)؟
- [ ] focus/hover/disabled ها پوشش داده شدن؟
- [ ] دسترس‌پذیری (کنتراست، reduced-motion)؟
- [ ] logical properties برای RTL؟
- [ ] specificity کم و سلکتور تخت؟
- [ ] بدون استایل مرده و تکراری؟

## تمرین
۱. یک کامپوننت Card و Button با BEM و دو modifier بنویس.
۲. همین کامپوننت‌ها را در `@layer components` قرار بده و utility ای بنویس که بدون `!important` آن‌ها را override کند.
۳. یک reset/base مدرن با `:where()` بنویس.
