---
title: عبارات منظم (Regular Expressions)
description: عبارات منظم (Regular Expressions)؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 12
---

## ساخت
```js
const r1 = /abc/i;                // literal
const r2 = new RegExp("abc", "i");// سازنده (برای الگوی پویا)
const word = "hi";
const r3 = new RegExp(`\\b${word}\\b`, "g"); // دو بک‌اسلش در رشته
```

## Flag ها
| Flag | معنی |
|---|---|
| `g` | global: همه‌ی تطابق‌ها |
| `i` | بی‌تفاوت به حروف بزرگ/کوچک |
| `m` | multiline: `^` و `$` برای هر خط |
| `s` | نقطه `.` شامل خط جدید هم بشه |
| `u` | یونیکد کامل |
| `y` | sticky: دقیقاً از `lastIndex` |
| `d` | شاخص‌های شروع/پایان (`indices`) |
| `v` | یونیکد پیشرفته‌تر (مجموعه‌ها) |

## کاراکترها
| الگو | معنی |
|---|---|
| `.` | هر کاراکتر (جز خط جدید) |
| `\d` `\D` | رقم / غیر رقم |
| `\w` `\W` | حرف، رقم، `_` / مخالفش |
| `\s` `\S` | فضای خالی / مخالفش |
| `\b` `\B` | مرز کلمه / غیر مرز |
| `^` `$` | شروع / پایان |
| `[abc]` | یکی از a,b,c |
| `[^abc]` | هیچ‌کدوم |
| `[a-z0-9]` | محدوده |
| `a|b` | a یا b |
| `\.` | escape کردن نقطه |

## تکرار (Quantifier)
| الگو | معنی |
|---|---|
| `*` | صفر یا بیشتر |
| `+` | یک یا بیشتر |
| `?` | صفر یا یک |
| `{3}` | دقیقاً ۳ |
| `{2,5}` | ۲ تا ۵ |
| `{2,}` | حداقل ۲ |
| `*?` `+?` | **lazy** (کمترین تطابق) |

```js
"<a><b>".match(/<.+>/)[0];    // → "<a><b>"  (greedy)
"<a><b>".match(/<.+?>/)[0];   // → "<a>"     (lazy)
```

## گروه‌ها
```js
/(\d{4})-(\d{2})/.exec("2024-03");     // گروه شماره‌دار: [1]="2024", [2]="03"
/(?:ab)+/.test("abab");                // گروه بدون capture
/(?<y>\d{4})-(?<m>\d{2})/.exec("2024-03").groups; // → { y: "2024", m: "03" }
/(\w)\1/.test("hello");                // back-reference: حرف تکراری → true
/(?<c>\w)\k<c>/.test("hello");         // نام‌دار
```

## Lookaround
```js
/\d+(?= تومان)/.exec("100 تومان")[0];   // lookahead مثبت → "100"
/\d+(?! تومان)/.exec("5 دلار")[0];      // lookahead منفی
/(?<=\$)\d+/.exec("$50")[0];            // lookbehind مثبت → "50"
/(?<!\$)\b\d+/.exec("50 $20");          // lookbehind منفی
```

## متدهای RegExp
```js
const re = /a(\d)/g;

re.test("a1");       // → true / false
re.exec("a1 a2");    // → ["a1", "1", index: 0, ...]  (و lastIndex جلو می‌ره)
re.lastIndex;        // موقعیت بعدی (با g و y)
re.source;           // → "a(\\d)"
re.flags;            // → "g"
```
> با flag `g` متد `test`/`exec` حالت (state) دارن (`lastIndex`)؛ مواظب باش از یک regex سراسری مکرر استفاده نکنی.

## متدهای String
```js
"a1b2".match(/\d/);      // → ["1", index: 1, ...]  (اولین، با جزئیات)
"a1b2".match(/\d/g);     // → ["1", "2"]            (همه)
[..."a1b2".matchAll(/(?<n>\d)/g)].map(m => m.groups.n); // → ["1","2"]
"a1b2".search(/\d/);     // → 1
"a1b2".replace(/\d/g, "#");        // → "a#b#"
"a1b2".replaceAll(/\d/g, "#");     // (باید g داشته باشه)
"a1b2".split(/\d/);                // → ["a", "b", ""]
"john smith".replace(/(?<f>\w+) (?<l>\w+)/, "$<l>, $<f>"); // → "smith, john"
"abc".replace(/b/, "[$&]");        // → "a[b]c"  ($& = تطابق کامل)
```
جایگزین‌ها: `$1..$9`, `$&`, `` $` `` (قبل), `$'` (بعد), `$<name>`.

## الگوهای کاربردی

```js
// ایمیل (ساده)
/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test("a@b.com");   // → true

// شماره‌ی موبایل ایران
/^09\d{9}$/.test("09123456789");                // → true

// فقط عدد
/^\d+$/.test("123");

// رمز: حداقل ۸ کاراکتر، حرف بزرگ، کوچک، رقم
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test("Abcdef12");

// حذف فاصله‌های اضافی
"a   b    c".replace(/\s+/g, " ");               // → "a b c"

// camelCase به snake_case
"myVariableName".replace(/[A-Z]/g, (c) => "_" + c.toLowerCase()); // → "my_variable_name"

// جداکننده‌ی هزارگان
"1234567".replace(/\B(?=(\d{3})+(?!\d))/g, ",");  // → "1,234,567"

// استخراج هشتگ
"hi #js and #css".match(/#\w+/g);                // → ["#js", "#css"]

// استخراج URL
"see https://a.com/x ok".match(/https?:\/\/\S+/g);

// حروف فارسی
/[؀-ۿ]+/.test("سلام");                // → true
// با یونیکد:
/\p{Script=Arabic}+/u.test("سلام");
/\p{L}+/u.test("hello");                         // هر حرفی
/\p{Emoji}/u.test("😀");
```

## نکات
- برای escape کردن متن کاربر:
```js
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
new RegExp(escape(userInput));
```
- regex های پیچیده می‌تونن **ReDoS** (کندی فاجعه‌بار) ایجاد کنن؛ الگوهای تو در تو مثل `(a+)+` رو روی ورودی کاربر اجرا نکن.
- برای HTML و JSON از parser استفاده کن، نه regex.
- ابزار تمرین: regex101.com
