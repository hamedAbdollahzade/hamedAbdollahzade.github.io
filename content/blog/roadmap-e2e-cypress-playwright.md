---
title: تست End-to-End: Playwright و Cypress
description: E2E = اجرای برنامه در مرورگر واقعی و شبیه‌سازی کاربر (کلیک، تایپ، ناوبری) روی کل جریان (فرانت + بک‌اند). کند و گران ولی نزدیک‌ترین به واقعیت؛ فقط برای…
date: 2026-11-06
category: مسیر فرانت‌اند
order: 19
---

E2E = اجرای برنامه در **مرورگر واقعی** و شبیه‌سازی کاربر (کلیک، تایپ، ناوبری) روی کل جریان (فرانت + بک‌اند). کند و گران ولی نزدیک‌ترین به واقعیت؛ فقط برای **مسیرهای حیاتی** (ثبت‌نام، لاگین، پرداخت).

| | Playwright | Cypress |
|---|---|---|
| مرورگرها | Chromium, Firefox, WebKit | Chrome-family, Firefox, WebKit (آزمایشی) |
| زبان | JS/TS, Python, Java, .NET | JS/TS |
| اجرا | خارج از مرورگر، موازی | داخل مرورگر |
| چند تب/دامنه | ✅ آسان | محدودیت‌هایی دارد |
| ابزار دیباگ | Trace Viewer, Codegen, UI mode | Time-travel runner |
| سرعت موازی | عالی (پیش‌فرض) | با Cypress Cloud |

---

## Playwright
```bash
npm init playwright@latest
npx playwright test
npx playwright test --ui          # UI mode
npx playwright codegen http://localhost:3000   # ضبط کلیک‌ها و تولید کد
npx playwright show-report
```

### تست
```ts
import { test, expect } from "@playwright/test";

test("ورود موفق", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByLabel("ایمیل").fill("ali@example.com");
  await page.getByLabel("رمز عبور").fill("secret123");
  await page.getByRole("button", { name: "ورود" }).click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole("heading", { name: "داشبورد" })).toBeVisible();
});
```
- **Locatorها**: `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`, `getByTestId` — مثل Testing Library.
- **Auto-waiting**: قبل از هر اقدام منتظر آماده‌شدن المان می‌ماند؛ نیازی به `sleep` نیست.
- `expect(...)` وب‌محور با retry خودکار.

### پیکربندی
```ts
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 14"] } },
  ],
  webServer: { command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: true },
});
```

### مفاهیم مفید
```ts
// mock شبکه
await page.route("**/api/users", route => route.fulfill({ json: [{ id: 1 }] }));

// ذخیره‌ی وضعیت لاگین (جلوگیری از لاگین در هر تست)
await page.context().storageState({ path: "auth.json" });
// use: { storageState: "auth.json" }

// اسکرین‌شات مقایسه‌ای
await expect(page).toHaveScreenshot("home.png");

// Page Object
class LoginPage {
  constructor(private page: Page) {}
  async login(email: string, pw: string) { /* ... */ }
}
```
**Trace Viewer** (`npx playwright show-trace`) دیباگ شکست‌ها را بسیار آسان می‌کند.

---

## Cypress
```bash
npm i -D cypress
npx cypress open       # رابط گرافیکی
npx cypress run        # headless برای CI
```
```js
// cypress/e2e/login.cy.js
describe("ورود", () => {
  it("با اطلاعات درست وارد می‌شود", () => {
    cy.visit("/login");
    cy.get("[data-testid=email]").type("ali@example.com");
    cy.get("[data-testid=password]").type("secret123");
    cy.contains("button", "ورود").click();
    cy.url().should("include", "/dashboard");
    cy.contains("h1", "داشبورد").should("be.visible");
  });
});
```
- دستورها زنجیره‌ای و **غیرهمزمان خودکار** (queue شده)؛ از `async/await` استفاده نمی‌شه.
- `cy.intercept("GET", "/api/users", { fixture: "users.json" })` برای mock شبکه.
- دستور سفارشی: `Cypress.Commands.add("login", ...)`.
- `cy.session()` برای کش لاگین.
- Component Testing هم دارد (تست کامپوننت در مرورگر واقعی).

---

## بهترین روش‌ها
- المان‌ها را با نقش/برچسب (مثل کاربر) پیدا کن، نه CSS شکننده.
- وابستگی به داده‌ی ثابت: seed دیتابیس یا mock API.
- تست‌ها مستقل از هم باشند.
- مسیرهای کلیدی کم ولی مطمئن؛ بقیه را با unit/integration.
- در CI اجرا و گزارش/trace را آرتیفکت کن.
```yaml
- run: npx playwright install --with-deps
- run: npx playwright test
```
- تست flaky: wait صریح روی شرط (نه زمان)، retry محدود، ریشه‌یابی.
- تست دسترس‌پذیری: `@axe-core/playwright`.

## تمرین
۱. برای سایت خودت تست E2E «لاگین → خروج» بنویس.
۲. با `codegen` یک جریان را ضبط و تمیز کن.
۳. پاسخ API را mock کن تا حالت خطا را تست کنی.
