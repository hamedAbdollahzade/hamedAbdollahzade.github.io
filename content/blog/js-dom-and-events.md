---
title: DOM و رویدادها (Events)
description: DOM (Document Object Model) نمایش درختی صفحه‌ی HTML است که با JS می‌تونی بخونی و تغییرش بدی. (فقط در مرورگر.)
date: 2026-11-06
category: JavaScript
order: 20
---

**DOM** (Document Object Model) نمایش درختی صفحه‌ی HTML است که با JS می‌تونی بخونی و تغییرش بدی. (فقط در مرورگر.)

## انتخاب عناصر
```js
document.getElementById("app");
document.getElementsByClassName("item");   // HTMLCollection (زنده)
document.getElementsByTagName("li");
document.querySelector(".card > h2");      // اولین تطابق یا null
document.querySelectorAll("li.active");    // NodeList (ثابت)

const items = [...document.querySelectorAll("li")];   // تبدیل به آرایه
el.closest(".card");        // نزدیک‌ترین والد (یا خود عنصر) مطابق
el.matches(".active");      // آیا با selector می‌خونه؟
```

## پیمایش درخت
```js
el.parentElement;
el.children;                 // فقط Element ها
el.firstElementChild;  el.lastElementChild;
el.nextElementSibling; el.previousElementSibling;
el.childNodes;               // شامل متن و کامنت
```

## محتوا
```js
el.textContent = "متن ساده";            // امن
el.innerText;                           // متن قابل‌مشاهده (با توجه به CSS)
el.innerHTML = "<b>بولد</b>";           // ⚠️ خطر XSS با ورودی کاربر
el.outerHTML;
el.insertAdjacentHTML("beforeend", "<li>جدید</li>");
```
> ورودی کاربر رو **هرگز** در `innerHTML` نذار؛ از `textContent` استفاده کن.

## ساخت و افزودن عنصر
```js
const li = document.createElement("li");
li.textContent = "آیتم";
li.className = "item";

ul.append(li, "متن");        // آخر (چند مقدار، متن هم می‌گیره)
ul.prepend(li);              // اول
ul.appendChild(li);          // قدیمی‌تر
el.before(x);  el.after(x);  // قبل/بعد از خود عنصر
el.replaceWith(newEl);
el.remove();                 // حذف
ul.replaceChildren();        // خالی کردن
const clone = li.cloneNode(true);   // کپی عمیق

// برای افزودن چندتا (عملکرد بهتر)
const frag = document.createDocumentFragment();
["a", "b"].forEach((t) => {
  const x = document.createElement("li"); x.textContent = t; frag.append(x);
});
ul.append(frag);
```

## ویژگی‌ها (Attributes)
```js
el.getAttribute("href");
el.setAttribute("href", "/x");
el.removeAttribute("disabled");
el.hasAttribute("hidden");
el.toggleAttribute("hidden");

el.id = "main";
input.value = "hi";
checkbox.checked = true;
a.href;                       // ویژگی (property) با آدرس کامل

// data-*
// <div data-user-id="5">
el.dataset.userId;            // → "5"
el.dataset.role = "admin";    // → data-role="admin"
```

## کلاس‌ها و استایل
```js
el.classList.add("a", "b");
el.classList.remove("a");
el.classList.toggle("active");           // اضافه/حذف
el.classList.toggle("on", isOn);         // اجباری
el.classList.contains("a");
el.classList.replace("a", "c");

el.style.color = "red";
el.style.backgroundColor = "#eee";       // camelCase
el.style.setProperty("--theme", "dark"); // CSS variable
getComputedStyle(el).width;              // مقدار نهایی محاسبه‌شده
```

## ابعاد و موقعیت
```js
el.offsetWidth; el.clientHeight; el.scrollTop;
el.getBoundingClientRect();     // { top, left, width, height, ... } نسبت به viewport
window.innerWidth; window.scrollY;
el.scrollIntoView({ behavior: "smooth" });
```

---

## رویدادها (Events)

### افزودن Listener
```js
button.addEventListener("click", (event) => {
  console.log("کلیک شد", event.target);
});
```
حذف (باید همون تابع باشه):
```js
function onClick() {}
button.addEventListener("click", onClick);
button.removeEventListener("click", onClick);
```
گزینه‌ها:
```js
btn.addEventListener("click", fn, { once: true });      // فقط یک بار
btn.addEventListener("scroll", fn, { passive: true });  // بهبود عملکرد
btn.addEventListener("click", fn, { signal: ac.signal });// حذف با AbortController
```

### رویدادهای رایج
| دسته | رویدادها |
|---|---|
| ماوس | `click, dblclick, mousedown, mouseup, mousemove, mouseenter, mouseleave, contextmenu` |
| کیبورد | `keydown, keyup` |
| فرم | `submit, input, change, focus, blur, reset` |
| صفحه | `DOMContentLoaded, load, resize, scroll, beforeunload` |
| لمس/pointer | `pointerdown, pointermove, pointerup, touchstart` |
| درگ | `dragstart, dragover, drop` |
| کلیپ‌بورد | `copy, paste, cut` |

### آبجکت Event
```js
el.addEventListener("click", (e) => {
  e.type;             // "click"
  e.target;           // عنصری که روش کلیک شد
  e.currentTarget;    // عنصری که listener بهش وصله
  e.preventDefault(); // جلوگیری از رفتار پیش‌فرض (submit، لینک)
  e.stopPropagation();// جلوگیری از بالا رفتن
  e.clientX; e.clientY; e.shiftKey; e.ctrlKey;
});

input.addEventListener("keydown", (e) => {
  e.key;      // "Enter", "a", "ArrowUp"
  e.code;     // "KeyA"
  if (e.key === "Enter") submit();
});
```

### Propagation: Bubbling و Capturing
رویداد: **capture** (از بالا به پایین) ← **target** ← **bubble** (از پایین به بالا).
```js
parent.addEventListener("click", () => console.log("parent"));
child.addEventListener("click", () => console.log("child"));
// کلیک روی child → child ، parent
parent.addEventListener("click", fn, true);   // مرحله‌ی capture
```

### Event Delegation ⭐
یک listener روی والد به جای هر فرزند (برای عناصر پویا هم کار می‌کنه):
```js
list.addEventListener("click", (e) => {
  const item = e.target.closest("li");
  if (!item || !list.contains(item)) return;
  console.log("آیتم:", item.dataset.id);
});
```

### فرم‌ها
```js
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  console.log(data);
});
input.addEventListener("input", (e) => console.log(e.target.value));
```

### Custom Event
```js
el.addEventListener("saved", (e) => console.log(e.detail));
el.dispatchEvent(new CustomEvent("saved", { detail: { id: 1 }, bubbles: true }));
```

### بارگذاری صفحه
```js
document.addEventListener("DOMContentLoaded", () => { /* DOM آماده */ });
window.addEventListener("load", () => { /* همه‌ی منابع */ });
// یا script با defer / type="module" در انتهای body
```

---

## Observer ها
```js
// دیده شدن عنصر (lazy load، infinite scroll)
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => e.isIntersecting && console.log("دیده شد"));
});
io.observe(el);

// تغییر اندازه
new ResizeObserver((entries) => console.log(entries[0].contentRect)).observe(el);

// تغییر DOM
new MutationObserver((muts) => console.log(muts)).observe(el, { childList: true, subtree: true });
```

## ذخیره‌سازی و سایر Web APIs
```js
localStorage.setItem("theme", "dark");
history.pushState({}, "", "/new-url");
navigator.clipboard.writeText("متن");
navigator.geolocation.getCurrentPosition((pos) => console.log(pos.coords));
window.matchMedia("(prefers-color-scheme: dark)").matches;
requestAnimationFrame(() => {});
```

## مثال کامل: Todo ساده
```html
<form id="f"><input id="t" /><button>افزودن</button></form>
<ul id="list"></ul>
<script type="module">
  const f = document.querySelector("#f");
  const t = document.querySelector("#t");
  const list = document.querySelector("#list");

  f.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!t.value.trim()) return;
    const li = document.createElement("li");
    li.textContent = t.value;
    list.append(li);
    t.value = "";
  });

  list.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    li?.classList.toggle("done");
  });
</script>
```

## بهینه‌سازی
- DOM رو دسته‌ای تغییر بده (`DocumentFragment`، `replaceChildren`).
- خواندن و نوشتن layout رو قاطی نکن (layout thrashing).
- از event delegation استفاده کن.
- برای scroll/resize از `debounce`/`throttle` بهره ببر ([الگوهای تابعی](/blog/js-functional-patterns/)).
