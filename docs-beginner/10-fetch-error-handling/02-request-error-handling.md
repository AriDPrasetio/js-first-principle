---
title: "Panduan Pemula: Menangani Error Fetch dan Membatalkan Request (AbortController)"
tags:
  - javascript
  - first-principles
  - roadmap-js/10-fetch-error-handling
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
  - https://developer.mozilla.org/en-US/docs/Web/API/AbortController
---

# Panduan Pemula: Menangani Error Fetch dan Membatalkan Request (AbortController)

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> Server yang membalas pesan "Error 404 Not Found" **tidak otomatis dianggap error** oleh `fetch()` karena koneksi jaringannya tetap berhasil tersambung. Anda wajib memeriksa `response.ok`, dan Anda bisa memakai **`AbortController`** untuk membatalkan permintaan jika menunggu terlalu lama.

---

## 1. Analogi Logis: Dua Macam Masalah Saat Menelepon Toko

Bayangkan Anda menelepon sebuah toko buku:

- **Kasus 1: Kabel Telepon Putus (Network Error)**:
  Telepon sama sekali tidak berdering, sinyal mati total. Di JavaScript, ini adalah kegagalan fisik jaringan yang langsung membuat `fetch()` meloncat ke blok **`catch`**.
- **Kasus 2: Telepon Diangkat, tapi Buku Habis (Error 404 / 500)**:
  Telepon tersambung dengan sukses, penjaga toko mengangkat telepon dan berkata: _"Maaf, buku itu tidak ada di toko kami!"_.
  Dari sudut pandang perusahaan telepon, panggilan Anda berhasil! Karena itulah JavaScript **tidak memasukkan 404 ke blok `catch`**. Anda harus memeriksa stempel `response.ok` sendiri!
- **Kasus 3: Menutup Telepon karena Terlalu Lama (`AbortController`)**:
  Telepon terus berdering tanpa ada yang mengangkat selama 10 detik. Anda memutuskan menekan tombol merah tutup telepon (_Tutup Telepon!_). Di kode, tombol merah ini bernama `AbortController`.

---

## 2. Mengapa JavaScript Bekerja Seperti Ini? (First Principles)

1. **Membedakan Sukses Sambungan vs Sukses Konten**:
   Tugas utama fungsi `fetch()` adalah menjamin pesan sampai ke server dan mendapat balasan. Jawaban 404 atau 500 adalah jawaban sah dari server, sehingga JavaScript menganggapnya selesai terkirim.
2. **Kunci Pemeriksaan: `if (!response.ok)`**:
   Properti `response.ok` bernilai `true` **hanya jika kode statusnya 200 sampai 299**. Jika angkanya 404 atau 500, `response.ok` bernilai `false`, dan kita harus melempar `throw new Error()` sendiri.
3. **Mencegah Tabrakan Data Usang (_Race Condition_)**:
   Saat pengguna mengetik di kolom pencarian huruf demi huruf, request pencarian lama yang lambat bisa membatalkan diri menggunakan `AbortController` agar tidak menimpa hasil pencarian yang baru.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat penguji jaringan yang bisa mendeteksi URL sukses, URL gagal (404), dan tombol pembatalan seketika:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Error Fetch & AbortController</title>
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
        gap: 6px;
        margin-bottom: 12px;
      }
      button {
        padding: 8px;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #aaa;
      }
      #btn-sukses {
        background: #dcfce7;
      }
      #btn-rusak {
        background: #fee2e2;
      }
      #btn-batal {
        background: #fef08a;
      }
      .status-kotak {
        padding: 10px;
        border-radius: 6px;
        font-weight: bold;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Uji Penanganan Error Jaringan</h3>
      <div class="btn-group">
        <button type="button" id="btn-sukses">
          1. Request URL Normal (200 OK)
        </button>
        <button type="button" id="btn-rusak">
          2. Request URL Palsu (Error 404)
        </button>
        <button type="button" id="btn-batal">
          3. Batalkan Request (AbortController)
        </button>
      </div>
      <div id="kotak-status" class="status-kotak">
        Pilih tombol uji coba di atas...
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil tombol dan wadah dari HTML
const tombolSukses = document.querySelector("#btn-sukses");
const tombolRusak = document.querySelector("#btn-rusak");
const tombolBatal = document.querySelector("#btn-batal");
const kotakStatus = document.querySelector("#kotak-status");

// Variabel untuk menyimpan remote pembatalan:
let pengendaliBatal = null;

// ================================================================
// FUNGSI UMUM DENGAN VALIDASI response.ok DAN DUKUNGAN PEMBATALAN
// ================================================================
async function mintaDataKeUrl(urlTarget) {
  // Buat alat pembatal baru setiap kali request dimulai:
  pengendaliBatal = new AbortController();
  // buat instans baru remote pembatalan.

  kotakStatus.textContent = "⏳ Menghubungi server...";

  try {
    // Pasang sinyal pembatal ke dalam opsi fetch:
    const respon = await fetch(urlTarget, {
      signal: pengendaliBatal.signal,
      // hubungkan kabel sinyal pembatal ke fetch.
    });

    // ============================================================
    // PEMERIKSAAN KRUSIAL FIRST PRINCIPLES:
    // Fetch TIDAK otomatis melempar error untuk status 404 / 500!
    // ============================================================
    if (!respon.ok) {
      // Jika statusnya bukan 200-299, lempar error buatan sendiri:
      throw new Error(
        `Gagal memuat! Status server: ${respon.status} (${respon.statusText})`,
      );
    }

    const data = await respon.json();
    kotakStatus.textContent = `✅ Sukses! Nama Data: ${data.title || data.name}`;
  } catch (error) {
    // Bedakan antara pembatalan yang disengaja vs error sungguhan:
    if (error.name === "AbortError") {
      kotakStatus.textContent =
        "🛑 Permintaan berhasil dibatalkan oleh pengguna!";
    } else {
      kotakStatus.textContent = `❌ Terjadi Masalah: ${error.message}`;
    }
  } finally {
    pengendaliBatal = null;
  }
}

// 2. Pasang aksi ke masing-masing tombol
tombolSukses.addEventListener("click", () => {
  // Panggil URL asli yang valid:
  mintaDataKeUrl("https://jsonplaceholder.typicode.com/todos/1");
});

tombolRusak.addEventListener("click", () => {
  // Panggil URL sengaja salah yang akan menghasilkan error 404:
  mintaDataKeUrl(
    "https://jsonplaceholder.typicode.com/halaman-ini-tidak-ada-404",
  );
});

tombolBatal.addEventListener("click", () => {
  // Pemicu tombol merah pembatalan:
  if (pengendaliBatal) {
    pengendaliBatal.abort();
    // batalkan paket jaringan seketika.
  } else {
    kotakStatus.textContent =
      "Tidak ada proses request yang sedang berjalan untuk dibatalkan.";
  }
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu Tuliskan Rumus Ini Setiap Pakai `fetch`**:
   ```javascript
   const res = await fetch(url);
   if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
   const data = await res.json();
   ```
2. **Gunakan Batas Waktu Otomatis (_Timeout_)**:
   Di browser modern, Anda bisa membatalkan request secara otomatis jika dalam 5 detik server belum merespons:
   `fetch(url, { signal: AbortSignal.timeout(5000) })`.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik **"1. Request URL Normal"** $\to$ amati status berubah menjadi sukses dengan ikon hijau.
- [ ] Klik **"2. Request URL Palsu (Error 404)"** $\to$ amati bagaimana teks pesan menangkap `Gagal memuat! Status server: 404` dengan rapi tanpa merusak aplikasi.
- [ ] Klik tombol 1 atau 2 lalu segera klik **"3. Batalkan Request"** $\to$ amati bahwa permintaan berhasil digagalkan dengan peringatan `🛑 Permintaan berhasil dibatalkan`.

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Mengerti bahwa `fetch()` tetap menganggap 404 sukses secara jaringan sehingga wajib dicek dengan `if (!response.ok)`, dan tahu cara membatalkan request dengan `AbortController`**.

---

## 🎯 Uji Pemahaman Mandiri

1. Mengapa baris `await fetch("https://alamat-salah.com/404")` tidak langsung otomatis melompat ke blok `catch`?
2. Bagaimana cara membedakan di dalam blok `catch (error)` apakah error tersebut terjadi karena pengguna sengaja membatalkan request dengan `AbortController` atau karena koneksi internet memang terputus?
