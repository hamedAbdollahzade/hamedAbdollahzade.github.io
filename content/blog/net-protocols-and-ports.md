---
title: پروتکل‌ها و پورت‌ها
description: پروتکل‌ها و پورت‌ها؛ TCP، UDP، HTTP/HTTPS، DNS، DHCP، SSH، ICMP، ARP و جدول پورت‌ها
date: 2026-11-08
category: شبکه و امنیت
order: 2
---

## پروتکل چیست؟

پروتکل مجموعه‌ای از قوانین است که مشخص می‌کند دو طرف چطور پیام بفرستند و پاسخ بدهند. مثال روزمره: HTTP قوانین وب است.

## TCP و UDP (لایه ترنسپورت)

| ویژگی | TCP | UDP |
|---|---|---|
| اتصال | Connection-oriented (سه‌مرحله‌ای: SYN، SYN-ACK، ACK) | Connectionless |
| تضمین تحویل | بله (retransmission) | خیر |
| ترتیب بسته‌ها | حفظ می‌شود | حفظ نمی‌شود |
| سرعت و تأخیر | کندتر، قابل‌اعتماد | سریع‌تر، تأخیر کم |
| کاربرد | وب، ایمیل، SSH، دیتابیس | DNS، ویدیو زنده، بازی، VoIP، WireGuard |

### Three-way handshake

```
Client → Server:  SYN
Server → Client:  SYN-ACK
Client → Server:  ACK    (اتصال برقرار شد)
```

### TCP State

```bash
ss -tan                       # وضعیت اتصال‌های TCP (ESTABLISHED، LISTEN، TIME-WAIT و...)
ss -tan state established     # فقط اتصال‌های فعال
```

## پورت‌ها

- **Well-known (0–1023):** سرویس‌های استاندارد؛ نیاز به root برای listen.
- **Registered (1024–49151):** برنامه‌های کاربردی.
- **Dynamic / Ephemeral (49152–65535):** پورت موقت سمت کلاینت.

### جدول پورت‌های مهم

| پورت | پروتکل | سرویس |
|---|---|---|
| 20/21 | TCP | FTP (داده/کنترل) |
| 22 | TCP | SSH |
| 23 | TCP | Telnet (ناامن، امروز استفاده نشود) |
| 25 | TCP | SMTP (ارسال ایمیل) |
| 53 | TCP/UDP | DNS |
| 67/68 | UDP | DHCP |
| 80 | TCP | HTTP |
| 110 / 995 | TCP | POP3 / POP3S |
| 123 | UDP | NTP (زمان) |
| 143 / 993 | TCP | IMAP / IMAPS |
| 443 | TCP/UDP | HTTPS (TLS)؛ UDP برای HTTP/3 |
| 465 / 587 | TCP | SMTPS / Submission |
| 3306 | TCP | MySQL / MariaDB |
| 5432 | TCP | PostgreSQL |
| 6379 | TCP | Redis |
| 27017 | TCP | MongoDB |
| 51820 | UDP | WireGuard (پیش‌فرض) |

## HTTP و HTTPS

### متدها

| متد | کاربرد |
|---|---|
| GET | دریافت داده |
| POST | ارسال داده / ایجاد |
| PUT | جایگزینی کامل |
| PATCH | تغییر بخشی |
| DELETE | حذف |

### کدهای وضعیت

| کد | معنی |
|---|---|
| 200 | موفق |
| 301 / 302 | انتقال دائم / موقت |
| 400 | درخواست نامعتبر |
| 401 | احراز هویت لازم |
| 403 | دسترسی ممنوع |
| 404 | پیدا نشد |
| 500 | خطای سرور |
| 502 / 503 | Gateway خراب / سرویس در دسترس نیست |

### تفاوت HTTP/1.1، HTTP/2 و HTTP/3

- **HTTP/1.1:** متنی، یک درخواست در هر اتصال (با keep-alive).
- **HTTP/2:** باینری، چند استریم روی یک اتصال TCP، فشرده‌سازی هدر.
- **HTTP/3:** روی QUIC (UDP)، حذف head-of-line blocking در سطح TCP.

```bash
curl -I https://example.com           # فقط هدرها
curl -v https://example.com           # جزئیات TLS و هدرها
curl --http2 -I https://example.com   # درخواست با HTTP/2
```

## DNS

دامنه را به IP تبدیل می‌کند. ساختار سلسله‌مراتبی: root → TLD (`.com`) → دامنه (`example.com`) → رکورد (`www`).

| نوع رکورد | کاربرد |
|---|---|
| A | دامنه → IPv4 |
| AAAA | دامنه → IPv6 |
| CNAME | نام مستعار |
| MX | سرور ایمیل |
| TXT | متن (SPF، DKIM، تأیید دامنه) |
| NS | سرورهای نام دامنه |

```bash
dig example.com A +short              # رکورد A
dig example.com MX
dig @1.1.1.1 example.com              # پرسش از سرور DNS مشخص
dig +trace example.com                # مسیر کامل resolve
resolvectl status                     # DNS فعلی سیستم (systemd-resolved)
```

### DNS over HTTPS / TLS

DNS معمولی متنی و قابل شنود است. DoH (پورت 443) و DoT (پورت 853) آن را رمزنگاری می‌کنند.

## DHCP

دستگاه‌ها IP، Gateway و DNS را خودکار می‌گیرند. فرایند DORA:

1. **Discover:** کلاینت (broadcast) می‌پرسد.
2. **Offer:** سرور IP پیشنهاد می‌دهد.
3. **Request:** کلاینت آن را درخواست می‌کند.
4. **Acknowledge:** سرور تأیید می‌کند.

```bash
sudo dhclient -v enp3s0               # تمدید دستی (در صورت استفاده از dhclient)
networkctl status enp3s0              # وضعیت اینترفیس با systemd-networkd
```

## ICMP

پیام‌های کنترلی شبکه؛ ping و traceroute از آن استفاده می‌کنند.

```bash
ping -c 4 8.8.8.8
traceroute 8.8.8.8                    # نیاز به sudo apt install traceroute
tracepath 8.8.8.8                     # بدون نیاز به root
```

## ARP

IP را به MAC در شبکه‌ی محلی تبدیل می‌کند. نقطه‌ی ضعف: ARP spoofing که در LAN امکان شنود می‌دهد.

```bash
ip neigh show                         # جدول ARP
```

## SSH

ارتباط امن و رمزنگاری‌شده با سرور (پورت 22). جزئیات امن‌سازی در فایل امنیت سرور آمده است.

```bash
ssh user@192.168.1.50
ssh -p 2222 user@server               # پورت سفارشی
ssh -L 8080:localhost:80 user@server  # Port forwarding محلی
ssh -D 1080 user@server               # SOCKS proxy
```

## ابزار بررسی پورت‌ها

```bash
sudo ss -tulpn                        # پورت‌های listen همراه برنامه
nmap -sT 192.168.1.1                  # اسکن TCP connect
nmap -p 22,80,443 example.com         # اسکن پورت‌های مشخص
nmap -sV -p 22 192.168.1.50          # تشخیص نسخه‌ی سرویس
```

> اسکن nmap را فقط روی سیستم‌های خودت یا با اجازه‌ی کتبی انجام بده.

## پیشرفته: QUIC، MTU و Fragmentation

- **QUIC:** پروتکل ترنسپورت روی UDP که رمزنگاری TLS 1.3 را داخلش دارد و اتصال سریع‌تری می‌دهد.
- **Fragmentation:** بسته‌های بزرگ‌تر از MTU تکه می‌شوند. در VPN، اگر MTU اشتباه باشد، برخی سایت‌ها کار نمی‌کنند؛ این مشکل معمولاً با کم کردن MTU حل می‌شود.
- **Path MTU Discovery:** با بسته‌های DF (Don't Fragment) اندازه‌ی مسیر را پیدا می‌کند.
