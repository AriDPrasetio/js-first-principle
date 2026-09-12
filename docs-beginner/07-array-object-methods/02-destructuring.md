---
title: "Panduan Pemula: Membongkar Data (Destructuring) di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/07-array-object-methods
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
---

# Panduan Pemula: Membongkar Data (Destructuring) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Destructuring (_Membongkar Paket_) adalah cara cepat dan elegan untuk mengeluarkan isi properti Objek atau elemen Array ke dalam variabel masing-masing hanya dalam satu baris kode.

---

## 1. Analogi Logis: Membongkar Kardus Belanjaan

Bayangkan Anda menerima paket kardus belanjaan dari kurir:

- **Cara Tradisional (Repot & Bertele-tele)**:
  Anda membuka kardus, lalu menulis satu per satu di kertas:
  `const sabun = paket.sabun;`
  `const sampo = paket.sampo;`
  `const handuk = paket.handuk;`
- **Cara Destructuring (Cepat & Sekaligus)**:
  Anda langsung mengambil barang yang Anda inginkan dari kardus dalam sekali gerak:
  `const { sabun, sampo, handuk } = paket;`

Perbedaan Objek vs Array:

- **Pada Objek `{}`**: Pengambilan barang berdasarkan **NAMA PROPERTI** (urutan tidak penting).
- **Pada Array `[]`**: Pengambilan barang berdasarkan **URUTAN POSISI** (elemen ke-1, ke-2, ke-3).

---

## 2. Mengapa JavaScript Menyediakan Sintaks Ini? (First Principles)

1. **Mengurangi Kesalahan Ketik pada Data Server**:
   Saat mengambil data pengguna dari internet, data biasanya berbentuk objek besar bertingkat. Mengetik `user.alamat.kota`, `user.alamat.kodePos` berulang kali sangat melelahkan dan mudah salah ketik.
2. **Memberi Nama Baru (Alias) & Nilai Cadangan**:
   Jika server mengirim nama kunci yang jelek seperti `usr_nm`, Anda bisa langsung menggantinya: `{ usr_nm: namaUser }`. Dan jika server tidak mengirimkan data foto, Anda bisa langsung memberi cadangan: `{ foto = "default.png" }`.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat pembaca data akun pengguna yang mendemonstrasikan Destructuring Objek dan Array:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Destructuring Data</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 350px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      button {
        padding: 8px 12px;
        cursor: pointer;
        width: 100%;
        margin-bottom: 12px;
      }
      .profil {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 12px;
        border-radius: 6px;
      }
      p {
        margin: 6px 0;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Data Akun Pengguna</h3>
      <button type="button" id="btn-bongkar">
        Bongkar Data Paket (Destructuring)
      </button>
      <div id="kotak-profil" class="profil">
        Klik tombol untuk membongkar data...
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Contoh data paket dari server (Objek dan Array)
const dataPengguna = {
  id: 101,
  nama_lengkap: "Siti Rahayu",
  kotaAsal: "Surabaya",
  // properti hobi sengaja tidak ada untuk menguji nilai cadangan (default)
};

const daftarPemenangLomba = ["Emas: Budi", "Perak: Siti", "Perunggu: Doni"];

const tombolBongkar = document.querySelector("#btn-bongkar");
// ambil tombol dari HTML.

const kotakProfil = document.querySelector("#kotak-profil");
// ambil wadah tampilan profil.

// 2. Pasang aksi pembongkaran saat tombol diklik
tombolBongkar.addEventListener("click", () => {
  // ================================================================
  // 1. OBJECT DESTRUCTURING (Bongkar Objek Berdasarkan Nama Properti)
  // - nama_lengkap: namaPanggilan -> mengganti nama kunci jadi lebih ramah
  // - hobi = "Membaca Buku"       -> nilai cadangan jika data dari server kosong
  // ================================================================
  const {
    nama_lengkap: namaPanggilan,
    kotaAsal,
    hobi = "Membaca Buku",
  } = dataPengguna;

  // ================================================================
  // 2. ARRAY DESTRUCTURING (Bongkar Array Berdasarkan Urutan Posisi)
  // - juaraSatu mengambil elemen indeks ke-0
  // - juaraDua mengambil elemen indeks ke-1
  // ================================================================
  const [juaraSatu, juaraDua] = daftarPemenangLomba;

  // Tampilkan hasil pembongkaran ke halaman HTML:
  kotakProfil.innerHTML = `
    <p><strong>Nama:</strong> ${namaPanggilan}</p>
    <p><strong>Kota:</strong> ${kotaAsal}</p>
    <p><strong>Hobi:</strong> ${hobi} <em>(Nilai Cadangan)</em></p>
    <hr>
    <p><strong>Juara 1:</strong> ${juaraSatu}</p>
    <p><strong>Juara 2:</strong> ${juaraDua}</p>
  `;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Waspada Pembongkaran Data Kosong (`null`/`undefined`)**:
   Jika Anda melakukan `const { nama } = data` tetapi variabel `data` bernilai `null` atau `undefined`, browser akan melempar error merah fatal (_TypeError_). Solusinya, selalu pasang benteng pertahanan `= {}`:
   ```javascript
   function tampilkanUser({ nama, umur } = {}) {
     // aman dijalankan meskipun fungsi dipanggil tanpa parameter sama sekali!
   }
   ```
2. **Melewatkan Elemen Array**:
   Jika hanya butuh elemen ke-1 dan ke-3 pada array, cukup gunakan tanda koma kosong:
   `const [pertama, , ketiga] = array;`

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik tombol **"Bongkar Data Paket"**.
- [ ] Perhatikan bahwa data nama panggilan berhasil diganti dari `nama_lengkap`, dan hobi otomatis terisi `"Membaca Buku"` meskipun di objek aslinya tidak ada.
- [ ] Perhatikan bagaimana `juaraSatu` dan `juaraDua` berhasil mengambil posisi 1 dan 2 dari array lomba.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu bahwa `{ a, b }` membongkar objek berdasarkan nama kunci, sedangkan `[ x, y ]` membongkar array berdasarkan nomor urut**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apakah urutan penulisan nama variabel berpengaruh saat Anda melakukan _Object Destructuring_ `{ kota, nama } = data`? Bagaimana dengan _Array Destructuring_?
2. Apa yang akan terjadi jika Anda mencoba membongkar properti dari variabel yang bernilai `null` (`const { email } = null;`)?
