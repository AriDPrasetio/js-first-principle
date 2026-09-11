---
title: "First Principles Deep Dive: Conditional Statements (if/else, switch, short-circuit)"
tags:
  - javascript
  - first-principles
  - roadmap-js/04-control-flow
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
  - https://tc39.es/ecma262/#sec-if-statement
---

# First Principles Deep Dive: Conditional Statements (if/else, switch, short-circuit)

> [!ABSTRACT] The Ground Truth
> Pernyataan kondisional adalah instruksi percabangan tingkat mesin (_branching jump_) yang mengevaluasi kebenaran leksikal (`ToBoolean`) atau kecocokan kesetaraan ketat untuk menentukan blok instruksi mana yang akan dieksekusi oleh CPU selanjutnya.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Gunakan operator logika `||` untuk memberikan nilai default pada variabel opsional."
- ✅ **Masalah Sebenarnya (Core Problem)**: Operator `||` mengevaluasi semua nilai _falsy_. Jika sebuah konfigurasi valid memiliki nilai `0` (misal kuantitas nol) atau string kosong `""` atau `false`, operator `||` keliru menganggapnya tidak ada dan menimpanya dengan nilai default. Masalah ini secara fundamental dipecahkan oleh _Nullish Coalescing (`??`)_ yang hanya mengecek `null` dan `undefined`.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Operasi Abstrak `ToBoolean` (ECMA-262 §7.1.2)**:
   Di dalam pernyataan `if (expression)`, engine secara mutlak memanggil operasi abstrak `ToBoolean`. Hanya ada 8 nilai falsy di seluruh JavaScript: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, dan `NaN`. Seluruh nilai lain di alam semesta JavaScript (termasuk objek kosong `{}` dan array kosong `[]`) menghasilkan `true`.

2. **Mekanisme Evaluasi Sirkuit Pendek (_Short-Circuit Evaluation_)**:
   - Operator `&&` (`a && b`): Jika `ToBoolean(a)` adalah `false`, engine langsung mengembalikan nilai asli `a` tanpa mengevaluasi `b`.
   - Operator `||` (`a || b`): Jika `ToBoolean(a)` adalah `true`, engine langsung mengembalikan nilai asli `a` tanpa mengevaluasi `b`.
   - Operator `??` (`a ?? b`): Spesifikasi [ECMA-262 §13.13](https://tc39.es/ecma262/#sec-conditional-operator) menegaskan: hanya jika `a` bernilai `null` atau `undefined`, barulah ekspresi `b` dievaluasi.

3. **Mekanisme Kesetaraan Ketat pada `switch`**:
   Pernyataan `switch (expression)` membandingkan ekspresi kasus (`case value:`) menggunakan algoritma kesetaraan ketat `===` (_Strict Equality_). Tanpa pernyataan `break`, engine akan terus mengeksekusi kasus berikutnya tanpa melakukan komparasi (_fall-through_).

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Gunakan _Guard Clauses (Early Return Pattern)_ alih-alih menyusun piramida sarang `if-else` yang dalam (_Pyramid of Doom_). Ketika menetapkan nilai default konfigurasi komponen antarmuka, ganti operator `||` dengan operator nullish coalescing `??` untuk mencegah kecacatan data saat nilai `0` atau `false` sah digunakan.

- **Contoh Konkret**:

  ```javascript
  // Skenario: Konfigurasi Komponen Modal Dialog UI
  function createModalConfig(options = {}) {
    // 1. Guard Clause: Evaluasi dini kondisi invalid
    if (typeof options !== "object" || options === null) {
      throw new TypeError("Options harus berupa objek konfigurasi.");
    }

    // 2. Rekonstruksi Nilai Default dengan Nullish Coalescing (??)
    // Jangan gunakan || karena delayMs = 0 akan tertimpa menjadi 300!
    const delayMs = options.delayMs ?? 300;
    const showBackdrop = options.showBackdrop ?? true;
    const title = options.title ?? "Notifikasi Standar";

    return {
      title,
      delayMs,
      showBackdrop,
    };
  }

  // Pengujian First Principles:
  const customModal = createModalConfig({ delayMs: 0, showBackdrop: false });
  console.log(customModal.delayMs); // 0 (Tetap 0! Tidak tertimpa 300)
  console.log(customModal.showBackdrop); // false (Tetap false! Tidak tertimpa true)
  ```

- **Mengapa ini lebih baik**:
  Pola _Guard Clauses_ meratakan kedalaman indentasi kode (menjaga kompleksitas siklomatis tetap rendah), sedangkan pemakaian `??` memastikan nilai batas matematis seperti `0` dan boolean `false` dihormati secara tepat oleh sistem.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Audit seluruh pembacaan opsi konfigurasi di kode dan gantikan pola usang `const timeout = opts.timeout || 1000` menjadi `const timeout = opts.timeout ?? 1000`.
- [ ] **Langkah 2**: Refaktorisasi fungsi dengan sarang `if-else` lebih dari 2 tingkat menggunakan teknik _Early Return_ (cek kondisi kegagalan di baris awal, lalu return seketika).
- [ ] **Langkah 3**: Pada percabangan dengan banyak nilai diskrit (seperti penanganan kode status HTTP atau tipe action tombol), pertimbangkan kamus objek pemetaan (_object lookup_) sebagai pengganti `switch` yang rentan bug _fall-through_.

> [!TIP] Parameter Kesuksesan (Success Metric)
> Topik ini selesai dieksekusi dengan benar jika: **Tidak ada fungsi dengan kedalaman indentasi `if` lebih dari 2 tingkat, dan penetapan nilai default tidak merusak angka `0` atau boolean `false`**.

> [!WARNING] Batas Kepastian
> Memilih antara `if/else`, `switch`, atau _object lookup map_ adalah **preferensi gaya arsitektur dan keterbacaan**. Secara performa pada aplikasi frontend umum, perbedaan kecepatan eksekusi ketiganya di browser modern tidak signifikan.
