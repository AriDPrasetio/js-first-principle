---
title: "Panduan Pemula: Memilih Elemen dan Menangani Klik (querySelector & addEventListener) di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/08-dom-events
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
  - https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
---

# Panduan Pemula: Memilih Elemen dan Menangani Klik (querySelector & addEventListener) di JavaScript

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> JavaScript membuat halaman web hidup melalui dua langkah mendasar: **menemukan elemen di layar** (`querySelector`) dan **memasang sensor pendengar interaksi** (`addEventListener`) seperti klik tombol atau ketikan keyboard.

---

## 1. Analogi Logis: Mengaitkan Tali Boneka dan Menekan Tombol Bel

Bayangkan halaman web Anda adalah sebuah panggung pertunjukan boneka:

- **DOM (Pohon Boneka di Layar)**:
  Browser membaca file HTML Anda dan mengubah setiap teks `<p>`, gambar `<img>`, dan tombol `<button>` menjadi boneka-boneka yang berdiri di atas panggung.
- **`querySelector` (Tali Pengait Boneka)**:
  Anda melemparkan kail pancing bertali untuk memegang salah satu boneka: `const tombol = document.querySelector("#tombol-buka");`. Sekarang Anda memegang tali boneka tersebut di tangan Anda.
- **`addEventListener` (Memasang Bel Sensor Gerak)**:
  Anda menempelkan sensor alarm pada boneka tersebut: _"Hei tombol, jika ada penonton yang menyentuh atau mengklik kamu (`"click"`), segera nyalakan lampu panggung!"_.

---

## 2. Mengapa Didesain Seperti Ini? (First Principles)

1. **Menggunakan Selektor CSS yang Sudah Anda Kenal**:
   `querySelector` memakai aturan penulisan yang sama persis dengan CSS:
   - Mengambil berdasarkan ID $\to$ gunakan tanda pagar (`#nama-id`).
   - Mengambil berdasarkan Class $\to$ gunakan tanda titik (`.nama-class`).
   - Mengambil berdasarkan nama tag $\to$ langsung sebutkan tag-nya (`button`, `p`, `h1`).
2. **Aturan Emas Performa: Simpan di Atas (Cache DOM)**:
   Mencari elemen di seluruh halaman web membutuhkan tenaga browser. Maka dari itu, cari elemen satu kali saja di baris paling atas kode dan simpan ke dalam variabel `const`. Jangan mencari elemen berulang kali di dalam fungsi klik!

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kartu penghitung klik dengan tombol reset interaktif:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | querySelector & addEventListener</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 320px;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        text-align: center;
      }
      .angka {
        font-size: 2.5rem;
        font-weight: bold;
        margin: 12px 0;
        color: #2563eb;
      }
      .btn-group {
        display: flex;
        gap: 8px;
      }
      button {
        flex: 1;
        padding: 10px;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #999;
      }
      #btn-tambah {
        background: #2563eb;
        color: #fff;
        border: none;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Penghitung Interaksi</h3>
      <div id="angka-counter" class="angka">0</div>
      <div class="btn-group">
        <button type="button" id="btn-tambah">Tambah (+1)</button>
        <button type="button" id="btn-reset">Reset (0)</button>
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// ================================================================
// 1. CARI DAN SIMPAN ELEMEN KE VARIABEL (CUKUP SEKALI DI AWAL)
// ================================================================
const angkaCounter = document.querySelector("#angka-counter");
// temukan elemen angka di layar berdasarkan ID #angka-counter.

const tombolTambah = document.querySelector("#btn-tambah");
// temukan tombol penambah berdasarkan ID #btn-tambah.

const tombolReset = document.querySelector("#btn-reset");
// temukan tombol reset berdasarkan ID #btn-reset.

// 2. Siapkan data angka di memori
let jumlahKlik = 0;
// buat variabel angka untuk menyimpan status hitungan saat ini.

// ================================================================
// 3. PASANG SENSOR EVENT LISTENER KE MASING-MASING TOMBOL
// ================================================================

// Sensor 1: Saat tombol tambah di-klik oleh pengguna
tombolTambah.addEventListener("click", () => {
  jumlahKlik = jumlahKlik + 1;
  // tambahkan nilai angka di memori sebanyak 1.

  angkaCounter.textContent = jumlahKlik;
  // perbarui teks yang tampak pada layar HTML.
});

// Sensor 2: Saat tombol reset di-klik oleh pengguna
tombolReset.addEventListener("click", () => {
  jumlahKlik = 0;
  // kembalikan angka ke nol di memori.

  angkaCounter.textContent = jumlahKlik;
  // tampilkan angka 0 kembali ke layar HTML.
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan Atribut `defer` pada Script**:
   Selalu pasang `<script src="app.js" defer></script>` di tag `<head>`. Kata `defer` memastikan browser selesai menggambar seluruh elemen HTML sebelum file JavaScript Anda dijalankan, sehingga `querySelector` tidak akan mengembalikan nilai `null`.
2. **Perbedaan `querySelector` vs `querySelectorAll`**:
   - `querySelector` $\to$ hanya mengambil **1 elemen pertama** yang cocok.
   - `querySelectorAll` $\to$ mengambil **seluruh elemen** yang cocok dalam bentuk `NodeList`.
3. **Pilihlah `.textContent` daripada `.innerHTML`**:
   Jika hanya ingin mengganti tulisan teks biasa, gunakan `.textContent`. Menggunakan `.innerHTML` membuka risiko keamanan jika teks tersebut berasal dari input pengguna asing (_XSS attack_).

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik tombol biru **"Tambah (+1)"** beberapa kali $\to$ pastikan angka bertambah dari 0, 1, 2, 3...
- [ ] Klik tombol **"Reset (0)"** $\to$ pastikan angka kembali ke 0 seketika.
- [ ] Buka Developer Tools (F12) di tab Console, ketik `tombolTambah` lalu Enter $\to$ amati bahwa variabel menyimpan referensi elemen tombol HTML asli.

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Tahu bagaimana alur menyambungkan elemen HTML ke file JavaScript: cari dengan `document.querySelector`, lalu pasang pendengar aksi dengan `.addEventListener("click", ...)`**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa yang akan dikembalikan oleh perintah `document.querySelector("#tidak-ada")` jika ID tersebut memang sama sekali tidak ada di file HTML Anda?
2. Mengapa jika kita lupa menyertakan atribut `defer` pada tag `<script src="app.js">` di bagian `<head>`, perintah `querySelector` sering kali menghasilkan nilai `null`?
