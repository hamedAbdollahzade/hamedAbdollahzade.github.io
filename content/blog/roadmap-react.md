---
title: React
description: کتابخانه‌ی UI از Meta. UI با کامپوننت‌های تابعی و JSX ساخته می‌شه.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 10
---

کتابخانه‌ی UI از Meta. UI با **کامپوننت‌های تابعی** و **JSX** ساخته می‌شه.

```bash
npm create vite@latest my-react -- --template react-ts
```

## JSX
```jsx
function Hello({ name }) {
  const items = ["a", "b"];
  return (
    <>
      <h1 className="title">سلام {name}!</h1>
      <p style={{ color: "red" }}>{1 + 1}</p>
      <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>
      {name ? <b>وارد شدی</b> : <i>مهمان</i>}
      {items.length > 0 && <span>{items.length} مورد</span>}
    </>
  );
}
```
قوانین: یک المان ریشه (یا Fragment `<>`)، `className` به‌جای `class`، `htmlFor` به‌جای `for`، attributeها camelCase، هر المان لیست **`key` یکتا**.

## Props
```jsx
function Card({ title, children, onClose }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
      <button onClick={onClose}>بستن</button>
    </div>
  );
}
<Card title="سلام" onClose={() => alert("x")}><p>محتوا</p></Card>
```
props فقط‌خواندنی‌اند و جریان داده **از بالا به پایین** است.

## State با useState
```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```
- state را **mutate نکن**؛ مقدار جدید بده:
```jsx
setUser({ ...user, name: "Ali" });
setList([...list, item]);
setList(list.filter(x => x.id !== id));
```
- به‌روزرسانی‌ها batch می‌شن و غیرهمزمان‌اند؛ برای وابسته به مقدار قبلی از تابع استفاده کن (`c => c + 1`).

## رویدادها و فرم
```jsx
function Form() {
  const [text, setText] = useState("");
  return (
    <form onSubmit={e => { e.preventDefault(); console.log(text); }}>
      <input value={text} onChange={e => setText(e.target.value)} />  {/* controlled */}
      <button>ارسال</button>
    </form>
  );
}
```

## useEffect (اثرات جانبی)
```jsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);       // cleanup
}, [dep]);                              // وقتی dep عوض شد دوباره اجرا
```
- `[]` فقط بعد از mount، بدون آرایه = بعد از هر رندر.
- برای **همگام‌سازی با سیستم بیرونی** (API، تایمر، رویداد DOM) است، نه برای محاسبه‌ی داده‌ی مشتق:
```jsx
const fullName = first + " " + last;     // ✅ مستقیم محاسبه کن، useEffect+state نیاز نیست
```
- در حالت Strict Mode در توسعه effectها دوبار اجرا می‌شن تا cleanup رو تست کنن.

### گرفتن داده
```jsx
useEffect(() => {
  const ctrl = new AbortController();
  fetch(`/api/users/${id}`, { signal: ctrl.signal })
    .then(r => r.json()).then(setUser).catch(() => {});
  return () => ctrl.abort();
}, [id]);
```
در پروژه‌ی واقعی از **TanStack Query** (یا SWR) استفاده کن: cache، retry، loading/error ([API](/blog/roadmap-rest-graphql/)).

## سایر Hookها
| Hook | کاربرد |
|---|---|
| `useRef` | مرجع به DOM یا مقدار تغییرپذیر بدون رندر مجدد |
| `useMemo` | کش محاسبه‌ی سنگین |
| `useCallback` | ثابت نگه داشتن مرجع تابع |
| `useReducer` | state پیچیده با reducer |
| `useContext` | داده‌ی سراسری بدون prop drilling |
| `useId` | شناسه‌ی یکتا |
| `useTransition` / `useDeferredValue` | UI روان با به‌روزرسانی کم‌اولویت |
| `use` | خواندن Promise/Context (React 19) |

```jsx
const inputRef = useRef(null);
<input ref={inputRef} />;  inputRef.current.focus();

const [state, dispatch] = useReducer(reducer, { count: 0 });
function reducer(s, a) {
  switch (a.type) {
    case "inc": return { count: s.count + 1 };
    default: return s;
  }
}
```
**قوانین Hook**: فقط در سطح بالای کامپوننت/Hook (نه داخل شرط یا حلقه) و فقط داخل کامپوننت یا Hook سفارشی.

### Context
```jsx
const ThemeCtx = createContext("light");
function App() { return <ThemeCtx value="dark"><Page /></ThemeCtx>; }  // React 19
function Page() { const theme = useContext(ThemeCtx); return <p>{theme}</p>; }
```
(در نسخه‌های قبل `<ThemeCtx.Provider value=...>`.)

### Custom Hook
```jsx
function useLocalStorage(key, initial) {
  const [v, setV] = useState(() => JSON.parse(localStorage.getItem(key)) ?? initial);
  useEffect(() => localStorage.setItem(key, JSON.stringify(v)), [key, v]);
  return [v, setV];
}
```

## الگوهای رایج
- **Lifting state up**: state را به نزدیک‌ترین والد مشترک ببر.
- **Composition**: با `children` ترکیب کن، نه ارث‌بری.
- **Conditional rendering**، **Lists + keys**، **Error Boundary**.
- `React.memo` فقط وقتی اندازه‌گیری نشان داد لازمه؛ **React Compiler** بسیاری از memoهای دستی رو خودکار می‌کنه.
- `lazy` + `Suspense` برای code splitting:
```jsx
const Chart = lazy(() => import("./Chart"));
<Suspense fallback={<p>...</p>}><Chart /></Suspense>
```

## مدیریت state
| ابزار | کجا |
|---|---|
| `useState`/`useReducer` + Context | state محلی/ساده |
| **Zustand**، Jotai | state سراسری سبک |
| **Redux Toolkit** | برنامه‌های بزرگ و پیچیده |
| **TanStack Query** | state سرور (داده‌ی API) |

```js
// Zustand
import { create } from "zustand";
const useStore = create(set => ({ n: 0, inc: () => set(s => ({ n: s.n + 1 })) }));
// در کامپوننت: const n = useStore(s => s.n);
```

## Routing (React Router)
```jsx
import { createBrowserRouter, RouterProvider, Link, Outlet, useParams } from "react-router";

const router = createBrowserRouter([
  { path: "/", element: <Layout />, children: [
      { index: true, element: <Home /> },
      { path: "users/:id", element: <User /> },
  ]},
]);
function User() { const { id } = useParams(); return <h1>{id}</h1>; }
<RouterProvider router={router} />;
```
Link: `<Link to="/users/5">`. Loader/Action و SSR هم پشتیبانی می‌شن (حالت framework).

## استایل
CSS Modules، Tailwind ([Tailwind](/blog/roadmap-tailwind-and-design-systems/))، styled-components/Emotion، vanilla-extract.

## Server Components (مرور)
در فریم‌ورک‌هایی مثل Next.js: کامپوننت‌هایی که فقط روی سرور اجرا می‌شن، مستقیماً به DB دسترسی دارن و JS برای کلاینت نمی‌فرستن؛ برای تعامل از `"use client"` استفاده می‌شه ([meta-frameworks-ssr-ssg](/blog/roadmap-meta-frameworks-ssr-ssg/)).

## تمرین
۱. لیست کارها: افزودن، حذف، فیلتر، ذخیره در localStorage.
۲. یک Custom Hook `useFetch(url)` با loading/error.
۳. برنامه‌ی دو صفحه‌ای با React Router و context تم تیره/روشن.
