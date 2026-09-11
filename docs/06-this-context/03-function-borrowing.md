---
title: "First Principles Deep Dive: Function Borrowing dan Generic Methods"
tags:
  - javascript
  - first-principles
  - roadmap-js/06-this-context
level: intermediate
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call#using_call_to_chain_constructors_for_an_object
  - https://tc39.es/ecma262/#sec-array.prototype.slice
---

# First Principles Deep Dive: Function Borrowing dan Generic Methods

> [!ABSTRACT] The Ground Truth
> Function Borrowing adalah pemanfaatan metode generik prototipe di mana sebuah objek meminjam fungsi milik objek lain melalui `.call()` atau `.apply()` tanpa harus mewarisi rantai prototipe objek tersebut (_Duck Typing_).

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Suatu objek harus menjadi turunan class atau array murni agar bisa menggunakan metode-metode manipulasi data bawaan."
- ✅ **Masalah Sebenarnya (Core Problem)**: Di lingkungan browser, banyak struktur data yang menyerupai array (_Array-like objects_, seperti `NodeList` DOM atau objek `arguments`) namun tidak memiliki metode bawaan seperti `.slice()` atau `.filter()`. Function Borrowing adalah teknik praktis untuk memanipulasi struktur pseudo-array tersebut menggunakan algoritma yang sudah ada di `Array.prototype`.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Konsep Metode Generik (_Generic Methods_ di ECMA-262)**:
   Sebagian besar metode di `Array.prototype` (seperti `.slice()`, `.join()`, `.forEach()`) sengaja didefinisikan oleh spesifikasi sebagai _generic_. Artinya, metode tersebut tidak memvalidasi apakah `this` adalah array sejati; metode hanya mengecek apakah `this` memiliki properti `.length` dan indeks numerik (`0`, `1`, `2`, dst.). Jika ya, algoritma akan bekerja secara normal (_Duck Typing: "If it walks like a duck and quacks like a duck, treat it as a duck"_).

2. **Peminjaman Properti Aman dari `Object.prototype`**:
   Objek biasa dapat memiliki properti yang menimpa metode bawaan (misal `{ hasOwnProperty: null }`). Memanggil `obj.hasOwnProperty('key')` langsung akan memicu crash fatal. Meminjam metode langsung dari sumber aslinya melalui `Object.prototype.hasOwnProperty.call(obj, 'key')` menjamin keaslian fungsi yang dipanggil.

3. **Evolusi Standar Menuju API Statis Resmi**:
   Karena teknik peminjaman fungsi (`Array.prototype.slice.call(arguments)`) rawan membingungkan pembaca kode, komite TC39 merilis API resmi untuk menggantikannya: `Array.from()` (ES6) untuk mengonversi array-like menjadi array murni, dan `Object.hasOwn(obj, key)` (ES2022) untuk menggantikan peminjaman `hasOwnProperty`.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Pahami mekanika dasar _Function Borrowing_ untuk membaca kode arsitektur tingkat lanjut atau pustaka pihak ketiga. Namun dalam kode produksi modern, prioritaskan pemanfaatan metode resmi modern seperti **`Array.from()`** dan **`Object.hasOwn()`** yang menawarkan performa dan keterbacaan yang jauh lebih baik.

- **Contoh Konkret**:

  ```javascript
  // 1. Pola Klasik Function Borrowing (Duck Typing):
  const arrayLikeDOM = {
    0: "Card-Header",
    1: "Card-Body",
    2: "Card-Footer",
    length: 3,
  };

  // Meminjam metode .join() dari Array.prototype:
  const joinedResult = Array.prototype.join.call(arrayLikeDOM, " -> ");
  console.log(joinedResult);
  // 'Card-Header -> Card-Body -> Card-Footer'

  // 2. Bahaya Memanggil Metode Langsung pada Objek Dinamis:
  const rogueUser = {
    name: "Alex",
    // Properti ini merusak fungsi bawaan prototipe!
    hasOwnProperty: false,
  };

  // ❌ rogueUser.hasOwnProperty('name'); // CRASH: TypeError: rogueUser.hasOwnProperty is not a function

  // ✅ Rekonstruksi Aman dengan Function Borrowing Klasik:
  const hasNameClassic = Object.prototype.hasOwnProperty.call(
    rogueUser,
    "name",
  );
  console.log(hasNameClassic); // true

  // 🚀 Rekonstruksi Standar Modern (ES2022 - Bersih & Standar Resmi):
  const hasNameModern = Object.hasOwn(rogueUser, "name");
  console.log(hasNameModern); // true
  ```

- **Mengapa ini lebih baik**:
  Memahami bahwa peminjaman fungsi bekerja karena sifat _generic methods_ memberi kita wawasan mendalam tentang bagaimana internal JavaScript berinteraksi dengan memori objek. Beralih ke `Object.hasOwn()` menyingkirkan kode berbelit-belit `Object.prototype.hasOwnProperty.call` sekaligus mempertahankan keselamatan memori 100%.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Audit pemanggilan `.hasOwnProperty()` di codebase dan ganti seluruhnya dengan metode standar modern `Object.hasOwn(obj, prop)`.
- [ ] **Langkah 2**: Ketika berurusan dengan koleksi DOM lama seperti `HTMLCollection` atau `NodeList`, konversi ke array sejati memakai `Array.from(koleksiDOM)` atau operator spread `[...koleksiDOM]` sebelum memanggil filter atau map.
- [ ] **Langkah 3**: Eksperimen di DevTools: buat objek buatan sendiri `{ 0: 'a', 1: 'b', length: 2 }`, lalu coba panggil `Array.prototype.map.call(obj, x => x.toUpperCase())` untuk melihat bagaimana generic method merespons duck-typing.

> [!TIP] Parameter Kesuksesan (Success Metric)
> Topik ini selesai dieksekusi dengan benar jika: **Tidak ada lagi kemungkinan error `TypeError: obj.hasOwnProperty is not a function` pada pemrosesan objek dinamis, dan struktur array-like dapat diproses dengan aman**.

> [!WARNING] Batas Kepastian
> Meskipun metode seperti `Array.prototype.slice.call()` masih didukung penuh di semua browser untuk alasan kompatibilitas web, **pola ini dianggap sebagai idiom usang (deprecated pattern by convention)** sejak dirilisnya `Array.from()` di ECMAScript 2015.
