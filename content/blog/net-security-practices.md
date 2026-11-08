---
title: امنیت سرور لینوکس
description: امنیت سرور لینوکس؛ SSH امن، UFW، nftables، Fail2ban، به‌روزرسانی
date: 2026-11-08
category: شبکه و امنیت
order: 4
---

این بخش برای سرور Ubuntu (شخصی یا آزمایشی) است. اصل کلی: **کمترین دسترسی لازم** و **لایه‌های دفاعی متعدد**.

> قبل از هر تغییر SSH یا فایروال: یک جلسه‌ی SSH دوم باز نگه دار. اگر قفل شدی، از کنسول سرور (یا پنل ارائه‌دهنده) وارد شو.

## سطح ۱: مبتدی — اصول پایه

### به‌روزرسانی منظم

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades   # فعال‌سازی به‌روزرسانی خودکار امنیتی
```

### کاربر غیر root و sudo

```bash
sudo adduser deploy                   # ساخت کاربر
sudo usermod -aG sudo deploy          # دادن دسترسی sudo
su - deploy                           # ورود با کاربر جدید
```

### بررسی سرویس‌ها و پورت‌های باز

```bash
sudo ss -tulpn                        # پورت‌های listen
systemctl list-units --type=service --state=running
last -n 10                            # آخرین ورودها
sudo lastb -n 10                      # تلاش‌های ناموفق ورود (نیاز به پکیج btmp)
```

## سطح ۲: متوسط — SSH امن

### تولید کلید و ورود بدون رمز

روی سیستم خودت (کلاینت):

```bash
ssh-keygen -t ed25519 -C "my-laptop"
ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@SERVER_IP
ssh deploy@SERVER_IP                  # باید بدون رمز وارد شود
```

### سخت‌سازی `sshd_config`

فایل: `/etc/ssh/sshd_config` (یا فایل‌های داخل `/etc/ssh/sshd_config.d/`).

```conf
# پیشنهاد: در فایل جداگانه‌ای مثل /etc/ssh/sshd_config.d/hardening.conf
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
MaxAuthTries 3
LoginGraceTime 30
X11Forwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
```

اعمال تغییر:

```bash
sudo sshd -t                          # بررسی سینتکس قبل از ری‌استارت
sudo systemctl restart ssh            # اعمال
```

> اگر `sshd -t` خطا داد، ری‌استارت نکن. اگر ری‌استارت کردی و قفل شدی، با جلسه‌ی باز قبلی تنظیمات را برگردان.

### تغییر پورت SSH (اختیاری)

تغییر پورت از اسکن‌های ساده جلوگیری می‌کند، اما امنیت واقعی نمی‌دهد.

```conf
Port 2222
```

```bash
sudo ufw allow 2222/tcp               # قبل از ری‌استارت باز کن
sudo systemctl restart ssh
ssh -p 2222 deploy@SERVER_IP
```

## سطح ۲: متوسط — فایروال

### UFW (ساده‌ترین روش)

```bash
sudo ufw status verbose               # وضعیت فعلی
sudo ufw default deny incoming        # بستن ورودی به طور پیش‌فرض
sudo ufw default allow outgoing       # باز بودن خروجی
sudo ufw allow OpenSSH                # یا: sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow from 192.168.1.0/24 to any port 5432   # پورت دیتابیس فقط از LAN
sudo ufw enable                       # فعال‌سازی (قبل از آن SSH را allow کن!)
sudo ufw delete allow 80/tcp          # حذف قانون
sudo ufw reload
```

### nftables (روش مدرن‌تر)

نمونه‌ی ساده فایل `/etc/nftables.conf`:

```nft
#!/usr/sbin/nft -f
flush ruleset

table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;

        ct state established,related accept
        iif lo accept
        ip protocol icmp accept
        tcp dport { 22, 80, 443 } accept
    }

    chain forward {
        type filter hook forward priority 0; policy drop;
    }

    chain output {
        type filter hook output priority 0; policy accept;
    }
}
```

```bash
sudo nft -c -f /etc/nftables.conf     # بررسی سینتکس
sudo nft -f /etc/nftables.conf        # اعمال
sudo nft list ruleset                 # نمایش قوانین فعال
sudo systemctl enable --now nftables
```

> UFW و nftables را همزمان فعال نکن؛ هر کدام را انتخاب کن.

## سطح ۳: پیشرفته — Fail2ban و سخت‌سازی بیشتر

### Fail2ban: بلاک خودکار IPهای مهاجم

```bash
sudo apt install fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

در `/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port    = ssh
backend = systemd
```

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd      # IPهای بلاک‌شده
sudo fail2ban-client set sshd unbanip 1.2.3.4   # آزاد کردن یک IP
```

### محدودیت نرخ در nftables

```nft
tcp dport 22 ct state new limit rate 5/minute accept
```

### AppArmor و دسترسی‌های اجباری

```bash
sudo aa-status                        # وضعیت AppArmor
```

### Audit و لاگ

```bash
sudo journalctl -u ssh --since "1 hour ago"
sudo journalctl -p err -b             # خطاهای بوت فعلی
sudo apt install auditd && sudo auditctl -l
```

### بررسی ممیزی

```bash
sudo apt install lynis
sudo lynis audit system               # گزارش نقاط ضعف و پیشنهاد
```

## چک‌لیست سریع

- [ ] ورود root با SSH غیرفعال است.
- [ ] ورود با رمز عبور غیرفعال است و فقط کلید SSH کار می‌کند.
- [ ] فایروال فعال است و فقط پورت‌های لازم باز هستند.
- [ ] به‌روزرسانی‌های امنیتی خودکار فعال‌اند.
- [ ] Fail2ban یا معادلش روی SSH فعال است.
- [ ] دیتابیس‌ها و سرویس‌های داخلی به `127.0.0.1` یا LAN محدود شده‌اند.
- [ ] بکاپ منظم و تست‌شده وجود دارد.
