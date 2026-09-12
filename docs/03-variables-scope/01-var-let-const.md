---
title: "First Principles Deep Dive: var, let, dan const"
tags:
  - javascript
  - first-principles
  - roadmap-js/03-variables-scope
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var
  - https://tc39.es/ecma262/#sec-declarations-and-the-variable-statement
---

# First Principles Deep Dive: var, let, dan const

> [!NOTE]
> **The Ground Truth**
>
> Deklarasi variabel adalah mekanisme pendaftaran nama identifier ke dalam _Environment Record_ memori; kata kunci yang dipilih menentukan apakah pengikatan (_binding_) bersifat dapat diubah (_mutable_), terikat pada cakupan blok atau fungsi, serta apakah ia mencemari objek global.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "`const` membuat nilai menjadi benar-benar konstan dan tidak bisa diubah sama sekali."
- ✅ **Masalah Sebenarnya (Core Problem)**: `const` hanya mengunci _alamat pengikatan (variable binding)_, bukan isi nilainya. Jika nilai yang diikat adalah objek atau array di heap memory, isi propertinya tetap dapat dimutasi secara bebas kecuali dibekukan secara eksplisit menggunakan `Object.freeze()`.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Struktur Penyimpanan Environment Record (ECMA-262 §9.1.1)**:
   - Variabel yang dideklarasikan dengan `var` di tingkat global didaftarkan langsung ke _Object Environment Record_, yang berarti variabel tersebut secara otomatis menjadi properti objek global browser (`window.namaVariabel = nilai`).
   - Sebaliknya, `let` dan `const` didaftarkan ke _Declarative Environment Record_. Mereka disimpan dalam slot memori terisolasi yang tidak dapat diakses sebagai properti dari `window`.

2. **Cakupan Pengikatan: Blok `{}` vs Fungsi `function()`**:
   - `var` tidak mengenal cakupan blok kurung kurawal `{}` (seperti di dalam blok `if`, `for`, atau `while`). Variabel `var` "bocor" keluar blok dan terikat pada fungsi pembungkus terdekatnya (_Function Scope_).
   - `let` dan `const` mengevaluasi setiap pasang tanda kurung kurawal `{}` sebagai batas wilayah leksikal baru (_Block Scope_), mencegah polusi nama ke lingkungan luar.

3. **Immutability of Binding vs Immutability of Value**:
   Sintaks `const` menciptakan _Immutable Binding_. Engine menolak re-assignment pada identifier tersebut (`TypeError: Assignment to constant variable`). Namun, sifat mutabilitas objek yang ditunjuk tetap tunduk pada aturan alokasi memori Heap (sebagaimana dibahas pada prinsip tipe data).

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Gunakan hierarki rasional: **`const` sebagai pilihan default** untuk seluruh pengikatan identifier guna memastikan riwayat alur data tidak sengaja tertimpa. Gunakan **`let` hanya ketika identifier memang didesain untuk di-reassign** (seperti counter loop atau flag status). Singkirkan kata kunci `var` sepenuhnya dari aplikasi modern untuk melenyapkan polusi scope global dan kebocoran blok.

- **Contoh Konkret**:

  ```javascript
  // Skenario: Pengelolaan Keranjang Belanja UI
  const CART_CONFIG = {
    maxItems: 10,
    currency: "IDR",
  };

  // ✅ const mengunci identifier:
  // CART_CONFIG = {}; // ERROR: TypeError: Assignment to constant variable

  // ⚠️ Namun properti objek di dalamnya tetap dapat dimutasi:
  CART_CONFIG.maxItems = 20; // Valid di JavaScript!

  // Rekonstruksi jika ingin benar-benar konstan hingga ke isi nilainya:
  const IMMUTABLE_CONFIG = Object.freeze({
    maxItems: 10,
    currency: "IDR",
  });
  // IMMUTABLE_CONFIG.maxItems = 50; // Gagal (melempar TypeError pada strict mode)

  // Contoh let untuk state yang nilainya berubah:
  let totalItemsInCart = 0;
  totalItemsInCart += 1; // Valid & terkontrol
  ```

- **Mengapa ini lebih baik**:
  Dengan menetapkan identifier sebagai `const`, pembaca kode (dan engine compiler) memiliki jaminan statis bahwa variabel tersebut tidak akan pernah berganti entitas di tengah jalan, mereduksi beban kognitif saat membaca alur logika program.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Uji kebocoran `var` di DevTools Console: tulis `if (true) { var bocor = 'ya'; let aman = 'tidak'; }`. Panggil `window.bocor` (hasil: `'ya'`), lalu panggil `window.aman` (hasil: `undefined`) untuk membuktikan batas isolasi scope.
- [ ] **Langkah 2**: Aktifkan aturan linter `no-var: "error"` dan `prefer-const: "error"` di proyek untuk menegakkan penggunaan `const` dan `let` secara otomatis.
- [ ] **Langkah 3**: Jika memiliki konfigurasi global atau kamus token desain yang tidak boleh berubah, selalu bungkus dengan `Object.freeze()` untuk melengkapi proteksi `const`.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Tidak ada satu pun kata kunci `var` di dalam basis kode, dan seluruh variabel yang tidak di-reassign terproteksi menggunakan `const`**.

> [!WARNING]
> **Batas Kepastian**
>
> Memakai `const` secara default adalah **konvensi arsitektur industri untuk keamanan alur data**, bukan keharusan performa engine. Secara runtime di V8 modern, perbedaan performa antara `const` dan `let` yang tidak di-reassign hampir tidak ada.
