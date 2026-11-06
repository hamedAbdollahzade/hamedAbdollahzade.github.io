---
title: Linter، Formatter و کیفیت کد
description: Linter، Formatter و کیفیت کد؛ آموزش مسیر فرانت‌اند به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 6
---

## تفاوت Linter و Formatter
| | Linter | Formatter |
|---|---|---|
| هدف | پیدا کردن **باگ و بدبویی کد** | یکدست کردن **ظاهر کد** |
| نمونه | `no-unused-vars`, `eqeqeq` | تو‌رفتگی، نقطه‌ویرگول، نقل‌قول |
| ابزار | **ESLint**, Biome | **Prettier**, Biome |

## ESLint
```bash
npm init @eslint/config@latest
npx eslint .
npx eslint . --fix
```

### eslint.config.js (flat config)
```js
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: { globals: globals.browser },
    rules: {
      eqeqeq: "error",
      "no-console": "warn",
      "prefer-const": "error",
    },
  },
  { ignores: ["dist/"] },
];
```
- سطح قانون: `"off"` | `"warn"` | `"error"`
- پلاگین‌های رایج: `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-vue`

### نمونه‌ی خطاهایی که می‌گیره
```js
var a = 1;            // prefer-const / no-var
if (a == "1") {}      // eqeqeq
const unused = 5;     // no-unused-vars
```

## Prettier
```bash
npm i -D prettier
npx prettier --write .
npx prettier --check .       # برای CI
```
```json
// .prettierrc
{ "semi": true, "singleQuote": false, "printWidth": 80, "trailingComma": "all", "tabWidth": 2 }
```
```text
# .prettierignore
dist
node_modules
```
مزیت: بحث سر سلیقه در code review از بین می‌ره.

## Biome
ابزار واحد (Rust) برای lint + format، بسیار سریع و تک‌پیکربندی:
```bash
npm i -D @biomejs/biome
npx biome check --write .
```

## ادغام در گردش کار
### ویرایشگر
افزونه‌های ESLint و Prettier در VS Code + «Format on Save».

### Git hooks (قبل از commit)
```bash
npm i -D husky lint-staged
npx husky init
```
```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": "prettier --write"
  }
}
```
```bash
# .husky/pre-commit
npx lint-staged
```

### CI
```yaml
- run: npm run lint
- run: npx prettier --check .
- run: npm test
```

## EditorConfig
```ini
# .editorconfig
root = true
[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
insert_final_newline = true
```

## سایر ابزارهای کیفیت
- **Stylelint**: لینت CSS
- **Code review**: [PR و بازبینی](/blog/roadmap-git-and-github/)
- **Refactoring**: تغییر ساختار بدون تغییر رفتار؛ با تست‌ها امن می‌شه ([تست](/blog/roadmap-testing-jest-vitest/))
- **مستندسازی**: JSDoc/TSDoc، Storybook، Docusaurus، VitePress
- **Conventional Commits** + `commitlint`

## تمرین
۱. ESLint و Prettier رو روی یک پروژه فعال کن و `--fix` بزن.
۲. با husky + lint-staged مانع commit کدی بشو که lint نمی‌گذره.
