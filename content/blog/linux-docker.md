---
title: Docker در Ubuntu
description: Docker برنامه‌ها را در کانتینر اجرا می‌کند؛ محیطی ایزوله که کد، کتابخانه‌ها و تنظیماتش را با خودش دارد.
date: 2026-11-06
category: لینوکس اوبونتو
order: 4
---

Docker برنامه‌ها را در **کانتینر** اجرا می‌کند؛ محیطی ایزوله که کد، کتابخانه‌ها و تنظیماتش را با خودش دارد.

- **Image (ایمیج):** قالب فقط‌خواندنی، مثل یک کلاس.
- **Container (کانتینر):** نمونه‌ی در حال اجرای یک ایمیج، مثل یک شیء.
- **Volume:** فضای ذخیره‌سازی ماندگار بیرون از کانتینر.
- **Network:** شبکه‌ای که کانتینرها از طریق آن با هم حرف می‌زنند.

## نصب و راه‌اندازی

این سیستم Docker را از apt نصب کرده است:

```bash
sudo apt update
sudo apt install docker.io docker-compose-v2
sudo systemctl enable --now docker       # اجرای خودکار با بوت و همین حالا
docker --version
docker compose version
```

### اجرای docker بدون sudo

```bash
sudo usermod -aG docker $USER            # اضافه کردن کاربر به گروه docker
newgrp docker                            # اعمال بدون logout (یا logout/login کامل)
docker run hello-world                   # تست نصب
```

> دسترسی به گروه `docker` معادل دسترسی root است. فقط روی سیستمی که خودت کنترل می‌کنی این کار را بکن.

## تست و اطلاعات کلی

```bash
docker info                 # اطلاعات کلی Docker daemon
docker version              # نسخه‌ی client و server
docker system df            # فضای مصرفی ایمیج‌ها، کانتینرها و volumeها
```

## ایمیج‌ها (Images)

```bash
docker pull nginx                   # دانلود ایمیج (نسخه‌ی latest)
docker pull node:22-alpine          # دانلود نسخه‌ی مشخص
docker images                       # فهرست ایمیج‌های محلی
docker image ls                     # معادل دستور بالا
docker search python                # جستجو در Docker Hub
docker image inspect nginx          # جزئیات یک ایمیج
docker history nginx                # لایه‌های ساخت ایمیج
docker rmi nginx                    # حذف ایمیج (اگر کانتینری از آن استفاده نمی‌کند)
docker tag myapp:latest hamed/myapp:1.0   # تغییر نام/برچسب ایمیج
docker login                        # ورود به Docker Hub
docker push hamed/myapp:1.0         # ارسال ایمیج به Docker Hub
```

## کانتینرها (Containers)

### اجرا

```bash
docker run nginx                              # اجرا (در پیش‌زمینه)
docker run -d nginx                           # اجرا در پس‌زمینه (detached)
docker run -d -p 8080:80 nginx                # پورت ۸۰ کانتینر را روی ۸۰۸۰ سیستم منتشر کن
docker run -d --name web -p 8080:80 nginx     # دادن نام به کانتینر
docker run -it ubuntu bash                    # ورود تعاملی به یک کانتینر Ubuntu
docker run --rm -it python:3.12 python        # اجرای موقت؛ بعد از خروج حذف شود
docker run -d -e POSTGRES_PASSWORD=secret postgres   # تعیین متغیر محیطی
docker run -d -v $(pwd):/app -w /app node:22 npm start  # اتصال پوشه‌ی جاری به کانتینر
```

### مدیریت

```bash
docker ps                   # کانتینرهای در حال اجرا
docker ps -a                # همه‌ی کانتینرها (حتی متوقف‌شده)
docker stop web             # توقف ملایم
docker start web            # اجرای مجدد یک کانتینر متوقف‌شده
docker restart web          # ری‌استارت
docker pause web            # مکث
docker unpause web          # ادامه
docker rm web               # حذف کانتینر متوقف‌شده
docker rm -f web            # توقف و حذف اجباری
docker logs web             # لاگ‌های کانتینر
docker logs -f web          # دنبال کردن لاگ به‌صورت زنده
docker logs --tail 100 web  # ۱۰۰ خط آخر
docker stats                # مصرف CPU و RAM کانتینرها (زنده)
docker top web              # پردازش‌های داخل کانتینر
docker inspect web          # جزئیات کامل (JSON)
docker port web            # پورت‌های منتشرشده
```

### ورود به کانتینر در حال اجرا

```bash
docker exec -it web bash        # اگر bash نبود: sh
docker exec web ls /usr/share/nginx/html   # اجرای یک دستور بدون ورود
docker cp web:/etc/nginx/nginx.conf ./nginx.conf   # کپی فایل از کانتینر به سیستم
docker cp ./index.html web:/usr/share/nginx/html/  # کپی فایل از سیستم به کانتینر
```

## ساخت ایمیج با Dockerfile

یک فایل به نام `Dockerfile` بساز:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

ساخت و اجرا:

```bash
docker build -t my-node-app:1.0 .           # ساخت ایمیج از Dockerfile پوشه‌ی جاری
docker run -d -p 3000:3000 --name app my-node-app:1.0
```

> فایل `.dockerignore` بساز و `node_modules`، `.git` و فایل‌های `.env` را در آن بگذار تا ایمیج سبک و امن بماند.

## Volume (ذخیره‌سازی ماندگار)

```bash
docker volume create data                  # ساخت volume
docker volume ls                           # فهرست volumeها
docker volume inspect data                 # جزئیات
docker run -d -v data:/var/lib/postgresql/data postgres   # اتصال volume به کانتینر
docker volume rm data                      # حذف volume (داده‌ها از بین می‌روند)
```

## Network

```bash
docker network ls                          # فهرست شبکه‌ها
docker network create app-net              # ساخت شبکه
docker run -d --name db --network app-net postgres
docker run -d --name api --network app-net my-api   # کانتینرها با نام همدیگر را پیدا می‌کنند
docker network inspect app-net
docker network rm app-net
```

## Docker Compose

برای اجرای چند سرویس با هم، فایل `compose.yaml` بساز:

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    depends_on:
      - api

  api:
    build: .
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

دستورات Compose:

```bash
docker compose up -d                 # ساخت و اجرای همه‌ی سرویس‌ها در پس‌زمینه
docker compose up -d --build         # دوباره ساخت ایمیج‌ها قبل از اجرا
docker compose ps                    # وضعیت سرویس‌ها
docker compose logs -f api           # لاگ یک سرویس
docker compose exec api sh           # ورود به یک سرویس
docker compose restart web           # ری‌استارت یک سرویس
docker compose stop                  # توقف همه (کانتینرها باقی می‌مانند)
docker compose down                  # توقف و حذف کانتینرها و شبکه‌ها (volumeها می‌مانند)
docker compose down -v               # حذف همراه volumeها (داده‌ها پاک می‌شوند)
```

## پاک‌سازی و نگهداری

```bash
docker container prune     # حذف همه‌ی کانتینرهای متوقف‌شده
docker image prune         # حذف ایمیج‌های بی‌استفاده (dangling)
docker image prune -a      # حذف همه‌ی ایمیج‌های بی‌استفاده
docker volume prune        # حذف volumeهای بی‌استفاده
docker system prune        # پاک‌سازی کلی (کانتینر، شبکه، ایمیج dangling)
docker system prune -a --volumes   # پاک‌سازی کامل؛ همه‌ی داده‌های بی‌استفاده پاک می‌شوند
```

> دستورات `prune` برگشت‌ناپذیرند. قبل از اجرا با `docker system df` و دستور `ls` مطمئن شو چه چیزی حذف می‌شود.

## ترفند و مشکلات رایج

| مشکل | راه‌حل |
|---|---|
| `permission denied while trying to connect to the Docker daemon` | کاربر را به گروه docker اضافه کن و logout/login کن (بخش بالا) |
| پورت از قبل استفاده شده | پورت دیگری مثل `-p 8081:80` بده یا با `sudo ss -tulpn` پورت را پیدا کن |
| Docker دیسک را پر کرده | `docker system df` و سپس `docker system prune` |
| تغییرات Dockerfile اعمال نمی‌شود | `docker build --no-cache -t name .` |
| کانتینر بلافاصله بسته می‌شود | `docker logs <name>` را بررسی کن |
