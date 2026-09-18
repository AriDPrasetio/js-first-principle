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
// Mengirim data baru ke server (POST):
const respon = await fetch("https://api.contoh.com/pengguna", {
  method: "POST",
  headers: {
    // Beri tahu server bahwa kita mengirim format JSON
    "Content-Type": "application/json",
  },
  // Bungkus objek jadi teks string JSON
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
// 1. Ambil elemen HTML
// ambil element tombol ambil berdasarkan ID-nya, simpan ke variable tombolAmbil
const tombolAmbil = document.querySelector("#btn-ambil");
// ambil element tombol kirim berdasarkan ID-nya, simpan ke variable tombolKirim
const tombolKirim = document.querySelector("#btn-kirim");
// ambil element wadah pengguna berdasarkan ID-nya, simpan ke variable wadahPengguna
const wadahPengguna = document.querySelector("#wadah-pengguna");

// ================================================================
// A. CONTOH METODE GET: Mengambil Data dari Server API
// ================================================================
// deklarasi function async ambilDataPengguna
async function ambilDataPengguna() {
  // ubah value property className dari wadahPengguna menjadi "box-data loading"
  wadahPengguna.className = "box-data loading";
  // ubah teks di dalam wadahPengguna menjadi pesan loading
  wadahPengguna.textContent = "⏳ [GET] Menghubungi server...";
  // ubah value property disabled dari tombolAmbil menjadi true
  tombolAmbil.disabled = true;

  // gunakan try untuk menangani kode yang mungkin menghasilkan error
  try {
    // 1. Hubungi server internet (Langkah Await 1)
    // jalankan fetch untuk mengambil data dan simpan hasil response ke variable responServer
    const responServer = await fetch(
      "https://jsonplaceholder.typicode.com/users/1",
    );

    // Periksa status selamat (200-299)
    // jika property ok dari responServer adalah false, maka:
    if (!responServer.ok) {
      // lemparkan object Error baru dengan pesan status server
      throw new Error(`Server bermasalah (HTTP Kode: ${responServer.status})`);
    }

    // 2. Terjemahkan teks JSON menjadi objek JavaScript (Langkah Await 2)
    // jalankan metode json pada responServer dan simpan hasilnya ke variable dataUser
    const dataUser = await responServer.json();

    // 3. Tampilkan data objek JavaScript ke layar
    // ubah value property className dari wadahPengguna menjadi "box-data sukses"
    wadahPengguna.className = "box-data sukses";
    // ubah isi HTML di dalam wadahPengguna dengan data dari variable dataUser
    wadahPengguna.innerHTML = `
      <p><strong>Status:</strong> Data Berhasil Diambil (GET)</p>
      <p><strong>Nama:</strong> ${dataUser.name}</p>
      <p><strong>Email:</strong> ${dataUser.email}</p>
      <p><strong>Kota:</strong> ${dataUser.address.city}</p>
    `;
  // tangkap error dari blok try ke dalam variable error
  } catch (error) {
    // ubah teks di dalam wadahPengguna dengan pesan error
    wadahPengguna.textContent = `❌ Terjadi kesalahan: ${error.message}`;
  // jalankan blok finally setelah try atau catch selesai
  } finally {
    // ubah value property disabled dari tombolAmbil menjadi false
    tombolAmbil.disabled = false;
  }
}

// ================================================================
// B. CONTOH METODE POST: Mengirimkan Data Baru ke Server
// ================================================================
// deklarasi function async kirimDataPengguna
async function kirimDataPengguna() {
  // ubah value property className dari wadahPengguna menjadi "box-data loading"
  wadahPengguna.className = "box-data loading";
  // ubah teks di dalam wadahPengguna menjadi pesan loading POST
  wadahPengguna.textContent = "⏳ [POST] Mengirimkan data baru ke server...";
  // ubah value property disabled dari tombolKirim menjadi true
  tombolKirim.disabled = true;

  // gunakan try untuk menangani kode yang mungkin menghasilkan error
  try {
    // Data objek JavaScript yang ingin kita kirim:
    // buat object data baru dan simpan ke variable dataBaru
    const dataBaru = {
      // set property title menjadi "Belajar JavaScript First Principles"
      title: "Belajar JavaScript First Principles",
      // set property body menjadi "Panduan lengkap memahami JavaScript dari akarnya."
      body: "Panduan lengkap memahami JavaScript dari akarnya.",
      // set property userId menjadi 1
      userId: 1,
    };

    // Kirim menggunakan metode POST:
    // jalankan fetch dengan opsi method POST, headers, body, lalu simpan hasil ke responServer
    const responServer = await fetch(
      "https://jsonplaceholder.typicode.com/posts",
      {
        // set metode request menjadi "POST"
        method: "POST",
        // tentukan headers dari request
        headers: {
          // Nyatakan tipe payload JSON
          // set "Content-Type" menjadi "application/json"
          "Content-Type": "application/json",
        },
        // Ubah objek menjadi format string JSON
        // konversi object dataBaru menjadi string JSON dan jadikan sebagai body request
        body: JSON.stringify(dataBaru),
      },
    );

    // jika property ok dari responServer adalah false, maka:
    if (!responServer.ok) {
      // lemparkan object Error baru dengan pesan status gagal
      throw new Error(`Gagal mengirim data! Status: ${responServer.status}`);
    }

    // jalankan metode json pada responServer dan simpan hasilnya ke variable hasilRespons
    const hasilRespons = await responServer.json();

    // ubah value property className dari wadahPengguna menjadi "box-data sukses"
    wadahPengguna.className = "box-data sukses";
    // ubah isi HTML di dalam wadahPengguna dengan data dari variable hasilRespons
    wadahPengguna.innerHTML = `
      <p><strong>Status:</strong> Data Berhasil Dibuat di Server (201 Created)!</p>
      <p><strong>ID Baru:</strong> ${hasilRespons.id}</p>
      <p><strong>Judul:</strong> ${hasilRespons.title}</p>
    `;
  // tangkap error dari blok try ke dalam variable error
  } catch (error) {
    // ubah teks di dalam wadahPengguna dengan pesan error
    wadahPengguna.textContent = `❌ Terjadi kesalahan: ${error.message}`;
  // jalankan blok finally setelah try atau catch selesai
  } finally {
    // ubah value property disabled dari tombolKirim menjadi false
    tombolKirim.disabled = false;
  }
}

// 2. Hubungkan event klik ke fungsi masing-masing
// saat tombolAmbil di-click, jalankan function ambilDataPengguna
tombolAmbil.addEventListener("click", ambilDataPengguna);
// saat tombolKirim di-click, jalankan function kirimDataPengguna
tombolKirim.addEventListener("click", kirimDataPengguna);
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu Ingat Rumus `response.ok`**:
   `fetch()` hanya melempar error jaringan secara otomatis jika komputer mati sambungan atau URL sama sekali tidak ada di DNS. Jika server membalas `404 Not Found`, `fetch()` tidak melempar error! Maka dari itu, selalu pasang:
   ```javascript
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
