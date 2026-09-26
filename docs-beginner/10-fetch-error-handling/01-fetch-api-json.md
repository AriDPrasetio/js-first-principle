---
title: "Panduan Pemula: Mengambil Data dari Internet (fetch dan JSON) di JavaScript"
tags: "javascript, first-principles, roadmap-js/10-fetch-error-handling"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"
---

# Panduan Pemula: Mengambil Data dari Internet (fetch dan JSON) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Perintah **`fetch()`** adalah kurir internet browser Anda: ia pergi ke alamat URL server, mengambil amplop respons, lalu membongkar isi teks berformat **JSON** di dalamnya menjadi objek JavaScript asli yang siap ditampilkan ke layar halaman web.

---

## 1. Analogi Logis: Kurir Paket dan Surat Teks JSON

Bayangkan Anda memesan data dari penerbit buku di kota lain:

```
[ Browser Anda ] ── 1. fetch(url) ──► [ Server API ]
       │                                     │
       │ ◄── 2. Amplop Respons Tiba ─────────┘ (status: 200 OK)
       │
       ├─ Buka Amplop & Terjemahkan Teks:
       ▼
   await response.json()
       │
       ▼
[ Objek JavaScript Hidup di Memori ] ──► Tampilkan ke HTML
```

1. **`fetch(url)` (Kurir Berangkat & Membawa Amplop)**:
   Kurir pergi ke alamat server, lalu kembali membawa amplop tertutup ke tangan Anda. Anda bisa melihat stempel di luar amplop: _"Status: 200 OK (Surat Ditemukan)"_.
2. **Perbedaan Teks JSON vs Objek JavaScript**:
   - **Teks JSON (Bahan Baku Mentah di Kertas)**: Server hanya bisa mengirimkan teks biasa lewat kabel internet. Format teks ini disebut JSON:
     ```json
     '{"nama": "Budi", "kota": "Surabaya", "aktif": true}'
     ```
     Karena masih berupa teks mentah string, Anda **tidak bisa** langsung mengetik `teks.nama`.
   - **Objek JavaScript (Hasil Terjemahan di Memori)**:
     Melalui perintah `await response.json()`, teks mentah tadi dibongkar menjadi objek JavaScript asli di memori browser: `{ nama: "Budi", kota: "Surabaya", aktif: true }`. Sekarang Anda bebas mengakses `data.nama`!

---

## 2. Mengapa Butuh Dua Kali `await`? (First Principles)

Banyak pemula heran: _"Mengapa kita harus menulis kata kunci `await` sebanyak dua kali?"_:

1. **`await fetch(url)` (Langkah 1: Menunggu Jabat Tangan Jaringan)**:
   Browser baru selesai menyambungkan koneksi ke server dan menerima stempel kepala (*HTTP Header*). Pada tahap ini, isi badan datanya belum selesai mengalir dari internet.
2. **`await response.json()` (Langkah 2: Menunggu Pembacaan Aliran Teks Stream)**:
   Data dari internet mengalir sedikit demi sedikit (*ReadableStream*). Baris kedua ini menunggu seluruh aliran data teks selesai mengalir, lalu membacanya dari awal hingga akhir dan mengubah teks JSON menjadi objek JavaScript murni di memori.

### Dua Arah Pengubahan Data: JSON vs Objek

| Aksi | Perintah JavaScript | Kapan Digunakan? |
| :--- | :--- | :--- |
| **Teks JSON $\to$ Objek JS** | `JSON.parse(teksJSON)` atau `await response.json()` | Saat kita **menerima data** dari server internet. |
| **Objek JS $\to$ Teks JSON** | `JSON.stringify(objekJS)` | Saat kita ingin **mengirim data formulir baru** ke server. |

### Metode Permintaan: Mengambil (GET) vs Mengirim (POST)
Secara bawaan, `fetch(url)` menjalankan metode **GET** (hanya mengambil data). Jika Anda ingin **mengirimkan data baru** ke server (metode **POST**), sertakan objek konfigurasi:
```javascript
// 1. Hubungi server dengan memberikan instruksi pengiriman data baru
const respon = await fetch("https://api.contoh.com/pengguna", {
  // 2. Gunakan metode POST untuk mengirim data
  method: "POST",
  headers: {
    // 3. Beri tahu server bahwa jenis data yang dikirim adalah teks JSON
    "Content-Type": "application/json",
  },
  // 4. Ubah data objek menjadi teks JSON sebelum dikirimkan
  body: JSON.stringify({ nama: "Dewi", kota: "Jakarta" }),
});
```

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kartu interaktif yang bisa mengambil data pengguna (GET) dan mengirimkan data pengguna baru (POST) menggunakan API publik gratis (*JSONPlaceholder*):

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | fetch dan JSON</title>
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
        gap: 8px;
        margin-bottom: 12px;
      }
      button {
        flex: 1;
        padding: 10px;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        font-weight: bold;
        color: white;
      }
      #btn-ambil {
        background: #0284c7;
      }
      #btn-kirim {
        background: #16a34a;
      }
      .box-data {
        padding: 12px;
        border-radius: 6px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: #334155;
        min-height: 80px;
      }
      .box-data p {
        margin: 4px 0;
      }
      .sukses {
        background: #f0fdf4;
        border-color: #bbf7d0;
        color: #166534;
      }
      .loading {
        color: #d97706;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Interaksi Fetch & Data JSON</h3>
      <div class="btn-group">
        <button type="button" id="btn-ambil">Ambil Data (GET)</button>
        <button type="button" id="btn-kirim">Kirim Data (POST)</button>
      </div>
      <div id="wadah-pengguna" class="box-data">
        Tekan tombol untuk memulai interaksi server...
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil ketiga elemen dari halaman HTML
const tombolAmbil = document.querySelector("#btn-ambil");
const tombolKirim = document.querySelector("#btn-kirim");
const wadahPengguna = document.querySelector("#wadah-pengguna");

// ================================================================
// A. CONTOH METODE GET: Mengambil Data dari Server API
// ================================================================
// 2. Buat fungsi pintar untuk mengambil data dari server
async function ambilDataPengguna() {
  // 3. Ubah tampilan wadah dengan pesan bahwa proses sedang berjalan
  wadahPengguna.className = "box-data loading";
  wadahPengguna.textContent = "⏳ [GET] Menghubungi server...";
  // 4. Kunci tombol agar tidak diklik dua kali
  tombolAmbil.disabled = true;

  // 5. Coba jalankan proses permintaan data
  try {
    // 6. Hubungi alamat server dan tunggu jawabannya
    // Catatan*: Tahap ini hanya menunggu sinyal koneksi, bukan mengunduh isi pesannya.
    const responServer = await fetch(
      "https://jsonplaceholder.typicode.com/users/1",
    );

    // 7. Periksa apakah server memberikan lampu hijau
    if (!responServer.ok) {
      // 8. Hentikan proses dan lempar kesalahan jika statusnya buruk
      throw new Error(`Server bermasalah (HTTP Kode: ${responServer.status})`);
    }

    // 9. Terjemahkan isi pesan yang diunduh dari format teks ke objek JavaScript
    const dataUser = await responServer.json();

    // 10. Tampilkan data yang sudah jadi objek ke layar
    wadahPengguna.className = "box-data sukses";
    wadahPengguna.innerHTML = `
      <p><strong>Status:</strong> Data Berhasil Diambil (GET)</p>
      <p><strong>Nama:</strong> ${dataUser.name}</p>
      <p><strong>Email:</strong> ${dataUser.email}</p>
      <p><strong>Kota:</strong> ${dataUser.address.city}</p>
    `;
  // 11. Tangkap jika terjadi kegagalan jaringan atau server
  } catch (error) {
    wadahPengguna.textContent = `❌ Terjadi kesalahan: ${error.message}`;
  // 12. Selalu lepaskan kunci tombol di akhir proses
  } finally {
    tombolAmbil.disabled = false;
  }
}

// ================================================================
// B. CONTOH METODE POST: Mengirimkan Data Baru ke Server
// ================================================================
// 1. Buat fungsi pintar untuk mengirim data ke server
async function kirimDataPengguna() {
  // 2. Ubah tampilan wadah menjadi mode pemrosesan
  wadahPengguna.className = "box-data loading";
  wadahPengguna.textContent = "⏳ [POST] Mengirimkan data baru ke server...";
  // 3. Kunci tombol pengiriman
  tombolKirim.disabled = true;

  // 4. Coba jalankan proses pengiriman data
  try {
    // 5. Siapkan data objek yang akan dikirim
    const dataBaru = {
      title: "Belajar JavaScript First Principles",
      body: "Panduan lengkap memahami JavaScript dari akarnya.",
      userId: 1,
    };

    // 6. Hubungi server sambil membawa data baru tersebut
    const responServer = await fetch(
      "https://jsonplaceholder.typicode.com/posts",
      {
        // 7. Ubah metode menjadi POST karena akan mengirim data
        method: "POST",
        headers: {
          // 8. Nyatakan bahwa isi dokumen berupa teks JSON
          "Content-Type": "application/json",
        },
        // 9. Bungkus objek ke dalam string agar bisa terkirim lewat internet
        body: JSON.stringify(dataBaru),
      },
    );

    // 10. Pastikan pengiriman dianggap sukses oleh server
    if (!responServer.ok) {
      throw new Error(`Gagal mengirim data! Status: ${responServer.status}`);
    }

    // 11. Baca balasan dari server yang menyatakan hasil pembuatannya
    const hasilRespons = await responServer.json();

    // 12. Tampilkan balasan pembuatan ke layar
    wadahPengguna.className = "box-data sukses";
    wadahPengguna.innerHTML = `
      <p><strong>Status:</strong> Data Berhasil Dibuat di Server (201 Created)!</p>
      <p><strong>ID Baru:</strong> ${hasilRespons.id}</p>
      <p><strong>Judul:</strong> ${hasilRespons.title}</p>
    `;
  // 13. Tangkap jika ada masalah saat pengiriman
  } catch (error) {
    wadahPengguna.textContent = `❌ Terjadi kesalahan: ${error.message}`;
  // 14. Buka kembali kunci tombol di akhir
  } finally {
    tombolKirim.disabled = false;
  }
}

// 1. Hubungkan tombol ke fungsinya masing-masing
tombolAmbil.addEventListener("click", ambilDataPengguna);
tombolKirim.addEventListener("click", kirimDataPengguna);
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu Ingat Rumus `response.ok`**:
   `fetch()` hanya melempar error jaringan secara otomatis jika komputer mati sambungan atau URL sama sekali tidak ada di DNS. Jika server membalas `404 Not Found`, `fetch()` tidak melempar error! Maka dari itu, selalu pasang:
   ```javascript
   // 1. Lemparkan sebuah masalah jika status pengiriman bukan lampu hijau
   if (!respon.ok) throw new Error(`HTTP Error: ${respon.status}`);
   ```
2. **Jangan Membaca Body Dua Kali**:
   Aliran data body respons (*stream*) hanya dapat dibaca satu kali. Jangan memanggil `await response.json()` lalu memanggil `await response.text()` pada variabel respons yang sama karena akan memunculkan error `TypeError: body stream already read`.
3. **Konversi Tipe Data**:
   Gunakan `JSON.stringify()` saat ingin menyimpan objek ke `localStorage` atau mengirimkannya lewat body `fetch`. Gunakan `JSON.parse()` saat membaca kembali teks tersebut.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser (pastikan laptop/komputer online).
- [ ] Klik **"Ambil Data (GET)"** $\to$ amati loading dan munculnya detail pengguna dari API publik.
- [ ] Klik **"Kirim Data (POST)"** $\to$ amati bagaimana objek berhasil dikirim dan server membalas dengan objek baru yang memiliki `id: 101`.
- [ ] Buka DevTools (F12) pada tab **Network**, lalu klik tombol lagi $\to$ amati nama request jaringan yang muncul, status HTTP-nya (200 / 201), dan tab *Payload* untuk melihat teks JSON yang dikirimkan.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti bahwa `await fetch()` menunggu koneksi sedangkan `await response.json()` menunggu pembacaan teks stream menjadi objek, serta memahami perbedaan penggunaan GET dan POST**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa perbedaan mendasar antara teks string berformat JSON dengan objek JavaScript murni?
2. Mengapa kita memerlukan fungsi `JSON.stringify()` saat melakukan pengiriman data dengan metode `POST`?
3. Mengapa aliran data (*stream*) dari respons `fetch()` hanya bisa dibaca satu kali saja?
