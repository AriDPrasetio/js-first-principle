---
title: "Panduan Pemula: Apa itu JavaScript dan Cara Menjalankannya"
tags: "javascript, first-principles, roadmap-js/01-introduction"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript"
---

# Panduan Pemula: Apa itu JavaScript dan Cara Menjalankannya

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> HTML adalah kerangka bangunan, CSS adalah dekorasinya, dan JavaScript adalah aliran listrik serta saklarnya. Namun ingat: JavaScript tidak bisa hidup sendirian di ruang hampa—ia selalu membutuhkan "wadah lingkungan" (_runtime_) untuk berjalan, baik itu di dalam **Browser** (Client-side) maupun di dalam **Komputer/Server** (Server-side).

---

## 1. Analogi Logis: Robot Mainan Statis vs Robot Berdaya Baterai

### A. Tanpa JavaScript (HTML & CSS Saja)

Bayangkan Anda merakit sebuah robot mainan dari plastik (HTML) lalu mewarnainya dengan cat yang indah (CSS).

- Robotnya berdiri gagah di atas meja.
- Tetapi saat Anda menekan tombol di dadanya, **robot itu diam saja**.
- Mengapa? Karena tidak ada mesin logika atau sirkuit listrik yang menghubungkan tombol tersebut ke motor penggerak.

Halaman web tanpa JavaScript persis seperti robot mainan ini: teks dan tampilannya rapi, tetapi tombolnya tidak bisa memproses aksi interaktif apa pun.

---

### B. Dengan JavaScript (Menghidupkan Robot)

JavaScript adalah kabel, baterai, dan chip logika komputer di dalam robot:

- Ia mendengarkan kapan tombol ditekan oleh pengguna (_Event_).
- Ia menghitung angka di dalam memori (_Logika/Komputasi_).
- Ia menggerakkan tangan robot atau menyalakan lampu matanya (_Manipulasi Tampilan_).

---

## 2. Di Mana JavaScript Berjalan? (Dua Dunia Runtime)

Sebelum mempelajari cara menulis kodenya, Anda harus tahu **di mana** kode JavaScript Anda sebenarnya dieksekusi. Tempat JavaScript dijalankan disebut **Host Environment (Runtime)**.

Secara umum, ada dua tempat utama di mana JavaScript hidup:

| Pembeda              | 🌐 Client-Side (Browser)                                                                              | 🖥️ Server-Side (Node.js / Bun)                                                    |
| :------------------- | :---------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **Tempat Berjalan**  | Di browser laptop/HP pengunjung (Chrome, Firefox, Safari).                                            | Di terminal komputer developer atau komputer server cloud.                        |
| **Tugas Utama**      | Menangani interaksi pengguna, animasi, klik tombol, dan visual halaman.                               | Membaca file di harddisk, mengelola database, dan membuat API server.             |
| **Fitur Khusus**     | Punya akses ke halaman web: `document` (DOM) dan `window`.                                            | Punya akses ke sistem operasi: membaca file (`fs`) dan proses server (`process`). |
| **Batasan Keamanan** | _Di-sandbox_: JavaScript browser dilarang membaca harddisk pengunjung secara diam-diam demi keamanan. | _Bebas_: Memiliki akses penuh ke sistem operasi komputer tempat ia dijalankan.    |

### Tiga Cara Menjalankan Kode JavaScript:

1. **Langsung di Browser (Console DevTools)**:
   Buka browser apa saja -> Tekan tombol keyboard `F12` (atau klik kanan -> _Inspect_) -> Pilih tab **Console** -> Ketik `console.log("Halo Dunia!")` lalu tekan `Enter`. Kode langsung dieksekusi seketika!
2. **Melalui Berkas HTML (Menggunakan tag `<script>`)**:
   Cara standar untuk membuat website interaktif. File HTML memanggil file JavaScript agar berjalan otomatis saat halaman dibuka.
3. **Melalui Terminal Komputer (Menggunakan Node.js)**:
   Buka terminal/command prompt -> Ketik `node nama-file.js` lalu tekan `Enter`. Kode dijalankan langsung oleh sistem operasi tanpa perlu membuka browser sama sekali.

> [!TIP]
> **Fokus Jalur Kita**: Karena kurikulum repositori ini berfokus pada **Frontend Web Developer**, pembahasan kita selanjutnya akan berpusat pada **Client-Side (Browser)**.

---

## 3. Browser Membutuhkan Cara Pemuatan Script. Mengapa? (First Principles)

Saat browser membuka halaman website, ia membaca dokumen HTML **dari atas ke bawah, baris demi baris**:

1. **Masalah Pemuatan Biasa (`<script src="...">`)**:
   Jika Anda menaruh script di bagian atas (`<head>`) tanpa atribut tambahan, browser akan **berhenti membaca HTML seketika** (_parser-blocking_) untuk mengunduh dan menjalankan script tersebut. Akibatnya, jika script mencoba mencari elemen tombol di HTML yang posisinya ada di bawah, script akan gagal dan menghasilkan error: `Cannot read properties of null` (karena tombolnya belum sempat dibaca oleh browser!).

2. **Solusi Elegan: Atribut `defer`**:
   Dengan menambahkan atribut `defer` (`<script src="app.js" defer></script>`), Anda memberi instruksi tegas:
   _"Browser, tolong unduh file JavaScript ini di latar belakang tanpa menghentikan pembacaan HTML. Tunggu sampai seluruh struktur HTML selesai dibaca, barulah jalankan kodenya."_

---

## 4. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat halaman interaktif pertama Anda di browser. Buat dua berkas dalam satu folder yang sama:

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
// 1. Ambil elemen lampu dari halaman berdasarkan ID-nya, simpan ke wadah lampuEl
const lampuEl = document.querySelector("#lampu");

// 2. Ambil elemen teks status berdasarkan ID-nya, simpan ke wadah teksStatusEl
const teksStatusEl = document.querySelector("#teks-status");

// 3. Ambil elemen tombol saklar berdasarkan ID-nya, simpan ke wadah saklarBtn
const saklarBtn = document.querySelector("#btn-saklar");

// 4. Buat penanda status lampu dengan nilai awal false (artinya lampu mati saat pertama kali dimuat)
let isLampuMenyala = false;

// 5. Pasang pendengar klik pada tombol saklarBtn — setiap kali tombol diklik, blok ini berjalan
saklarBtn.addEventListener("click", () => {
  // 6. Balik nilai penanda: false menjadi true, atau true menjadi false
  // Catatan*: tanda seru (!) membalik nilai boolean — inilah cara toggle paling ringkas di JS
  isLampuMenyala = !isLampuMenyala;

  if (isLampuMenyala) {
    // 7. Jika lampu sekarang menyala, ubah warna lingkaran menjadi kuning terang
    lampuEl.style.backgroundColor = "#ffcc00";

    // 8. Perbarui teks di layar menjadi 'Lampu Menyala!'
    teksStatusEl.textContent = "Lampu Menyala!";

    // 9. Ganti label tombol menjadi 'Matikan Lampu'
    saklarBtn.textContent = "Matikan Lampu";
  } else {
    // 10. Jika lampu sekarang mati, kembalikan warna lingkaran menjadi abu-abu
    lampuEl.style.backgroundColor = "#ccc";

    // 11. Kembalikan teks di layar menjadi 'Lampu Sedang Mati'
    teksStatusEl.textContent = "Lampu Sedang Mati";

    // 12. Kembalikan label tombol menjadi 'Nyalakan Lampu'
    saklarBtn.textContent = "Nyalakan Lampu";
  }
});
```

---

## 5. Solusi Praktis / Best Practice

1. **Selalu gunakan `<script src="app.js" defer>` di dalam tag `<head>`**: Ini memastikan browser tidak terblokir saat membaca dokumen dan kode JavaScript Anda dijamin bisa menemukan seluruh elemen HTML.
2. **Hindari menulis JavaScript langsung di dalam atribut HTML (seperti `onclick="..."`)**: Pisahkan struktur (HTML) dan logika program (JS) di berkas terpisah agar rapi dan mudah dirawat.
3. **Ketahui batasan runtime Anda**: Jangan gunakan perintah browser seperti `document` atau `window` jika Anda sedang mengeksekusi script di lingkungan Node.js/terminal.

---

## 6. Checklist Praktik Mandiri

- [x] Buka browser Anda, tekan `F12`, buka tab **Console**, dan jalankan `console.log("Halo dari Console!")`.
- [x] Buat file `index.html` dan `app.js` di satu folder lokal di komputer Anda.
- [x] Buka `index.html` di browser dengan live server atau klik dua kali.
- [x] Klik tombol saklar dan amati lampu berubah warna serta teks berganti secara interaktif.
- [x] _(Opsional bagi yang punya Node.js)_: Buka terminal, buat file `test.js` berisi `console.log(typeof window);`, jalankan dengan perintah `node test.js`, dan amati hasilnya (`undefined` karena tidak ada browser di terminal!).

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah menguasai materi ini jika:
>
> 1. Memahami perbedaan mendasar di mana kode JS berjalan (Browser vs Server).
> 2. Memahami mengapa atribut `defer` penting agar JavaScript di browser tidak error mencari elemen HTML yang belum selesai dibaca.

---

## 🎯 Uji Pemahaman Mandiri

1. **Mengenai Runtime**: Jika Anda menulis kode `document.querySelector('#tombol')` di dalam sebuah file JavaScript lalu menjalankannya langsung di terminal komputer menggunakan perintah `node app.js`, apakah perintah tersebut akan berjalan sukses atau justru menghasilkan error? Mengapa?
2. **Mengenai Cara Pemuatan di Browser**: Perhatikan kode pemanggilan script berikut:
   ```html
   <head>
     <script src="app.js"></script>
   </head>
   <body>
     <button id="tombol">Klik Saya</button>
   </body>
   ```
   Jika di dalam `app.js` ada baris `document.querySelector('#tombol')`:
   - Mengapa pemanggilan di atas berisiko gagal menemukan tombol?
   - Atribut apa yang harus ditambahkan pada tag `<script>` agar browser menyelesaikan pembacaan HTML terlebih dahulu?
