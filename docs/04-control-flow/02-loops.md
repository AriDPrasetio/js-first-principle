---
title: "First Principles Deep Dive: Perulangan (Loops & Iteration Protocols)"
tags:
  - javascript
  - first-principles
  - roadmap-js/04-control-flow
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
  - https://tc39.es/ecma262/#sec-iteration-statements
---

# First Principles Deep Dive: Perulangan (Loops & Iteration Protocols)

> [!NOTE]
> **The Ground Truth**
>
> Perulangan adalah instruksi lompat siklis (_cyclic jump_) terarah yang digerakkan oleh indeks numerik, kondisi batas boolean, atau penelusuran kontrak antarmuka _Iterable Protocol_ (`[Symbol.iterator]`).

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "`for...in` dan `for...of` itu mirip dan bisa saling menggantikan saat menelusuri array atau daftar elemen."
- ✅ **Masalah Sebenarnya (Core Problem)**: Keduanya memiliki mekanisme dasar yang bertolak belakang: `for...in` mengiterasi _nama properti/kunci_ dari objek hingga ke rantai prototipe atasnya (_prototype chain_), sedangkan `for...of` mengonsumsi _isi nilai_ dari struktur data yang mematuhi protokol `[Symbol.iterator]` (Array, Set, Map, NodeList). Menggunakan `for...in` pada Array adalah sumber bug performa dan bug tipe data.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Kontrak Resmi Protokol Iterasi (_Iteration Protocols_ - ECMA-262 §27.1)**:
   Agar suatu objek dapat diulang dengan `for...of`, objek tersebut wajib memiliki metode di kunci `[Symbol.iterator]` yang mengembalikan objek iterator dengan fungsi `.next()`. Setiap panggilan `.next()` mengembalikan objek berpasangan `{ value: Any, done: Boolean }` hingga `done === true`.

2. **Bahaya Penelusuran Rantai Prototipe pada `for...in`**:
   Sintaks `for...in` mengevaluasi seluruh properti yang memiliki atribut leksikal `enumerable: true`, **termasuk properti yang diwariskan dari prototipe induknya**. Selain itu, urutan penelusuran pada `for...in` tidak dijamin konsisten antar engine, dan kunci indeks array dikembalikan sebagai tipe `string`, bukan `number`.

3. **Pengikatan Leksikal Per-Iterasi (_Per-Iteration Lexical Binding_)**:
   Pada loop klasik `for (let i = 0; i < n; i++)`, spesifikasi mewajibkan engine menciptakan _Environment Record_ leksikal baru untuk variabel `let i` di setiap putaran perulangan. Itulah sebabnya fungsi asinkron atau event listener di dalam loop `let` dapat mengingat nilai `i` yang tepat, sedangkan loop berbasis `var i` selalu terjebak pada nilai akhir.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  - Gunakan **`for...of`** sebagai pilihan utama untuk menelusuri koleksi berurutan (Array, NodeList DOM) karena sintaksnya deklaratif, aman dari polusi prototipe, dan mendukung interupsi dini menggunakan `break` atau `continue`.
  - Gunakan **`Object.keys()`**, **`Object.values()`**, atau **`Object.entries()`** dikombinasikan dengan `for...of` untuk menelusuri objek biasa, menghindari risiko pewarisan `for...in`.
  - Gunakan loop indeks klasik `for` hanya pada algoritma performa kritis (_hot path_) yang membutuhkan penghematan alokasi memori objek iterator.

- **Contoh Konkret**:

  ```javascript
  // Skenario: Menelusuri NodeList DOM dan Menghentikan Proses Dini
  const navigationItems = ["Home", "Products", "About", "Contact"];

  // ✅ Rekonstruksi Aman dengan for...of (Mendukung break & continue):
  for (const item of navigationItems) {
    if (item === "About") {
      continue; // Lewati item ini
    }

    if (item === "Contact") {
      break; // Hentikan perulangan seketika jika kondisi terpenuhi
    }

    console.log(`Render Menu: ${item}`);
  }

  // ✅ Menelusuri Objek secara Aman tanpa for...in:
  const themeTokens = {
    colorPrimary: "#0055ff",
    colorSurface: "#ffffff",
    spacingBase: "8px",
  };

  // Hanya membaca properti milik sendiri (Own Properties), bukan prototipe:
  for (const [tokenName, tokenValue] of Object.entries(themeTokens)) {
    console.log(`CSS Variable: --${tokenName} => ${tokenValue}`);
  }
  ```

- **Mengapa ini lebih baik**:
  Metode ini kebal terhadap modifikasi prototipe pihak ketiga yang mungkin mencemari `Object.prototype`. Kemampuan `break` dan `continue` pada `for...of` jauh lebih hemat CPU dibandingkan metode array `.forEach()` yang tidak dapat dihentikan di tengah jalan.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Larang penggunaan `for...in` pada array di seluruh proyek; gunakan `for...of` atau metode iterasi fungsional (`map`/`forEach`).
- [ ] **Langkah 2**: Jika terpaksa menggunakan `for...in` pada objek dinamis, selalu lindungi pembacaan dengan `Object.hasOwn(obj, key)` untuk memastikan kunci tersebut bukan warisan prototipe.
- [ ] **Langkah 3**: Manfaatkan `for...of` untuk menelusuri hasil selektor DOM `document.querySelectorAll()` tanpa perlu mengonversinya terlebih dahulu dengan `Array.from()`, karena `NodeList` modern sudah mengimplementasikan `[Symbol.iterator]`.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Tidak ada perulangan array yang menggunakan `for...in`, dan loop dapat diinterupsi tepat waktu menggunakan `break` saat target pencarian ditemukan**.

> [!WARNING]
> **Batas Kepastian**
>
> Metode array fungsional seperti `.forEach()` atau `.map()` sering kali dianggap lebih "modern" di industri, namun secara First Principles, **`for...of` adalah konstruksi bahasa yang lebih mendasar**, mendukung alur asinkron (`await` di dalam loop), dan lebih hemat alokasi fungsi closure.
