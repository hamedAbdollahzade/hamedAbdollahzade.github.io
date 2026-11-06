---
title: سینتکس، سلکتورها و Cascade
description: سینتکس، سلکتورها و Cascade؛ آموزش CSS به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: CSS
order: 1
---

## افزودن CSS به صفحه
```html
<!-- ۱) فایل خارجی (بهترین) -->
<link rel="stylesheet" href="style.css" />

<!-- ۲) تگ style داخل head -->
<style>
  p { color: blue; }
</style>

<!-- ۳) درون‌خطی (inline؛ پرهیز) -->
<p style="color: blue; font-size: 18px">متن</p>
```

## سینتکس
```css
selector {
  property: value;
  another-property: value;
}
```
```css
h1 {
  color: crimson;       /* property: value; */
  font-size: 2rem;
}
/* کامنت */
```
- هر declaration با `;` تموم می‌شه.
- چند سلکتور با `,`: `h1, h2, h3 { margin: 0; }`

---

## سلکتورهای پایه
```css
* { box-sizing: border-box; }          /* همه */
p { }                                    /* تگ */
.card { }                                /* کلاس */
#header { }                              /* id (یکتا) */
[type="text"] { }                        /* ویژگی */
```
```html
<p class="card highlight" id="intro">…</p>
```

### سلکتور ویژگی (Attribute)
```css
[disabled] { }                  /* وجود دارد */
[type="email"] { }              /* مساوی */
[class~="card"] { }             /* شامل کلمه */
[lang|="en"] { }                /* en یا en-… */
[href^="https"] { }             /* شروع با */
[href$=".pdf"] { }              /* پایان با */
[href*="example"] { }           /* شامل */
[type="TEXT" i] { }             /* بی‌تفاوت به حروف */
```

## Combinator ها (ترکیب‌کننده‌ها)
```css
div p { }          /* فرزند در هر عمق (descendant) */
div > p { }        /* فرزند مستقیم (child) */
h1 + p { }         /* همسایه‌ی بلافصل بعدی (adjacent sibling) */
h1 ~ p { }         /* همه‌ی همسایه‌های بعدی (general sibling) */
.a.b { }           /* هر دو کلاس روی یک المان (بدون فاصله!) */
div.card { }       /* div با کلاس card */
```

## Pseudo-class ها (حالت‌ها)
```css
a:hover { color: red; }          /* ماوس روی آن */
a:active { }                      /* در حال کلیک */
a:visited { }                     /* بازدیدشده */
a:focus, input:focus-visible { }  /* فوکوس */
input:checked { }  input:disabled { }  input:required { }
input:valid { }  input:invalid { }  input:placeholder-shown { }

li:first-child { }   li:last-child { }   li:only-child { }
li:nth-child(2) { }          /* دومی */
li:nth-child(odd) { }  li:nth-child(even) { }
li:nth-child(3n) { }         /* هر ۳تا */
li:nth-child(n+4) { }        /* از چهارمی به بعد */
li:nth-last-child(2) { }
p:first-of-type { }  p:nth-of-type(2) { }
:not(.active) { }
:empty { }
:root { }                    /* html */
:is(h1, h2, h3) a { }        /* گروه‌بندی سلکتور */
:where(h1, h2) { }           /* مثل is با specificity صفر */
:has(> img) { }              /* والدی که … داره */
```
`:has` = «انتخاب‌گر والد»:
```css
.card:has(img) { padding: 0; }
form:has(:invalid) button { opacity: .5; }
```

## Pseudo-element ها (بخش‌های مجازی)
با `::` (دو نقطه):
```css
p::first-line { font-weight: bold; }
p::first-letter { font-size: 2em; float: right; }
::selection { background: gold; }
::placeholder { color: #999; }
::marker { color: tomato; }               /* نقطه‌ی لیست */
.btn::before { content: "→ "; }
.btn::after  { content: ""; }
::backdrop { }                             /* dialog / fullscreen */
```
`::before` و `::after` **حتماً** `content` نیاز دارن (حتی خالی `""`).

---

## Cascade (آبشاری)
وقتی چند قانون به یک المان بخوره، برنده با این ترتیب مشخص می‌شه:

1. **اهمیت و منشأ**: `!important` > author > user > browser default
2. **Cascade Layer** ([بعداً](/blog/css-container-queries-layers-nesting/))
3. **Specificity** (ویژگی)
4. **ترتیب**: آخری برنده است

### Specificity (اولویت سلکتور)
به‌صورت سه‌تایی `(id, class, tag)`:

| سلکتور | امتیاز |
|---|---|
| `*` | `0,0,0` |
| `p` | `0,0,1` |
| `p::before` | `0,0,2` |
| `.card`, `[type]`, `:hover` | `0,1,0` |
| `#id` | `1,0,0` |
| `style=""` | بالاتر از همه |
| `:is()` | بالاترین داخلش |
| `:where()` | `0` |
| `:not(.a)` | مثل `.a` |

```css
p { color: black; }              /* 0,0,1 */
.text { color: blue; }           /* 0,1,0 ← برنده بر p */
#intro { color: red; }           /* 1,0,0 ← برنده بر همه */
div p.text { }                    /* 0,1,2 */
```
`!important` فقط در شرایط خاص (و بیشتر برای utility ها):
```css
.hidden { display: none !important; }
```
> از `#id` برای استایل‌دهی پرهیز کن (اولویت زیاد، سخت override می‌شه). کلاس‌ها رو بیشتر استفاده کن.

### Inheritance (وراثت)
بعضی ویژگی‌ها از والد به فرزند می‌رسن: `color`, `font-*`, `line-height`, `text-align`, `visibility`, `cursor`, `list-style`.
بعضی نه: `margin`, `padding`, `border`, `background`, `width`, `display`.
```css
body { font-family: sans-serif; color: #222; }   /* همه‌ی فرزندان ارث می‌برن */
```
کنترل ارث:
```css
.x { color: inherit; }      /* از والد بگیر */
.x { color: initial; }      /* مقدار پیش‌فرض خود CSS */
.x { color: unset; }        /* ارثی بود inherit، وگرنه initial */
.x { all: unset; }          /* همه‌ی ویژگی‌ها */
.x { color: revert; }       /* برگردان به استایل مرورگر */
```

## ترتیب و سازمان‌دهی
```css
/* ۱. reset / base  ۲. layout  ۳. components  ۴. utilities */
```
```css
/* Reset ساده و مدرن */
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; line-height: 1.5; }
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
```

## DevTools
- `F12` ← Elements ← Styles: ببین کدوم قانون اعمال شده/خط خورده.
- Computed: مقدار نهایی.
- تیک زدن/برداشتن قانون‌ها و ویرایش زنده.

## خطاهای رایج
- فراموش کردن `;` یا `}`.
- استفاده از `.` یا `#` اشتباهی.
- فاصله در `.a .b` (descendant) در برابر `.a.b` (هر دو).
- `ID` برای استایل.
- override نشدن به‌خاطر specificity بالاتر یا ترتیب.

## تمرین
۱. بدون تغییر HTML، همه‌ی لینک‌های `.pdf` رو با آیکن (`::after`) نشان بده.
۲. سطرهای زوج جدول رو رنگی کن (`:nth-child(even)`).
۳. توضیح بده چرا `.a .b` با `.a.b` فرق دارد.
