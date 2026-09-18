---
title: "Panduan Pemula: Menangani Tiga Jenis Error Fetch dan Membatalkan Request (AbortController)"
tags: "javascript, first-principles, roadmap-js/10-fetch-error-handling"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/API/Response/ok"
---

# Panduan Pemula: Menangani Tiga Jenis Error Fetch dan Membatalkan Request (AbortController)

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Server yang membalas status "404 Not Found" atau "500 Server Error" **tidak dianggap error** oleh `fetch()` karena kabel jaringan tetap berhasil tersambung. Anda harus membedakan dengan tegas antara **Network Error**, **HTTP Status Error**, dan **Pembatalan Manual** menggunakan **`AbortController`**.

---

## 1. Analogi Logis: Tiga Masalah Saat Menelepon Toko Buku

Bayangkan Anda menelepon sebuah toko buku untuk menanyakan stok:

```
                  ┌─ 1. Jaringan Mati / Kabel Putus (Network Error / CORS)
                  │    └─► Telepon mati total, suara nada 'tut-tut-tut'. (Catch)
                  │
[ Anda Menelepon ]┼─ 2. Penjaga Menjawab "Buku Habis!" (HTTP 404 / 500)
                  │    └─► Telepon tersambung! Bukan masalah jaringan! (!response.ok)
                  │
                  └─ 3. Nada Sambung Terlalu Lama 10 Detik (AbortController)
                       └─► Anda menekan tombol merah tutup telepon! (AbortError)
```

1. **Kasus 1: Kabel Telepon Putus (Network Error & Blokir CORS)**:
   Telepon sama sekali tidak berdering, sinyal mati total. Di JavaScript, ini adalah kegagalan fisik jaringan yang langsung membuat Promise `fetch()` berubah menjadi **rejected** dan seketika melompat ke blok **`catch`**.
2. **Kasus 2: Telepon Diangkat, tapi Buku Tidak Ada (HTTP Error 404 / 500)**:
   Telepon tersambung lancar, kasir toko mengangkat telepon dan berkata ramah: _"Maaf, buku tersebut tidak ada di toko kami!"_.
   Dari sudut pandang perusahaan telepon, panggilan Anda 100% berhasil! Karena itulah `fetch()` **tidak menganggap 404 sebagai error**. Anda harus memeriksa stempel `response.ok` sendiri!
3. **Kasus 3: Membatalkan Panggilan (`AbortController` & `signal`)**:
   - `AbortController` adalah **remote kontrol tombol merah** yang Anda pegang.
   - `signal` adalah **kabel antena** yang ditancapkan ke kurir `fetch`.
   - Saat Anda menekan tombol `controller.abort()`, sinyal merah dikirim lewat kabel antena, dan kurir `fetch` seketika menghentikan pengunduhan paket di tengah jalan.

---

## 2. Mengapa JavaScript Didesain Seperti Ini? (First Principles)

### A. Tiga Kategori Error yang Wajib Anda Bedakan

| Kategori Masalah | Contoh Penyebab | Apa yang Dialami `fetch()`? | Di Mana Ditangani? |
| :--- | :--- | :--- | :--- |
| **1. Network Error** | Laptop offline, Wi-Fi putus, salah ketik domain, atau **Blokir CORS**. | Promise **Rejected** seketika. | Blok **`catch (error)`** |
| **2. HTTP Status Error** | Status 404 (Halaman Tidak Ada), 500 (Server Down), 401 (Tidak Punya Akses). | Promise tetap **Fulfilled** (koneksi sukses)! | Blok manual: **`if (!response.ok)`** |
| **3. Abort Error** | Pengguna menekan tombol "Batal", atau batas waktu request habis (*timeout*). | Melempar error dengan nama khusus `"AbortError"`. | Blok **`catch`** dicek via `error.name === "AbortError"` |

### B. Mengapa CORS Menyebabkan Network Error?
Pernahkah Anda mencoba memanggil API lalu muncul error warna merah: *Cross-Origin Request Blocked*?
- **CORS (Cross-Origin Resource Sharing)** adalah satpam keamanan browser.
- Browser melarang website di domain `websiteku.com` diam-diam membaca data dari server `bank.com`, kecuali server `bank.com` secara sukarela menyertakan izin resmi melalui header `Access-Control-Allow-Origin: *`.
- Jika satpam CORS memblokir request, browser menganggap koneksi tidak sah dan melemparnya langsung ke blok `catch` sebagai Network Error biasa demi keamanan.

### C. Anatomi `AbortController` dan Batas Waktu Modern
```javascript
// 1. Cara Manual (Menggunakan Controller):
const controller = new AbortController();
// Hubungkan sinyal antena pembatal:
fetch(url, { signal: controller.signal });
// Tekan tombol merah untuk membatalkan request kapan saja:
controller.abort();

// 2. Cara Modern (Otomatis Batal Jika Lebih dari 5 Detik):
fetch(url, { signal: AbortSignal.timeout(5000) });
```

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat alat penguji jaringan interaktif yang mensimulasikan ketiga skenario di atas secara nyata:

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
        max-width: 380px;
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
        padding: 9px;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #aaa;
        font-weight: 500;
        text-align: left;
      }
      #btn-sukses { background: #dcfce7; }
      #btn-http-error { background: #fee2e2; }
      #btn-network-error { background: #ffedd5; }
      #btn-batal { background: #fef08a; font-weight: bold; }
      .status-kotak {
        padding: 12px;
        border-radius: 6px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        min-height: 50px;
        font-size: 0.9rem;
      }
      .sukses { color: #166534; font-weight: bold; }
      .error { color: #991b1b; }
      .batal { color: #854d0e; font-weight: bold; }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Uji Coba Penanganan Error Fetch</h3>
      <div class="btn-group">
        <button type="button" id="btn-sukses">
          1. URL Normal (200 OK)
        </button>
        <button type="button" id="btn-http-error">
          2. URL Palsu (HTTP 404 Error)
        </button>
        <button type="button" id="btn-network-error">
          3. Domain Salah / Rusak (Network Error)
        </button>
        <button type="button" id="btn-batal">
          🛑 Batalkan Permintaan (Abort)
        </button>
      </div>
      <div id="kotak-status" class="status-kotak">
        Silakan pilih tombol skenario di atas...
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen HTML
// ambil element tombol sukses berdasarkan ID-nya, simpan ke variable tombolSukses
const tombolSukses = document.querySelector("#btn-sukses");
// ambil element tombol http error berdasarkan ID-nya, simpan ke variable tombolHttpError
const tombolHttpError = document.querySelector("#btn-http-error");
// ambil element tombol network error berdasarkan ID-nya, simpan ke variable tombolNetworkError
const tombolNetworkError = document.querySelector("#btn-network-error");
// ambil element tombol batal berdasarkan ID-nya, simpan ke variable tombolBatal
const tombolBatal = document.querySelector("#btn-batal");
// ambil element kotak status berdasarkan ID-nya, simpan ke variable kotakStatus
const kotakStatus = document.querySelector("#kotak-status");

// Variabel untuk memegang remote pengendali pembatalan
// buat variable pengendaliBatal dengan value null untuk menyimpan objek AbortController
let pengendaliBatal = null;

// ================================================================
// FUNGSI UMUM DENGAN PENANGANAN 3 KATEGORI ERROR
// ================================================================
// deklarasi function async mintaData dengan parameter urlTarget
async function mintaData(urlTarget) {
  // Buat remote pembatal baru untuk request ini
  // buat object AbortController baru dan simpan ke variable pengendaliBatal
  pengendaliBatal = new AbortController();

  // ubah value property className dari kotakStatus menjadi "status-kotak"
  kotakStatus.className = "status-kotak";
  // ubah teks di dalam kotakStatus menjadi pesan loading
  kotakStatus.textContent = "⏳ Sedang menghubungi server...";

  // gunakan try untuk menangani kode yang mungkin menghasilkan error
  try {
    // Sambungkan antena sinyal ke konfigurasi fetch:
    // jalankan fetch untuk mengambil data dengan signal pembatal, simpan ke respon
    const respon = await fetch(urlTarget, {
      signal: pengendaliBatal.signal,
    });

    // ============================================================
    // KATEGORI 2: HTTP Status Error (404, 500, dll)
    // Server berhasil dihubungi secara fisik jaringan, tetapi
    // server memberi balasan status gagal!
    // ============================================================
    // jika property ok dari respon adalah false, maka:
    if (!respon.ok) {
      // lemparkan object Error baru dengan pesan status server
      throw new Error(`HTTP Error! Status: ${respon.status} (${respon.statusText})`);
    }

    // jalankan metode json pada respon dan simpan hasilnya ke variable data
    const data = await respon.json();
    // ubah value property className dari kotakStatus menjadi "status-kotak sukses"
    kotakStatus.className = "status-kotak sukses";
    // ubah teks di dalam kotakStatus dengan pesan sukses berisi data
    kotakStatus.textContent = `✅ Sukses! Data: "${data.title || data.name}"`;
  } catch (error) {
    // ============================================================
    // KATEGORI 3: Pembatalan Disengaja oleh Pengguna (AbortError)
    // ============================================================
    // jika property name dari error adalah "AbortError", maka:
    if (error.name === "AbortError") {
      // ubah value property className dari kotakStatus menjadi "status-kotak batal"
      kotakStatus.className = "status-kotak batal";
      // ubah teks di dalam kotakStatus dengan pesan dibatalkan
      kotakStatus.textContent = "🛑 Request dibatalkan oleh pengguna via AbortController!";
    } 
    // ============================================================
    // KATEGORI 1: Kegagalan Jaringan Murni (Network Error / CORS)
    // ============================================================
    // jika tidak (berarti error lainnya), maka:
    else {
      // ubah value property className dari kotakStatus menjadi "status-kotak error"
      kotakStatus.className = "status-kotak error";
      // ubah isi HTML di dalam kotakStatus dengan pesan error
      kotakStatus.innerHTML = `❌ <strong>Terjadi Kesalahan:</strong><br>${error.message}`;
    }
  } finally {
    // kembalikan value pengendaliBatal menjadi null karena request telah selesai
    pengendaliBatal = null;
  }
}

// 2. Hubungkan ke tombol-tombol pengujian
// saat tombolSukses di-click, jalankan function berikut:
tombolSukses.addEventListener("click", () => {
  // jalankan function mintaData dengan URL yang valid
  mintaData("https://jsonplaceholder.typicode.com/todos/1");
});

// saat tombolHttpError di-click, jalankan function berikut:
tombolHttpError.addEventListener("click", () => {
  // Memanggil endpoint palsu yang akan memicu balasan HTTP 404 dari server
  // jalankan function mintaData dengan URL yang tidak ditemukan
  mintaData("https://jsonplaceholder.typicode.com/halaman-ini-pasti-404");
});

// saat tombolNetworkError di-click, jalankan function berikut:
tombolNetworkError.addEventListener("click", () => {
  // Domain asal-asalan yang tidak ada di DNS dunia -> memicu Network Error
  // jalankan function mintaData dengan domain yang salah
  mintaData("https://domain-palsu-yang-sama-sekali-tidak-ada-12345.com/data");
});

// saat tombolBatal di-click, jalankan function berikut:
tombolBatal.addEventListener("click", () => {
  // jika pengendaliBatal tidak null, maka:
  if (pengendaliBatal) {
    // Tekan tombol merah remote!
    // batalkan request dengan menjalankan metode abort
    pengendaliBatal.abort();
  } else {
    // ubah teks di dalam kotakStatus dengan pesan tidak ada request aktif
    kotakStatus.textContent = "Tidak ada request aktif yang sedang berjalan.";
  }
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Struktur Penanganan Wajib untuk Semua Kode `fetch`**:
   ```javascript
   try {
     const res = await fetch(url, { signal });
     if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
     const data = await res.json();
     return data;
   } catch (err) {
     if (err.name === "AbortError") {
       console.log("Dibatalkan sengaja.");
     } else {
       console.error("Gagal koneksi:", err.message);
     }
   }
   ```
2. **Pola Kolom Pencarian Cepat (*Search Autocomplete*)**:
   Saat pengguna mengetik di kolom pencarian huruf demi huruf ("j", "ja", "jav", "java"), selalu panggil `controller.abort()` untuk membatalkan pencarian huruf sebelumnya agar hasil request lama yang lambat tidak menimpa hasil ketikan terbaru (*race condition*).

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik **"1. URL Normal (200 OK)"** $\to$ pastikan status sukses hijau muncul.
- [ ] Klik **"2. URL Palsu (HTTP 404 Error)"** $\to$ amati pesan `HTTP Error! Status: 404` tertangkap rapi melalui pengecekan `!respon.ok`.
- [ ] Klik **"3. Domain Salah / Rusak (Network Error)"** $\to$ amati browser langsung melempar error koneksi ke blok `catch`.
- [ ] Klik tombol nomor 1 atau 3, lalu segera klik **"🛑 Batalkan Permintaan"** $\to$ perhatikan bagaimana `error.name === "AbortError"` menangkap sinyal pembatalan dengan teks kuning ramah.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mampu menjelaskan perbedaan antara Network Error (di `catch`), HTTP Error (di `!response.ok`), dan AbortError (pembatalan manual via `AbortController`)**.

---

## 🎯 Uji Pemahaman Mandiri

1. Mengapa respons kode status `500 Internal Server Error` dari server tetap dianggap fulfilled oleh `fetch()` dan tidak otomatis melompat ke blok `catch`?
2. Bagaimana cara membedakan di dalam blok `catch (error)` apakah sebuah request gagal karena kabel internet terputus ataukah karena pengguna memencet tombol batal?
3. Mengapa aturan CORS (Cross-Origin Resource Sharing) dapat menyebabkan perintah `fetch` menghasilkan Network Error di browser?
