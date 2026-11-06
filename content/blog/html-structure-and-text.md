---
title: ساختار سند HTML و متن
description: ساختار سند HTML و متن؛ آموزش HTML به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: HTML
order: 1
---

## اولین صفحه
```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>اولین صفحه‌ی من</title>
  </head>
  <body>
    <h1>سلام دنیا!</h1>
    <p>این اولین صفحه‌ی HTML منه.</p>
  </body>
</html>
```

### اجزای اسکلت
| بخش | توضیح |
|---|---|
| `<!DOCTYPE html>` | به مرورگر می‌گه سند HTML5 هست (بدون اون: quirks mode) |
| `<html lang="fa" dir="rtl">` | ریشه. `lang` زبان صفحه، `dir` جهت متن (`rtl` برای فارسی) |
| `<head>` | اطلاعات **نامرئی**: عنوان، متا، استایل، اسکریپت |
| `<meta charset="UTF-8">` | کدگذاری کاراکتر (برای نمایش درست فارسی ضروری) |
| `<meta name="viewport" ...>` | نمایش درست در موبایل |
| `<title>` | عنوان تب مرورگر و نتایج گوگل |
| `<body>` | محتوای **قابل مشاهده** |

## تگ، المان، ویژگی
```html
<a href="https://example.com" target="_blank">لینک</a>
```
- **تگ باز**: `<a ...>` و **تگ بسته**: `</a>`
- **المان** = تگ باز + محتوا + تگ بسته
- **ویژگی (attribute)**: `href="..."`، `target="..."` (به‌صورت `نام="مقدار"`)
- **المان تهی (void)**: بدون محتوا و تگ بسته: `<br>`, `<hr>`, `<img>`, `<input>`, `<meta>`, `<link>`
- **تودرتو (nesting)**: باید درست بسته بشن: `<p><b>متن</b></p>` ✅ ، `<p><b>متن</p></b>` ❌

### ویژگی‌های سراسری (روی هر تگی)
```html
<p id="intro" class="lead big" style="color: red" title="راهنما" hidden lang="en" data-id="5">…</p>
```
- `id` شناسه‌ی **یکتا**، `class` یک یا چند کلاس (برای CSS/JS)
- `style` استایل درون‌خطی (توصیه نمی‌شه)
- `title` تولتیپ، `hidden` مخفی، `lang` زبان همین بخش
- `data-*` داده‌ی دلخواه
- `tabindex`, `contenteditable`, `draggable`, `spellcheck`

## کامنت
```html
<!-- این یک کامنته و نمایش داده نمی‌شه -->
```

---

## تیترها
```html
<h1>تیتر اصلی (فقط یکی در هر صفحه)</h1>
<h2>زیرعنوان</h2>
<h3>زیرعنوان سطح ۳</h3>
<h4>…</h4><h5>…</h5><h6>…</h6>
```
- سلسله‌مراتب رو رعایت کن (از h1 به h3 نپر).
- برای **بزرگ کردن متن** از تیتر استفاده نکن؛ تیتر برای **ساختاره**.

## پاراگراف و خط
```html
<p>این یک پاراگرافه. چند     فاصله    یکی حساب می‌شه.</p>
<p>خط اول<br />خط دوم (شکستن خط)</p>
<hr />   <!-- خط افقی (تغییر موضوع) -->
```
HTML فاصله‌ها و Enter های متوالی رو **یکی** می‌کنه. برای حفظ:
```html
<pre>
  متن   با   فاصله‌ها
  و خط‌های حفظ‌شده
</pre>
```

## تگ‌های متن (Inline)
```html
<strong>مهم (بولد + معنای اهمیت)</strong>
<em>تأکید (ایتالیک + معنای تأکید)</em>
<b>بولد ظاهری</b> <i>ایتالیک ظاهری (مثلاً اصطلاح)</i>
<u>زیرخط</u>  <mark>هایلایت</mark>  <small>ریزنویس</small>
<del>حذف‌شده</del> <ins>افزوده‌شده</ins> <s>نامعتبر</s>
H<sub>2</sub>O   x<sup>2</sup>
<code>const a = 1;</code>
<kbd>Ctrl</kbd> + <kbd>C</kbd>
<samp>خروجی برنامه</samp>  <var>x</var>
<abbr title="HyperText Markup Language">HTML</abbr>
<q>نقل‌قول کوتاه</q>
<cite>نام یک اثر</cite>
<time datetime="2025-03-15">۱۵ مارس</time>
<span>بدون معنا، فقط برای استایل</span>
```
> **strong و em** معنا دارن (برای صفحه‌خوان‌ها و SEO)، **b و i** فقط ظاهری.

## نقل‌قول بلوکی
```html
<blockquote cite="https://example.com">
  <p>متن یک نقل‌قول طولانی.</p>
</blockquote>
```

## کد چندخطی
```html
<pre><code>function hi() {
  console.log("hi");
}</code></pre>
```

## کاراکترهای خاص (Entities)
| نوشتن | نمایش |
|---|---|
| `&lt;` | `<` |
| `&gt;` | `>` |
| `&amp;` | `&` |
| `&quot;` | `"` |
| `&nbsp;` | فاصله‌ی غیرقابل‌شکستن |
| `&copy;` | © |
| `&#8364;` | € |

```html
<p>برای نوشتن تگ: &lt;div&gt;</p>
```

## متن دوجهته (فارسی + انگلیسی)
```html
<p>کتاب <bdi>JavaScript</bdi> عالیه.</p>
<p dir="ltr">This line is LTR.</p>
```

## Block در برابر Inline
- **Block**: از یک خط جدید شروع می‌شه و کل عرض رو می‌گیره: `div, p, h1–h6, ul, ol, li, section, header, footer, form, table`
- **Inline**: داخل خط می‌مونه: `span, a, strong, em, img, code, input, button`

```html
<div>بلوک ۱</div><div>بلوک ۲</div>     <!-- زیر هم -->
<span>اینلاین ۱</span><span>اینلاین ۲</span>   <!-- کنار هم -->
```

## `div` و `span`
المان‌های **بی‌معنا** (generic) برای گروه‌بندی:
```html
<div class="card">
  <p>متن با یک <span class="highlight">کلمه‌ی خاص</span></p>
</div>
```
اگه تگ معنادار (مثل `section`, `nav`) مناسبه، اون رو ترجیح بده: [HTML معنایی](/blog/html-semantic-html/).

## خطاهای رایج مبتدی
- فراموش کردن `<!DOCTYPE html>` یا `charset`.
- بستن نکردن تگ‌ها.
- چند `h1` یا پرش بین سطوح تیتر.
- استفاده از `<br>` برای فاصله‌ی بین بخش‌ها (CSS margin بهتره).
- استفاده از `&nbsp;` برای چیدمان.
- تکرار `id`.

## تمرین
یک صفحه‌ی «معرفی خودم» بساز با: یک `h1`، دو `h2`، چند پاراگراف، یک `blockquote` و کلمات `strong`/`em`.
