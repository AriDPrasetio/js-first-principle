---
title: "First Principles Deep Dive: Hoisting dan Temporal Dead Zone (TDZ)"
tags: "javascript, first-principles, roadmap-js/03-variables-scope"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting"
---

# First Principles Deep Dive: Hoisting dan Temporal Dead Zone (TDZ)

> [!NOTE]
> **The Ground Truth**
>
> Hoisting bukanlah kode yang bergerak atau diangkat secara fisik ke atas berkas; hoisting adalah hasil wajar dari dua fase eksekusi engine (Fase Kompilasi/Alokasi Memori vs Fase Eksekusi Nilai) di mana identifier didaftarkan ke memori sebelum baris kode pertama dieksekusi.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Browser memindahkan deklarasi fungsi dan variabel secara fisik ke baris teratas file sebelum menjalankan script."
- ✅ **Masalah Sebenarnya (Core Problem)**: Kode sumber tidak pernah dipindahkan secara fisik. Engine JavaScript membaca kode dalam dua lintasan (_two-pass compiler_): lintasan pertama (_Creation Phase_) memindai seluruh deklarasi untuk mencadangkan slot memori di _Environment Record_, sedangkan lintasan kedua (_Execution Phase_) mengeksekusi baris kode secara berurutan dan mengisi nilai variabel tersebut.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Dua Fase Eksekusi Context (Creation Phase vs Execution Phase)**:
   Saat sebuah konteks eksekusi (_Execution Context_) dibuat:
   - **Creation Phase**: Engine mengenali semua deklarasi `function`, `var`, `let`, `const`, dan `class`, lalu menyiapkannya di lingkungan leksikal.
   - **Execution Phase**: Baris demi baris perintah dijalankan, melakukan penugasan (_assignment_) dan pemanggilan fungsi.

2. **Inisialisasi `undefined` pada `var` vs Objek Utuh pada `function`**:
   - Deklarasi fungsi formal (`function foo() {}`) didaftarkan ke memori bersama seluruh tubuh fungsinya di fase pembuatan. Oleh karena itu, fungsi dapat dipanggil sebelum baris deklarasinya.
   - Variabel `var` didaftarkan dan **langsung diinisialisasi dengan nilai `undefined`** di fase pembuatan. Jika diakses sebelum baris deklarasinya, ia mengembalikan `undefined` tanpa error.

3. **Mekanisme Temporal Dead Zone (TDZ) pada `let` dan `const`**:
   Spesifikasi [ECMA-262 §14.3.1](https://tc39.es/ecma262/#sec-let-and-const-declarations) menyatakan bahwa `let` dan `const` tetap mengalami hoisting (engine tahu keberadaan identifier tersebut), tetapi **tidak diinisialisasi**. Wilayah antara awal blok kurung kurawal `{}` hingga baris di mana pernyataan deklarasi dieksekusi disebut _Temporal Dead Zone_. Mengakses variabel di zona ini memicu pengecualian fatal: `ReferenceError: Cannot access 'x' before initialization`.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Manfaatkan hoisting deklarasi fungsi untuk menyusun kode dengan keterbacaan tingkat tinggi (_Top-Down Readability_): letakkan fungsi publik utama di bagian atas file agar niat program langsung terbaca, dan letakkan fungsi-fungsi pembantu (_helper functions_) di bagian bawah. Sebaliknya untuk variabel, selalu deklarasikan dan inisialisasi di bagian atas blok sebelum digunakan untuk meniadakan resiko tersangkut di TDZ.

- **Contoh Konkret**:

  ```javascript
  // 1. Manfaat Hoisting Fungsi: Alur Eksekusi Terbaca Alami dari Atas ke Bawah
  initUserInterface(); // Sukses berjalan meskipun deklarasi ada di bawah!

  function initUserInterface() {
    setupEventListeners();
    renderInitialState();
  }

  function setupEventListeners() {
    /* implementasi */
  }
  function renderInitialState() {
    /* implementasi */
  }

  // 2. Bukti TDZ pada let & const:
  function demonstrateTDZ() {
    // Awal Blok: TDZ untuk 'userName' dimulai di sini
    // console.log(userName); // CRASH: ReferenceError: Cannot access 'userName' before initialization

    let userName = "Ari"; // TDZ berakhir di baris ini!
    console.log(userName); // Aman: 'Ari'
  }

  demonstrateTDZ();
  ```

- **Mengapa ini lebih baik**:
  Memahami bahwa hoisting berasal dari fase alokasi memori compiler menghilangkan ketakutan tidak berdasar terhadap "keganjilan" JavaScript. Desain kode menjadi terstruktur: fungsi arsitektur tinggi berada di atas tanpa memerlukan trik forward-declaration seperti di bahasa C.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Uji coba perbedaan hoisting di console: bandingkan pemanggilan fungsi reguler (`foo()`) sebelum dideklarasikan dengan pemanggilan variabel fungsi arrow (`bar()`) yang dideklarasikan dengan `const bar = () => {}` untuk melihat bagaimana TDZ bekerja.
- [ ] **Langkah 2**: Hindari mendeklarasikan variabel dengan nama yang sama di scope luar dan scope dalam jika variabel dalam berada di TDZ (mencegah fenomena _variable shadowing trap_).
- [ ] **Langkah 3**: Verifikasi pemahaman di debugger DevTools: pasang breakpoint pada baris pertama sebuah fungsi dan perhatikan panel _Scope_ untuk melihat identifier mana yang sudah dialokasikan sebelum baris tersebut berjalan.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Tidak ada lagi kejutan `undefined` akibat variabel `var` atau error `ReferenceError: Cannot access before initialization` pada variabel `let`/`const`**.

> [!WARNING]
> **Batas Kepastian**
>
> Memosisikan pemanggilan fungsi di atas deklarasinya adalah **pilihan gaya arsitektur (readability pattern)**. Sebagian tim lebih memilih aturan konvensi ketat "deklarasikan semua sebelum dipanggil", yang sama-sama valid secara fungsional.
