---
title: WireGuard: VPN مدرن و ساده
description: WireGuard: VPN مدرن و ساده؛ مفاهیم، نصب، کانفیگ سرور و کلاینت، NAT، Split Tunnel و پیشرفته‌ها
date: 2026-11-08
category: شبکه و امنیت
order: 6
---

WireGuard یک VPN ساده و سریع است که در کرنل لینوکس (از نسخه ۵.۶) قرار دارد. مزایایش:

- کد کوچک و قابل بررسی (حدود چند هزار خط)
- رمزنگاری مدرن: Curve25519، ChaCha20-Poly1305، BLAKE2s
- هویت هر peer فقط با **کلید عمومی** تعریف می‌شود (بدون گواهی یا نام کاربری)
- اتصال UDP و مقاوم در برابر تغییر IP

## سطح ۱: مبتدی — مفاهیم

| مفهوم | توضیح |
|---|---|
| Interface (`wg0`) | اینترفیس مجازی روی هر دستگاه |
| Private Key | کلید خصوصی؛ هرگز منتشر نشود |
| Public Key | کلید عمومی؛ به peerها داده می‌شود |
| Peer | طرف مقابل تونل (سرور یا کلاینت) |
| Endpoint | آدرس عمومی IP:Port سرور |
| AllowedIPs | دو کاربرد: مسیرهایی که وارد تونل می‌شوند و IPهایی که از این peer قبول می‌شوند |
| Keepalive | ارسال بسته‌ی کوچک هر چند ثانیه برای باز نگه داشتن NAT |

### معماری نمونه

```
[Client laptop]  10.8.0.2  ──UDP 51820──►  [Server VPS]  10.8.0.1  ──► اینترنت
                                       (IP عمومی: 203.0.113.10)
```

## سطح ۲: متوسط — نصب و کانفیگ پایه

### نصب

روی سرور و کلاینت:

```bash
sudo apt update
sudo apt install wireguard wireguard-tools
wg --version
```

### تولید کلیدها

روی هر دستگاه:

```bash
umask 077                             # فایل‌های کلید فقط برای مالک قابل خواندن
wg genkey | tee privatekey | wg pubkey > publickey
cat privatekey publickey
```

- `privatekey` → کلید خصوصی همان دستگاه (در کانفیگ `PrivateKey`)
- `publickey` → کلید عمومی (به طرف مقابل می‌دهی)

### کانفیگ سرور

فایل `/etc/wireguard/wg0.conf` روی سرور:

```ini
[Interface]
Address = 10.8.0.1/24
ListenPort = 51820
PrivateKey = <PRIVATE_KEY_SERVER>

# اجازه‌ی Forward و NAT برای کلاینت‌ها (اینترفیس خروجی را با ip route پیدا کن)
PostUp   = iptables -t nat -A POSTROUTING -o enp3s0 -j MASQUERADE; iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o enp3s0 -j MASQUERADE; iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT

[Peer]
# laptop
PublicKey  = <PUBLIC_KEY_CLIENT>
AllowedIPs = 10.8.0.2/32
```

> `enp3s0` را با اینترفیس خروجی سرور جایگزین کن: `ip route show default`.

### کانفیگ کلاینت

فایل `/etc/wireguard/wg0.conf` روی کلاینت:

```ini
[Interface]
Address = 10.8.0.2/24
PrivateKey = <PRIVATE_KEY_CLIENT>
DNS = 1.1.1.1

[Peer]
PublicKey = <PUBLIC_KEY_SERVER>
Endpoint = 203.0.113.10:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

> `AllowedIPs = 0.0.0.0/0` یعنی **تمام ترافیک** از VPN عبور کند (Full tunnel). `PersistentKeepalive` برای کلاینتی که پشت NAT است مفید است.

### فعال‌سازی سرور و کلاینت

کانفیگ‌ها را محدود کن:

```bash
sudo chmod 600 /etc/wireguard/wg0.conf
```

Forwarding روی سرور:

```bash
echo "net.ipv4.ip_forward = 1" | sudo tee /etc/sysctl.d/99-wireguard.conf
sudo sysctl --system
```

بالا آوردن تونل (هر دو طرف):

```bash
sudo wg-quick up wg0
sudo wg show                          # وضعیت peerها، handshake و ترافیک
sudo systemctl enable wg-quick@wg0    # اجرای خودکار با بوت
```

### فایروال سرور

پورت UDP را باز کن:

```bash
sudo ufw allow 51820/udp
```

### تست

```bash
ping 10.8.0.1                         # از کلاینت به سرور
curl ifconfig.me                      # باید IP سرور را نشان دهد (اگر Full tunnel باشد)
sudo wg show wg0 latest-handshakes    # زمان آخرین handshake
```

### خاموش کردن

```bash
sudo wg-quick down wg0
```

## سطح ۳: پیشرفته — چند کلاینت و کنترل ترافیک

### افزودن کلاینت جدید

یک Peer جدید به سرور اضافه کن و IP جدید بده:

```ini
[Peer]
# phone
PublicKey  = <PUBLIC_KEY_PHONE>
AllowedIPs = 10.8.0.3/32
```

بدون ری‌استارت هم می‌شود. این دستور فقط تغییر را روی اینترفیس زنده اعمال می‌کند و در فایل ذخیره نمی‌شود:

```bash
sudo wg set wg0 peer <PUBLIC_KEY_PHONE> allowed-ips 10.8.0.3/32
```

برای اینکه تغییر بعد از ری‌بوت هم بماند، همان بلوک `[Peer]` را در `wg0.conf` هم بنویس، و بعد وضعیت فایل و اینترفیس را یکی کن:

```bash
sudo wg syncconf wg0 <(sudo wg-quick strip wg0)
```

### Split Tunnel: فقط شبکه‌ی داخلی از VPN

به‌جای `0.0.0.0/0` فقط زیرشبکه‌ی سرور را بده:

```ini
AllowedIPs = 10.8.0.0/24, 192.168.50.0/24
```

ترافیک بقیه مستقیم از اینترنت می‌رود.

### دسترسی به شبکه‌ی خانه از راه دور (Site-to-site ساده)

اگر سرور VPN در خانه پشت NAT باشد: پورت UDP را در مودم فوروارد کن و `Endpoint` را به IP عمومی خانه یا DDNS بده.

```ini
# در کلاینت
AllowedIPs = 10.8.0.0/24, 192.168.1.0/24
```

و روی سرور خانگی، `PostUp` با MASQUERADE برای شبکه‌ی خانه را قرار بده.

### Preshared Key (لایه‌ی امنیتی اضافه)

کلید مشترک اضافی برای مقاومت در برابر کوانتوم در آینده:

```bash
wg genpsk > psk
```

در هر دو `[Peer]` اضافه کن:

```ini
PresharedKey = <CONTENT_OF_PSK>
```

### کانفیگ با `wg-quick` و تنظیم MTU

اگر وب‌سایت‌ها ناقص باز می‌شوند یا کند هستند:

```ini
[Interface]
MTU = 1380
```

مقدار MTU را با تست پیدا کن:

```bash
ping -M do -s 1352 -c 3 1.1.1.1      # اگر جواب داد، MTU حداقل 1380 است
```

### کنترل دسترسی با iptables/nftables

فقط کلاینت `10.8.0.2` به دیتابیس دسترسی دارد:

```bash
sudo iptables -A FORWARD -i wg0 -s 10.8.0.2 -d 192.168.50.10 -p tcp --dport 5432 -j ACCEPT
sudo iptables -A FORWARD -i wg0 -j DROP
```

> ترتیب قوانین مهم است: قانون `DROP` عمومی باید بعد از قانون‌های اجازه باشد.

### مانیتورینگ

```bash
sudo wg show all dump                 # خروجی قابل پردازش
sudo wg show wg0 transfer             # ترافیک ورودی و خروجی هر peer
sudo journalctl -k | grep -i wireguard
```

### عیب‌یابی

| علامت | علت احتمالی و راه‌حل |
|---|---|
| handshake وجود ندارد | پورت UDP در فایروال یا مودم بسته است؛ `Endpoint` و کلید عمومی‌ها را بررسی کن |
| handshake هست ولی اینترنت کار نمی‌کند | `ip_forward` فعال نیست یا MASQUERADE اینترفیس اشتباه است |
| ping کار می‌کند ولی سایت‌ها باز نمی‌شوند | MTU را کم کن (مثلاً 1280 تا 1380) |
| DNS کار نمی‌کند | `DNS` در `[Interface]` کلاینت را تنظیم کن یا DNS سرور را در Peer routing کن |
| بعد از ری‌بوت وصل نمی‌شود | `systemctl enable wg-quick@wg0` را بزن |
| کلید اشتباه | `wg pubkey < privatekey` را بگیر و با کلید عمومی طرف مقابل تطبیق بده |

### تست سریع تونل

```bash
sudo wg show                          # آخرین handshake باید چند ثانیه پیش باشد
ip route get 10.8.0.1                 # باید از wg0 عبور کند
traceroute 10.8.0.1
```

### نکات امنیتی WireGuard

- کلید خصوصی را در گیت، اسکرین‌شات یا چت قرار نده.
- پورت UDP فقط برای WireGuard باز باشد؛ پورت SSH را جدا محدود کن.
- به هر دستگاه یک کلید و یک IP جدا بده تا بتوانی هر کدام را جداگانه لغو کنی.
- اگر کلیدی لو رفت، فوراً آن Peer را از سرور حذف کن و کلید جدید بساز.
