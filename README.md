# پورتفولیوی حامد عبداله زاده

پورتفولیوی شخصی من به شکل یک دسکتاپ اوبونتو. همه‌ی بخش‌های رزومه از داخل یک ترمینال تعاملی خوانده می‌شوند و پروژه‌ها، لینک‌های تماس و فایل رزومه هم به‌صورت آیکون روی دسکتاپ هستند.

**نسخه‌ی آنلاین:** <https://hamedabdollahzade.github.io/>

پروژه با HTML، CSS و JavaScript خالص (ES Modules) نوشته شده و فریمورک، کتابخانه‌ی جاوااسکریپتی و مرحله‌ی build ندارد.

## قابلیت‌ها

- **دسکتاپ:** انیمیشن بوت و لاگین، Top Bar با ساعت زنده، Dock، و پنجره‌های قابل جابه‌جایی، کوچک‌کردن، بزرگ‌کردن و بستن.
- **ترمینال:** تایپ خودکار `./welcome.sh`، منوی قابل کلیک، خروجی با افکت تایپ، تاریخچه با ↑ و ↓، تکمیل با Tab، و میان‌برهای Ctrl+L، Ctrl+C و Ctrl+U.
- **پروژه‌ها:** هر پروژه یک آیکون با تصویر خودش دارد و با کلیک، پنجره‌ای با توضیحات، تصاویر و لینک‌های آن باز می‌شود.
- **تماس:** آیکون‌های GitHub، LinkedIn، تلفن و ایمیل.
- **رزومه:** آیکون Resume فایل PDF را در یک پنجره‌ی نمایشگر باز می‌کند.
- **موبایل:** پنجره‌ها تمام‌صفحه می‌شوند و Dock به نوار پایین صفحه می‌رود.

## دستورات ترمینال

| دستور | کار |
|---|---|
| `help` | فهرست دستورات و میان‌برها |
| `about` | درباره من |
| `skills` | مهارت‌ها |
| `projects` / `projects <n>` | فهرست پروژه‌ها / جزئیات یک پروژه |
| `experience` | سوابق کاری |
| `education` | تحصیلات و یادگیری |
| `contact` | راه‌های تماس |
| `resume` | باز کردن رزومه‌ی PDF |
| `whoami`، `neofetch` | معرفی کوتاه و اطلاعات سیستم |
| `ls`، `cat <file>` | فهرست و خواندن فایل‌های مجازی |
| `date`، `history`، `clear`، `sudo` | دستورات عمومی |

عددهای ۱ تا ۷ هم میان‌بر گزینه‌های منوی خوش‌آمدگویی هستند.

## اجرای پروژه

چون از ES Modules استفاده شده، سایت را با یک سرور استاتیک اجرا کنید، نه با باز کردن مستقیم فایل:

```bash
python3 -m http.server 8080
```

سپس به آدرس <http://localhost:8080> بروید.

## ساختار پروژه

```text
├── index.html               # پوسته‌ی دسکتاپ + محتوای اصلی سایت (منبع داده)
├── resume.html              # رزومه‌ی آنلاین، قابل چاپ
├── manifest.json, robots.txt, sitemap.xml
├── css/
│   ├── desktop.css          # استایل دسکتاپ، پنجره‌ها، ترمینال و موبایل
│   └── variables.css        # توکن‌های طراحی resume.html
├── js/
│   ├── desktop.js           # نقطه ورود: بوت، ساعت، پنجره‌ها، Dock، آیکون‌ها
│   ├── portfolio-data.js    # خواندن محتوای index.html و پروژه‌ها
│   ├── projects.js          # داده‌ی پروژه‌ها (PROJECTS)
│   ├── terminal.js          # موتور ترمینال
│   ├── terminal-commands.js # دستورات ترمینال
│   └── ascii.js             # بنر ASCII نام
├── assets/
│   ├── HamedAbdollahzade-Resume.pdf
│   ├── resume-source/       # فایل منبع PDF رزومه
│   ├── icons/, images/
│   └── video/               # مربوط به طراحی قبلی
└── tests/scroll-video.test.cjs
```

این فایل‌ها از طراحی قبلی سایت باقی مانده‌اند و صفحه‌ی اصلی آن‌ها را بارگذاری نمی‌کند: `js/app.js`، `js/navigation.js`، `js/animation.js`، `js/theme.js`، `js/scroll-video.js`، `css/style.css`، `css/animations.css`، `css/responsive.css` و `css/cinematic.css`. از `js/projects.js` هم فقط آرایه‌ی `PROJECTS` استفاده می‌شود.

## ویرایش محتوا

| چه چیزی | کجا |
|---|---|
| معرفی، درباره من، مهارت‌ها، سوابق، تماس | بخش `data-portfolio-source` در `index.html` |
| پروژه‌ها | آرایه‌ی `PROJECTS` در `js/projects.js` |
| رزومه‌ی آنلاین | `resume.html` |
| رزومه‌ی PDF | `assets/resume-source/resume.html` |

ترمینال و دسکتاپ متن‌ها را از همین منابع می‌خوانند، پس لازم نیست جای دیگری را تغییر دهید. این محتوا با جاوااسکریپت پنهان می‌شود و اگر جاوااسکریپت غیرفعال باشد، به‌صورت HTML ساده نمایش داده می‌شود.

- **سوابق:** هر `timeline-item` باید `data-entry="work"` یا `data-entry="education"` داشته باشد تا در دستور درست نمایش داده شود.
- **پروژه‌ی جدید:** فیلدهای `id`، `title`، `description`، `learned`، `tech`، `links` و `img` لازم‌اند. `images` (با `src` و `caption`) و `story` (با `title` و `text`) اختیاری‌اند.

## ساخت دوباره‌ی PDF رزومه

بعد از ویرایش `assets/resume-source/resume.html`، از ریشه‌ی پروژه این دستور را اجرا کنید. به Google Chrome و اینترنت (برای فونت Vazirmatn) نیاز دارد:

```bash
google-chrome --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=assets/HamedAbdollahzade-Resume.pdf "file://$PWD/assets/resume-source/resume.html"
```

هر صفحه‌ی PDF جداگانه در فایل منبع تعریف شده است. اگر متن بلندتر شد، بررسی کنید از پایین صفحه بیرون نزده باشد.

## تست

```bash
node --test tests/scroll-video.test.cjs
```

این تنها تست موجود است و `js/scroll-video.js` از طراحی قبلی را پوشش می‌دهد. برای رابط کاربری فعلی هنوز تستی نوشته نشده است.

## انتشار

سایت روی GitHub Pages از شاخه‌ی `main` منتشر می‌شود، پس با هر push به‌روز می‌شود.

## لایسنس

این پروژه برای استفاده‌ی شخصی ساخته شده و لایسنس متن‌باز ندارد.
