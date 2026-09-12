---
title: "Panduan Pemula: Membagi Berkas Kode dengan ES Modules (import dan export)"
tags: "javascript, first-principles, roadmap-js/11-es-modules"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules"
---

# Panduan Pemula: Membagi Berkas Kode dengan ES Modules (import dan export)

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> ES Modules adalah cara resmi JavaScript memecah program besar menjadi berkas-berkas kecil yang rapi dan terisolasi: Anda mengeluarkan alat dengan **`export`**, dan meminjamnya di berkas lain dengan **`import`**.

---

## 1. Analogi Logis: Rak Perkakas Bengkel yang Teratur

Bayangkan Anda bekerja di bengkel perakitan:

- **Cara Berantakan (Satu Berkas Raksasa 5.000 Baris)**:
  Semua obeng, palu, kunci pas, mur, dan cat dilempar bertumpuk ke satu kardus besar di tengah lantai. Anda pusing mencari barang dan sering salah ambil!
- **Cara Modern (ES Modules)**:
  Anda membagi ruangan menjadi laci-laci khusus:
  - Laci `matematika.js`: Hanya berisi perkakas hitung diskon dan pajak.
  - Laci `formatRupiah.js`: Hanya berisi perkakas pembuat tulisan rupiah.
  - Meja Kerja Utama `app.js`: Mengambil obeng dari laci matematika (`import`) dan mulai merakit tampilan.

---

## 2. Mengapa JavaScript Menggunakan ES Modules? (First Principles)

1. **Variabel Aman Terlindungi (Module Scope)**:
   Variabel yang Anda buat di dalam berkas modul **tidak akan bocor** ke berkas lain atau ke objek global `window`. Anda tidak perlu takut nama variabel bertabrakan!
2. **Hanya Meminjam yang Dibutuhkan**:
   Dengan `import { hitungPajak } from "./pajak.js"`, Anda hanya mengambil fungsi yang benar-benar Anda pakai.
3. **Syarat Penting: Tag `<script type="module">`**:
   Browser baru mengizinkan perintah `import` dan `export` jika Anda menyertakan atribut `type="module"` pada tag skrip HTML.

---

## 3. Contoh Praktik Interaktif (HTML + 2 Berkas JavaScript)

Mari kita buat kalkulator harga belanja dengan memisahkan logika hitung ke modul bantuan terpisah:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | ES Modules</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 320px;
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
      button {
        padding: 8px 12px;
        cursor: pointer;
        width: 100%;
        margin-bottom: 12px;
      }
      .hasil {
        padding: 10px;
        background-color: #f0fdf4;
        border-radius: 4px;
        font-weight: bold;
      }
    </style>

    <!-- PENTING: Wajib tambahkan type="module" agar browser mengaktifkan fitur import/export -->
    <script type="module" src="app.js"></script>
  </head>
  <body>
    <div class="card">
      <h3>Kalkulator Belanja Modular</h3>
      <input
        type="number"
        id="input-harga"
        placeholder="Harga Barang (contoh: 50000)"
      />
      <button type="button" id="btn-hitung">Hitung Total (+PPN 11%)</button>
      <div id="kotak-hasil" class="hasil">Masukkan harga lalu klik hitung.</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `kalkulator.js` (Modul Pembantu)

```javascript
// ================================================================
// BERKAS MODUL: kalkulator.js
// Berisi fungsi-fungsi utilitas yang diekspor agar bisa dipakai file lain
// ================================================================

// 1. Ekspor fungsi hitung pajak:
export function hitungPPN(harga) {
  // rumus PPN 11 persen:
  return harga * 0.11;
}

// 2. Ekspor fungsi perapih teks rupiah:
export function formatRupiah(angka) {
  // ubah angka biasa menjadi teks berformat mata uang Indonesia:
  return `Rp ${angka.toLocaleString("id-ID")}`;
}
```

---

### Berkas 3: `app.js` (Modul Utama)

```javascript
// ================================================================
// BERKAS UTAMA: app.js
// Mengimpor fungsi dari berkas kalkulator.js menggunakan tanda kurung kurawal
// ================================================================
import { hitungPPN, formatRupiah } from "./kalkulator.js";
// pinjam kedua fungsi dari berkas tetangga kalkulator.js.

const inputHarga = document.querySelector("#input-harga");
// ambil kolom input harga barang dari HTML.

const tombolHitung = document.querySelector("#btn-hitung");
// ambil tombol hitung.

const kotakHasil = document.querySelector("#kotak-hasil");
// ambil wadah penampil teks hasil akhir.

tombolHitung.addEventListener("click", () => {
  const hargaAsli = Number(inputHarga.value);
  if (hargaAsli <= 0) return;

  // Gunakan fungsi pinjaman dari kalkulator.js:
  const nilaiPajak = hitungPPN(hargaAsli);
  const totalBayar = hargaAsli + nilaiPajak;

  // Tampilkan ke layar dengan format rupiah yang rapi:
  kotakHasil.innerHTML = `
    Harga Barang: ${formatRupiah(hargaAsli)}<br>
    Pajak PPN (11%): ${formatRupiah(nilaiPajak)}<br>
    <strong>Total Bayar: ${formatRupiah(totalBayar)}</strong>
  `;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan Ekstensi Berkas Lengkap (`./file.js`)**:
   Di browser murni (tanpa alat perakit seperti Vite/Webpack), Anda **wajib** menyertakan ekstensi `.js` saat mengimpor: `from "./kalkulator.js"`. Jangan menulis `from "./kalkulator"` karena browser tidak akan bisa menemukan berkasnya.
2. **Harus Dijalankan Lewat Server Web Lokal**:
   Karena aturan keamanan browser (_CORS_), file HTML dengan modul tidak bisa dibuka hanya dengan klik dua kali (`file:///C:/...`). Gunakan ekstensi _Live Server_ di VS Code atau terminal `npx serve`.
3. **Pilihlah Named Export (`export function ...`)**:
   Sangat direkomendasikan untuk pemula karena nama fungsinya terkunci pasti, sehingga saat diimpor di file lain nama fungsinya tidak akan salah.

---

## 5. Checklist Praktik Mandiri

- [ ] Jalankan folder proyek menggunakan _Live Server_ di editor kode Anda.
- [ ] Buka halaman web di browser, ketik harga `100000`, lalu klik tombol hitung.
- [ ] Perhatikan bahwa pajak Rp 11.000 dan total Rp 111.000 berhasil dihitung menggunakan fungsi yang diimpor dari file `kalkulator.js`.
- [ ] Buka Console browser (F12), ketik `hitungPPN` lalu tekan Enter $\to$ perhatikan hasilnya `ReferenceError` yang membuktikan bahwa fungsi di dalam modul tidak mencemari ruang global `window`.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu fungsi `export` untuk membagikan alat keluar berkas, dan `import { ... }` untuk meminjamnya di berkas lain dengan bantuan tag `<script type="module">`**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa yang akan terjadi jika Anda lupa menambahkan atribut `type="module"` pada tag `<script src="app.js">` saat file tersebut menggunakan perintah `import`?
2. Mengapa membuka file HTML yang menggunakan ES Modules secara langsung dengan klik ganda di file explorer (`file:///...`) akan menghasilkan error di konsol browser?
