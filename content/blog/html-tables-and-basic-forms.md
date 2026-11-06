---
title: جدول و فرم ساده
description: جدول و فرم ساده؛ آموزش HTML به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: HTML
order: 3
---

## جدول
جدول برای **داده‌های جدولی** است، نه برای چیدمان صفحه.

```html
<table>
  <caption>نمرات دانش‌آموزان</caption>
  <thead>
    <tr>
      <th scope="col">نام</th>
      <th scope="col">ریاضی</th>
      <th scope="col">علوم</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">علی</th>
      <td>18</td>
      <td>17</td>
    </tr>
    <tr>
      <th scope="row">سارا</th>
      <td>20</td>
      <td>19</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>میانگین</td>
      <td>19</td>
      <td>18</td>
    </tr>
  </tfoot>
</table>
```

| تگ | کاربرد |
|---|---|
| `<table>` | جدول |
| `<caption>` | عنوان جدول |
| `<thead> <tbody> <tfoot>` | سربرگ، بدنه، پاورقی |
| `<tr>` | ردیف |
| `<th>` | سلول سرتیتر (بولد/وسط‌چین پیش‌فرض) |
| `<td>` | سلول داده |
| `<colgroup> <col>` | استایل ستون‌ها |

`scope="col"` یا `scope="row"` به صفحه‌خوان کمک می‌کنه سرتیتر هر سلول رو بفهمه.

### ادغام سلول‌ها
```html
<tr>
  <td colspan="2">دو ستون</td>
  <td rowspan="2">دو ردیف</td>
</tr>
```

### استایل پایه (CSS)
```html
<style>
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ccc; padding: 8px; text-align: right; }
  thead { background: #f4f4f4; }
  tbody tr:nth-child(even) { background: #fafafa; }
</style>
```

### جدول ریسپانسیو
```html
<div style="overflow-x: auto"><table>…</table></div>
```

---

## فرم ساده

```html
<form action="/signup" method="post">
  <label for="name">نام:</label>
  <input type="text" id="name" name="name" required />

  <label for="email">ایمیل:</label>
  <input type="email" id="email" name="email" required />

  <button type="submit">ثبت‌نام</button>
</form>
```

### `<form>`
| ویژگی | معنی |
|---|---|
| `action` | آدرسی که داده به اون ارسال می‌شه |
| `method` | `get` (داده در URL) یا `post` (داده در بدنه‌ی درخواست) |
| `enctype` | برای آپلود فایل: `multipart/form-data` |
| `autocomplete` | `on`/`off` |
| `novalidate` | خاموش کردن اعتبارسنجی مرورگر |

- **GET**: برای جستجو و فیلتر (قابل bookmark).
- **POST**: برای اطلاعات حساس یا تغییر داده (ثبت‌نام، پرداخت).

### `<label>` ⭐
متن توضیحی فیلد. با کلیک روی اون فیلد فوکوس می‌شه و صفحه‌خوان‌ها اون رو می‌خونن:
```html
<!-- روش ۱: for و id -->
<label for="user">نام کاربری</label>
<input id="user" name="user" />

<!-- روش ۲: تودرتو -->
<label>نام کاربری <input name="user" /></label>
```
> هر فیلد باید `label` داشته باشه. `placeholder` جایگزین label نیست.

### `<input>` و انواع آن
```html
<input type="text" name="username" placeholder="مثلاً ali" />
<input type="password" name="pass" />
<input type="email" name="email" />
<input type="number" name="age" min="0" max="120" step="1" />
<input type="tel" name="phone" />
<input type="url" name="site" />
<input type="search" name="q" />
<input type="date" name="birth" />
<input type="time" name="t" />
<input type="datetime-local" name="dt" />
<input type="month" /> <input type="week" />
<input type="color" name="c" value="#ff0000" />
<input type="range" name="r" min="0" max="100" value="50" />
<input type="file" name="avatar" accept="image/*" />
<input type="hidden" name="token" value="abc123" />
<input type="checkbox" name="agree" />
<input type="radio" name="gender" value="m" />
```

### ویژگی‌های پرکاربرد
| ویژگی | کاربرد |
|---|---|
| `name` | نام فیلد در داده‌ی ارسالی (**بدون اون ارسال نمی‌شه**) |
| `value` | مقدار پیش‌فرض/ارسالی |
| `placeholder` | متن راهنمای محو |
| `required` | اجباری |
| `disabled` | غیرفعال (ارسال نمی‌شه) |
| `readonly` | فقط‌خواندنی (ارسال می‌شه) |
| `autofocus` | فوکوس خودکار |
| `maxlength` / `minlength` | حداکثر/حداقل طول |
| `min` / `max` / `step` | بازه برای عدد/تاریخ |
| `pattern` | الگوی regex |

### چک‌باکس و رادیو
```html
<label><input type="checkbox" name="news" value="yes" checked /> خبرنامه</label>

<fieldset>
  <legend>جنسیت</legend>
  <label><input type="radio" name="gender" value="m" /> مرد</label>
  <label><input type="radio" name="gender" value="f" /> زن</label>
</fieldset>
```
- رادیو‌های هم‌گروه باید `name` یکسان داشته باشن (فقط یکی انتخاب می‌شه).

### `textarea` و `select`
```html
<label for="msg">پیام</label>
<textarea id="msg" name="msg" rows="4" cols="40"></textarea>

<label for="city">شهر</label>
<select id="city" name="city">
  <option value="">انتخاب کنید</option>
  <option value="thr">تهران</option>
  <option value="isf" selected>اصفهان</option>
</select>
```

### دکمه‌ها
```html
<button type="submit">ارسال</button>
<button type="reset">پاک کردن</button>
<button type="button">دکمه‌ی معمولی (برای JS)</button>
<input type="submit" value="ارسال" />
```
> `<button>` بدون `type` داخل فرم، پیش‌فرض `submit` است!

## ارسال داده
با `method="get"` و `name="q"`:
```
/search?q=html
```
با `post`: داده در بدنه‌ی درخواست می‌ره و سرور پردازشش می‌کنه (در این سطح، فقط ساختار فرم رو یاد می‌گیری؛ بک‌اند جداست).

## مثال کامل: فرم تماس
```html
<form action="/contact" method="post">
  <fieldset>
    <legend>تماس با ما</legend>

    <p>
      <label for="n">نام</label><br />
      <input id="n" name="name" required />
    </p>
    <p>
      <label for="e">ایمیل</label><br />
      <input id="e" name="email" type="email" required />
    </p>
    <p>
      <label for="s">موضوع</label><br />
      <select id="s" name="subject">
        <option>پشتیبانی</option>
        <option>فروش</option>
      </select>
    </p>
    <p>
      <label for="m">پیام</label><br />
      <textarea id="m" name="message" rows="5"></textarea>
    </p>
    <button type="submit">ارسال</button>
  </fieldset>
</form>
```

## تمرین
۱. جدول برنامه‌ی هفتگی کلاسی بساز (با `colspan` برای ساعت ناهار).
۲. فرم ثبت‌نام با نام، ایمیل، رمز، جنسیت (radio)، علایق (checkbox)، شهر (select) و توضیحات.
