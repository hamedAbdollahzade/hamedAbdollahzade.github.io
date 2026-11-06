---
title: TypeScript: پیشرفته
description: TypeScript: پیشرفته؛ آموزش مسیر فرانت‌اند به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 8
---

## Generics
نوع‌های پارامتری، برای کدی که روی نوع‌های مختلف کار می‌کنه.
```ts
function first<T>(arr: T[]): T | undefined { return arr[0]; }
first([1, 2]);        // number | undefined
first(["a"]);         // string | undefined

interface ApiResponse<T> { data: T; error?: string }
const r: ApiResponse<{ id: number }> = { data: { id: 1 } };

// محدودیت
function len<T extends { length: number }>(x: T) { return x.length; }
len("abc"); len([1, 2]);

// مقدار پیش‌فرض
type Box<T = string> = { value: T };
```

## keyof، typeof، indexed access
```ts
type User = { id: number; name: string };
type Keys = keyof User;                  // "id" | "name"
type Name = User["name"];                // string

function get<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }
get({ a: 1, b: "x" }, "b");              // string

const config = { port: 3000, host: "x" };
type Config = typeof config;             // { port: number; host: string }
```

## Utility Types
```ts
type U = { id: number; name: string; email?: string };

Partial<U>            // همه اختیاری
Required<U>           // همه اجباری
Readonly<U>           // همه فقط‌خواندنی
Pick<U, "id" | "name">      // انتخاب
Omit<U, "email">            // حذف
Record<"a" | "b", number>   // { a: number; b: number }
Exclude<"a" | "b", "a">     // "b"
Extract<string | number, number>  // number
NonNullable<string | null>  // string
ReturnType<typeof fn>       // نوع خروجی تابع
Parameters<typeof fn>       // tuple پارامترها
Awaited<Promise<string>>    // string
```

## Mapped Types
```ts
type Flags<T> = { [K in keyof T]: boolean };
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
type Mutable<T> = { -readonly [K in keyof T]-?: T[K] };   // حذف readonly و ?
```

## Conditional Types و infer
```ts
type IsString<T> = T extends string ? true : false;
type A = IsString<"x">;     // true

type ElementOf<T> = T extends (infer E)[] ? E : never;
type N = ElementOf<number[]>;     // number

type Unwrap<T> = T extends Promise<infer R> ? R : T;
```

## Template Literal Types
```ts
type Event = "click" | "focus";
type Handler = `on${Capitalize<Event>}`;    // "onClick" | "onFocus"
type Route = `/users/${number}`;
```

## Type Guards
```ts
function isString(x: unknown): x is string { return typeof x === "string"; }

function assertDefined<T>(x: T | undefined): asserts x is T {
  if (x === undefined) throw new Error("undefined!");
}
```

## satisfies
چک نوع بدون از دست دادن نوع دقیق مقدار:
```ts
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
} satisfies Record<string, string | number[]>;

palette.red.map(n => n);       // هنوز آرایه است
palette.green.toUpperCase();   // هنوز رشته است
```

## Overload
```ts
function parse(x: string): number;
function parse(x: number): string;
function parse(x: string | number) { return typeof x === "string" ? Number(x) : String(x); }
```

## Module و Declaration
```ts
import type { User } from "./types";      // فقط نوع، در JS حذف می‌شه
export type { User };

declare module "*.svg" { const url: string; export default url; }   // نوع برای import فایل

declare global { interface Window { dataLayer: unknown[] } }
```

## الگوهای کاربردی در فرانت‌اند
```ts
// نوع props در React
type ButtonProps = {
  variant?: "primary" | "ghost";
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & React.ComponentPropsWithoutRef<"button">;

// نوع‌دار کردن fetch
async function api<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(String(res.status));
  return res.json() as Promise<T>;
}
```
`res.json()` اعتبارسنجی نمی‌کنه؛ برای داده‌ی خارجی از **Zod / Valibot** استفاده کن:
```ts
import { z } from "zod";
const UserSchema = z.object({ id: z.number(), name: z.string() });
type User = z.infer<typeof UserSchema>;
const user = UserSchema.parse(await res.json());   // خطا اگه شکل داده اشتباه باشه
```

## نکات
- `strict` روشن، `any` ممنوع (از `unknown` استفاده کن).
- نوع‌ها رو از داده‌ها استنتاج کن (`typeof`, `z.infer`) به‌جای تکرار.
- پیام‌های خطای TS رو از **آخرین خط** بخون.
- TS فقط compile-time است؛ validation زمان اجرا جداست.

## تمرین
۱. `DeepPartial<T>` بنویس.
۲. تابع `pluck<T, K extends keyof T>(arr: T[], key: K): T[K][]` رو پیاده کن.
۳. با Zod پاسخ یک API واقعی رو اعتبارسنجی کن.
