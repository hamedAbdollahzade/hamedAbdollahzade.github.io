---
title: استقرار (Deployment) و Hosting
description: پس از npm run build خروجی (مثلاً dist/) را روی سرور/پلتفرم منتشر می‌کنی.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 24
---

پس از `npm run build` خروجی (مثلاً `dist/`) را روی سرور/پلتفرم منتشر می‌کنی.

## انواع خروجی
| خروجی | میزبانی |
|---|---|
| **استاتیک** (SPA/SSG: HTML+CSS+JS) | GitHub Pages، Netlify، Cloudflare Pages، Vercel، S3+CDN |
| **نیازمند سرور Node** (SSR) | Vercel، Netlify Functions، Render، Railway، Fly.io، VPS |
| **Edge/Serverless** | Cloudflare Workers، Vercel Edge، Netlify Edge |
| **کانتینر** | Docker روی Render/Railway/Cloud Run/Kubernetes |

## پلتفرم‌های رایج
| پلتفرم | ویژگی |
|---|---|
| **GitHub Pages** | رایگان، استاتیک، مناسب مستندات و پورتفولیو |
| **Netlify** | استقرار با Git، preview هر PR، فرم‌ها، function |
| **Vercel** | سازنده‌ی Next.js، preview، edge |
| **Cloudflare Pages / Workers** | CDN جهانی، edge، رایگان سخاوتمندانه |
| **Render / Railway** | PaaS برای بک‌اند و دیتابیس و SSR |

## استقرار با Git (CI/CD)
```text
git push → پلتفرم build می‌گیرد → استقرار → URL (و preview برای هر PR)
```
تنظیمات typical:
- **Build command**: `npm run build`
- **Output directory**: `dist` (Vite) / `.next` (Next) / `build`
- **Node version** و **متغیرهای محیطی** (Environment Variables)

### GitHub Pages با Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy
on: { push: { branches: [main] } }
permissions: { contents: read, pages: write, id-token: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```
در Vite برای زیرمسیر: `base: "/repo-name/"` در `vite.config`.

## SPA و Routing سمت کلاینت
با refresh روی `/users/5` سرور فایلی با آن مسیر ندارد (404). باید همه‌چیز را به `index.html` rewrite کنی:
```text
# Netlify: public/_redirects
/*  /index.html  200
```
```json
// vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
```nginx
# nginx
location / { try_files $uri /index.html; }
```

## دامنه و HTTPS
۱. دامنه بخر (registrar)
۲. در DNS رکورد `CNAME`/`A` را به پلتفرم اشاره بده ([DNS](/blog/roadmap-internet-http-dns-hosting/))
۳. پلتفرم گواهی TLS رایگان (Let's Encrypt) صادر می‌کند.

## متغیرهای محیطی و Secret
- در پنل پلتفرم تعریف کن، نه در کد.
- متغیرهایی که به کلاینت می‌رسند (`VITE_*`, `NEXT_PUBLIC_*`) **عمومی** هستند ([Vite](/blog/roadmap-vite-bundlers-transpilers/)).
- `.env` را در `.gitignore` بگذار.

## کش و CDN
- فایل‌های hash‌دار: `Cache-Control: public, max-age=31536000, immutable`
- `index.html`: `no-cache`
- پس از استقرار، cache CDN را (در صورت نیاز) purge کن. ([عملکرد](/blog/roadmap-performance-core-web-vitals/))

## Docker (مرور)
```dockerfile
# مرحله‌ی build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# مرحله‌ی اجرا (استاتیک با nginx)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```
```bash
docker build -t my-app .
docker run -p 8080:80 my-app
```

## محیط‌ها و استراتژی انتشار
- **Environments**: development / staging / production
- **Preview deployments** برای هر PR
- **Rollback** سریع به نسخه‌ی قبل
- **Feature flags** برای انتشار تدریجی
- **Blue/Green** و **Canary**

## بعد از استقرار
- **پایش خطا**: Sentry
- **آنالیتیکس**: Plausible/Umami/GA
- **Uptime monitoring**، لاگ
- **Web Vitals واقعی** (RUM)
- Lighthouse CI

## چک‌لیست انتشار
- [ ] Build بدون خطا و warning مهم
- [ ] تست‌ها در CI سبز ([تست](/blog/roadmap-testing-jest-vitest/))
- [ ] متغیرهای محیطی تنظیم
- [ ] rewrite برای SPA
- [ ] HTTPS و هدرهای امنیتی ([امنیت](/blog/roadmap-web-security-cors-csp-owasp/))
- [ ] meta/SEO/OG و favicon
- [ ] صفحه‌ی 404
- [ ] پایش خطا فعال

## تمرین
۱. پروژه‌ی Vite خود را روی GitHub Pages یا Netlify منتشر کن.
۲. rewrite SPA را تنظیم کن و refresh روی یک مسیر داخلی را تست کن.
۳. یک workflow ساخته شود که فقط در صورت سبز بودن تست‌ها deploy کند.
