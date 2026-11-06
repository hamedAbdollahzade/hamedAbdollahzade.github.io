---
title: المان‌های مدرن و Web Components
description: المان‌های مدرن و Web Components؛ آموزش HTML به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: HTML
order: 9
---

## `<dialog>`
پنجره‌ی گفتگوی بومی با focus trap، Esc و `::backdrop`:
```html
<button id="open">باز کردن</button>

<dialog id="dlg" aria-labelledby="dlg-title">
  <form method="dialog">
    <h2 id="dlg-title">تأیید حذف</h2>
    <p>مطمئنی؟</p>
    <button value="cancel">انصراف</button>
    <button value="ok">حذف</button>
  </form>
</dialog>
```
```js
open.addEventListener("click", () => dlg.showModal());   // مودال (با backdrop)
// dlg.show()  → غیرمودال
dlg.addEventListener("close", () => console.log(dlg.returnValue));   // "ok" یا "cancel"
dlg.close("ok");
```
```css
dialog::backdrop { background: rgb(0 0 0 / .5); backdrop-filter: blur(4px); }
```
- `closedby="any"` (جدید): بستن با کلیک بیرون.

## Popover API
منوی بازشو/تولتیپ بدون JS:
```html
<button popovertarget="menu">منو</button>
<div id="menu" popover>
  <a href="/a">گزینه‌ی ۱</a>
  <a href="/b">گزینه‌ی ۲</a>
</div>

<button popovertarget="tip" popovertargetaction="toggle">؟</button>
<div id="tip" popover="manual">راهنما</div>
```
- `popover` (auto): با کلیک بیرون یا Esc بسته می‌شه.
- `popover="manual"`: فقط دستی.
- روی top layer نمایش داده می‌شه (z-index نمی‌خواد).
```css
[popover]:popover-open { /* وقتی باز است */ }
[popover]::backdrop { }
```
API: `el.showPopover()`, `hidePopover()`, `togglePopover()`.

## `<details>` اکاردئون
```html
<details name="faq" open>
  <summary>سوال ۱</summary>
  <p>پاسخ</p>
</details>
<details name="faq"><summary>سوال ۲</summary><p>پاسخ</p></details>
```
`name` مشترک ⇒ فقط یکی باز می‌مونه. رویداد `toggle`. استایل: `details[open] summary { }`, `summary::marker`.

## `inert`
غیرفعال کردن کل یک زیردرخت (کلیک، فوکوس، دیده نشدن برای صفحه‌خوان):
```html
<main inert>…</main>   <!-- مثلاً وقتی مودال سفارشی باز است -->
```

## Lazy و Priority
```html
<img loading="lazy" decoding="async" fetchpriority="low" />
<iframe loading="lazy"></iframe>
```

## `contenteditable`
```html
<div contenteditable="true" role="textbox" aria-multiline="true">متن قابل ویرایش</div>
<div contenteditable="plaintext-only">فقط متن خام</div>
```

## `hidden="until-found"`
```html
<div hidden="until-found">با Ctrl+F پیدا و باز می‌شه</div>
```

## `<search>`
```html
<search>
  <form action="/search"><input type="search" name="q" /><button>جستجو</button></form>
</search>
```

## Drag & Drop
```html
<div draggable="true" id="box">بکش</div>
<div id="zone">بیانداز</div>
```
```js
box.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", box.id));
zone.addEventListener("dragover", (e) => e.preventDefault());       // اجازه‌ی drop
zone.addEventListener("drop", (e) => {
  e.preventDefault();
  zone.append(document.getElementById(e.dataTransfer.getData("text/plain")));
});
```

## Microdata / RDFa (جایگزین JSON-LD)
```html
<div itemscope itemtype="https://schema.org/Product">
  <span itemprop="name">هدفون</span>
  <span itemprop="offers" itemscope itemtype="https://schema.org/Offer">
    <span itemprop="price" content="1500000">۱٬۵۰۰٬۰۰۰</span>
    <meta itemprop="priceCurrency" content="IRR" />
  </span>
</div>
```

---

## Web Components

استاندارد مرورگر برای ساخت **المان‌های سفارشی و قابل استفاده‌ی مجدد**، بدون فریم‌ورک. سه ستون:
1. **Custom Elements** (تگ جدید با رفتار)
2. **Shadow DOM** (کپسوله‌سازی استایل و ساختار)
3. **HTML Templates** (`<template>` و `<slot>`)

### `<template>`
محتوای غیرفعال که تا clone نشه رندر نمی‌شه:
```html
<template id="card-tpl">
  <article class="card">
    <h3></h3>
    <p></p>
  </article>
</template>
<script>
  const t = document.getElementById("card-tpl");
  const node = t.content.cloneNode(true);
  node.querySelector("h3").textContent = "عنوان";
  node.querySelector("p").textContent = "متن";
  document.body.append(node);
</script>
```

### Custom Element
نام **حتماً شامل خط تیره** باشه.
```js
class HelloCard extends HTMLElement {
  static observedAttributes = ["name"];          // ویژگی‌های تحت نظر

  constructor() {
    super();                                      // اجباری
  }

  connectedCallback() {                           // وارد DOM شد
    this.render();
  }
  disconnectedCallback() {}                       // از DOM خارج شد
  adoptedCallback() {}                            // به سند دیگر منتقل شد
  attributeChangedCallback(name, oldVal, newVal) {// تغییر ویژگی
    if (this.isConnected) this.render();
  }

  get name() { return this.getAttribute("name") ?? "ناشناس"; }
  set name(v) { this.setAttribute("name", v); }

  render() {
    this.textContent = `سلام ${this.name}!`;
  }
}
customElements.define("hello-card", HelloCard);
```
```html
<hello-card name="علی"></hello-card>
```

### Shadow DOM
```js
class UserBadge extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });   // open: root از بیرون قابل دسترسی
    root.innerHTML = `
      <style>
        :host { display: inline-block; font-family: inherit; }
        :host([vip]) .badge { background: gold; }
        .badge { padding: .25em .6em; border-radius: 1em; background: #eee; }
        ::slotted(strong) { color: crimson; }
      </style>
      <span class="badge" part="badge"><slot name="icon"></slot><slot>کاربر</slot></span>
    `;
  }
}
customElements.define("user-badge", UserBadge);
```
```html
<user-badge vip><span slot="icon">⭐</span><strong>علی</strong></user-badge>
```

مفاهیم:
- **استایل کپسوله**: CSS بیرون داخل shadow نمی‌ره و بالعکس.
- **`:host`, `:host(.x)`, `:host-context()`**: استایل خود المان.
- **`<slot>`**: محل قرارگیری فرزندان نوشته‌شده توسط کاربر؛ `slot="name"` برای slot های نام‌دار؛ `::slotted()` برای استایل محتوای slot شده.
- **CSS custom properties** از شیلد رد می‌شن (راه تم‌دهی):
```css
user-badge { --badge-bg: tomato; }
/* داخل shadow: background: var(--badge-bg, #eee); */
```
- **`part` و `::part()`**: بیرون بتونه بخش‌های مشخصی رو استایل کنه:
```css
user-badge::part(badge) { font-weight: bold; }
```
- حالت `closed`: root از بیرون در دسترس نیست.
- `delegatesFocus: true` برای انتقال فوکوس به داخل.

### رویداد از Shadow DOM
```js
this.dispatchEvent(new CustomEvent("selected", {
  detail: { id: 5 },
  bubbles: true,
  composed: true,        // از مرز shadow عبور کنه
}));
```
- `event.target` در بیرون: خود host (retargeting)؛ مسیر کامل: `event.composedPath()`.

### فرم و Custom Element (`ElementInternals`)
```js
class StarRating extends HTMLElement {
  static formAssociated = true;
  #internals = this.attachInternals();
  #value = 0;
  get value() { return this.#value; }
  set value(v) {
    this.#value = v;
    this.#internals.setFormValue(String(v));       // مقدار در FormData
    this.#internals.setValidity(v ? {} : { valueMissing: true }, "امتیاز بدهید");
  }
}
customElements.define("star-rating", StarRating);
```

### Customized Built-in (در Safari پشتیبانی نمی‌شه)
```js
class FancyButton extends HTMLButtonElement {}
customElements.define("fancy-button", FancyButton, { extends: "button" });
// <button is="fancy-button">
```

### Declarative Shadow DOM (SSR)
```html
<user-badge>
  <template shadowrootmode="open">
    <style>span { color: green }</style>
    <span><slot></slot></span>
  </template>
  علی
</user-badge>
```

### Constructable Stylesheets
```js
const sheet = new CSSStyleSheet();
sheet.replaceSync(".a { color: red }");
root.adoptedStyleSheets = [sheet];     // اشتراک یک stylesheet بین چند component
```

### Lit (کتابخانه‌ی سبک روی Web Components)
```js
import { LitElement, html, css } from "lit";
class MyCounter extends LitElement {
  static properties = { count: { type: Number } };
  static styles = css`button { padding: .5em 1em }`;
  count = 0;
  render() { return html`<button @click=${() => this.count++}>${this.count}</button>`; }
}
customElements.define("my-counter", MyCounter);
```

### مزایا / محدودیت‌ها
- ✅ بدون فریم‌ورک، در هر فریم‌ورکی (React/Vue/Angular) قابل استفاده.
- ✅ کپسوله‌سازی واقعی استایل.
- ❌ SSR و فرم‌ها نیاز به کار اضافه دارن.
- ❌ دسترس‌پذیری (ARIA) رو باید خودت مدیریت کنی ([a11y](/blog/html-accessibility/)).
- ❌ Shadow DOM با بعضی کتابخانه‌های CSS سراسری (مثل Tailwind) ناسازگاره مگر با adoptedStyleSheets.

## مثال کامل: Accordion ساده
```html
<my-accordion>
  <h3 slot="title">عنوان</h3>
  <p>محتوا…</p>
</my-accordion>

<script>
class MyAccordion extends HTMLElement {
  #open = false;
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = `
      <style>
        .body { display: none }
        :host([open]) .body { display: block }
        button { all: unset; cursor: pointer; font-weight: bold }
      </style>
      <button aria-expanded="false"><slot name="title"></slot></button>
      <div class="body"><slot></slot></div>`;
    this.btn = this.shadowRoot.querySelector("button");
    this.btn.addEventListener("click", () => this.toggleAttribute("open"));
  }
  static observedAttributes = ["open"];
  attributeChangedCallback() {
    this.btn.setAttribute("aria-expanded", String(this.hasAttribute("open")));
  }
}
customElements.define("my-accordion", MyAccordion);
</script>
```

## تمرین
۱. کامپوننت `<toast-message>` با `slot` و ویژگی `type="success|error"` بساز که بعد از ۳ ثانیه خودش حذف بشه.
۲. با `<dialog>` یک مودال تأیید بنویس که مقدار `returnValue` رو بخونه.
۳. با Popover API یک منوی کشویی بدون JS بساز.
