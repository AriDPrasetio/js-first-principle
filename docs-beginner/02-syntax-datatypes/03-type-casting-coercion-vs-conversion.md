---
title: "Panduan Pemula: Type Casting (Coercion vs Conversion) di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/02-syntax-datatypes
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion
  - https://developer.mozilla.org/en-US/docs/Glossary/Type_conversion
---

# Panduan Pemula: Type Casting (Coercion vs Conversion) di JavaScript

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> Type Casting adalah proses mengubah jenis data dari satu tipe ke tipe lain. Jika Anda melakukannya secara sadar, itu disebut **Type Conversion** (Aman). Jika komputer yang menebak dan mengubahnya secara otomatis di belakang layar, itu disebut **Type Coercion** (Sering memicu bug).

---

## 1. Analogi Logis: Penerjemah Resmi vs Tebakan Otomatis

### A. Implicit Coercion (Tebakan Otomatis Komputer)

Bayangkan Anda memesan makanan di restoran luar negeri. Anda berbicara setengah bahasa Indonesia dan setengah bahasa Inggris.

- Pelayan restoran **mencoba menebak-nebak sendiri** apa maksud Anda.
- Terkadang tebakannya benar, tetapi sering kali ia salah paham dan membawakan makanan yang sama sekali tidak Anda inginkan.

Inilah **Type Coercion**: JavaScript mencoba menebak tipe data yang Anda maksud saat Anda mencampurkan teks dan angka.

---

### B. Explicit Conversion (Penerjemah Resmi yang Pasti)

Sekarang bayangkan Anda menyewa seorang penerjemah resmi profesional.

- Anda dengan sengaja dan jelas meminta penerjemah: _"Tolong terjemahkan kalimat saya ini ke dalam bahasa Inggris."_
- Hasilnya terjamin akurat, tidak ada tebak-tebakan, dan pelayan restoran mengerti maksud Anda 100%.

Inilah **Type Conversion**: Anda secara terang-terangan memerintahkan JavaScript: `Number(inputTeks)` untuk mengubah teks menjadi angka murni.

---

## 2. Mengapa Terjadi Bug Penjumlahan Aneh? (First Principles)

Di JavaScript, tanda tambah (`+`) memiliki **dua fungsi berbeda**:

1. **Penjumlahan Matematika**: `10 + 5` menghasilkan `15`.
2. **Penyambungan Teks (Concatenation)**: `'Halo ' + 'Budi'` menghasilkan `'Halo Budi'`.

**Perangkap Utama Pemula**:
Jika tanda `+` bertemu dengan satu saja teks (string), JavaScript akan menebak: _"Oh, ada teks! Pasti developer ingin menyambung teks, bukan menjumlahkan angka."_
Akibatnya:

- `'3' + 2` $\to$ menghasilkan `'32'` (Bukan 5!).
- Sebaliknya, untuk tanda kurang (`-`), kali (`*`), atau bagi (`/`), JavaScript tahu bahwa teks tidak bisa dikurangi, sehingga ia otomatis mengubah teks menjadi angka: `'5' - 2` $\to$ menghasilkan `3`.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buktikan bahaya Coercion dan solusi Conversion pada keranjang belanja:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Type Casting</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      input,
      button {
        padding: 8px;
        margin-top: 6px;
        width: 100%;
        box-sizing: border-box;
      }
      .hasil {
        margin-top: 12px;
        padding: 8px;
        border-radius: 4px;
        background: #f9f9f9;
      }
      .error-text {
        color: #cc0000;
        font-weight: bold;
      }
      .success-text {
        color: #008800;
        font-weight: bold;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Kalkulator Barang + Bonus</h3>
      <label for="qty-input">Jumlah Beli (Dapat Bonus 2):</label>
      <input type="number" id="qty-input" value="3" />

      <button type="button" id="btn-calc">Hitung Total Barang</button>

      <div class="hasil">
        <p id="coercion-bug" class="error-text">Hasil Coercion: -</p>
        <p id="conversion-fixed" class="success-text">Hasil Conversion: -</p>
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen yang dibutuhkan
const qtyInput = document.querySelector("#qty-input");
// ambil elemen input jumlah beli dengan ID 'qty-input', simpan ke wadah qtyInput.

const calcBtn = document.querySelector("#btn-calc");
// ambil tombol hitung dengan ID 'btn-calc', simpan ke wadah calcBtn.

const bugEl = document.querySelector("#coercion-bug");
// ambil elemen penampil bug dengan ID 'coercion-bug', simpan ke wadah bugEl.

const fixedEl = document.querySelector("#conversion-fixed");
// ambil elemen penampil solusi benar dengan ID 'conversion-fixed', simpan ke wadah fixedEl.

// 2. Pasang aksi ketika tombol hitung diklik
calcBtn.addEventListener("click", () => {
  // saat tombol diklik, jalankan perintah di dalam blok ini:

  const inputVal = qtyInput.value;
  // ambil nilai yang diketik pengguna (ingat: nilainya bertipe string, contohnya teks "3").

  const bonus = 2;
  // bonus tambahan sebanyak 2 barang (bertipe number).

  // BAHAYA IMPLICIT COERCION:
  const buggyResult = inputVal + bonus;
  // karena inputVal bertipe string "3", tanda '+' malah menyambung teks menjadi "3" + 2 = "32".

  bugEl.textContent = `Bug Coercion ("${inputVal}" + ${bonus}) = ${buggyResult} item (Salah!)`;
  // tampilkan hasil salah tersebut ke layar.

  // SOLUSI EKSPLISIT CONVERSION:
  const correctResult = Number(inputVal) + bonus;
  // gunakan fungsi Number() untuk mengubah teks "3" menjadi angka 3 sebelum dijumlahkan. 3 + 2 = 5.

  fixedEl.textContent = `Solusi Conversion (Number("${inputVal}") + ${bonus}) = ${correctResult} item (Benar!)`;
  // tampilkan hasil perhitungan matematika yang benar ke layar.
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu gunakan `Number()` untuk data formulir**: Sebelum melakukan perhitungan harga atau kuantitas, selalu bungkus nilainya dengan `Number(input.value)`.
2. **Gunakan `String()` jika ingin mengubah angka jadi teks**: Contoh: `String(100)` menghasilkan `"100"`.
3. **Gunakan `Boolean()` untuk mengecek kebenaran nilai**: Contoh: `Boolean(0)` menghasilkan `false`, sedangkan `Boolean(1)` menghasilkan `true`.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik tombol **"Hitung Total Barang"**.
- [ ] Amati bagaimana hasil Coercion menghasilkan `32 item`, sedangkan Conversion menghasilkan `5 item`.
- [ ] Ubah angka di kotak input menjadi `10`, lalu klik hitung lagi (lihat perbandingan `102` vs `12`).

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Tidak pernah lagi menjumlahkan nilai dari input formulir tanpa membungkusnya dengan fungsi `Number()` terlebih dahulu**.

---

## 🎯 Uji Pemahaman Mandiri

Coba tebak apa hasil keluaran dari dua operasi ini di JavaScript:

```javascript
let hasilSatu = "10" - 2;
let hasilDua = "10" + 2;

// Pertanyaan:
// 1. Berapakah hasilSatu? Apakah 8 atau "102"?
// 2. Berapakah hasilDua? Apakah 12 atau "102"?
```
