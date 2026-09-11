---
title: "Panduan Pemula: Operator typeof di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/02-syntax-datatypes
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
---

# Panduan Pemula: Operator typeof di JavaScript

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> Operator `typeof` adalah alat pemindai cepat (_scanner_) bawaan JavaScript yang membaca sebuah nilai dan memberi tahu Anda kategori tipe datanya dalam bentuk teks (seperti `"string"`, `"number"`, atau `"object"`).

---

## 1. Analogi Logis: Pemindai Barcode di Kasir Supermarket

Bayangkan Anda bekerja sebagai kasir di supermarket.

- Di kasir ada alat pemindai (_barcode scanner_).
- Saat Anda memindai sebotol susu, layar kasir memunculkan kategori: `"Minuman"`.
- Saat Anda memindai sebungkus apel, layar kasir memunculkan kategori: `"Buah"`.

Operator `typeof` bekerja persis seperti alat pemindai tersebut:
Anda memberikan nilai apa pun ke `typeof`, dan ia akan menjawab dengan nama kategori datanya.

---

## 2. Mengapa Pemula Membutuhkan `typeof`? (First Principles)

Di JavaScript, sebuah variabel bisa menampung nilai apa saja secara bebas: sekarang angka, besok teks.

Namun di aplikasi nyata, sering kali kita harus memastikan jenis datanya terlebih dahulu sebelum melakukan kalkulasi:

1. **Fakta Kritis Frontend**: Ketika pengguna mengetik angka di form HTML (meskipun tag HTML bertuliskan `<input type="number">`), browser **SELALU membaca nilai tersebut sebagai teks (`string`)**!
2. Jika Anda tidak mengecek tipenya, operasi penjumlahan angka bisa keliru menjadi penggabungan teks (misal: `10 + 5` malah jadi `"105"`).
3. **Anomali Unik `typeof null`**: Ada satu keanehan sejarah di JavaScript sejak tahun 1995: jika Anda mengecek `typeof null`, komputer menjawab `"object"` (seperti salah cetak label dari pabrik). Jangan kaget, ini adalah bug historis resmi yang sengaja dipertahankan agar website-website lama di dunia tidak rusak.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat pendeteksi tipe data input formulir:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Operator typeof</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 340px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      input,
      button {
        padding: 8px;
        margin-top: 8px;
      }
      .hasil-box {
        margin-top: 12px;
        padding: 8px;
        background: #f4f4f4;
        border-radius: 4px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Pendeteksi Tipe Data Input</h3>
      <label for="input-usia">Masukkan Usia Anda:</label>
      <input type="number" id="input-usia" value="25" />

      <button type="button" id="btn-cek">Cek Tipe Data via typeof</button>

      <div class="hasil-box">
        <p>Nilai: <strong id="nilai-output">-</strong></p>
        <p>Tipe Asli dari Input: <strong id="tipe-output">-</strong></p>
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen HTML yang dibutuhkan
const usiaInput = document.querySelector("#input-usia");
// ambil elemen kotak isian input dengan ID 'input-usia', simpan ke wadah usiaInput.

const cekBtn = document.querySelector("#btn-cek");
// ambil elemen tombol dengan ID 'btn-cek', simpan ke wadah cekBtn.

const nilaiOut = document.querySelector("#nilai-output");
// ambil elemen penampil nilai dengan ID 'nilai-output', simpan ke wadah nilaiOut.

const tipeOut = document.querySelector("#tipe-output");
// ambil elemen penampil tipe dengan ID 'tipe-output', simpan ke wadah tipeOut.

// 2. Pasang aksi ketika tombol diklik
cekBtn.addEventListener("click", () => {
  // saat tombol diklik, jalankan fungsi berikut:

  const nilaiMentah = usiaInput.value;
  // baca nilai yang sedang tertulis di kotak input (meskipun input bertipe number, hasilnya selalu string!).

  const hasilTipe = typeof nilaiMentah;
  // gunakan operator typeof untuk memindai tipe data dari variabel nilaiMentah.

  nilaiOut.textContent = `"${nilaiMentah}"`;
  // tampilkan nilai mentah ke layar dengan tanda petik agar terlihat bahwa ini teks.

  tipeOut.textContent = hasilTipe;
  // tampilkan hasil deteksi typeof ke layar (akan memunculkan kata 'string').

  tipeOut.style.color = "red";
  // beri warna merah sebagai bukti visual bahwa input HTML masih berupa string teks.
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan `Array.isArray(data)` untuk mengecek Array**: Operator `typeof [1, 2, 3]` menghasilkan `"object"`. Untuk memastikan data tersebut adalah array sejati, gunakan `Array.isArray(data)`.
2. **Cek `null` secara terpisah**: Jangan gunakan `typeof data === 'object'` untuk mengecek objek jika data bisa bernilai `null`. Selalu cek `data !== null` terlebih dahulu.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik tombol **"Cek Tipe Data"**.
- [ ] Perhatikan bahwa meskipun inputnya angka `25`, `typeof` tetap menjawab `"string"`.
- [ ] Buka Console browser (`F12`), ketik `typeof null` dan lihat hasilnya `"object"`.
- [ ] Ketik `Array.isArray([1, 2, 3])` di Console dan lihat hasilnya `true`.

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Menyadari bahwa seluruh nilai dari input HTML form selalu dibaca sebagai teks (`string`), dan tahu cara mengeceknya memakai `typeof`**.

---

## 🎯 Uji Pemahaman Mandiri

Tebak apa hasil keluaran dari perintah berikut:

```javascript
let nama = "Budi";
let jumlah = 10;
let isActive = true;

// Pertanyaan:
// 1. Apakah hasil dari typeof nama?
// 2. Apakah hasil dari typeof jumlah?
// 3. Apakah hasil dari typeof isActive?
```
