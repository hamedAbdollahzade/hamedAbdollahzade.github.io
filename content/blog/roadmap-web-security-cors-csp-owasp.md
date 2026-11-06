---
title: امنیت وب: HTTPS، CORS، CSP و OWASP
description: امنیت وظیفه‌ی فرانت‌اند هم هست. هرگز فقط به اعتبارسنجی سمت کلاینت تکیه نکن؛ سرور باید همه‌چیز را دوباره بررسی کند.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 20
---

> امنیت وظیفه‌ی فرانت‌اند هم هست. هرگز فقط به اعتبارسنجی سمت کلاینت تکیه نکن؛ سرور باید همه‌چیز را دوباره بررسی کند.

## HTTPS
- رمزنگاری (TLS)، تأیید هویت سرور، جلوگیری از دستکاری میان‌راه ([HTTP/HTTPS](/blog/roadmap-internet-http-dns-hosting/)).
- **HSTS**: `Strict-Transport-Security: max-age=31536000; includeSubDomains` — مرورگر را وادار به HTTPS می‌کند.
- **Mixed content**: لود منبع HTTP در صفحه‌ی HTTPS مسدود می‌شود.

## Same-Origin Policy و CORS
**Origin** = پروتکل + دامنه + پورت. صفحه‌ی `https://a.com` به‌طور پیش‌فرض نمی‌تواند پاسخ `https://b.com` را بخواند.

**CORS** مکانیزمی است که سرور B با هدر اجازه می‌دهد:
```http
Access-Control-Allow-Origin: https://a.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 600
```
- **Simple request** (GET/POST ساده): مستقیم ارسال و فقط پاسخ بررسی می‌شود.
- **Preflight**: برای متدهای دیگر یا هدرهای سفارشی، مرورگر اول `OPTIONS` می‌فرستد.
- با `credentials: "include"` در fetch، `Allow-Origin` نباید `*` باشد.
- خطای CORS **از مرورگر** است، نه سرور؛ اصلاح در **سرور** (یا proxy در توسعه) انجام می‌شود، نه در کلاینت.
- CORS جلوی ارسال درخواست را نمی‌گیرد (CSRF هنوز مسئله است)، فقط خواندن پاسخ را محدود می‌کند.

```js
// Express
import cors from "cors";
app.use(cors({ origin: "https://a.com", credentials: true }));
```

## XSS (Cross-Site Scripting)
تزریق اسکریپت مهاجم به صفحه.
- **Stored**: ذخیره در DB (نظر کاربر) و نمایش به دیگران
- **Reflected**: انعکاس از URL
- **DOM-based**: از طریق `innerHTML` و ...

```js
el.innerHTML = userInput;       // ❌ خطرناک
el.textContent = userInput;     // ✅ امن
```
دفاع:
- خروجی را escape کن؛ فریم‌ورک‌ها (React/Vue/Angular) به‌طور پیش‌فرض escape می‌کنند. مراقب `dangerouslySetInnerHTML`, `v-html`, `[innerHTML]` باش.
- HTML کاربر را با **DOMPurify** پاک‌سازی کن.
- از `eval`, `new Function`, `document.write` پرهیز.
- **CSP** (پایین).
- کوکی `HttpOnly` برای توکن.

## CSP (Content Security Policy)
هدر پاسخ که مشخص می‌کند چه منابعی مجاز به لود/اجرا هستند:
```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.example.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  object-src 'none'
```
- از `'unsafe-inline'` و `'unsafe-eval'` برای script پرهیز؛ به‌جایش **nonce** یا hash:
```http
Content-Security-Policy: script-src 'nonce-r4nd0m'
```
```html
<script nonce="r4nd0m">…</script>
```
- حالت آزمایشی: `Content-Security-Policy-Report-Only` + `report-to`.
- `frame-ancestors` جایگزین `X-Frame-Options` برای جلوگیری از **Clickjacking**.

## CSRF (Cross-Site Request Forgery)
سایت مخرب مرورگر کاربرِ لاگین‌شده را وادار به ارسال درخواست به سایت تو می‌کند (کوکی خودکار ارسال می‌شود).
دفاع:
- کوکی `SameSite=Lax` یا `Strict`
- **CSRF token** در فرم‌ها/هدر
- بررسی هدر `Origin`/`Referer`
- عملیات تغییر داده فقط با POST/PUT/DELETE، نه GET

## کوکی امن
```http
Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600
```
- `HttpOnly`: JS دسترسی ندارد (ضد XSS)
- `Secure`: فقط HTTPS
- `SameSite`: ضد CSRF

## هدرهای امنیتی دیگر
| هدر | کاربرد |
|---|---|
| `X-Content-Type-Options: nosniff` | جلوگیری از حدس نوع MIME |
| `Referrer-Policy: strict-origin-when-cross-origin` | محدود کردن Referer |
| `Permissions-Policy: camera=(), geolocation=()` | غیرفعال‌کردن APIها |
| `Cross-Origin-Opener-Policy` / `-Embedder-Policy` | ایزوله‌سازی |
| `Strict-Transport-Security` | HSTS |

بررسی با **securityheaders.com** یا Mozilla Observatory.

## OWASP Top 10 (ریسک‌های رایج)
فهرست [OWASP](https://owasp.org/www-project-top-ten/) از جدی‌ترین ریسک‌های برنامه‌های وب. مفاهیم کلیدی:
| ریسک | توضیح / دفاع |
|---|---|
| **Broken Access Control** | کاربر به منبعی که نباید دسترسی دارد؛ هر بار در سرور مجوز را بررسی کن |
| **Cryptographic Failures** | داده‌ی حساس بدون رمزنگاری؛ HTTPS، هش رمز (bcrypt/argon2) |
| **Injection** | SQL/NoSQL/Command/XSS؛ query پارامتری، validation |
| **Insecure Design** | نبود threat modeling |
| **Security Misconfiguration** | تنظیمات پیش‌فرض، پیام خطای مفصل |
| **Vulnerable & Outdated Components** | وابستگی‌های آسیب‌پذیر؛ `npm audit` |
| **Identification & Authentication Failures** | رمز ضعیف، session بد |
| **Software & Data Integrity Failures** | بسته‌ی مخرب، CI ناامن؛ SRI، lockfile |
| **Logging & Monitoring Failures** | عدم ثبت و پایش |
| **SSRF** | سرور وادار به درخواست به منابع داخلی |

(شماره‌گذاری و نام‌ها در نسخه‌های جدید ممکن است کمی تغییر کند؛ نسخه‌ی جاری را در سایت OWASP ببین.)

## Subresource Integrity (SRI)
```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-…" crossorigin="anonymous"></script>
```
مرورگر هش فایل را چک می‌کند تا CDN دستکاری‌شده اجرا نشود.

## زنجیره‌ی تأمین (Supply Chain)
- `npm audit`، Dependabot، قفل نسخه‌ها با lockfile ([npm](/blog/roadmap-npm-yarn-pnpm/))
- حداقل وابستگی، بررسی بسته‌های ناشناخته
- هرگز secret را commit نکن؛ از secret scanning استفاده کن.

## قوانین سرانگشتی
- ورودی کاربر **غیرقابل‌اعتماد** است.
- حداقل دسترسی (Least Privilege).
- کلید API سمت کلاینت = عمومی؛ کار حساس در سرور.
- داده‌ی حساس را در `localStorage` نذار.
- پیام‌های خطای عمومی به کاربر.

## تمرین
۱. صفحه‌ای بساز که ورودی کاربر را با `innerHTML` نمایش بدهد، XSS را نشان بده و سپس با `textContent`/DOMPurify رفع کن.
۲. یک CSP ساده تنظیم و در DevTools تخلفات را ببین.
۳. خطای CORS را عمداً ایجاد و با تنظیم سرور رفع کن.

ادامه: [احراز هویت](/blog/roadmap-authentication/)
