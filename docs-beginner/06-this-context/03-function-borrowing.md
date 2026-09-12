---
title: "Panduan Pemula: Meminjam Fungsi (Function Borrowing) di JavaScript"
tags: "javascript, first-principles, roadmap-js/06-this-context"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call"
---

# Panduan Pemula: Meminjam Fungsi (Function Borrowing) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Function Borrowing adalah teknik cerdas di mana suatu objek atau kumpulan data meminjam fungsi sakti milik objek lain lewat `.call()` atau `.apply()`, tanpa Anda harus menulis ulang fungsi tersebut dari nol.

---

## 1. Analogi Logis: Meminjam Pompa Ban Tetangga

Bayangkan Anda punya sepeda di rumah:

- Anda ingin memompa ban sepeda Anda, tetapi Anda tidak punya alat pompa.
- Tetangga sebelah rumah memiliki pompa ban mobil yang sangat canggih.
- Apakah Anda harus keluar uang membeli pompa ban baru? Tidak perlu! Anda cukup datang ke tetangga dan berkata: _"Boleh saya pinjam pompamu sebentar untuk mengisi angin ban sepeda saya?"_.
- Di JavaScript: Objek Anda tidak punya metode canggih seperti `.join()` atau `.slice()`, jadi Anda **meminjam metode milik Array** menggunakan `.call()`.

---

## 2. Mengapa Kita Perlu Meminjam Fungsi? (First Principles)

1. **Struktur Data Serupa tapi Tak Sama (_Array-like_)**:
   Di browser, saat Anda mengambil semua tombol HTML dengan `document.querySelectorAll("button")`, browser mengembalikan kumpulan elemen bernama **`NodeList`**. Tampilannya punya urutan `0, 1, 2` dan panjang `.length`, tapi ia **bukan Array murni**, sehingga tidak punya metode bawaan array seperti `.map()` atau `.join()`.
2. **Prinsip "Bebek" (_Duck Typing_)**:
   Banyak metode di JavaScript tidak peduli siapa Anda. Selama data Anda punya angka indeks (`0, 1, 2`) dan punya `.length`, fungsi Array akan menganggap Anda "cukup mirip array" dan bersedia memproses data Anda!
3. **Jalan Pintas Modern: `Array.from()`**:
   Di JavaScript modern, Anda juga punya jalan pintas resmi bernama `Array.from()` untuk langsung menyulap data tiruan menjadi Array asli sejati.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita ambil elemen daftar belanja dari halaman HTML, lalu pinjam metode Array untuk menggabungkan teksnya menjadi satu kalimat rapi:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Meminjam Fungsi (Function Borrowing)</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 350px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      ul {
        padding-left: 20px;
      }
      li {
        margin-bottom: 4px;
      }
      button {
        padding: 8px 12px;
        cursor: pointer;
        width: 100%;
        margin-bottom: 8px;
      }
      .output {
        padding: 10px;
        background-color: #f1f5f9;
        border-radius: 4px;
        font-weight: bold;
        color: #1e293b;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Daftar Menu Makanan</h3>
      <ul id="daftar-menu">
        <li class="item-menu">Nasi Goreng</li>
        <li class="item-menu">Mie Ayam</li>
        <li class="item-menu">Sate Ayam</li>
        <li class="item-menu">Es Teh Manis</li>
      </ul>

      <button type="button" id="btn-pinjam">
        Gabungkan Menu (Pinjam Array.map)
      </button>
      <div id="wadah-hasil" class="output">Menu belum digabung.</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen dari HTML
const tombolPinjam = document.querySelector("#btn-pinjam");
// ambil tombol untuk memicu penggabungan menu.

const wadahHasil = document.querySelector("#wadah-hasil");
// ambil elemen tempat menaruh hasil teks gabungan.

// 2. Pasang aksi saat tombol di-klik
tombolPinjam.addEventListener("click", () => {
  // Ambil semua elemen <li> dengan class 'item-menu':
  const kumpulanLi = document.querySelectorAll(".item-menu");
  // CATATAN: kumpulanLi bertipe 'NodeList', BUKAN Array murni!
  // Jadi kumpulanLi.map(...) biasa akan menghasilkan ERROR!

  // ================================================================
  // TEKNIK MEMINJAM: Array.prototype.map.call(kumpulanLi, ...)
  // Kita meminjam fungsi .map milik Array untuk diterapkan ke NodeList:
  // ================================================================
  const daftarTeksMenu = Array.prototype.map.call(kumpulanLi, (elemenLi) => {
    // ambil teks dari setiap tag <li> satu per satu:
    return elemenLi.textContent;
  });

  // Gabungkan array teks hasil pinjaman tadi menjadi satu kalimat:
  const kalimatMenu = daftarTeksMenu.join(" + ");
  // hubungkan setiap makanan dengan tanda plus.

  // Tampilkan ke antarmuka HTML:
  wadahHasil.textContent = `Paket Hemat: ${kalimatMenu}`;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan `Array.from()` di proyek baru**:
   Meskipun meminjam fungsi dengan `Array.prototype.metode.call(...)` sangat ampuh untuk memahami cara kerja mesin JavaScript, cara paling bersih di kode masa kini adalah mengubahnya terlebih dahulu:
   ```javascript
   // Cara Modern:
   const arrayMurni = Array.from(kumpulanLi);
   const teksMenu = arrayMurni.map((li) => li.textContent);
   ```
2. **Kapan teknik meminjam sering terlihat?**:
   Anda akan sering melihat teknik ini ketika membaca kode pustaka besar (_library/framework_) lawas atau kode optimasi tingkat tinggi.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik tombol **"Gabungkan Menu (Pinjam Array.map)"**.
- [ ] Perhatikan teks langsung berubah menjadi: `Paket Hemat: Nasi Goreng + Mie Ayam + Sate Ayam + Es Teh Manis`.
- [ ] Buka konsol browser, ketik `document.querySelectorAll(".item-menu").map` dan amati hasilnya adalah `undefined` (membuktikan bahwa NodeList memang aslinya tidak punya fungsi `.map`).

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti konsep bahwa sebuah objek atau NodeList bisa meminjam fungsi milik objek/Array lain dengan bantuan `.call()`**.

---

## 🎯 Uji Pemahaman Mandiri

1. Mengapa elemen hasil pencarian `document.querySelectorAll()` tidak bisa langsung menggunakan fungsi `.map()` secara bawaan?
2. Bagaimana cara paling modern di JavaScript untuk menyulap kumpulan elemen `NodeList` menjadi Array murni sejati tanpa perlu meminjam fungsi secara manual?
