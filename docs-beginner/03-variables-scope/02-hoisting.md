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
console.log(hargaBarang); // undefined (Bukan error, tapi nilainya salah!)
var hargaBarang = 50000;
```

Perilaku ini menimbulkan ribuan bug misterius di mana aplikasi berjalan dengan data rusak tanpa diketahui penyebabnya.
Karena itu, pada tahun 2015, komite ECMAScript (TC39) menerapkan **Prinsip Fail-Fast**:
Jika Anda mencoba membaca variabel `let` atau `const` sebelum baris deklarasinya, JavaScript sengaja melempar error seketika:

```javascript
console.log(hargaBarang); // ReferenceError: Cannot access 'hargaBarang' before initialization
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
// Kita memanggil fungsi jalankanAplikasi() di baris PALING ATAS,
// padahal deklarasi fungsinya baru kita tulis di bagian BAWAH!
// =======================================================

// jalankan function jalankanAplikasi, ini bekerja normal karena function declaration di-hoist
jalankanAplikasi();

// =======================================================
// DEKLARASI FUNGSI FORMAL (DIANGKAT LENGKAP OLEH ENGINE)
// =======================================================

// deklarasi function jalankanAplikasi yang berisi logika utama program
function jalankanAplikasi() {
  // ambil element tombol sapa berdasarkan ID-nya, simpan ke variable sapaBtn
  const sapaBtn = document.querySelector("#btn-sapa");

  // ambil element tombol uji TDZ berdasarkan ID-nya, simpan ke variable tdzBtn
  const tdzBtn = document.querySelector("#btn-tdz");

  // ambil element penampil pesan berdasarkan ID-nya, simpan ke variable pesanEl
  const pesanEl = document.querySelector("#teks-pesan");

  // saat sapaBtn di-click, jalankan function berikut:
  sapaBtn.addEventListener("click", () => {
    // perbarui teks di dalam element pesanEl dengan hasil dari pemanggilan function buatSalam
    pesanEl.textContent = buatSalam("Kyo");
  });

  // saat tdzBtn di-click, jalankan function berikut:
  tdzBtn.addEventListener("click", () => {
    // 1. var di-hoist tapi hanya dengan nilai undefined:
    // cetak nilai dari variable namaLama sebelum baris deklarasinya untuk membuktikan var berisi undefined
    console.log("Nilai var sebelum deklarasi:", namaLama);

    // buat variable namaLama menggunakan var dan isi dengan string "Budi (var)"
    var namaLama = "Budi (var)";

    // 2. let berada di TDZ sebelum deklarasi:
    // coba eksekusi block kode berikut, tangkap error jika ada:
    try {
      // cetak nilai dari variable namaBaru sebelum dideklarasikan untuk memicu error TDZ
      console.log("Mencoba membaca let sebelum deklarasi:", namaBaru);
    } catch (err) {
      // jika terjadi error TDZ, tampilkan pesan error tersebut ke console
      console.log("Alarm TDZ berbunyi:", err.message);
    }

    // buat variable namaBaru menggunakan let dan isi dengan string "Ari (let)"
    let namaBaru = "Ari (let)";

    // perbarui teks di dalam element pesanEl untuk mengindikasikan uji coba selesai
    pesanEl.textContent =
      "Uji coba selesai! Buka DevTools Console (F12) untuk melihat perbandingannya.";
  });
}

// deklarasi function buatSalam yang menerima parameter namaPengguna untuk memformat teks salam
function buatSalam(namaPengguna) {
  // kembalikan string sapaan yang digabungkan dengan argumen namaPengguna
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
sapaHalo();
function sapaHalo() {
  console.log("Halo Dunia!");
}

// Kasus B:
sapaKawan();
const sapaKawan = () => {
  console.log("Halo Kawan!");
};

// Pertanyaan:
// 1. Apakah Kasus A berjalan sukses atau error?
// 2. Apakah Kasus B berjalan sukses atau error? Mengapa Kasus B berbeda dengan Kasus A?
```
