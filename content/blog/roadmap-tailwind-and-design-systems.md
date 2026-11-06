---
title: فریم‌ورک‌های CSS و Design System
description: پایه‌ی CSS: دوره‌ی CSS. اینجا ابزارهایی که روش کار رو سریع‌تر و یکدست‌تر می‌کنن.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 15
---

پایه‌ی CSS: [دوره‌ی CSS](/blog/#css). اینجا ابزارهایی که روش کار رو سریع‌تر و یکدست‌تر می‌کنن.

## انواع فریم‌ورک CSS
| نوع | نمونه | ایده |
|---|---|---|
| **Utility-first** | **Tailwind CSS**, UnoCSS | کلاس‌های کوچک تک‌منظوره در HTML |
| **کامپوننت‌محور** | Bootstrap, Bulma | کامپوننت‌های آماده (`.btn`, `.card`) |
| **کامپوننت headless** | Radix UI, Headless UI, shadcn/ui | منطق/دسترس‌پذیری آماده، ظاهر با خودت |
| **Design systemهای کامل** | Material UI, Ant Design, Chakra | کامپوننت‌های React با ظاهر رسمی |

## Tailwind CSS
```bash
npm i tailwindcss @tailwindcss/vite
```
```ts
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
export default { plugins: [tailwindcss()] };
```
```css
/* style.css */
@import "tailwindcss";
```

### استفاده
```html
<button class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium
               hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2
               disabled:opacity-50 transition-colors">
  ذخیره
</button>
```
- فاصله: `p-4` (padding ۱rem)، `mx-auto`، `gap-2`، `space-y-4`
- اندازه: `w-full`، `max-w-md`، `h-screen`
- تایپوگرافی: `text-lg`، `font-bold`، `leading-relaxed`، `text-center`
- رنگ: `bg-slate-100`، `text-gray-700`، `border-red-500`
- Flex/Grid: `flex items-center justify-between`، `grid grid-cols-3 gap-4`
- ظاهر: `rounded-xl`، `shadow-md`، `ring-2`

### حالت‌ها و واکنش‌گرایی (variants)
```html
<div class="p-4 md:p-8 lg:grid lg:grid-cols-3">      <!-- mobile-first breakpoint -->
<a class="text-blue-600 hover:underline dark:text-blue-400">
<li class="first:mt-0 odd:bg-gray-50 group-hover:text-white">
<div class="@container"><div class="@md:flex"> <!-- container query -->
```
breakpointها: `sm:640px md:768px lg:1024px xl:1280px 2xl:1536px` (پیش‌فرض).

### RTL
از **logical utilities** استفاده کن: `ms-4` (margin-inline-start)، `pe-2`، `text-start`، و برای تغییر جهت `rtl:` و `ltr:` variant:
```html
<div dir="rtl"><span class="ms-2 rtl:rotate-180">←</span></div>
```
(مرتبط: [Logical Properties و متغیرها](/blog/css-variables-and-modern-selectors/))

### سفارشی‌سازی (نسخه‌ی جدید، در CSS)
```css
@import "tailwindcss";
@theme {
  --color-brand: oklch(60% 0.2 255);
  --font-sans: "Vazirmatn", system-ui, sans-serif;
  --breakpoint-3xl: 120rem;
}
```
اکنون `bg-brand` و `font-sans` کار می‌کنن.

### مقدار دلخواه و استخراج کامپوننت
```html
<div class="w-[137px] bg-[#1da1f2] top-[calc(100%-2rem)]">
```
```css
@layer components {
  .btn { @apply px-4 py-2 rounded-lg bg-blue-600 text-white; }
}
```
بهتر است تکرار را با **کامپوننت فریم‌ورک** (React/Vue) حل کنی، نه `@apply` زیاد.

### مزایا و معایب
- ✅ سرعت، سازگاری با توکن‌ها، حجم CSS کوچک (فقط کلاس‌های استفاده‌شده)، بدون نام‌گذاری
- ❌ HTML شلوغ، یادگیری نام کلاس‌ها، نیاز به انضباط (ابزار `prettier-plugin-tailwindcss` ترتیب کلاس‌ها را مرتب می‌کند)

## Bootstrap (مرور)
```html
<div class="container">
  <div class="row">
    <div class="col-md-6">ستون</div>
    <div class="col-md-6"><button class="btn btn-primary">دکمه</button></div>
  </div>
</div>
```
گرید ۱۲ستونی، کامپوننت‌های آماده (modal، navbar، …) + نسخه‌ی RTL رسمی. کاستومایز با Sass یا متغیرهای CSS.

## shadcn/ui و Headless
کامپوننت‌ها را **کپی در پروژه‌ی خودت** می‌کنی (بر پایه‌ی Radix + Tailwind) و کاملاً قابل‌ویرایش‌اند؛ رفتار و دسترس‌پذیری (focus trap، aria) از Radix.

## Design System
مجموعه‌ی **توکن‌ها + کامپوننت‌ها + قواعد + مستندات** برای یکدستی محصول.

### لایه‌ها
۱. **Design Tokens**: رنگ، فاصله، فونت، سایه، شعاع (به‌صورت متغیر CSS یا JSON)
۲. **کامپوننت‌های پایه**: Button, Input, Modal, Tabs
۳. **الگوها**: فرم لاگین، جدول داده، ناوبری
۴. **راهنما**: لحن، آیکن، حرکت، دسترس‌پذیری

```css
:root {
  --color-primary: oklch(60% .2 255);
  --space-1: .25rem; --space-2: .5rem; --space-4: 1rem;
  --radius: .5rem;
  --font-body: "Vazirmatn", system-ui;
}
[data-theme="dark"] { --color-primary: oklch(75% .15 255); }
```

### ابزارها
- **Storybook**: ساخت و مستند کردن کامپوننت‌ها در انزوا
- **Figma**: طراحی و توکن‌ها
- **Style Dictionary**: تبدیل توکن‌ها به CSS/iOS/Android
- نسخه‌بندی (SemVer) و انتشار به‌عنوان بسته‌ی npm ([npm](/blog/roadmap-npm-yarn-pnpm/))
- تست بصری (Chromatic، Playwright screenshots)

### اصول
- ثبات (consistency) و ترکیب‌پذیری (composition)
- دسترس‌پذیری از ابتدا ([Accessibility](/blog/html-accessibility/))
- مستندات زنده + مثال
- API کوچک برای هر کامپوننت (deep module: [ایده‌ی ماژول عمیق](/blog/ai-Workflow-for-AI-Coding/))

## تمرین
۱. یک صفحه‌ی لندینگ ریسپانسیو و دارک‌مود با Tailwind بساز.
۲. دکمه‌ی `Button` با variantهای `primary | ghost | danger` و اندازه‌های `sm | md | lg` بنویس.
۳. توکن‌های رنگ و فاصله را در `@theme` تعریف و استفاده کن.
