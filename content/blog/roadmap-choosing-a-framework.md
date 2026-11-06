---
title: انتخاب فریم‌ورک و مفاهیم مشترک
description: انتخاب فریم‌ورک و مفاهیم مشترک؛ آموزش مسیر فرانت‌اند به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 9
---

## چرا فریم‌ورک؟
با JavaScript خالص ([DOM](/blog/js-dom-and-events/)) مدیریت UI پیچیده سخت می‌شه: باید هر تغییر state رو دستی به DOM منتقل کنی. فریم‌ورک‌ها **UI را تابعی از state** می‌کنن:

```
UI = f(state)
```
تو state رو عوض می‌کنی، فریم‌ورک DOM رو به‌روز می‌کنه (**Declarative** به‌جای Imperative).

```js
// Imperative (DOM دستی)
counter.textContent = ++n;
// Declarative (React)
const [n, setN] = useState(0);   // <p>{n}</p>
```

## مفاهیم مشترک همه‌ی فریم‌ورک‌ها
| مفهوم | توضیح |
|---|---|
| **Component** | بخش مستقل و قابل‌استفاده‌ی مجدد UI (ترکیب HTML + منطق + استایل) |
| **Props / Inputs** | داده‌ی ورودی از والد به فرزند (یک‌طرفه، پایین) |
| **State** | داده‌ی داخلی که با تغییرش UI عوض می‌شه |
| **Events / Emit** | ارتباط فرزند ← والد |
| **Reactivity** | ردیابی تغییر داده و به‌روزرسانی خودکار UI |
| **Lifecycle** | mount / update / unmount |
| **Template / JSX** | نحوه‌ی توصیف UI |
| **Routing** | چند صفحه در SPA |
| **State management** | مدیریت داده‌ی مشترک بین کامپوننت‌ها |
| **Virtual DOM / Signals / Compiler** | روش‌های به‌روزرسانی کارآمد DOM |

### سه رویکرد reactivity
- **Virtual DOM** (React، Vue به‌صورت ترکیبی): UI جدید ساخته، با قبلی مقایسه (diff) و تغییرات اعمال می‌شن.
- **Compiler** (Svelte): در build کد به‌روزرسانی دقیق DOM تولید می‌شه.
- **Signals** (Solid، Angular، Vue Vapor، …): ردیابی ریزدانه، فقط همان بخش که به signal وابسته است به‌روز می‌شه.

## SPA، MPA و رندر در سرور
| الگو | توضیح |
|---|---|
| **CSR** | رندر در مرورگر؛ سرور HTML تقریباً خالی می‌ده |
| **SSR** | HTML در سرور برای هر درخواست ساخته می‌شه |
| **SSG** | HTML در build از قبل ساخته می‌شه |
| **ISR** | SSG با بازسازی دوره‌ای |
| **Islands** | صفحه‌ی عمدتاً استاتیک + جزایر تعاملی (Astro) |

جزئیات: [meta-frameworks-ssr-ssg](/blog/roadmap-meta-frameworks-ssr-ssg/)

## مقایسه‌ی فریم‌ورک‌ها
| | React | Vue | Angular | Svelte | Solid |
|---|---|---|---|---|---|
| نوع | کتابخانه‌ی UI | فریم‌ورک پیشرو | فریم‌ورک کامل | کامپایلر | کتابخانه‌ی signal |
| زبان الگو | JSX | SFC template | HTML template | HTML-ish | JSX |
| زبان | JS/TS | JS/TS | TS | JS/TS | JS/TS |
| شیب یادگیری | متوسط | ملایم | تند | ملایم | متوسط |
| اکوسیستم | بسیار بزرگ | بزرگ | کامل و رسمی | در حال رشد | کوچک |
| meta-framework | Next.js، React Router | Nuxt | Analog / Angular SSR | SvelteKit | SolidStart |

## چطور انتخاب کنیم؟
- **بازار کار و اکوسیستم**: React (ابتدا بیاموز)
- **سادگی و سرعت شروع**: Vue / Svelte
- **تیم بزرگ سازمانی با قراردادهای سخت**: Angular
- **محتوامحور / وبلاگ / مستندات**: Astro، VitePress
- **حداکثر کارایی**: Solid / Svelte
- مهم‌تر از «بهترین فریم‌ورک»، فهمیدن مفاهیم مشترک و تسلط بر JS/TS است. بعد از یکی، یادگیری بقیه سریعه.

## پیش‌نیازها قبل از شروع
- ES6+، ماژول‌ها، destructuring، async/await ([JavaScript](/blog/#javascript))
- npm و Vite ([npm](/blog/roadmap-npm-yarn-pnpm/)، [Vite](/blog/roadmap-vite-bundlers-transpilers/))
- TypeScript پایه ([TS](/blog/roadmap-typescript-basics/))

## تمرین
یک برنامه‌ی «لیست کارها» رو یک بار با JS خالص و یک بار با فریم‌ورک انتخابی بنویس و تفاوت رو حس کن.
