---
title: "Panduan Pemula: Block, Function, dan Global Scope di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/03-variables-scope
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Glossary/Scope
---

# Panduan Pemula: Block, Function, dan Global Scope di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Scope adalah aturan "wilayah kekuasaan" variabel: kode yang berada di dalam ruangan privat bisa melihat data di luar, tetapi kode di luar sama sekali tidak bisa mengintip data rahasia di dalam ruangan tertutup.

---

## 1. Analogi Logis: Kaca Film Mobil Satu Arah

Bayangkan Anda sedang duduk di dalam mobil dengan kaca film gelap satu arah:

- **Dari dalam mobil**: Anda bisa melihat pemandangan jalan raya, lampu lalu lintas, dan gedung di luar dengan sangat jelas.
- **Dari luar mobil**: Orang yang lewat di trotoar sama sekali tidak bisa melihat apa yang ada di dalam mobil Anda.

Aturan wilayah (_Scope_) di JavaScript bekerja persis seperti kaca satu arah ini:

- **Melihat ke luar? BISA.** Fungsi di dalam selalu bisa membaca variabel di luarnya.
- **Melihat ke dalam? TIDAK BISA.** Kode di luar dilarang menyentuh variabel yang dibuat di dalam kurung kurawal `{ }`.

---

## 2. Tiga Tingkat Wilayah (First Principles)

Di JavaScript ada 3 tingkat wilayah:

1. **Global Scope (Lapangan Terbuka)**:
   Variabel yang dibuat di luar fungsi atau blok apa pun. Semua kode di seluruh berkas bisa mengaksesnya. Jangan menaruh terlalu banyak variabel di sini agar tidak saling bertabrakan.
2. **Function Scope (Ruang Kantor Privat)**:
   Variabel yang dibuat di dalam sebuah fungsi (`function`). Variabel ini hanya hidup selama fungsi tersebut berjalan, lalu hilang saat fungsi selesai.
3. **Block Scope (Kamar Pribadi Berkurung `{ }`)**:
   Variabel `let` dan `const` yang dibuat di antara tanda kurung kurawal `{ }` (misal di dalam percabangan `if` atau perulangan `for`). Variabel ini terkunci rapat di dalam blok tersebut.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buktikan isolasi wilayah ini di browser:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Scope</title>
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
        margin-top: 8px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Uji Wilayah (Scope)</h3>
      <p>Judul Global: <strong id="judul-global">-</strong></p>
      <p>Pesan Privat: <strong id="pesan-privat">-</strong></p>
      <button type="button" id="btn-baca">Jalankan Fungsi Privat</button>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. WILAYAH GLOBAL (Bisa dibaca oleh siapa saja)
const namaAplikasi = "Portal Belajar Kyo";
// variabel ini berada di luar, di lapangan terbuka (Global Scope).

// 2. Ambil elemen HTML yang dibutuhkan
const judulGlobalEl = document.querySelector("#judul-global");
const pesanPrivatEl = document.querySelector("#pesan-privat");
const bacaBtn = document.querySelector("#btn-baca");

// Tampilkan variabel global ke layar langsung:
judulGlobalEl.textContent = namaAplikasi;

// 3. FUNGSI DENGAN WILAYAH PRIVAT (FUNCTION & BLOCK SCOPE)
bacaBtn.addEventListener("click", () => {
  // blok fungsi ini adalah ruangan privat:

  // Variabel lokal privat di dalam fungsi:
  const kodeRahasia = "XYZ-999";
  // kodeRahasia hanya ada di dalam ruangan ini.

  if (true) {
    // ini adalah kamar block scope lebih dalam lagi:
    const pesanKamar = `Akses diberikan ke ${namaAplikasi}`;
    // kamar ini BISA membaca namaAplikasi dari luar (prinsip kaca satu arah!).

    pesanPrivatEl.textContent = `${pesanKamar} | Kode: ${kodeRahasia}`;
    // kamar ini juga bisa membaca kodeRahasia dari ruangan pembungkusnya.
  }

  // console.log(pesanKamar); // ERROR! Di luar blok if, pesanKamar tidak terlihat.
});

// BUKTI KACA SATU ARAH:
// Jika kita mencoba membaca kodeRahasia di luar ruangan:
// console.log(kodeRahasia);
// Hasilnya: ReferenceError: kodeRahasia is not defined (Aman terlindungi!)
```

---

## 4. Solusi Praktis / Best Practice

1. **Prinsip Hak Akses Terkecil (_Least Privilege_)**: Selalu buat variabel di wilayah paling sempit yang membutuhkan. Jika variabel hanya dipakai di dalam satu tombol klik, jangan taruh di global!
2. **Hindari Polusi Global**: Variabel global mudah tertimpa tanpa sengaja dan memakan memori terus-menerus.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik tombol **"Jalankan Fungsi Privat"**.
- [ ] Perhatikan teks gabungan dari variabel global dan variabel privat berhasil dirender.
- [ ] Buka Console browser (`F12`), ketik `console.log(namaAplikasi)` (hasil: muncul namanya). Lalu ketik `console.log(kodeRahasia)` (hasil: `ReferenceError`).

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti mengapa fungsi bisa membaca variabel luar, tetapi kode di luar tidak bisa menyentuh variabel yang dibuat di dalam fungsi**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode berikut:

```javascript
let namaLuar = "Aria";

function tesScope() {
  let namaDalam = "Budi";
}

tesScope();
console.log(namaDalam);
```

Apakah baris terakhir akan:

- **A. Mencetak teks "Budi"**
- **B. Melempar error `ReferenceError: namaDalam is not defined`?**
