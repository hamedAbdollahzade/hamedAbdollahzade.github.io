---
title: Svelte و Solid
description: دو فریم‌ورک مدرن بدون Virtual DOM که روی کارایی و سادگی تمرکز دارن.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 13
---

دو فریم‌ورک مدرن بدون Virtual DOM که روی کارایی و سادگی تمرکز دارن.

---

## Svelte 5
**کامپایلر**: کامپوننت‌ها در build به کد DOM مستقیم تبدیل می‌شن؛ runtime کوچک.

```bash
npm create vite@latest my-svelte -- --template svelte-ts
# یا SvelteKit: npx sv create my-app
```

### کامپوننت (`.svelte`)
```svelte
<script lang="ts">
  let count = $state(0);                       // state واکنشی (runes)
  let double = $derived(count * 2);            // مقدار مشتق

  $effect(() => {                              // اثر جانبی
    document.title = `شمارش: ${count}`;
  });
</script>

<button onclick={() => count++}>
  {count} × ۲ = {double}
</button>

<style>
  button { padding: .5rem 1rem; }   /* خودکار scoped */
</style>
```
**Runes** (`$state`, `$derived`, `$effect`, `$props`) سینتکس Svelte 5 هستن. در Svelte 4، با `let` و `$:` کار می‌شد.

### Props
```svelte
<!-- Card.svelte -->
<script lang="ts">
  let { title, children, onclose } = $props();
</script>
<h3>{title}</h3>
{@render children?.()}
<button onclick={onclose}>بستن</button>

<!-- استفاده -->
<Card title="سلام" onclose={() => show = false}>محتوا</Card>
```

### Template
```svelte
{#if user}
  <p>{user.name}</p>
{:else}
  <p>مهمان</p>
{/if}

{#each items as item (item.id)}
  <li>{item.name}</li>
{:else}
  <li>خالی</li>
{/each}

{#await promise}
  <p>در حال بارگذاری…</p>
{:then data}
  <p>{data}</p>
{:catch err}
  <p>{err.message}</p>
{/await}

<input bind:value={text} />
<div class:active={isActive}></div>
```

### Store / state مشترک
در Svelte 5 می‌شه state رو در فایل `.svelte.ts` تعریف کرد:
```ts
// counter.svelte.ts
export const counter = $state({ n: 0 });
export const inc = () => counter.n++;
```
(Storeهای قدیمی `writable/readable` هم هنوز هستن.)

### SvelteKit
Meta-framework رسمی: file-based routing، load function، form actions، SSR/SSG ([meta-frameworks-ssr-ssg](/blog/roadmap-meta-frameworks-ssr-ssg/)).

---

## Solid.js
سینتکس شبیه React (JSX)، ولی با **signal** و بدون Virtual DOM: کامپوننت فقط **یک‌بار** اجرا می‌شه و فقط ایده‌هایی که به signal وابسته‌اند به‌روز می‌شن.

```bash
npx degit solidjs/templates/ts my-solid
```

```tsx
import { createSignal, createMemo, createEffect, For, Show } from "solid-js";

function Counter() {
  const [count, setCount] = createSignal(0);
  const double = createMemo(() => count() * 2);

  createEffect(() => console.log("count:", count()));

  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count()} × ۲ = {double()}
    </button>
  );
}
```
نکته‌ی مهم: signal یک **تابع** است (`count()`، نه `count`).

### کنترل جریان
```tsx
<Show when={user()} fallback={<p>مهمان</p>}>
  {u => <p>{u().name}</p>}
</Show>

<For each={items()}>{item => <li>{item.name}</li>}</For>
```
از `For` به‌جای `.map` استفاده کن (کارآمدتر)، و props رو destructure نکن (reactivity از بین می‌ره).

### Store
```tsx
import { createStore } from "solid-js/store";
const [state, setState] = createStore({ todos: [] });
setState("todos", todos => [...todos, { text: "x" }]);
```
Meta-framework: **SolidStart**؛ router: `@solidjs/router`.

---

## مقایسه
| | Svelte | Solid | React |
|---|---|---|---|
| به‌روزرسانی | compiler | signals | VDOM diff |
| اجرای کامپوننت | یک‌بار | یک‌بار | هر رندر |
| سینتکس | الگوی خاص | JSX | JSX |
| `useEffect` dependency array | لازم نیست | لازم نیست | لازم |

## تمرین
۱. شمارنده و لیست کارها رو در Svelte یا Solid بنویس.
۲. مقایسه کن چقدر کد کمتری نسبت به React لازم شد.
