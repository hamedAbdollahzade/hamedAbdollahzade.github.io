---
title: جلوه‌های پیشرفته: filter، clip-path، scroll-driven، View Transitions
description: جلوه‌های پیشرفته: filter، clip-path، scroll-driven، View Transitions؛ آموزش CSS به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: CSS
order: 12
---

## `filter` و `backdrop-filter`
```css
img { filter: grayscale(100%) contrast(1.1) blur(2px); }
/* توابع: blur() brightness() contrast() grayscale() hue-rotate() invert() opacity() saturate() sepia() drop-shadow() */
.glass {
  background: rgb(255 255 255 / .15);
  backdrop-filter: blur(12px) saturate(1.5);        /* محو کردن پشت المان */
  border: 1px solid rgb(255 255 255 / .3);
}
img:hover { filter: none; transition: filter .3s; }
```
`backdrop-filter` برای glassmorphism؛ فقط اگه پشتش چیزی هست دیده می‌شه، و روی عملکرد سنگینه.

## `mix-blend-mode` و `background-blend-mode`
```css
.title { mix-blend-mode: difference; color: white; }
.hero { background: url(a.jpg), #1a73e8; background-blend-mode: multiply; }
.layer { isolation: isolate; }
```
مقادیر: `multiply screen overlay darken lighten color-dodge difference exclusion hue luminosity`.

## `clip-path` و شکل‌ها
```css
.circle  { clip-path: circle(50% at center); }
.tri     { clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.diag    { clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%); }
.inset   { clip-path: inset(10px round 12px); }
.shape   { clip-path: path("M0 0 Q50 100 100 0 Z"); }
img:hover { clip-path: circle(75%); transition: clip-path .4s; }
```
### `mask`
```css
.fade-bottom { mask-image: linear-gradient(to bottom, #000 60%, transparent); }
.icon { mask: url(icon.svg) center / contain no-repeat; background: currentColor; }   /* آیکن رنگ‌پذیر */
```
### `shape-outside` (دور‌پیچیدن متن دور شکل)
```css
.avatar { float: left; width: 150px; shape-outside: circle(50%); clip-path: circle(50%); }
```

## سایه‌ها و Depth
```css
.elevation-1 { box-shadow: 0 1px 2px #0002; }
.elevation-3 { box-shadow: 0 1px 2px #0003, 0 4px 8px #0002, 0 16px 32px #0002; }
.neu { background: #e0e5ec; box-shadow: 9px 9px 16px #a3b1c6, -9px -9px 16px #fff; }   /* neumorphism */
.inner { box-shadow: inset 0 2px 6px #0003; }
```

## Gradient پیشرفته
```css
background: linear-gradient(in oklch, #f06, #4a90e2);              /* درون‌یابی بهتر */
background: linear-gradient(to right in oklch longer hue, red, blue);
background: conic-gradient(from 90deg at 50% 50%, #f06, #4a90e2, #f06);
/* Mesh-like: چند radial روی هم */
background:
  radial-gradient(at 20% 20%, #ff6ec7 0, transparent 50%),
  radial-gradient(at 80% 30%, #7873f5 0, transparent 50%),
  radial-gradient(at 50% 90%, #4ade80 0, transparent 50%),
  #111;
/* border گرادیانی */
.gb { border: 3px solid transparent; background: linear-gradient(#fff, #fff) padding-box, linear-gradient(45deg, #f06, #4a90e2) border-box; border-radius: 12px; }
```

## Scroll Snap
```css
.carousel { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 1rem; scroll-padding-inline: 1rem; }
.carousel > * { flex: 0 0 80%; scroll-snap-align: center; scroll-snap-stop: always; }
html { scroll-behavior: smooth; scroll-padding-top: 4rem; }   /* هدر ثابت و لینک #anchor */
```

## `position: sticky` و `scroll-margin`
```css
h2 { scroll-margin-top: 5rem; }
```

---

## Scroll-driven Animations ⭐
انیمیشن بر اساس اسکرول، **بدون JS**:
```css
/* نوار پیشرفت مطالعه */
.progress {
  position: fixed; inset: 0 0 auto 0; height: 4px; background: var(--brand);
  transform-origin: 0 50%;
  animation: grow linear both;
  animation-timeline: scroll(root block);
}
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
```
### با `view()` (وقتی المان وارد صفحه می‌شه)
```css
.reveal {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
@keyframes reveal { from { opacity: 0; translate: 0 40px; } to { opacity: 1; translate: 0; } }
```
- `scroll()`: بر اساس موقعیت اسکرول یک scroller.
- `view()`: بر اساس موقعیت المان در viewport.
- `animation-range`: `entry`, `exit`, `contain`, `cover`.
- Named timeline: `scroll-timeline-name: --page; view-timeline-name: --item;`.
- Fallback: `@supports (animation-timeline: view()) { … }` و در غیر این صورت بدون انیمیشن (یا IntersectionObserver).

## View Transitions API ⭐
انتقال نرم بین حالت‌های DOM یا صفحات:

### در همان صفحه (SPA)
```js
document.startViewTransition(() => updateDOM());
```
```css
::view-transition-old(root) { animation: fade-out .3s; }
::view-transition-new(root) { animation: fade-in .3s; }
```
### المان مشترک
```css
.card-thumb { view-transition-name: hero; }
.detail-img { view-transition-name: hero; }        /* همان نام در دو حالت ⇒ انتقال morph */
::view-transition-group(hero) { animation-duration: .5s; }
```
### بین صفحه‌ها (MPA)
```css
@view-transition { navigation: auto; }
```

## `@starting-style` و انیمیشن ورود/خروج
```css
.toast {
  transition: opacity .3s, translate .3s, display .3s allow-discrete;
  @starting-style { opacity: 0; translate: 0 20px; }
}
.toast.hide { opacity: 0; display: none; }

dialog { transition: opacity .25s, overlay .25s allow-discrete, display .25s allow-discrete; opacity: 0; }
dialog[open] { opacity: 1; @starting-style { opacity: 0; } }
```
`interpolate-size: allow-keywords;` ← انیمیت به `height: auto`:
```css
:root { interpolate-size: allow-keywords; }
.panel { height: 0; overflow: hidden; transition: height .3s; }
.panel.open { height: auto; }
```

## Anchor Positioning (جدید)
```css
.btn { anchor-name: --btn; }
.tooltip {
  position: absolute;
  position-anchor: --btn;
  position-area: top;                 /* بالای anchor */
  position-try-fallbacks: flip-block; /* اگه جا نبود */
  margin: .5rem;
}
```
با Popover API ترکیب عالی برای tooltip/dropdown بدون JS.

## `field-sizing` و `text-wrap`
```css
textarea { field-sizing: content; }      /* auto-grow */
h1 { text-wrap: balance; }
p  { text-wrap: pretty; }
```

## `accent-color`, `color-scheme`, `caret-color`
```css
:root { accent-color: var(--brand); color-scheme: light dark; }
input { caret-color: tomato; }
```

## Houdini: Paint API (مرور)
```css
.fancy { background: paint(my-pattern); }
```
```js
CSS.paintWorklet.addModule("pattern.js");
```
(پشتیبانی محدود؛ برای تجربه.)

## تمرین
۱. نوار پیشرفت مطالعه با `animation-timeline: scroll()`.
۲. کارت‌هایی که با `view()` هنگام ورود fade-in شن.
۳. گالری اسلایدی با scroll-snap.
۴. انتقال بین لیست و صفحه‌ی جزئیات با View Transitions و `view-transition-name`.
