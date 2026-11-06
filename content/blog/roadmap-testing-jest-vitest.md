---
title: تست: مفاهیم، Jest و Vitest
description: تست: مفاهیم، Jest و Vitest؛ آموزش مسیر فرانت‌اند به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 18
---

## چرا تست؟
اطمینان از درستی، جلوگیری از رگرسیون، امکان refactor بی‌ترس، مستند بودن رفتار. و برای AI agentها «سقف کیفیت» حلقه‌ی بازخورد است ([TDD و AI](/blog/ai-Workflow-for-AI-Coding/)).

## هرم تست
```
        /\          E2E      (کم، کند، واقعی)        ← Playwright / Cypress
       /  \
      /----\        Integration (متوسط)             ← چند واحد با هم
     /      \
    /--------\      Unit      (زیاد، سریع)          ← Jest / Vitest
```
**Testing Trophy** (Kent C. Dodds): بیشتر روی تست یکپارچگی و «شبیه کاربر».

انواع دیگر: تست بصری (screenshot)، تست دسترس‌پذیری (axe)، تست عملکرد، smoke test، contract test.

## ساختار تست: AAA
**Arrange** (آماده‌سازی) ← **Act** (اجرا) ← **Assert** (بررسی)

## Vitest (پیشنهادی با Vite)
```bash
npm i -D vitest
npx vitest            # حالت watch
npx vitest run        # یک‌بار (CI)
npx vitest --coverage
```
```ts
// sum.ts
export const sum = (a: number, b: number) => a + b;

// sum.test.ts
import { describe, it, expect } from "vitest";
import { sum } from "./sum";

describe("sum", () => {
  it("جمع دو عدد", () => {
    expect(sum(1, 2)).toBe(3);
  });
  it.each([[1, 1, 2], [2, 3, 5]])("sum(%i, %i) = %i", (a, b, r) => {
    expect(sum(a, b)).toBe(r);
  });
});
```
Jest تقریباً همان API را دارد (`describe/it/expect`)؛ Jest با `npx jest`.

## Matcherها
```js
expect(x).toBe(3);                    // ===
expect(obj).toEqual({ a: 1 });        // مقایسه‌ی ساختاری
expect(arr).toContain("a");
expect(arr).toHaveLength(2);
expect(str).toMatch(/hello/);
expect(n).toBeGreaterThan(2);
expect(n).toBeCloseTo(0.3);           // اعداد اعشاری
expect(v).toBeNull(); expect(v).toBeDefined(); expect(v).toBeTruthy();
expect(() => fn()).toThrow("خطا");
expect(promise).resolves.toBe(1);
expect(promise).rejects.toThrow();
expect(obj).toMatchObject({ a: 1 });
expect(x).not.toBe(5);
expect(value).toMatchSnapshot();      // یا toMatchInlineSnapshot
```

## Setup / Teardown
```js
beforeAll(() => {});   afterAll(() => {});
beforeEach(() => {});  afterEach(() => {});
```

## Async
```ts
it("داده را می‌گیرد", async () => {
  const user = await getUser(1);
  expect(user.name).toBe("Ali");
});
```

## Mock، Spy و Stub
```ts
import { vi } from "vitest";      // در Jest: jest.fn / jest.mock

const fn = vi.fn().mockReturnValue(42);
fn(1, 2);
expect(fn).toHaveBeenCalledWith(1, 2);
expect(fn).toHaveBeenCalledTimes(1);

vi.spyOn(console, "error").mockImplementation(() => {});

// mock یک ماژول
vi.mock("./api", () => ({ getUser: vi.fn().mockResolvedValue({ name: "Ali" }) }));

// زمان
vi.useFakeTimers();
setTimeout(cb, 1000);
vi.advanceTimersByTime(1000);
vi.useRealTimers();
```
مثل `fetch` را با **MSW (Mock Service Worker)** شبیه‌سازی کن تا به شبکه نخورد.

## تست کامپوننت (Testing Library)
فلسفه: **مثل کاربر تست کن**، نه جزئیات پیاده‌سازی.
```bash
npm i -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```
```ts
// vite.config.ts → test: { environment: "jsdom", setupFiles: "./setup.ts" }
```
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "./Counter";

it("شمارنده زیاد می‌شود", async () => {
  render(<Counter />);
  const btn = screen.getByRole("button", { name: /۰|0/ });
  await userEvent.click(btn);
  expect(screen.getByRole("button")).toHaveTextContent("1");
});
```
اولویت انتخاب المان: `getByRole` > `getByLabelText` > `getByText` > `getByTestId` (آخرین راه).
- `getBy*` (باید باشد)، `queryBy*` (ممکن است نباشد → null)، `findBy*` (async، منتظر می‌ماند).
- برای Vue: Vue Test Utils؛ برای Angular: TestBed.

## پوشش (Coverage)
درصد خطوط/شاخه‌ها که تست اجرا کرده. عدد ۱۰۰٪ هدف نیست؛ **مسیرهای مهم** را پوشش بده.

## TDD
۱. 🔴 تست شکست‌خورده بنویس ۲. 🟢 حداقل کد برای قبولی ۳. 🔵 Refactor.

## نکات
- تست‌ها باید مستقل، سریع و deterministic باشند (بدون وابستگی به ترتیب/زمان/شبکه).
- هر تست یک رفتار.
- نام تست = توضیح رفتار.
- تست‌های flaky را فوراً درست کن.
- در CI اجرا کن ([GitHub Actions](/blog/roadmap-git-and-github/)).

## تمرین
۱. تابع `slugify(text)` را با TDD بنویس.
۲. کامپوننت فرم لاگین را با Testing Library تست کن (خطای اعتبارسنجی + submit).
۳. با MSW پاسخ یک API را mock کن.

ادامه: [E2E](/blog/roadmap-e2e-cypress-playwright/)
