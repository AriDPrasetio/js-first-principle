---
title: "Panduan Pemula: Cara Kerja Event Loop dan Timer (setTimeout) di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/09-async-javascript
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop
  - https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
---

# Panduan Pemula: Cara Kerja Event Loop dan Timer (setTimeout) di JavaScript

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> JavaScript hanya punya satu tangan untuk bekerja (_Single-Threaded_). Agar halaman web tidak membeku saat menunggu proses yang lama, JavaScript menitipkan proses tunggu tersebut ke browser di latar belakang (_Asynchronous_), lalu mengambil hasilnya kembali saat tugas utamanya sudah selesai (_Event Loop_).

---

## 1. Analogi Logis: Kasir Kafe dan Alarm Pemanggang Roti

Bayangkan sebuah kedai kopi yang hanya memiliki **satu kasir** yang gesit:

- Anda datang dan memesan **Roti Bakar Panas** (butuh waktu matang 3 detik).
- **Jika sistem macet (Sinkronus/Blocking)**:
  Kasir berdiri diam mematung menatap pemanggang roti selama 3 detik. Semua orang di belakang Anda teriak marah karena antrean berhenti total!
- **Jika sistem cerdas (Asinkronus / Event Loop)**:
  Kasir langsung memasukkan roti ke oven, memasang alarm timer, lalu berkata: _"Silakan tunggu, saya layani antrean berikutnya dulu!"_.
  Kasir terus melayani orang lain. Begitu alarm timer oven berbunyi _Ting!_ dan kasir sedang ada waktu jeda senggang, kasir menengok ke meja pengambilan (_Event Loop_), lalu menyerahkan roti hangat Anda.

---

## 2. Mengapa JavaScript Didesain Seperti Ini? (First Principles)

1. **Mencegah Halaman Web Membeku (_Not Responding_)**:
   Jika JavaScript menunggu timer secara kaku di jalur utama, tombol di web tidak akan bisa diklik dan animasi akan macet total.
2. **Arti dari `setTimeout(aksi, 1000)`**:
   Angka `1000` (1 detik) bukan jaminan pasti akan dijalankan tepat di milidetik ke-1000, melainkan **waktu tunggu minimal**. Browser baru memasukkan fungsi Anda ke daftar tunggu setelah 1 detik berlalu.
3. **Membatalkan Timer dengan `clearTimeout`**:
   Jika pengguna berpindah halaman sebelum timer selesai berbunyi, Anda bisa membatalkannya agar fungsi tidak dieksekusi secara sia-sia.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat simulator oven roti yang bisa dipanggang dengan jeda waktu dan bisa dibatalkan secara mendadak:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Event Loop & setTimeout</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 350px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .btn-group {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      button {
        flex: 1;
        padding: 10px 8px;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #aaa;
      }
      #btn-panggang {
        background: #ea580c;
        color: white;
        border: none;
      }
      #btn-batal {
        background: #f1f5f9;
      }
      .status {
        padding: 12px;
        border-radius: 6px;
        font-weight: bold;
        background: #fff7ed;
        border: 1px dashed #fdba74;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Simulator Oven Kafe</h3>
      <div class="btn-group">
        <button type="button" id="btn-panggang">Panggang Roti (3 Detik)</button>
        <button type="button" id="btn-batal">Batal Panggang</button>
      </div>
      <div id="kotak-status" class="status">Oven dalam keadaan mati.</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen HTML
const tombolPanggang = document.querySelector("#btn-panggang");
// ambil tombol untuk memulai memanggang.

const tombolBatal = document.querySelector("#btn-batal");
// ambil tombol untuk membatalkan timer.

const kotakStatus = document.querySelector("#kotak-status");
// ambil wadah status tampilan oven.

// Wadah untuk menyimpan nomor identitas timer:
let idTimerOven = null;

// ================================================================
// 2. MEMULAI PROSES ASINKRON DENGAN setTimeout
// ================================================================
tombolPanggang.addEventListener("click", () => {
  // Langsung ubah status seketika (Kode Sinkron):
  kotakStatus.textContent = "⏳ Sedang memanggang roti... Tunggu 3 detik!";

  // Titipkan timer ke browser untuk ditunggu selama 3.000 milidetik (Kode Asinkron):
  idTimerOven = setTimeout(() => {
    // FUNGSI INI BARU DIJALANKAN SETELAH 3 DETIK BERLALU:
    kotakStatus.textContent = "🍞 Ting! Roti bakar matang dan siap disantap!";
  }, 3000);
});

// ================================================================
// 3. MEMBATALKAN TIMER DENGAN clearTimeout
// ================================================================
tombolBatal.addEventListener("click", () => {
  if (idTimerOven !== null) {
    // Hentikan alarm timer sebelum sempat berbunyi:
    clearTimeout(idTimerOven);
    // batalkan timer yang sedang berjalan di latar belakang.

    kotakStatus.textContent = "❌ Pemanggangan dibatalkan. Oven dimatikan.";
    idTimerOven = null;
  }
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu bersihkan timer**:
   Jika Anda membuat animasi pengulangan dengan `setInterval()`, jangan lupa menyimpan ID-nya dan memanggil `clearInterval(id)` saat animasi selesai agar browser pengguna tidak boros baterai dan memori.
2. **Mengapa `setTimeout(fn, 0)` berguna?**:
   Perintah `setTimeout(fn, 0)` sering dipakai programmer untuk menunda suatu baris kode agar dijalankan belakangan tepat setelah browser selesai menggambar elemen HTML di layar.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik **"Panggang Roti (3 Detik)"** $\to$ amati teks berubah menjadi "⏳ Sedang memanggang..." dan setelah 3 detik teks otomatis berubah menjadi "🍞 Ting! Roti bakar matang...".
- [ ] Klik **"Panggang Roti"** lagi, lalu sebelum 3 detik habis segera klik **"Batal Panggang"** $\to$ amati bahwa timer berhasil digagalkan tepat waktu berkat `clearTimeout`.

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Tahu bahwa JavaScript mengeksekusi kode biasa terlebih dahulu, sementara `setTimeout` dititipkan ke browser untuk dijalankan belakangan**.

---

## 🎯 Uji Pemahaman Mandiri

1. Jika Anda menulis `console.log("A"); setTimeout(() => console.log("B"), 0); console.log("C");`, apakah urutan huruf yang muncul di konsol adalah `A -> B -> C` ataukah `A -> C -> B`? Mengapa?
2. Apa fungsi dari perintah `clearTimeout(idTimer)`?
