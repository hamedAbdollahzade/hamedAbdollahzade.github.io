---
title: TypeScript: مبانی
description: TypeScript = JavaScript + سیستم نوع ایستا. کد TS کامپایل (یا با ابزارهایی مثل Vite/esbuild "strip") می‌شه و به JS تبدیل می‌شه؛ نوع‌ها در زمان اجرا وجود ندارن.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 7
---

TypeScript = JavaScript + **سیستم نوع ایستا**. کد TS کامپایل (یا با ابزارهایی مثل Vite/esbuild "strip") می‌شه و به JS تبدیل می‌شه؛ نوع‌ها در زمان اجرا وجود ندارن.

```bash
npm i -D typescript
npx tsc --init          # tsconfig.json
npx tsc                 # بررسی و کامپایل
npx tsc --noEmit        # فقط بررسی نوع
```

## نوع‌های پایه
```ts
let name: string = "Ali";
let age: number = 30;
let ok: boolean = true;
let big: bigint = 10n;
let nothing: null = null;
let nope: undefined = undefined;
let id: symbol = Symbol("id");

let nums: number[] = [1, 2, 3];
let names: Array<string> = ["a", "b"];
let pair: [string, number] = ["age", 30];     // tuple
```
Type Inference: لازم نیست همه‌جا بنویسی.
```ts
let x = 5;          // number استنباط می‌شه
const y = "hi";     // نوع literal "hi"
```

## any، unknown، never، void
```ts
let a: any = 1;          // خاموش‌کردن چک نوع (پرهیز)
let u: unknown = fetchIt();
// u.toUpperCase();      // ❌ باید اول چک کنی
if (typeof u === "string") u.toUpperCase();   // ✅

function fail(msg: string): never { throw new Error(msg); }   // هرگز برنمی‌گرده
function log(): void { console.log("x"); }
```
`unknown` جایگزین امن `any` است.

## توابع
```ts
function add(a: number, b: number): number { return a + b; }
const mul = (a: number, b: number): number => a * b;

function greet(name: string, greeting?: string) {        // اختیاری
  return `${greeting ?? "Hi"} ${name}`;
}
function pow(base: number, exp = 2) { return base ** exp; }  // پیش‌فرض
function sum(...nums: number[]) { return nums.reduce((a, b) => a + b, 0); }
```

## Object، Interface و Type alias
```ts
interface User {
  readonly id: number;
  name: string;
  email?: string;               // اختیاری
}

type Point = { x: number; y: number };

const u: User = { id: 1, name: "Sara" };
// u.id = 2;   // ❌ readonly
```
تفاوت: interface قابل `extends` و declaration merging؛ `type` برای union و ترکیب‌های پیچیده. هر دو برای شیء قابل‌استفاده‌اند.

```ts
interface Admin extends User { role: "admin" }
type WithDate = User & { createdAt: Date };      // intersection
```

## Union و Literal
```ts
type Id = string | number;
type Status = "idle" | "loading" | "error" | "success";

function show(id: Id) {
  if (typeof id === "string") return id.toUpperCase();   // narrowing
  return id.toFixed(2);
}
```

### Narrowing
```ts
function f(x: string | string[] | null) {
  if (x == null) return;                 // حذف null
  if (Array.isArray(x)) return x.join();
  return x.toUpperCase();
}
"name" in obj                             // in
x instanceof Date                         // instanceof
```

### Discriminated Union (الگوی بسیار کاربردی)
```ts
type Result =
  | { status: "ok"; data: string }
  | { status: "error"; message: string };

function handle(r: Result) {
  switch (r.status) {
    case "ok": return r.data;
    case "error": return r.message;
  }
}
```

## Enum و as const
```ts
enum Dir { Up, Down }                      // مقدار عددی
const ROLES = ["admin", "user"] as const;  // tuple فقط‌خواندنی با literalها
type Role = (typeof ROLES)[number];        // "admin" | "user"
```
امروز اغلب `as const` + union به enum ترجیح داده می‌شه.

## Type Assertion
```ts
const el = document.querySelector("#a") as HTMLInputElement;
el.value = "x";
const el2 = document.querySelector<HTMLInputElement>("#a");   // generic
const nonNull = el2!;                      // non-null assertion (با احتیاط)
```

## Class
```ts
class Account {
  readonly id: number;
  private balance = 0;
  protected owner: string;
  constructor(id: number, owner: string) { this.id = id; this.owner = owner; }
  deposit(n: number) { this.balance += n; }
}
// کوتاه‌تر:
class P { constructor(public name: string, private age: number) {} }
```
`public / private / protected / readonly`، و `implements` برای تطبیق با interface. (دربارهی `class` در JS: [Prototype و Class](/blog/js-prototypes-and-classes/))

## tsconfig.json مهم
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "outDir": "dist"
  },
  "include": ["src"]
}
```
**`strict: true`** رو همیشه روشن بذار.

## فایل‌های تعریف نوع
```bash
npm i -D @types/node        # نوع‌های کتابخانه‌هایی که خودشون TS ندارن
```
`.d.ts` فقط نوع می‌گیره. بسیاری از کتابخانه‌ها نوع‌ها را خودشون می‌فرستن.

## تمرین
۱. نوع `Product` و تابعی بنویس که لیست محصولات رو بر اساس قیمت مرتب کنه.
۲. یک discriminated union برای نتیجه‌ی API بنویس.
۳. یک پروژه‌ی JS کوچک رو به TS تبدیل کن.

ادامه: [TypeScript پیشرفته](/blog/roadmap-typescript-advanced/)
