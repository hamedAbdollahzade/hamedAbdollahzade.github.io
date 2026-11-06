---
title: Angular
description: فریم‌ورک کامل از Google بر پایه‌ی TypeScript؛ routing، فرم، HTTP، DI و تست همگی داخل خودش هست.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 12
---

فریم‌ورک کامل از Google بر پایه‌ی **TypeScript**؛ routing، فرم، HTTP، DI و تست همگی داخل خودش هست.

```bash
npm i -g @angular/cli
ng new my-app
cd my-app && ng serve        # http://localhost:4200
ng generate component user-card
ng build
ng test
```

## ساختار
- **Component**: کلاس + template + استایل
- **Service**: منطق/داده‌ی مشترک (با Dependency Injection)
- **Route**: مسیرها
- Angular مدرن: **standalone components** (بدون NgModule) و **Signals**.

## Component
```ts
import { Component, signal, computed } from "@angular/core";

@Component({
  selector: "app-counter",
  standalone: true,
  template: `
    <button (click)="inc()">{{ count() }}</button>
    <p>دو برابر: {{ double() }}</p>
  `,
  styles: [`button { padding: .5rem 1rem; }`],
})
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);
  inc() { this.count.update(n => n + 1); }
}
```

## Signals
```ts
const n = signal(0);
n();                 // خواندن
n.set(5);
n.update(v => v + 1);
const d = computed(() => n() * 2);
effect(() => console.log(n()));       // اثر جانبی
```

## Template
```html
<p>{{ title }}</p>
<img [src]="url" [alt]="desc" />                 <!-- property binding -->
<button (click)="save()">ذخیره</button>          <!-- event binding -->
<input [(ngModel)]="name" />                     <!-- two-way (FormsModule) -->
<div [class.active]="isActive" [style.color]="color"></div>

@if (user) {
  <p>{{ user.name }}</p>
} @else {
  <p>مهمان</p>
}

@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>خالی</li>
}

@switch (status) {
  @case ('ok') { <b>موفق</b> }
  @default { <i>نامشخص</i> }
}
```
(سینتکس control flow جدید `@if/@for`؛ قدیمی: `*ngIf`, `*ngFor`.)

## Input / Output
```ts
import { input, output } from "@angular/core";

export class CardComponent {
  title = input.required<string>();     // Input signal
  closed = output<void>();               // Output
}
```
```html
<app-card title="سلام" (closed)="onClose()" />
```

## Dependency Injection و Service
```ts
@Injectable({ providedIn: "root" })
export class UserService {
  private http = inject(HttpClient);
  getUsers() { return this.http.get<User[]>("/api/users"); }
}

@Component({ /* ... */ })
export class UsersComponent {
  private svc = inject(UserService);
  users = toSignal(this.svc.getUsers(), { initialValue: [] });
}
```
تنظیم HTTP: `provideHttpClient()` در `app.config.ts`.

## RxJS
Angular از **Observable** استفاده می‌کند (HTTP، فرم، router).
```ts
import { of, fromEvent, debounceTime, map, switchMap, catchError } from "rxjs";

search$.pipe(
  debounceTime(300),
  switchMap(q => this.http.get<Item[]>(`/api/search?q=${q}`)),
  catchError(() => of([])),
).subscribe(items => this.items = items);
```
در template: `{{ data$ | async }}` یا `toSignal()` برای unsubscribe خودکار.

## Router
```ts
export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "users/:id", component: UserComponent },
  { path: "admin", loadComponent: () => import("./admin.component").then(m => m.AdminComponent), canActivate: [authGuard] },
  { path: "**", component: NotFoundComponent },
];
```
```html
<a routerLink="/users/5">کاربر</a>
<router-outlet />
```

## فرم‌ها
```ts
form = new FormGroup({
  email: new FormControl("", [Validators.required, Validators.email]),
  password: new FormControl("", [Validators.required, Validators.minLength(8)]),
});
submit() { if (this.form.valid) console.log(this.form.value); }
```
```html
<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="email" />
  @if (form.controls.email.errors?.['email']) { <small>ایمیل نامعتبر</small> }
  <button [disabled]="form.invalid">ورود</button>
</form>
```
**Reactive Forms** برای فرم‌های جدی توصیه می‌شن؛ **Template-driven** (`ngModel`) برای ساده.

## Pipe و Directive
```html
{{ price | currency }} {{ date | date:'short' }} {{ text | uppercase }}
```
```ts
@Pipe({ name: "truncate", standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(v: string, n = 20) { return v.length > n ? v.slice(0, n) + "…" : v; }
}
```
Directive: `@Directive({ selector: "[appHighlight]" })`.

## Lifecycle
`ngOnInit`, `ngOnChanges`, `ngOnDestroy`, `ngAfterViewInit` (و `DestroyRef` برای cleanup).

## تست
Jasmine/Karma یا Jest/Vitest؛ `TestBed` برای کامپوننت‌ها؛ Playwright/Cypress برای E2E ([E2E](/blog/roadmap-e2e-cypress-playwright/)).

## SSR
`ng add @angular/ssr` برای رندر سمت سرور و hydration ([meta-frameworks-ssr-ssg](/blog/roadmap-meta-frameworks-ssr-ssg/)).

## تمرین
۱. برنامه‌ی لیست کار با signals و سرویس.
۲. فرم ثبت‌نام با Reactive Forms و اعتبارسنجی.
۳. جستجوی زنده با RxJS (`debounceTime` + `switchMap`).
