---
title: "Panduan Pemula: Menjaga Performa Web dan Menggunakan Tab Performance di Browser"
tags: "javascript, first-principles, roadmap-js/12-browser-devtools"
level: beginner
official_docs_url: "https://developer.chrome.com/docs/devtools/performance/"
---

# Panduan Pemula: Menjaga Performa Web dan Menggunakan Tab Performance di Browser

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Agar halaman web terasa mulus tanpa patah-patah (*lag/jank*), browser harus menyelesaikan setiap frame dalam waktu maksimal **16.6 milidetik** (standar 60 FPS). Anda bisa mendeteksi kemacetan tugas berat (*Long Task* > 50ms) menggunakan **Tab Performance di DevTools**, mengukur waktu eksekusi dengan `performance.now()`, dan menghindari kebiasaan merusak kinerja bernama **Layout Thrashing**.

---

## 1. Analogi Logis: Flipbook 60 Lembar dan Panggung Teater

Bayangkan Anda sedang membalik buku animasi kertas (*flipbook*):

```
[ Waktu 1 Detik = 1.000 ms ]
├─ Butuh 60 Lembar Gambar Mulus (60 FPS)
└─ Waktu per Lembar = 1.000 ms / 60 ≈ 16.6 milidetik!

Jika satu fungsi JavaScript berjalan 80 milidetik:
─────────────────────────────────────────────────► Jari tersangkut macet!
(Layar membeku, klik tombol diabaikan, animasi patah-patah = Long Task!)
```

1. **Jatah Waktu 16.6 Milidetik (Frame Budget)**:
   Mata manusia melihat gerakan sebagai animasi yang mulus jika gambar berganti 60 kali setiap detik. Artinya, browser hanya punya waktu **16.6 milidetik** untuk menghitung JavaScript, menata posisi kotak elemen, dan menggambar piksel warna ke layar!
2. **Tugas Panjang / Long Task (> 50ms)**:
   Jika ada kode JavaScript Anda yang memakan waktu lebih dari 50 milidetik, thread utama browser tersumbat total. Pengguna merasa tombol tidak merespons dan halaman web seolah-olah "rusak/hang".

---

## 2. Mengapa Aplikasi Web Bisa Menjadi Lambat? (First Principles)

### A. Alur Menggambar Browser (Critical Rendering Path)
Saat Anda mengubah sesuatu di halaman web, browser melalui 5 tahapan berurutan:
$$\text{JavaScript} \longrightarrow \text{Style} \longrightarrow \text{Layout (Reflow)} \longrightarrow \text{Paint} \longrightarrow \text{Composite}$$

- **Properti Mahal (`left`, `top`, `width`, `margin`)**:
  Mengubah properti ini memaksa browser menghitung ulang posisi dan ukuran seluruh kotak di sekitarnya (**Layout/Reflow**), menggambar ulang warnanya (**Paint**), lalu menempelkannya (**Composite**). Sangat membebani CPU!
- **Properti Murah & Cepat (`transform` dan `opacity`)**:
  Perubahan `transform: translateX(...)` atau `opacity` **melewati tahap Layout dan Paint**. Perubahan ini langsung diserahkan ke kartu grafis (GPU) di tahap **Composite**. Animasi berjalan super mulus 60 FPS!

### B. Bahaya Jebakan "Layout Thrashing"
Layout Thrashing adalah kesalahan pemula paling umum saat memanipulasi DOM di dalam perulangan:
```javascript
// 1. Lakukan pengubahan ukuran untuk setiap elemen di layar secara bergantian
// Catatan*: Pola baca-tulis-baca-tulis berulang ini sangat berat (Layout Thrashing).
for (let i = 0; i < elemenList.length; i++) {
  // 2. BACA: paksa browser menghitung dan memberikan nilai lebar saat ini
  const lebar = kotakList[i].offsetWidth; 
  // 3. TULIS: ganti nilainya sehingga layout rusak dan harus dihitung ulang
  kotakList[i].style.width = lebar + 10 + "px"; 
}
```
**Solusi Terbaik (Batching)**:
Pisahkan fase baca dan fase tulis:
```javascript
// 1. BACA: Kumpulkan semua data ukuran terlebih dahulu
const daftarLebar = kotakList.map(kotak => kotak.offsetWidth);
// 2. Lakukan iterasi kedua untuk menulis perubahan secara berkelompok
kotakList.forEach((kotak, i) => {
  // 3. TULIS: Ubah nilainya tanpa memaksa browser membacanya lagi di sela-sela iterasi
  kotak.style.width = daftarLebar[i] + 10 + "px";
});
```

### C. Cara Menggunakan Tab Performance di DevTools Browser
1. Buka DevTools (`F12`) $\to$ klik tab **Performance**.
2. Klik tombol bundar **Record** (atau shortcut `Ctrl + E`).
3. Lakukan interaksi yang dicurigai lambat di halaman web (misal klik tombol animasi atau gulir halaman).
4. Klik tombol **Stop**.
5. **Cara Membaca Hasil**:
   - **Main Thread (Flame Chart)**: Perhatikan blok bar berwarna kuning. Jika di pojok kanan atasnya terdapat **sudut segitiga merah**, itu adalah tanda **Long Task (> 50ms)** yang membuat browser macet!

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita bandingkan secara nyata waktu eksekusi antara **Layout Thrashing (Lambat)** vs **Batching Update (Cepat)** menggunakan `performance.now()`:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Performance Debugging</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 400px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      .btn-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 12px;
      }
      button {
        padding: 10px;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #aaa;
        font-weight: 500;
        text-align: left;
      }
      #btn-thrash { background: #fee2e2; color: #991b1b; }
      #btn-batch { background: #dcfce7; color: #166534; font-weight: bold; }
      #btn-geser { background: #e0e7ff; color: #3730a3; }
      .status-box {
        padding: 10px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        font-size: 0.9rem;
        margin-bottom: 12px;
      }
      .kotak-wadah {
        display: flex;
        gap: 4px;
        margin-top: 10px;
      }
      .item-kotak {
        width: 30px;
        height: 30px;
        background: #94a3b8;
        border-radius: 4px;
        transition: transform 0.3s ease;
      }
      .animasi-box {
        width: 40px;
        height: 40px;
        background: #3b82f6;
        border-radius: 6px;
        margin-top: 10px;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Audit Performa JavaScript</h3>
      <div class="btn-group">
        <button type="button" id="btn-thrash">
          1. Perbarui Elemen via Layout Thrashing (Lambat)
        </button>
        <button type="button" id="btn-batch">
          2. Perbarui Elemen via Batching (Cepat & Ringan)
        </button>
        <button type="button" id="btn-geser">
          3. Animasi Kotak GPU (Mulus 60 FPS)
        </button>
      </div>

      <div id="kotak-status" class="status-box">
        Klik salah satu tombol uji performa di atas...
      </div>

      <!-- Wadah 8 kotak untuk eksperimen manipulasi DOM -->
      <div id="wadah-kotak" class="kotak-wadah"></div>

      <!-- Kotak uji animasi GPU -->
      <div id="kotak-animasi" class="animasi-box"></div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil wadah pembungkus kotak dari layar
const wadahKotak = document.querySelector("#wadah-kotak");
// 2. Cetak 40 buah kotak kosong untuk bahan percobaan
for (let i = 0; i < 40; i++) {
  // 3. Buat satu elemen kotak baru di memori
  const k = document.createElement("div");
  // 4. Beri identitas kelas agar punya tampilan awal
  k.className = "item-kotak";
  // 5. Tempelkan kotak tersebut ke wadah di layar
  wadahKotak.appendChild(k);
}

// 6. Ambil semua elemen kotak yang barusan diciptakan
const semuaKotak = document.querySelectorAll(".item-kotak");
// 7. Ambil tombol-tombol penguji dari layar
const tombolThrash = document.querySelector("#btn-thrash");
const tombolBatch = document.querySelector("#btn-batch");
const tombolGeser = document.querySelector("#btn-geser");
const kotakStatus = document.querySelector("#kotak-status");
const kotakAnimasi = document.querySelector("#kotak-animasi");

// ================================================================
// EKSPERIMEN 1: LAYOUT THRASHING (BACA & TULIS BERGANTIAN)
// ================================================================
// 8. Pasang pemantau klik pada tombol penguji pertama
tombolThrash.addEventListener("click", () => {
  // 9. Simpan catatan waktu mulainya detik ini dengan sangat presisi
  const mulai = performance.now();

  // 10. Lakukan seratus kali siklus ubah ukuran
  for (let iterasi = 0; iterasi < 100; iterasi++) {
    // 11. Sentuh semua kotak satu per satu
    semuaKotak.forEach((kotak) => {
      // 12. BACA: Paksa mesin menghitung ulang layout saat ini juga
      const lebar = kotak.offsetWidth;
      // 13. TULIS: Rusak kembali layout yang barusan jadi
      kotak.style.width = `${(lebar % 40) + 1}px`;
    });
  }

  // 14. Hentikan waktu dan hitung selisih dari awal mula tadi
  const selesai = performance.now();
  const durasi = (selesai - mulai).toFixed(2);
  // 15. Tampilkan durasi pemrosesannya ke layar
  kotakStatus.innerHTML = `⚠️ <strong>Layout Thrashing:</strong> Memakan waktu <strong>${durasi} ms</strong> karena browser dipaksa menghitung layout berulang kali!`;
});

// ================================================================
// EKSPERIMEN 2: BATCHING DOM UPDATE (BACA SEMUA, BARU TULIS SEMUA)
// ================================================================
// 1. Pasang pemantau klik pada tombol penguji kedua
tombolBatch.addEventListener("click", () => {
  // 2. Simpan waktu awal mulainya pekerjaan ini
  const mulai = performance.now();

  // 3. Ulangi pekerjaan sebanyak seratus kali
  for (let iterasi = 0; iterasi < 100; iterasi++) {
    // 4. BACA: Tanya ukuran lebar seluruh kotak dalam satu ketukan
    const ukuranList = Array.from(semuaKotak).map((k) => k.offsetWidth);

    // 5. TULIS: Beri ukuran baru ke semua kotak sekaligus dengan data yang sudah di tangan
    semuaKotak.forEach((kotak, i) => {
      kotak.style.width = `${(ukuranList[i] % 40) + 1}px`;
    });
  }

  // 6. Hentikan waktu dan simpan hasil selisih durasinya
  const selesai = performance.now();
  const durasi = (selesai - mulai).toFixed(2);
  // 7. Berikan laporan waktu akhirnya ke layar
  kotakStatus.innerHTML = `✅ <strong>Batching Update:</strong> Selesai hanya dalam <strong>${durasi} ms</strong> (Jauh lebih cepat dan hemat daya baterai)!`;
});

// ================================================================
// EKSPERIMEN 3: ANIMASI GPU MULUS 60 FPS (TRANSFORM)
// ================================================================
// 1. Buat sakelar pengingat posisi arah geser saat ini
let geserKanan = false;
// 2. Pasang pemantau klik pada tombol pemicu animasi
tombolGeser.addEventListener("click", () => {
  // 3. Ubah status geser ke arah yang berlawanan dari sebelumnya
  geserKanan = !geserKanan;
  // 4. Pindahkan posisi menggunakan lapisan kartu grafis agar mulus
  // Catatan*: Perintah ini sangat murah karena tidak mengganggu elemen lain di sekitarnya.
  kotakAnimasi.style.transform = geserKanan ? "translateX(250px)" : "translateX(0px)";
  // 5. Umumkan bahwa animasi telah dijalankan
  kotakStatus.textContent = "🚀 Animasi diproses langsung oleh GPU di tahap Composite.";
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan `performance.now()` untuk Mengukur Waktu Presisi**:
   Jangan menggunakan `new Date().getTime()` untuk benchmarking performa karena tingkat presisinya rendah dan dipengaruhi jam sistem operasi. Selalu gunakan `performance.now()` yang memiliki ketepatan hingga mikrodetik.
2. **Kapan Menggunakan `requestAnimationFrame`?**:
   Jika Anda membuat animasi berbasis JavaScript (bukan CSS), jangan gunakan `setInterval()`. Gunakan `requestAnimationFrame(callback)` agar browser menyelaraskan pembaruan visual tepat di momen layar siap me-refresh (sinkron 60Hz/120Hz).
3. **Mendeteksi Long Task di Tab Performance**:
   Kapan pun situs terasa macet, buka tab **Performance** $\to$ rekam aktivitas selama beberapa detik $\to$ cari balok kuning bertanda segitiga merah di baris **Main Thread**. Cari tahu nama fungsi yang menyebabkan durasi pengerjaan melebihi 50 ms.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser Google Chrome.
- [ ] Buka tab **Performance** di DevTools (`F12`).
- [ ] Klik tombol bundar abu-abu **Record** di tab Performance.
- [ ] Klik tombol merah **"1. Perbarui Elemen via Layout Thrashing"**, tunggu sejenak, lalu klik **Stop** pada DevTools.
- [ ] Amati grafik *Main Thread*: lihat bagaimana deretan tugas panjang berwarna kuning padat muncul memperlambat thread utama browser.
- [ ] Sekarang klik tombol hijau **"2. Perbarui Elemen via Batching"** $\to$ amati perbandingan durasi milidetik yang dicetak pada layar (perbedaan waktu bisa berkali-kali lipat lebih cepat!).

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti jatah waktu 16.6ms untuk 60 FPS, bahaya Layout Thrashing (baca-tulis DOM bergantian di dalam loop), dan cara memeriksa Long Task di tab Performance DevTools**.

---

## 🎯 Uji Pemahaman Mandiri

1. Mengapa jatah waktu pengerjaan per frame visual di browser dibatasi maksimal sekitar 16.6 milidetik jika kita menginginkan tampilan 60 FPS?
2. Apa yang dimaksud dengan *Layout Thrashing* dan bagaimana strategi *Batching* mampu mengatasinya?
3. Mengapa animasi pergerakan yang memanfaatkan `transform: translateX(...)` jauh lebih hemat daya dan ringan dibandingkan memanipulasi properti `style.left`?
