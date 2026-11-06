---
title: برنامه‌های نصب‌شده روی این سیستم
description: این فهرست از خروجی apt-mark showmanual و snap list همین سیستم (Ubuntu 26.04.1 LTS) ساخته شده است. فقط برنامه‌هایی آمده‌اند که خودت نصب کرده‌ای؛ پکیج‌های…
date: 2026-11-06
category: لینوکس اوبونتو
order: 3
---

این فهرست از خروجی `apt-mark showmanual` و `snap list` همین سیستم (Ubuntu 26.04.1 LTS) ساخته شده است. فقط برنامه‌هایی آمده‌اند که خودت نصب کرده‌ای؛ پکیج‌های سیستمی (مثل کرنل، گرافیک و سرویس‌های Ubuntu) حذف شده‌اند.

> برای بررسی دوباره روی سیستم خودت:
> ```bash
> apt-mark showmanual      # پکیج‌های apt که دستی نصب شده‌اند
> snap list                # snapهای نصب‌شده
> ```

## ابزارهای توسعه و خط فرمان

| برنامه | نسخه‌ی فعلی | دستور نصب |
|---|---|---|
| git | 2.53 | `sudo apt install git` |
| curl | 8.18 | `sudo apt install curl` |
| wget | 1.25 | `sudo apt install wget` |
| build-essential (gcc، make و...) | — | `sudo apt install build-essential` |
| vim | 9.1 | `sudo apt install vim` |
| tmux | — | `sudo apt install tmux` |
| zsh | — | `sudo apt install zsh` |
| starship (پرامپت ترمینال) | — | `sudo apt install starship` |
| zsh-autosuggestions | — | `sudo apt install zsh-autosuggestions` |
| zsh-syntax-highlighting | — | `sudo apt install zsh-syntax-highlighting` |
| ripgrep (`rg`) | — | `sudo apt install ripgrep` |
| fzf | — | `sudo apt install fzf` |
| tree | — | `sudo apt install tree` |
| htop | 3.4.1 | `sudo apt install htop` |
| gnupg | — | `sudo apt install gnupg` |
| unzip | — | `sudo apt install unzip` |
| gzip | — | معمولاً از قبل نصب است |

### پیکربندی zsh و starship (اختیاری)

```bash
chsh -s $(which zsh)                       # تغییر shell پیش‌فرض به zsh (بعد از logout دوباره login کن)
echo 'eval "$(starship init zsh)"' >> ~/.zshrc
echo 'source /usr/share/zsh-autosuggestions/zsh-autosuggestions.zsh' >> ~/.zshrc
echo 'source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh' >> ~/.zshrc
```

## Node.js و Python

| برنامه | نسخه‌ی فعلی | نکته |
|---|---|---|
| Node.js | v26.13.0 | در فهرست apt نیست؛ روش نصبش را با `which -a node` بررسی کن |
| npm | 11.20.0 | همراه Node |
| Python | 3.14.4 | نسخه‌ی پیش‌فرض سیستم |
| pip3 | 25.1.1 | `sudo apt install python3-pip` (اگر نصب نیست) |

برای نصب Node.js با یک روش مطمئن و قابل تغییر نسخه، پیشنهاد می‌شود از **nvm** استفاده کنی:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install --lts
nvm use --lts
```

> نسخه‌ی `v0.40.1` را از صفحه‌ی رسمی [nvm](https://github.com/nvm-sh/nvm) بررسی کن و جدیدترین را جایگزین کن.

## Docker

| برنامه | نسخه‌ی فعلی | دستور نصب |
|---|---|---|
| docker.io (موتور Docker) | 29.1.3 | `sudo apt install docker.io` |
| docker-compose-v2 | 2.40.3 | `sudo apt install docker-compose-v2` |

جزئیات استفاده در [04-docker.md](/blog/linux-docker/) آمده است.

## ویرایشگرها و IDE

| برنامه | نصب‌شده از | دستور نصب |
|---|---|---|
| VS Code (`code`) | Snap | `sudo snap install code --classic` |
| Obsidian | Snap | `sudo snap install obsidian --classic` |
| Postman | Snap | `sudo snap install postman` |

> اگر دستور Snap خطای `classic` داد، با `snap info <name>` ببین نوع confinement آن چیست و دستور را تنظیم کن.

## مرورگر

| برنامه | نصب‌شده از | دستور نصب |
|---|---|---|
| Firefox | Snap (پیش‌فرض Ubuntu) | `sudo snap install firefox` |
| Chromium | Snap | `sudo snap install chromium` |

## ویدیو، صدا و گرافیک

| برنامه | نصب‌شده از | دستور نصب |
|---|---|---|
| VLC | apt و Snap (هر دو) | `sudo apt install vlc` یا `sudo snap install vlc` |
| OBS Studio | apt و Snap (هر دو) | `sudo apt install obs-studio` یا `sudo snap install obs-studio` |
| Kdenlive (ویرایش ویدیو) | apt | `sudo apt install kdenlive` |
| GIMP (ویرایش تصویر) | apt | `sudo apt install gimp` |
| Darktable (ویرایش RAW) | Snap | `sudo snap install darktable` |
| Audacity (ویرایش صدا) | apt | `sudo apt install audacity` |
| FFmpeg | apt | `sudo apt install ffmpeg` |
| Flameshot (اسکرین‌شات) | apt | `sudo apt install flameshot` |
| کدک‌های GStreamer | apt | `sudo apt install gstreamer1.0-libav gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly` |

> VLC و OBS را روی این سیستم دو بار نصب کرده‌ای (apt و Snap). یکی را حذف کن تا میانبرها تداخل نکنند:
> ```bash
> sudo snap remove vlc            # یا: sudo apt remove vlc
> sudo snap remove obs-studio     # یا: sudo apt remove obs-studio
> ```

## بازی

| برنامه | نصب‌شده از | دستور نصب |
|---|---|---|
| Steam | Snap | `sudo snap install steam` |

## ارتباطات، دانلود و شبکه

| برنامه | نصب‌شده از | دستور نصب |
|---|---|---|
| Telegram Desktop | Snap | `sudo snap install telegram-desktop` |
| Spotify | Snap | `sudo snap install spotify` |
| qBittorrent | apt | `sudo apt install qbittorrent` |
| wpasupplicant (Wi-Fi) | apt | `sudo apt install wpasupplicant` |

## فشرده‌سازی و آرشیو

| برنامه | دستور نصب |
|---|---|
| 7-Zip (7z) | `sudo apt install 7zip` |
| Ark (مدیر آرشیو گرافیکی) | `sudo apt install ark` |
| RAR / UnRAR | `sudo apt install rar unrar` |

## مدیریت سیستم و قدرت

| برنامه | دستور نصب | نکته |
|---|---|---|
| TLP (مدیریت مصرف باتری) | `sudo apt install tlp` | بعد از نصب: `sudo systemctl enable --now tlp` |

## درایور کارت گرافیک NVIDIA

| پکیج | دستور نصب |
|---|---|
| nvidia-driver-595-open | `sudo ubuntu-drivers install` یا `sudo apt install nvidia-driver-595-open` |

> نصب درایور NVIDIA را با `ubuntu-drivers devices` بررسی کن و بعد از نصب سیستم را ریستارت کن.

## زبان و ورودی فارسی/چینی

| پکیج | کاربرد | دستور نصب |
|---|---|---|
| ibus-table-cangjie (3، 5، big) | ورودی چینی Cangjie | `sudo apt install ibus-table-cangjie-big ibus-table-cangjie3 ibus-table-cangjie5` |
| m17n-db | جدول‌های ورودی IBus | `sudo apt install m17n-db` |
| wbritish | دیکشنری انگلیسی | `sudo apt install wbritish` |

## متاپکیج‌های Ubuntu

این‌ها مجموعه‌هایی از پکیج‌ها هستند و معمولاً با نصب Ubuntu آمده‌اند:

| پکیج | کاربرد | دستور نصب |
|---|---|---|
| ubuntu-desktop-minimal | محیط دسکتاپ | `sudo apt install ubuntu-desktop-minimal` |
| ubuntu-minimal / ubuntu-standard | پایه‌ی سیستم | `sudo apt install ubuntu-standard` |
| ubuntu-restricted-extras | کدک‌ها و فونت‌های اضافی | `sudo apt install ubuntu-restricted-extras` |
| ubuntu-restricted-addons | افزونه‌های محدود | `sudo apt install ubuntu-restricted-addons` |
| ubuntu-wallpapers | تصاویر پس‌زمینه | `sudo apt install ubuntu-wallpapers` |

## برنامه‌هایی با منبع خارج از مخزن رسمی Ubuntu

این برنامه‌ها در مخزن پیش‌فرض Ubuntu نیستند و احتمالاً از فایل `.deb` یا سایت سازنده نصب شده‌اند:

| برنامه | نکته |
|---|---|
| claude-desktop | نصب از منبع سازنده؛ برای به‌روزرسانی از همان مسیر استفاده کن |
| chatgpt | نصب از منبع سازنده |
| v2rayN | نصب از منبع سازنده (GitHub) |

برای نصب دوباره‌ی یکی از آن‌ها، فایل `.deb` را از سایت رسمی دانلود کن و بزن:

```bash
sudo apt install ./<package-name>.deb
```

## پکیج‌های سیستمی که نباید حذف شوند

اینها در فهرست نصب‌های دستی هستند ولی بخشی از سیستم‌اند:

- `grub-efi-amd64`، `grub-efi-amd64-signed`، `shim-signed`، `efibootmgr`: بوت‌لودر. حذفشان سیستم را بوت‌ناپذیر می‌کند.
- `init`، `ncurses-*`، `dash`، `hostname`: ابزارهای پایه‌ی سیستم.
- snapهای `core*`، `snapd`، `gnome-46-2404`، `mesa-2404`: زیرساخت Snap.

> قبل از هر حذفی، با `apt-cache rdepends --installed <package>` ببین چه چیزی به آن وابسته است.
