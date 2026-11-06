---
title: CSS Grid
description: سیستم چیدمان دوبعدی (ردیف و ستون هم‌زمان). برای چیدمان کل صفحه، گالری، داشبورد.
date: 2026-11-06
category: CSS
order: 6
---

سیستم چیدمان **دوبعدی** (ردیف و ستون هم‌زمان). برای چیدمان کل صفحه، گالری، داشبورد.

```css
.grid { display: grid; }
```

## تعریف ستون و ردیف
```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;     /* سه ستون */
  grid-template-rows: auto 1fr auto;         /* سه ردیف */
  gap: 1rem;                                  /* row-gap + column-gap */
}
```
### واحد `fr`
سهم از فضای باقی‌مانده:
```css
grid-template-columns: 1fr 2fr;          /* ۱ به ۲ */
grid-template-columns: 200px 1fr;        /* ثابت + کشسان */
```
### `repeat()`
```css
grid-template-columns: repeat(3, 1fr);              /* ۳ ستون مساوی */
grid-template-columns: repeat(4, minmax(0, 1fr));
grid-template-columns: 100px repeat(2, 1fr) 100px;
```
### `minmax()`
```css
grid-template-columns: minmax(200px, 1fr) 2fr;
grid-auto-rows: minmax(100px, auto);
```
### `auto-fill` و `auto-fit` ⭐ (ریسپانسیو بدون media query)
```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
```
- `auto-fill`: تا جایی که جا هست ستون می‌سازه (ستون‌های خالی می‌مونن).
- `auto-fit`: ستون‌های خالی رو جمع می‌کنه تا آیتم‌ها کل عرض رو پر کنن.

### `min-content`, `max-content`, `fit-content()`
```css
grid-template-columns: max-content 1fr;
grid-template-columns: fit-content(300px) 1fr;
```

## قرار دادن آیتم‌ها

### با خطوط (Grid Lines)
خطوط از ۱ شماره‌گذاری می‌شن (و `-1` = آخرین خط):
```css
.item {
  grid-column: 1 / 3;        /* از خط ۱ تا خط ۳ (۲ ستون) */
  grid-column: 1 / -1;       /* کل عرض */
  grid-column: span 2;       /* ۲ ستون */
  grid-row: 2 / 4;
  grid-row: span 2;
  grid-area: 1 / 2 / 3 / 4;  /* row-start / col-start / row-end / col-end */
}
```
### با نام (Template Areas) ⭐
خوانا‌ترین روش:
```css
.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  min-height: 100vh;
  gap: 1rem;
}
header  { grid-area: header; }
aside   { grid-area: sidebar; }
main    { grid-area: main; }
footer  { grid-area: footer; }
```
ریسپانسیو با تغییر area ها:
```css
@media (max-width: 700px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas: "header" "main" "sidebar" "footer";
  }
}
```
`.` برای سلول خالی:
```css
grid-template-areas: "a a ." "b c c";
```
### نام‌گذاری خطوط
```css
grid-template-columns: [full-start] 1fr [content-start] minmax(0, 60rem) [content-end] 1fr [full-end];
.hero { grid-column: full; }
.text { grid-column: content; }
```

## Implicit Grid (خودکار)
```css
grid-auto-rows: 100px;                 /* ردیف‌های ساخته‌شده خودکار */
grid-auto-columns: 1fr;
grid-auto-flow: row;                   /* column | dense */
grid-auto-flow: row dense;             /* حفره‌ها رو پر کن (ترتیب بصری تغییر می‌کنه) */
```

## تراز (Alignment)

| ویژگی | روی چی؟ | محور |
|---|---|---|
| `justify-items` | آیتم‌ها داخل سلول | افقی (inline) |
| `align-items` | آیتم‌ها داخل سلول | عمودی (block) |
| `place-items` | هر دو (shorthand) | |
| `justify-content` | کل شبکه داخل container | افقی |
| `align-content` | کل شبکه داخل container | عمودی |
| `place-content` | هر دو | |
| `justify-self` / `align-self` / `place-self` | یک آیتم | |

```css
.grid { place-items: center; }             /* وسط‌چین آیتم‌ها در سلول */
.item { justify-self: end; align-self: start; }
.grid { justify-content: space-between; }  /* وقتی ستون‌ها ثابت و کوچک‌تر از container */
```
مقادیر: `start | end | center | stretch (پیش‌فرض) | space-between | space-around | space-evenly`

## الگوهای رایج

### وسط‌چین
```css
.center { display: grid; place-items: center; min-height: 100vh; }
```
### گالری ریسپانسیو
```css
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr)); gap: 1.5rem; }
```
`min(250px, 100%)` مانع سرریز در صفحه‌های خیلی کوچیک می‌شه.

### Bento / آیتم‌های متفاوت
```css
.bento { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 120px; gap: 12px; }
.bento .big  { grid-column: span 2; grid-row: span 2; }
.bento .wide { grid-column: span 2; }
.bento .tall { grid-row: span 2; }
```
### لایه‌بندی (Overlap)
```css
.hero { display: grid; }
.hero > * { grid-area: 1 / 1; }          /* همه در یک سلول روی هم */
.hero img { z-index: 0; }
.hero .text { z-index: 1; align-self: end; }
```
### Full-bleed layout
```css
.page {
  display: grid;
  grid-template-columns: 1fr min(65ch, 100% - 2rem) 1fr;
}
.page > * { grid-column: 2; }
.page > .full { grid-column: 1 / -1; }
```
### Sticky Footer
```css
body { display: grid; min-height: 100dvh; grid-template-rows: auto 1fr auto; }
```
### فرم دو ستونه
```css
form { display: grid; grid-template-columns: max-content 1fr; gap: .75rem 1rem; align-items: center; }
form label { text-align: end; }
form .full { grid-column: 1 / -1; }
```

## Subgrid
آیتم تو در تو از خطوط والد استفاده کنه:
```css
.cards { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: auto auto auto; gap: 1rem; }
.card { display: grid; grid-row: span 3; grid-template-rows: subgrid; }   /* عنوان، متن و دکمه‌ی همه‌ی کارت‌ها هم‌تراز */
```

## Masonry
(در حال استانداردسازی: `grid-template-rows: masonry` / `display: grid-lanes`.) فعلاً از columns یا JS:
```css
.masonry { column-count: 3; column-gap: 1rem; }
.masonry > * { break-inside: avoid; margin-bottom: 1rem; }
```

## اشکال‌زدایی
- DevTools ← badge «grid» ← نمایش خطوط و نام‌ها.
- ستون‌ها از container بیرون می‌زنن؟ → `minmax(0, 1fr)` به‌جای `1fr` (چون `1fr` = `minmax(auto, 1fr)`).
- آیتم‌ها کشیده می‌شن؟ → `align-items: start` یا `align-content: start`.

## Grid یا Flex؟
| | Flex | Grid |
|---|---|---|
| بعد | ۱ | ۲ |
| اندازه‌ی آیتم | از محتوا | از ساختار شبکه |
| کاربرد | ناوبار، ردیف دکمه، المان کوچک | چیدمان صفحه، گالری، داشبورد |
> قاعده: کل صفحه با Grid، داخل کامپوننت‌ها با Flex. و ترکیب آن‌ها کاملاً عادیه.

## تمرین
۱. چیدمان صفحه (header/sidebar/main/footer) با `grid-template-areas` و ریسپانسیو.
۲. گالری ۳ ستونه که با `auto-fit` خودکار تنظیم بشه.
۳. بازی: [Grid Garden](https://cssgridgarden.com).
