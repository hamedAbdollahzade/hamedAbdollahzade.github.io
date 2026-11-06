---
title: Transition، Transform و Animation
description: Transition، Transform و Animation؛ آموزش CSS به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: CSS
order: 8
---

## Transition (گذار)
تغییر **نرم** مقدار یک ویژگی بین دو حالت:
```css
.btn {
  background: #1a73e8;
  color: #fff;
  transition: background-color 0.3s ease, transform 0.2s ease-out;
}
.btn:hover { background: #1558b0; transform: translateY(-2px); }
```

### ویژگی‌ها
```css
transition-property: background-color, transform;   /* یا all (پرهیز) */
transition-duration: 300ms;
transition-timing-function: ease;       /* linear | ease | ease-in | ease-out | ease-in-out */
transition-delay: 0s;
transition: opacity .3s ease .1s;        /* property duration timing delay */
```
- `transition: all` رو به‌جز نمونه‌های کوچیک استفاده نکن (ویژگی‌های ناخواسته هم animate می‌شن).
- فقط ویژگی‌های **قابل‌انیمیت** (عددی/رنگی). `display` و `auto` معمولاً نه.
- تابع زمان سفارشی:
```css
transition-timing-function: cubic-bezier(.2, .8, .2, 1);
transition-timing-function: steps(4, end);
transition-timing-function: linear(0, 0.25 20%, 1);       /* spring-like با linear() */
```
- ورود/خروج از `display: none`: مدرن:
```css
.panel {
  transition: opacity .3s, display .3s allow-discrete, overlay .3s allow-discrete;
  @starting-style { opacity: 0; }       /* حالت اولیه‌ی ورود */
}
.panel[hidden] { opacity: 0; display: none; }
```

---

## Transform

تغییر شکل **بدون** اثر روی چیدمان اطرافش (GPU، سریع).
```css
transform: translate(20px, 10px);   /* جابه‌جایی */
transform: translateX(-50%);        /* درصد = نسبت به خود المان */
transform: scale(1.1);              /* بزرگ‌نمایی */
transform: scale(1, 0.5);
transform: rotate(45deg);           /* چرخش */
transform: skew(10deg, 5deg);
transform: translateY(-4px) scale(1.05) rotate(2deg);   /* ترکیب (از راست به چپ اعمال می‌شه) */
transform-origin: top left;         /* نقطه‌ی مرجع */
```
ویژگی‌های مستقل (مدرن):
```css
translate: 10px 20px;
rotate: 45deg;
scale: 1.2;
```
### سه‌بعدی
```css
.scene { perspective: 800px; }
.card { transform-style: preserve-3d; transform: rotateY(25deg); backface-visibility: hidden; }
```
مثال: کارت چرخشی
```html
<div class="flip"><div class="front">رو</div><div class="back">پشت</div></div>
```
```css
.flip { perspective: 800px; width: 200px; height: 120px; }
.flip > div { position: absolute; inset: 0; transition: transform .6s; backface-visibility: hidden; }
.flip .back { transform: rotateY(180deg); }
.flip:hover .front { transform: rotateY(180deg); }
.flip:hover .back  { transform: rotateY(360deg); }
```

---

## Animation (@keyframes)

انیمیشن چندمرحله‌ای، مستقل از حالت‌ها:
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.box { animation: fade-in .6s ease-out forwards; }
```
با درصد:
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.15); }
}
.dot { animation: pulse 1.5s ease-in-out infinite; }
```

### ویژگی‌ها
```css
animation-name: pulse;
animation-duration: 2s;
animation-timing-function: ease-in-out;
animation-delay: .5s;
animation-iteration-count: infinite;     /* عدد یا infinite */
animation-direction: normal;             /* reverse | alternate | alternate-reverse */
animation-fill-mode: forwards;           /* none | forwards (حالت آخر بماند) | backwards | both */
animation-play-state: paused;            /* running */
animation: pulse 2s ease-in-out .5s infinite alternate both;
```
- `forwards`: بعد از پایان، مقدار آخر می‌مونه.
- `backwards`: در delay، مقدار `from` اعمال می‌شه.

### مثال‌ها
```css
/* اسپینر */
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 32px; height: 32px; border: 4px solid #ddd; border-top-color: #1a73e8; border-radius: 50%; animation: spin 1s linear infinite; }

/* Skeleton loading */
@keyframes shimmer { to { background-position: -200% 0; } }
.skeleton { background: linear-gradient(90deg, #eee 25%, #f8f8f8 50%, #eee 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }

/* تایپ */
@keyframes blink { 50% { border-color: transparent; } }

/* لرزش */
@keyframes shake { 0%,100% { translate: 0 } 25% { translate: -6px } 75% { translate: 6px } }
.error { animation: shake .3s; }
```

### چند انیمیشن
```css
.x { animation: fade-in .5s, pulse 2s 1s infinite; }
```

### کنترل با JS
```js
el.classList.add("animate");
el.addEventListener("animationend", () => el.classList.remove("animate"));
el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: "forwards" });   // Web Animations API
```

---

## عملکرد انیمیشن ⭐
فقط این ویژگی‌ها رو انیمیت کن (روی GPU، بدون reflow):
- `transform`
- `opacity`
- (و `filter` با احتیاط)

**نه**: `width`, `height`, `top`, `left`, `margin` (layout تغییر می‌کنه ← کند).
```css
/* ❌ */ .a { transition: left .3s; }
/* ✅ */ .a { transition: transform .3s; }
```
- `will-change: transform` فقط برای مواردی که واقعاً لازمه و موقتی.
- انیمیشن 60fps = ≤ 16ms برای هر فریم.

## دسترس‌پذیری حرکت
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
```
یا فقط حرکت‌های بزرگ رو در `@media (prefers-reduced-motion: no-preference)` بگذار.

## افکت‌های UI رایج

### دکمه با underline متحرک
```css
.link { position: relative; text-decoration: none; }
.link::after { content: ""; position: absolute; inset: auto 0 -2px 0; height: 2px; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform .3s; }
.link:hover::after { transform: scaleX(1); transform-origin: left; }
```
### کارت بالا بیاد
```css
.card { transition: transform .2s, box-shadow .2s; }
.card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgb(0 0 0 / .15); }
```
### Toggle سوئیچ
```html
<label class="switch"><input type="checkbox" /><span></span></label>
```
```css
.switch input { position: absolute; opacity: 0; }
.switch span { display: inline-block; width: 44px; height: 24px; background: #ccc; border-radius: 99px; position: relative; transition: background .2s; }
.switch span::after { content: ""; position: absolute; top: 2px; inset-inline-start: 2px; width: 20px; height: 20px; background: #fff; border-radius: 50%; transition: transform .2s; }
.switch input:checked + span { background: #1a73e8; }
.switch input:checked + span::after { transform: translateX(20px); }
[dir="rtl"] .switch input:checked + span::after { transform: translateX(-20px); }
.switch input:focus-visible + span { outline: 2px solid #1a73e8; outline-offset: 2px; }
```
### منوی کشویی
```css
.menu { transform: translateX(100%); transition: transform .3s; }
.menu.open { transform: none; }
```
### اکاردئون با انیمیت ارتفاع
```css
.acc { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s; }
.acc.open { grid-template-rows: 1fr; }
.acc > div { overflow: hidden; }
```
(یا `interpolate-size: allow-keywords` و `height: auto` در مرورگرهای جدید.)

## Pseudo-element + انیمیشن: Ripple / Tooltip
```css
[data-tip] { position: relative; }
[data-tip]::after {
  content: attr(data-tip);
  position: absolute; bottom: 120%; left: 50%; translate: -50% 4px;
  padding: .3em .6em; background: #222; color: #fff; border-radius: 4px; font-size: .8rem;
  opacity: 0; pointer-events: none; transition: opacity .2s, translate .2s;
}
[data-tip]:hover::after, [data-tip]:focus-visible::after { opacity: 1; translate: -50% 0; }
```

## تمرین
۱. دکمه‌ای با hover و focus-visible نرم بساز.
۲. لودر نقطه‌ای با سه نقطه که با delay متفاوت بپرن.
۳. کارت چرخشی ۳بعدی.
۴. انیمیشن fade-in برای هر آیتم لیست با `animation-delay` پلکانی (`:nth-child`).
