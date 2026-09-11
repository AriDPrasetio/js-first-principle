---
title: "First Principles Deep Dive: Type Casting (Coercion vs Conversion)"
tags:
  - javascript
  - first-principles
  - roadmap-js/02-syntax-datatypes
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion
  - https://developer.mozilla.org/en-US/docs/Glossary/Type_conversion
  - https://tc39.es/ecma262/#sec-type-conversion
---

# First Principles Deep Dive: Type Casting (Coercion vs Conversion)

> [!ABSTRACT] The Ground Truth
> Komputasi hanya dapat terjadi di antara nilai-nilai dengan tipe data yang kompatibel; jika tipenya berlainan, engine JavaScript akan mengonversinya secara otomatis (*Implicit Coercion*) berdasarkan algoritma abstrak spesifikasi, atau developer melakukannya secara sengaja (*Explicit Conversion*).

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Type coercion di JavaScript bersifat acak, magis, dan tidak masuk akal (seperti meme `'5' - 3 = 2`, tapi `'5' + 3 = '53'`)."
- ✅ **Masalah Sebenarnya (Core Problem)**: Coercion tidak acak sama sekali; perilakunya diatur secara deterministik oleh empat operasi abstrak formal di spesifikasi ECMA-262: `ToPrimitive`, `ToNumber`, `ToString`, dan `ToBoolean`. Kebingungan developer timbul karena operator `+` memiliki fungsi ganda (*overloaded*): penjumlahan aritmatika angka atau penyambungan teks string.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Perbedaan Konversi Eksplisit vs Implisit (ECMA-262 §7.1)**:
   - **Konversi Eksplisit (*Type Conversion*)**: Developer memanggil fungsi pembungkus secara sadar (`Number('42')`, `String(100)`, `Boolean(x)`) tanpa kata kunci `new`.
   - **Konversi Implisit (*Type Coercion*)**: Engine secara otomatis mengeksekusi operasi abstrak di belakang layar ketika sebuah operator bertemu dengan operan yang tidak sesuai tipenya.

2. **Dua Wajah Operator Penjumlahan `+`**:
   Sesuai aturan evaluasi operasi penambahan [ECMA-262 §13.15.1](https://tc39.es/ecma262/#sec-addition-operator-plus):
   - Jika **salah satu operan** menghasilkan string (setelah diproses lewat `ToPrimitive`), engine memaksa kedua operan dikonversi menjadi string via `ToString` dan menyambungkannya (*concatenation*). Contoh: `'5' + 3` -> `'5' + '3'` -> `'53'`.
   - Sebaliknya, operator aritmatika lain (`-`, `*`, `/`, `%`) **hanya terdefinisi untuk angka**. Engine langsung memanggil `ToNumber` pada kedua operan. Contoh: `'5' - 3` -> `5 - 3` -> `2`.

3. **Algoritma Abstraksi `ToPrimitive` dan Nilai Objek**:
   Ketika objek/array dipaksa menjadi nilai primitif (misal `[] + {}`), engine mengeksekusi `ToPrimitive(input, preferredType)`. Engine mencoba memanggil metode secara berurutan: `[Symbol.toPrimitive]()`, lalu `valueOf()`, dan terakhir `toString()`. Karena `[].toString()` menghasilkan `""` (string kosong) dan `{}.toString()` menghasilkan `"[object Object]"`, maka `[] + {}` menghasilkan `"[object Object]"`.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Terapkan aturan *Zero Implicit Coercion* pada lapisan komputasi bisnis. Nilai dari input HTML (misalnya `<input type="number">` yang di browser selalu mengembalikan string melalui `inputElement.value`) WAJIB diubah secara eksplisit sebelum dilakukan kalkulasi, menggunakan fungsi standar `Number(val)` atau `parseInt(val, 10)`.

- **Contoh Konkret**:

  ```javascript
  // Skenario: Form Belanja Total Harga
  const inputQuantity = "3"; // Nilai string dari input form
  const itemPrice = 15000;    // Angka

  // ❌ Bahaya Coercion Implisit:
  const badTax = 500;
  const badTotal = inputQuantity * itemPrice + badTax; 
  // Evaluasi: ("3" * 15000) -> 45000 (ToNumber), lalu 45000 + 500 -> 45500.
  // Tetapi jika badTax tidak sengaja berupa string "500", hasilnya: "45000500"!

  // ✅ Rekonstruksi Eksplisit (Deterministik & Aman):
  const parsedQuantity = Number(inputQuantity);

  if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
    throw new Error("Kuantitas harus berupa angka valid.");
  }

  const cleanTotal = (parsedQuantity * itemPrice) + Number(badTax);
  console.log(`Total: Rp${cleanTotal.toLocaleString('id-ID')}`);
  ```

- **Mengapa ini lebih baik**:
  Menghilangkan ketergantungan pada *type coercion* implisit mencegah bug perhitungan finansial atau validasi logika. Kode menjadi *self-documenting*: pembaca kode langsung tahu bahwa tipe data yang diproses dijamin bertipe angka.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Evaluasi tabel falsy fundamental di memori JavaScript: hanya ada 8 nilai yang bernilai falsy saat dioperasikan via `Boolean()`: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, dan `NaN`. Semua nilai lainnya (termasuk array kosong `[]` dan objek kosong `{}`) adalah truthy!
- [ ] **Langkah 2**: Baca nilai dari formulir DOM menggunakan `const num = Number(input.value)` alih-alih memanfaatkan konversi implisit trik plus unary (`+input.value`).
- [ ] **Langkah 3**: Gunakan `Number.isNaN(val)` alih-alih fungsi global lama `isNaN(val)`, karena fungsi global `isNaN('hello')` melakukan koersi implisit yang menghasilkan `true`, sedangkan `Number.isNaN('hello')` secara presisi mengembalikan `false` (karena ia bukan tipe NaN sejati).

> [!TIP] Parameter Kesuksesan (Success Metric)
> Topik ini selesai dieksekusi dengan benar jika: **Tidak ada lagi bug penjumlahan string (`'10' + 5 = '105'`) saat mengambil nilai dari input form antarmuka web**.

> [!WARNING] Batas Kepastian
> Penggunaan unary plus (`+val`) atau double-not (`!!val`) adalah **idiom sintaks ringkas yang populer di industri**, bukan keharusan bahasa. Secara first principles, pemanggilan fungsi eksplisit `Number(val)` dan `Boolean(val)` lebih minim ambiguitas semantik bagi keterbacaan tim.
