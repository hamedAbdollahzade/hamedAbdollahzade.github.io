---
title: اپ‌های موبایل و دسکتاپ با مهارت‌های وب
description: فرانت‌اند‌کار می‌تواند با همان مهارت‌ها (HTML/CSS/JS/TS، React، …) اپ موبایل و دسکتاپ هم بسازد.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 25
---

فرانت‌اند‌کار می‌تواند با همان مهارت‌ها (HTML/CSS/JS/TS، React، …) اپ موبایل و دسکتاپ هم بسازد.

## موبایل

| رویکرد | ابزار | ایده |
|---|---|---|
| **PWA** | مرورگر | سایت نصب‌شدنی ([PWA](/blog/roadmap-pwa-service-workers/)) |
| **Hybrid (WebView)** | **Ionic + Capacitor** | وب‌اپ داخل پوسته‌ی بومی با دسترسی به دوربین و ... |
| **Cross-platform بومی** | **React Native**، Expo | JS/React ← UI بومی واقعی |
| **Cross-platform با موتور رندر خود** | **Flutter** (Dart) | UI روی canvas مستقل |
| **کاملاً بومی** | Swift/SwiftUI، Kotlin/Compose | حداکثر کنترل |

### React Native + Expo
```bash
npx create-expo-app my-app
npx expo start        # اجرا روی گوشی با Expo Go
```
```tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export default function App() {
  const [n, setN] = useState(0);
  return (
    <View style={styles.box}>
      <Text>تعداد: {n}</Text>
      <Pressable onPress={() => setN(n + 1)}><Text>افزایش</Text></Pressable>
    </View>
  );
}
const styles = StyleSheet.create({ box: { flex: 1, alignItems: "center", justifyContent: "center" } });
```
- به‌جای `div/span` از `View/Text` استفاده می‌شود؛ **CSS وب نیست** (StyleSheet شبیه CSS با Flexbox پیش‌فرض).
- Navigation: React Navigation / Expo Router.
- دسترسی بومی: ماژول‌های Expo (دوربین، اعلان، فایل).

### Ionic + Capacitor
وب‌اپ موجود (React/Vue/Angular) را بسته‌بندی می‌کند:
```bash
npm i @capacitor/core @capacitor/cli
npx cap init
npx cap add android   # و ios
npx cap sync && npx cap open android
```
```js
import { Camera, CameraResultType } from "@capacitor/camera";
const photo = await Camera.getPhoto({ resultType: CameraResultType.Uri });
```

### Flutter (مرور)
با زبان **Dart**؛ همه‌چیز Widget است. سرعت بالا و UI یکسان؛ ولی زبان و اکوسیستم جدید.
```dart
class Counter extends StatefulWidget { /* ... */ }
```

### چطور انتخاب کنیم؟
- محتوا/ابزار ساده → **PWA**
- وب‌اپ موجود را به فروشگاه ببر → **Capacitor**
- تجربه‌ی بومی با تیم JS/React → **React Native**
- UI سفارشی سنگین و تیم آماده‌ی Dart → **Flutter**

## دسکتاپ

| ابزار | ایده | نکته |
|---|---|---|
| **Electron** | Chromium + Node.js داخل بسته | VS Code, Slack, Discord؛ حجم زیاد (~۱۰۰MB+) |
| **Tauri** | WebView سیستم + هسته‌ی **Rust** | حجم بسیار کم، امن‌تر، مصرف RAM کمتر |
| **PWA نصب‌شده** | مرورگر | ساده‌ترین |
| **Flutter / .NET MAUI / Qt** | بومی/چندسکویی | |

### Electron
```bash
npm create electron-app@latest my-app
```
```js
// main.js (پروسه‌ی اصلی)
const { app, BrowserWindow } = require("electron");
function createWindow() {
  const win = new BrowserWindow({ width: 800, height: 600, webPreferences: { preload: __dirname + "/preload.js", contextIsolation: true } });
  win.loadFile("index.html");
}
app.whenReady().then(createWindow);
```
معماری: **Main process** (Node، دسترسی سیستم) + **Renderer** (صفحه‌ی وب) + **Preload** (پل امن با `contextBridge`). `contextIsolation: true` و `nodeIntegration: false` را حفظ کن.

### Tauri
```bash
npm create tauri-app@latest
```
```rust
#[tauri::command]
fn greet(name: &str) -> String { format!("سلام {name}") }
```
```js
import { invoke } from "@tauri-apps/api/core";
const msg = await invoke("greet", { name: "علی" });
```
فرانت‌اند هر فریم‌ورک وب؛ بک‌اند محلی Rust.

## نکات مشترک
- جداسازی منطق مشترک (TypeScript) از UI برای استفاده‌ی مجدد
- توجه به دسترسی‌ها (permissions)، به‌روزرسانی خودکار، امضای کد
- رابط‌کاربری باید با پلتفرم هماهنگ باشد (touch، اندازه‌ی لمسی ≥ ۴۴px)
- RTL و فارسی را از ابتدا تست کن

## تمرین
۱. وب‌اپ خود را به PWA قابل نصب تبدیل کن.
۲. یک اپ ساده‌ی «لیست کارها» با Expo بساز.
۳. همان را با Tauri یا Electron به برنامه‌ی دسکتاپ تبدیل کن و حجم خروجی را مقایسه کن.
