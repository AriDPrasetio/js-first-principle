---
title: "Panduan Pemula: IIFE (Fungsi Langsung Jalan Seketika) di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/05-functions
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Glossary/IIFE
---

# Panduan Pemula: IIFE (Fungsi Langsung Jalan Seketika) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> IIFE (_Immediately Invoked Function Expression_, dibaca "I-fi") adalah fungsi yang dibuat dan langsung dijalankan detik itu juga begitu browser membacanya. Fungsi ini berguna membuat gelembung privat agar variabel sementara di dalamnya tidak mengotori atau bertabrakan dengan kode lain.

---

## 1. Analogi Logis: Kapsul Pelindung Sekali Pakai

Bayangkan Anda sedang mencampur bahan kimia pembersih yang baunya menyengat:

- Jika Anda mencampurnya di ruang tamu secara terbuka, baunya akan menyebar ke seluruh rumah (_mencemari variabel global window_).
- Maka Anda masuk ke dalam tenda darurat kedap udara (**tanda kurung pelindung `(...)`**).
- Di dalam tenda, Anda melakukan pencampuran obat, mendapatkan hasil larutannya, lalu keluar.
- Tenda darurat langsung dilipat dan dibuang (**tanda kurung pemicu eksekusi `()`**).
- Ruang tamu Anda tetap bersih wangi, tidak ada bau obat yang tertinggal sama sekali!

---

## 2. Mengapa JavaScript Butuh Sintaks IIFE? (First Principles)

1. **Mencegah Tabrakan Nama Variabel Global**:
   Di era awal web, ketika halaman web menyertakan banyak file `.js` dari berbagai pembuat, semua variabel yang ditulis di luar fungsi akan berkumpul di satu tempat yang sama (`window`). Jika file A membuat `var skor = 10` dan file B juga membuat `var skor = 100`, aplikasi akan rusak bertabrakan. IIFE membungkus kode agar aman di dunianya sendiri.
2. **Trik Tanda Kurung Ganda `( ... )()`**:
   - Jika Anda langsung mengetik `function() {}()`, browser akan protes error karena mengira Anda lupa memberi nama fungsi.
   - Dengan membungkusnya di dalam kurung `( function() { ... } )`, browser tahu: _"Oh, ini satu paket ekspresi fungsi!"_.
   - Lalu tanda kurung di ujung belakang `()` bertindak sebagai tombol yang langsung menekan dan mengeksekusinya seketika.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat widget status server yang menghitung konfigurasi perangkat pengguna secara otomatis menggunakan IIFE tanpa meninggalkan variabel sampah:

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
        max-width: 350px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .badge {
        display: inline-block;
        padding: 4px 8px;
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
      <p>
        Widget ini membaca spesifikasi layar begitu halaman dibuka menggunakan
        IIFE.
      </p>
      <div id="hasil-deteksi" class="badge">Mendeteksi...</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil wadah teks status dari HTML
const wadahHasil = document.querySelector("#hasil-deteksi");
// ambil elemen tempat menaruh hasil deteksi perangkat.

// ================================================================
// IIFE DENGAN ARROW FUNCTION: (() => { ... })()
// Kode di bawah ini langsung dieksekusi otomatis detik itu juga!
// ================================================================
const infoPerangkat = (() => {
  // Variabel-variabel di bawah ini bersifat privat dan aman di dalam kapsul:
  const lebarLayar = window.innerWidth;
  // ukur lebar jendela browser saat ini.

  const tinggiLayar = window.innerHeight;
  // ukur tinggi jendela browser saat ini.

  const tipePerangkat =
    lebarLayar < 768 ? "HP / Ponsel Pintar" : "Komputer Desktop / Laptop";
  // tentukan kategori perangkat berdasarkan lebar layarnya.

  // Kembalikan satu objek rapi ke variabel infoPerangkat:
  return {
    kategori: tipePerangkat,
    resolusi: `${lebarLayar} x ${tinggiLayar} piksel`,
  };
})();
// tanda kurung () di atas langsung memicu eksekusi fungsi tanpa perlu dipanggil terpisah!

// 2. Tampilkan hasil perhitungan IIFE ke halaman HTML
wadahHasil.textContent = `${infoPerangkat.kategori} (${infoPerangkat.resolusi})`;
// variabel sementara seperti lebarLayar dan tinggiLayar di dalam IIFE
// sudah otomatis dibersihkan dari memori dan tidak bisa diakses dari luar!
```

---

## 4. Solusi Praktis / Best Practice

1. **Di Era Modern, Gunakan ES Modules**:
   Pada JavaScript modern, jika Anda menggunakan berkas `<script type="module" src="app.js">`, setiap berkas sudah otomatis terisolasi rapi tanpa perlu dibungkus IIFE.
2. **Gunakan IIFE untuk perhitungan instan yang butuh beberapa variabel sementara**:
   Jika Anda ingin menghitung suatu nilai variabel rumit yang membutuhkan kalkulasi 5 baris, bungkus perhitungan tersebut dalam IIFE agar variabel sementaranya tidak berceceran di luar.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Perhatikan bahwa teks status langsung berubah menjadi kategori perangkat Anda (misal `Komputer Desktop / Laptop (1920 x 1080 piksel)`) tanpa Anda harus mengklik tombol apa pun.
- [ ] Buka Console browser (tekan F12), ketik `lebarLayar` lalu tekan Enter. Anda akan melihat error `ReferenceError: lebarLayar is not defined` yang membuktikan bahwa variabel sementara tersebut aman terlindungi di dalam kapsul IIFE.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu tujuan utama tanda kurung `(...)()` adalah mengeksekusi fungsi seketika agar variabel di dalamnya tidak mencemari memori luar**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa fungsi dari tanda kurung pembungkus terluar `( function() {} )` pada sebuah IIFE? Apa yang terjadi jika tanda kurung tersebut dihilangkan?
2. Mengapa di proyek web modern yang menggunakan `<script type="module">`, kita sudah sangat jarang perlu membungkus seluruh file dengan IIFE?
