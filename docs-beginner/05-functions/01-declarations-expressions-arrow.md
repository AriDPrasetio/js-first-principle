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
> Fungsi (*Function*) adalah mesin pengolah resep: menerima bahan (*parameter*), mengolah logika, lalu mengeluarkan hasil olahan (*return*). Di JavaScript ada 3 cara utama menulis fungsi: **Declaration** (di-hoist penuh), **Expression** (disimpan ke variabel), dan **Arrow Function** (ringkas dan modern).

---

## 1. Analogi Logis: Tiga Cara Mencatat Resep Minuman

Bayangkan Anda seorang barista di kedai kopi:

1. **Function Declaration (Resep di Papan Menu Besar)**:
   Resep ini terpampang permanen di dinding atas kasir. Barista mana pun bisa membacanya kapan saja, bahkan sebelum kasir membuka pintu toko (*bisa dipanggil sebelum baris deklarasinya karena di-hoist penuh oleh browser*).
   ```javascript
   function buatKopi(ukuran) { return `Kopi ${ukuran}`; }
   ```

2. **Function Expression (Resep di Buku Catatan Kasir)**:
   Resep disimpan ke dalam wadah variabel. Barista baru bisa memakainya setelah buku catatan dibuka tepat di halaman tersebut.
   ```javascript
   const buatKopi = function(ukuran) { return `Kopi ${ukuran}`; };
   ```

3. **Arrow Function (Resep Catatan Cepat Simbol Panah `=>`)**:
   Cara tulis singkat dan ramping untuk instruksi ringkas tanpa menulis kata `function`.
   ```javascript
   const buatKopi = (ukuran) => `Kopi ${ukuran}`;
   ```

---

## 2. Mengapa JavaScript Punya 3 Cara? (First Principles)

### A. Dua Wajah Arrow Function: *Concise* vs *Block Body*

Penyebab nomor satu kebingungan pemula pada Arrow Function adalah penggunaan kurung kurawal:

1. **Concise Body (*Implicit Return*)**:
   Jika fungsi Anda hanya terdiri dari satu baris ekspresi, **jangan gunakan `{}`**. Nilainya otomatis dikembalikan:
   ```javascript
   // Otomatis me-return x * 2 (implicit return)
   const kaliDua = (x) => x * 2;
   ```

2. **Block Body (*Explicit Return*)**:
   Jika fungsi memiliki lebih dari satu baris logika, Anda **wajib menggunakan `{}`** dan **wajib menulis kata `return`**:
   ```javascript
   const hitungTotal = (harga, pajak) => {
     const subtotal = harga + pajak;
     // Wajib ada return! Jika lupa, hasilnya undefined!
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
      <input type="number" id="input-harga" value="100000" placeholder="Harga Barang" />

      <div class="btn-group">
        <button type="button" id="btn-dec">Declaration (10%)</button>
        <button type="button" id="btn-exp">Expression (20%)</button>
        <button type="button" id="btn-arrow">Arrow (30%)</button>
      </div>

      <div id="kotak-hasil" class="hasil">Klik salah satu tombol resep diskon.</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. FUNCTION DECLARATION:
// Di-hoist penuh; aman dipanggil di mana saja di dalam berkas
function hitungDiskonDeclaration(harga) {
  // diskon 10%
  return harga * 0.9;
}

// 2. FUNCTION EXPRESSION:
// Disimpan ke dalam variabel const; tidak boleh dipanggil sebelum baris ini
const hitungDiskonExpression = function (harga) {
  // diskon 20%
  return harga * 0.8;
};

// 3. ARROW FUNCTION (CONCISE BODY / IMPLICIT RETURN):
// Sangat ringkas, tanpa kurung kurawal, mengembalikan nilai secara otomatis
// diskon 30%
const hitungDiskonArrow = (harga) => harga * 0.7;

// Hubungkan ke elemen HTML:
const hargaInput = document.querySelector("#input-harga");
const kotakHasil = document.querySelector("#kotak-hasil");

document.querySelector("#btn-dec").addEventListener("click", () => {
  const harga = Number(hargaInput.value);
  kotakHasil.textContent = `Declaration (10%): Rp${hitungDiskonDeclaration(harga).toLocaleString("id-ID")}`;
});

document.querySelector("#btn-exp").addEventListener("click", () => {
  const harga = Number(hargaInput.value);
  kotakHasil.textContent = `Expression (20%): Rp${hitungDiskonExpression(harga).toLocaleString("id-ID")}`;
});

document.querySelector("#btn-arrow").addEventListener("click", () => {
  const harga = Number(hargaInput.value);
  kotakHasil.textContent = `Arrow Function (30%): Rp${hitungDiskonArrow(harga).toLocaleString("id-ID")}`;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan Function Declaration untuk Fungsi Utama / Helper Modul**: Memungkinkan struktur kode *top-down* yang rapi di mana fungsi bantuan ditaruh di bawah.
2. **Gunakan Arrow Function untuk Callback Ringkas**: Sangat ideal untuk callback event listener atau pengolahan array (`array.map((item) => item.nama)`).
3. **Waspadai Jebakan `{}` pada Arrow Function**: Jika Anda membuka kurung kurawal `() => { ... }`, Anda **wajib** menyertakan kata kunci `return`.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik ketiga tombol diskon secara bergantian.
- [ ] Buka Console (`F12`), coba ketik:
  ```javascript
  const tambahSalah = (a, b) => { a + b };
  console.log(tambahSalah(2, 3)); // Perhatikan hasilnya undefined!
  const tambahBenar = (a, b) => a + b;
  console.log(tambahBenar(2, 3)); // Hasilnya 5!
  ```

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu perbedaan Declaration vs Expression vs Arrow Function, dan hafal aturan kurung kurawal `{}` pada implicit vs explicit return**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode berikut:

```javascript
const rumusA = (x) => x * 10;
const rumusB = (x) => { x * 10; };

console.log(rumusA(5)); // Baris 1
console.log(rumusB(5)); // Baris 2
```

1. Berapakah hasil keluaran Baris 1?
2. Berapakah hasil keluaran Baris 2? Mengapa hasilnya berbeda?
```
