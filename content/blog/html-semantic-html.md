---
title: HTML معنایی (Semantic HTML)
description: تگ‌هایی که معنای محتوا رو مشخص می‌کنن، نه فقط ظاهرش رو. مزایا
date: 2026-11-06
category: HTML
order: 4
---

تگ‌هایی که **معنای** محتوا رو مشخص می‌کنن، نه فقط ظاهرش رو. مزایا:
- **دسترس‌پذیری**: صفحه‌خوان‌ها ساختار رو می‌فهمن و می‌شه با landmark ها پرید.
- **SEO**: موتورهای جستجو ساختار محتوا رو بهتر می‌فهمن.
- **خوانایی و نگهداری** کد.

```html
<!-- ❌ -->
<div class="header"><div class="nav">…</div></div>
<div class="main">…</div>

<!-- ✅ -->
<header><nav>…</nav></header>
<main>…</main>
```

## اسکلت معنایی یک صفحه
```html
<body>
  <a class="skip" href="#main">پرش به محتوا</a>

  <header>
    <a href="/" aria-label="صفحه‌ی اصلی"><img src="logo.svg" alt="" /></a>
    <nav aria-label="منوی اصلی">
      <ul>
        <li><a href="/" aria-current="page">خانه</a></li>
        <li><a href="/blog">وبلاگ</a></li>
      </ul>
    </nav>
  </header>

  <main id="main">
    <article>
      <header>
        <h1>عنوان مقاله</h1>
        <p>نوشته‌ی <a href="/authors/ali">علی</a> در <time datetime="2025-03-15">۲۵ اسفند</time></p>
      </header>

      <section>
        <h2>مقدمه</h2>
        <p>…</p>
      </section>

      <section>
        <h2>جمع‌بندی</h2>
        <p>…</p>
      </section>

      <footer>
        <p>برچسب‌ها: <a href="/tags/html">html</a></p>
      </footer>
    </article>

    <aside>
      <h2>مقالات مرتبط</h2>
      <ul>…</ul>
    </aside>
  </main>

  <footer>
    <p>&copy; ۱۴۰۴ همه‌ی حقوق محفوظ است.</p>
  </footer>
</body>
```

## تگ‌های ساختاری

| تگ | معنی | نکته |
|---|---|---|
| `<header>` | سربرگ صفحه یا یک بخش | می‌تونه داخل `article`/`section` هم باشه |
| `<nav>` | بلوک ناوبری اصلی | نه برای هر مجموعه لینک |
| `<main>` | محتوای اصلی | **فقط یکی** در صفحه |
| `<article>` | محتوای مستقل قابل انتشار جدا (پست، خبر، کارت محصول) | |
| `<section>` | بخش موضوعی با تیتر | باید تیتر داشته باشه |
| `<aside>` | محتوای جانبی (سایدبار، تبلیغ، توضیح) | |
| `<footer>` | پاورقی صفحه یا بخش | |
| `<address>` | اطلاعات تماس نویسنده/سازنده | |
| `<figure>` + `<figcaption>` | تصویر/کد/نمودار با عنوان | |
| `<time datetime>` | تاریخ/زمان قابل‌فهم برای ماشین | |
| `<mark>` | برجسته‌شده برای ارجاع | |
| `<details>` + `<summary>` | بخش جمع‌شونده | |
| `<dialog>` | پنجره‌ی گفتگو | |

### `section` یا `article` یا `div`؟
- مستقل و قابل انتشار جداگانه؟ → `article`
- بخش موضوعی با تیتر؟ → `section`
- فقط برای استایل/گروه‌بندی؟ → `div`

## landmark ها و نقش‌ها
مرورگرها این تگ‌ها رو خودکار به نقش‌های ARIA تبدیل می‌کنن:

| تگ | نقش (role) |
|---|---|
| `header` (سطح صفحه) | `banner` |
| `nav` | `navigation` |
| `main` | `main` |
| `aside` | `complementary` |
| `footer` (سطح صفحه) | `contentinfo` |
| `section` (با نام) | `region` |
| `form` (با نام) | `form` |

اگه چند `nav` داری، با `aria-label` تفکیک کن.

## جزئیات مفید

### `<details>` و `<summary>`
بدون JS:
```html
<details>
  <summary>سؤال متداول: چطور ثبت‌نام کنم؟</summary>
  <p>روی دکمه‌ی ثبت‌نام بالای صفحه کلیک کنید.</p>
</details>

<details open name="faq">…</details>   <!-- همه‌ی هم‌نام‌ها: accordion انحصاری -->
```

### `<time>`
```html
<time datetime="2025-03-15T10:30+03:30">۲۵ اسفند، ساعت ۱۰:۳۰</time>
<time datetime="PT2H30M">۲ ساعت و نیم</time>
```

### `<address>`
```html
<address>
  نوشته‌ی <a href="mailto:ali@example.com">علی رضایی</a><br />
  تهران، خیابان آزادی
</address>
```

### لیست و ناوبری breadcrumb
```html
<nav aria-label="مسیر صفحه">
  <ol>
    <li><a href="/">خانه</a></li>
    <li><a href="/blog">وبلاگ</a></li>
    <li aria-current="page">مقاله</li>
  </ol>
</nav>
```

### نقل‌قول با منبع
```html
<figure>
  <blockquote><p>سادگی، نهایت پیچیدگی است.</p></blockquote>
  <figcaption>— <cite>لئوناردو داوینچی</cite></figcaption>
</figure>
```

## سلسله‌مراتب تیتر
```
h1  عنوان صفحه
 ├─ h2  بخش اول
 │   ├─ h3 زیربخش
 │   └─ h3 زیربخش
 └─ h2  بخش دوم
```
- هر صفحه یک `h1`.
- سطح تیتر با ظاهر ربطی نداره؛ ظاهر رو با CSS تنظیم کن.

## Skip Link
لینک اول صفحه برای کاربران کیبورد:
```html
<a class="skip" href="#main">پرش به محتوای اصلی</a>
```
```css
.skip { position: absolute; transform: translateY(-200%); }
.skip:focus { transform: none; }
```

## بررسی ساختار
- افزونه‌ی **HeadingsMap**، **WAVE**، یا Lighthouse (تب Accessibility) در DevTools.
- ابزار اعتبارسنجی: validator.w3.org/nu

## تمرین
یک صفحه‌ی وبلاگ با `header`, `nav`, `main > article`, `aside`, `footer`، دو `section` با تیتر، یک `figure`، یک `details` و breadcrumb بنویس. بعد با HeadingsMap ساختار تیترها رو بررسی کن.
