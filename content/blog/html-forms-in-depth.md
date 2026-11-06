---
title: فرم‌ها در عمق و اعتبارسنجی
description: فرم‌ها در عمق و اعتبارسنجی؛ آموزش HTML به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: HTML
order: 5
---

## ساختار حرفه‌ای فرم
```html
<form action="/register" method="post" novalidate>
  <fieldset>
    <legend>اطلاعات حساب</legend>

    <div class="field">
      <label for="email">ایمیل</label>
      <input
        id="email" name="email" type="email"
        autocomplete="email" required
        aria-describedby="email-hint email-error"
      />
      <small id="email-hint">برای بازیابی رمز استفاده می‌شود.</small>
      <span id="email-error" role="alert"></span>
    </div>

    <button type="submit">ثبت‌نام</button>
  </fieldset>
</form>
```
- `fieldset` + `legend`: گروه‌بندی فیلدهای مرتبط (به‌خصوص radio/checkbox).
- `aria-describedby`: وصل کردن راهنما و پیام خطا به فیلد.

## اعتبارسنجی داخلی HTML5

### ویژگی‌ها
| ویژگی | معنی |
|---|---|
| `required` | اجباری |
| `minlength` / `maxlength` | طول متن |
| `min` / `max` | بازه‌ی عدد/تاریخ |
| `step` | گام (برای number/range/date) |
| `pattern="regex"` | الگوی regex (کل مقدار باید مطابقت کنه) |
| `type="email/url/number/tel..."` | قالب |
| `multiple` | چند مقدار (email / file / select) |
| `accept` | نوع فایل |

```html
<input type="text" name="username"
       pattern="[a-zA-Z0-9_]{3,16}"
       title="۳ تا ۱۶ حرف انگلیسی، عدد یا _"
       required />

<input type="number" min="18" max="99" step="1" />
<input type="tel" pattern="09[0-9]{9}" placeholder="09123456789" />
<input type="password" minlength="8" required />
<input type="file" accept=".pdf,image/*" multiple />
```

### حالت‌های CSS اعتبارسنجی
```css
input:valid    { border-color: green; }
input:invalid  { border-color: red; }
input:required { /* … */ }
input:optional { }
input:in-range, input:out-of-range { }
input:placeholder-shown { }

/* فقط بعد از تعامل کاربر قرمز بشه */
input:user-invalid { outline: 2px solid red; }
input:user-valid   { outline: 2px solid green; }
```
> `:invalid` از همون اول (قبل از تایپ) فعال می‌شه؛ `:user-invalid` فقط بعد از تعامل. در مرورگرهای قدیمی‌تر: `input:not(:placeholder-shown):invalid`.

### Constraint Validation API (با JS)
```js
const input = document.querySelector("#email");

input.validity.valid;           // true/false
input.validity.valueMissing;    // خالی با required
input.validity.typeMismatch;    // فرمت اشتباه
input.validity.patternMismatch;
input.validity.tooShort; input.validity.tooLong;
input.validity.rangeUnderflow; input.validity.rangeOverflow;
input.validationMessage;        // پیام مرورگر

input.setCustomValidity("این ایمیل قبلاً ثبت شده");   // پیام سفارشی (و invalid)
input.setCustomValidity("");                           // پاک کردن

form.checkValidity();   // بررسی بدون نمایش پیام
form.reportValidity();  // بررسی + نمایش پیام

input.addEventListener("invalid", (e) => { /* هنگام شکست */ });
```
مثال: تکرار رمز
```js
confirm.addEventListener("input", () => {
  confirm.setCustomValidity(confirm.value !== pass.value ? "رمزها یکی نیستن" : "");
});
```
> اعتبارسنجی سمت کلاینت **فقط برای تجربه‌ی کاربری** است. همیشه در سرور هم اعتبارسنجی کن.

## انواع input پیشرفته

### `autocomplete`
```html
<input name="name"  autocomplete="name" />
<input name="email" autocomplete="email" />
<input name="tel"   autocomplete="tel" />
<input name="u"     autocomplete="username" />
<input name="p"     type="password" autocomplete="current-password" />   <!-- ورود -->
<input name="np"    type="password" autocomplete="new-password" />       <!-- ثبت‌نام -->
<input name="otp"   autocomplete="one-time-code" inputmode="numeric" />
<input name="a"     autocomplete="street-address" />
<input name="cc"    autocomplete="cc-number" />
```

### `inputmode` و `enterkeyhint` (کیبورد موبایل)
```html
<input inputmode="numeric" pattern="[0-9]*" />   <!-- کیبورد عددی -->
<input inputmode="decimal" />
<input inputmode="email" /><input inputmode="url" /><input inputmode="search" />
<input enterkeyhint="send" />
```

### `datalist` (پیشنهاد خودکار)
```html
<input list="browsers" name="browser" />
<datalist id="browsers">
  <option value="Chrome"></option>
  <option value="Firefox"></option>
  <option value="Safari"></option>
</datalist>
```

### `select` پیشرفته
```html
<select name="car" multiple size="4">
  <optgroup label="آلمانی">
    <option value="bmw">BMW</option>
    <option value="audi">Audi</option>
  </optgroup>
  <optgroup label="ژاپنی">
    <option value="toyota" disabled>Toyota</option>
  </optgroup>
</select>
```

### `output`, `progress`, `meter`
```html
<form oninput="total.value = Number(a.value) + Number(b.value)">
  <input type="number" id="a" value="1" /> +
  <input type="number" id="b" value="2" /> =
  <output name="total" for="a b">3</output>
</form>

<progress value="70" max="100">70%</progress>
<meter value="0.6" min="0" max="1" low="0.3" high="0.8" optimum="1">60%</meter>
```

### range با نمایش مقدار
```html
<label for="vol">صدا</label>
<input type="range" id="vol" min="0" max="100" value="40" />
<output for="vol">40</output>
```

### فایل
```html
<input type="file" name="photo" accept="image/*" capture="environment" />  <!-- دوربین موبایل -->
<input type="file" name="docs" multiple />
<input type="file" name="folder" webkitdirectory />
```
فرم آپلود:
```html
<form action="/upload" method="post" enctype="multipart/form-data">…</form>
```

### ارتباط فیلد با فرم دیگر
```html
<form id="search-form" action="/search"></form>
<input form="search-form" name="q" />
<button form="search-form">جستجو</button>
```

## ارسال با ویژگی‌های دکمه (Form Override)
```html
<button type="submit" formaction="/save-draft" formmethod="post" formnovalidate>ذخیره‌ی پیش‌نویس</button>
```

## ارسال فرم با JavaScript
```js
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }

  const data = new FormData(form);
  const res = await fetch(form.action, { method: "POST", body: data });   // multipart
  // یا JSON:
  // body: JSON.stringify(Object.fromEntries(data)), headers: {"Content-Type": "application/json"}
});
```
`FormData` : `data.get("email")`, `data.getAll("tags")`, `data.append(k,v)`, `data.entries()`.

## دسترس‌پذیری فرم
- هر فیلد: `label` مرتبط.
- پیام خطا نزدیک فیلد + `aria-describedby` + `aria-invalid="true"`.
- فقط به رنگ تکیه نکن (آیکن/متن هم بذار).
- ترتیب Tab منطقی باشه.
- `required` بصری (ستاره) + `aria-required` یا همون `required`.
- فرم طولانی رو به مرحله‌های کوچیک بشکن و پیشرفت رو نشون بده.

```html
<input id="email" aria-invalid="true" aria-describedby="email-error" />
<p id="email-error" role="alert">ایمیل معتبر وارد کنید.</p>
```

## الگوی بهتر برای دکمه‌ی ارسال
```html
<button type="submit" aria-busy="false">
  <span>ارسال</span>
</button>
```
هنگام ارسال دکمه رو `disabled` کن تا دوباره‌ارسالی نشه.

## تمرین
فرم ثبت‌نامی بساز با: ایمیل، رمز (حداقل ۸)، تکرار رمز (با `setCustomValidity`)، موبایل با `pattern`، تاریخ تولد با `max` برابر امروز، `datalist` شهرها و checkbox قوانین. پیام خطا رو با `:user-invalid` و `aria-describedby` نشان بده.
