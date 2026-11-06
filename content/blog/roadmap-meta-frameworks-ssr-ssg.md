---
title: Meta-framework، SSR و SSG
description: Meta-framework: روی یک فریم‌ورک UI ساخته می‌شه و routing، رندر سمت سرور، data fetching، build و deployment رو آماده می‌ده.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 14
---

**Meta-framework**: روی یک فریم‌ورک UI ساخته می‌شه و routing، رندر سمت سرور، data fetching، build و deployment رو آماده می‌ده.

| UI | Meta-framework |
|---|---|
| React | **Next.js**، React Router (framework mode)، TanStack Start، Astro |
| Vue | **Nuxt**، VitePress/VuePress (مستندات) |
| Svelte | **SvelteKit** |
| Solid | SolidStart |
| Angular | Angular SSR / Analog |
| چندفریم‌ورکی / محتوامحور | **Astro**، Eleventy (11ty) |

## الگوهای رندر
| | چه زمانی HTML ساخته می‌شه؟ | مناسب |
|---|---|---|
| **CSR** | در مرورگر | داشبورد پشت login |
| **SSR** | هر درخواست در سرور | داده‌ی پویا + SEO |
| **SSG** | در build | وبلاگ، مستندات، لندینگ |
| **ISR** | SSG + بازسازی بعد از مدت معین | کاتالوگ بزرگ |
| **Streaming SSR** | HTML تکه‌تکه با Suspense | بهبود TTFB |
| **Islands** | HTML استاتیک + JS فقط برای بخش‌های تعاملی | Astro |

### چرا SSR/SSG؟
- **SEO**: خزنده HTML کامل می‌بینه ([SEO](/blog/html-seo-meta-performance/))
- **عملکرد**: محتوا سریع‌تر دیده می‌شه (FCP/LCP) ([Web Vitals](/blog/roadmap-performance-core-web-vitals/))
- **هزینه**: JS بیشتر در مرورگر → کندتر در دستگاه‌های ضعیف

### Hydration
HTML ساخته‌شده در سرور به مرورگر می‌رسه و بعد JS لود می‌شه و به آن **تعامل** می‌ده. ناسازگاری HTML سرور/کلاینت = *hydration mismatch*. روش‌های بهینه‌تر: partial/selective hydration، islands، resumability.

---

## Next.js (App Router)
```bash
npx create-next-app@latest
```
ساختار فایل = مسیر:
```
app/
├─ layout.tsx          # layout مشترک
├─ page.tsx            # /
├─ about/page.tsx      # /about
├─ blog/[slug]/page.tsx  # /blog/hello
├─ loading.tsx         # UI حین بارگذاری
├─ error.tsx
└─ api/hello/route.ts  # API route
```
```tsx
// app/blog/[slug]/page.tsx  (Server Component، پیش‌فرض)
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetch(`https://api.example.com/posts/${slug}`).then(r => r.json());
  return <article><h1>{post.title}</h1></article>;
}

export async function generateStaticParams() {      // SSG
  return [{ slug: "hello" }];
}
```
```tsx
"use client";                       // کامپوننت کلاینتی برای state و رویداد
import { useState } from "react";
export default function Like() { const [n, setN] = useState(0); return <button onClick={() => setN(n + 1)}>{n}</button>; }
```
- **Server Actions** برای ارسال فرم/تغییر داده.
- `<Link>`, `next/image` (بهینه‌سازی تصویر)، `next/font`.
- Middleware، Route Handlers، caching.

## Nuxt (Vue)
```bash
npx nuxi init my-nuxt
```
- `pages/` ← routing، `components/` auto-import، `composables/`، `server/api/`
```vue
<script setup>
const { data: posts } = await useFetch("/api/posts");
</script>
<template><ul><li v-for="p in posts" :key="p.id">{{ p.title }}</li></ul></template>
```

## SvelteKit
```
src/routes/
├─ +page.svelte
├─ blog/[slug]/+page.svelte
├─ blog/[slug]/+page.server.ts   # load سمت سرور
└─ api/hello/+server.ts
```
```ts
// +page.server.ts
export const load = async ({ params, fetch }) => {
  const post = await fetch(`/api/posts/${params.slug}`).then(r => r.json());
  return { post };
};
```
تنظیم رندر: `export const prerender = true;` (SSG)، `export const ssr = false;` (SPA).

## Astro
مناسب سایت‌های **محتوامحور**؛ پیش‌فرض صفر JS برای کلاینت.
```astro
---
const posts = await fetch("https://api.example.com/posts").then(r => r.json());
---
<ul>{posts.map(p => <li>{p.title}</li>)}</ul>

<Counter client:visible />   <!-- جزیره‌ی React/Vue/Svelte؛ فقط وقتی دیده شد hydrate -->
```
دستورهای `client:load | idle | visible | only`. پشتیبانی Markdown/MDX و content collections.

## SSG: Eleventy، VuePress/VitePress
- **Eleventy**: ساده، قالب‌های Nunjucks/Liquid/Markdown، بدون JS کلاینت.
- **VitePress/VuePress**: مستندات مبتنی بر Vue/Markdown.

## TanStack Start، React Router (Framework mode)
فریم‌ورک‌های full-stack مبتنی بر React با routing نوع‌دار، loaderها، و SSR/streaming.

## چطور انتخاب کنیم؟
| نیاز | انتخاب |
|---|---|
| اپ React با SEO و API | Next.js |
| اپ Vue | Nuxt |
| وبلاگ/مستندات/بازاریابی | Astro |
| اپ سبک و سریع | SvelteKit |
| داشبورد خصوصی | SPA ساده با Vite کافیه |

## تمرین
۱. با Astro یک وبلاگ ساده بساز (SSG) و خروجی build را بررسی کن.
۲. با Next.js صفحه‌ای بساز که داده را سمت سرور fetch کند و صفحه‌ای که `"use client"` باشد.
۳. با View Source ببین HTML کامل در پاسخ سرور هست یا نه.
