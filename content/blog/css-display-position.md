---
title: Display، Position و Overflow
description: Display، Position و Overflow؛ آموزش CSS به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: CSS
order: 4
---

## `display`

| مقدار | رفتار |
|---|---|
| `block` | از خط جدید شروع، تمام عرض، `width/height` کار می‌کنه |
| `inline` | داخل خط، `width/height` و margin عمودی کار نمی‌کنه |
| `inline-block` | داخل خط ولی `width/height` و padding/margin کامل |
| `none` | حذف کامل از چیدمان |
| `flex` / `inline-flex` | [Flexbox](/blog/css-flexbox/) |
| `grid` / `inline-grid` | [Grid](/blog/css-grid/) |
| `contents` | خود المان حذف، فرزندانش می‌مونن |
| `table`, `table-cell` ... | رفتار جدول |
| `flow-root` | ساخت BFC (contain float و margin) |
| `list-item` | مثل li |

```css
span.badge { display: inline-block; padding: .2em .6em; }
.hidden { display: none; }
```

### `display: none` در برابر `visibility: hidden` و `opacity: 0`
| | فضا می‌گیره | قابل کلیک | صفحه‌خوان |
|---|---|---|---|
| `display: none` | ❌ | ❌ | ❌ |
| `visibility: hidden` | ✅ | ❌ | ❌ |
| `opacity: 0` | ✅ | ✅ | ✅ |
| `hidden` (HTML) | ❌ | ❌ | ❌ |

## `position`

```css
position: static;     /* پیش‌فرض، جریان عادی */
position: relative;   /* نسبت به جای خودش؛ مرجع برای فرزندان absolute */
position: absolute;   /* نسبت به نزدیک‌ترین والد positioned */
position: fixed;      /* نسبت به viewport (ثابت هنگام اسکرول) */
position: sticky;     /* بین relative و fixed */
```
با `top`, `right`, `bottom`, `left` (یا `inset`) و `z-index`:

### relative
```css
.box { position: relative; top: 10px; left: 20px; }   /* جای اصلی محفوظ می‌مونه */
```

### absolute
از جریان خارج می‌شه. مرجعش: نزدیک‌ترین والد با `position` غیر static:
```css
.parent { position: relative; }
.badge {
  position: absolute;
  top: -8px;
  inset-inline-end: -8px;         /* گوشه‌ی بالا (راست در RTL) */
}
.cover { position: absolute; inset: 0; }   /* کل والد رو بپوشونه */
.center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);        /* وسط */
}
```
### fixed
```css
.fab { position: fixed; bottom: 1rem; inset-inline-end: 1rem; }
header.top { position: fixed; inset: 0 0 auto 0; }
```
> اگه والدی `transform`/`filter`/`perspective` داشته باشه، `fixed` نسبت به اون عمل می‌کنه (نه viewport).

### sticky
```css
thead th { position: sticky; top: 0; background: #fff; }
.sidebar { position: sticky; top: 1rem; }
```
- باید `top` (یا یکی از جهت‌ها) بدی.
- اگه والد `overflow: hidden/auto` داشته باشه، ممکنه کار نکنه.

## `z-index` و Stacking Context
```css
.modal { position: fixed; z-index: 1000; }
```
- فقط روی المان‌های positioned (و flex/grid items) کار می‌کنه.
- **Stacking context** جدید ساخته می‌شه با: `position` + `z-index`، `opacity < 1`، `transform`، `filter`، `isolation: isolate`، `will-change`…
- z-index فرزند فقط **داخل** stacking context والدش مقایسه می‌شه.
```css
.card { isolation: isolate; }     /* z-index های داخلی به بیرون نشت نمی‌کنن */
```
> عددهای عجیب (999999) ندی؛ یک مقیاس تعریف کن: `--z-dropdown: 100; --z-modal: 1000;`.

## `float` و `clear` (قدیمی)
```css
img { float: right; margin-inline-start: 1rem; }   /* متن دورش می‌پیچه */
.clearfix::after { content: ""; display: block; clear: both; }
```
فقط برای دور‌پیچیدن متن دور تصویر؛ چیدمان با flex/grid.

## `overflow`
```css
overflow: auto;
overflow-x: hidden;
scrollbar-width: thin;
scrollbar-color: #888 #eee;
overscroll-behavior: contain;
scroll-behavior: smooth;
```

## `visibility` و `cursor`
```css
visibility: hidden;
cursor: pointer;   /* default | not-allowed | grab | text | wait | zoom-in */
pointer-events: none;      /* کلیک از روی المان رد می‌شه */
user-select: none;
```

## وسط‌چین کردن (راهنمای سریع)

### افقی — متن
```css
.t { text-align: center; }
```
### افقی — بلوک با عرض مشخص
```css
.b { width: 300px; margin-inline: auto; }
```
### افقی و عمودی — Flex (بهترین)
```css
.center { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
```
### Grid (کوتاه‌ترین)
```css
.center { display: grid; place-items: center; min-height: 100vh; }
```
### Absolute
```css
.c { position: absolute; inset: 0; margin: auto; width: 200px; height: 100px; }
```

## `resize`, `appearance`
```css
textarea { resize: vertical; }
button, select { appearance: none; }
```

## مثال: ناوبار ثابت با منوی ریسپانسیو ساده
```html
<header class="site-header">
  <a class="logo" href="/">لوگو</a>
  <nav>
    <ul>
      <li><a href="/">خانه</a></li>
      <li><a href="/blog">بلاگ</a></li>
      <li><a href="/contact">تماس</a></li>
    </ul>
  </nav>
</header>
```
```css
.site-header {
  position: sticky; top: 0; z-index: 100;
  display: flex; justify-content: space-between; align-items: center;
  padding: .75rem 1rem;
  background: #fff;
  box-shadow: 0 1px 4px rgb(0 0 0 / .1);
}
.site-header ul { display: flex; gap: 1rem; list-style: none; margin: 0; padding: 0; }
.site-header a { text-decoration: none; color: inherit; padding: .5rem; }
.site-header a:hover { color: #1a73e8; }
```

## تمرین
۱. دکمه‌ی «بازگشت به بالا» ثابت پایین گوشه‌ی صفحه بساز.
۲. کارت با badge در گوشه‌اش (absolute) بساز.
۳. سربرگ جدول که هنگام اسکرول بچسبه (sticky).
۴. مودال کاملاً وسط صفحه با پس‌زمینه‌ی تیره (`position: fixed; inset: 0`).
