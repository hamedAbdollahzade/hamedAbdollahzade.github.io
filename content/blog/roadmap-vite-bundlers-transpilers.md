---
title: Bundler، Transpiler و Vite
description: Bundler، Transpiler و Vite؛ آموزش مسیر فرانت‌اند به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 5
---

## چرا ابزار build؟
مرورگر ماژول‌های ESM رو می‌فهمه، ولی پروژه‌ی واقعی به این‌ها نیاز داره:
- **Bundle**: ترکیب صدها ماژول در چند فایل بهینه
- **Transpile**: تبدیل TypeScript / JSX / سینتکس جدید به JS قابل اجرا
- **Minify**: کوچک‌کردن کد
- **Tree shaking**: حذف کد استفاده‌نشده
- **Code splitting**: بارگذاری تکه‌ها فقط وقتی لازمن
- **HMR**: اعمال تغییرات بدون رفرش کامل در توسعه
- پردازش CSS (PostCSS، Sass)، تصاویر، فونت، hash برای cache

## ابزارها
| ابزار | نقش |
|---|---|
| **Vite** | dev server + build؛ پیش‌فرض اکثر پروژه‌های جدید |
| **webpack** | bundler قدیمی و پرانعطاف، پروژه‌های بزرگ موجود |
| **Rollup** | bundler مناسب کتابخانه‌ها (ESM) |
| **esbuild** | bundler/transpiler بسیار سریع (Go) |
| **Rolldown** | جانشین Rust برای Rollup (در Vite جدید) |
| **Parcel** | zero-config |
| **SWC** | transpiler سریع (Rust)، جایگزین Babel |
| **Babel** | transpiler قدیمی و پلاگین‌محور |
| **Turbopack** | bundler Rust برای Next.js |

## Vite
در توسعه از ESM بومی مرورگر استفاده می‌کنه (سرو فایل‌ها به‌صورت جداگانه با esbuild)، پس شروع تقریباً آنی است؛ برای production bundle می‌سازه.

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install
npm run dev        # http://localhost:5173
npm run build      # خروجی در dist/
npm run preview    # آزمایش خروجی build
```

### vite.config.ts
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: { "/api": "http://localhost:8080" },   // حل مشکل CORS در توسعه
  },
  resolve: { alias: { "@": "/src" } },
  build: { sourcemap: true },
});
```

### متغیرهای محیطی
```bash
# .env
VITE_API_URL=https://api.example.com
SECRET_KEY=abc    # بدون پیشوند VITE_ به کلاینت نمی‌رسه
```
```js
console.log(import.meta.env.VITE_API_URL);
```
هر چیزی با پیشوند `VITE_` در bundle کلاینت **عمومی** می‌شه؛ رمز واقعی نذار.

### Import کردن دارایی‌ها
```js
import logo from "./logo.svg";            // URL
import "./style.css";                     // CSS
const Page = lazy(() => import("./Page")); // code splitting
```

## مفاهیم کلیدی

### Tree shaking
```js
// utils.js
export const add = (a, b) => a + b;
export const unused = () => {};
// main.js
import { add } from "./utils.js";   // unused از bundle حذف می‌شه
```
نیازمند ESM و بدون side-effect.

### Code splitting
```js
button.onclick = async () => {
  const { heavy } = await import("./heavy.js");   // chunk جدا، فقط هنگام نیاز
  heavy();
};
```

### Source map
فایل نگاشت کد minify شده ← کد اصلی، برای دیباگ.

### Hash در نام فایل
`app.3f9a1c.js`: با تغییر محتوا نام عوض می‌شه، پس می‌شه cache طولانی داد ([عملکرد](/blog/roadmap-performance-core-web-vitals/)).

### Transpile و Polyfill
Babel/SWC سینتکس جدید را به قدیمی ترجمه می‌کنند ولی APIهای جدید (مثل `Array.prototype.at`) را polyfill می‌خواد. هدف مرورگرها با `browserslist` تعیین می‌شه.

## webpack (مرور سریع)
```js
// webpack.config.js
module.exports = {
  entry: "./src/index.js",
  output: { filename: "[name].[contenthash].js", path: __dirname + "/dist" },
  module: { rules: [{ test: /\.css$/, use: ["style-loader", "css-loader"] }] },
  plugins: [/* HtmlWebpackPlugin ... */],
};
```
مفاهیم: **entry، output، loader، plugin، mode**.

## تمرین
۱. با Vite یک پروژه بساز، `build` بگیر و حجم فایل‌های `dist/` رو ببین.
۲. یک `import()` پویا اضافه کن و در Network ببین chunk جدا لود می‌شه.
۳. یک متغیر `VITE_` تعریف و در کد استفاده کن.
