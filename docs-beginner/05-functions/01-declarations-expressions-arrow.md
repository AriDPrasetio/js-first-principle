---
title: "Panduan Pemula: Function Declaration, Expression, dan Arrow Function di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/05-functions
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
---

# Panduan Pemula: Function Declaration, Expression, dan Arrow Function di JavaScript

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> Fungsi (_Function_) adalah mesin pengolah resep: Anda memasukkan bahan (_parameter_), mesin mengolahnya, lalu mengembalikan hasil jadi (_return_). Di JavaScript ada 3 cara utama menulis fungsi yang disesuaikan dengan kebutuhan dan kerapian kode Anda.

---

## 1. Analogi Logis: Tiga Cara Mencatat Resep Minuman

Bayangkan Anda seorang peracik minuman di kedai kopi:

1. **Function Declaration (Resep di Papan Menu Restoran)**:
   Resep ini tertulis permanen di papan atas kasir. Koki mana pun bisa membacanya kapan saja, bahkan sebelum kasir membuka pintu toko (_bisa dipanggil sebelum baris deklarasinya karena di-hoist oleh browser_).
2. **Function Expression (Resep yang Disimpan di Buku Catatan Kasir)**:
   Resep disimpan ke dalam wadah variabel (`const hitungTotal = function() { ... }`). Kasir baru bisa memakainya setelah buku catatan dibuka di halaman tersebut.
3. **Arrow Function (Resep Catatan Cepat Berpanah `=>`)**:
   Cara tulis singkat dan modern untuk langkah cepat: `(harga) => harga * 0.9`. Sangat ringkas dan tidak memakan banyak baris kode.

---

## 2. Mengapa JavaScript Punya 3 Cara Menulis Fungsi? (First Principles)

1. **Fleksibilitas Struktur Kode**:
   Dengan _Function Declaration_, Anda bisa memanggil fungsi di baris paling atas dan menaruh detail logika fungsi di bagian paling bawah file agar kode enak dibaca seperti membaca koran.
2. **Kerapian Fungsi Ringkas Modern**:
   Saat mengolah daftar belanjaan atau menangani klik tombol, menulis `function()` berkali-kali terasa bertele-tele. _Arrow Function_ (`() => {}`) lahir agar kode Anda lebih ramping, bersih, dan langsung ke inti tujuannya.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kalkulator diskon toko yang membandingkan hasil racikan dari ketiga jenis fungsi:

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
        max-width: 340px;
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
        placeholder="Harga Asli (contoh: 100000)"
      />

      <div class="btn-group">
        <button type="button" id="btn-dec">Diskon 10% (Declaration)</button>
        <button type="button" id="btn-exp">Diskon 20% (Expression)</button>
        <button type="button" id="btn-arrow">Diskon 50% (Arrow)</button>
      </div>

      <div id="output-hasil" class="hasil">
        Pilih salah satu tombol diskon di atas.
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen-elemen HTML
const inputHarga = document.querySelector("#input-harga");
// ambil kolom input harga barang.

const tombolDec = document.querySelector("#btn-dec");
// ambil tombol diskon 10%.

const tombolExp = document.querySelector("#btn-exp");
// ambil tombol diskon 20%.

const tombolArrow = document.querySelector("#btn-arrow");
// ambil tombol diskon 50%.

const outputHasil = document.querySelector("#output-hasil");
// ambil elemen wadah teks hasil perhitungan.

// ========================================================
// CARA 1: FUNCTION DECLARATION (Bisa dipanggil di mana saja)
// ========================================================
function hitungDiskonSepuluhPersen(harga) {
  // terima bahan (parameter harga), potong 10%:
  return harga * 0.9;
  // kembalikan nilai harga bersih setelah diskon.
}

// ========================================================
// CARA 2: FUNCTION EXPRESSION (Disimpan ke variabel const)
// ========================================================
const hitungDiskonDuaPuluhPersen = function (harga) {
  // simpan fungsi tanpa nama ke dalam variabel wadah:
  return harga * 0.8;
  // kembalikan nilai harga bersih setelah potongan 20%.
};

// ========================================================
// CARA 3: ARROW FUNCTION (Gaya modern yang sangat ringkas)
// ========================================================
const hitungDiskonLimaPuluhPersen = (harga) => {
  // gunakan tanda panah => sebagai pengganti kata 'function':
  return harga * 0.5;
  // kembalikan nilai separuh harga.
};

// 2. Hubungkan fungsi-fungsi ke tombol HTML
tombolDec.addEventListener("click", () => {
  const harga = Number(inputHarga.value);
  // ambil angka dari kolom input harga.
  const hasil = hitungDiskonSepuluhPersen(harga);
  // panggil Function Declaration.
  outputHasil.textContent = `Harga Diskon 10%: Rp ${hasil.toLocaleString("id-ID")}`;
});

tombolExp.addEventListener("click", () => {
  const harga = Number(inputHarga.value);
  // ambil angka dari kolom input harga.
  const hasil = hitungDiskonDuaPuluhPersen(harga);
  // panggil Function Expression.
  outputHasil.textContent = `Harga Diskon 20%: Rp ${hasil.toLocaleString("id-ID")}`;
});

tombolArrow.addEventListener("click", () => {
  const harga = Number(inputHarga.value);
  // ambil angka dari kolom input harga.
  const hasil = hitungDiskonLimaPuluhPersen(harga);
  // panggil Arrow Function.
  outputHasil.textContent = `Harga Diskon 50%: Rp ${hasil.toLocaleString("id-ID")}`;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan Function Declaration untuk fungsi utama aplikasi**: Sangat jelas, punya nama terang, dan bisa dipanggil dari baris mana pun tanpa takut error urutan baris.
2. **Gunakan Arrow Function untuk fungsi pendek atau callback**: Sangat cocok saat dipasangkan dengan `addEventListener("click", () => { ... })` atau pengolahan array seperti `.map()` dan `.filter()`.
3. **Pemberian nama fungsi yang jelas**: Gunakan kata kerja bahasa Indonesia atau Inggris yang mudah dipahami, misalnya `hitungTotal()`, `bukaModal()`, `kirimData()`.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser, ketik harga `100000`.
- [ ] Klik masing-masing dari ketiga tombol tersebut secara bergantian.
- [ ] Amati bahwa ketiganya sama-sama berhasil menghitung hasil diskon dengan benar.
- [ ] Coba pindahkan baris `function hitungDiskonSepuluhPersen` ke bagian paling bawah file `app.js` $\to$ amati bahwa kodenya tetap bekerja tanpa error (berkat _hoisting_).

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Tahu kapan sebaiknya menulis fungsi biasa yang lengkap vs kapan menggunakan tanda panah `=>` untuk fungsi pendek**.

---

## 🎯 Uji Pemahaman Mandiri

1. Mengapa jika Anda memanggil sebuah _Function Expression_ di baris ke-1 sementara variabel fungsinya baru didefinisikan di baris ke-10, browser akan mengeluarkan error `Cannot access ... before initialization`?
2. Apakah _Arrow Function_ (`() => {}`) memiliki kata kunci `function` di dalam penulisannya?
