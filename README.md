# Webino-Dev

وب‌سایت تیم Webino-Dev (توسعه وب و نرم‌افزار، مشهد) برای معرفی خدمات و جذب سفارش پروژه، با ظاهری الهام‌گرفته از [میهن وردپرس](https://mihanwp.com/): منوی کناری با آیکون، کارت‌های سفید روی زمینه‌ی روشن و چت شناور.

**نسخه‌ی آنلاین:** <https://webino-dev.ir/>

ساخته‌شده با Next.js (App Router، خروجی ایستا) و TypeScript. همه‌ی صفحه‌ها هنگام بیلد به HTML تبدیل می‌شوند، پس موتورهای جست‌وجو متن کامل را می‌بینند و میزبان فقط فایل ایستا لازم دارد.

## اجرا و بیلد

نیاز: Node.js نسخه‌ی ۲۰ یا بالاتر.

```bash
npm install
npm run dev      # سرور توسعه روی http://localhost:3000
npm run build    # خروجی ایستا در پوشه‌ی out/
npm start        # دیدن خروجی بیلد (npx serve out)
```

## ساختار

```text
├── app/                    # صفحه‌ها (Next.js App Router)
│   ├── page.tsx            # صفحه‌ی اصلی
│   ├── about/              # درباره‌ی ما
│   ├── developers/, developers/[slug]/  # برنامه‌نویسان و پروفایل هرکدام
│   ├── services/[slug]/    # صفحه‌ی هر خدمت
│   ├── projects/[slug]/    # صفحه‌ی هر نمونه‌کار
│   ├── blog/, blog/[slug]/ # بلاگ
│   ├── sitemap.ts, robots.ts
│   └── globals.css         # استایل سایت
├── components/             # Shell (منو و نوار بالا)، ChatWidget، فوتر، ...
├── data/                   # محتوا: projects.ts، services.ts، developers.ts، about.ts
├── content/blog/*.md       # مقاله‌های بلاگ
├── lib/                    # ابزارهای سئو و خواندن بلاگ
├── public/                 # فایل‌های ایستا: assets/، resume.html، manifest.json، CNAME
├── resume-source/          # منبع رزومه‌ی PDF
├── scripts/og-image.html   # منبع تصویر اشتراک‌گذاری
└── .github/workflows/deploy.yml   # انتشار خودکار روی GitHub Pages
```

## ویرایش محتوا

| چه چیزی | کجا |
|---|---|
| اطلاعات تماس (تلفن، واتساپ، ایمیل) | `data/services.ts` ← `BRAND` |
| خدمات، سؤالات متداول، روند کار | `data/services.ts` |
| نمونه‌کارها | `data/projects.ts` |
| برنامه‌نویسان (نام، نقش، بیو، مهارت) | `data/developers.ts` |
| مهارت‌ها و سوابق (برای پروفایل حامد) | `data/about.ts` |
| مقاله یا آموزش جدید | یک فایل `content/blog/<slug>.md` |
| رزومه‌ی آنلاین | `public/resume.html` |

جاهای خالی و فرض‌ها در `TODO.md` فهرست شده‌اند.

### نوشتن مقاله

یک فایل `.md` در `content/blog/` بسازید. نام فایل، آدرس مقاله می‌شود (`/blog/<نام>/`):

```markdown
---
title: عنوان مقاله
description: خلاصه‌ی ۱۲۰ تا ۱۶۰ حرفی برای نتایج گوگل
date: 2026-11-05
category: آموزش
keywords:
  - کلمه‌ی کلیدی
---

## تیتر بخش

متن مقاله...
```

پشتیبانی‌شده: تیتر `##` و `###`، پاراگراف، فهرست `-` و `1.`، نقل‌قول `>`، لینک `[متن](آدرس)`، **پررنگ** و `کد`. `category` اختیاری است (مثلاً `آموزش` یا `راهنما`؛ پیش‌فرض `مقاله`) و در صفحه‌ی «آموزش‌ها» دکمه‌ی فیلتر می‌سازد. مقاله به‌طور خودکار در فهرست، صفحه‌ی اصلی و `sitemap.xml` ظاهر می‌شود. فایل‌هایی که با `_` شروع شوند نادیده گرفته می‌شوند.

## چت و ارسال درخواست

فرم پایین صفحه حذف شده و جایش یک چت شناور (دکمه‌ی سبز پایین صفحه) است. کاربر موضوع را انتخاب می‌کند، ایده، نام و شماره‌اش را می‌نویسد و با دکمه‌ی «ارسال درخواست در واتساپ» پیام آماده در واتساپ باز می‌شود و پنجره‌ی چت بسته می‌شود. چیزی روی سایت ذخیره نمی‌شود. هر دکمه‌ی «ثبت درخواست» در سایت همین چت را باز می‌کند (`components/OpenChat.tsx`).

برای ذخیره‌ی درخواست‌ها هم، یک بک‌اند بیرونی لازم است که یک POST با بدنه‌ی JSON (`topic`، `idea`، `name`، `phone`، `source`) بپذیرد. آدرسش را در متغیر `FORM_ENDPOINT` بگذارید: در GitHub، **Settings ← Secrets and variables ← Actions ← Variables**. برای تست محلی:

```bash
NEXT_PUBLIC_FORM_ENDPOINT=https://example.com/api/lead npm run build
```

درخواست به بک‌اند هم‌زمان با باز شدن واتساپ ارسال می‌شود و اگر شکست بخورد، واتساپ همچنان پیام را دارد.

## انتشار

انتشار با GitHub Actions انجام می‌شود (`.github/workflows/deploy.yml`): با هر push به `main`، پروژه بیلد و پوشه‌ی `out/` منتشر می‌شود. تنظیم یک‌باره:

1. در GitHub: **Settings ← Pages ← Build and deployment ← Source** را روی **GitHub Actions** بگذارید.
2. همان‌جا Custom domain را `webino-dev.ir` بگذارید و بعد از صدور گواهی، **Enforce HTTPS** را روشن کنید.
3. در DNS، چهار رکورد A به آی‌پی‌های GitHub Pages و یک CNAME برای `www` بدهید (در Cloudflare ابر را خاکستری کنید).

## Docker

برای اجرا روی سرور یا هاست خودتان (بدون GitHub Pages) تصویر Docker آماده است: مرحله‌ی اول Next.js را بیلد می‌کند و مرحله‌ی دوم فقط فایل‌های ایستا را با nginx سرو می‌کند.

```bash
docker compose up -d --build     # سایت روی http://localhost:8080
PORT=80 docker compose up -d --build   # روی پورت دلخواه
docker compose down              # توقف
```

یا بدون compose:

```bash
docker build -t webino-dev-site .
docker run -d --name webino-dev -p 8080:80 webino-dev-site
```

برای وصل کردن فرم به بک‌اند، موقع بیلد `NEXT_PUBLIC_FORM_ENDPOINT` را بدهید: `NEXT_PUBLIC_FORM_ENDPOINT=https://example.com/api/lead docker compose up -d --build`. تنظیمات nginx در `docker/nginx.conf` است. برای HTTPS روی سرور، جلوی این کانتینر یک reverse proxy (مثل Caddy یا Traefik یا nginx میزبان) بگذارید.

## ساخت دوباره‌ی PDF رزومه

بعد از ویرایش `resume-source/resume.html`، از ریشه‌ی پروژه این دستور را اجرا کنید (به Chrome یا Chromium و اینترنت برای فونت Vazirmatn نیاز دارد):

```bash
chromium --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=public/assets/HamedAbdollahzade-Resume.pdf "file://$PWD/resume-source/resume.html"
```

## لایسنس

این پروژه برای استفاده‌ی شخصی ساخته شده و لایسنس متن‌باز ندارد.
