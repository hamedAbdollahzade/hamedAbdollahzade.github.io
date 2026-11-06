---
title: ماژول‌ها (Modules)
description: ماژول یعنی تقسیم کد به فایل‌های مستقل که هر کدوم scope خودشون رو دارن و چیزی رو export/import می‌کنن.
date: 2026-11-06
category: JavaScript
order: 18
---

ماژول یعنی تقسیم کد به فایل‌های مستقل که هر کدوم scope خودشون رو دارن و چیزی رو export/import می‌کنن.

## ES Modules (ESM) — استاندارد امروزی

### Named Export
```js
// math.js
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export class Calculator {}

// یا یک‌جا در آخر فایل:
const sub = (a, b) => a - b;
export { sub, sub as minus };   // با نام مستعار
```
```js
// main.js
import { PI, add } from "./math.js";
import { add as sum } from "./math.js";     // تغییر نام
import * as math from "./math.js";          // همه زیر یک namespace
math.add(1, 2);
```

### Default Export
هر فایل **فقط یک** default داره:
```js
// logger.js
export default function log(msg) { console.log(msg); }
```
```js
import log from "./logger.js";          // هر اسمی می‌شه گذاشت
import log, { level } from "./logger.js"; // ترکیب
```

### Re-export (فایل index)
```js
// utils/index.js
export { add } from "./math.js";
export * from "./string.js";
export { default as logger } from "./logger.js";
```

### Dynamic Import (بارگذاری تنبل)
```js
button.onclick = async () => {
  const { heavy } = await import("./heavy.js");
  heavy();
};
```

### Top-level await
```js
// فقط داخل ماژول ESM
const config = await (await fetch("/config.json")).json();
export default config;
```

### Import Attributes (JSON)
```js
import data from "./data.json" with { type: "json" };
```

### ویژگی‌ها
- همیشه **strict mode**.
- scope خود فایل؛ متغیرها سراسری نمی‌شن.
- **یک بار** اجرا می‌شن و cache می‌شن.
- import ها hoist می‌شن.
- **Live binding**: import یک «پنجره» به مقدار اصلیه، نه کپی:
```js
// counter.js
export let count = 0;
export const inc = () => count++;
// main.js
import { count, inc } from "./counter.js";
inc();
console.log(count);   // → 1  (به‌روز شد)
// count = 5          // ❌ import ها فقط‌خواندنی‌ان
```
- `this` در سطح بالا `undefined`ـه.
- `import.meta.url` آدرس فایل جاری:
```js
new URL("./file.txt", import.meta.url);
```

### استفاده در مرورگر
```html
<script type="module" src="main.js"></script>
```
(خودکار deferred. نیاز به سرور HTTP داره، نه `file://`.)

### استفاده در Node.js
- پسوند `.mjs` یا در `package.json`: `"type": "module"`
- مسیر نسبی باید پسوند داشته باشه: `./math.js`
- ماژول‌های داخلی با پیشوند `node:`:
```js
import fs from "node:fs/promises";
import { join } from "node:path";
```

---

## CommonJS (CJS) — سیستم قدیمی Node
```js
// math.js
const add = (a, b) => a + b;
module.exports = { add };         // یا exports.add = add;

// main.js
const { add } = require("./math");
const fs = require("fs");
```
- `require` **همزمان (sync)** و در زمان اجرا.
- مقدار **کپی** می‌شه (نه live).
- `__dirname` و `__filename` موجودن (در ESM نه):
```js
// معادل در ESM
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Node 20+:  import.meta.dirname / import.meta.filename
```

## مقایسه

| | ESM | CommonJS |
|---|---|---|
| سینتکس | `import / export` | `require / module.exports` |
| بارگذاری | async، static (tree-shaking ممکنه) | sync، پویا |
| Live binding | بله | خیر |
| Top-level await | بله | خیر |
| مرورگر | بله | خیر |

### Interop
```js
// ESM → CJS: می‌تونی import کنی (default = module.exports)
import pkg from "./legacy.cjs";

// CJS → ESM: فقط با dynamic import
const mod = await import("./modern.mjs");
```

## الگوی طراحی ماژول
- یک ماژول = یک مسئولیت.
- فقط چیزی رو export کن که لازمه (API کوچک).
- از وابستگی دایره‌ای (circular) پرهیز کن:
```js
// a.js imports b.js و b.js imports a.js  →  مقادیر ممکنه undefined باشن
```
- `index.js` برای خروجی تمیز پوشه‌ها.

## ساختار پروژه‌ی نمونه
```
src/
  main.js
  utils/
    index.js
    math.js
    string.js
  services/
    api.js
```

## باندلرها
Vite، Webpack، Rollup، esbuild، Parcel: ماژول‌ها رو باندل، minify و tree-shake می‌کنن.
