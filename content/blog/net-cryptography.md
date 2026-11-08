---
title: رمزنگاری (Cryptography)
description: رمزنگاری (Cryptography)؛ Hash، رمزنگاری متقارن و نامتقارن، RSA، ECDSA، Ed25519، AES، ChaCha20، TLS
date: 2026-11-08
category: شبکه و امنیت
order: 3
---

رمزنگاری سه هدف اصلی دارد:

- **Confidentiality (محرمانگی):** فقط گیرنده‌ی مجاز داده را بخواند.
- **Integrity (یکپارچگی):** داده در مسیر تغییر نکرده باشد.
- **Authentication (احراز هویت):** طرف مقابل همان کسی باشد که ادعا می‌کند.

> قاعده‌ی طلایی: **رمزنگاری خودساخته ننویس.** از کتابخانه‌های معتبر (OpenSSL، libsodium، Web Crypto API) استفاده کن.

## سطح ۱: مبتدی — Hash، Encoding و Encryption

### Encoding ≠ Encryption ≠ Hash

| مفهوم | هدف | قابل برگشت؟ | مثال |
|---|---|---|---|
| Encoding | نمایش داده | بله، بدون کلید | Base64 |
| Encryption | محرمانگی | بله، با کلید | AES |
| Hash | اثرانگشت داده | خیر | SHA-256 |

```bash
echo -n "hello" | base64                  # Encoding: aGVsbG8=
echo -n "hello" | sha256sum               # Hash
echo -n "hello" | md5sum                  # MD5 (فقط برای آشنایی؛ ناامن است)
```

### Hash

تابع یک‌طرفه که ورودی هر اندازه‌ای را به خروجی ثابت تبدیل می‌کند. ویژگی‌ها:

- **Deterministic:** ورودی یکسان، خروجی یکسان.
- **Avalanche:** تغییر کوچک ورودی، خروجی کاملاً متفاوت.
- **Collision-resistant:** یافتن دو ورودی با هش یکسان سخت است.

| الگوریتم | وضعیت |
|---|---|
| MD5 | شکسته؛ فقط برای checksum غیرامنیتی |
| SHA-1 | شکسته؛ نباید استفاده شود |
| SHA-256 / SHA-3 | امن و رایج |
| BLAKE2 / BLAKE3 | سریع و امن |

```bash
sha256sum ubuntu.iso                      # بررسی یکپارچگی فایل دانلودی
```

### Password Hashing

برای رمز عبور از هش ساده استفاده نکن؛ از الگوریتم‌های کند با salt استفاده کن:
**bcrypt، scrypt، Argon2id**.

## سطح ۲: متوسط — رمزنگاری متقارن و نامتقارن

### رمزنگاری متقارن (Symmetric)

یک کلید برای رمزگذاری و رمزگشایی.

- **AES-256-GCM:** استاندارد رایج؛ رمزنگاری + احراز یکپارچگی (AEAD).
- **ChaCha20-Poly1305:** جایگزین سریع، مناسب موبایل و سخت‌افزارهای بدون AES.

```bash
# رمزنگاری فایل با AES-256-CBC و PBKDF2 (فقط برای تمرین؛ GCM ترجیح دارد)
openssl enc -aes-256-cbc -pbkdf2 -salt -in secret.txt -out secret.enc
openssl enc -d -aes-256-cbc -pbkdf2 -in secret.enc -out secret.txt
```

مشکل اصلی: **توزیع امن کلید**. اینجا نامتقارن وارد می‌شود.

### رمزنگاری نامتقارن (Asymmetric)

دو کلید: **کلید عمومی (Public)** برای رمزنگاری یا تأیید، و **کلید خصوصی (Private)** برای رمزگشایی یا امضا.

| الگوریتم | نوع | نکته |
|---|---|---|
| RSA-2048 / 3072 | رمزنگاری و امضا | قدیمی‌تر؛ کلید بزرگ |
| ECDSA (P-256) | امضا | رایج در TLS و JWT |
| Ed25519 | امضا | سریع، امن، کلید کوچک؛ انتخاب پیشنهادی امروز |
| X25519 | تبادل کلید (ECDH) | در TLS 1.3 و WireGuard |

### کلید SSH با Ed25519

```bash
ssh-keygen -t ed25519 -C "laptop-key"    # ساخت جفت کلید
ls ~/.ssh/                               # id_ed25519 (خصوصی) و id_ed25519.pub (عمومی)
ssh-copy-id user@server                  # کپی کلید عمومی روی سرور
```

> کلید خصوصی را هرگز به اشتراک نگذار. اجازه‌ی فایل: `chmod 600 ~/.ssh/id_ed25519`.

### امضای دیجیتال

فرستنده با کلید خصوصی امضا می‌کند؛ هر کسی با کلید عمومی تأیید می‌کند که داده تغییر نکرده و از او است.

```bash
# ساخت کلید Ed25519 با OpenSSL و امضای فایل
openssl genpkey -algorithm ed25519 -out priv.pem
openssl pkey -in priv.pem -pubout -out pub.pem
openssl pkeyutl -sign -inkey priv.pem -rawin -in message.txt -out message.sig
openssl pkeyutl -verify -pubin -inkey pub.pem -rawin -in message.txt -sigfile message.sig
```

## سطح ۳: پیشرفته — TLS، PKI و Forward Secrecy

### Key Exchange: Diffie-Hellman

دو طرف بدون ارسال کلید مخفی، یک کلید مشترک می‌سازند. در TLS 1.3 از **ECDHE** (تبادل کلید بیضوی موقت) استفاده می‌شود.

**Forward Secrecy:** اگر کلید دائمی سرور در آینده لو برود، ترافیک قدیمی هنوز امن است چون کلید نشست موقت بوده.

### PKI و گواهی (Certificate)

- **CA (Certificate Authority):** نهاد مورد اعتماد که گواهی را امضا می‌کند.
- **Certificate X.509:** شامل نام دامنه، کلید عمومی، تاریخ انقضا و امضای CA.
- **Chain of trust:** گواهی سرور ← گواهی واسط ← Root CA که در سیستم نصب است.

```bash
# مشاهده‌ی گواهی یک سرور
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates

# مشاهده‌ی زنجیره‌ی گواهی
openssl s_client -connect example.com:443 -showcerts </dev/null
```

### ساخت CA و گواهی self-signed (آزمایشی)

```bash
# کلید و گواهی self-signed برای تست داخلی
openssl req -x509 -newkey ed25519 -nodes -keyout key.pem -out cert.pem \
  -days 365 -subj "/CN=test.local"
```

> گواهی self-signed فقط برای تست یا شبکه‌ی داخلی کنترل‌شده است. برای سایت عمومی از Let's Encrypt (با `certbot`) استفاده کن.

### TLS 1.3 در یک نگاه

1. ClientHello: کلاینت لیست cipher suite و share کلید X25519 را می‌فرستد.
2. ServerHello: سرور انتخاب و کلید خودش را می‌فرستد؛ از این لحظه رمزنگاری شروع می‌شود.
3. گواهی سرور و امضای تأیید با کلید خصوصی ارسال می‌شود.
4. اتصال با کلید نشست (session key) مشترک و رمزنگاری AEAD ادامه می‌یابد.

**تفاوت با TLS 1.2:** handshake سریع‌تر (1-RTT)، حذف الگوریتم‌های ضعیف، و الزام Forward Secrecy.

```bash
openssl s_client -connect example.com:443 -tls1_3 </dev/null 2>/dev/null | grep -E "Protocol|Cipher"
```

### خلاصه‌ی انتخاب الگوریتم‌ها (امروز)

| کاربرد | پیشنهاد |
|---|---|
| Hash | SHA-256، SHA-3، BLAKE2 |
| رمز عبور | Argon2id، bcrypt |
| رمزنگاری متقارن | AES-256-GCM یا ChaCha20-Poly1305 |
| امضا | Ed25519 یا ECDSA P-256 |
| تبادل کلید | X25519 (ECDHE) |
| پروتکل | TLS 1.3 |

### الگوریتم‌هایی که نباید استفاده شوند

MD5، SHA-1، DES، 3DES، RC4، RSA با کلید ۱۰۲۴ بیت، TLS 1.0 و 1.1، و هر حالت ECB.
