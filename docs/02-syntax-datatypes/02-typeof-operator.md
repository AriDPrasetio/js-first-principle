---
title: "First Principles Deep Dive: Operator typeof"
tags: "javascript, first-principles, roadmap-js/02-syntax-datatypes"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof"
---

# First Principles Deep Dive: Operator typeof

> [!NOTE]
> **The Ground Truth**
>
> Operator `typeof` adalah operasi evaluasi tingkat rendah di engine JavaScript yang membaca penanda tipe biner (_type tag_) dari sebuah slot memori dan mengembalikan nama kategorinya dalam bentuk string primitif.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "`typeof` adalah alat validasi tipe yang andal dan lengkap untuk seluruh struktur data di JavaScript."
- ✅ **Masalah Sebenarnya (Core Problem)**: JavaScript adalah bahasa _dynamically typed_; tipe terikat pada nilai (_value_), bukan pada nama variabel. Engine membutuhkan operator cepat untuk memeriksa kategori nilai secara instan, namun `typeof` memiliki batasan historis struktural sehingga tidak mampu membedakan array, null, atau objek biasa secara granular.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Tabel Pemetaan Resmi ECMA-262 (Tabel Penanda Tipe)**:
   Sesuai spesifikasi [ECMA-262 §13.5.3](https://tc39.es/ecma262/#sec-typeof-operator), operator `typeof` hanya menghasilkan 8 kemungkinan string: `"undefined"`, `"boolean"`, `"number"`, `"bigint"`, `"string"`, `"symbol"`, `"function"`, dan `"object"`.

2. **Cacat Warisan Arsitektur: Anomali `typeof null === 'object'`**:
   Pada implementasi awal mesin JavaScript (Brendan Eich, 1995), nilai disimpan dengan format penanda tipe biner di 3 bit terbawah. Tipe _Object_ ditandai dengan bit `000`. Nilai `null` direpresentasikan sebagai pointer kosong (_NULL pointer_, bernilai biner `0x00...00`). Karena seluruh bitnya 0, 3 bit terbawahnya adalah `000`, sehingga `typeof` keliru mengidentifikasinya sebagai objek. Usulan perbaikan di TC39 (Harmonization) ditolak secara permanen demi menjaga kompatibilitas mundur (_backward compatibility_) web global.

3. **Pembedaan Objek Bereksekusi (`[[Call]]`)**:
   Fungsi di JavaScript sejatinya adalah objek. Namun, jika suatu objek mengimplementasikan metode internal `[[Call]]`, spesifikasi mewajibkan `typeof` mengembalikan `"function"`, bukan `"object"`. Sebaliknya, objek tanpa `[[Call]]` (seperti `Array`, `Date`, `RegExp`, atau Objek biasa) semuanya dikembalikan sebagai `"object"`.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Jangan pernah gunakan `typeof` sendirian untuk memvalidasi data kompleks atau input pengguna. Bangun fungsi penentu tipe granular (_type-guard_) sendiri berbasis logika kausal: periksa `null` dengan kesetaraan ketat `=== null`, periksa array dengan `Array.isArray()`, dan gunakan `typeof` hanya untuk memeriksa primitif dasar (`string`, `number`, `boolean`, `undefined`, `function`).

- **Contoh Konkret**:

  ```javascript
  // Modul Pemeriksa Tipe Presisi (First-Principles Type Guard)
  function getExactType(value) {
    // 1. Tangani bug historis null
    if (value === null) return "null";

    // 2. Tangani primitif dan fungsi yang ditandai benar oleh engine
    const baseType = typeof value;
    if (baseType !== "object") {
      return baseType; // 'string', 'number', 'boolean', 'undefined', 'function', 'symbol', 'bigint'
    }

    // 3. Tangani koleksi spesifik array (WHATWG & ECMA standar)
    if (Array.isArray(value)) return "array";

    // 4. Untuk objek bawaan lainnya, intip tag prototipe internal [[Class]]
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
  }

  // Pengujian:
  console.log(getExactType(null)); // 'null' (Bukan lagi 'object'!)
  console.log(getExactType([1, 2, 3])); // 'array'
  console.log(getExactType("Hello")); // 'string'
  console.log(getExactType(new Date())); // 'date'
  console.log(getExactType({ id: 1 })); // 'object'
  ```

- **Mengapa ini lebih baik**:
  Dengan memahami cacat desain biner `typeof null`, kita tidak akan terjebak bug legendaris `if (typeof data === 'object') data.prop` yang memicu error fatal `Cannot read properties of null` saat data bernilai `null`.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Uji coba di DevTools Console: ketik `typeof null`, `typeof []`, `typeof {}`, dan `typeof NaN`. Catat bahwa `NaN` mengembalikan `"number"` dan array mengembalikan `"object"`.
- [ ] **Langkah 2**: Tulis pemeriksaan keberadaan variabel yang aman: gunakan `typeof undeclaredVar === 'undefined'` karena `typeof` adalah satu-satunya operator yang tidak melempar `ReferenceError` pada variabel yang belum dideklarasikan.
- [ ] **Langkah 3**: Gantikan seluruh pemeriksaan array lama (`typeof arr === 'object'`) di codebase dengan metode standar resmi `Array.isArray(arr)`.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Tidak ada lagi error runtime `TypeError: Cannot read properties of null` di logika validasi data aplikasi**.

> [!WARNING]
> **Batas Kepastian**
>
> Perilaku `typeof null === 'object'` secara resmi tercantum dalam spesifikasi standar ECMA-262 sebagai komitmen keabadian web (_web compatibility_), sehingga perilaku ini **bukan lagi sekadar bug tak disengaja, melainkan hukum spesifikasi resmi** yang wajib dipertahankan browser selamanya.
