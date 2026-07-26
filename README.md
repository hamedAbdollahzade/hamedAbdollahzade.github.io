# پورتفولیوی شخصی — Frontend Developer

پورتفولیوی شخصی ساخته‌شده با **HTML5, CSS3 و Vanilla JavaScript (ES2023)** خالص، بدون هیچ فریمورک یا کتابخانه‌ی جاوااسکریپتی. طراحی به‌صورت اختصاصی برای این پروژه با الهام از استانداردهای بصری سایت‌هایی مانند Linear، Vercel و Stripe انجام شده، اما بدون کپی مستقیم از آن‌ها.

## ساختار پروژه

```
portfolio/
├── index.html          # صفحه اصلی
├── resume.html          # رزومه آنلاین، بهینه برای چاپ A4
├── manifest.json         # وب‌اپ‌مانیفست PWA
├── robots.txt
├── sitemap.xml
├── README.md
├── css/
│   ├── variables.css     # توکن‌های طراحی (رنگ، فونت، فاصله، سایه)
│   ├── style.css         # ریست، لایه‌بندی و کامپوننت‌ها
│   ├── animations.css    # کی‌فریم‌های انیمیشن
│   └── responsive.css    # breakpointها
├── js/
│   ├── app.js            # نقطه ورود؛ راه‌اندازی همه ماژول‌ها + فرم تماس
│   ├── navigation.js      # هدر، منوی موبایل، پیشرفت اسکرول، بازگشت به بالا
│   ├── animation.js       # Reveal، شمارنده، افکت تایپ، کرسر، Tilt، Magnetic
│   ├── theme.js           # حالت تیره/روشن + ذخیره در LocalStorage
│   └── projects.js        # داده و رندر پروژه‌ها، فیلتر، مودال
└── assets/
    ├── resume.pdf
    ├── icons/favicon.svg
    └── images/
```

## اجرای پروژه

پروژه کاملاً استاتیک است. کافیست فایل `index.html` را با یک سرور استاتیک محلی باز کنید (به دلیل استفاده از `type="module"` در جاوااسکریپت، بازکردن مستقیم فایل با پروتکل `file://` در برخی مرورگرها محدودیت CORS ایجاد می‌کند):

```bash
# با Python
python3 -m http.server 8080

# یا با ابزار npx
npx serve .
```

سپس در مرورگر به آدرس `http://localhost:8080` بروید.

## انتشار روی GitHub Pages

1. مخزن (Repository) را در گیت‌هاب بسازید و محتوای پوشه `portfolio/` را به شاخه `main` پوش کنید.
2. در تنظیمات مخزن، بخش **Pages** را باز کرده و شاخه `main` و پوشه `/root` را انتخاب کنید.
3. آدرس نهایی سایت به شکل `https://username.github.io/repo-name/` در دسترس خواهد بود.
4. مقادیر `example.com` را در `sitemap.xml`, `robots.txt` و متادیتای `index.html` با دامنه واقعی جایگزین کنید.

## ویژگی‌های کلیدی

- **بدون هیچ کتابخانه‌ی خارجی جاوااسکریپت** — تمام انیمیشن‌ها با `IntersectionObserver`، `requestAnimationFrame`، Debounce و Throttle دستی پیاده‌سازی شده‌اند.
- **ماژولار** — هر قابلیت در فایل مجزای خودش با ES Modules، بدون متغیر Global.
- **کاملاً واکنش‌گرا** — از موبایل کوچک تا صفحه‌نمایش‌های Ultra Wide.
- **دسترس‌پذیر (Accessible)** — ناوبری با کیبورد، Focus State مشخص، ARIA مناسب، کنترل انیمیشن با `prefers-reduced-motion`.
- **بهینه برای SEO** — Meta Tags کامل، Open Graph، Twitter Card، JSON-LD، `robots.txt` و `sitemap.xml`.
- **تم تیره/روشن** با ذخیره‌سازی ترجیح کاربر در LocalStorage.
- **رزومه دوگانه** — نسخه HTML بهینه برای چاپ A4 (`resume.html`) و نسخه PDF آماده دانلود (`assets/resume.pdf`).

## نکات فنی برای توسعه بیشتر

- برای اتصال فرم تماس به یک سرویس واقعی (مانند Formspree، EmailJS یا بک‌اند اختصاصی)، تابع `initContactForm` در `js/app.js` را ویرایش کنید و درخواست `fetch` واقعی را جایگزین شبیه‌سازی فعلی کنید.
- رنگ‌ها و فونت‌ها به‌صورت متمرکز در `css/variables.css` تعریف شده‌اند؛ برای تغییر هویت بصری فقط کافیست این فایل را ویرایش کنید.
- تصاویر پروژه‌ها به‌صورت SVG تولید‌شده در زمان اجرا هستند؛ برای استفاده از تصاویر واقعی، فایل‌ها را در `assets/images/` قرار داده و در `js/projects.js` مسیر آن‌ها را جایگزین کنید.

## لایسنس

این پروژه برای استفاده شخصی ساخته شده است.
