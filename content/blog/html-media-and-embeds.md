---
title: رسانه، تصویر واکنش‌گرا، SVG و Embed
description: رسانه، تصویر واکنش‌گرا، SVG و Embed؛ آموزش HTML به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: HTML
order: 6
---

## تصویر واکنش‌گرا

### `srcset` و `sizes`
مرورگر بر اساس اندازه‌ی صفحه و تراکم پیکسل، بهترین فایل رو انتخاب می‌کنه:
```html
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1600.jpg 1600w"
  sizes="(min-width: 1024px) 50vw, 100vw"
  alt="کوه‌های برفی"
  width="1600" height="900"
  loading="lazy" decoding="async"
/>
```
- `400w` = عرض ذاتی فایل.
- `sizes` = عرضی که تصویر در صفحه می‌گیره.

برای تراکم پیکسل (Retina):
```html
<img src="logo.png" srcset="logo.png 1x, logo@2x.png 2x" alt="لوگو" />
```

### `<picture>` — فرمت و Art Direction
```html
<picture>
  <source type="image/avif" srcset="hero.avif" />
  <source type="image/webp" srcset="hero.webp" />
  <img src="hero.jpg" alt="…" width="1200" height="600" />
</picture>

<!-- تصویر متفاوت برای موبایل و دسکتاپ -->
<picture>
  <source media="(max-width: 600px)" srcset="hero-mobile.jpg" />
  <source media="(min-width: 601px)" srcset="hero-wide.jpg" />
  <img src="hero-wide.jpg" alt="…" />
</picture>
```

### بهینه‌سازی تصویر
- `width`/`height` بده تا چیدمان نپره (CLS).
- `loading="lazy"` برای تصاویر زیر fold؛ **نه** برای تصویر اصلی بالای صفحه (LCP).
- برای تصویر مهم: `fetchpriority="high"`.
- `decoding="async"`.

```html
<img src="hero.jpg" alt="…" fetchpriority="high" />
```

---

## ویدیو
```html
<video controls width="640" poster="cover.jpg" preload="metadata">
  <source src="movie.webm" type="video/webm" />
  <source src="movie.mp4" type="video/mp4" />
  <track kind="subtitles" src="fa.vtt" srclang="fa" label="فارسی" default />
  مرورگر شما از ویدیو پشتیبانی نمی‌کند.
</video>
```
| ویژگی | معنی |
|---|---|
| `controls` | نوار کنترل |
| `autoplay` | پخش خودکار (معمولاً با `muted` لازم) |
| `muted` | بی‌صدا |
| `loop` | تکرار |
| `playsinline` | پخش داخل صفحه در iOS |
| `preload` | `none` / `metadata` / `auto` |
| `poster` | تصویر پیش از پخش |

ویدیوی پس‌زمینه:
```html
<video autoplay muted loop playsinline aria-hidden="true"><source src="bg.mp4" /></video>
```
کنترل با JS:
```js
const v = document.querySelector("video");
v.play(); v.pause();
v.currentTime = 30; v.volume = 0.5; v.playbackRate = 1.5;
v.addEventListener("ended", () => {});
```

## صدا
```html
<audio controls src="podcast.mp3"></audio>
<audio controls>
  <source src="a.ogg" type="audio/ogg" />
  <source src="a.mp3" type="audio/mpeg" />
</audio>
```
زیرنویس و توضیح: `<track kind="captions|subtitles|descriptions|chapters">`.

---

## SVG
گرافیک برداری (بدون افت کیفیت، قابل استایل با CSS/JS).

### inline
```html
<svg width="100" height="100" viewBox="0 0 100 100" role="img" aria-labelledby="t">
  <title id="t">دایره‌ی قرمز</title>
  <circle cx="50" cy="50" r="40" fill="crimson" stroke="black" stroke-width="3" />
</svg>
```
### اشکال پایه
```html
<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="60" height="40" rx="6" fill="steelblue" />
  <circle cx="110" cy="30" r="20" fill="gold" />
  <ellipse cx="160" cy="30" rx="25" ry="12" fill="teal" />
  <line x1="10" y1="70" x2="190" y2="70" stroke="#333" stroke-width="2" />
  <polyline points="10,90 50,60 90,90" fill="none" stroke="purple" />
  <polygon points="120,90 150,60 180,90" fill="orange" />
  <path d="M10 90 Q 50 50 90 90 T 170 90" fill="none" stroke="green" stroke-width="3" />
  <text x="100" y="98" text-anchor="middle" font-size="10">SVG</text>
</svg>
```
- `viewBox="minX minY width height"` سیستم مختصات؛ همراه CSS `width:100%` ریسپانسیو می‌شه.
- دستورات `path`: `M` (move)، `L` (line)، `H/V`، `C/Q` (منحنی)، `A` (کمان)، `Z` (بستن).

### استفاده‌ی مجدد
```html
<svg style="display:none">
  <symbol id="icon-star" viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></symbol>
</svg>

<svg width="24" height="24" aria-hidden="true"><use href="#icon-star" /></svg>
```
### رنگ با CSS
```html
<svg class="icon" …><path fill="currentColor" … /></svg>
```
```css
.icon { color: tomato; width: 1.5em; }
```
### در `<img>` یا CSS
```html
<img src="logo.svg" alt="لوگو" />
```
```css
.hero { background: url("pattern.svg"); }
```
> SVG در `<img>` استایل/اسکریپت بیرونی نمی‌گیره؛ برای کنترل کامل، inline کن.

---

## Canvas
نقاشی پیکسلی با JS:
```html
<canvas id="c" width="300" height="150">متن جایگزین</canvas>
<script>
  const ctx = document.getElementById("c").getContext("2d");
  ctx.fillStyle = "tomato";
  ctx.fillRect(10, 10, 100, 60);
  ctx.beginPath();
  ctx.arc(200, 75, 40, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = "20px sans-serif";
  ctx.fillText("Canvas", 100, 130);
</script>
```
- **Canvas**: پیکسل‌محور، مناسب بازی و تصویرسازی پویای سنگین.
- **SVG**: اشیای DOM، مناسب آیکن و نمودار تعاملی.

---

## iframe و Embed
```html
<iframe
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="ویدیوی آموزشی"
  width="560" height="315"
  loading="lazy"
  allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
  allowfullscreen
></iframe>
```
امنیت:
```html
<iframe src="https://third-party.com" sandbox="allow-scripts allow-same-origin" referrerpolicy="no-referrer"></iframe>
```
- `sandbox` محدودیت‌های سخت‌گیرانه اعمال می‌کنه.
- هدرهای `X-Frame-Options` و CSP `frame-ancestors` از قرار گرفتن سایت تو در iframe دیگران جلوگیری می‌کنن.
- نقشه: `<iframe src="https://www.openstreetmap.org/export/embed.html?…">`.
- ریسپانسیو: CSS `aspect-ratio: 16 / 9; width: 100%`.

## `<object>` و `<embed>` (قدیمی‌تر)
```html
<object data="doc.pdf" type="application/pdf" width="600" height="400">
  <a href="doc.pdf">دانلود PDF</a>
</object>
```

## `<map>` و `<area>` (تصویر نقشه‌ای)
```html
<img src="map.png" usemap="#m" alt="نقشه" />
<map name="m">
  <area shape="rect" coords="0,0,100,100" href="/a" alt="بخش A" />
  <area shape="circle" coords="150,50,30" href="/b" alt="بخش B" />
</map>
```

## `<template>` و `<slot>`
در بخش [Web Components](/blog/html-modern-elements-and-web-components/).

## تمرین
۱. گالری تصاویر با `<picture>` (AVIF/WebP/JPG) و `srcset` بساز.
۲. پلیر ویدیو با زیرنویس فارسی و poster.
۳. یک آیکن SVG بکش و با `<symbol>/<use>` سه بار با رنگ‌های مختلف استفاده کن.
