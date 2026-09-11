---
title: "Panduan Pemula: Hoisting dan Temporal Dead Zone (TDZ) di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/03-variables-scope
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
---

# Panduan Pemula: Hoisting dan Temporal Dead Zone (TDZ) di JavaScript

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> Komputer membaca kode Anda dalam dua putaran: putaran pertama mencatat semua nama variabel dan fungsi di memori (_Fase Persiapan_), dan putaran kedua baru menjalankan instruksi baris demi baris (_Fase Eksekusi_). Itulah sebabnya beberapa hal sudah "dikenal" komputer sebelum barisnya dibaca.

---

## 1. Analogi Logis: Gladi Bersih Pementasan Teater

Bayangkan sebuah pementasan drama teater:

1. **Tahap 1: Pengecekan Daftar Hadir (Sebelum Panggung Dibuka)**
   Sebelum tirai dibuka, sutradara memegang papan absensi dan mencatat semua nama aktor yang akan tampil hari itu. Sutradara sudah tahu siapa saja yang ada di gedung teater.
2. **Tahap 2: Pementasan Berjalan (Tirai Terbuka)**
   Aktor maju ke atas panggung satu per satu sesuai urutan naskah.

Di JavaScript:

- **Fungsi Biasa (`function sapa() {}`)**: Seperti aktor utama yang sudah mengenakan kostum lengkap sejak awal. Kapan pun sutradara memanggilnya (bahkan di awal naskah), ia siap tampil!
- **Variabel `let` dan `const`**: Namanya sudah dicatat di daftar hadir, tetapi ia masih berada di ruang tunggu tertutup (_Temporal Dead Zone_). Jika Anda memanggilnya ke panggung sebelum gilirannya tiba, sutradara akan berteriak marah (_Error: Cannot access before initialization!_).

---

## 2. Mengapa Ini Menguntungkan Kita? (First Principles)

Karena fungsi biasa "diangkat" (_hoisted_) ke memori sejak awal:

- Anda bisa memanggil fungsi utama di baris paling atas berkas Anda agar orang lain langsung paham tujuan program Anda (_Top-Down Readability_).
- Anda bisa menaruh fungsi-fungsi pembantu (_helper functions_) yang panjang di bagian paling bawah berkas tanpa khawatir fungsi tersebut gagal dipanggil.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buktikan bahwa fungsi bisa dipanggil sebelum baris deklarasinya:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Hoisting</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 320px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      button {
        padding: 8px 12px;
        cursor: pointer;
      }
      .pesan {
        margin-top: 12px;
        font-weight: bold;
        color: #008800;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Uji Coba Hoisting Fungsi</h3>
      <button type="button" id="btn-sapa">Panggil Fungsi</button>
      <p id="teks-pesan" class="pesan">-</p>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// =======================================================
// BUKTI HOISTING:
// Kita memanggil fungsi jalankanAplikasi() di baris PALING ATAS,
// padahal deklarasi fungsinya baru kita tulis di bagian BAWAH!
// =======================================================

jalankanAplikasi();
// panggil fungsi jalankanAplikasi() seketika. Ini berjalan normal tanpa error!

// =======================================================
// DEKLARASI FUNGSI FORMAL (DIANGKAT LENGKAP OLEH BROWSER)
// =======================================================

function jalankanAplikasi() {
  // fungsi ini disiapkan oleh browser sebelum baris pertama kode dieksekusi:

  const sapaBtn = document.querySelector("#btn-sapa");
  // ambil tombol dengan ID 'btn-sapa'.

  const pesanEl = document.querySelector("#teks-pesan");
  // ambil elemen teks dengan ID 'teks-pesan'.

  sapaBtn.addEventListener("click", () => {
    // saat tombol diklik, panggil fungsi pembuat pesan:
    pesanEl.textContent = buatSalam("Kyo");
  });
}

function buatSalam(namaPengguna) {
  // fungsi pembantu ini juga dideklarasikan di bagian bawah:
  return `Halo, ${namaPengguna}! Selamat datang di aplikasi.`;
}
```

---

## 4. Solusi Praktis / Aturan Main Pemula

1. **Untuk Fungsi**: Manfaatkan deklarasi `function namaFungsi() {}` agar Anda leluasa mengatur urutan kode dari atas ke bawah.
2. **Untuk Variabel (`let` / `const`)**: **Selalu deklarasikan di atas sebelum variabel tersebut dipakai**. Jangan pernah mencoba membaca variabel sebelum baris pembuatannya agar tidak terkena _Temporal Dead Zone (TDZ)_.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik tombol **"Panggil Fungsi"**.
- [ ] Perhatikan teks salam muncul di layar tanpa ada error sama sekali.
- [ ] Buka Console browser (`F12`), coba ketik kode eksperimen ini untuk melihat alarm TDZ:
  ```javascript
  console.log(namaSaya); // Coba baca sebelum dibuat
  let namaSaya = "Ari"; // Baris pembuatan
  ```
  Lihat pesan errornya: `ReferenceError: Cannot access 'namaSaya' before initialization`.

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Mengerti mengapa fungsi formal aman dipanggil sebelum posisinya di berkas, sedangkan variabel `let`/`const` wajib dideklarasikan terlebih dahulu**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode berikut:

```javascript
sapaHalo();

function sapaHalo() {
  console.log("Halo Dunia!");
}
```

Apakah kode di atas akan:

- **A. Berjalan sukses menampilkan "Halo Dunia!"**
- **B. Menghasilkan error karena sapaHalo() dipanggil sebelum baris fungsinya?**
