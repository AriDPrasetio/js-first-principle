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
// 1. Buat alat pemutus hubungan baru
const controller = new AbortController();
// 2. Sambungkan alat pemutus ke perintah permintaan data
fetch(url, { signal: controller.signal });
// 3. Batalkan proses pengambilan data seketika itu juga
controller.abort();

// 4. Gunakan fitur batas waktu untuk batal otomatis setelah lima detik
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
// 1. Ambil seluruh elemen tombol dan layar dari halaman HTML
const tombolSukses = document.querySelector("#btn-sukses");
const tombolHttpError = document.querySelector("#btn-http-error");
const tombolNetworkError = document.querySelector("#btn-network-error");
const tombolBatal = document.querySelector("#btn-batal");
const kotakStatus = document.querySelector("#kotak-status");

// 2. Siapkan tempat untuk menaruh tombol pemutus darurat
let pengendaliBatal = null;

// ================================================================
// FUNGSI UMUM DENGAN PENANGANAN 3 KATEGORI ERROR
// ================================================================
// 3. Buat fungsi pintar yang menangani alamat server yang berbeda-beda
async function mintaData(urlTarget) {
  // 4. Siapkan remote pengendali baru setiap kali mulai meminta data
  pengendaliBatal = new AbortController();

  // 5. Ganti tampilan kotak dengan tulisan loading
  kotakStatus.className = "status-kotak";
  kotakStatus.textContent = "⏳ Sedang menghubungi server...";

  // 6. Mulai percobaan koneksi data
  try {
    // 7. Mulai penghubungan sambil menancapkan antena pembatalan
    const respon = await fetch(urlTarget, {
      signal: pengendaliBatal.signal,
    });

    // ============================================================
    // KATEGORI 2: HTTP Status Error (404, 500, dll)
    // ============================================================
    // 8. Cek apakah balasan server buruk kendati sambungan berhasil
    // Catatan*: 404 Not Found tidak dianggap rusak jaringannya, jadi harus diperiksa sendiri.
    if (!respon.ok) {
      // 9. Lempar masalah jika balasannya merah
      throw new Error(`HTTP Error! Status: ${respon.status} (${respon.statusText})`);
    }

    // 10. Jika aman, bongkar isi surat JSON menjadi data siap pakai
    const data = await respon.json();
    // 11. Tampilkan pesan berhasil bersama judul data ke layar
    kotakStatus.className = "status-kotak sukses";
    kotakStatus.textContent = `✅ Sukses! Data: "${data.title || data.name}"`;
  // 12. Tangkap semua lemparan dari masalah yang terjadi
  } catch (error) {
    // ============================================================
    // KATEGORI 3: Pembatalan Disengaja oleh Pengguna (AbortError)
    // ============================================================
    // 13. Bedakan jika masalahnya adalah akibat tombol batal ditekan
    if (error.name === "AbortError") {
      // 14. Ganti layar status ke informasi pembatalan manual
      kotakStatus.className = "status-kotak batal";
      kotakStatus.textContent = "🛑 Request dibatalkan oleh pengguna via AbortController!";
    } 
    // ============================================================
    // KATEGORI 1: Kegagalan Jaringan Murni (Network Error / CORS)
    // ============================================================
    // 15. Tangani kemungkinan jaringan putus atau ditolak satpam web
    else {
      // 16. Tampilkan pesan masalah putus jaringan ke layar
      kotakStatus.className = "status-kotak error";
      kotakStatus.innerHTML = `❌ <strong>Terjadi Kesalahan:</strong><br>${error.message}`;
    }
  // 17. Pastikan tombol darurat dikosongkan setelah proses berakhir
  } finally {
    pengendaliBatal = null;
  }
}

// 1. Hubungkan tombol hijau dengan permintaan normal
tombolSukses.addEventListener("click", () => {
  mintaData("https://jsonplaceholder.typicode.com/todos/1");
});

// 2. Hubungkan tombol merah dengan alamat yang pasti tidak ada
tombolHttpError.addEventListener("click", () => {
  mintaData("https://jsonplaceholder.typicode.com/halaman-ini-pasti-404");
});

// 3. Hubungkan tombol oranye dengan alamat aneh yang akan memutuskan kabel
tombolNetworkError.addEventListener("click", () => {
  mintaData("https://domain-palsu-yang-sama-sekali-tidak-ada-12345.com/data");
});

// 4. Pasang tombol interupsi untuk membatalkan sinyal permintaan saat itu juga
tombolBatal.addEventListener("click", () => {
  // 5. Tekan tombol pemutus di alat hanya jika ada alat pembatal yang aktif
  if (pengendaliBatal) {
    pengendaliBatal.abort();
  } else {
    // 6. Tampilkan peringatan jika tidak ada koneksi yang perlu diputus
    kotakStatus.textContent = "Tidak ada request aktif yang sedang berjalan.";
  }
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Struktur Penanganan Wajib untuk Semua Kode `fetch`**:
   ```javascript
   // 1. Uji percobaan mengambil data
   try {
     // 2. Ambil data beserta alat pemutus daruratnya
     const res = await fetch(url, { signal });
     // 3. Lemparkan masalah jika balasan status bukan berhasil
     if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
     // 4. Ubah format dari teks pesan menjadi objek hidup
     const data = await res.json();
     // 5. Kembalikan data tersebut
     return data;
   // 6. Tangkap jika terjadi error
   } catch (err) {
     // 7. Cek apakah ini pembatalan yang disengaja
     if (err.name === "AbortError") {
       console.log("Dibatalkan sengaja.");
     // 8. Tampilkan koneksi jaringan murni yang putus
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
