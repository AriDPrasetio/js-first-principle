---
title: "First Principles Deep Dive: Function Declaration, Expression, dan Arrow Function"
tags: "javascript, first-principles, roadmap-js/05-functions"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions"
---

# First Principles Deep Dive: Function Declaration, Expression, dan Arrow Function

> [!NOTE]
> **The Ground Truth**
>
> Fungsi di JavaScript adalah objek tingkat pertama (_first-class object_) yang dilengkapi slot eksekusi internal `[[Call]]`; perbedaannya terletak pada waktu inisialisasi di memori (_Declaration_ vs _Expression_) serta kehadiran konteks leksikal `this` dan kemampuan konstruktor (_Arrow Function_).

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Arrow function hanyalah versi singkat yang lebih keren dari fungsi biasa dan harus selalu dipakai di mana saja."
- ✅ **Masalah Sebenarnya (Core Problem)**: Arrow function bukan sekadar pemendekan sintaks. Secara fundamental, arrow function **tidak memiliki pengikatan `this`, `arguments`, `super`, maupun `new.target` miliknya sendiri**. Menggunakannya secara membabi buta sebagai metode objek atau prototipe akan merusak resolusi konteks `this`.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Slot Internal Objek Fungsi (`[[Call]]` vs `[[Construct]]`)**:
   - Fungsi biasa (`function`) memiliki slot internal `[[Call]]` (memungkinkannya dipanggil sebagai fungsi biasa) dan slot `[[Construct]]` (memungkinkannya dipanggil dengan `new` untuk membuat instans).
   - Arrow function (`() => {}`) **hanya memiliki slot `[[Call]]`**. Memanggil arrow function dengan `new` melempar `TypeError: ... is not a constructor`. Arrow function juga tidak memiliki properti `.prototype`.

2. **Perbedaan Gramatikal & Fase Inisialisasi Memori (Declaration vs Expression)**:
   - **Function Declaration (`function foo() {}`)**: Secara gramatikal adalah sebuah **Statement** (pernyataan formal, lihat [Expressions vs Statements](../02-syntax-datatypes/00-expressions-vs-statements.md)). Engine menginisialisasinya secara utuh bersama tubuh fungsinya ke _Environment Record_ saat _Creation Phase_. Oleh karena itu, fungsi dapat dipanggil di baris mana pun sebelum posisinya di kode (*hoisted* penuh).
   - **Function Expression (`const foo = function() {}`)**: Secara gramatikal adalah sebuah **Expression** (ekspresi nilai). Objek fungsi dibuat sebagai nilai kelas satu yang ditugaskan ke sebuah variabel penampung. Variabel penampung tunduk pada aturan deklarasi variabel dan _Temporal Dead Zone (TDZ)_, sehingga fungsi baru terbentuk di memori saat baris penugasan tersebut dieksekusi.

3. **Mekanisme Pewarisan Leksikal `this` pada Arrow Function**:
   Spesifikasi [ECMA-262 §15.3](https://tc39.es/ecma262/#sec-arrow-function-definitions) mendefinisikan bahwa arrow function tidak mengevaluasi _ThisBinding_ saat dipanggil. Nilai `this` di dalam arrow function diselesaikan secara leksikal dari _Scope Chain_ terdekat persis seperti variabel biasa.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  - Gunakan **Function Declaration** untuk fungsi utama tingkat modul atau API publik komponen karena hoisting memungkinkan struktur keterbacaan kode dari atas ke bawah.
  - Gunakan **Arrow Function** untuk _callback_ sementara (seperti di `.map()`, `.filter()`, atau handler timer) di mana kita ingin mempertahankan nilai `this` dari lingkungan leksikal luarnya tanpa trik kuno `var that = this` atau pemanggilan `.bind(this)`.
  - Hindari Arrow Function untuk metode objek dinamis yang membutuhkan `this` merujuk ke objek pemanggilnya.

- **Contoh Konkret**:

  ```javascript
  // 1. Function Declaration: Arsitektur Tingkat Atas (Hoisted)
  function initUserCard(userName) {
    return {
      userName,
      // 2. Metode Objek: Wajib Fungsi Biasa agar 'this' merujuk ke objek ini
      greetRegular() {
        return `Halo, saya ${this.userName}`;
      },
      // ❌ Jangan gunakan arrow function di sini:
      // greetArrow: () => `Halo, saya ${this.userName}` // 'this' bocor ke global/undefined!

      // 3. Arrow Function: Sempurna untuk callback asinkron internal
      delayedGreet() {
        setTimeout(() => {
          // 'this' diwarisi secara leksikal dari konteks delayedGreet()!
          console.log(`[Asinkron] Selamat datang kembali, ${this.userName}`);
        }, 100);
      },
    };
  }

  const card = initUserCard("Aria");
  console.log(card.greetRegular()); // 'Halo, saya Aria'
  card.delayedGreet(); // Menampilkan log dengan nama yang benar
  ```

- **Mengapa ini lebih baik**:
  Memilih jenis fungsi berdasarkan slot internal engine melenyapkan dua kategori bug paling fatal di frontend: error pemanggilan sebelum inisialisasi pada ekspresi, dan error hilangnya referensi `this` saat fungsi dioper ke timer atau event listener.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Audit deklarasi metode di objek atau class: pastikan tidak ada arrow function yang dipakai sebagai metode objek jika metode tersebut perlu membaca properti via `this`.
- [ ] **Langkah 2**: Gunakan arrow function pada seluruh fungsi transformasi array (`arr.map(x => x * 2)`) untuk sintaks ringkas dan pencegahan kebocoran konteks.
- [ ] **Langkah 3**: Uji di console: panggil `new (() => {})()` dan amati pesan error eksplisit `TypeError: (...) is not a constructor` untuk memverifikasi ketiadaan slot `[[Construct]]`.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Tidak ada lagi penggunaan trik kuno `.bind(this)` atau `var self = this`, dan semua metode objek merujuk ke konteks objeknya secara tepat**.

> [!WARNING]
> **Batas Kepastian**
>
> Preferensi menulis seluruh fungsi menggunakan sintaks ekspresi panah (`const myFunc = () => {}`) adalah **tren gaya penulisan populer di ekosistem React modern**, namun bukan aturan First Principles web platform. Mengetahui perbedaan mekanismenya jauh lebih penting daripada memaksakan satu gaya secara kaku.
