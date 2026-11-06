---
title: متغیرها (Custom Properties) و سلکتورهای مدرن
description: متغیرها (Custom Properties) و سلکتورهای مدرن؛ آموزش CSS به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: CSS
order: 9
---

## Custom Properties
```css
:root {
  --brand: #1a73e8;
  --radius: 8px;
  --space-1: .25rem;
  --space-2: .5rem;
  --space-3: 1rem;
  --font-body: "Vazirmatn", system-ui, sans-serif;
}

.btn {
  background: var(--brand);
  border-radius: var(--radius);
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-body);
}
```
- با `--` شروع می‌شن و **حساس به حروف** هستن.
- با `var(--name)` استفاده می‌شن. مقدار **پیش‌فرض (fallback)**:
```css
color: var(--text, #333);
color: var(--text, var(--fallback, black));
```
- **ارث می‌برن** و **cascade** دارن (برخلاف متغیرهای Sass که زمان کامپایل‌ان).
- در زمان اجرا قابل تغییر با JS و CSS.

### Scope و Override
```css
:root { --bg: white; --fg: #222; }
.dark { --bg: #111; --fg: #eee; }          /* هر زیردرخت .dark متغیرهای خودش رو داره */
.card { background: var(--bg); color: var(--fg); }

.btn { --btn-bg: var(--brand); background: var(--btn-bg); }
.btn.danger { --btn-bg: crimson; }          /* الگوی «hook» برای variant */
```

### تغییر با JS
```js
document.documentElement.style.setProperty("--brand", "#e91e63");
getComputedStyle(document.documentElement).getPropertyValue("--brand");
el.style.setProperty("--progress", "40%");
```
```css
.bar { width: var(--progress, 0%); }
```
مثال: موقعیت ماوس
```js
card.addEventListener("pointermove", (e) => {
  card.style.setProperty("--x", e.offsetX + "px");
  card.style.setProperty("--y", e.offsetY + "px");
});
```
```css
.card { background: radial-gradient(200px at var(--x) var(--y), #fff3, transparent); }
```

### تم‌دهی (Theming)
```css
:root { color-scheme: light dark; }
:root { --bg: #fff; --fg: #222; }
:root[data-theme="dark"] { --bg: #121212; --fg: #eee; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #121212; --fg: #eee; } }
```
### توکن‌های طراحی (Design Tokens)
```css
:root {
  /* primitive */
  --blue-500: oklch(60% .2 255);
  --gray-900: oklch(20% 0 0);
  /* semantic */
  --color-primary: var(--blue-500);
  --color-text: var(--gray-900);
  /* component */
  --button-bg: var(--color-primary);
}
```
### متغیر در `calc` و واحد
```css
:root { --gap: 1rem; }
.x { padding: calc(var(--gap) * 2); margin-inline: calc(var(--gap) * -1); }
```
> متغیر فقط **توکن مقدار** را جایگزین می‌کنه؛ `--n: 2` ← `calc(var(--n) * 1px)` یا `calc(1px * var(--n))`.

### متغیر نامعتبر
اگه مقدار نامعتبر باشه، ویژگی «invalid at computed-value time» و به مقدار ارثی/پیش‌فرض می‌رسه (نه fallback).

## `@property` — متغیر با نوع
```css
@property --angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}
.spin { background: conic-gradient(from var(--angle), red, blue, red); animation: rot 3s linear infinite; }
@keyframes rot { to { --angle: 360deg; } }       /* حالا قابل انیمیت است! */
```
`syntax`: `<color> <length> <percentage> <number> <angle> <time> <image> *`.

## `attr()` و `counter`
```css
a[href^="http"]::after { content: " ↗ " attr(href); }
.tip::after { content: attr(data-tip); }
```
```css
body { counter-reset: h2; }
h2::before { counter-increment: h2; content: "بخش " counter(h2, persian) ": "; }
```

---

## سلکتورهای مدرن

### `:is()` و `:where()`
```css
:is(h1, h2, h3):hover { color: var(--brand); }
:where(ul, ol) > li { margin: 0; }            /* specificity صفر: راحت override می‌شه */
```
`:where` برای استایل‌های reset/پایه؛ `:is` وقتی specificity مهمه.

### `:not()` با لیست
```css
a:not([class], [href^="#"]) { text-decoration: underline; }
li:not(:last-child) { border-bottom: 1px solid #ddd; }
```

### `:has()` ⭐ (انتخاب والد)
```css
.card:has(img) { grid-template-columns: 1fr 2fr; }
.field:has(input:invalid) label { color: crimson; }
form:has(input:checked) .submit { opacity: 1; }
body:has(dialog[open]) { overflow: hidden; }       /* قفل اسکرول */
h2:has(+ p) { margin-block-end: .25rem; }          /* تیتری که بعدش p هست */
li:has(> a:focus-visible) { outline: 2px solid; }
.grid:has(> :nth-child(5)) { /* وقتی ≥ ۵ آیتم داره */ }
```
- شمارش آیتم‌ها: `li:first-child:nth-last-child(3), li:first-child:nth-last-child(3) ~ li`.
- Quantity queries ← با `:has` ساده‌تر.

### `:focus-visible` و `:focus-within`
```css
button:focus-visible { outline: 3px solid var(--brand); }
.form:focus-within { box-shadow: 0 0 0 3px #1a73e840; }
```

### `:target`, `:checked`, `:indeterminate`, `:default`, `:read-only`
```css
section:target { background: lightyellow; }              /* #id در URL */
input:checked + label { font-weight: bold; }
dialog:modal { }
:popover-open { }
:fullscreen { }
:dir(rtl) .icon { transform: scaleX(-1); }               /* جهت متن */
:lang(fa) { font-family: Vazirmatn; }
:user-invalid { border-color: crimson; }
:any-link { }
```

### `:nth-child(… of …)`
```css
li:nth-child(2 of .active) { }                 /* دومین .active */
```

### Attribute و case
```css
[data-state="open" i] { }
```

### Pseudo-element های مدرن
```css
::selection { }
::first-line { }
::marker { }
::placeholder { }
::file-selector-button { }
::backdrop { }
::target-text { }
::highlight(search) { }                       /* CSS Custom Highlight API */
::view-transition-old(root) { }
::details-content { }
```

### `& ` در Nesting
در بخش [Nesting](/blog/css-container-queries-layers-nesting/).

## Specificity با این سلکتورها
```css
:is(#a, .b) p { }     /* = specificity بالاترین: #a → (1,0,1) */
:where(#a, .b) p { }  /* = (0,0,1) */
:has(.x) { }          /* = specificity داخلش */
:not(.x) { }          /* = specificity داخلش */
```

## الگوی «Lobotomized Owl»
```css
.stack > * + * { margin-block-start: 1rem; }
/* مدرن‌تر: */
.stack { display: grid; gap: 1rem; }
```

## تمرین
۱. سیستم طراحی کوچک با توکن‌های رنگ/فاصله/شعاع و دو تم light و dark بساز.
۲. با `:has` فرمی بساز که اگه فیلدی نامعتبر باشه، دکمه‌ی submit غیرفعال به‌نظر برسه.
۳. دکمه‌ای با `--btn-bg` و چند variant بساز.
۴. با `@property` یک border گرادیانی چرخان بساز.
