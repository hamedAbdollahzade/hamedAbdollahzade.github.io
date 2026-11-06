---
title: Box Model، واحدها و رنگ‌ها
description: Box Model، واحدها و رنگ‌ها؛ آموزش CSS به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: CSS
order: 2
---

## Box Model (مدل جعبه)
هر المان یک جعبه است با چهار لایه، از داخل به بیرون:

```
┌─────────────── margin ───────────────┐
│ ┌─────────── border ───────────────┐ │
│ │ ┌─────── padding ──────────────┐ │ │
│ │ │        content               │ │ │
│ │ └──────────────────────────────┘ │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```
- **content**: محتوا (`width`/`height` اینجا اعمال می‌شه)
- **padding**: فضای داخلی بین محتوا و border
- **border**: حاشیه
- **margin**: فاصله‌ی خارجی تا المان‌های دیگه (شفاف)

```css
.box {
  width: 300px;
  padding: 20px;
  border: 2px solid #333;
  margin: 16px;
}
```

### `box-sizing` ⭐
- `content-box` (پیش‌فرض): عرض = فقط content. عرض کل = `300 + 40 + 4 = 344px`.
- `border-box`: عرض شامل padding و border. عرض کل = `300px`. **این رو همیشه استفاده کن:**
```css
*, *::before, *::after { box-sizing: border-box; }
```

## Padding و Margin

```css
margin: 10px;                    /* هر ۴ طرف */
margin: 10px 20px;               /* بالا/پایین  چپ/راست */
margin: 10px 20px 30px;          /* بالا  چپ/راست  پایین */
margin: 10px 20px 30px 40px;     /* بالا راست پایین چپ (ساعتگرد) */
margin-top: 10px; margin-right: 0; margin-bottom: 0; margin-left: auto;

margin: 0 auto;                  /* وسط‌چین افقی (برای بلوک با عرض مشخص) */
```
### Logical Properties (مناسب RTL/LTR)
```css
margin-inline: auto;           /* چپ و راست (یا راست و چپ در RTL) */
margin-block: 1rem;            /* بالا و پایین */
padding-inline-start: 1rem;    /* شروع خط (راست در فارسی) */
padding-block-end: 2rem;
border-inline-start: 3px solid;
inline-size: 50%;              /* مثل width */
block-size: 100px;             /* مثل height */
inset-inline-start: 0;         /* مثل left/right متناسب با جهت */
```
> برای سایت‌های فارسی/دوزبانه logical properties بهتر از `left/right` هستن.

### Margin Collapse
margin عمودیِ دو بلوک مجاور **ادغام** می‌شه (بزرگ‌تر برنده):
```css
.a { margin-bottom: 30px; }
.b { margin-top: 20px; }       /* فاصله = 30px نه 50px */
```
- در flex/grid و المان‌های با padding/border/overflow ادغام نمی‌شه.
- راه‌حل مدرن: `gap` یا فقط یک جهت margin.

### منفی
```css
margin-top: -10px;   /* به بالا می‌کشه */
```
padding منفی ندارد.

## Width و Height
```css
width: 300px;   height: 200px;
width: 50%;                           /* از والد */
min-width: 200px;  max-width: 1200px;
min-height: 100vh;
width: fit-content;  width: max-content;  width: min-content;
width: auto;                           /* پیش‌فرض: بلوک = کل عرض */
width: calc(100% - 40px);
width: clamp(280px, 50%, 600px);
aspect-ratio: 16 / 9;
```
> `height: 100%` فقط وقتی کار می‌کنه که والد ارتفاع مشخص داشته باشه؛ `min-height: 100vh` عملی‌تره.

## Overflow
```css
overflow: visible;   /* پیش‌فرض */
overflow: hidden;    /* برش */
overflow: scroll;    /* همیشه اسکرول */
overflow: auto;      /* در صورت نیاز */
overflow-x: auto; overflow-y: hidden;
overflow: clip;
text-overflow: ellipsis;   /* با white-space: nowrap; overflow: hidden */
```

---

## واحدها (Units)

### مطلق
| واحد | توضیح |
|---|---|
| `px` | پیکسل (CSS pixel) |
| `cm, mm, in, pt, pc` | (بیشتر برای چاپ) |

### نسبی
| واحد | نسبت به |
|---|---|
| `%` | والد |
| `em` | اندازه‌ی فونت **همین المان** (برای font-size: والد) |
| `rem` | اندازه‌ی فونت **ریشه** (`html`) ⭐ |
| `ch` | عرض کاراکتر `0` |
| `ex` | ارتفاع x |
| `lh` | ارتفاع خط |
| `vw`, `vh` | ۱٪ عرض/ارتفاع viewport |
| `vmin`, `vmax` | کوچک‌تر/بزرگ‌تر از vw و vh |
| `svh, lvh, dvh` | ارتفاع viewport کوچک/بزرگ/پویا (موبایل) |
| `cqw, cqh` | container query units |
| `fr` | سهم از فضای باقی‌مانده (grid) |

```css
html { font-size: 100%; }           /* معمولاً 16px */
h1 { font-size: 2rem; }             /* 32px */
.btn { padding: .5em 1em; }         /* متناسب با فونت دکمه */
.hero { min-height: 100dvh; }
.container { max-width: 70ch; }     /* طول خط خوانا */
```
> برای فونت و فاصله‌ها `rem` بهتره (به تنظیمات اندازه‌ی فونت کاربر احترام می‌ذاره).

### توابع محاسباتی
```css
width: calc(100% - 2rem);
width: min(90%, 800px);              /* کوچک‌ترین */
width: max(300px, 30%);              /* بزرگ‌ترین */
font-size: clamp(1rem, 2.5vw, 2rem); /* حداقل، ایده‌آل، حداکثر */
padding: calc(var(--space) * 2);
```
`calc` ← با فاصله‌ی دو طرف عملگر: `calc(1px + 2px)`.

---

## رنگ‌ها

### روش‌های نوشتن
```css
color: red;                          /* نام (۱۴۰ تا) */
color: #ff5733;                      /* hex */
color: #f53;                         /* hex کوتاه */
color: #ff573380;                    /* hex با آلفا (۸ رقم) */
color: rgb(255 87 51);               /* RGB */
color: rgb(255 87 51 / 0.5);         /* با شفافیت */
color: rgba(255, 87, 51, 0.5);       /* قدیمی */
color: hsl(11 100% 60%);             /* Hue(0-360) Saturation Lightness */
color: hsl(11 100% 60% / 50%);
color: transparent;
color: currentColor;                 /* رنگ فعلی متن */
```
**HSL** برای ساختن پالت (تیره/روشن کردن) خیلی مناسبه.

### فضاهای رنگی مدرن
```css
color: oklch(70% 0.2 30);            /* ادراک یکنواخت‌تر، رنگ‌های پرجان‌تر */
color: lab(60% 40 30);
color: color(display-p3 1 0.3 0.2);  /* گستره‌ی وسیع‌تر */
color: color-mix(in oklch, tomato 70%, white);   /* ترکیب رنگ */
color: light-dark(#222, #eee);                   /* بسته به color-scheme */
```
**relative color:**
```css
background: hsl(from var(--brand) h s calc(l + 20));
```

### Opacity
```css
opacity: 0.5;        /* کل المان و فرزندانش */
background: rgb(0 0 0 / .5);   /* فقط پس‌زمینه */
```

### کنتراست
متن عادی ≥ 4.5:1 ([دسترس‌پذیری](/blog/html-accessibility/)).

## `color` و `currentColor`
```css
.btn { color: tomato; border: 2px solid currentColor; }
svg { fill: currentColor; }
```

## تمرین
۱. کارتی بساز با width ۳۰۰، padding ۱۶، border ۱px، margin وسط‌چین، با `box-sizing: border-box`.
۲. با `clamp` یک تیتر واکنش‌گرا بساز.
۳. پالت ۵ رنگ از یک hue با HSL تولید کن.
