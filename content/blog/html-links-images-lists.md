---
title: لینک، تصویر و لیست
description: لینک، تصویر و لیست؛ آموزش HTML به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: HTML
order: 2
---

## لینک (`<a>`)
```html
<a href="https://example.com">لینک خارجی</a>
<a href="about.html">صفحه‌ی درباره (نسبی)</a>
<a href="/blog/post-1">مسیر از ریشه‌ی سایت</a>
<a href="#contact">پرش به بخشی با id=contact</a>
<a href="mailto:me@example.com?subject=سلام">ایمیل</a>
<a href="tel:+989121234567">تماس</a>
<a href="file.pdf" download>دانلود</a>
<a href="https://example.com" target="_blank" rel="noopener noreferrer">تب جدید</a>
```

### انواع مسیر
| نوع | مثال | معنی |
|---|---|---|
| مطلق | `https://a.com/x.html` | آدرس کامل |
| نسبی | `img/a.png` | نسبت به فایل فعلی |
| نسبی به پوشه‌ی بالا | `../img/a.png` | یک پوشه بالاتر |
| از ریشه | `/img/a.png` | نسبت به ریشه‌ی سایت |

### نکات
- `target="_blank"` همراه با `rel="noopener noreferrer"` برای امنیت (جلوگیری از دسترسی صفحه‌ی مقصد به `window.opener`).
- متن لینک باید **معنادار** باشه: «ادامه‌ی مطلب درباره‌ی CSS» نه «اینجا کلیک کنید».
- پرش به بخش: `<h2 id="contact">تماس</h2>` + `<a href="#contact">`.
- `href="#"` به بالای صفحه می‌ره (برای دکمه از `<button>` استفاده کن).

### لینک تصویر / دکمه‌ای
```html
<a href="/home"><img src="logo.png" alt="صفحه‌ی اصلی" /></a>
```

---

## تصویر (`<img>`)
```html
<img src="photo.jpg" alt="مردی که در ساحل قدم می‌زند" width="600" height="400" />
```
| ویژگی | کاربرد |
|---|---|
| `src` | آدرس تصویر (الزامی) |
| `alt` | متن جایگزین (الزامی برای دسترس‌پذیری و SEO) |
| `width` / `height` | ابعاد (جلوگیری از پرش چیدمان) |
| `loading="lazy"` | بارگذاری تنبل |
| `title` | تولتیپ |

- `alt` برای تصویر **تزئینی**: خالی بذار `alt=""` تا صفحه‌خوان نخونتش.
- فرمت‌ها: **JPG** (عکس)، **PNG** (شفافیت)، **WebP/AVIF** (حجم کمتر)، **SVG** (برداری)، **GIF**.

### تصویر با عنوان
```html
<figure>
  <img src="chart.png" alt="نمودار فروش ۱۴۰۲" />
  <figcaption>شکل ۱: فروش سالانه</figcaption>
</figure>
```

---

## لیست‌ها

### نامرتب (`ul`)
```html
<ul>
  <li>سیب</li>
  <li>موز</li>
  <li>پرتقال</li>
</ul>
```
### مرتب (`ol`)
```html
<ol>
  <li>اول</li>
  <li>دوم</li>
  <li>سوم</li>
</ol>

<ol type="a" start="3" reversed>…</ol>
<ol>
  <li value="10">شماره‌ی ۱۰</li>
</ol>
```
- `type`: `1`, `a`, `A`, `i`, `I`
- `start`: شماره‌ی شروع، `reversed`: معکوس

### لیست تو در تو
```html
<ul>
  <li>
    میوه‌ها
    <ul>
      <li>سیب</li>
      <li>گلابی</li>
    </ul>
  </li>
  <li>سبزیجات</li>
</ul>
```
> لیست داخلی باید **داخل** `<li>` بیاد، نه بین `li` ها.

### لیست توضیحی (`dl`)
```html
<dl>
  <dt>HTML</dt>
  <dd>زبان نشانه‌گذاری صفحات وب</dd>
  <dt>CSS</dt>
  <dd>زبان استایل‌دهی</dd>
</dl>
```

### منوی ناوبری = لیست لینک‌ها
```html
<nav>
  <ul>
    <li><a href="/">خانه</a></li>
    <li><a href="/about">درباره</a></li>
    <li><a href="/contact">تماس</a></li>
  </ul>
</nav>
```
(ظاهر افقی با CSS ساخته می‌شه.)

## مسیر فایل‌ها: ساختار پروژه‌ی پیشنهادی
```
my-site/
├─ index.html
├─ about.html
├─ css/
│  └─ style.css
├─ js/
│  └─ app.js
└─ img/
   └─ logo.png
```
```html
<link rel="stylesheet" href="css/style.css" />
<script src="js/app.js" defer></script>
<img src="img/logo.png" alt="لوگو" />
```

## تمرین
یک صفحه‌ی «علایق من» با: منوی ناوبری (۳ لینک)، یک `figure` با تصویر، لیست مرتب «۳ هدف»، لیست تودرتو از «سبک‌های موسیقی» و لینکی که به بخشی پایین همین صفحه می‌پره.
