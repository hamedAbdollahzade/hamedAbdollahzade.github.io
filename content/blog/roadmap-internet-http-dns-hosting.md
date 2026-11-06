---
title: اینترنت، HTTP، DNS و Hosting
description: اینترنت، HTTP، DNS و Hosting؛ آموزش مسیر فرانت‌اند به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 1
---

## اینترنت چطور کار می‌کنه؟
- اینترنت = شبکه‌ای از شبکه‌ها؛ دستگاه‌ها با **آدرس IP** شناخته می‌شن (IPv4: `203.0.113.5`، IPv6: `2001:db8::1`).
- داده به **بسته‌های (packet)** کوچک شکسته می‌شه و از مسیرهای مختلف (routerها) می‌رسه و دوباره سر هم می‌شه.
- پروتکل‌های لایه‌ای: **TCP/IP** (انتقال مطمئن)، **UDP** (سریع‌تر، بدون تضمین؛ مثلاً تماس تصویری)، و بالاتر از اون **HTTP**.
- **ISP** دسترسی تو رو به اینترنت می‌ده؛ **CDN** نسخه‌ی فایل‌ها رو نزدیک کاربر نگه می‌داره.

## وقتی آدرس رو تو مرورگر می‌زنی چه اتفاقی می‌افته؟
۱. مرورگر URL رو تجزیه می‌کنه: `https://example.com:443/blog?id=5#top`
   - `https` پروتکل، `example.com` دامنه (host)، `443` پورت، `/blog` مسیر، `?id=5` query، `#top` fragment
۲. **DNS**: دامنه ← IP
۳. اتصال **TCP** (و برای HTTPS: **TLS handshake**)
۴. ارسال **HTTP request**
۵. دریافت **response** (HTML)
۶. مرورگر HTML را parse می‌کنه، CSS/JS/تصویر رو می‌گیره و صفحه رو رندر می‌کنه ([مرورگرها](/blog/roadmap-browsers-and-devtools/)).

## دامنه (Domain Name)
- اسم قابل‌حفظ به‌جای IP: `blog.example.com`
- بخش‌ها: **TLD** (`.com`, `.ir`, `.dev`) ← **دامنه‌ی اصلی** (`example`) ← **ساب‌دامین** (`blog`)
- دامنه رو از **registrar** (ثبت‌کننده) اجاره می‌کنی (سالانه).

## DNS (Domain Name System)
دفترچه‌ی تلفن اینترنت: اسم دامنه رو به IP تبدیل می‌کنه.

مراحل جستجو: cache مرورگر ← cache سیستم‌عامل ← **Recursive Resolver** (ISP یا `1.1.1.1`/`8.8.8.8`) ← **Root** ← **TLD server** ← **Authoritative server**.

| رکورد | کاربرد |
|---|---|
| `A` | دامنه ← IPv4 |
| `AAAA` | دامنه ← IPv6 |
| `CNAME` | الیاس: یک اسم به اسم دیگه |
| `MX` | سرور ایمیل |
| `TXT` | متن (تأیید مالکیت، SPF) |
| `NS` | سرورهای DNS دامنه |

```bash
dig example.com A +short       # گرفتن رکورد A
nslookup example.com
```
تغییر DNS به‌خاطر **TTL** و cache ممکنه از چند دقیقه تا چند ساعت طول بکشه.

## HTTP
پروتکل درخواست/پاسخ بین کلاینت و سرور. بدون حالت (**stateless**): هر درخواست مستقل از قبلیه (برای حفظ وضعیت: cookie، token).

### درخواست
```http
GET /api/users?limit=10 HTTP/1.1
Host: example.com
Accept: application/json
Authorization: Bearer <token>
```

### پاسخ
```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60

{"users": []}
```

### متدها
| متد | کاربرد | ایمن؟ | idempotent؟ |
|---|---|---|---|
| `GET` | خواندن | ✅ | ✅ |
| `POST` | ساختن / عملیات | ❌ | ❌ |
| `PUT` | جایگزینی کامل | ❌ | ✅ |
| `PATCH` | تغییر جزئی | ❌ | معمولاً ❌ |
| `DELETE` | حذف | ❌ | ✅ |
| `HEAD` / `OPTIONS` | فقط هدر / قابلیت‌ها (CORS) | ✅ | ✅ |

### کدهای وضعیت
| بازه | معنی | نمونه |
|---|---|---|
| 1xx | اطلاعاتی | 101 Switching Protocols |
| 2xx | موفق | 200 OK، 201 Created، 204 No Content |
| 3xx | تغییر مسیر | 301 دائمی، 302 موقت، 304 Not Modified |
| 4xx | خطای کلاینت | 400، 401 (احراز نشده)، 403 (ممنوع)، 404، 429 (زیاد درخواست دادی) |
| 5xx | خطای سرور | 500، 502، 503 |

### هدرهای مهم
`Content-Type`, `Accept`, `Authorization`, `Cookie` / `Set-Cookie`, `Cache-Control`, `ETag`, `Location`, `User-Agent`, `Origin`, `Access-Control-*` (CORS).

### نسخه‌ها
- **HTTP/1.1**: هر اتصال یک درخواست در لحظه.
- **HTTP/2**: multiplexing (چند درخواست روی یک اتصال)، فشرده‌سازی هدر.
- **HTTP/3**: روی QUIC (مبتنی بر UDP)، اتصال سریع‌تر و مقاوم‌تر.

## HTTPS
HTTP + **TLS** = رمزنگاری، تأیید هویت سرور (گواهی SSL/TLS)، جلوگیری از دستکاری. امروز برای همه‌ی سایت‌ها لازمه (Let's Encrypt رایگانه). جزئیات امنیتی: [امنیت وب](/blog/roadmap-web-security-cors-csp-owasp/).

## Hosting
جایی که فایل‌ها و/یا کد سرور سایتت اجرا می‌شه.

| نوع | توضیح |
|---|---|
| **Static hosting** | فقط HTML/CSS/JS آماده (GitHub Pages، Netlify، Cloudflare Pages، Vercel) |
| **Shared / VPS** | سرور مجازی که خودت مدیریتش می‌کنی |
| **PaaS** | فقط کد می‌دی، پلتفرم اجرا می‌کنه (Render، Railway) |
| **Serverless / Edge** | تابع‌ها بر حسب درخواست اجرا می‌شن |
| **CDN** | کش جهانی فایل‌های استاتیک |

برای فرانت‌اند اغلب: static hosting + CDN. بیشتر در [استقرار](/blog/roadmap-deployment-hosting/).

## تمرین
۱. با `dig` رکوردهای A و NS یک دامنه رو ببین.
۲. در DevTools ← Network یک سایت رو باز کن و متد، status و هدرهای یک درخواست رو بخون.
۳. توضیح بده تفاوت 401 و 403 چیه.
