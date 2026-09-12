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
> Perintah **`fetch()`** adalah kurir internet browser Anda: ia pergi ke alamat URL server, mengambil amplop respons, lalu membongkar isi teks format **JSON** di dalamnya menjadi objek JavaScript yang siap ditampilkan ke halaman web.

---

## 1. Analogi Logis: Kurir Paket Amplop Surat

Bayangkan Anda memesan surat kabar dari kota lain:

1. **`fetch(url)` (Kurir Berangkat & Membawa Amplop)**:
   Kurir pergi ke alamat penerbit, lalu kembali membawa amplop tertutup ke tangan Anda. Anda bisa melihat stempel di luar amplop: _"Status: 200 OK (Surat Ditemukan)"_.
2. **`response.json()` (Membuka & Membaca Isi Surat)**:
   Anda menyobek amplop dan membaca tulisan di dalamnya. Karena surat ditulis dalam format standar universal (**JSON**), browser menerjemahkannya menjadi data objek `{ nama: "...", umur: 25 }`.

---

## 2. Mengapa Butuh Dua Kali `await`? (First Principles)

Banyak pemula bertanya: _"Mengapa kita harus menulis `await` sebanyak dua kali?"_:

1. **`await fetch(url)` (Langkah 1: Menunggu Sambungan Jaringan)**:
   Browser baru selesai menyambungkan koneksi ke server dan menerima stempel kepala (_header HTTP_). Isi badan datanya belum selesai dibaca semua.
2. **`await response.json()` (Langkah 2: Menunggu Pembacaan Aliran Teks)**:
   Data yang dikirim server mengalir sedikit demi sedikit lewat kabel jaringan (_stream_). Langkah kedua ini menunggu seluruh aliran data teks selesai dibaca dan diubah menjadi objek JavaScript murni di memori.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kartu penampil pengguna yang mengambil data profil secara langsung dari server internet gratis (_JSONPlaceholder API_):

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
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      button {
        padding: 10px;
        cursor: pointer;
        width: 100%;
        margin-bottom: 12px;
        background: #0284c7;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: bold;
      }
      .box-data {
        padding: 12px;
        border-radius: 6px;
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #166534;
      }
      .box-data p {
        margin: 4px 0;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Data Pengguna dari Server API</h3>
      <button type="button" id="btn-ambil">Ambil Data Pengguna (fetch)</button>
      <div id="wadah-pengguna" class="box-data">
        Klik tombol untuk meminta data ke server...
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen dari HTML
const tombolAmbil = document.querySelector("#btn-ambil");
// ambil tombol untuk memulai permintaan data.

const wadahPengguna = document.querySelector("#wadah-pengguna");
// ambil wadah untuk menampilkan data yang berhasil diambil.

// ================================================================
// FUNGSI ASYNC UNTUK MENGAMBIL DATA MENGGUNAKAN FETCH
// ================================================================
async function ambilDataUser() {
  // Beri tahu pengguna bahwa permintaan sedang berlangsung:
  wadahPengguna.textContent = "⏳ Kurir sedang mengambil data ke server...";
  tombolAmbil.disabled = true;

  try {
    // LANGKAH 1: Kirim permintaan ke server API publik
    const responServer = await fetch(
      "https://jsonplaceholder.typicode.com/users/1",
    );
    // browser menunggu sambungan jaringan ke server.

    // Periksa apakah server merespons dengan selamat (status 200 OK):
    if (!responServer.ok) {
      throw new Error(`Server bermasalah (Kode: ${responServer.status})`);
    }

    // LANGKAH 2: Terjemahkan teks JSON menjadi Objek JavaScript asli
    const dataUser = await responServer.json();
    // browser menunggu seluruh teks JSON diubah menjadi objek JavaScript murni.

    // LANGKAH 3: Tampilkan data yang sudah menjadi objek ke layar HTML
    wadahPengguna.innerHTML = `
      <p><strong>Nama:</strong> ${dataUser.name}</p>
      <p><strong>Email:</strong> ${dataUser.email}</p>
      <p><strong>Kota:</strong> ${dataUser.address.city}</p>
      <p><strong>Perusahaan:</strong> ${dataUser.company.name}</p>
    `;
  } catch (error) {
    // Tangkap jika internet putus atau alamat salah:
    wadahPengguna.textContent = `❌ Terjadi kesalahan: ${error.message}`;
  } finally {
    // Aktifkan kembali tombol di akhir proses:
    tombolAmbil.disabled = false;
  }
}

// 2. Hubungkan aksi klik tombol dengan fungsi fetch
tombolAmbil.addEventListener("click", ambilDataUser);
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu periksa `response.ok`**:
   Jika server mengembalikan status 404 (Halaman Tidak Ditemukan) atau 500 (Server Rusak), perintah `fetch()` **tidak akan melempar error otomatis!** Anda wajib memeriksa `if (!response.ok)` secara manual untuk melempar error.
2. **`JSON.stringify()` vs `JSON.parse()`**:
   - Objek JS $\to$ Teks JSON: Gunakan `JSON.stringify(objek)`.
   - Teks JSON $\to$ Objek JS: Gunakan `JSON.parse(teksJSON)` atau `await response.json()`.
3. **Stream Hanya Bisa Dibaca Satu Kali**:
   Jangan memanggil `response.json()` lalu memanggil `response.text()` pada respons yang sama, karena aliran data amplop hanya bisa dibaca sekali.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser (pastikan komputer terhubung ke internet).
- [ ] Klik tombol **"Ambil Data Pengguna (fetch)"**.
- [ ] Amati pesan teks sejenak berubah menjadi `"⏳ Kurir sedang mengambil data..."`.
- [ ] Amati data asli Leanne Graham dari server internet muncul lengkap dengan email dan kota asalnya.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu bahwa `fetch()` digunakan untuk mengambil data dari internet dan butuh dua langkah: `await fetch()` untuk sambungan, lalu `await response.json()` untuk membuka isi teksnya**.

---

## 🎯 Uji Pemahaman Mandiri

1. Mengapa kita memerlukan dua kali kata kunci `await` saat mengambil data JSON dari server menggunakan `fetch()`?
2. Jika sebuah server mengembalikan kode status `404 Not Found`, apakah baris `await fetch()` akan langsung melempar error ke blok `catch` secara otomatis?
