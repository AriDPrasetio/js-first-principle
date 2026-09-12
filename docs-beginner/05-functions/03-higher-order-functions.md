---
title: "Panduan Pemula: Higher-Order Functions (HOF) di JavaScript"
tags: "javascript, first-principles, roadmap-js/05-functions"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function"
---

# Panduan Pemula: Higher-Order Functions (HOF) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Higher-Order Function (HOF) adalah fungsi super:
>
> 1. **Menerima fungsi lain sebagai bahan masukan** (*Callback Function*).
> 2. **Menghasilkan fungsi baru sebagai keluarannya** (*Function Factory*).

---

## 1. Analogi Logis: Manajer Pabrik & Mesin Pencetak Stempel

### A. Tipe 1: HOF yang Menerima Callback (Manajer Pabrik)
Bayangkan seorang manajer di pabrik:
- **Manajer (HOF)**: Dia bertugas menjalankan ban berjalan, mengambil setiap barang satu per satu, lalu memanggil pekerja spesialis.
- **Pekerja Spesialis (Callback)**:
  - Pekerja A bertugas mewarnai barang jadi **Merah**.
  - Pekerja B bertugas menempelkan **Stiker Bintang**.
- Sang Manajer tidak perlu tahu cara mencampur cat. Manajer cukup menyediakan alurnya, lalu berkata: *"Pekerja, olah barang ini!"*.

---

### B. Tipe 2: HOF yang Menghasilkan Fungsi Baru (Pabrik Cetakan Stempel)
Bayangkan sebuah pabrik pembuat stempel:
- Anda memesan: *"Tolong buatkan saya stempel bertuliskan DISKON 20%"*.
- Pabrik membuat dan menyerahkan **alat stempel baru** ke tangan Anda.
- Mulai hari itu, Anda memegang fungsi stempel tersebut dan bisa mencapkannya ke ribuan lembar dokumen kapan saja.

```javascript
// HOF PENCETAK FUNGSI (FUNCTION FACTORY):
function buatPengali(faktor) {
  return function (angka) {
    return angka * faktor;
  };
}

const kaliDua = buatPengali(2); // Menghasilkan fungsi baru
console.log(kaliDua(10)); // 20
```

---

## 2. Mengapa JavaScript Didesain Seperti Ini? (First Principles)

1. **Fungsi Adalah Warga Kelas Satu (*First-Class Citizen*)**:
   Di JavaScript, fungsi tidak ada bedanya dengan angka atau string. Fungsi bisa disimpan ke variabel, dimasukkan ke array, dikirim sebagai argumen ke fungsi lain, atau dikembalikan dari sebuah fungsi.
2. **Kaidah *Don't Repeat Yourself* (DRY)**:
   Daripada Anda menulis perulangan `for` berkali-kali untuk mengubah huruf besar, lalu menulis perulangan `for` lagi untuk memotong angka, Anda cukup membuat 1 fungsi pengolah umum (HOF), dan menyuntikkan instruksi spesifiknya dari luar.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat pengolah daftar teks yang mendemonstrasikan kedua peran HOF: menerima callback dan mencetak fungsi baru:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Higher-Order Functions</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .btn-group {
        display: flex;
        gap: 6px;
        margin-top: 8px;
      }
      button {
        flex: 1;
        padding: 8px 4px;
        cursor: pointer;
        font-size: 0.8rem;
      }
      ul {
        margin: 12px 0 0 0;
        padding-left: 20px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Pengolah Data (HOF)</h3>
      <p>Daftar Nama: <strong>andi, kyo, budi</strong></p>

      <div class="btn-group">
        <button type="button" id="btn-kapital">Ubah Kapital (Callback)</button>
        <button type="button" id="btn-bintang">Beri Bintang (Callback)</button>
      </div>

      <button type="button" id="btn-diskon" style="width: 100%; margin-top: 8px; padding: 8px;">
        Hitung Diskon Toko (Function Factory)
      </button>

      <ul id="daftar-hasil"></ul>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
const namaPeserta = ["andi", "kyo", "budi"];
const listHasil = document.querySelector("#daftar-hasil");

// ========================================================
// 1. HOF TIPE 1: MENERIMA FUNGSI CALLBACK SEBAGAI BAHAN
// ========================================================
function prosesDaftar(deretData, fungsiPengubah) {
  const hasilBaru = [];
  for (const item of deretData) {
    // Jalankan fungsi callback yang disuntikkan dari luar:
    hasilBaru.push(fungsiPengubah(item));
  }
  return hasilBaru;
}

// Dua fungsi pekerja spesialis (Callback):
const jadikanKapital = (teks) => teks.toUpperCase();
const beriBintang = (teks) => `⭐ ${teks} ⭐`;

function tampilkanKeLayar(arrayData) {
  listHasil.innerHTML = "";
  for (const baris of arrayData) {
    const li = document.createElement("li");
    li.textContent = baris;
    listHasil.appendChild(li);
  }
}

document.querySelector("#btn-kapital").addEventListener("click", () => {
  const hasil = prosesDaftar(namaPeserta, jadikanKapital);
  tampilkanKeLayar(hasil);
});

document.querySelector("#btn-bintang").addEventListener("click", () => {
  const hasil = prosesDaftar(namaPeserta, beriBintang);
  tampilkanKeLayar(hasil);
});

// ========================================================
// 2. HOF TIPE 2: MENGHASILKAN FUNGSI BARU (FACTORY)
// ========================================================
function buatHitungDiskon(persenDiskon) {
  // Mengembalikan fungsi baru yang mengingat persenDiskon lewat closure:
  return function (hargaAsli) {
    return hargaAsli - (hargaAsli * persenDiskon);
  };
}

// Cetak fungsi spesialis diskon 25%:
const diskonMemberVip = buatHitungDiskon(0.25);

document.querySelector("#btn-diskon").addEventListener("click", () => {
  const harga100k = diskonMemberVip(100000);
  const harga200k = diskonMemberVip(200000);
  tampilkanKeLayar([
    `Harga Rp100.000 (Diskon 25%) -> Rp${harga100k.toLocaleString("id-ID")}`,
    `Harga Rp200.000 (Diskon 25%) -> Rp${harga200k.toLocaleString("id-ID")}`,
  ]);
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Kenali Pola HOF Bawaan JavaScript**: Metode array populer seperti `.map()`, `.filter()`, dan `.forEach()` yang akan kita pelajari di Bab 07 adalah contoh nyata dari Higher-Order Functions.
2. **Gunakan Function Factory untuk Konfigurasi Berulang**: Jika Anda memiliki rumus atau pengubah teks dengan aturan yang sama berkali-kali, cetak fungsinya menggunakan HOF factory daripada mengulang-ulang parameter konfigurasinya.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik tombol **"Ubah Kapital"** dan **"Beri Bintang"**. Amati bagaimana fungsi `prosesDaftar` bisa menghasilkan output berbeda hanya dengan mengganti fungsi callback.
- [ ] Klik tombol **"Hitung Diskon Toko"** dan perhatikan bagaimana fungsi hasil cetakan `buatHitungDiskon` bekerja mandiri.
- [ ] Buka Console (`F12`), coba buat pengali sederhana:
  ```javascript
  const cetakPengali = (n) => (x) => x * n;
  const kaliLima = cetakPengali(5);
  console.log(kaliLima(4)); // 20
  ```

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti bahwa fungsi di JavaScript bisa dikirim sebagai parameter ke fungsi lain, atau dikembalikan sebagai hasil akhir dari sebuah fungsi**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode berikut:

```javascript
function buatSapaan(kataAwal) {
  return function (namaTujuan) {
    return `${kataAwal}, ${namaTujuan}!`;
  };
}

const sapaPagi = buatSapaan("Selamat Pagi");
console.log(sapaPagi("Ari"));
```

1. Mengapa fungsi `buatSapaan` disebut sebagai *Higher-Order Function*?
2. Berapakah fungsi yang tercipta di dalam memori pada kode di atas?
```
