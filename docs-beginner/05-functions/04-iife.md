---
title: "Panduan Pemula: IIFE (Fungsi Langsung Jalan Seketika) di JavaScript"
tags: "javascript, first-principles, roadmap-js/05-functions"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Glossary/IIFE"
---

# Panduan Pemula: IIFE (Fungsi Langsung Jalan Seketika) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> IIFE (*Immediately Invoked Function Expression*, dibaca "I-fi") adalah fungsi yang didefinisikan dan langsung dieksekusi detik itu juga begitu peramban membacanya. Fungsi ini berguna membuat kapsul lingkup privat agar variabel sementara di dalamnya tidak mengotori atau bertabrakan dengan kode lain di ruang global.

---

## 1. Analogi Logis: Kapsul Pelindung Sekali Pakai

Bayangkan Anda sedang mencampur bahan kimia pembersih yang baunya menyengat:

- Jika Anda mencampurnya di ruang tamu secara terbuka, baunya akan menyebar ke seluruh rumah (*mencemari variabel global window*).
- Maka Anda masuk ke dalam tenda darurat kedap udara (**tanda kurung pelindung `(...)`**).
- Di dalam tenda, Anda melakukan pencampuran bahan kimia, mendapatkan cairan jadinya, lalu keluar.
- Tenda darurat langsung dibuang dan dilipat (**tanda kurung pemicu eksekusi `()`**).
- Ruang tamu Anda tetap bersih wangi, tidak ada bau obat yang tertinggal sama sekali!

---

## 2. Mengapa JavaScript Butuh Sintaks IIFE? (First Principles)

### A. Trik Dua Tanda Kurung `( ... )()`

Jika Anda langsung mengetik `function() {}()`, browser akan melempar `SyntaxError` karena mengira Anda sedang membuat deklarasi fungsi formal tanpa nama.

Dengan membungkus fungsi di dalam tanda kurung:
1. **Kurung Pembungkus `( ... )`**: Memaksa parser JavaScript memperlakukan fungsi sebagai ekspresi (*Expression*), bukan pernyataan formal (*Declaration*).
2. **Kurung Pemanggil `()` di Ujung**: Bertindak sebagai tombol pemanggil instan untuk langsung mengeksekusi ekspresi fungsi tersebut seketika.

### B. Dua Variasi Sintaks IIFE Modern

```javascript
// 1. Variasi Fungsi Reguler Klasik (Mendukung pengiriman parameter):
(function (nama) {
  console.log(`Halo dari IIFE Klasik, ${nama}!`);
})("Kyo");

// 2. Variasi Arrow Function Modern:
((nama) => {
  console.log(`Halo dari IIFE Arrow, ${nama}!`);
})("Ari");
```

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat widget pendeteksi spesifikasi layar perangkat yang berjalan otomatis menggunakan IIFE tanpa meninggalkan variabel sementara:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | IIFE (Immediately Invoked Function)</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .badge {
        display: inline-block;
        padding: 6px 12px;
        background: #e1f5fe;
        color: #0277bd;
        border-radius: 4px;
        font-weight: bold;
        margin-top: 8px;
      }
      p {
        margin: 6px 0;
        color: #444;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Pemeriksaan Perangkat Otomatis</h3>
      <p>Widget ini mengukur resolusi dan tipe layar seketika saat halaman dibuka menggunakan IIFE.</p>
      <div id="hasil-deteksi" class="badge">Mendeteksi...</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
const wadahHasil = document.querySelector("#hasil-deteksi");

// ================================================================
// IIFE DENGAN ARROW FUNCTION & PENGIRIMAN ARGUMEN
// Mengirim window ke dalam parameter 'w' untuk efisiensi
// ================================================================
const infoPerangkat = ((w) => {
  // Variabel-variabel di bawah ini bersifat privat dan aman di dalam kapsul:
  const lebarLayar = w.innerWidth;
  const tinggiLayar = w.innerHeight;

  const tipePerangkat =
    lebarLayar < 768 ? "HP / Ponsel Pintar" : "Komputer Desktop / Laptop";

  // Kembalikan satu objek hasil akhir ke variabel infoPerangkat:
  return {
    kategori: tipePerangkat,
    resolusi: `${lebarLayar} x ${tinggiLayar} piksel`,
  };
  // Argumen 'window' disuapkan ke parameter 'w':
})(window);

// Tampilkan hasil perhitungan IIFE ke halaman HTML:
wadahHasil.textContent = `${infoPerangkat.kategori} (${infoPerangkat.resolusi})`;

// BUKTI ENKAPSULASI:
// Variabel lebarLayar dan tinggiLayar tidak bisa diakses dari luar:
// console.log(lebarLayar); // ReferenceError: lebarLayar is not defined
```

---

## 4. Solusi Praktis / Best Practice

1. **Di Era Modern, Gunakan ES Modules**: Pada aplikasi web modern yang menggunakan `<script type="module">`, setiap file `.js` sudah otomatis memiliki *Module Scope* sendiri, sehingga Anda jarang perlu membungkus seluruh isi file dengan IIFE.
2. **Gunakan IIFE untuk Menghitung Nilai Rumit yang Perlu Variabel Sementara**: Jika Anda perlu menginisialisasi satu objek kompleks yang membutuhkan beberapa variabel bantu, gunakan IIFE agar variabel bantu tersebut langsung dibersihkan dari memori.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Perhatikan bahwa teks status langsung berubah menjadi kategori perangkat Anda secara otomatis saat pertama kali dibuka.
- [ ] Buka Console browser (`F12`), ketik `lebarLayar` lalu tekan Enter. Anda akan melihat error `ReferenceError: lebarLayar is not defined` yang membuktikan bahwa variabel sementara aman di dalam kapsul IIFE.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu bahwa IIFE adalah cara menjalankan fungsi detik itu juga, mengerti peran kurung `(...)()`, dan tahu cara mengoper argumen ke dalam IIFE**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa fungsi dari tanda kurung pembungkus terluar `( function() {} )` pada sebuah IIFE? Apa yang terjadi jika tanda kurung tersebut dihilangkan?
2. Perhatikan kode berikut:
   ```javascript
   const hasil = ((a, b) => {
     return a * b;
   })(4, 5);
   ```
   Berapakah nilai dari variabel `hasil`?
```
