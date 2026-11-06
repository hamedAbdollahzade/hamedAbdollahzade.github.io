---
title: طراحی واکنش‌گرا (Responsive Design)
description: یعنی سایت روی هر اندازه‌ی صفحه (موبایل، تبلت، دسکتاپ، TV) خوب نمایش داده بشه.
date: 2026-11-06
category: CSS
order: 7
---

یعنی سایت روی هر اندازه‌ی صفحه (موبایل، تبلت، دسکتاپ، TV) خوب نمایش داده بشه.

## ۱. Viewport Meta
بدون این، موبایل صفحه رو به‌صورت دسکتاپ کوچک‌شده نمایش می‌ده:
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```
(`user-scalable=no` / `maximum-scale=1` رو نذار؛ مانع zoom کاربر می‌شه.)

## ۲. Mobile First
اول برای موبایل بنویس، بعد با `min-width` به صفحه‌های بزرگ‌تر گسترش بده:
```css
.cards { display: grid; gap: 1rem; grid-template-columns: 1fr; }          /* موبایل */

@media (min-width: 640px)  { .cards { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .cards { grid-template-columns: repeat(3, 1fr); } }
```
مزیت: کد کمتر، عملکرد بهتر در موبایل.

## ۳. Media Query

### سینتکس
```css
@media (condition) { … }
@media screen and (min-width: 768px) and (max-width: 1023px) { … }
@media (min-width: 768px), print { … }       /* , = یا */
@media not print { … }
```
### Range Syntax (مدرن)
```css
@media (width >= 768px) { }
@media (600px <= width <= 1000px) { }
@media (height < 500px) { }
```

### شرط‌های پرکاربرد
| شرط | معنی |
|---|---|
| `width`, `min-width`, `max-width` | عرض viewport |
| `height` | ارتفاع |
| `orientation: portrait \| landscape` | جهت |
| `aspect-ratio` | نسبت |
| `resolution: 2dppx` / `min-resolution: 192dpi` | تراکم پیکسل |
| `hover: hover \| none` | آیا دستگاه hover داره؟ |
| `pointer: fine \| coarse` | ماوس یا لمس |
| `prefers-color-scheme: dark` | تم تاریک |
| `prefers-reduced-motion: reduce` | کاهش حرکت |
| `prefers-contrast: more` | کنتراست بالا |
| `forced-colors: active` | حالت High Contrast |
| `print` | چاپ |

```css
@media (hover: hover) { .btn:hover { background: #eee; } }   /* hover فقط روی دستگاه‌هایی که دارن */
@media (pointer: coarse) { button { min-height: 44px; } }
@media (prefers-color-scheme: dark) { :root { --bg: #111; --fg: #eee; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
@media print { nav, footer { display: none; } a::after { content: " (" attr(href) ")"; } }
```

### Breakpoint های معمول (راهنما، نه قانون)
```
< 640px     موبایل
≥ 640px     موبایل بزرگ / تبلت کوچک
≥ 768px     تبلت
≥ 1024px    لپ‌تاپ
≥ 1280px    دسکتاپ
≥ 1536px    صفحه‌ی بزرگ
```
> breakpoint ها رو **بر اساس محتوا** انتخاب کن: جایی که چیدمان خراب می‌شه، نه بر اساس مدل دستگاه.

---

## ۴. واحدها و توابع انعطاف‌پذیر

### فونت سیال (Fluid Typography)
```css
h1 { font-size: clamp(1.75rem, 1rem + 3vw, 3.5rem); }
p  { font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem); }
```
### فاصله‌ی سیال
```css
:root { --space: clamp(1rem, 2vw + .5rem, 3rem); }
section { padding-block: var(--space); }
```
### عرض‌های سیال
```css
.container { width: min(100% - 2rem, 70rem); margin-inline: auto; }
.prose { max-width: 65ch; }
img { max-width: 100%; height: auto; }
```
### واحدهای viewport مدرن (موبایل)
نوار آدرس موبایل با `100vh` مشکل ایجاد می‌کنه:
```css
.hero { min-height: 100vh; min-height: 100dvh; }   /* dvh = پویا */
/* svh = کوچک‌ترین، lvh = بزرگ‌ترین */
```

## ۵. چیدمان‌های ذاتاً واکنش‌گرا
بدون media query:
```css
/* Grid خودکار */
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr)); gap: 1rem; }

/* Flex wrap */
.row { display: flex; flex-wrap: wrap; gap: 1rem; }
.row > * { flex: 1 1 300px; }

/* Sidebar که خودش می‌شکنه (Every Layout) */
.with-sidebar { display: flex; flex-wrap: wrap; gap: 1rem; }
.with-sidebar > :first-child { flex-basis: 20rem; flex-grow: 1; }
.with-sidebar > :last-child  { flex-basis: 0; flex-grow: 999; min-inline-size: 50%; }
```

## ۶. تصاویر و رسانه
```css
img, video { max-width: 100%; height: auto; display: block; }
.thumb { aspect-ratio: 16 / 9; object-fit: cover; width: 100%; }
iframe.video { width: 100%; aspect-ratio: 16 / 9; border: 0; }
```
HTML: `srcset` / `sizes` / `<picture>` ([رسانه](/blog/html-media-and-embeds/)).

## ۷. ناوبری موبایل (الگوی ساده)
```html
<header class="site-header">
  <a class="logo" href="/">لوگو</a>
  <button class="menu-btn" aria-expanded="false" aria-controls="nav">منو</button>
  <nav id="nav">
    <a href="/">خانه</a><a href="/blog">بلاگ</a><a href="/contact">تماس</a>
  </nav>
</header>
```
```css
.menu-btn { display: inline-flex; }
#nav { display: none; flex-direction: column; }
#nav.open { display: flex; }

@media (min-width: 768px) {
  .menu-btn { display: none; }
  #nav { display: flex; flex-direction: row; gap: 1rem; }
}
```
```js
btn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
```

## ۸. جدول ریسپانسیو
```css
.table-wrap { overflow-x: auto; }
@media (max-width: 600px) {
  table, thead, tbody, tr, th, td { display: block; }
  thead { position: absolute; left: -9999px; }
  td::before { content: attr(data-label) ": "; font-weight: bold; }
}
```

## ۹. تم تاریک
```css
:root { color-scheme: light dark; --bg: #fff; --fg: #222; }
@media (prefers-color-scheme: dark) { :root { --bg: #121212; --fg: #eee; } }
body { background: var(--bg); color: var(--fg); }

/* با تابع light-dark */
body { background: light-dark(#fff, #121212); color: light-dark(#222, #eee); }
```
دکمه‌ی دستی: `data-theme` روی `html` + `localStorage`.

## ۱۰. تست
- DevTools ← Toggle device toolbar (`Ctrl+Shift+M`).
- تست روی دستگاه واقعی، چرخش صفحه، zoom ۲۰۰٪.
- بررسی لمس: اندازه‌ی هدف ≥ 44px.
- Responsively App یا BrowserStack.

## چک‌لیست
- [ ] viewport meta
- [ ] mobile-first
- [ ] تصاویر `max-width: 100%`
- [ ] فونت و فاصله سیال (`clamp`)
- [ ] بدون اسکرول افقی (`overflow-x` را مخفی نکن، علت را پیدا کن)
- [ ] هدف‌های لمسی بزرگ
- [ ] `hover` فقط با `@media (hover: hover)`
- [ ] تم تاریک و `prefers-reduced-motion`
- [ ] Container Queries برای کامپوننت‌ها ([بعداً](/blog/css-container-queries-layers-nesting/))

## تمرین
۱. صفحه‌ی لندینگ با hero، سه کارت ویژگی، و فوتر که کاملاً mobile-first باشد.
۲. منوی همبرگری با دکمه‌ی دسترس‌پذیر.
۳. همان صفحه را بدون هیچ media query و فقط با `auto-fit`, `clamp` و `min()` ریسپانسیو کن.
