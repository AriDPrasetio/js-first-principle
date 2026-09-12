---
title: "First Principles Deep Dive: Fetch API dan Penanganan Data JSON"
tags:
  - javascript
  - first-principles
  - roadmap-js/10-fetch-error-handling
level: intermediate
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  - https://fetch.spec.whatwg.org/
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
---

# First Principles Deep Dive: Fetch API dan Penanganan Data JSON

> [!NOTE]
> **The Ground Truth**
>
> `fetch()` adalah antarmuka aliran jaringan bertahap (_Stream-based I/O_): tahap pertama menyelesaikan penerimaan header HTTP, sedangkan tahap kedua mengonsumsi aliran data biner tubuh respons (_ReadableStream_) hanya satu kali untuk diubah menjadi struktur memori via `JSON.parse`.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "`fetch(url)` langsung mengunduh seluruh data server dan mengembalikan objek JavaScript yang siap dipakai dalam satu langkah."
- ✅ **Masalah Sebenarnya (Core Problem)**: Data jaringan berukuran besar tidak boleh ditimbun seluruhnya di memori sebelum dibaca. Browser mengimplementasikan model _Streaming_: Promise pertama dari `fetch()` selesai saat baris status dan header HTTP tiba, sedangkan pembacaan isi konten (`response.json()`) adalah operasi asinkron kedua yang membaca paket data yang mengalir secara bertahap.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Dua Fase Asinkron Fetch (WHATWG Fetch Standard)**:
   - **Fase 1 (`await fetch(url)`)**: Menghasilkan objek antarmuka `Response`. Pada titik ini, browser baru selesai menegosiasikan koneksi TCP/TLS dan menerima header HTTP.
   - **Fase 2 (`await response.json()`)**: Membaca _ReadableStream_ dari tubuh respons (`response.body`), menggabungkan paket biner yang masuk, dan mem-parsing string teks tersebut menjadi objek JavaScript.

2. **Aturan Konsumsi Aliran Sekali Pakai (_Disturbed Stream Rule_)**:
   Aliran data tubuh respons hanya dapat dikonsumsi **tepat satu kali**. Jika kita memanggil `await response.json()` lalu mencoba memanggil `await response.text()`, engine akan melempar error fatal: `TypeError: Failed to execute 'text' on 'Response': body stream already read` (stream berstatus _disturbed_). Jika perlu membaca ganda, stream harus diduplikasi di awal menggunakan `response.clone()`.

3. **Mekanisme Serialisasi dan Deserialisasi JSON**:
   - `JSON.stringify(obj)`: Mengubah grafik memori menjadi string teks ASCII. Spesifikasi mengabaikan nilai `undefined`, `Function`, dan `Symbol`, serta melempar `TypeError` jika mendeteksi referensi melingkar (_circular reference_).
   - `JSON.parse(str)`: Membaca teks dan merekonstruksi objek di heap memory; melempar `SyntaxError` jika ada koma gantung (_trailing comma_) atau kunci tanpa tanda kutip ganda.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Bangun fungsi wrapper HTTP universal yang menangani header `Content-Type`, serialisasi body secara otomatis, dan mengonversi respons JSON dengan pemeriksaan defensif terhadap kemungkinan format payload yang rusak.

- **Contoh Konkret**:

  ```javascript
  // Skenario: Klien HTTP Universal berbasis First Principles
  async function apiRequest(
    endpoint,
    { method = "GET", data = null, headers = {} } = {},
  ) {
    const config = {
      method,
      headers: {
        Accept: "application/json",
        ...headers,
      },
    };

    // Serialisasi otomatis jika ada data payload
    if (data !== null && method !== "GET") {
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(data);
    }

    // Fase 1: Tunggu header respons tiba
    const response = await fetch(endpoint, config);

    // Periksa apakah server benar-benar mengembalikan format JSON sebelum parsing
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    // Fase 2: Konsumsi stream tubuh respons
    const responseData = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      // Buat pesan error informatif dari payload error backend jika ada
      const errorMessage =
        typeof responseData === "object" && responseData.message
          ? responseData.message
          : `HTTP Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return responseData;
  }

  // Pengujian Klien:
  async function submitForm() {
    try {
      const result = await apiRequest("/api/settings", {
        method: "POST",
        data: { theme: "dark", notify: true },
      });
      console.log("Pengaturan berhasil disimpan:", result);
    } catch (err) {
      console.error("[Gagal API]:", err.message);
    }
  }
  ```

- **Mengapa ini lebih baik**:
  Memeriksa header `content-type` sebelum memanggil `.json()` mencegah bug sintaks klasik di mana server mengirim halaman error HTML 500 mentah dan aplikasi crash dengan pesan membingungkan: `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Selalu tambahkan header eksplisit `'Accept': 'application/json'` saat mengirim request agar server tahu aplikasi menginginkan respons berformat JSON.
- [ ] **Langkah 2**: Buka tab **Network** di Chrome DevTools -> klik request API -> amati tab **Headers** (Fase 1) dan tab **Response** (Fase 2 stream) untuk memvisualisasikan dua tahap pemuatan fetch.
- [ ] **Langkah 3**: Jangan pernah memanggil `.json()` dua kali pada objek response yang sama; jika butuh mencatat payload mentah untuk logging, gunakan `const clone = response.clone()`.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Aplikasi tidak pernah mengalami crash `SyntaxError: Unexpected token '<'` saat backend secara tidak sengaja mengembalikan halaman web HTML 404/500**.

> [!WARNING]
> **Batas Kepastian**
>
> Pemakaian pustaka pihak ketiga seperti Axios untuk request data adalah **pilihan utilitas kenyamanan di industri**, bukan kebutuhan mutlak. Fetch API native browser modern sudah mendukung seluruh fitur standar (termasuk interceptor via wrapper fungsi dan pembatalan via AbortController).
