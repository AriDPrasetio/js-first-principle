---
title: "First Principles Deep Dive: Penanganan Error pada Request HTTP (Fetch & AbortController)"
tags:
  - javascript
  - first-principles
  - roadmap-js/10-fetch-error-handling
level: intermediate
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
  - https://developer.mozilla.org/en-US/docs/Web/API/AbortController
  - https://fetch.spec.whatwg.org/#dom-response-ok
---

# First Principles Deep Dive: Penanganan Error pada Request HTTP (Fetch & AbortController)

> [!NOTE]
> **The Ground Truth**
>
> `fetch()` tidak menganggap status HTTP 404 atau 500 sebagai error penolakan Promise; ia hanya me-reject pada kegagalan fisik jaringan (_Network Failure_), mewajibkan evaluasi manual properti `response.ok` dan pembatalan request usang via `AbortController`.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Jika server mengembalikan status 404 Not Found atau 500 Server Error, eksekusi `await fetch()` akan otomatis meloncat ke blok `catch`."
- ✅ **Masalah Sebenarnya (Core Problem)**: Dari kacamata browser, selama koneksi HTTP berhasil mengirim dan menerima pesan dari server, **proses jaringan dianggap sukses**. Status 404 atau 500 adalah status _aplikasi_, bukan kegagalan protokol jaringan. Blok `catch` pada `fetch` HANYA terpicu saat internet mati, DNS gagal, terjadi pelanggaran CORS, atau request dibatalkan.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Aturan Evaluasi Properti `response.ok` (WHATWG Fetch Standard)**:
   Objek respons menyediakan getter boolean bawaan `response.ok`. Spesifikasi menetapkan bahwa `response.ok === true` **hanya jika kode status HTTP berada di rentang 200–299**. Jika server merespons dengan kode 400, 401, 403, 404, atau 500, Promise tetap berstatus _fulfilled_ (sukses), dan developer wajib memeriksa `if (!response.ok)` secara manual untuk melempar error.

2. **Dua Kategori Kegagalan yang Terpisah Secara Arsitektur**:
   - **Kegagalan Protokol/Jaringan (Network Error)**: Kabel terputus, domain DNS tidak ditemukan, atau sertifikat SSL tidak valid. Menghasilkan Promise _rejected_ langsung dari `fetch()`.
   - **Kegagalan Logika/Aplikasi (HTTP Status Error)**: Server menerima pesan tetapi menolak memproses (misal 401 Unauthorized). Menghasilkan Promise _fulfilled_ dengan `response.ok === false`.

3. **Mekanisme Pembatalan Request Menggunakan `AbortController`**:
   Jika pengguna mengetik cepat di form pencarian atau berpindah halaman sebelum request sebelumnya selesai, respons yang datang terlambat dapat menimpa data baru (_Race Condition_). Antarmuka `AbortController` berkomunikasi langsung dengan stack jaringan browser melalui objek `AbortSignal`. Memanggil `controller.abort()` menghentikan transmisi paket seketika dan menolak Promise fetch dengan `DOMException: AbortError`.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Bangun pola penanganan request lengkap yang:
  1. Selalu mengecek `!response.ok` dan melempar `Error` eksplisit.
  2. Mengintegrasikan `AbortController` dengan batas waktu kedaluwarsa (_Timeout_) otomatis menggunakan `AbortSignal.timeout(ms)`.
  3. Memisahkan penanganan error pembatalan biasa (`AbortError`) dari error jaringan sejati agar antarmuka tidak menampilkan peringatan panik saat request sengaja dibatalkan.

- **Contoh Konkret**:

  ```javascript
  // Skenario: Fetch Aman dengan Validasi Status dan Batas Waktu (Timeout)
  async function fetchWithTimeout(url, timeoutMs = 5000) {
    // 1. Buat signal pembatalan otomatis jika waktu habis (Browser API Standar)
    const timeoutSignal = AbortSignal.timeout(timeoutMs);

    try {
      const response = await fetch(url, { signal: timeoutSignal });

      // 2. Evaluasi status aplikasi server secara manual
      if (!response.ok) {
        throw new Error(
          `Server menolak dengan status: ${response.status} (${response.statusText})`,
        );
      }

      return await response.json();
    } catch (error) {
      // 3. Pembedaan jenis error secara kausal
      if (error.name === "TimeoutError") {
        console.warn(
          `[Timeout]: Permintaan ke ${url} melebihi batas waktu ${timeoutMs}ms.`,
        );
      } else if (error.name === "AbortError") {
        console.info("[Dibatalkan]: Permintaan dibatalkan oleh pengguna.");
      } else {
        console.error(
          "[Network Error]: Gagal menghubungi server fisik:",
          error.message,
        );
      }

      // Kembalikan null atau lempar kembali sesuai kebutuhan UI
      throw error;
    }
  }

  // Pengujian dengan simulasi penanganan UI:
  async function loadData() {
    try {
      const data = await fetchWithTimeout(
        "https://jsonplaceholder.typicode.com/invalid-route",
      );
      console.log("Data diterima:", data);
    } catch (err) {
      // Menampilkan pesan ramah pengguna di layar (misal Toast Notifikasi)
      console.log(`Pesan untuk UI: "Maaf, terjadi kesalahan: ${err.message}"`);
    }
  }

  loadData();
  ```

- **Mengapa ini lebih baik**:
  Memeriksa `response.ok` secara sistematis menjamin tidak ada respons 404 atau 500 yang lolos tanpa terdeteksi ke logika rendering UI. Pemakaian `AbortSignal.timeout()` melindungi aplikasi dari request gantung (_hanging requests_) saat koneksi pengguna melemah.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Jangan pernah menulis `const data = await (await fetch(url)).json()` tanpa memeriksa `response.ok` di antara keduanya.
- [ ] **Langkah 2**: Pada fitur input autocomplete atau pencarian langsung, batalkan request lama menggunakan `controller.abort()` setiap kali pengguna mengetikkan karakter baru.
- [ ] **Langkah 3**: Di blok `catch`, selalu lakukan pengecekan `if (error.name === 'AbortError') return;` agar pembatalan request yang disengaja tidak memunculkan dialog peringatan error merah di layar pengguna.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Endpoint yang mengembalikan status HTTP 4xx/5xx berhasil ditangkap di blok catch atau penanganan error UI, dan request yang menggantung dibatalkan otomatis oleh timeout signal**.

> [!WARNING]
> **Batas Kepastian**
>
> Fitur `AbortSignal.timeout()` tersedia secara native di semua peramban modern (Chrome 103+, Safari 16+, Firefox 100+). Jika harus mendukung lingkungan browser purba, pembuatan `AbortController` manual dikombinasikan dengan `setTimeout` dan event listener pembatalan adalah implementasi padanannya.
