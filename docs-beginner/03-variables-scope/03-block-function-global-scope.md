---
title: "Panduan Pemula: Block, Function, dan Global Scope di JavaScript"
tags: "javascript, first-principles, roadmap-js/03-variables-scope"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Glossary/Scope"
---

# Panduan Pemula: Block, Function, dan Global Scope di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Scope adalah aturan "wilayah kekuasaan" variabel: kode yang berada di dalam ruangan privat bisa melihat data di luar (_Scope Chain_), tetapi kode di luar sama sekali tidak bisa mengintip data rahasia di dalam ruangan tertutup.

---

## 1. Analogi Logis: Kaca Film Mobil Satu Arah

Bayangkan Anda sedang duduk di dalam mobil dengan kaca film gelap satu arah:

- **Dari dalam mobil**: Anda bisa melihat pemandangan jalan raya, lampu lalu lintas, dan gedung di luar dengan sangat jelas.
- **Dari luar mobil**: Orang yang lewat di trotoar sama sekali tidak bisa melihat apa yang ada di dalam mobil Anda.

Aturan wilayah (_Scope_) di JavaScript bekerja persis seperti kaca satu arah ini:

- **Melihat ke luar? BISA.** Kode di dalam selalu bisa membaca variabel di luarnya.
- **Melihat ke dalam? TIDAK BISA.** Kode di luar dilarang menyentuh variabel yang dibuat di dalam kurung kurawal `{ }` atau di dalam fungsi.

---

## 2. Tiga Tingkat Wilayah & Mekanisme Scope Chain (First Principles)

Di JavaScript ada 3 tingkat wilayah:

1. **Global Scope (Lapangan Terbuka)**:
   Variabel yang dibuat di luar fungsi atau blok apa pun. Semua kode di seluruh berkas bisa mengaksesnya.
2. **Function Scope (Ruang Kantor Privat)**:
   Variabel yang dibuat di dalam sebuah fungsi (`function`). Variabel ini hanya hidup selama fungsi tersebut berjalan, lalu dibersihkan dari memori saat fungsi selesai.
3. **Block Scope (Kamar Pribadi Berkurung `{ }`)**:
   Variabel `let` dan `const` yang dibuat di antara tanda kurung kurawal `{ }` (misal di dalam percabangan `if` atau perulangan `for`).

### A. Rantai Pencarian Variabel (_Scope Chain_)

Ketika Anda memanggil sebuah nama variabel, engine JavaScript mencarinya secara bertingkat dari dalam ke luar:

```
[ Blok Terdalam ] ──(tidak ada?)──> [ Fungsi Pembungkus ] ──(tidak ada?)──> [ Global Scope ] ──(tidak ada?)──> [ ReferenceError! ]
```

Engine mencari dari kamar saat ini. Jika tidak ditemukan, ia naik satu tingkat ke ruangan pembungkus, dan terus naik hingga ke tingkat Global. Jika di tingkat Global tetap tidak ada, barulah muncul pesan `ReferenceError: ... is not defined`.

### B. Bahaya Menimpa Nama: _Variable Shadowing_

Jika Anda membuat variabel di dalam kamar privat dengan **nama yang sama persis** dengan variabel di luar, variabel dalam akan "membayangi" (_shadowing_) variabel luar:

```javascript
const pengguna = "Budi (Global)";

function sapa() {
  // Shadowing! Menutupi variabel pengguna luar
  const pengguna = "Andi (Lokal)";
  console.log(pengguna); // Mencetak: "Andi (Lokal)"
}

sapa();
console.log(pengguna); // Mencetak: "Budi (Global)"
```

Meskipun sah secara sintaks, _shadowing_ sering membingungkan pembaca kode karena sulit membedakan variabel mana yang sedang aktif.

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
        width: 100%;
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
// buat variable namaAplikasi di global scope dan isi dengan string "Portal Belajar Kyo"
const namaAplikasi = "Portal Belajar Kyo";

// 2. Ambil elemen HTML yang dibutuhkan
// ambil element penampil judul global berdasarkan ID-nya, simpan ke variable judulGlobalEl
const judulGlobalEl = document.querySelector("#judul-global");

// ambil element penampil pesan privat berdasarkan ID-nya, simpan ke variable pesanPrivatEl
const pesanPrivatEl = document.querySelector("#pesan-privat");

// ambil element tombol baca berdasarkan ID-nya, simpan ke variable bacaBtn
const bacaBtn = document.querySelector("#btn-baca");

// Tampilkan variabel global ke layar langsung:
// perbarui teks di dalam element judulGlobalEl dengan value dari variable global namaAplikasi
judulGlobalEl.textContent = namaAplikasi;

// 3. FUNGSI DENGAN WILAYAH PRIVAT (FUNCTION & BLOCK SCOPE)
// saat bacaBtn di-click, jalankan function privat berikut:
bacaBtn.addEventListener("click", () => {
  // buat variable kodeRahasia di dalam function scope dan isi dengan string "XYZ-999"
  const kodeRahasia = "XYZ-999";

  // jika kondisi true terpenuhi, maka masuk ke dalam block scope:
  if (true) {
    // buat variable pesanKamar di dalam block scope yang menggabungkan teks dengan variable dari global scope (namaAplikasi)
    const pesanKamar = `Akses diberikan ke ${namaAplikasi}`;

    // perbarui teks di dalam element pesanPrivatEl dengan menggabungkan pesanKamar dan variable dari function scope (kodeRahasia)
    pesanPrivatEl.textContent = `${pesanKamar} | Kode: ${kodeRahasia}`;
  }

  // ERROR! Di luar blok if, pesanKamar tidak terlihat:
  // console.log(pesanKamar);
});

// BUKTI KACA SATU ARAH:
// Jika kita mencoba membaca kodeRahasia di luar ruangan:
// console.log(kodeRahasia);
// Hasilnya: ReferenceError: kodeRahasia is not defined (Aman terlindungi!)
```

---

## 4. Solusi Praktis / Best Practice

1. **Prinsip Hak Akses Terkecil (_Least Privilege_)**: Selalu buat variabel di wilayah paling sempit yang membutuhkan. Jika variabel hanya dipakai di dalam satu blok tombol, jangan taruh di lingkup global!
2. **Hindari Polusi Global**: Variabel global mudah tertimpa tanpa sengaja dan memakan memori terus-menerus selama halaman aktif.
3. **Hindari _Variable Shadowing_**: Gunakan nama variabel yang jelas dan unik agar Anda tidak menutupi variabel luar secara tidak sengaja.

---

## 5. Checklist Praktik Mandiri

- [x] Buka `index.html` di browser dan klik tombol **"Jalankan Fungsi Privat"**.
- [x] Perhatikan teks gabungan dari variabel global dan variabel privat berhasil dirender.
- [x] Buka Console browser (`F12`), ketik `console.log(namaAplikasi)` (hasil: muncul namanya). Lalu ketik `console.log(kodeRahasia)` (hasil: `ReferenceError`).

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti bagaimana alur pencarian Scope Chain dari dalam ke luar, serta memahami bahwa blok kurung kurawal `{}` mengunci variabel `let`/`const` dari pandangan luar**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode berikut:

```javascript
let namaLuar = "Aria";

function tesScope() {
  let namaDalam = "Budi";
  console.log(namaLuar); // Baris 1
}

tesScope();
console.log(namaDalam); // Baris 2
```

1. Apakah yang dicetak oleh **Baris 1**?
2. Apakah yang terjadi pada **Baris 2**? Mengapa?

```

```
