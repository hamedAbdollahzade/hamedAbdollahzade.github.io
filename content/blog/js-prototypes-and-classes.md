---
title: Prototype و Class
description: Prototype و Class؛ آموزش JavaScript به زبان ساده، همراه با مثال و خروجی.
date: 2026-11-06
category: JavaScript
order: 21
---

## زنجیره‌ی Prototype

هر object یه لینک پنهان به object دیگه‌ای به اسم **prototype** داره. وقتی ویژگی‌ای پیدا نشه، JS در زنجیره‌ی prototype بالا می‌ره تا `null`.

```js
const animal = { eats: true, walk() { return "راه می‌ره"; } };
const rabbit = { jumps: true, __proto__: animal };

rabbit.jumps;    // → true  (خودش)
rabbit.eats;     // → true  (از animal)
rabbit.walk();   // → "راه می‌ره"
rabbit.toString; // از Object.prototype
```
```
rabbit → animal → Object.prototype → null
```

### API های prototype
```js
Object.getPrototypeOf(rabbit) === animal;   // → true
Object.setPrototypeOf(rabbit, animal);      // کند، پرهیز
const o = Object.create(animal);            // ساخت با prototype مشخص
animal.isPrototypeOf(rabbit);               // → true
rabbit instanceof Object;                   // → true
Object.hasOwn(rabbit, "eats");              // → false (ارثیه)
```
> `__proto__` قدیمیه؛ از `Object.getPrototypeOf` استفاده کن.

### نوشتن روی ارث
نوشتن همیشه روی **خود object** انجام می‌شه، نه prototype:
```js
rabbit.eats = false;   // ویژگی جدید روی rabbit؛ animal دست‌نخورده
```

## Constructor Function (روش قدیمی)
```js
function Person(name) {
  this.name = name;
}
Person.prototype.hello = function () {
  return `سلام ${this.name}`;
};

const p = new Person("Ali");
p.hello();                                // → "سلام Ali"
Object.getPrototypeOf(p) === Person.prototype; // → true
p.constructor === Person;                 // → true
```
`new` چه کار می‌کنه:
1. object خالی می‌سازه.
2. prototype اون رو `Person.prototype` می‌ذاره.
3. تابع رو با `this` = اون object اجرا می‌کنه.
4. اگه تابع object برنگردونه، همون object جدید رو برمی‌گردونه.

### وراثت با prototype (قدیمی)
```js
function Student(name, grade) {
  Person.call(this, name);
  this.grade = grade;
}
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;
```

---

## Class (ES6)
قند نحوی (syntactic sugar) روی همون prototype:

```js
class Person {
  // فیلد عمومی
  species = "human";
  // فیلد خصوصی
  #secret = 42;
  // فیلد استاتیک
  static count = 0;

  constructor(name, age) {
    this.name = name;
    this.age = age;
    Person.count++;
  }

  // متد نمونه (روی prototype)
  greet() {
    return `سلام، من ${this.name} هستم`;
  }

  // getter / setter
  get isAdult() { return this.age >= 18; }
  set nickname(v) { this._nick = v.trim(); }

  // متد خصوصی
  #hash() { return this.#secret * 2; }
  reveal() { return this.#hash(); }

  // متد استاتیک
  static create(name) { return new Person(name, 0); }

  // بلوک استاتیک
  static { Person.ready = true; }

  toString() { return `Person(${this.name})`; }
}

const p = new Person("Ali", 20);
p.greet();         // → "سلام، من Ali هستم"
p.isAdult;         // → true
Person.create("X");
Person.count;      // → 2
// p.#secret       // ❌ SyntaxError (خصوصی)
`${p}`;            // → "Person(Ali)"
typeof Person;     // → "function"
// Person()        // ❌ TypeError: Class constructor cannot be invoked without 'new'
```
بررسی وجود فیلد خصوصی: `#secret in obj`.

### وراثت: `extends` و `super`
```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} صدایی می‌ده`; }
  static kind() { return "animal"; }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);                 // قبل از this حتماً صدا بزن
    this.breed = breed;
  }
  speak() {
    return super.speak() + " : واق واق";   // فراخوانی متد والد
  }
}

const d = new Dog("Rex", "Lab");
d.speak();                  // → "Rex صدایی می‌ده : واق واق"
d instanceof Dog;           // → true
d instanceof Animal;        // → true
Dog.kind();                 // → "animal" (static هم ارث می‌رسه)
```
وراثت از built-in ها:
```js
class Stack extends Array {
  peek() { return this[this.length - 1]; }
}
const s = new Stack(); s.push(1, 2);
s.peek();   // → 2
```

### کلاس انتزاعی (روش دستی)
```js
class Shape {
  constructor() {
    if (new.target === Shape) throw new Error("Shape انتزاعیه");
  }
  area() { throw new Error("باید پیاده‌سازی بشه"); }
}
```

### Mixin
```js
const Serializable = (Base) =>
  class extends Base {
    serialize() { return JSON.stringify(this); }
  };
const Eventful = (Base) =>
  class extends Base {
    on(e, fn) { (this.h ??= {})[e] = fn; }
  };

class User {}
class SuperUser extends Eventful(Serializable(User)) {}
```

### Getter/Setter و Encapsulation
```js
class Temp {
  #c = 0;
  get f() { return this.#c * 1.8 + 32; }
  set f(v) { this.#c = (v - 32) / 1.8; }
}
```

### ترتیب فیلدها و `this`
متدهایی که به‌عنوان callback پاس داده می‌شن this رو از دست می‌دن:
```js
class Btn {
  label = "OK";
  click = () => this.label;   // arrow field: this ثابته
}
```

---

## ترکیب به‌جای وراثت (Composition)
```js
const canFly = (o) => ({ fly: () => `${o.name} پرواز می‌کنه` });
const canSwim = (o) => ({ swim: () => `${o.name} شنا می‌کنه` });

const makeDuck = (name) => {
  const self = { name };
  return Object.assign(self, canFly(self), canSwim(self));
};
makeDuck("Donald").fly();
```
> «ترکیب رو به وراثت ترجیح بده.» وراثت عمیق انعطاف‌پذیری رو کم می‌کنه.

## الگوهای ساخت object

| الگو | نمونه |
|---|---|
| Factory function | `const make = (n) => ({ n })` |
| Constructor + prototype | `function P(){}; P.prototype.m = …` |
| Class | `class P {}` |
| `Object.create` | `Object.create(proto)` |
| Singleton | `export default new Service()` |

## `instanceof` و `Symbol.hasInstance`
```js
class Even { static [Symbol.hasInstance](n) { return n % 2 === 0; } }
2 instanceof Even;   // → true
```

## مرور
- class ها در پشت صحنه از prototype استفاده می‌کنن.
- متدها روی `Class.prototype` هستن (به اشتراک گذاشته می‌شن)، فیلدها روی هر نمونه.
- `#private` واقعاً خصوصیه، `_underscore` فقط قراردادیه.
- ارث‌بری از چند class مستقیماً ممکن نیست؛ از mixin و composition استفاده کن.
