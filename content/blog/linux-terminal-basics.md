---
title: دستورات پایه ترمینال
description: دستورات پایه ترمینال؛ آموزش لینوکس اوبونتو به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: لینوکس اوبونتو
order: 1
---

## پوشه و مسیر

```bash
pwd                       # نشان می‌دهد در کدام پوشه هستی
ls                        # لیست فایل‌ها
ls -la                    # لیست کامل همراه فایل‌های مخفی و دسترسی‌ها
cd ~/Documents            # رفتن به پوشه‌ی Documents
cd ..                     # یک سطح بالاتر
cd -                      # برگشت به پوشه‌ی قبلی
tree -L 2                 # نمایش درختی تا عمق ۲ (نیاز به نصب tree)
```

> `~` همان پوشه‌ی خانه (`/home/<user>`) است.

## ساخت، کپی، انتقال و حذف

```bash
mkdir projects            # ساخت پوشه
mkdir -p a/b/c            # ساخت مسیر تو در تو
touch notes.md            # ساخت فایل خالی (یا به‌روز کردن زمان فایل)
cp file.txt backup.txt    # کپی فایل
cp -r dir1 dir2           # کپی پوشه (بازگشتی)
mv old.txt new.txt        # تغییر نام یا انتقال
rm file.txt               # حذف فایل (برگشت‌ناپذیر)
rm -r folder              # حذف پوشه و محتوایش (خیلی مراقب باش)
rmdir empty-folder        # حذف پوشه‌ی خالی
```

> ترجیح بده قبل از `rm`، با `ls` مطمئن شوی چه چیزی حذف می‌شود.

## نمایش و جستجوی فایل

```bash
cat file.txt              # نمایش کل محتوا
less file.txt             # مرور صفحه‌ای (q برای خروج)
head -n 20 file.txt       # ۲۰ خط اول
tail -f /var/log/syslog   # دنبال کردن خروجی لاگ به‌صورت زنده
wc -l file.txt            # شمارش خطوط
find ~ -name "*.md"       # جستجوی فایل با نام
grep -rn "TODO" .         # جستجوی متن داخل فایل‌ها (بازگشتی)
rg "TODO"                 # جستجوی سریع‌تر با ripgrep (نیاز به نصب)
```

## ویرایش متن

```bash
nano file.txt             # ساده‌ترین ویرایشگر (Ctrl+O ذخیره، Ctrl+X خروج)
vim file.txt              # ویرایشگر حرفه‌ای (i ورود به حالت Insert، Esc خروج، :wq ذخیره و خروج)
code .                    # باز کردن پوشه‌ی جاری در VS Code
```

## دسترسی‌ها (Permissions)

```bash
ls -l file.sh             # نمایش دسترسی‌ها، مثلاً -rw-r--r--
chmod +x script.sh        # اجرایی کردن فایل
chmod 644 file.txt        # خواندن/نوشتن برای مالک، فقط خواندن برای بقیه
chmod 755 script.sh       # اجرای کامل برای همه
chown user:group file     # تغییر مالک فایل
sudo <command>            # اجرای دستور با دسترسی root
sudo -i                   # ورود به محیط root (با احتیاط)
```

## فشرده‌سازی و استخراج

```bash
tar -czf archive.tar.gz folder/   # فشرده‌سازی یک پوشه
tar -xzf archive.tar.gz           # استخراج
tar -tf archive.tar.gz            # دیدن محتوای آرشیو بدون استخراج
zip -r archive.zip folder/        # ساخت zip
unzip archive.zip                 # استخراج zip
7z x archive.7z                   # استخراج 7z (نیاز به p7zip یا 7zip)
unrar x archive.rar               # استخراج rar
```

## پردازش‌ها و سیستم

```bash
htop                      # مانیتورینگ تعاملی CPU و RAM (q برای خروج)
ps aux | grep firefox     # پیدا کردن یک پردازش
kill <PID>                # پایان دادن ملایم به پردازش
kill -9 <PID>             # پایان دادن اجباری (آخرین راه)
pkill -f nodemon          # پایان دادن پردازش با نام
top                       # نمایش پویای پردازش‌ها
uptime                    # مدت روشن بودن سیستم
systemctl status ssh      # وضعیت یک سرویس
sudo systemctl restart ssh   # راه‌اندازی مجدد سرویس
sudo systemctl enable --now docker   # فعال‌سازی و اجرای سرویس بلافاصله
journalctl -u docker -n 50 # لاگ‌های یک سرویس
```

## شبکه

```bash
ip a                      # آدرس IP و اینترفیس‌ها
ping -c 4 google.com      # تست اتصال (۴ بار)
curl -I https://example.com   # فقط هدرهای پاسخ HTTP
wget https://example.com/file.zip   # دانلود فایل
ss -tulpn                 # پورت‌های بازِ در حال listen و پردازش مربوط
dig example.com           # تست DNS (نیاز به dnsutils)
```

## میانبرهای مفید ترمینال

| کلید | کاربرد |
|---|---|
| `Tab` | تکمیل خودکار نام فایل و دستور |
| `Tab Tab` | نمایش همه‌ی گزینه‌های ممکن |
| `↑` / `↓` | مرور تاریخچه‌ی دستورات |
| `Ctrl+R` | جستجو در تاریخچه |
| `Ctrl+C` | توقف دستور در حال اجرا |
| `Ctrl+L` | پاک کردن صفحه |
| `Ctrl+A` / `Ctrl+E` | رفتن به ابتدا / انتهای خط |
| `Ctrl+D` | خروج از shell |

## لینک‌دهی دستورات (Pipe و Redirect)

```bash
ls -la > list.txt          # خروجی را در فایل بنویس (فایل قبلی پاک می‌شود)
echo "خط جدید" >> list.txt  # به انتهای فایل اضافه کن
ps aux | grep node        # خروجی یک دستور را ورودی دستور بعدی کن
sudo apt update && sudo apt upgrade -y   # اگر اولی موفق بود، دومی اجرا شود
```
