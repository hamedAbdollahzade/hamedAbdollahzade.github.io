# Webino-Dev

وب‌سایت تیم Webino-Dev (توسعه وب و نرم‌افزار، مشهد) برای معرفی خدمات و جذب سفارش پروژه، با ظاهری الهام‌گرفته از [Google Labs](https://labs.google/).

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
│   ├── about/              # درباره‌ی ما و تیم
│   ├── services/[slug]/    # صفحه‌ی هر خدمت
│   ├── projects/[slug]/    # صفحه‌ی هر نمونه‌کار
│   ├── blog/, blog/[slug]/ # بلاگ
│   ├── sitemap.ts, robots.ts
│   └── globals.css         # استایل سایت
├── components/             # هدر، فوتر، کاروسل، فرم تماس، ...
├── data/                   # محتوا: projects.ts، services.ts، about.ts
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
| مهارت‌ها و سوابق | `data/about.ts` |
| مقاله‌ی جدید | یک فایل `content/blog/<slug>.md` |
| رزومه‌ی آنلاین | `public/resume.html` |

جاهای خالی و فرض‌ها در `TODO.md` فهرست شده‌اند.

### نوشتن مقاله

یک فایل `.md` در `content/blog/` بسازید. نام فایل، آدرس مقاله می‌شود (`/blog/<نام>/`):

```markdown
---
title: عنوان مقاله
description: خلاصه‌ی ۱۲۰ تا ۱۶۰ حرفی برای نتایج گوگل
date: 2026-11-05
keywords:
  - کلمه‌ی کلیدی
---

## تیتر بخش

متن مقاله...
```

پشتیبانی‌شده: تیتر `##` و `###`، پاراگراف، فهرست `-` و `1.`، نقل‌قول `>`، لینک `[متن](آدرس)`، **پررنگ** و `کد`. مقاله به‌طور خودکار در فهرست بلاگ، صفحه‌ی اصلی و `sitemap.xml` ظاهر می‌شود. فایل‌هایی که با `_` شروع شوند نادیده گرفته می‌شوند.

## فرم تماس

به‌طور پیش‌فرض فرم، پیام آماده را در واتساپ باز می‌کند و چیزی ذخیره نمی‌شود. برای ذخیره‌ی درخواست‌ها، یک بک‌اند بیرونی لازم است که یک POST با بدنه‌ی JSON (`name`، `phone`، `idea`، `source`) بپذیرد. آدرسش را در متغیر `FORM_ENDPOINT` بگذارید: در GitHub، **Settings ← Secrets and variables ← Actions ← Variables**. برای تست محلی:

```bash
NEXT_PUBLIC_FORM_ENDPOINT=https://example.com/api/lead npm run build
```

اگر ارسال شکست بخورد، فرم دوباره به واتساپ برمی‌گردد.

## انتشار

انتشار با GitHub Actions انجام می‌شود (`.github/workflows/deploy.yml`): با هر push به `main`، پروژه بیلد و پوشه‌ی `out/` منتشر می‌شود. تنظیم یک‌باره:

1. در GitHub: **Settings ← Pages ← Build and deployment ← Source** را روی **GitHub Actions** بگذارید.
2. همان‌جا Custom domain را `webino-dev.ir` بگذارید و بعد از صدور گواهی، **Enforce HTTPS** را روشن کنید.
3. در DNS، چهار رکورد A به آی‌پی‌های GitHub Pages و یک CNAME برای `www` بدهید (در Cloudflare ابر را خاکستری کنید).

## ساخت دوباره‌ی PDF رزومه

بعد از ویرایش `resume-source/resume.html`، از ریشه‌ی پروژه این دستور را اجرا کنید (به Chrome یا Chromium و اینترنت برای فونت Vazirmatn نیاز دارد):

```bash
chromium --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=public/assets/HamedAbdollahzade-Resume.pdf "file://$PWD/resume-source/resume.html"
```

## لایسنس

این پروژه برای استفاده‌ی شخصی ساخته شده و لایسنس متن‌باز ندارد.
