---
title: SEO، متا تگ‌ها و عملکرد
description: SEO، متا تگ‌ها و عملکرد؛ آموزش HTML به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: HTML
order: 8
---

## `<head>` حرفه‌ای
```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>آموزش HTML از صفر | وبلاگ من</title>
  <meta name="description" content="آموزش کامل HTML در سه سطح مبتدی، متوسط و پیشرفته با مثال‌های کاربردی." />
  <link rel="canonical" href="https://example.com/html-tutorial" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#1a73e8" media="(prefers-color-scheme: light)" />
  <meta name="color-scheme" content="light dark" />

  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.webmanifest" />

  <!-- Open Graph / Twitter -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="آموزش HTML از صفر" />
  <meta property="og:description" content="…" />
  <meta property="og:image" content="https://example.com/og.png" />
  <meta property="og:url" content="https://example.com/html-tutorial" />
  <meta property="og:locale" content="fa_IR" />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="stylesheet" href="/css/main.css" />
  <script src="/js/app.js" defer></script>
</head>
```

### قواعد `<title>` و `description`
- `title`: ۵۰–۶۰ کاراکتر، یکتا برای هر صفحه، کلمه‌ی کلیدی اول.
- `description`: ۱۱۰–۱۶۰ کاراکتر، جذاب (در نتایج گوگل دیده می‌شه، رتبه رو مستقیم تغییر نمی‌ده ولی نرخ کلیک رو بالا می‌بره).

### `meta robots`
```html
<meta name="robots" content="noindex, nofollow" />   <!-- ایندکس نشه -->
<meta name="googlebot" content="noarchive" />
```
`robots.txt` و `sitemap.xml` رو هم در ریشه‌ی سایت بذار.

### `canonical`
برای صفحات تکراری (فیلتر، UTM) اصلی‌ترین آدرس رو معرفی می‌کنه.

### چندزبانه: `hreflang`
```html
<link rel="alternate" hreflang="fa" href="https://example.com/fa/" />
<link rel="alternate" hreflang="en" href="https://example.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/" />
```

## داده‌ی ساختاریافته (Structured Data)
JSON-LD (روش پیشنهادی گوگل) برای Rich Results:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "آموزش HTML از صفر",
  "author": { "@type": "Person", "name": "علی رضایی" },
  "datePublished": "2025-03-15",
  "image": "https://example.com/og.png",
  "publisher": { "@type": "Organization", "name": "وبلاگ من" }
}
</script>
```
انواع پرکاربرد: `Article`, `Product` (قیمت/امتیاز)، `FAQPage`, `BreadcrumbList`, `Organization`, `LocalBusiness`, `Recipe`, `Event`, `VideoObject`.
تست: **Rich Results Test** و **Schema Markup Validator**.

## اصول SEO فنی در HTML
- یک `h1` مرتبط با محتوا، تیترهای منطقی.
- HTML معنایی ([لینک](/blog/html-semantic-html/)).
- `alt` توصیفی برای تصاویر.
- لینک‌های داخلی با متن توصیفی.
- URL کوتاه، خوانا، بدون پارامتر اضافه.
- `rel="nofollow"` / `rel="sponsored"` / `rel="ugc"` برای لینک‌های تبلیغاتی/کاربر.
- صفحات موبایل‌فرندلی (گوگل mobile-first indexing).
- محتوای مهم در HTML اولیه باشه، نه فقط بعد از اجرای JS (SSR/SSG برای SPA).
- سرعت بالا (Core Web Vitals).
- HTTPS و ریدایرکت 301 صحیح.

---

## عملکرد (Performance)

### Core Web Vitals
| معیار | یعنی | هدف خوب |
|---|---|---|
| **LCP** (Largest Contentful Paint) | سرعت نمایش بزرگ‌ترین محتوا | ≤ 2.5s |
| **INP** (Interaction to Next Paint) | پاسخ‌گویی به تعامل | ≤ 200ms |
| **CLS** (Cumulative Layout Shift) | پایداری چیدمان | ≤ 0.1 |

### بارگذاری اسکریپت
```html
<script src="a.js"></script>            <!-- ❌ پارس HTML رو متوقف می‌کنه -->
<script src="a.js" defer></script>      <!-- ✅ موازی دانلود، بعد از پارس اجرا، به ترتیب -->
<script src="a.js" async></script>      <!-- ✅ موازی دانلود، فوراً اجرا، بدون ترتیب (آنالیتیکس) -->
<script type="module" src="a.js"></script>   <!-- خودکار defer -->
<script nomodule src="legacy.js"></script>
```

### CSS
```html
<link rel="stylesheet" href="main.css" />          <!-- render-blocking -->
<link rel="stylesheet" href="print.css" media="print" />   <!-- بدون block روی صفحه -->
<style>/* Critical CSS بالای صفحه */</style>
<link rel="preload" href="main.css" as="style" onload="this.rel='stylesheet'" />
```

### Resource Hints
```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />   <!-- اتصال زودهنگام -->
<link rel="dns-prefetch" href="https://analytics.example.com" />
<link rel="preload" href="/fonts/vazir.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" as="image" href="/hero.avif" fetchpriority="high" />
<link rel="prefetch" href="/next-page.html" />        <!-- صفحه‌ی بعدی احتمالی -->
<link rel="modulepreload" href="/app.js" />
```
Speculation Rules (پیش‌رندر صفحه‌ی بعد):
```html
<script type="speculationrules">
{ "prerender": [{ "where": { "href_matches": "/products/*" } }] }
</script>
```

### تصاویر
- فرمت مدرن (AVIF/WebP)، `srcset`/`sizes`، ابعاد مشخص.
- `loading="lazy"` برای زیر fold، `fetchpriority="high"` برای LCP.
- CDN و فشرده‌سازی.

### فونت
```css
@font-face {
  font-family: "Vazir";
  src: url("/fonts/vazir.woff2") format("woff2");
  font-display: swap;          /* متن سریع با فونت جایگزین */
  unicode-range: U+0600-06FF;  /* فقط حروف فارسی */
}
```
فقط وزن‌های لازم (۲–۳ تا)، فرمت `woff2`، یا فونت متغیر.

### iframe و ویدئو
`loading="lazy"` روی iframe؛ برای YouTube از «facade» (تصویر + دکمه‌ی play، بارگذاری iframe با کلیک) استفاده کن.

### کاهش CLS
- `width`/`height` یا `aspect-ratio` برای تصاویر، ویدیو و تبلیغ.
- فضای رزرو برای المان‌هایی که دیرتر لود می‌شن.
- از اضافه کردن محتوا بالای محتوای موجود پرهیز کن.

### کاهش INP
- کار سنگین JS رو بشکن ([عملکرد JS](/blog/js-performance-and-memory/)).
- `requestIdleCallback`, Web Worker.
- event handler سبک، `debounce`.

### کش (Cache)
هدرهای HTTP:
```
Cache-Control: public, max-age=31536000, immutable   (فایل‌های hash شده)
Cache-Control: no-cache                              (HTML)
ETag / Last-Modified
```
- فشرده‌سازی **Brotli / gzip**.
- HTTP/2 یا HTTP/3.
- Service Worker برای cache و offline (PWA).

## اندازه‌گیری
| ابزار | کاربرد |
|---|---|
| Lighthouse (DevTools) | امتیاز و پیشنهاد |
| PageSpeed Insights | داده‌ی واقعی کاربران (CrUX) |
| WebPageTest | تحلیل دقیق waterfall |
| Chrome DevTools → Performance / Network | پروفایل |
| `web-vitals` | اندازه‌گیری در سایت خودت |

```js
import { onLCP, onINP, onCLS } from "web-vitals";
onLCP(console.log); onINP(console.log); onCLS(console.log);
```

## PWA پایه
```html
<link rel="manifest" href="/manifest.webmanifest" />
```
```json
{
  "name": "برنامه‌ی من", "short_name": "من",
  "start_url": "/", "display": "standalone",
  "background_color": "#ffffff", "theme_color": "#1a73e8",
  "icons": [{ "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" }]
}
```
```js
if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");
```

## امنیت مرتبط با HTML
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: https:" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
<a href="…" target="_blank" rel="noopener noreferrer">…</a>
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-…" crossorigin="anonymous"></script>   <!-- SRI -->
```
- ورودی کاربر هرگز با `innerHTML` درج نشه (XSS).
- هدرهای امنیتی بهتره از سمت سرور بیان: CSP، HSTS، X-Content-Type-Options.

## چک‌لیست
- [ ] title و description یکتا
- [ ] canonical، OG، favicon
- [ ] داده‌ی ساختاریافته مناسب
- [ ] اسکریپت‌ها `defer`
- [ ] تصاویر با ابعاد، lazy و فرمت مدرن
- [ ] فونت `woff2` + `font-display`
- [ ] preload برای منابع بحرانی (LCP)
- [ ] LCP/INP/CLS سبز در PageSpeed
- [ ] sitemap.xml و robots.txt
- [ ] HTTPS، کش، Brotli
