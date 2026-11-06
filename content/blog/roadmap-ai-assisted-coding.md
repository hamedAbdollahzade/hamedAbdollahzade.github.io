---
title: کدنویسی با کمک AI
description: بخش جدید مسیر Frontend در roadmap.sh: استفاده‌ی درست از AI در توسعه. جریان کاری کامل Matt Pocock در نوت جداگانه است: Workflow for AI Coding.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 26
---

بخش جدید مسیر Frontend در roadmap.sh: استفاده‌ی درست از AI در توسعه. جریان کاری کامل Matt Pocock در نوت جداگانه است: [Workflow for AI Coding](/blog/ai-Workflow-for-AI-Coding/).

## AI در برابر کدنویسی سنتی
| | سنتی | با AI |
|---|---|---|
| نوشتن کد | دستی | تولید از روی توضیح |
| سرعت اولیه | کندتر | سریع |
| ریسک | خطای انسانی | **کد باورپذیر ولی غلط**، امنیت، سوء‌برداشت |
| مهارت کلیدی | سینتکس و API | **تعریف مسئله، بازبینی، تست، معماری** |

AI جایگزین فهم نیست؛ **ضریب‌دهنده** است. هرچه پایه‌ات (JS، HTML، CSS، معماری) قوی‌تر باشد، خروجی بهتری می‌گیری و اشتباه‌ها را سریع‌تر می‌بینی.

## LLM چطور کار می‌کند؟ (خلاصه)
- مدل زبانی بر اساس **token**‌ها، محتمل‌ترین ادامه‌ی متن را پیش‌بینی می‌کند؛ «درک» انسانی ندارد و ممکن است **توهم (hallucination)** بزند: API یا تابع ناموجود.
- **Context window**: مقدار متنی که مدل همزمان می‌بیند؛ با پرشدن آن کیفیت افت می‌کند (Smart/Dumb Zone).
- **Temperature**: تصادفی بودن خروجی.
- مدل‌ها: Claude (Anthropic)، GPT (OpenAI)، Gemini (Google) و ...

## ابزارها
| دسته | نمونه |
|---|---|
| **دستیار داخل ویرایشگر** | GitHub Copilot، Cursor، Windsurf، Google Antigravity |
| **Agent در ترمینال** | Claude Code، Codex CLI، Gemini CLI |
| **چت** | Claude، ChatGPT، Gemini |
| **ساخت UI از متن** | v0، Bolt، Lovable |

## Prompting مؤثر
۱. **زمینه** بده: فریم‌ورک، نسخه‌ها، ساختار پروژه، قراردادها
۲. **هدف دقیق** و معیار پذیرش: «چه چیزی ساخته شود و چطور بفهمیم درست است»
۳. **مثال** ورودی/خروجی بده (few-shot)
۴. **قیدها**: «از کتابخانه‌ی جدید استفاده نکن»، «فقط TypeScript»
۵. مسئله‌ی بزرگ را به **گام‌های کوچک** بشکن
۶. بخواه ابتدا **برنامه** بدهد و بعد کد بزند
۷. نقش بده (reviewer، معمار)
۸. خروجی ساختارمند بخواه (JSON، diff)
۹. اگر اشتباه کرد، **خطا و لاگ واقعی** را بچسبان، نه توضیح مبهم

```text
بد:  یک فرم لاگین بساز
خوب: در این پروژه‌ی React 19 + TypeScript + Tailwind، کامپوننت LoginForm بساز
     (src/components/LoginForm.tsx). فیلدهای ایمیل و رمز، اعتبارسنجی با Zod،
     پیام خطای فارسی، دسترس‌پذیر (label + aria-invalid). فقط خود کامپوننت، بدون
     نصب بسته‌ی جدید. همراه آن تست Vitest بنویس.
```

## الگوهای کاری
- **Plan → Implement → Verify**: برنامه، پیاده‌سازی، تست
- **TDD با AI**: اول تست شکست‌خورده، بعد کد ([تست](/blog/roadmap-testing-jest-vitest/))
- **Agent با ابزار**: خواندن فایل، اجرای دستور، تست، لینت؛ حلقه‌ی بازخورد قطعی حیاتی است
- **Skill / دستورالعمل پروژه** (مثل `CLAUDE.md` / `AGENTS.md`) برای ثبت قواعد پروژه
- **MCP (Model Context Protocol)**: پروتکل استاندارد اتصال agent به ابزارها و منابع بیرونی (GitHub، DB، مرورگر، Figma)
- **Sub-agent**: کار موازی با context ایزوله
- **Refactoring** با کمک AI: همیشه با تست پوششی ([کیفیت کد](/blog/roadmap-eslint-prettier-code-quality/))
- **مستندسازی خودکار**: JSDoc/README/ADR از روی کد (بازبینی کن)

## ساخت قابلیت‌های AI در محصول
- API مدل‌ها (Anthropic، OpenAI، Gemini) از **بک‌اند**، نه مستقیم از مرورگر (کلید فاش می‌شود)
- **Streaming** پاسخ برای تجربه‌ی بهتر:
```js
const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ prompt }) });
const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  output.textContent += value;        // نمایش تدریجی
}
```
- مدیریت هزینه/توکن، rate limit، لغو درخواست (`AbortController`)
- **RAG**، function calling / tool use، خروجی ساختارمند با schema
- امنیت: **Prompt injection** — محتوای غیرقابل‌اعتماد (صفحه‌ی وب، ایمیل) را دستور ندان؛ ورودی و خروجی را فیلتر کن
- حریم خصوصی: داده‌ی حساس را به سرویس‌های بیرونی نفرست.

## خطرات و بهترین روش‌ها
- **همه‌ی کد تولیدی را بخوان** (review)؛ مسئول نتیجه تویی
- هرگز secret را در prompt نگذار
- مراقب وابستگی‌های ساختگی (بسته‌ی ناموجود = ریسک supply chain)
- لایسنس و کپی‌رایت کد
- با تست، لینت، type-check و CI خروجی را اعتبارسنجی کن
- commit کوچک و مکرر؛ تغییرات AI را با `git diff` بررسی کن ([Git](/blog/roadmap-git-and-github/))
- کدبیس تمیز و ماژول‌های **عمیق** → agent بهتر کار می‌کند
- تسک‌ها را کوچک و در Smart Zone نگه دار؛ context را مرتب پاک کن

## تمرین
۱. یک کامپوننت را یک بار با prompt مبهم و یک بار با prompt دقیق از AI بخواه و مقایسه کن.
۲. یک باگ واقعی را با چسباندن لاگ خطا و کد مرتبط رفع کن؛ سپس تست بنویس که جلوی بازگشتش را بگیرد.
۳. یک چت ساده با streaming بساز (بک‌اند واسط برای کلید API).
