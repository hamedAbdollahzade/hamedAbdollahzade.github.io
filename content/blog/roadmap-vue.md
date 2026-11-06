---
title: Vue 3
description: فریم‌ورک پیشرو با Single File Component (SFC) و reactivity مبتنی بر Proxy.
date: 2026-11-06
category: مسیر فرانت‌اند
order: 11
---

فریم‌ورک پیشرو با **Single File Component (SFC)** و reactivity مبتنی بر Proxy.

```bash
npm create vue@latest
```

## ساختار SFC
```vue
<script setup lang="ts">
import { ref, computed } from "vue";

const count = ref(0);
const double = computed(() => count.value * 2);
function inc() { count.value++; }
</script>

<template>
  <button @click="inc">{{ count }} × ۲ = {{ double }}</button>
</template>

<style scoped>
button { padding: .5rem 1rem; }
</style>
```
`<script setup>` = Composition API فشرده؛ `scoped` یعنی استایل فقط برای همین کامپوننت.

## Reactivity
```js
import { ref, reactive, computed, watch, watchEffect } from "vue";

const n = ref(0);                    // مقدار اولیه؛ دسترسی با .value در script
const user = reactive({ name: "Ali" });   // شیء reactive، بدون .value
const doubled = computed(() => n.value * 2);

watch(n, (newV, oldV) => console.log(newV, oldV));
watch(() => user.name, v => console.log(v));
watchEffect(() => console.log(n.value));   // خودکار وابستگی‌ها رو ردیابی می‌کنه
```
در template، `ref`ها خودکار unwrap می‌شن (بدون `.value`).

## Template Syntax
```vue
<template>
  <p>{{ message }}</p>
  <a :href="url">لینک</a>                  <!-- v-bind -->
  <button @click="save" @keyup.enter="save">  <!-- v-on -->
  <input v-model="text" />                 <!-- دوطرفه -->
  <p v-if="ok">بله</p> <p v-else-if="maybe">شاید</p> <p v-else>نه</p>
  <p v-show="visible">مخفی با CSS</p>
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  <div :class="{ active: isActive, 'text-red': err }" :style="{ color }"></div>
</template>
```
- `v-if` المان را اضافه/حذف می‌کند؛ `v-show` فقط `display` را عوض می‌کند.
- modifierها: `.prevent`, `.stop`, `.enter`, `.lazy` (روی v-model)، `.trim`.

## Props و Emit
```vue
<!-- Child.vue -->
<script setup lang="ts">
const props = defineProps<{ title: string; count?: number }>();
const emit = defineEmits<{ (e: "close"): void; (e: "update", v: number): void }>();
</script>
<template>
  <h3>{{ props.title }}</h3>
  <button @click="emit('close')">بستن</button>
</template>

<!-- Parent -->
<Child title="سلام" @close="show = false" />
```
### v-model روی کامپوننت
```vue
<script setup>
const model = defineModel();          // Vue 3.4+
</script>
<template><input v-model="model" /></template>
```

## Slot
```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <header><slot name="header">پیش‌فرض</slot></header>
    <slot />
  </div>
</template>

<!-- استفاده -->
<Card>
  <template #header>عنوان</template>
  محتوای اصلی
</Card>
```

## Lifecycle
```js
import { onMounted, onUnmounted, onUpdated } from "vue";
onMounted(() => console.log("mounted"));
onUnmounted(() => cleanup());
```

## Composable (معادل Custom Hook)
```js
// useMouse.js
import { ref, onMounted, onUnmounted } from "vue";
export function useMouse() {
  const x = ref(0), y = ref(0);
  const move = e => { x.value = e.pageX; y.value = e.pageY; };
  onMounted(() => addEventListener("mousemove", move));
  onUnmounted(() => removeEventListener("mousemove", move));
  return { x, y };
}
```

## Provide / Inject
```js
// والد
provide("theme", ref("dark"));
// فرزند عمیق
const theme = inject("theme");
```

## Router (Vue Router)
```js
import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/users/:id", component: () => import("./User.vue"), props: true },
  ],
});
```
```vue
<RouterLink to="/users/5">کاربر</RouterLink>
<RouterView />
<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute(); const router = useRouter();
router.push("/"); console.log(route.params.id);
</script>
```
Navigation Guard: `router.beforeEach((to, from) => { ... })`.

## State management: Pinia
```js
// stores/counter.js
import { defineStore } from "pinia";
export const useCounter = defineStore("counter", {
  state: () => ({ n: 0 }),
  getters: { double: s => s.n * 2 },
  actions: { inc() { this.n++; } },
});
// در کامپوننت: const c = useCounter(); c.inc();
```
(یا سینتکس setup store با `ref`/`computed`.)

## Options API (قدیمی‌تر ولی رایج)
```js
export default {
  data() { return { n: 0 }; },
  computed: { double() { return this.n * 2; } },
  methods: { inc() { this.n++; } },
  mounted() {},
};
```

## اکوسیستم
Vite (ابزار رسمی)، Nuxt (meta-framework)، Vuetify/PrimeVue/Element Plus (UI)، VueUse (کالکشن composable)، Vitest + Vue Test Utils، VitePress (مستندات).

## تمرین
۱. لیست کارها با Pinia.
۲. کامپوننت `BaseInput` با `v-model` و slot.
۳. دو صفحه با Vue Router و guard ساده.
