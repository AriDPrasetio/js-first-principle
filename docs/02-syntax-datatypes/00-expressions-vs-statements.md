---
title: "First Principles Deep Dive: Expressions vs Statements"
tags: "javascript, first-principles, roadmap-js/02-syntax-datatypes"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators"
---

# First Principles Deep Dive: Expressions vs Statements

> [!NOTE]
> **The Ground Truth**
>
> Setiap baris kode JavaScript pada tingkat sintaksis terbagi menjadi dua kategori mutlak: **Expression** adalah satuan kode yang dievaluasi engine untuk menghasilkan sebuah nilai tunggal, sedangkan **Statement** adalah kalimat instruksi lengkap yang mengarahkan alur kerja komputasi tanpa menghasilkan nilai yang dapat disimpan ke dalam variabel.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Semua baris di JavaScript itu sama saja, cukup tambahkan titik koma di ujungnya atau gunakan ternary di mana-mana agar terlihat rapi dan ringkas."
- ✅ **Masalah Sebenarnya (Core Problem)**: Parser JavaScript bekerja berdasarkan aturan tata bahasa (*grammar specification*) yang ketat. Menempatkan sebuah pernyataan (*statement*) di lokasi yang mewajibkan sebuah ekspresi nilai (*expression*)—seperti di dalam argumen fungsi, sisi kanan tanda sama dengan (`=`), atau interpolasi template JSX/template literal—akan menyebabkan parser mengalami kegagalan fatal seketika (`SyntaxError: Unexpected token`).

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Evaluasi Menghasilkan Nilai (_Expression Evaluates to Value_) [ECMA-262 §13]**:
   Spesifikasi ECMAScript mendefinisikan *Expression* sebagai setiap konstruksi sintaksis yang dapat dievaluasi menjadi sebuah entitas nilai.
   - Contoh ekspresi literal: `42`, `"kopi"`, `true`, `{ nama: "Aria" }`.
   - Contoh ekspresi operan: `10 + 5`, `x * 2`, `a && b`, `status ? "Aktif" : "Nonaktif"`.
   - Contoh ekspresi pemanggilan: `Math.random()`, `daftarUser.filter(...)`.
   Karena selalu bermuara pada satu nilai, ekspresi **sah diletakkan di mana pun engine menanti sebuah nilai**.

2. **Instruksi Pengendali Alur (_Statement as Control Unit_) [ECMA-262 §14]**:
   Spesifikasi mendefinisikan *Statement* sebagai unit gramatikal yang mengeksekusi suatu aksi: percabangan (`if...else`, `switch`), perulangan (`for`, `while`), deklarasi (`let`, `const`, `var`), atau lompatan alur (`return`, `break`, `throw`). Statement dieksekusi untuk menimbulkan efek samping (*side effect*) atau memandu jalannya eksekusi program. Statement **tidak menghasilkan nilai yang dapat ditampung ke variabel**.

3. **Ekspresi Menjadi Pernyataan (_Expression Statement_) [ECMA-262 §14.5]**:
   Sebuah ekspresi dapat berdiri sendiri sebagai satu baris instruksi penuh hanya jika diakhiri dengan pemisah pernyataan (tanda titik koma `;` atau mekanisme *Automatic Semicolon Insertion* / ASI). Ini disebut *Expression Statement*.
   ```javascript
   // '2 + 2' adalah expression; diakhiri ';' menjadi expression statement:
   2 + 2; 

   // Pemanggilan fungsi 'alert()' adalah expression; diakhiri ';' menjadi expression statement:
   alert("Halo");
   ```
   Sebaliknya, *statement* struktural murni (seperti blok `if (...) { ... }` atau `while (...)`) **tidak pernah bisa dipaksa** menjadi ekspresi nilai.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  - Gunakan **Expression** (seperti operator ternary `condition ? a : b` atau short-circuit `&&` / `??`) ketika tujuannya adalah **menghasilkan atau mengembalikan nilai** untuk langsung disimpan ke variabel atau dirender.
  - Gunakan **Statement** (seperti `if...else`, `for...of`, `try...catch`) ketika tujuannya adalah **mengendalikan alur program** atau melakukan tindakan yang memiliki efek samping beruntun.
  - Ini adalah fondasi mengapa pada ekosistem antarmuka modern seperti React/JSX, kurung kurawal `{}` hanya menerima *Expression* (seperti `isLoaded ? <Data /> : <Spinner />`) dan menolak *Statement* (`{ if (isLoaded) { return <Data /> } }` memicu error parser).

- **Contoh Konkret**:

  ```javascript
  // ==========================================
  // 1. PENGUJIAN: MANA STATEMENT, MANA EXPRESSION?
  // ==========================================

  // ✅ EXPRESSION: Menghasilkan nilai, sah disimpan ke variabel
  const nilaiUjian = 40 + 50; // '40 + 50' adalah ekspresi (menghasilkan 90)
  const pesanStatus = nilaiUjian >= 75 ? "Lulus" : "Remedial"; // Ternary adalah ekspresi

  // ❌ STATEMENT: Tidak menghasilkan nilai yang dapat ditampung
  // Kode di bawah ini akan melempar: SyntaxError: Unexpected token 'if'
  // const hasil = if (nilaiUjian >= 75) { "Lulus" } else { "Remedial" };

  // ==========================================
  // 2. PEMBUKTIAN DENGAN FUNGSI (ARGUMEN ADALAH POSISI EKSPRESI)
  // ==========================================

  function catatHasil(nilai) {
    console.log(`Hasil evaluasi: ${nilai}`);
  }

  // ✅ Sah: 'nilaiUjian >= 75' menghasilkan boolean (true/false)
  catatHasil(nilaiUjian >= 75);

  // ❌ Error fatal jika statement dipaksakan masuk ke posisi argumen:
  // catatHasil(let x = 10); // SyntaxError: Unexpected token 'let'
  ```

- **Mengapa ini lebih baik**:
  Memahami pemisahan ini menghilangkan kebingungan developer saat menulis ekspresi fungsi, IIFE, maupun rendering kondisional. Kode menjadi bersih karena setiap konstruksi diletakkan sesuai kontrak gramatikal spesifikasi bahasa.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Sebelum menulis kode, tentukan intensi: apakah saya sedang butuh *menghasilkan nilai* (gunakan *expression*) atau sedang butuh *mengatur alur/tindakan* (gunakan *statement*)?
- [ ] **Langkah 2**: Buka DevTools Console: verifikasi bahwa menulis `if (true) 1` langsung mengembalikan *completion value*, namun mencoba menulis `const x = (if (true) 1);` seketika melempar `SyntaxError`.
- [ ] **Langkah 3**: Gunakan operator ternary hanya untuk ekspresi penentuan nilai sederhana (maksimal 1 tingkat); hindari ternary bertingkat (*nested ternary*) yang sulit dibaca dan beralihlah ke *statement* `if/else` atau `switch` untuk kontrol alur bercabang banyak.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dipahami dengan benar jika: **Anda dapat mengidentifikasi dalam 1 detik apakah suatu potongan kode dapat disimpan ke dalam variabel atau dioper sebagai argumen fungsi tanpa memicu `SyntaxError`**.

> [!WARNING]
> **Batas Kepastian**
>
> Di konsol DevTools browser, saat Anda mengetik sebuah statement (seperti `let a = 10;` atau `var b = 20;`), konsol sering kali mencetak `undefined`. Itu bukanlah nilai kembalian dari variabel, melainkan *Completion Record [[Value]]* internal yang ditampilkan DevTools untuk menandai bahwa statement selesai dieksekusi tanpa eror.
