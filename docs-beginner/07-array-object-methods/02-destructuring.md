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
const userA = { hobi: undefined };
const { hobi = "Membaca" } = userA;
console.log(hobi); // "Membaca" (Default aktif karena undefined!)

const userB = { hobi: null };
const { hobi: hobiB = "Membaca" } = userB;
console.log(hobiB); // null (Default TIDAK aktif karena null dianggap nilai sah!)
```

### B. Mengganti Nama Variabel (*Aliasing*)
Di dalam objek biasa, tanda titik dua `{ key: value }` berarti menetapkan nilai. Namun di dalam destructuring, tanda titik dua bermakna **mengganti nama variabel**:
```javascript
const { nama_lengkap: namaPanggilan } = data;
// Baca properti 'nama_lengkap', simpan ke variabel baru bernama 'namaPanggilan'
```

### C. Trik Menukar Nilai Tanpa Variabel Sementara
Dengan Array Destructuring, Anda bisa menukar isi dua variabel dengan sangat elegan:
```javascript
let a = 1;
let b = 2;
// Tukar isi variabel secara instan: nilai a jadi 2, nilai b jadi 1
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
// simpan object berisi data pengguna ke dalam variable dataPengguna
const dataPengguna = {
  // simpan number 101 ke property id
  id: 101,
  // simpan string "Siti Rahayu" ke property nama_lengkap
  nama_lengkap: "Siti Rahayu",
  // simpan string "Surabaya" ke property kotaAsal
  kotaAsal: "Surabaya",
  // properti hobi tidak didefinisikan (undefined) untuk menguji default value
};

// simpan array berisi daftar pemenang ke dalam variable daftarPemenangLomba
const daftarPemenangLomba = ["Emas: Budi", "Perak: Siti", "Perunggu: Doni"];

// ambil element button bongkar berdasarkan ID-nya, simpan ke variable tombolBongkar
const tombolBongkar = document.querySelector("#btn-bongkar");
// ambil element kotak profil berdasarkan ID-nya, simpan ke variable kotakProfil
const kotakProfil = document.querySelector("#kotak-profil");

// saat tombolBongkar di-click, jalankan function berikut:
tombolBongkar.addEventListener("click", () => {
  // 1. OBJECT DESTRUCTURING:
  // - nama_lengkap: namaPanggilan -> alias nama variabel baru
  // - hobi = "Membaca Buku"       -> nilai cadangan hanya jika undefined
  // bongkar properti nama_lengkap, kotaAsal, dan hobi dari dataPengguna ke dalam variable baru
  const {
    // ambil nilai nama_lengkap dari object dan simpan ke variable namaPanggilan
    nama_lengkap: namaPanggilan,
    // ambil nilai kotaAsal dari object dan simpan ke variable kotaAsal
    kotaAsal,
    // ambil nilai hobi dari object dan simpan ke variable hobi dengan fallback
    hobi = "Membaca Buku",
  } = dataPengguna;

  // 2. ARRAY DESTRUCTURING:
  // mengambil posisi indeks ke-0 dan indeks ke-1
  // bongkar elemen pertama dan kedua dari daftarPemenangLomba ke dalam variable juaraSatu dan juaraDua
  const [
    // ambil elemen ke-0 dari array dan simpan ke variable juaraSatu
    juaraSatu, 
    // ambil elemen ke-1 dari array dan simpan ke variable juaraDua
    juaraDua
  ] = daftarPemenangLomba;

  // ubah properti innerHTML pada element kotakProfil menjadi string HTML yang berisi data hasil destructuring
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
   function sapaPengguna({ nama, role = "User" } = {}) {
     console.log(`Halo ${nama}, peran: ${role}`);
   }
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
  const { x = "Cadangan" } = { x: undefined };
  console.log(x); // "Cadangan"
  const { y = "Cadangan" } = { y: null };
  console.log(y); // null! (tidak diganti cadangan)
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
   const data = { usia: null };
   const { usia = 20 } = data;
   ```
   Berapakah nilai variabel `usia` setelah baris di atas dijalankan? Mengapa bukan `20`?
```
