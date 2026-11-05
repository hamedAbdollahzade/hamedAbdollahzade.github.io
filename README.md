# Webino-Dev

وب‌سایت تیم Webino-Dev (توسعه وب و نرم‌افزار، مشهد) برای جذب سفارش پروژه، با ظاهری الهام‌گرفته از [Google Labs](https://labs.google/): هیرو تیره با کارت‌های شناور، کاروسل پروژه‌ها، بخش‌های روشن و منوی تمام‌صفحه.

**نسخه‌ی آنلاین:** <https://webino-dev.ir/>

پروژه با HTML، CSS و JavaScript خالص نوشته شده و فریمورک ندارد. محتوا کاملاً در HTML ایستا قرار دارد تا موتورهای جست‌وجو آن را بخوانند.

## سئو

- آدرس canonical، Open Graph، Twitter Card و داده‌ی ساخت‌یافته (JSON-LD) برای دامنه‌ی `webino-dev.ir`
- یک صفحه‌ی مستقل برای هر پروژه در `projects/`، با `sitemap.xml` و `robots.txt`
- فایل `CNAME` برای GitHub Pages

## ساخت صفحه‌ی پروژه‌ها

داده‌ی پروژه‌ها در `js/projects.js` و خدمات، سؤالات متداول، روند کار و اطلاعات تماس در `js/services.js` است. جاهای خالی و فرض‌ها در `TODO.md` آمده‌اند. بعد از هر تغییر این دستور را اجرا کنید تا صفحه‌های پروژه و خدمات، کارت‌های صفحه‌ی اصلی، فوتر و `sitemap.xml` به‌روز شوند:

```bash
node scripts/build-project-pages.mjs
```

## اجرای پروژه

چون از ES Modules استفاده شده، سایت را با یک سرور استاتیک اجرا کنید، نه با باز کردن مستقیم فایل:

```bash
python3 -m http.server 8080
```

سپس به آدرس <http://localhost:8080> بروید.

## ساختار پروژه

```text
├── index.html               # صفحه‌ی اصلی (هدر، کارت‌ها و فوتر را اسکریپت می‌سازد)
├── resume.html              # رزومه‌ی آنلاین، قابل چاپ
├── 404.html                 # صفحه‌ی خطا
├── CNAME                    # دامنه‌ی webino-dev.ir برای GitHub Pages
├── projects/                # صفحه‌ی مستقل هر پروژه (خروجی اسکریپت)
├── scripts/
│   ├── build-project-pages.mjs # ساخت صفحه‌های پروژه، کارت‌ها، فوتر و sitemap.xml
│   └── og-image.html        # منبع تصویر اشتراک‌گذاری
├── manifest.json, robots.txt, sitemap.xml
├── css/
│   ├── labs.css             # استایل سایت به سبک Google Labs
│   └── variables.css       # توکن‌های طراحی resume.html
├── js/
│   ├── labs.js              # منو، کاروسل، ظاهر هدر و انیمیشن اسکرول
│   └── projects.js          # داده‌ی پروژه‌ها (PROJECTS)
└── assets/                  # رزومه‌ی PDF، منبع PDF، آیکون‌ها و تصاویر
```

## ویرایش محتوا

| چه چیزی | کجا |
|---|---|
| درباره من، مهارت‌ها، سوابق، تماس | `index.html` |
| پروژه‌ها | آرایه‌ی `PROJECTS` در `js/projects.js` |
| رزومه‌ی آنلاین | `resume.html` |
| رزومه‌ی PDF | `assets/resume-source/resume.html` |

**پروژه‌ی جدید:** فیلدهای `id`، `slug`، `title`، `description`، `learned`، `tech`، `links` و `img` لازم‌اند. `images` (با `src` و `caption`) و `story` (با `title` و `text`) اختیاری‌اند.

## ساخت صفحه‌های پروژه

هر پروژه یک صفحه‌ی مستقل در `projects/` دارد تا موتورهای جست‌وجو بتوانند متن آن را بخوانند. این صفحه‌ها، کارت‌های پروژه در `index.html` و `sitemap.xml` از روی `PROJECTS` ساخته می‌شوند، پس فایل‌های `projects/` را دستی ویرایش نکنید. بعد از هر تغییر در `js/projects.js`، از ریشه‌ی پروژه این دستور را اجرا کنید:

```bash
node scripts/build-project-pages.mjs
```

## انتشار

سایت روی GitHub Pages از شاخه‌ی `main` منتشر می‌شود، پس با هر push به‌روز می‌شود.

## لایسنس

این پروژه برای استفاده‌ی شخصی ساخته شده و لایسنس متن‌باز ندارد.
