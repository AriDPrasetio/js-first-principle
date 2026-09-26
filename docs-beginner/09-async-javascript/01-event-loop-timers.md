---
title: "Panduan Pemula: Cara Kerja Event Loop dan Timer (setTimeout) di JavaScript"
tags: "javascript, first-principles, roadmap-js/09-async-javascript"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop"
---

# Panduan Pemula: Cara Kerja Event Loop dan Timer (setTimeout) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> JavaScript adalah bahasa **Single-Threaded** (hanya memiliki satu tangan eksekusi / satu Call Stack). Agar halaman web tidak membeku saat menunggu proses yang lama, JavaScript menitipkan proses tunggu tersebut ke dapur browser (**Web APIs**), hasilnya ditampung di antrean (**Callback Queue**), dan pengawas lalu lintas (**Event Loop**) memindahkannya kembali ke meja utama hanya saat antrean utama sudah benar-benar kosong.

---

## 1. Analogi Logis: 4 Bagian di Kedai Kopi Modern

Bayangkan sebuah kedai kopi yang sangat ramai:

```
[ Pelanggan Datang ] 
       │
       ▼
1. Kasir Tunggal (Call Stack) ─────────► Langsung sajikan kopi dingin instan
       │
       ├─ (Pesan Roti Bakar Oven 3 Detik)
       ▼
2. Oven Dapur Otomatis (Web APIs) ─────► Roti dipanggang di latar belakang
       │
       │ (Ting! Selesai dipanggang)
       ▼
3. Meja Piring Saji (Callback Queue) ──► Roti matang berbaris rapi menunggu
       ▲
       │
4. Manajer Toko (Event Loop) ──────────► Memeriksa: "Apakah kasir sedang kosong?"
                                         Jika YA, serahkan roti ke kasir!
```

1. **Kasir Tunggal (Call Stack)**: Kasir hanya bisa melayani satu orang pelanggan pada satu detik. Jika ada pesanan langsung selesai (kopi botol), ia langsung menyajikannya.
2. **Oven Dapur Otomatis (Web APIs)**: Saat ada pesanan roti bakar yang butuh waktu 3 detik, kasir tidak berdiri mematung menatap oven! Kasir menitipkannya ke oven otomatis di dapur, lalu lanjut melayani pelanggan berikutnya.
3. **Meja Piring Saji (Callback Queue / Task Queue)**: Begitu oven berbunyi _Ting!_, roti bakar yang sudah matang diletakkan di meja saji sementara.
4. **Manajer Toko (Event Loop)**: Manajer mengawasi kasir tanpa henti. Jika kasir masih melayani orang, roti di meja saji dibiarkan menunggu. Namun begitu kasir selesai dan meja kasir kosong, manajer memindahkan roti ke kasir untuk diserahkan ke pelanggan!

---

## 2. Mengapa JavaScript Didesain Seperti Ini? (First Principles)

### A. Empat Pilar Runtime JavaScript

| Komponen | Peran Utama | Aturan Kerja |
| :--- | :--- | :--- |
| **Call Stack** | Meja eksekusi utama JavaScript | Mengeksekusi baris kode sinkron satu per satu (prinsip LIFO: *Last In, First Out*). |
| **Web APIs** | Asisten latar belakang browser | Menjalankan proses yang butuh waktu di luar thread utama (misal timer `setTimeout`, koneksi internet `fetch`, sensor klik `addEventListener`). |
| **Callback Queue** | Ruang tunggu antrean tugas | Menampung fungsi callback yang pekerjaannya di Web API sudah selesai dan siap dieksekusi (prinsip FIFO: *First In, First Out*). |
| **Event Loop** | Polisi lalu lintas otomatis | Memeriksa Call Stack secara terus-menerus. **Hanya memindahkan callback dari Queue ke Call Stack jika Call Stack benar-benar kosong!** |

### B. Mengapa `setTimeout(fn, 0)` Tidak Berjalan Seketika?
Perhatikan teka-teki terkenal ini:
```javascript
// 1. Cetak huruf pertama secara langsung
console.log("A");

// 2. Jadwalkan pencetakan huruf kedua dengan waktu nol detik
// Catatan*: Ini tidak akan langsung mencetak, tetapi menitipkan tugas ini ke ruang antrean.
setTimeout(() => {
  console.log("B");
}, 0);

// 3. Cetak huruf ketiga secara langsung
console.log("C");
```
Output di konsol adalah: **`A` $\to$ `C` $\to$ `B`** (bukan A-B-C). Mengapa?
1. `"A"` masuk ke Call Stack $\to$ langsung dicetak $\to$ keluar dari stack.
2. `setTimeout` dipanggil $\to$ browser mendaftarkannya ke Web API. Karena jedanya 0 ms, Web API seketika memindahkan callback `"B"` ke **Callback Queue**.
3. Call Stack lanjut mengeksekusi `"C"` $\to$ dicetak $\to$ keluar dari stack.
4. Call Stack sekarang benar-benar kosong! **Event Loop** baru melihat ke Callback Queue, mengambil callback `"B"`, dan memindahkannya ke Call Stack untuk dicetak.

> [!IMPORTANT]
> Nilai milidetik pada `setTimeout(fn, 1000)` adalah **waktu tunggu minimal**, bukan jaminan eksekusi tepat detik itu. Jika Call Stack sedang sibuk menghitung hal berat selama 5 detik, callback baru akan dieksekusi setelah 5 detik tersebut selesai!

### C. Menghentikan Timer: `clearTimeout` dan `clearInterval`
Setiap kali Anda membuat timer, JavaScript memberikan sebuah **nomor token identitas (Timer ID)** berupa angka unik:
```javascript
// 1. Jalankan sebuah perintah sekali saja setelah tiga detik lalu simpan tiketnya
const idSatuKali = setTimeout(() => console.log("Selesai"), 3000);
// 2. Batalkan perintah tersebut dengan tiketnya agar tidak pernah terjadi
clearTimeout(idSatuKali);

// 3. Jalankan sebuah perintah berulang kali setiap satu detik lalu simpan tiketnya
const idBerulang = setInterval(() => console.log("Detik bertambah..."), 1000);
// 4. Hentikan siklus berulang tersebut
clearInterval(idBerulang);
```

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat simulator oven roti yang memperlihatkan bagaimana kode sinkron dan timer asinkron berkolaborasi, lengkap dengan tombol pembatalan timer:

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
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
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
        font-weight: bold;
      }
      #btn-panggang {
        background: #ea580c;
        color: white;
        border: none;
      }
      #btn-batal {
        background: #f1f5f9;
        color: #334155;
      }
      .status {
        padding: 12px;
        border-radius: 6px;
        font-weight: bold;
        background: #fff7ed;
        border: 1px dashed #fdba74;
        min-height: 40px;
        display: flex;
        align-items: center;
      }
      .log {
        margin-top: 12px;
        font-size: 0.8rem;
        background: #0f172a;
        color: #38bdf8;
        padding: 8px;
        border-radius: 4px;
        font-family: monospace;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Simulator Oven Kafe</h3>
      <div class="btn-group">
        <button type="button" id="btn-panggang">Panggang (3 Detik)</button>
        <button type="button" id="btn-batal">Batal Panggang</button>
      </div>
      <div id="kotak-status" class="status">Oven dalam keadaan siap.</div>
      <div id="kotak-log" class="log">Log alur eksekusi akan tampil di sini...</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// ─── 1. AMBIL ELEMEN HTML ────────────────────────────────────────────────────
// 1. Ambil empat elemen dari layar HTML dan simpan ke masing-masing variabel
const tombolPanggang = document.querySelector("#btn-panggang");
const tombolBatal    = document.querySelector("#btn-batal");
const kotakStatus    = document.querySelector("#kotak-status");
const kotakLog       = document.querySelector("#kotak-log");

// 2. Sediakan wadah kosong untuk menyimpan nomor identitas antrean waktu
// Catatan*: Nilai null berarti tidak ada antrean waktu yang sedang aktif.
let idTimerOven = null;

// ================================================================
// 2. MEMULAI PROSES ASINKRON DENGAN setTimeout
// ================================================================
// 3. Pasang pemantau klik pada tombol pemanggang
tombolPanggang.addEventListener("click", () => {
  // 4. Batalkan klik jika mesin pemanggang sedang bekerja
  if (idTimerOven !== null) return;

  // 5. Ubah teks di layar menjadi status sedang memanggang
  kotakStatus.textContent = "⏳ Sedang memanggang... Tunggu 3 detik!";
  // 6. Beri informasi awal ke dalam kotak log
  kotakLog.textContent = "[Call Stack]: Perintah setTimeout dikirim ke Web APIs...";

  // 7. Daftarkan tugas yang ditunda selama tiga detik dan simpan nomor tiketnya
  // Catatan*: Perintah di dalam ini akan masuk ke antrean dulu dan menunggu giliran.
  idTimerOven = setTimeout(() => {
    // 8. Tampilkan pesan berhasil ke layar
    kotakStatus.textContent = "🍞 Ting! Roti bakar matang dan siap disantap!";
    // 9. Perbarui isi kotak log untuk menandakan tugas selesai
    kotakLog.textContent = "[Event Loop]: Callback dieksekusi dari Callback Queue!";
    // 10. Kosongkan kembali nomor tiket karena tugas sudah tuntas
    idTimerOven = null;
  }, 3000);

  // 11. Cetak keterangan ke dalam konsol bahwa tahap pembukaan klik selesai
  console.log("Call Stack selesai memproses fungsi klik, thread utama bebas.");
});

// ================================================================
// 3. MEMBATALKAN TIMER DENGAN clearTimeout
// ================================================================
// 1. Pasang pemantau klik pada tombol pembatalan
tombolBatal.addEventListener("click", () => {
  // 2. Cek apakah ada nomor tiket waktu yang aktif tersimpan
  if (idTimerOven !== null) {
    // 3. Hancurkan tiket tersebut agar jadwalnya dibatalkan
    clearTimeout(idTimerOven);
    // 4. Kosongkan variabel penyimpan tiket tersebut
    idTimerOven = null;

    // 5. Ubah teks status di layar dengan tanda gagal
    kotakStatus.textContent = "❌ Pemanggangan dibatalkan. Oven dimatikan.";
    // 6. Tambahkan pesan peringatan di kotak log
    kotakLog.textContent = "[Web APIs]: Timer ID dibatalkan via clearTimeout.";
  } else {
    // 7. Berikan informasi bahwa tidak ada jadwal yang bisa dibatalkan
    kotakStatus.textContent = "Tidak ada proses pemanggangan yang sedang berjalan.";
  }
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu Bersihkan Timer di Halaman SPA (Single Page Application)**:
   Jika Anda menggunakan `setInterval` untuk memperbarui jam atau polling pesan, selalu panggil `clearInterval(id)` saat pengguna berpindah tab atau menutup modal. Jika tidak, timer akan terus berjalan di latar belakang dan menyebabkan kebocoran memori (*memory leak*).
2. **Hindari Perhitungan Matematika Sangat Berat di Thread Utama**:
   Karena JavaScript berjiwa *single-threaded*, perulangan `for` hingga miliaran iterasi akan memblokir Call Stack. Saat stack terblokir, Event Loop tidak bisa memproses klik pengguna atau render animasi, sehingga halaman web menjadi *Unresponsive* / *Freeze*.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik **"Panggang (3 Detik)"** $\to$ amati status "Sedang memanggang..." dan perhatikan catatan log di bawah.
- [ ] Tunggu 3 detik $\to$ amati pesan "🍞 Ting! Roti bakar matang".
- [ ] Klik **"Panggang (3 Detik)"** lagi, lalu sebelum 3 detik berlalu segera klik **"Batal Panggang"** $\to$ pastikan proses pemanggangan berhasil digagalkan tepat waktu berkat `clearTimeout`.
- [ ] Buka Console browser (F12), jalankan:
  ```javascript
  // 1. Cetak huruf pertama ke layar
  console.log("1");
  // 2. Siapkan pencetakan huruf kedua yang akan diantrekan nol detik
  setTimeout(() => console.log("2"), 0);
  // 3. Cetak huruf ketiga ke layar
  console.log("3");
  ```
  Pastikan output yang keluar adalah `1`, `3`, baru kemudian `2`.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mampu menjelaskan alur 4 pilar (Call Stack $\to$ Web APIs $\to$ Callback Queue $\to$ Event Loop) dan memahami mengapa `setTimeout` tidak pernah memblokir jalannya kode sinkron lainnya**.

---

## 🎯 Uji Pemahaman Mandiri

1. Mengapa output dari `setTimeout(..., 0)` baru dicetak setelah seluruh baris kode sinkron di bawahnya selesai dieksekusi?
2. Apa peran utama Event Loop dalam mengatur hubungan antara Call Stack dan Callback Queue?
3. Apa perbedaan fungsi antara `clearTimeout(id)` dan `clearInterval(id)`?
