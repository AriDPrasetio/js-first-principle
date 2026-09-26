---
title: "Panduan Pemula: Hoisting dan Temporal Dead Zone (TDZ) di JavaScript"
tags: "javascript, first-principles, roadmap-js/03-variables-scope"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting"
---

# Panduan Pemula: Hoisting dan Temporal Dead Zone (TDZ) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Komputer membaca kode Anda dalam dua putaran: putaran pertama mencatat semua nama variabel dan fungsi di memori (_Fase Kompilasi/Persiapan_), dan putaran kedua baru mengeksekusi instruksi baris demi baris (_Fase Eksekusi_). Proses pengangkatan pencatatan nama ini disebut **Hoisting**.

---

## 1. Analogi Logis: Gladi Bersih Pementasan Teater

Bayangkan sebuah pementasan drama teater:

1. **Tahap 1: Pengecekan Daftar Hadir (Sebelum Panggung Dibuka)**
   Sebelum tirai dibuka, sutradara memegang papan absensi dan mencatat semua nama aktor yang akan tampil hari itu. Sutradara sudah tahu siapa saja yang ada di gedung teater.
2. **Tahap 2: Pementasan Berjalan (Tirai Terbuka)**
   Aktor maju ke atas panggung satu per satu sesuai urutan naskah.

Di JavaScript, perilaku aktor saat dipanggil sebelum naskahnya tiba terbagi menjadi 3 jenis:

- **Fungsi Biasa (`function sapa() {}`)**: Seperti aktor utama yang sudah mengenakan kostum lengkap sejak awal. Kapan pun sutradara memanggilnya (bahkan di baris pertama naskah), ia siap tampil lengkap beserta dialognya (_Function Hoisting_).
- **Variabel `var` (Warisan Masa Lalu)**: Aktor yang nekat naik ke panggung sebelum gilirannya tiba, tetapi ia belum mengenakan kostum dan lupa dialognya. Sutradara melihatnya, tetapi nilainya kosong melompong (**`undefined`**).
- **Variabel `let` dan `const`**: Namanya sudah tercatat di daftar hadir, tetapi ia diwajibkan menunggu di ruang tunggu tertutup (**Temporal Dead Zone / TDZ**). Jika Anda memanggilnya sebelum gilirannya tiba, sutradara akan berteriak marah (_Error: Cannot access before initialization!_).

---

## 2. Mengapa JavaScript Didesain Seperti Ini? (First Principles)

### A. Mengapa Fungsi Biasa Di-hoist Penuh?

Karena fungsi formal diangkat lengkap bersama tubuh logikanya:

- Anda bisa memanggil fungsi utama di baris paling atas berkas Anda agar orang lain langsung paham alur inti program Anda (_Top-Down Readability_).
- Anda bisa menaruh fungsi-fungsi pembantu (_helper functions_) yang panjang di bagian paling bawah berkas tanpa khawatir fungsi tersebut gagal dipanggil.

### B. Mengapa Dibuat _Temporal Dead Zone_ (TDZ)?

Di era lama, ketika `var` diakses sebelum deklarasinya, JavaScript mengembalikan `undefined` tanpa memunculkan pesan error:

```javascript
// 1. Cetak isi wadah hargaBarang ke konsol sebelum wadahnya dibuat
// Catatan*: var diangkat (hoisting) secara diam-diam sehingga menghasilkan undefined, bukan error
console.log(hargaBarang);
// 2. Buat wadah hargaBarang menggunakan var dan isi dengan 50000
var hargaBarang = 50000;
```

Perilaku ini menimbulkan ribuan bug misterius di mana aplikasi berjalan dengan data rusak tanpa diketahui penyebabnya.
Karena itu, pada tahun 2015, komite ECMAScript (TC39) menerapkan **Prinsip Fail-Fast**:
Jika Anda mencoba membaca variabel `let` atau `const` sebelum baris deklarasinya, JavaScript sengaja melempar error seketika:

```javascript
// 1. Cetak isi wadah hargaBarang ke konsol sebelum wadahnya dibuat
// Catatan*: let menciptakan area larangan akses (TDZ), sehingga seketika memicu error
console.log(hargaBarang);
// 2. Buat wadah hargaBarang menggunakan let dan isi dengan 50000
let hargaBarang = 50000;
```

Area sejak awal cakupan lingkup hingga baris deklarasi variabel itulah yang disebut **Temporal Dead Zone (TDZ)**.

> [!WARNING]
> **Peringatan untuk Arrow Function**:
> Hanya _Function Declaration_ (`function nama() {}`) yang diangkat utuh. Jika Anda membuat fungsi menggunakan arrow function atau expression (`const sapa = () => {}`), fungsi tersebut diperlakukan sebagai variabel `const` biasa dan akan terkena error TDZ jika dipanggil sebelum deklarasinya!

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buktikan bahwa fungsi biasa aman dipanggil sebelum posisinya, dan amati perbandingan akses dini:

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
        width: 100%;
        margin-top: 6px;
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
      <h3>Uji Coba Hoisting</h3>
      <button type="button" id="btn-sapa">Panggil Fungsi Di-hoist</button>
      <button type="button" id="btn-tdz">Uji Coba TDZ vs var</button>
      <p id="teks-pesan" class="pesan">-</p>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// =======================================================
// BUKTI HOISTING FUNGSI FORMAL:
// Pemanggilan jalankanAplikasi() dilakukan di baris PALING ATAS,
// padahal deklarasi fungsinya baru ditulis di bagian BAWAH!
// =======================================================

// 1. Panggil fungsi jalankanAplikasi sebelum posisinya ditulis
// Catatan*: Berhasil karena fungsi formal diangkat sepenuhnya (hoisting) ke atas
jalankanAplikasi();

// =======================================================
// DEKLARASI FUNGSI FORMAL (DIANGKAT LENGKAP OLEH ENGINE)
// =======================================================

// 2. Buat fungsi jalankanAplikasi yang berisi seluruh logika utama program
function jalankanAplikasi() {
  // 3. Ambil elemen-elemen tombol dan penampil pesan dari halaman berdasarkan ID
  const sapaBtn = document.querySelector("#btn-sapa");
  const tdzBtn = document.querySelector("#btn-tdz");
  const pesanEl = document.querySelector("#teks-pesan");

  // 4. Pasang aksi pada tombol sapa untuk dijalankan saat diklik
  sapaBtn.addEventListener("click", () => {
    // 5. Panggil fungsi buatSalam dengan teks "Kyo" dan simpan hasilnya sebagai teks di elemen pesanEl
    pesanEl.textContent = buatSalam("Kyo");
  });

  // 6. Pasang aksi pada tombol uji TDZ untuk dijalankan saat diklik
  tdzBtn.addEventListener("click", () => {
    // 7. Cetak isi wadah namaLama sebelum baris pembuatannya
    // Catatan*: var menghasilkan undefined saat dibaca sebelum waktunya
    console.log("Nilai var sebelum deklarasi:", namaLama);

    // 8. Buat wadah namaLama menggunakan var dan isi dengan teks
    var namaLama = "Budi (var)";

    // 9. Coba akses wadah namaBaru yang belum dibuat
    try {
      // 10. Baris ini akan memicu error TDZ karena let menolak akses dini
      console.log("Mencoba membaca let sebelum deklarasi:", namaBaru);
    } catch (err) {
      // 11. Tangkap pesan error TDZ dan tampilkan ke konsol
      console.log("Alarm TDZ berbunyi:", err.message);
    }

    // 12. Buat wadah namaBaru menggunakan let dan isi dengan teks
    let namaBaru = "Ari (let)";

    // 13. Perbarui teks pada elemen pesanEl sebagai tanda uji coba selesai
    pesanEl.textContent =
      "Uji coba selesai! Buka DevTools Console (F12) untuk melihat perbandingannya.";
  });
}

// 14. Buat fungsi pembantu buatSalam yang menerima data namaPengguna
function buatSalam(namaPengguna) {
  // 15. Kembalikan kalimat sapaan hasil gabungan teks tetap dan namaPengguna
  return `Halo, ${namaPengguna}! Selamat datang di aplikasi.`;
}
```

---

## 4. Solusi Praktis / Aturan Main Pemula

1. **Untuk Fungsi Formal**: Manfaatkan deklarasi `function namaFungsi() {}` agar Anda leluasa meletakkan detail helper di bawah berkas.
2. **Untuk Variabel (`let` / `const`)**: **Selalu deklarasikan variabel di bagian paling atas blok sebelum variabel tersebut dipakai** agar kode Anda tidak pernah terjebak dalam _Temporal Dead Zone (TDZ)_.
3. **Pahami Error TDZ**: Jika Anda melihat error `Cannot access '...' before initialization`, artinya Anda mencoba membaca variabel sebelum baris `let` atau `const` miliknya dieksekusi.

---

## 5. Checklist Praktik Mandiri

- [x] Buka `index.html` di browser dan klik tombol **"Panggil Fungsi Di-hoist"**.
- [x] Amati salam muncul di layar meskipun fungsi `jalankanAplikasi` dan `buatSalam` ditulis di bawah titik pemanggilannya.
- [x] Klik tombol **"Uji Coba TDZ vs var"** dan buka Console DevTools (`F12`).
- [x] Perhatikan perbedaan output: `var` mencetak `undefined` sedangkan `let` membunyikan alarm `ReferenceError`.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti mengapa fungsi biasa aman dipanggil sebelum posisinya di berkas, memahami apa itu TDZ pada variabel `let`/`const`, dan tahu mengapa TDZ diciptakan untuk mencegah bug nilai `undefined`**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan potongan kode berikut:

```javascript
// Kasus A:
// 1. Panggil fungsi sapaHalo sebelum blok pembuatannya
sapaHalo();
// 2. Buat fungsi formal sapaHalo
function sapaHalo() {
  console.log("Halo Dunia!");
}

// Kasus B:
// 3. Panggil fungsi sapaKawan sebelum blok pembuatannya
sapaKawan();
// 4. Buat fungsi sapaKawan menggunakan bentuk arrow function dan const
const sapaKawan = () => {
  console.log("Halo Kawan!");
};

// 5. Analisis hasil dari dua kasus di atas:
// - Apakah Kasus A berjalan sukses atau error?
// - Apakah Kasus B berjalan sukses atau error? Mengapa Kasus B berbeda dengan Kasus A?
```
