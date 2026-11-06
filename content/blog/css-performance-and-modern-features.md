---
title: عملکرد CSS و قابلیت‌های جدید
description: عملکرد CSS و قابلیت‌های جدید؛ آموزش CSS به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: CSS
order: 13
---

## چطور مرورگر صفحه رو رندر می‌کنه؟
۱. **Parse** HTML ← DOM و CSS ← CSSOM
۲. **Render Tree** = DOM + CSSOM
۳. **Layout (Reflow)**: محاسبه‌ی اندازه و موقعیت
۴. **Paint**: رنگ‌آمیزی پیکسل‌ها
۵. **Composite**: ترکیب لایه‌ها (روی GPU)

هزینه: Layout > Paint > Composite. هرچه تغییر به مراحل پایین‌تر محدود بشه، سریع‌تره.

| ویژگی تغییر کننده | تأثیر |
|---|---|
| `width, height, margin, padding, top, left, font-size, display` | Layout + Paint + Composite (گران) |
| `color, background, box-shadow, border-radius, outline` | Paint + Composite |
| `transform, opacity, filter(گاهی)` | فقط Composite (ارزان) ✅ |

## CSS render-blocking است
مرورگر تا CSS لود نشه رندر نمی‌کنه.
```html
<link rel="stylesheet" href="critical.css" />                       <!-- ضروری -->
<link rel="stylesheet" href="print.css" media="print" />            <!-- غیر مسدودکننده -->
<link rel="stylesheet" href="wide.css" media="(min-width: 1200px)" />
<link rel="preload" href="below-fold.css" as="style" onload="this.rel='stylesheet'" />
```
- **Critical CSS** را inline کن (بالای صفحه)، بقیه را async.
- فایل‌ها را minify و فشرده (Brotli) کن.
- CSS بدون استفاده را حذف کن (DevTools ← Coverage).

## سلکتورها و عملکرد
- مرورگر سلکتورها را **از راست به چپ** تطبیق می‌دهد.
- سلکتورهای ساده و کوتاه (`.btn`) بهتر از عمیق (`.a .b > .c ~ d`).
- در عمل این معمولاً گلوگاه نیست؛ مگه DOM خیلی بزرگ. `:has()` پیچیده روی DOM بزرگ رو با احتیاط.

## `content-visibility` ⭐
رندر نکردن بخش‌های خارج از صفحه:
```css
.section {
  content-visibility: auto;
  contain-intrinsic-size: auto 600px;      /* ارتفاع تخمینی برای جلوگیری از پرش اسکرول */
}
```
تا چند برابر سریع‌تر شدن رندر صفحات طولانی.

## `contain`
```css
.widget { contain: layout paint style; }      /* تغییرات داخلی روی بیرون اثر نداره */
.card   { contain: content; }                 /* layout + paint + style */
.box    { contain: strict; }                  /* + size (اندازه‌ی ثابت لازم) */
```

## `will-change`
```css
.menu { will-change: transform; }       /* لایه‌ی GPU از قبل */
```
- موقتی استفاده کن (قبل از انیمیشن اضافه، بعدش حذف).
- زیاد استفاده → مصرف حافظه‌ی زیاد.

## فونت
```css
@font-face { font-family: X; src: url(x.woff2) format("woff2"); font-display: swap; unicode-range: U+0600-06FF; }
```
- فقط `woff2`، زیرمجموعه‌ی کاراکترها (subset)، وزن‌های لازم، فونت متغیر.
- `<link rel="preload" as="font" crossorigin>` برای فونت بحرانی.
- `size-adjust`, `ascent-override` برای کاهش پرش فونت (CLS):
```css
@font-face { font-family: "Fallback"; src: local("Arial"); size-adjust: 105%; ascent-override: 95%; }
```
- فونت سیستم: `font-family: system-ui` (صفر دانلود).

## کاهش CLS با CSS
```css
img, video { max-width: 100%; height: auto; }   /* width/height در HTML نسبت تصویر رو مشخص می‌کنه */
.embed { aspect-ratio: 16 / 9; }
.ad-slot { min-height: 250px; }
```

## تصاویر و پس‌زمینه
```css
.hero { background-image: image-set(url(hero.avif) type("image/avif"), url(hero.webp) type("image/webp"), url(hero.jpg)); }
```
- تصاویر کوچک: SVG / inline data URI (کم).
- `loading="lazy"`, ابعاد مشخص ([HTML performance](/blog/html-seo-meta-performance/)).

## اندازه‌گیری
- **DevTools → Performance**: Recalculate Style / Layout / Paint.
- **Rendering → Paint flashing / Layout Shift Regions / Layer borders**.
- **Coverage**: CSS استفاده‌نشده.
- **Lighthouse / PageSpeed**: Render-blocking resources.
- **Performance Insights / CSS Overview**.

---

## وضعیت پشتیبانی و Progressive Enhancement
```css
.layout { display: flex; }                                /* پایه برای همه */
@supports (display: grid) { .layout { display: grid; } }  /* ارتقا */
@supports (animation-timeline: view()) { .reveal { animation: … } }
@supports selector(:has(a)) { }
```
- کنترل پشتیبانی: **caniuse.com**, **MDN Browser Compat**, **web.dev/baseline**.
- **Baseline**: ویژگی‌هایی که در همه‌ی مرورگرهای اصلی پشتیبانی می‌شن («Widely available» = ≥ ۳۰ ماه).

## مرور قابلیت‌های جدید (۲۰۲۳–۲۰۲۵)
| قابلیت | کاربرد |
|---|---|
| **Container Queries** + units | کامپوننت واکنش‌گرا |
| **`:has()`** | سلکتور والد |
| **Nesting** | تودرتویی بومی |
| **`@layer`** | کنترل اولویت |
| **`@scope`** | محدوده‌ی استایل |
| **Subgrid** | هم‌ترازی در grid تودرتو |
| **`color-mix()`, `oklch`, relative colors, `light-dark()`** | رنگ مدرن |
| **`@property`** | متغیر تایپ‌دار و انیمیت‌پذیر |
| **View Transitions** | انتقال نرم صفحه |
| **Scroll-driven animations** | انیمیشن اسکرول بدون JS |
| **`@starting-style` + `allow-discrete`** | انیمیشن ورود/خروج و `display` |
| **Anchor Positioning** | tooltip/popover |
| **Popover API / `<dialog>`** | لایه‌های UI بومی |
| **`text-wrap: balance / pretty`** | تایپوگرافی بهتر |
| **`field-sizing: content`** | textarea خودرشد |
| **`interpolate-size`** | انیمیت به `auto` |
| **Logical Properties** | RTL/LTR |
| **`dvh/svh/lvh`** | viewport موبایل |
| **`aspect-ratio`, `gap`, `inset`** | ابزارهای پایه |
| **`:focus-visible`, `:user-invalid`** | فرم‌ها و فوکوس |
| **`accent-color`, `color-scheme`** | کنترل‌های فرم بومی |
| **CSS Math: `round()`, `mod()`, `rem()`, `sin()`, `cos()`, `pow()`** | محاسبات |

### توابع ریاضی
```css
width: round(up, 100%, 50px);           /* گرد به مضرب 50px */
rotate: calc(sin(30deg) * 1turn);
--x: mod(17, 5);                         /* 2 */
```
### `light-dark()` و `color-scheme`
```css
:root { color-scheme: light dark; }
body { background: light-dark(#fff, #111); color: light-dark(#222, #eee); }
```
### `color-mix`
```css
.btn:hover { background: color-mix(in oklch, var(--brand), black 15%); }
.tint { background: color-mix(in srgb, var(--brand) 20%, transparent); }
```
### `if()` و `@function` (در حال ورود)
```css
.x { color: if(style(--theme: dark): white; else: black); }
```
### `sibling-index()`, `sibling-count()` (جدید)
```css
li { transition-delay: calc(sibling-index() * 50ms); }
```
### `reading-flow`, `corner-shape`, `::scroll-marker` (آزمایشی)
هنوز در حال شکل‌گیری‌اند؛ قبل از استفاده caniuse را بررسی کن.

---

## نقشه‌ی راه یادگیری بعدی
1. ساخت یک **Design System** کوچک (توکن‌ها + ۵ کامپوننت) با Layers و Custom Properties.
2. تمرین Layout های حرفه‌ای: [Every Layout](https://every-layout.dev)، [Modern CSS Solutions](https://moderncss.dev).
3. بازی‌ها و چالش‌ها: [CSS Battle](https://cssbattle.dev)، Flexbox Froggy، Grid Garden.
4. منابع: MDN، web.dev/learn/css، CSS-Tricks، Kevin Powell، Josh Comeau.
5. ابزار: Tailwind، Open Props، UnoCSS (در صورت نیاز).
6. ترکیب با [JavaScript](/blog/#javascript) برای کامپوننت‌های تعاملی.

## چک‌لیست نهایی یک پروژه‌ی CSS خوب
- [ ] Reset/Base مدرن + `box-sizing: border-box`
- [ ] توکن‌ها (رنگ، فاصله، فونت) با Custom Properties
- [ ] mobile-first و واحدهای سیال (`clamp`, `rem`, `dvh`)
- [ ] Layout با Grid/Flex و Container Queries
- [ ] لایه‌بندی `@layer` + سلکتورهای تخت
- [ ] Logical Properties برای RTL
- [ ] دسترس‌پذیری: focus-visible، کنتراست، reduced-motion، color-scheme
- [ ] انیمیشن فقط روی `transform/opacity`
- [ ] Critical CSS، `content-visibility`، فونت بهینه
- [ ] Progressive Enhancement با `@supports`
