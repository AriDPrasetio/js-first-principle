---
title: "Panduan Pemula: Melacak Bug dengan Console dan Breakpoint di Browser"
tags:
  - javascript
  - first-principles
  - roadmap-js/12-browser-devtools
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Debugging_JavaScript
  - https://developer.chrome.com/docs/devtools/javascript/
---

# Panduan Pemula: Melacak Bug dengan Console dan Breakpoint di Browser

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> Menemukan kesalahan kode (_Debugging_) tidak harus menebak-nebak: Anda bisa menggunakan **`console.table`** untuk melihat data dalam bentuk tabel rapi, atau menggunakan kata kunci **`debugger;`** untuk membekukan waktu di browser dan memeriksa isi variabel secara langsung!

---

## 1. Analogi Logis: Kamera Foto vs Remote Pembeku Waktu

Bayangkan Anda seorang detektif yang menyelidiki peristiwa misterius:

- **`console.log()` (Memotret dari Kejauhan)**:
  Anda menjepret foto untuk melihat isi variabel di satu momen. Hasilnya hanya selembar foto statis di jendela Console.
- **Breakpoint / `debugger;` (Remote Pembeku Waktu Ajaib)**:
  Anda menekan tombol remote penahan waktu: **seluruh browser berhenti membeku seketika tepat di baris itu!**
  Anda bisa mengarahkan kursor mouse ke variabel mana pun untuk mengintip isinya, memeriksa riwayat panggilan fungsi (_Call Stack_), lalu melangkah perlahan satu baris demi satu baris (_Step Over_).

---

## 2. Fitur Console Sakti yang Jarang Diketahui Pemula (First Principles)

1. **`console.table(data)`**:
   Daripada melihat tumpukan teks kurung kurawal `{}` yang berantakan, `console.table` otomatis mengubah daftar array atau objek Anda menjadi tabel Excel yang cantik di tab Console!
2. **Kata Kunci `debugger;`**:
   Jika Anda menulis `debugger;` di dalam kode JavaScript dan membuka jendela Developer Tools (F12), browser akan otomatis berhenti tepat di baris tersebut saat tombol diklik.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kasir toko yang mendemonstrasikan `console.table` dan remote pembeku waktu `debugger;`:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Console & Breakpoints</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .btn-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }
      button {
        padding: 10px;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #999;
      }
      #btn-tabel {
        background: #e0e7ff;
      }
      #btn-debug {
        background: #fee2e2;
        border-color: #ef4444;
        font-weight: bold;
      }
      .instruksi {
        font-size: 0.85rem;
        color: #555;
        line-height: 1.4;
        padding: 8px;
        background: #f8fafc;
        border-radius: 4px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Uji Debugging di Browser</h3>
      <div class="instruksi">
        <strong>Petunjuk:</strong> Buka DevTools peramban terlebih dahulu (tekan
        tombol <code>F12</code> di keyboard), lalu klik tombol merah di bawah!
      </div>
      <div class="btn-group" style="margin-top: 10px;">
        <button type="button" id="btn-tabel">
          1. Cetak Tabel Data (console.table)
        </button>
        <button type="button" id="btn-debug">
          2. Bekukan Waktu (debugger;)
        </button>
      </div>
      <div id="kotak-status">Buka Console (F12) untuk melihat hasilnya.</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Data daftar produk belanjaan
const daftarPesanan = [
  { id: 1, produk: "Kopi Hitam", harga: 15000, jumlah: 2 },
  { id: 2, produk: "Roti Cokelat", harga: 12000, jumlah: 3 },
  { id: 3, produk: "Air Mineral", harga: 5000, jumlah: 1 },
];

const tombolTabel = document.querySelector("#btn-tabel");
// ambil tombol untuk memicu console.table.

const tombolDebug = document.querySelector("#btn-debug");
// ambil tombol untuk memicu remote debugger.

const kotakStatus = document.querySelector("#kotak-status");
// ambil elemen penampil status interaksi.

// ================================================================
// FITUR 1: console.table() UNTUK MENAMPILKAN TABEL RAPI DI KONSOL
// ================================================================
tombolTabel.addEventListener("click", () => {
  // Cetak array of objects ke dalam tabel cantik di DevTools:
  console.log("Menampilkan pesanan dengan console.table:");
  console.table(daftarPesanan);
  // otomatis membentuk kolom ID, produk, harga, dan jumlah di tab Console!

  kotakStatus.textContent = "✅ Tabel berhasil dicetak di tab Console (F12)!";
});

// ================================================================
// FITUR 2: KATA KUNCI debugger; UNTUK MEMBEKUKAN WAKTU BROWSER
// ================================================================
tombolDebug.addEventListener("click", () => {
  kotakStatus.textContent = "⏳ Memproses kalkulasi...";

  let totalTagihan = 0;

  for (const item of daftarPesanan) {
    const subtotal = item.harga * item.jumlah;

    // ============================================================
    // PERIKSA: Jika jendela F12 sedang terbuka, browser akan BERHENTI
    // persis di baris ini! Anda bisa mengintip isi variabel subtotal:
    // ============================================================
    debugger;
    // browser membekukan eksekusi di sini!

    totalTagihan += subtotal;
  }

  kotakStatus.textContent = `Total Biaya: Rp ${totalTagihan.toLocaleString("id-ID")}`;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan `console.table` saat mengolah data Array of Objects**:
   Jauh lebih mudah dibaca dibandingkan `console.log` biasa yang mengharuskan Anda mengklik panah segitiga satu per satu.
2. **Hapus kata kunci `debugger;` sebelum mengunggah kode**:
   Kata kunci `debugger;` hanya boleh dipakai saat Anda sedang mengembangkan kode di komputer sendiri. Jangan sampai tertinggal di situs web asli yang sudah dipakai orang umum.
3. **Gunakan Tombol Lanjut (_Resume / F8_)**:
   Saat browser membeku di breakpoint, klik ikon tombol "Play" warna biru di pojok kanan atas DevTools untuk melanjutkan program.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser Google Chrome atau Firefox.
- [ ] Tekan tombol **`F12`** pada keyboard untuk membuka jendela Developer Tools, lalu pilih tab **Console**.
- [ ] Klik tombol **"1. Cetak Tabel Data (console.table)"** $\to$ amati tabel rapi dengan kolom dan baris yang muncul di tab Console.
- [ ] Beralih ke tab **Sources**, lalu klik tombol **"2. Bekukan Waktu (debugger;)"** $\to$ amati layar browser Anda meredup dan eksekusi berhenti tepat di baris `debugger;`.
- [ ] Arahkan kursor mouse ke variabel `subtotal` untuk melihat nilainya secara langsung!

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Tahu cara membuka DevTools (F12) untuk melihat `console.table()` dan bisa menggunakan `debugger;` untuk mengintip variabel saat browser membeku**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa keunggulan menggunakan `console.table()` dibandingkan `console.log()` biasa saat Anda ingin memeriksa data berbentuk daftar array of objects?
2. Apa yang akan terjadi pada browser pengguna jika Anda menulis kata kunci `debugger;` di dalam kode JavaScript tetapi pengguna tersebut **tidak** membuka DevTools (F12)?
