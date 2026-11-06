---
title: احراز هویت و مجوز (Authentication & Authorization)
description: احراز هویت و مجوز (Authentication & Authorization)؛ آموزش مسیر فرانت‌اند به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 21
---

- **Authentication (AuthN)**: تو که هستی؟ (لاگین)
- **Authorization (AuthZ)**: اجازه‌ی انجام چه کاری را داری؟ (نقش/دسترسی)

## روش‌های رایج
| روش | توضیح |
|---|---|
| **Session + Cookie** | سرور session نگه می‌دارد، مرورگر `session id` را در کوکی می‌فرستد |
| **Token-based (JWT)** | سرور توکن امضاشده می‌دهد؛ کلاینت در هر درخواست می‌فرستد |
| **OAuth 2.0 / OIDC** | ورود با Google/GitHub و ...؛ تفویض دسترسی بدون دادن رمز |
| **SSO** | یک‌بار ورود برای چند سامانه (SAML، OIDC) |
| **Basic Auth** | `Authorization: Basic base64(user:pass)` (فقط با HTTPS، ساده) |
| **API Key** | کلید ثابت برای سرویس‌ها |
| **Passkeys / WebAuthn** | ورود بدون رمز با بیومتریک/کلید سخت‌افزاری |
| **MFA / 2FA** | عامل دوم (TOTP، SMS، کلید) |

## Session-based
```text
1. POST /login (email+password)
2. سرور: session می‌سازد، Set-Cookie: sid=abc; HttpOnly; Secure; SameSite=Lax
3. مرورگر در هر درخواست cookie را خودکار می‌فرستد
4. POST /logout → session حذف
```
- ✅ ابطال آسان، کوکی HttpOnly امن‌تر در برابر XSS
- ❌ نیازمند ذخیره‌ی session در سرور (یا Redis) و محافظت CSRF
- در فرانت‌اند: `fetch(url, { credentials: "include" })`

## JWT (JSON Web Token)
ساختار: `header.payload.signature` (Base64URL)
```json
// payload
{ "sub": "123", "role": "admin", "exp": 1735689600 }
```
- **امضاشده است، رمزنگاری‌نشده**: هرکسی payload را می‌خواند؛ چیز حساس در آن نگذار.
- سرور امضا را با کلید بررسی می‌کند (stateless).
```js
fetch("/api/me", { headers: { Authorization: `Bearer ${accessToken}` } });
```

### Access و Refresh Token
- **Access token**: کوتاه‌مدت (۵–۱۵ دقیقه)
- **Refresh token**: بلندمدت، برای گرفتن access جدید، بهتر است در کوکی `HttpOnly`
- ابطال JWT سخت است ← expiry کوتاه + rotation + لیست ابطال در صورت نیاز

### کجا ذخیره کنیم؟
| محل | XSS | CSRF |
|---|---|---|
| `localStorage` | ❌ قابل سرقت | ✅ ایمن |
| کوکی `HttpOnly` + `SameSite` | ✅ ایمن از خواندن JS | با SameSite/CSRF-token مدیریت |
| حافظه‌ی JS (متغیر) | نسبتاً امن | ✅ (با refresh در کوکی) |

توصیه‌ی رایج: access در حافظه + refresh در کوکی HttpOnly، یا مستقیماً session کوکی.

### رفرش خودکار
```js
async function api(url, opts = {}) {
  let res = await fetch(url, { ...opts, credentials: "include" });
  if (res.status === 401) {
    const r = await fetch("/auth/refresh", { method: "POST", credentials: "include" });
    if (r.ok) res = await fetch(url, { ...opts, credentials: "include" });
    else location.href = "/login";
  }
  return res;
}
```

## OAuth 2.0 و OpenID Connect
OAuth 2.0 = **تفویض دسترسی**؛ OIDC = لایه‌ی هویت روی OAuth.
جریان **Authorization Code + PKCE** (توصیه‌شده برای SPA و موبایل):
```text
1. اپ کاربر را به Google می‌فرستد (client_id, redirect_uri, scope, code_challenge)
2. کاربر لاگین و رضایت می‌دهد
3. Google به redirect_uri برمی‌گرداند با ?code=…
4. اپ (ترجیحاً بک‌اند) code + code_verifier را با token عوض می‌کند
5. اپ access token (و id token) می‌گیرد
```
- `state` برای جلوگیری از CSRF
- Implicit flow منسوخ است.
- کتابخانه‌ها: Auth.js (NextAuth)، Auth0، Clerk، Supabase Auth، Firebase Auth، Keycloak — خودت پیاده نکن.

## مجوز (Authorization)
- **RBAC**: نقش‌ها (`admin`, `editor`, `user`)
- **ABAC**: بر اساس ویژگی‌ها
- در فرانت‌اند فقط **UI** را شرطی کن؛ **اجبار واقعی در سرور**.
```jsx
{user.role === "admin" && <AdminPanel />}      // فقط تجربه‌ی کاربری، امنیت نیست!
```

### محافظت از مسیرها (Route Guard)
```jsx
function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
}
```

## ذخیره‌ی رمز (در بک‌اند)
هرگز متن ساده؛ با **argon2** یا **bcrypt** و salt هش کن. سیاست رمز: حداقل طول، بررسی نشت (Have I Been Pwned)، rate limit برای لاگین.

## نکات فرانت‌اند
- فرم لاگین: `autocomplete="username"` / `current-password` / `new-password`، `type="password"`
- پیام خطای عمومی («ایمیل یا رمز اشتباه است»)
- نمایش/پنهان رمز، دسترس‌پذیری
- پاک‌سازی state و کش هنگام logout
- هرگز رمز یا توکن را لاگ نکن یا در URL قرار نده.

## تمرین
۱. جریان لاگین با کوکی HttpOnly (یک API ساده با Express) و محافظ مسیر در React.
۲. توکن JWT را در jwt.io رمزگشایی کن و ببین چه چیزی در payload هست.
۳. «ورود با GitHub» را با یک کتابخانه‌ی آماده اضافه کن.
