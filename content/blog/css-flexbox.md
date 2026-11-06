---
title: Flexbox
description: سیستم چیدمان یک‌بعدی (ردیف یا ستون). عالی برای ناوبار، کارت‌ها در یک ردیف، وسط‌چین کردن و توزیع فضا.
date: 2026-11-06
category: CSS
order: 5
---

سیستم چیدمان **یک‌بعدی** (ردیف یا ستون). عالی برای ناوبار، کارت‌ها در یک ردیف، وسط‌چین کردن و توزیع فضا.

```html
<div class="container">
  <div class="item">۱</div>
  <div class="item">۲</div>
  <div class="item">۳</div>
</div>
```
```css
.container { display: flex; }
```
با `display: flex` فرزندان مستقیم (**flex items**) کنار هم قرار می‌گیرن.

## محورها
- **Main axis (محور اصلی)**: جهت `flex-direction` (پیش‌فرض: افقی؛ در RTL از راست به چپ).
- **Cross axis (محور متقاطع)**: عمود بر محور اصلی.

```
flex-direction: row         →  [1][2][3]    main = افقی
flex-direction: column      ↓  [1]          main = عمودی
                               [2]
                               [3]
```

---

## ویژگی‌های Container

### `flex-direction`
```css
flex-direction: row;             /* پیش‌فرض */
flex-direction: row-reverse;
flex-direction: column;
flex-direction: column-reverse;
```

### `flex-wrap`
```css
flex-wrap: nowrap;     /* پیش‌فرض: همه در یک خط (کوچک می‌شن) */
flex-wrap: wrap;       /* بشکن به خط بعدی */
flex-wrap: wrap-reverse;
flex-flow: row wrap;   /* direction + wrap */
```

### `justify-content` — توزیع در **محور اصلی**
```css
justify-content: flex-start;      /* ابتدا */
justify-content: flex-end;        /* انتها */
justify-content: center;          /* وسط */
justify-content: space-between;   /* بین آیتم‌ها فضا؛ اولی و آخری به لبه‌ها */
justify-content: space-around;    /* فضای مساوی دور هر آیتم */
justify-content: space-evenly;    /* فاصله‌ی کاملاً مساوی */
```

### `align-items` — تراز در **محور متقاطع** (برای هر خط)
```css
align-items: stretch;       /* پیش‌فرض: پر کردن ارتفاع */
align-items: flex-start;
align-items: flex-end;
align-items: center;
align-items: baseline;      /* هم‌تراز خط پایه‌ی متن */
```

### `align-content` — توزیع **خطوط** (فقط با wrap و چند خط)
```css
align-content: flex-start | center | space-between | space-around | stretch;
```

### `gap`
```css
gap: 1rem;               /* فاصله بین آیتم‌ها (row و column) */
row-gap: 1rem; column-gap: 2rem;
```
> `gap` بهتر از margin: برای اولین/آخرین آیتم فضا اضافه نمی‌کنه.

---

## ویژگی‌های Item

### `flex-grow` / `flex-shrink` / `flex-basis`
```css
.item {
  flex-grow: 1;       /* سهم از فضای اضافه (پیش‌فرض 0) */
  flex-shrink: 1;     /* سهم کوچک شدن هنگام کمبود فضا (پیش‌فرض 1) */
  flex-basis: 200px;  /* اندازه‌ی اولیه روی محور اصلی (auto) */
}
```
**shorthand `flex`:**
```css
flex: 1;          /* = 1 1 0%  : فضای باقی‌مانده رو مساوی بگیر */
flex: auto;       /* = 1 1 auto */
flex: none;       /* = 0 0 auto : ثابت */
flex: 0 0 200px;  /* عرض ثابت 200px */
flex: 2 1 0;      /* دو برابر */
```
مثال: سایدبار ثابت + محتوای کشسان:
```css
.layout { display: flex; gap: 1rem; }
.sidebar { flex: 0 0 250px; }
.content { flex: 1; min-width: 0; }   /* min-width: 0 مانع سرریز متن‌های طولانی */
```

### `align-self`
```css
.item { align-self: flex-end; }    /* تراز مخصوص این آیتم */
```
### `order`
```css
.item { order: -1; }    /* ترتیب بصری (پیش‌فرض 0) ⚠️ ترتیب Tab عوض نمی‌شه */
```
### margin auto (ترفند)
```css
.nav { display: flex; }
.nav .logout { margin-inline-start: auto; }   /* بقیه‌ی فضا رو می‌گیره: آخر ردیف */
```

---

## الگوهای رایج

### وسط‌چین کامل
```css
.center { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
```

### ناوبار
```css
.navbar { display: flex; align-items: center; gap: 1rem; padding: 1rem; }
.navbar .spacer { flex: 1; }
```
```html
<nav class="navbar"><a>لوگو</a><span class="spacer"></span><a>ورود</a></nav>
```

### کارت‌های هم‌ارتفاع که می‌شکنن
```css
.cards { display: flex; flex-wrap: wrap; gap: 1rem; }
.card { flex: 1 1 250px; }       /* حداقل 250px، رشد کن */
```
(`flex: 1 1 250px` ⇒ هر ردیف به‌صورت خودکار تعداد کارت‌ها رو تنظیم می‌کنه.)

### Sticky Footer
```css
body { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1; }
```

### Holy Grail
```css
.page { display: flex; flex-direction: column; min-height: 100vh; }
.middle { display: flex; flex: 1; }
.middle > nav { flex: 0 0 200px; }
.middle > main { flex: 1; }
.middle > aside { flex: 0 0 200px; }
```

### ردیف فرم
```css
.row { display: flex; gap: .5rem; }
.row input { flex: 1; }
```

### ساختار آیکن + متن
```css
.btn { display: inline-flex; align-items: center; gap: .5em; }
```

### Truncate در flex
```css
.title { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
```

## RTL
در `dir="rtl"` محور اصلی افقی از **راست به چپ** است؛ `flex-start` = راست. نیازی به تغییر کد نیست.

## اشکال‌زدایی
- DevTools ← badge «flex» کنار المان ← overlay.
- آیتم‌ها کوچک می‌شن؟ → `flex-shrink: 0` یا `flex-wrap`.
- متن طولانی سرریز می‌کنه؟ → `min-width: 0` روی آیتم.
- `height: 100%` کار نمی‌کنه؟ → ارتفاع والد یا `align-items: stretch`.

## Flex یا Grid؟
- **Flex**: یک‌بعدی، محتوا-محور (محتوا اندازه رو تعیین می‌کنه).
- **Grid**: دوبعدی، ساختار-محور. ([Grid](/blog/css-grid/))

## تمرین
۱. ناوبار با لوگو سمت راست، لینک‌ها وسط و دکمه‌ی ورود سمت چپ.
۲. گالری کارت‌ها با `flex-wrap` و `gap`.
۳. چیدمان Holy Grail با Flexbox.
۴. بازی: [Flexbox Froggy](https://flexboxfroggy.com).
