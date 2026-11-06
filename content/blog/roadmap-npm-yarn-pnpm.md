---
title: Package Managers: npm، Yarn، pnpm، Bun
description: Package Managers: npm، Yarn، pnpm، Bun؛ آموزش مسیر فرانت‌اند به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 4
---

## چرا package manager؟
نصب، نسخه‌بندی و به‌روزرسانی کتابخانه‌ها (dependencies) و اجرای اسکریپت‌های پروژه.

| ابزار | نکته |
|---|---|
| **npm** | همراه Node.js، پیش‌فرض |
| **Yarn** | سریع‌تر در نسخه‌های اولیه، workspaces؛ Yarn Berry (Plug'n'Play) |
| **pnpm** | یک store مشترک روی دیسک + hard link؛ سریع و کم‌حجم؛ `node_modules` سخت‌گیرانه |
| **Bun** | runtime + package manager + bundler، بسیار سریع |

## شروع پروژه
```bash
node -v && npm -v
npm init -y            # ساخت package.json
npm install lodash     # نصب (dependencies)
npm install -D vitest  # فقط برای توسعه (devDependencies)
npm uninstall lodash
npm update
npm outdated
npm ci                 # نصب دقیق از lockfile (برای CI)
npx vite               # اجرای یک بسته بدون نصب سراسری
```
معادل‌ها: `yarn add`, `pnpm add`, `bun add`.

## package.json
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "lint": "eslint ."
  },
  "dependencies": { "react": "^19.0.0" },
  "devDependencies": { "vite": "^7.0.0" },
  "engines": { "node": ">=20" }
}
```
- `"type": "module"` ← فایل‌های `.js` به‌صورت ESM ([ماژول‌ها](/blog/js-modules/)).
- اجرا: `npm run dev`، (`npm test` و `npm start` بدون `run` هم کار می‌کنن).

## Semantic Versioning (SemVer)
`MAJOR.MINOR.PATCH` مثلاً `2.4.1`
- PATCH: رفع باگ بدون تغییر API
- MINOR: قابلیت جدید سازگار
- MAJOR: تغییر ناسازگار

| نوشتار | معنی |
|---|---|
| `^1.2.3` | `>=1.2.3 <2.0.0` (پیش‌فرض npm) |
| `~1.2.3` | `>=1.2.3 <1.3.0` |
| `1.2.3` | دقیقاً همین |
| `*` / `latest` | هر نسخه (خطرناک) |

## Lockfile
`package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` نسخه‌های دقیق نصب‌شده رو ثبت می‌کنن تا همه‌ی اعضای تیم و CI یک چیز نصب کنن. **همیشه commit کن**. `node_modules` رو commit نکن.

## Workspaces (Monorepo)
```json
{ "workspaces": ["packages/*", "apps/*"] }
```
چند بسته در یک ریپو؛ ابزارها: pnpm workspaces، Turborepo، Nx.

## امنیت و کیفیت وابستگی‌ها
```bash
npm audit              # آسیب‌پذیری‌های شناخته‌شده
npm audit fix
npm ls                 # درخت وابستگی‌ها
```
- قبل از نصب: تعداد دانلود، آخرین به‌روزرسانی، maintainer، حجم (bundlephobia).
- مراقب typosquatting (نام‌های شبیه بسته‌های معروف).
- Dependabot / Renovate برای به‌روزرسانی خودکار.

## انتشار بسته
```bash
npm login
npm publish
```

## تمرین
۱. پروژه‌ای بساز، یک بسته‌ی dev و یک dependency نصب کن و تفاوتشون رو در package.json ببین.
۲. اسکریپتی بنویس که `dev` و `build` رو اجرا کنه.
۳. فرق `npm install` و `npm ci` رو توضیح بده.
