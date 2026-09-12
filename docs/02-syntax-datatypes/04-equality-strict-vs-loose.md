---
title: "First Principles Deep Dive: Kesetaraan Strict (===) vs Loose (==)"
tags:
  - javascript
  - first-principles
  - roadmap-js/02-syntax-datatypes
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness
  - https://tc39.es/ecma262/#sec-equality-operators
---

# First Principles Deep Dive: Kesetaraan Strict (===) vs Loose (==)

> [!NOTE]
> **The Ground Truth**
>
> Operator `===` membandingkan identitas tipe dan nilai tanpa kompromi; sedangkan operator `==` menjalankan rantai konversi tipe rekursif sebelum membandingkan, melanggar prinsip transitivitas matematika dan membuka celah bug perbandingan nilai.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "`===` hanya sekadar mengecek tipe data, sedangkan `==` mengecek nilainya."
- ✅ **Masalah Sebenarnya (Core Problem)**: Keduanya sama-sama mengecek tipe dan nilai. Perbedaannya: jika tipenya berlainan, `===` langsung berhenti dan mengembalikan `false`, sedangkan `==` menjalankan algoritma koersi berantai (_Abstract Equality Comparison_) untuk memaksakan salah satu atau kedua operan berubah tipe sampai ketemu kecocokan semu.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Algoritma `IsStrictlyEqual` (ECMA-262 §7.2.14)**:
   Engine mengevaluasi:
   - Jika `Type(x)` berbeda dengan `Type(y)`, kembalikan `false`.
   - Jika tipenya sama, periksa nilainya.
   - Pengecualian matematika spesifikasi IEEE 754: `NaN === NaN` selalu `false` (gunakan `Number.isNaN()` atau `Object.is()`), dan `+0 === -0` bernilai `true`.
   - Untuk tipe Objek: bernilai `true` HANYA jika kedua operan merujuk ke alamat memori yang sama.

2. **Algoritma `IsLooselyEqual` dan Runtuhnya Sifat Transitif**:
   Pada logika formal, jika $A = B$ dan $B = C$, maka $A = C$ (_sifat transitif_). Namun pada `==` ([ECMA-262 §7.2.13](https://tc39.es/ecma262/#sec-islooselyequal)), sifat ini runtuh:
   - `0 == ""` bernilai `true` (karena `""` dipaksa jadi angka 0).
   - `0 == "0"` bernilai `true` (karena `"0"` dipaksa jadi angka 0).
   - Namun `"" == "0"` bernilai `false` (karena kedua tipe sama-sama string, engine membandingkan isinya, dan string kosong tidak sama dengan karakter `"0"`).

3. **Aturan Khusus Pasangan `null` dan `undefined`**:
   Di dalam tabel spesifikasi `==`, aturan nomor 3 menyatakan: jika salah satu adalah `null` dan yang lain `undefined`, hasilnya selalu `true`. Keduanya tidak dianggap setara dengan nilai falsy lain (`false`, `0`, atau `""`) dalam perbandingan loose.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Gunakan operator strict equality `===` (dan `!==`) sebagai standar mutlak di seluruh basis kode. Satu-satunya skenario di mana `==` dapat ditoleransi secara kausal adalah pengecekan _nullish_ sekaligus (`value == null`), karena aturan nomor 3 spesifikasi menjamin baris ini mengecek apakah nilai bernilai `null` ATAU `undefined` hanya dalam 1 operasi ringkas.

- **Contoh Konkret**:

  ```javascript
  // Skenario: Validasi Hak Akses Pengguna
  const userRole = 0; // 0 = Guest, 1 = Member, 2 = Admin

  // ❌ Bahaya Loose Equality (==):
  if (userRole == false) {
    // 0 == false menghasilkan TRUE karena false di-coerce jadi 0!
    console.log("Salah! Guest disangka bukan pengguna aktif.");
  }

  // ✅ Rekonstruksi Strict Equality (===):
  if (userRole === 0) {
    console.log("Akses level: Guest");
  }

  // Penggunaan rasional satu-satunya untuk loose equality:
  function isNullOrUndefined(value) {
    // Sesuai ECMA-262 §7.2.13: null == undefined adalah true
    return value == null;
  }

  console.log(isNullOrUndefined(null)); // true
  console.log(isNullOrUndefined(undefined)); // true
  console.log(isNullOrUndefined(0)); // false (Aman dari bug falsy!)
  console.log(isNullOrUndefined("")); // false (Aman dari bug string kosong!)
  ```

- **Mengapa ini lebih baik**:
  Menghilangkan kebingungan kognitif dan perilaku tak-transitif. Mesin JavaScript juga dapat mengoptimasi komparasi `===` melalui _inline caching_ JIT compiler lebih cepat karena tidak perlu memeriksa pohon konversi tipe kompleks.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Pasang aturan linter (`eqeqeq: ["error", "always", { "null": "ignore" }]`) untuk secara otomatis mencegah penggunaan `==` kecuali untuk kasus `x == null`.
- [ ] **Langkah 2**: Saat membandingkan objek, sadari bahwa `{ id: 1 } === { id: 1 }` adalah `false`. Bandingkan nilai properti primitif uniknya (`a.id === b.id`), bukan objek fisiknya.
- [ ] **Langkah 3**: Untuk kasus perbandingan nilai khusus seperti membedakan `-0` dengan `+0` atau membandingkan `NaN` dengan `NaN`, gunakan metode modern `Object.is(valA, valB)`.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Tidak ada lagi bug percabangan `if` yang salah membedakan antara angka `0`, boolean `false`, string kosong `""`, dan `null`**.

> [!WARNING]
> **Batas Kepastian**
>
> Memakai idiom `value == null` untuk memeriksa `null` dan `undefined` sekaligus adalah **kesepakatan gaya pemrograman (idiomatic convention)**. Banyak tim arsitektur modern memilih menuliskan `value === null || value === undefined` secara eksplisit untuk menegakkan kepatuhan 100% pada aturan kesetaraan ketat.
