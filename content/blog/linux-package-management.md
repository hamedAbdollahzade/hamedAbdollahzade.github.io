---
title: مدیریت پکیج‌ها در Ubuntu
description: مدیریت پکیج‌ها در Ubuntu؛ آموزش لینوکس اوبونتو به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: لینوکس اوبونتو
order: 2
---

Ubuntu سه روش اصلی نصب نرم‌افزار دارد:

| روش | ابزار | کاربرد |
|---|---|---|
| پکیج‌های رسمی | `apt` | ابزارهای سیستمی و توسعه (git، curl، docker.io و...) |
| Snap | `snap` | برنامه‌های گرافیکی و به‌روز (Firefox، VS Code، Spotify و...) |
| Flatpak | `flatpak` | جایگزین Snap برای برنامه‌های دسکتاپ (در این سیستم نصب نیست) |

## apt (روش اصلی)

```bash
sudo apt update                 # به‌روز کردن لیست پکیج‌ها (قبل از نصب همیشه این را بزن)
sudo apt upgrade -y             # به‌روزرسانی پکیج‌های نصب‌شده
sudo apt full-upgrade -y        # به‌روزرسانی کامل (ممکن است پکیج جدید یا حذف‌ها را انجام دهد)
sudo apt install git            # نصب یک پکیج
sudo apt install -y git curl    # نصب چند پکیج بدون پرسش تأیید
sudo apt remove git             # حذف پکیج (تنظیمات می‌ماند)
sudo apt purge git              # حذف پکیج همراه تنظیمات
sudo apt autoremove -y          # حذف وابستگی‌های بلااستفاده
sudo apt clean                  # پاک کردن کش دانلودها
apt search ripgrep              # جستجوی پکیج
apt show git                    # اطلاعات یک پکیج
apt list --installed | grep git # بررسی نصب بودن یک پکیج
apt-mark showmanual             # فهرست پکیج‌هایی که خودت نصب کرده‌ای
```

### نصب پکیج `.deb` دانلودشده

```bash
sudo apt install ./package.deb  # ترجیح بده به‌جای dpkg، چون وابستگی‌ها را خودش حل می‌کند
sudo dpkg -i package.deb        # نصب مستقیم (اگر خطای وابستگی داد: sudo apt -f install)
```

### افزودن مخزن (PPA) جدید

```bash
sudo add-apt-repository ppa:<owner>/<name>
sudo apt update
```

> PPA را فقط از منابع مطمئن اضافه کن، چون کد آن با سطح دسترسی root اجرا می‌شود.

## Snap

```bash
snap find firefox               # جستجوی برنامه
sudo snap install spotify       # نصب
sudo snap install code --classic   # برنامه‌هایی که دسترسی کامل سیستم لازم دارند، با --classic
sudo snap refresh              # به‌روزرسانی همه‌ی snapها
snap list                       # فهرست snapهای نصب‌شده
sudo snap remove spotify        # حذف
snap info code                  # اطلاعات، کانال‌ها و نسخه
snap changes                    # تاریخچه‌ی عملیات snap
```

## Flatpak (اختیاری)

اگر Flatpak را می‌خواهی:

```bash
sudo apt install flatpak
sudo apt install gnome-software-plugin-flatpak   # برای نصب از گرافیکی
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install flathub org.gimp.GIMP
flatpak run org.gimp.GIMP
flatpak update
flatpak uninstall org.gimp.GIMP
```

## پیدا کردن نصب‌ها و بررسی فضای مصرفی

```bash
dpkg -l | grep -i nvidia         # جستجو در پکیج‌های apt
which git                        # مسیر فایل اجرایی یک دستور
command -v node                  # نسخه‌ی مسیر دستور (برای اسکریپت‌ها)
du -sh /var/cache/apt            # حجم کش apt
sudo du -xh / --max-depth=1 | sort -h | tail   # بزرگ‌ترین پوشه‌های ریشه
```
