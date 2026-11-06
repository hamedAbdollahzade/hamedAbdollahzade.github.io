---
title: Git و GitHub
description: Git و GitHub؛ آموزش مسیر فرانت‌اند به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 3
---

## Version Control چیه؟
ثبت تاریخچه‌ی تغییرات، بازگشت به نسخه‌های قبل، کار تیمی بدون پاک کردن کار همدیگه. **Git** رایج‌ترین سیستم VCS (توزیع‌شده) است؛ **GitHub / GitLab / Bitbucket** سرویس‌های میزبانی ریپوها (VCS hosting) هستن.

## سه ناحیه
```
Working Directory  --git add-->  Staging Area  --git commit-->  Repository (.git)
                                                                    |
                                                          git push / git pull
                                                                    v
                                                               Remote (GitHub)
```

## شروع
```bash
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main

git init                           # ریپوی جدید
git clone https://github.com/user/repo.git
```

## چرخه‌ی روزمره
```bash
git status                  # وضعیت
git add file.js             # اضافه به staging
git add .                   # همه‌ی تغییرات
git commit -m "Add login form"
git log --oneline --graph   # تاریخچه‌ی خلاصه
git diff                    # تغییرات staged نشده
git diff --staged           # تغییرات staged
```

### پیام کامیت خوب
- جمله‌ی کوتاه امری: `Fix header overflow on mobile`
- یک کامیت = یک تغییر منطقی
- قرارداد رایج **Conventional Commits**: `feat: add search`، `fix: correct price rounding`، `docs: ...`، `refactor: ...`

## .gitignore
```gitignore
node_modules/
dist/
.env
.DS_Store
*.log
```
فایل‌های حاوی رمز (`.env`) هرگز commit نشن.

## Branch و Merge
```bash
git branch                      # لیست branchها
git switch -c feature/login     # ساخت و رفتن
git switch main
git merge feature/login         # ادغام
git branch -d feature/login     # حذف
```
- **Fast-forward**: وقتی main از branch جلوتر نرفته، فقط اشاره‌گر جلو می‌ره.
- **Merge commit**: وقتی هر دو شاخه تغییر کرده.
- **Conflict**: وقتی هر دو یک خط رو عوض کرده باشن:
```text
<<<<<<< HEAD
نسخه‌ی شما
=======
نسخه‌ی طرف مقابل
>>>>>>> feature/login
```
فایل رو دستی درست کن، علامت‌ها رو پاک کن، بعد `git add` و `git commit`.

### Rebase
```bash
git switch feature
git rebase main          # کامیت‌های feature رو روی آخر main می‌ذاره (تاریخچه‌ی خطی)
```
قانون طلایی: روی کامیت‌هایی که push شدن و دیگران ازشون استفاده می‌کنن rebase نکن.

## Remote
```bash
git remote -v
git remote add origin https://github.com/user/repo.git
git push -u origin main         # اولین push
git pull                        # fetch + merge
git fetch                       # فقط دریافت
```

## برگشت و اصلاح
```bash
git restore file.js             # دور انداختن تغییرات working
git restore --staged file.js    # برگرداندن از staging
git commit --amend              # اصلاح آخرین کامیت (قبل از push)
git revert <hash>               # کامیت جدیدی که اثر قبلی رو خنثی می‌کنه (امن)
git reset --soft HEAD~1         # کامیت رو بردار، تغییرات staged بمونه
git reset --hard HEAD~1         # ⚠️ کامیت و تغییرات رو پاک می‌کنه
git stash                       # موقتاً تغییرات رو کنار بذار
git stash pop
git reflog                      # تاریخچه‌ی حرکت HEAD (نجات از اشتباه)
git cherry-pick <hash>          # برداشتن یک کامیت
git tag v1.0.0
```

## GitHub Workflow
۱. **Fork** یا branch جدید
۲. تغییرات + commit
۳. `git push` و باز کردن **Pull Request (PR)**
۴. **Code Review** (نظر، درخواست تغییر، تأیید)
۵. **Merge** (Merge commit / Squash / Rebase)
۶. حذف branch

### امکانات GitHub
- **Issues / Projects**: مدیریت کار
- **Actions (CI/CD)**: اجرای خودکار تست و استقرار
- **Pages**: میزبانی استاتیک رایگان
- **Branch protection**: اجبار review و تست قبل از merge
- **SSH key / Personal Access Token** برای احراز هویت

### مثال GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm test
```

## الگوهای branching
- **GitHub Flow**: main همیشه قابل استقرار + branchهای کوتاه‌عمر + PR (ساده، رایج)
- **Git Flow**: develop/release/hotfix (برای نرم‌افزارهای نسخه‌دار)
- **Trunk-based**: همه روی main با feature flag

## تمرین
۱. ریپو بساز، دو branch بساز، یک conflict عمدی ایجاد و حلش کن.
۲. یک کامیت اشتباه رو با `revert` خنثی کن.
۳. یک workflow ساده‌ی Actions که `npm test` اجرا کنه.
