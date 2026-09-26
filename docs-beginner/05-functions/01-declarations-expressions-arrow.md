---
title: "Panduan Pemula: Function Declaration, Expression, dan Arrow Function di JavaScript"
tags: "javascript, first-principles, roadmap-js/05-functions"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions"
---

# Panduan Pemula: Function Declaration, Expression, dan Arrow Function di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Fungsi (_Function_) adalah mesin pengolah resep: menerima bahan (_parameter_), mengolah logika, lalu mengeluarkan hasil olahan (_return_). Di JavaScript ada 3 cara utama menulis fungsi: **Declaration** (di-hoist penuh), **Expression** (disimpan ke variabel), dan **Arrow Function** (ringkas dan modern).

---

## 1. Analogi Logis: Tiga Cara Mencatat Resep Minuman

Bayangkan Anda seorang barista di kedai kopi:

1. **Function Declaration (Resep di Papan Menu Besar — Statement)**:
   Secara gramatikal, ini adalah sebuah **Statement** (pernyataan formal, lihat panduan [Expression vs Statement](../02-syntax-datatypes/00-expressions-vs-statements.md)). Resep ini terpampang permanen di dinding atas kasir. Barista mana pun bisa membacanya kapan saja, bahkan sebelum kasir membuka pintu toko (_bisa dipanggil sebelum baris deklarasinya karena di-hoist penuh oleh browser_).

   ```javascript
   // 1. Buat fungsi buatKopi yang menerima nama ukuran.
   // Catatan*: Fungsi ini bisa dipanggil dari baris atas karena fitur hoisting.
   function buatKopi(ukuran) {
     // 2. Kembalikan teks gabungan kata Kopi dan nilainya.
     return `Kopi ${ukuran}`;
   }
   ```

2. **Function Expression (Resep di Buku Catatan Kasir — Expression)**:
   Secara gramatikal, fungsi di sini adalah sebuah **Expression** (menghasilkan nilai fungsi yang disimpan ke variabel). Barista baru bisa memakainya setelah alur kode melewati baris pembukaan buku catatan tersebut.

   ```javascript
   // 1. Simpan fungsi ke dalam variabel buatKopi yang menerima ukuran.
   // Catatan*: Fungsi ini baru bisa dipakai setelah pembacaan melewati baris ini.
   const buatKopi = function (ukuran) {
     // 2. Kembalikan teks gabungan kata Kopi dan nilainya.
     return `Kopi ${ukuran}`;
   };
   ```

3. **Arrow Function (Resep Catatan Cepat Simbol Panah `=>`)**:
   Cara tulis singkat dan ramping untuk instruksi ringkas tanpa menulis kata `function`.
   ```javascript
   // 1. Buat fungsi ringkas pencetak kopi dan simpan ke variabel buatKopi.
   const buatKopi = (ukuran) => `Kopi ${ukuran}`;
   ```

---

## 2. Mengapa JavaScript Punya 3 Cara? (First Principles)

### A. Dua Wajah Arrow Function: _Concise_ vs _Block Body_

Penyebab nomor satu kebingungan pemula pada Arrow Function adalah penggunaan kurung kurawal:

1. **Concise Body (_Implicit Return_)**:
   Jika fungsi Anda hanya terdiri dari satu baris ekspresi, **jangan gunakan `{}`**. Nilainya otomatis dikembalikan:

   ```javascript
   // 1. Buat fungsi kaliDua dengan kembalian otomatis tanpa kurung kurawal.
   // Catatan*: Nilai x dikalikan 2 lalu langsung dikembalikan (implicit return).
   const kaliDua = (x) => x * 2;
   ```

2. **Block Body (_Explicit Return_)**:
   Jika fungsi memiliki lebih dari satu baris logika, Anda **wajib menggunakan `{}`** dan **wajib menulis kata `return`**:
   ```javascript
   // 1. Buat fungsi hitungTotal menggunakan kurung kurawal untuk banyak baris logika.
   const hitungTotal = (harga, pajak) => {
     // 2. Tambahkan harga dengan pajak lalu simpan di variabel subtotal.
     const subtotal = harga + pajak;
     // 3. Kembalikan nilai subtotal sebagai hasil akhir.
     // Catatan*: Wajib menulis kata return, jika tidak hasilnya akan undefined.
     return subtotal;
   };
   ```

> [!WARNING]
> **Peringatan Penting (Prinsip `this`)**:
> Arrow Function **tidak memiliki pengikatan `this` sendiri** dan tidak bisa dipanggil menggunakan `new`. Karakteristik ini dirancang sengaja untuk memudahkan callback, yang akan kita selami secara mendalam di **Bab 06 (`this` Context)**.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kalkulator diskon toko yang membandingkan ketiga jenis penulisan fungsi ini:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Tipe-tipe Fungsi</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        margin-bottom: 8px;
      }
      .btn-group {
        display: flex;
        gap: 4px;
        margin-bottom: 8px;
      }
      button {
        flex: 1;
        padding: 8px 4px;
        font-size: 0.8rem;
        cursor: pointer;
      }
      .hasil {
        padding: 10px;
        background-color: #f0f7ff;
        border: 1px solid #cce3ff;
        border-radius: 4px;
        font-weight: bold;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Kalkulator Diskon Toko</h3>
      <input
        type="number"
        id="input-harga"
        value="100000"
        placeholder="Harga Barang"
      />

      <div class="btn-group">
        <button type="button" id="btn-dec">Declaration (10%)</button>
        <button type="button" id="btn-exp">Expression (20%)</button>
        <button type="button" id="btn-arrow">Arrow (30%)</button>
      </div>

      <div id="kotak-hasil" class="hasil">
        Klik salah satu tombol resep diskon.
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// ========================================================
// 1. FUNCTION DECLARATION:
// ========================================================
// 1. Buat fungsi hitungDiskonDeclaration yang menerima angka harga.
// Catatan*: Browser akan mengangkat fungsi ini ke atas (hoisting) sehingga siap digunakan di mana saja.
function hitungDiskonDeclaration(harga) {
  // 2. Kalikan harga dengan 0.9 (potongan 10%) lalu kembalikan hasilnya.
  return harga * 0.9;
}

// ========================================================
// 2. FUNCTION EXPRESSION:
// ========================================================
// 1. Simpan fungsi tanpa nama pengolah diskon 20% ke dalam variabel hitungDiskonExpression.
// Catatan*: Fungsi baru siap digunakan setelah melewati baris eksekusi ini (tidak di-hoist).
const hitungDiskonExpression = function (harga) {
  // 2. Kalikan harga dengan 0.8 (potongan 20%) lalu kembalikan hasilnya.
  return harga * 0.8;
};

// ========================================================
// 3. ARROW FUNCTION (CONCISE BODY / IMPLICIT RETURN):
// ========================================================
// 1. Buat fungsi satu baris pemotong harga 30% dan simpan ke variabel hitungDiskonArrow.
// Catatan*: Angka hasil otomatis dikembalikan tanpa perlu mengetik kata return.
const hitungDiskonArrow = (harga) => harga * 0.7;

// 1. Ambil elemen masukan harga dari dokumen HTML lalu simpan ke variabel hargaInput.
const hargaInput = document.querySelector("#input-harga");
// 2. Ambil elemen wadah tampilan dari dokumen HTML lalu simpan ke variabel kotakHasil.
const kotakHasil = document.querySelector("#kotak-hasil");

// 1. Tambahkan pendeteksi klik pada tombol Declaration.
document.querySelector("#btn-dec").addEventListener("click", () => {
  // 2. Baca isi kotak masukan dan ubah menjadi bentuk angka, lalu simpan ke variabel harga.
  const harga = Number(hargaInput.value);
  // 3. Ubah teks pada kotak hasil dengan angka setelah dipotong diskon 10%.
  kotakHasil.textContent = `Declaration (10%): Rp${hitungDiskonDeclaration(harga).toLocaleString("id-ID")}`;
});

// 1. Tambahkan pendeteksi klik pada tombol Expression.
document.querySelector("#btn-exp").addEventListener("click", () => {
  // 2. Baca isi kotak masukan dan ubah menjadi bentuk angka, lalu simpan ke variabel harga.
  const harga = Number(hargaInput.value);
  // 3. Ubah teks pada kotak hasil dengan angka setelah dipotong diskon 20%.
  kotakHasil.textContent = `Expression (20%): Rp${hitungDiskonExpression(harga).toLocaleString("id-ID")}`;
});

// 1. Tambahkan pendeteksi klik pada tombol Arrow Function.
document.querySelector("#btn-arrow").addEventListener("click", () => {
  // 2. Baca isi kotak masukan dan ubah menjadi bentuk angka, lalu simpan ke variabel harga.
  const harga = Number(hargaInput.value);
  // 3. Ubah teks pada kotak hasil dengan angka setelah dipotong diskon 30%.
  kotakHasil.textContent = `Arrow Function (30%): Rp${hitungDiskonArrow(harga).toLocaleString("id-ID")}`;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan Function Declaration untuk Fungsi Utama / Helper Modul**: Memungkinkan struktur kode _top-down_ yang rapi di mana fungsi bantuan ditaruh di bawah.
2. **Gunakan Arrow Function untuk Callback Ringkas**: Sangat ideal untuk callback event listener atau pengolahan array (`array.map((item) => item.nama)`).
3. **Waspadai Jebakan `{}` pada Arrow Function**: Jika Anda membuka kurung kurawal `() => { ... }`, Anda **wajib** menyertakan kata kunci `return`.

---

## 5. Checklist Praktik Mandiri

- [x] Buka `index.html` di browser dan klik ketiga tombol diskon secara bergantian.
- [x] Buka Console (`F12`), coba ketik:
  ```javascript
  // 1. Buat fungsi tambahSalah yang memakai kurung kurawal tapi lupa menulis return.
  const tambahSalah = (a, b) => {
    // 2. Lakukan penjumlahan namun nilainya dibiarkan menguap begitu saja.
    a + b;
  };
  // 3. Cetak hasil eksekusi tambahSalah ke layar.
  // Catatan*: Hasilnya undefined karena tidak ada instruksi return.
  console.log(tambahSalah(2, 3));
  // 1. Buat fungsi tambahBenar yang langsung menjumlahkan dan mengembalikan hasil (implicit return).
  const tambahBenar = (a, b) => a + b;
  // 2. Cetak hasil dari tambahBenar ke layar (mendapatkan angka 5).
  console.log(tambahBenar(2, 3));
  ```

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu perbedaan Declaration vs Expression vs Arrow Function, dan hafal aturan kurung kurawal `{}` pada implicit vs explicit return**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode berikut:

```javascript
// 1. Buat fungsi rumusA yang langsung mengembalikan hasil kali 10 (implicit return).
const rumusA = (x) => x * 10;
// 1. Buat fungsi rumusB dengan kurung kurawal namun tanpa kata return.
const rumusB = (x) => {
  // 2. Kalikan nilai masukan dengan 10 tanpa instruksi pengembalian (hasilnya menguap).
  x * 10;
};

// 1. Cetak hasil dari rumusA ke layar.
console.log(rumusA(5)); // Baris 1
// 2. Cetak hasil dari rumusB ke layar.
console.log(rumusB(5)); // Baris 2
```

1. Berapakah hasil keluaran Baris 1?
2. Berapakah hasil keluaran Baris 2? Mengapa hasilnya berbeda?

```

```
