---
title: "Panduan Pemula: Apa itu JavaScript dan Cara Menjalankannya"
tags:
  - javascript
  - first-principles
  - roadmap-js/01-introduction
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript
  - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
---

# Panduan Pemula: Apa itu JavaScript dan Cara Menjalankannya

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> HTML adalah kerangka bangunan, CSS adalah cat dan dekorasinya, sedangkan JavaScript adalah aliran listrik dan saklar yang membuat pintu bisa terbuka otomatis saat tombol ditekan. JavaScript adalah bahasa yang memberi "nyawa" interaktivitas pada halaman web.

---

## 1. Analogi Logis: Robot Mainan Statis vs Robot Berdaya Baterai

### A. Tanpa JavaScript (HTML & CSS Saja)

Bayangkan Anda merakit sebuah robot mainan dari plastik (HTML) lalu mewarnainya dengan cat yang indah (CSS).

- Robotnya berdiri gagah di atas meja.
- Tetapi saat Anda menekan tombol di dadanya, **robot itu diam saja**.
- Mengapa? Karena tidak ada mesin logika atau baterai yang menghubungkan tombol tersebut ke motor penggerak.

Halaman web tanpa JavaScript persis seperti robot mainan ini: teks dan gambarnya indah, tetapi tombolnya tidak bisa melakukan aksi apa pun.

---

### B. Dengan JavaScript (Menghidupkan Robot)

JavaScript adalah kabel, baterai, dan chip komputer di dalam robot:

- Ia mendengarkan kapan tombol ditekan oleh pengguna (_Event_).
- Ia menghitung angka di dalam kepalanya (_Logika/Komputasi_).
- Ia menggerakkan tangan robot atau menyalakan lampu matanya (_Manipulasi Tampilan HTML_).

---

## 2. Mengapa Browser Membutuhkan Cara Pemuatan Script? (First Principles)

Browser membaca dokumen HTML **dari atas ke bawah, baris demi baris**:

1. **Masalah Pemuatan Biasa (`<script src="...">`)**:
   Jika Anda menaruh script di bagian atas (`<head>`) tanpa atribut tambahan, browser akan **berhenti membaca HTML seketika** (_parser-blocking_) untuk mengunduh dan menjalankan script tersebut. Akibatnya, jika script mencoba mencari elemen tombol di HTML yang posisinya ada di bawah, script akan gagal dan menghasilkan error: `Cannot read properties of null` (karena tombolnya belum sempat dibaca oleh browser!).

2. **Solusi Elegan: Atribut `defer`**:
   Dengan menambahkan kata `defer` (`<script src="app.js" defer></script>`), Anda memberi tahu browser:
   _"Browser, tolong unduh file JavaScript ini di latar belakang tanpa menghentikan pembacaan HTML. Tunggu sampai seluruh struktur HTML selesai dibaca, barulah jalankan JavaScript-nya."_

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat halaman interaktif pertama Anda. Buat dua berkas dalam satu folder:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Menjalankan JavaScript</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 320px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        text-align: center;
      }
      .status-lampu {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-color: #ccc;
        border-radius: 50%;
        margin-bottom: 8px;
      }
      button {
        padding: 8px 16px;
        cursor: pointer;
        font-weight: bold;
      }
    </style>
    <!-- Atribut defer: menjamin HTML selesai dibaca sebelum script berjalan -->
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <div id="lampu" class="status-lampu"></div>
      <p id="teks-status">Lampu Sedang Mati</p>
      <button type="button" id="btn-saklar">Nyalakan Lampu</button>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen HTML yang dibutuhkan dari halaman
const lampuEl = document.querySelector("#lampu");
// ambil elemen dengan ID 'lampu' (lingkaran lampu), simpan ke wadah lampuEl.

const teksStatusEl = document.querySelector("#teks-status");
// ambil elemen teks status dengan ID 'teks-status', simpan ke wadah teksStatusEl.

const saklarBtn = document.querySelector("#btn-saklar");
// ambil tombol saklar dengan ID 'btn-saklar', simpan ke wadah saklarBtn.

// 2. Simpan status lampu di memori JavaScript
let isLampuMenyala = false;
// buat variabel penanda status bernilai false (artinya mula-mula lampu mati).

// 3. Pasang aksi ketika tombol saklar diklik
saklarBtn.addEventListener("click", () => {
  // saat tombol saklarBtn diklik oleh pengguna, jalankan perintah di dalam blok ini:

  isLampuMenyala = !isLampuMenyala;
  // balikkan status: jika sebelumnya mati (false) jadikan menyala (true), dan sebaliknya.

  if (isLampuMenyala) {
    // jika status lampu menyala:
    lampuEl.style.backgroundColor = "#ffcc00";
    // ubah warna latar lingkaran lampu menjadi kuning terang.

    teksStatusEl.textContent = "Lampu Menyala!";
    // perbarui teks status di layar menjadi 'Lampu Menyala!'.

    saklarBtn.textContent = "Matikan Lampu";
    // ubah label tombol menjadi 'Matikan Lampu'.
  } else {
    // jika status lampu mati:
    lampuEl.style.backgroundColor = "#ccc";
    // kembalikan warna lingkaran lampu menjadi abu-abu.

    teksStatusEl.textContent = "Lampu Sedang Mati";
    // kembalikan teks status menjadi 'Lampu Sedang Mati'.

    saklarBtn.textContent = "Nyalakan Lampu";
    // kembalikan label tombol menjadi 'Nyalakan Lampu'.
  }
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu gunakan `<script src="app.js" defer>` di dalam tag `<head>`**: Ini memastikan browser tidak terblokir saat membaca dokumen dan kode JavaScript Anda dijamin bisa menemukan seluruh elemen HTML.
2. **Hindari menulis JavaScript langsung di dalam atribut HTML (seperti `onclick="..."`)**: Pisahkan struktur (HTML) dan logika program (JS) di berkas terpisah agar rapi dan mudah dirawat.

---

## 5. Checklist Praktik Mandiri

- [ ] Buat file `index.html` dan `app.js` di satu folder.
- [ ] Buka `index.html` di browser dengan klik dua kali.
- [ ] Klik tombol saklar dan amati lampu berubah warna serta teks berganti secara interaktif.
- [ ] Buka Console browser (`F12`), ketik `console.log("Halo dari konsol!")` dan tekan Enter.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah menguasai materi ini jika: **Memahami mengapa atribut `defer` penting agar JavaScript tidak error mencari elemen HTML yang belum selesai dibaca browser**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode pemanggilan script berikut:

```html
<head>
  <script src="app.js"></script>
</head>
<body>
  <button id="tombol">Klik Saya</button>
</body>
```

Jika di dalam `app.js` ada baris `document.querySelector('#tombol')`:

- **Apakah script tersebut akan berhasil menemukan tombol, atau justru menghasilkan error?**
- **Atribut apa yang harus ditambahkan pada tag `<script>` agar tidak error?**
