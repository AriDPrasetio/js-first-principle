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
> ES Modules adalah standar resmi JavaScript modern untuk memecah program besar menjadi berkas-berkas kecil yang rapi dan terisolasi: Anda mengeluarkan perkakas dengan **`export`** (baik *Named Export* maupun *Default Export*), dan meminjamnya di berkas lain dengan **`import`** menggunakan bantuan tag skrip modern `<script type="module">`.

---

## 1. Analogi Logis: Rak Perkakas Bengkel yang Teratur

Bayangkan Anda bekerja di bengkel perakitan mobil:

- **Cara Kuno & Berantakan (Satu Berkas Raksasa 5.000 Baris)**:
  Semua obeng, kunci pas, baut, kaleng cat, dan dongkrak dilempar bertumpuk ke satu kardus besar di lantai ruang tunggu. Siapa pun bisa menendang atau menimpa barang orang lain (*Global Scope Pollution*).
- **Cara Modern (ES Modules)**:
  Anda memiliki lemari khusus dengan laci-laci berlabel rapi:
  - Laci `kalkulator.js`: Menyediakan perkakas hitung pajak dan pengubah angka ke format rupiah.
  - Meja Kerja Utama `app.js`: Membuka laci tersebut, mengambil obeng yang diperlukan saja dengan kata kunci `import`, lalu merakit antarmuka pengguna tanpa mengotori ruangan lain.

---

## 2. Mengapa JavaScript Menggunakan ES Modules? (First Principles)

### A. Dua Cara Mengekspor: Named Export vs Default Export

| Fitur | Named Export (Ekspor Bernama) | Default Export (Ekspor Utama) |
| :--- | :--- | :--- |
| **Banyaknya per Berkas** | Boleh banyak dalam 1 berkas. | **Hanya boleh ada 1** per berkas. |
| **Cara Menulis Ekspor** | `export function hitungPPN() {}`<br>atau `export const KURS = 15000;` | `export default function kalkulatorUtama() {}` |
| **Cara Mengimpor** | **Wajib memakai `{ kurung kurawal }`** dan nama harus cocok persis: `import { hitungPPN } from "./file.js"` | **Tanpa kurung kurawal** dan nama pengimpor bebas ditentukan: `import Kalkulator from "./file.js"` |

### B. Dua Kekuatan Otomatis Tag `<script type="module">`
Saat Anda menyertakan atribut `type="module"` pada HTML:
1. **Otomatis Bersifat `defer`**: Browser secara cerdas mengunduh berkas modul di latar belakang dan menunda eksekusinya sampai seluruh HTML selesai digambar. Anda tidak perlu lagi menambahkan atribut `defer` manual!
2. **Otomatis Berada dalam "Strict Mode"**: Seluruh kode modul berjalan dalam mode aman (*strict mode*), sehingga Anda tidak bisa membuat variabel liar tanpa deklarasi (`let`/`const`).

### C. Mengapa Protokol `file:///` Diblokir Browser?
Jika Anda membuka file HTML modul dengan cara klik ganda biasa di File Explorer, URL browser Anda akan diawali dengan `file:///C:/...` dan memunculkan pesan error warna merah:
*Access to script at '...' from origin 'null' has been blocked by CORS policy.*

**Alasan Keamanan (First Principles)**:
Browser menerapkan kebijakan keamanan ketat (*Same-Origin Policy*). Jika file HTML diizinkan membaca file JavaScript lain secara bebas lewat protokol `file:///`, situs web jahat yang Anda simpan di laptop bisa mencuri file pribadi Anda di harddisk.
Oleh karena itu, modul ES Modules **wajib dijalankan melalui server web lokal** (misalnya ekstensi *Live Server* di VS Code atau perintah `npx serve` / `python -m http.server`).

---

## 3. Contoh Praktik Interaktif (HTML + 2 Berkas JavaScript)

Mari kita buat kalkulator belanja modular yang menggabungkan **Default Export** untuk logika utama dan **Named Export** untuk fungsi pembantu:

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
        max-width: 340px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        margin-bottom: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      button {
        padding: 10px;
        cursor: pointer;
        width: 100%;
        margin-bottom: 12px;
        background: #0284c7;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: bold;
      }
      .hasil {
        padding: 10px;
        background-color: #f0fdf4;
        border: 1px solid #bbf7d0;
        border-radius: 4px;
        font-size: 0.9rem;
      }
    </style>

    <!-- PENTING: Wajib tambahkan type="module" (otomatis defer dan strict mode) -->
    <script type="module" src="app.js"></script>
  </head>
  <body>
    <div class="card">
      <h3>Kalkulator Belanja Modular</h3>
      <input
        type="number"
        id="input-harga"
        placeholder="Harga Barang (contoh: 100000)"
      />
      <button type="button" id="btn-hitung">Hitung Total (+PPN 11%)</button>
      <div id="kotak-hasil" class="hasil">Masukkan harga barang lalu klik hitung.</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `kalkulator.js` (Modul Utilitas)

```javascript
// ================================================================
// BERKAS MODUL: kalkulator.js
// Memperlihatkan Named Export dan Default Export dalam satu berkas
// ================================================================

// 1. NAMED EXPORT: Fungsi pembantu format teks rupiah
export function formatRupiah(angka) {
  return `Rp ${angka.toLocaleString("id-ID")}`;
}

// 2. NAMED EXPORT: Konstanta tarif pajak
export const TARIF_PPN = 0.11; // 11%

// 3. DEFAULT EXPORT: Fungsi utama kalkulator harga
export default function hitungTotalBelanja(hargaBarang) {
  const nilaiPajak = hargaBarang * TARIF_PPN;
  const total = hargaBarang + nilaiPajak;

  return {
    hargaAsli: hargaBarang,
    nilaiPajak: nilaiPajak,
    totalAkhir: total,
  };
}
```

---

### Berkas 3: `app.js` (Modul Utama)

```javascript
// ================================================================
// BERKAS UTAMA: app.js
// Mengimpor Default Export (tanpa kurawal) dan Named Export (dengan kurawal)
// ================================================================
import hitungTotalBelanja, { formatRupiah, TARIF_PPN } from "./kalkulator.js";

// Ambil elemen HTML
const inputHarga = document.querySelector("#input-harga");
const tombolHitung = document.querySelector("#btn-hitung");
const kotakHasil = document.querySelector("#kotak-hasil");

tombolHitung.addEventListener("click", () => {
  const harga = Number(inputHarga.value);
  if (harga <= 0) return;

  // Jalankan fungsi default export:
  const hasil = hitungTotalBelanja(harga);

  // Tampilkan ke layar menggunakan bantuan named export:
  kotakHasil.innerHTML = `
    <strong>Harga Barang:</strong> ${formatRupiah(hasil.hargaAsli)}<br>
    <strong>PPN (${TARIF_PPN * 100}%):</strong> ${formatRupiah(hasil.nilaiPajak)}<br>
    <hr style="margin: 8px 0; border: none; border-top: 1px dashed #ccc;">
    <strong style="color: #166534; font-size: 1.05rem;">
      Total Bayar: ${formatRupiah(hasil.totalAkhir)}
    </strong>
  `;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Wajib Menyertakan Ekstensi `.js` pada Browser Murni**:
   Di lingkungan JavaScript tanpa bundler (seperti Webpack/Vite), penulisan `import ... from "./kalkulator"` akan gagal. Anda harus menulis path lengkap: `./kalkulator.js`.
2. **Kapan Memilih Named vs Default?**:
   - Jika modul Anda berupa kumpulan fungsi bantuan serbaguna (seperti modul matematika, tanggal, atau string format), gunakan **Named Export** (`export const / function`).
   - Jika berkas Anda hanya mewakili satu komponen tunggal atau satu kelas utama, gunakan **Default Export** (`export default`).
3. **Mengganti Nama Impor dengan `as`**:
   Jika nama fungsi dari modul luar bertabrakan dengan variabel di file Anda, gunakan alias:
   ```javascript
   import { formatRupiah as rupiahID } from "./kalkulator.js";
   ```

---

## 5. Checklist Praktik Mandiri

- [ ] Jalankan folder proyek menggunakan ekstensi **Live Server** di VS Code atau ketik `npx serve` di terminal (jangan klik file ganda via file explorer).
- [ ] Buka halaman di browser, ketik `250000`, lalu klik tombol hitung.
- [ ] Pastikan pajak 11% (Rp 27.500) dan total bayar (Rp 277.500) muncul dengan benar.
- [ ] Buka DevTools Console (F12), ketik `hitungTotalBelanja` lalu tekan Enter $\to$ perhatikan muncul error `ReferenceError` yang menandakan fungsi modul aman terisolasi di lingkup lokal berkasnya sendiri.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti perbedaan cara impor Named `{ ... }` vs Default Export, memahami mengapa tag `<script type="module">` otomatis menunda eksekusi (defer), dan mengapa modul butuh server lokal (bukan `file:///`)**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa perbedaan sintaks saat mengimpor modul yang diekspor menggunakan `Named Export` dibandingkan dengan yang diekspor menggunakan `Default Export`?
2. Mengapa tag skrip `<script type="module" src="app.js"></script>` tidak memerlukan atribut `defer` secara eksplisit lagi?
3. Mengapa membuka file HTML yang berisi modul secara langsung via protokol `file:///` di File Explorer diblokir oleh kebijakan keamanan browser?
