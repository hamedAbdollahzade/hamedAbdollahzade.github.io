---
title: تایپوگرافی، پس‌زمینه و حاشیه‌ها
description: تایپوگرافی، پس‌زمینه و حاشیه‌ها؛ آموزش CSS به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: CSS
order: 3
---

## فونت

```css
body {
  font-family: "Vazirmatn", "Segoe UI", Tahoma, sans-serif;  /* لیست fallback */
  font-size: 1rem;
  font-weight: 400;       /* 100..900 ؛ normal=400 ؛ bold=700 */
  font-style: normal;     /* italic | oblique */
  line-height: 1.6;       /* بدون واحد: ضریب فونت (توصیه) */
  letter-spacing: 0.02em;
  word-spacing: 0.1em;
}
```
shorthand:
```css
font: italic 700 1rem/1.5 "Vazirmatn", sans-serif;   /* style weight size/line-height family */
```

### خانواده‌های عمومی
`serif`, `sans-serif`, `monospace`, `cursive`, `fantasy`, `system-ui`, `ui-rounded`
```css
font-family: system-ui, -apple-system, sans-serif;   /* فونت سیستم */
code { font-family: ui-monospace, "Cascadia Code", monospace; }
```

### بارگذاری فونت وب
```css
@font-face {
  font-family: "Vazirmatn";
  src: url("/fonts/Vazirmatn.woff2") format("woff2");
  font-weight: 100 900;          /* فونت متغیر */
  font-display: swap;
}
```
یا Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet" />
```
`font-display`: `swap` (متن فوری)، `fallback`، `optional`، `block`.

### فونت متغیر (Variable Font)
```css
h1 { font-variation-settings: "wght" 650, "wdth" 90; }
h1 { font-weight: 650; }      /* هر عددی ممکنه */
```

## متن

```css
.t {
  color: #333;
  text-align: right;           /* left | center | justify | start | end */
  text-align-last: center;
  text-indent: 2em;
  text-transform: uppercase;   /* lowercase | capitalize */
  text-decoration: underline wavy red 2px;   /* line style color thickness */
  text-decoration-line: line-through;
  text-underline-offset: 4px;
  text-shadow: 1px 2px 4px rgb(0 0 0 / .4);   /* x y blur color */
  white-space: nowrap;         /* normal | pre | pre-wrap | pre-line | balance */
  word-break: break-word;      /* break-all | keep-all */
  overflow-wrap: anywhere;
  hyphens: auto;
  direction: rtl;
  unicode-bidi: plaintext;
  writing-mode: vertical-rl;
  text-wrap: balance;          /* تیتر متعادل */
  text-wrap: pretty;           /* جلوگیری از کلمه‌ی تنها در آخر پاراگراف */
}
```

### قطع متن با ... (تک‌خطی)
```css
.ellipsis { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
```
### چندخطی (line-clamp)
```css
.clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}
```

### خوانایی
- طول خط ۴۵–۷۵ کاراکتر: `max-width: 65ch`.
- `line-height` ۱.۵ تا ۱.۷ برای متن بلند (فارسی ۱.۸ هم مناسبه).
- کنتراست کافی، اندازه‌ی حداقل ۱۶px.

### تایپوگرافی فارسی
```css
html { direction: rtl; }
body {
  font-family: "Vazirmatn", Tahoma, sans-serif;
  line-height: 1.9;
  font-variant-numeric: tabular-nums;   /* ارقام هم‌عرض (مناسب جدول و قیمت) */
}
```

## لیست‌ها
```css
ul { list-style: none; padding: 0; margin: 0; }
ol { list-style-type: persian; }     /* ۱ ۲ ۳ */
ul { list-style-type: square; list-style-position: inside; }
li::marker { color: tomato; font-weight: bold; }
```
شماره‌گذاری سفارشی:
```css
ol { counter-reset: step; list-style: none; }
ol li::before { counter-increment: step; content: counter(step, persian) ". "; }
```

## لینک
```css
a { color: #1a73e8; text-decoration: none; }
a:hover { text-decoration: underline; }
a:focus-visible { outline: 2px solid; outline-offset: 3px; }
/* ترتیب پیشنهادی: link, visited, hover, focus, active (LVHFA) */
```

---

## پس‌زمینه

```css
.bg {
  background-color: #f4f4f4;
  background-image: url("pattern.png");
  background-repeat: no-repeat;       /* repeat | repeat-x | space | round */
  background-position: center top;    /* x y | 50% 20px */
  background-size: cover;             /* contain | 100% auto | 200px */
  background-attachment: fixed;       /* scroll | local */
  background-origin: padding-box;
  background-clip: border-box;        /* text → با color: transparent برای متن گرادیانی */
}
```
shorthand:
```css
background: #fff url("a.png") no-repeat center / cover;
```
- `cover`: کل ناحیه رو بپوشونه (ممکنه برش بخوره)، `contain`: کامل دیده بشه.

### چند پس‌زمینه
```css
background:
  url("star.png") no-repeat 10px 10px,
  linear-gradient(to bottom, #fff, #ddd);
```
### گرادیان
```css
background: linear-gradient(to right, #ff7e5f, #feb47b);
background: linear-gradient(135deg, red 0%, orange 50%, yellow 100%);
background: radial-gradient(circle at center, #fff, #000);
background: conic-gradient(from 0deg, red, yellow, green, red);   /* نمودار دایره‌ای */
background: repeating-linear-gradient(45deg, #eee 0 10px, #ddd 10px 20px);
background: linear-gradient(in oklch, red, blue);                  /* ترکیب بهتر رنگ */
```
### متن گرادیانی
```css
.gradient-text {
  background: linear-gradient(90deg, #f06, #4a90e2);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
```
### `object-fit` برای تصویر
```css
img.thumb { width: 200px; height: 200px; object-fit: cover; object-position: center; }
```

---

## حاشیه (Border)
```css
.b {
  border: 2px solid #333;               /* width style color */
  border-width: 1px 2px;
  border-style: dashed;                 /* solid dotted double groove ridge none */
  border-color: red;
  border-top: 3px solid blue;
  border-inline-start: 4px solid orange;
  border-radius: 8px;                   /* گوشه‌ی گرد */
  border-radius: 50%;                   /* دایره (روی مربع) */
  border-radius: 10px 20px 30px 40px;
  border-radius: 999px;                 /* قرص (pill) */
  border-start-start-radius: 12px;      /* logical */
}
```
### Outline
```css
.focus { outline: 3px solid #1a73e8; outline-offset: 2px; }   /* روی layout تاثیر نداره */
```
### border با تصویر / گرادیان
```css
.fancy { border: 4px solid; border-image: linear-gradient(45deg, red, blue) 1; }
```

## سایه‌ها
```css
.card {
  box-shadow: 0 2px 8px rgb(0 0 0 / .15);                 /* x y blur color */
  box-shadow: 0 4px 12px 2px rgb(0 0 0 / .2);             /* x y blur spread color */
  box-shadow: inset 0 0 0 2px #1a73e8;                    /* داخلی */
  box-shadow: 0 1px 2px #0003, 0 8px 24px #0002;          /* چندلایه (طبیعی‌تر) */
}
img { filter: drop-shadow(0 4px 6px rgb(0 0 0 / .3)); }   /* دنبال شکل واقعی (PNG/SVG) */
```

## مثال: کارت
```html
<article class="card">
  <img src="photo.jpg" alt="" />
  <div class="card__body">
    <h3>عنوان</h3>
    <p>توضیح کوتاه برای کارت…</p>
    <a class="btn" href="#">ادامه</a>
  </div>
</article>
```
```css
.card {
  max-width: 320px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgb(0 0 0 / .1);
}
.card img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
.card__body { padding: 1rem; }
.btn {
  display: inline-block;
  padding: .5em 1.2em;
  background: #1a73e8;
  color: #fff;
  border-radius: 999px;
  text-decoration: none;
}
.btn:hover { background: #1558b0; }
```

## تمرین
۱. دکمه‌ای با گرادیان، سایه و حالت hover بساز.
۲. یک تصویر دایره‌ای (آواتار) با `object-fit: cover` بساز.
۳. تیتری با متن گرادیانی بساز.
