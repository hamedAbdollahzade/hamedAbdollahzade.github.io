---
title: IP ثابت (Static IP) در Ubuntu
description: IP ثابت (Static IP) در Ubuntu؛ netplan، ip، nmcli، و عیب‌یابی
date: 2026-11-08
category: شبکه و امنیت
order: 5
---

به‌طور پیش‌فرض IP سیستم از DHCP گرفته می‌شود و ممکن است تغییر کند. برای سرور، پرینتر یا هدف‌های پورت‌فوروارد، IP ثابت لازم است.

## سطح ۱: مبتدی — بررسی وضعیت فعلی

```bash
ip -br a                              # نام اینترفیس و IP فعلی
ip route show                         # Gateway فعلی
resolvectl status                     # DNS فعلی
nmcli device status                   # وضعیت NetworkManager (اگر فعال است)
```

یادداشت کن:

- نام اینترفیس (مثلاً `enp3s0` یا `wlp2s0`)
- IP فعلی و Prefix (مثلاً `192.168.1.50/24`)
- Gateway (مثلاً `192.168.1.1`)

## سطح ۲: متوسط — تنظیم با Netplan

Ubuntu از **netplan** برای پیکربندی شبکه استفاده می‌کند. فایل‌ها در `/etc/netplan/` هستند.

### ۱) پیدا کردن فایل فعلی

```bash
ls /etc/netplan/
sudo cat /etc/netplan/*.yaml
```

### ۲) نوشتن کانفیگ IP ثابت

فایل مثلاً `/etc/netplan/01-static.yaml`:

```yaml
network:
  version: 2
  ethernets:
    enp3s0:
      dhcp4: false
      addresses:
        - 192.168.1.50/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 1.1.1.1
          - 8.8.8.8
```

> نکات مهم YAML: فاصله‌گذاری با **space** (نه tab) و سطح تورفتگی باید دقیق باشد. `gateway4` منسوخ شده؛ از `routes` استفاده کن.

### ۳) محدود کردن دسترسی فایل

Netplan نسبت به دسترسی فایل سخت‌گیر است:

```bash
sudo chmod 600 /etc/netplan/01-static.yaml
```

### ۴) تست و اعمال

```bash
sudo netplan generate                 # بررسی و تولید پیکربندی
sudo netplan try                      # اعمال موقت؛ اگر تأیید نکردی، ۱۲۰ ثانیه بعد برمی‌گردد
sudo netplan apply                    # اعمال دائمی
ip -br a
```

> `netplan try` را ترجیح بده؛ اگر با SSH وصل هستی و IP اشتباه بزنی، دسترسی‌ات قطع می‌شود و `try` تنظیمات قبلی را برمی‌گرداند.

## IP ثابت با نام اینترفیس‌های متعدد

```yaml
network:
  version: 2
  ethernets:
    enp3s0:
      dhcp4: false
      addresses: [192.168.1.50/24]
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses: [1.1.1.1]
    enp4s0:
      dhcp4: false
      addresses: [10.10.0.2/24]
```

> اگر دو اینترفیس به Gateway پیش‌فرض اشاره کنند، فقط یکی را `to: default` بگذار.

## IP ثابت با NetworkManager (nmcli)

اگر سیستم با NetworkManager کار می‌کند (دسکتاپ معمولی):

```bash
nmcli connection show                 # لیست اتصال‌ها
nmcli -f ipv4 connection show "Wired connection 1"

sudo nmcli connection modify "Wired connection 1" \
  ipv4.method manual \
  ipv4.addresses 192.168.1.50/24 \
  ipv4.gateway 192.168.1.1 \
  ipv4.dns "1.1.1.1 8.8.8.8"

sudo nmcli connection down "Wired connection 1" && sudo nmcli connection up "Wired connection 1"
```

## تغییر موقت با ip (برای آزمایش)

با ری‌بوت پاک می‌شود:

```bash
sudo ip addr add 192.168.1.50/24 dev enp3s0
sudo ip link set enp3s0 up
sudo ip route add default via 192.168.1.1
echo "nameserver 1.1.1.1" | sudo tee /etc/resolv.conf   # فقط آزمایشی
```

حذف IP موقت:

```bash
sudo ip addr flush dev enp3s0
```

## IP ثابت روی روتر (DHCP Reservation)

روش بهتر در شبکه‌ی خانگی: به‌جای تنظیم روی سیستم، در پنل مودم/روتر یک **Reservation** بساز:

- MAC آدرس کارت شبکه را پیدا کن: `ip link show enp3s0`
- در تنظیمات DHCP روتر، آن MAC را به `192.168.1.50` وصل کن.

مزیت: IP از سمت روتر کنترل می‌شود و تنظیمات سیستم ساده می‌ماند.

## عیب‌یابی

| مشکل | بررسی |
|---|---|
| بعد از `netplan apply` اینترنت قطع شد | `sudo netplan try` را دوباره بزن؛ Gateway و prefix را چک کن |
| خطای YAML | `sudo netplan generate` خطای خط را نشان می‌دهد |
| IP تغییر نکرد | `sudo netplan apply` و `ip -br a` |
| DNS کار نمی‌کند | `resolvectl status` و `nameservers` را بررسی کن |
| IP با IP دیگری تداخل دارد | `ip neigh show` و جدول DHCP روتر را ببین |
| اینترفیس بالا نیست | `ip link set enp3s0 up` و کابل/Wi-Fi را چک کن |

```bash
ping -c 3 192.168.1.1                 # Gateway
ping -c 3 1.1.1.1                     # اینترنت بدون DNS
ping -c 3 google.com                  # با DNS
```

## پیشرفته: چند IP روی یک اینترفیس

```yaml
enp3s0:
  dhcp4: false
  addresses:
    - 192.168.1.50/24
    - 192.168.1.51/24
  routes:
    - to: default
      via: 192.168.1.1
```

## پیشرفته: Policy Routing

اگر دو اینترفیس دارای Gateway جدا هستند و پاسخ باید از همان اینترفیس برگردد:

```bash
sudo ip route add default via 10.10.0.1 dev enp4s0 table 100
sudo ip rule add from 10.10.0.2 table 100
```

این مورد برای سرورهای چندمسیره کاربرد دارد؛ قبل از استفاده، جدول مسیریابی اصلی را بررسی کن.
