---
title: "Panduan Pemula: Membongkar Data (Destructuring) di JavaScript"
tags: "javascript, first-principles, roadmap-js/07-array-object-methods"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment"
---

# Panduan Pemula: Membongkar Data (Destructuring) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Destructuring (*Membongkar Paket*) adalah cara cepat untuk mengekstrak properti Objek atau elemen Array langsung ke dalam variabel masing-masing hanya dalam satu baris deklarasi.

---

## 1. Analogi Logis: Membongkar Kardus Belanjaan

Bayangkan Anda menerima paket kardus belanjaan:

- **Cara Tradisional (Repot & Bertele-tele)**:
  `const sabun = paket.sabun;`
  `const sampo = paket.sampo;`
- **Cara Destructuring (Cepat & Sekaligus)**:
  `const { sabun, sampo } = paket;`

Perbedaan Objek vs Array:
- **Pada Objek `{}`**: Pengambilan barang berdasarkan **NAMA KUNCI PROPERTI** (urutan tidak penting).
- **Pada Array `[]`**: Pengambilan barang berdasarkan **NOMOR URUT POSISI** (elemen ke-0, ke-1, ke-2).

---

## 2. Mengapa JavaScript Menyediakan Sintaks Ini? (First Principles)

### A. Aturan Ketat Nilai Cadangan (*Default Values*)

> [!IMPORTANT]
> **Spesifikasi ECMA-262**:
> Nilai cadangan (*default value*) pada destructuring **HANYA aktif jika datanya bernilai strictly `=== undefined`**.
> Jika server mengirimkan `{ hobi: null }` atau `{ hobi: "" }`, nilai cadangan **TIDAK AKAN AKTIF**, dan variabel akan tetap menampung `null` atau `""`!

```javascript
// 1. Buat objek pengguna pertama dengan hobi kosong
const userA = { hobi: undefined };
// 2. Bongkar properti hobi dengan nilai cadangan jika kosong
const { hobi = "Membaca" } = userA;
// 3. Cetak nilai hobi yang berhasil diambil
// Catatan*: Nilai cadangan dipakai karena data asli adalah undefined
console.log(hobi); // "Membaca"

// 4. Buat objek pengguna kedua dengan hobi null
const userB = { hobi: null };
// 5. Bongkar properti hobi dan ganti nama variabel dengan nilai cadangan
const { hobi: hobiB = "Membaca" } = userB;
// 6. Cetak nilai hobiB
// Catatan*: Nilai cadangan tidak dipakai karena null dianggap ada isinya
console.log(hobiB); // null
```

### B. Mengganti Nama Variabel (*Aliasing*)
Di dalam objek biasa, tanda titik dua `{ key: value }` berarti menetapkan nilai. Namun di dalam destructuring, tanda titik dua bermakna **mengganti nama variabel**:
```javascript
// 1. Ambil nilai dari properti nama_lengkap lalu simpan ke variabel baru
const { nama_lengkap: namaPanggilan } = data;
```

### C. Trik Menukar Nilai Tanpa Variabel Sementara
Dengan Array Destructuring, Anda bisa menukar isi dua variabel dengan sangat elegan:
```javascript
// 1. Buat dua variabel dengan nilai masing-masing
let a = 1;
let b = 2;
// 2. Tukar posisi nilai kedua variabel tanpa perantara
[a, b] = [b, a];
```

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
// 1. Buat objek berisi data profil pengguna
const dataPengguna = {
  id: 101,
  nama_lengkap: "Siti Rahayu",
  kotaAsal: "Surabaya",
  // properti hobi sengaja tidak diisi (undefined) untuk menguji nilai cadangan
};

// 2. Buat array berisi daftar pemenang lomba
const daftarPemenangLomba = ["Emas: Budi", "Perak: Siti", "Perunggu: Doni"];

// 3. Ambil elemen tombol dari halaman HTML
const tombolBongkar = document.querySelector("#btn-bongkar");
// 4. Ambil elemen kotak profil dari halaman HTML
const kotakProfil = document.querySelector("#kotak-profil");

// 5. Pasang pemantau klik pada tombol bongkar
tombolBongkar.addEventListener("click", () => {
  // 6. Bongkar data dari objek pengguna sekaligus pasang nilai cadangan
  // Catatan*: Tanda titik dua digunakan untuk mengganti nama variabel, bukan mengisi nilai.
  const {
    nama_lengkap: namaPanggilan,
    kotaAsal,
    hobi = "Membaca Buku",
  } = dataPengguna;

  // 7. Ambil juara satu dan dua dari array pemenang
  // Catatan*: Pada array, urutan posisi menentukan urutan pengambilan data.
  const [
    juaraSatu,
    juaraDua
  ] = daftarPemenangLomba;

  // 8. Tampilkan gabungan data ke layar dalam bentuk teks
  kotakProfil.innerHTML = `
    <p><strong>Nama:</strong> ${namaPanggilan}</p>
    <p><strong>Kota:</strong> ${kotaAsal}</p>
    <p><strong>Hobi:</strong> ${hobi} <em>(Aktif karena hobi === undefined)</em></p>
    <hr>
    <p><strong>Juara 1:</strong> ${juaraSatu}</p>
    <p><strong>Juara 2:</strong> ${juaraDua}</p>
  `;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Destructuring Parameter Fungsi**:
   Di ekosistem modern (seperti komponen React), Anda bisa langsung membongkar objek parameter di dalam tanda kurung fungsi:
   ```javascript
   // 1. Buat fungsi yang langsung membongkar data pada bagian parameter
   function sapaPengguna({ nama, role = "User" } = {}) {
     // 2. Cetak pesan ke layar dengan data yang sudah dibongkar
     console.log(`Halo ${nama}, peran: ${role}`);
   }
   // 3. Jalankan fungsi dengan data objek
   sapaPengguna({ nama: "Ari" }); // "Halo Ari, peran: User"
   ```
2. **Benteng Pertahanan `= {}`**:
   Jika fungsi menerima objek opsional, selalu beri nilai default `= {}` di akhir tanda kurung agar tidak melempar `TypeError: Cannot destructure property of undefined` saat dipanggil tanpa argumen.
3. **Melewatkan Elemen Array**: Gunakan koma kosong untuk melompati indeks: `const [pertama, , ketiga] = array;`.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik tombol **"Bongkar Data Paket"**.
- [ ] Perhatikan bahwa `namaPanggilan` berhasil menampung `nama_lengkap`, dan hobi otomatis terisi `"Membaca Buku"`.
- [ ] Buka Console (`F12`), coba uji coba bukti `undefined` vs `null`:
  ```javascript
  // 1. Bongkar data yang kosong untuk memicu nilai cadangan
  const { x = "Cadangan" } = { x: undefined };
  // 2. Cetak nilai cadangan ke layar
  console.log(x); // "Cadangan"

  // 3. Bongkar data yang berisi null
  const { y = "Cadangan" } = { y: null };
  // 4. Cetak nilai asli tanpa memicu cadangan
  console.log(y); // null
  ```

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu bahwa `{}` membongkar berdasarkan nama properti dan `[]` berdasarkan urutan posisi, serta mengerti bahwa default value hanya aktif saat data bernilai `undefined`**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apakah urutan penulisan nama variabel berpengaruh pada Object Destructuring `{ kota, nama } = profil`? Bagaimana dengan Array Destructuring `[ kota, nama ] = list`?
2. Perhatikan kode berikut:
   ```javascript
   // 1. Buat data objek dengan usia kosong
   const data = { usia: null };
   // 2. Bongkar usia dengan nilai cadangan 
   const { usia = 20 } = data;
   ```
   Berapakah nilai variabel `usia` setelah baris di atas dijalankan? Mengapa bukan `20`?
```
