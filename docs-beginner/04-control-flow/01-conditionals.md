---
title: "Panduan Pemula: Percabangan Kondisional (if/else, switch, ??) di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/04-control-flow
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
---

# Panduan Pemula: Percabangan Kondisional (if/else, switch, ??) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Percabangan adalah "rambu persimpangan jalan" di program Anda: komputer mengecek kondisi benar (_true_) atau salah (_false_), lalu memutuskan jalur kode mana yang harus dilewati selanjutnya.

---

## 1. Analogi Logis: Palang Pintu Otomatis Parkir

Bayangkan palang pintu otomatis di gedung parkir:

- **Jika (`if`)** tiket parkir Anda sudah dibayar lunas $\to$ palang pintu terangkat dan lampu hijau menyala.
- **Selain itu (`else`)** $\to$ palang pintu tetap tertutup rapat dan alarm berbunyi.

Komputer tidak memiliki perasaan; ia hanya mengevaluasi satu hal: **apakah syarat di dalam kurung bernilai benar (_truthy_) atau salah (_falsy_)?**

---

## 2. Mengapa Pemula Wajib Tahu Operator `??`? (First Principles)

Sering kali kita ingin memberikan **nilai cadangan (_default_)** jika pengguna tidak mengisi sesuatu:

- Dulu, orang sering memakai operator `||` (OR), contoh: `let kuantitas = input || 1`.
- **Masalah Fatal**: Di JavaScript, angka `0` dianggap bernilai salah (_falsy_). Jika pengguna sengaja mengetik angka `0` (misal memesan 0 barang), operator `||` keliru menganggap data itu tidak ada dan menimpanya menjadi `1`!
- **Solusi Modern (`??`)**: Operator _Nullish Coalescing_ (`??`) jauh lebih cerdas. Ia HANYA mengganti nilai jika datanya benar-benar kosong melompong (`null` atau `undefined`). Angka `0` dan boolean `false` tetap dihormati dan tidak akan ditimpa!

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kalkulator diskon kupon belanja:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Percabangan Kondisional</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 320px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      input,
      button {
        padding: 8px;
        margin-top: 6px;
        width: 100%;
        box-sizing: border-box;
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
      <h3>Pembayaran Belanja</h3>
      <p>Total Belanja: <strong>Rp100.000</strong></p>

      <label for="input-kupon">Kode Kupon (Coba: HEMAT):</label>
      <input type="text" id="input-kupon" placeholder="Masukkan kupon..." />

      <button type="button" id="btn-proses">Hitung Potongan</button>

      <div class="hasil-box">
        <p id="pesan-status">Status: Belum dihitung</p>
        <p>Total Akhir: <strong id="total-akhir">Rp100.000</strong></p>
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Data harga awal
const hargaAwal = 100000;
// simpan harga dasar belanjaan Rp100.000.

const inputKupon = document.querySelector("#input-kupon");
// ambil kotak input teks kupon dari layar.

const prosesBtn = document.querySelector("#btn-proses");
// ambil tombol hitung potongan dari layar.

const pesanStatusEl = document.querySelector("#pesan-status");
// ambil elemen teks status dari layar.

const totalAkhirEl = document.querySelector("#total-akhir");
// ambil elemen teks total akhir dari layar.

// 2. Pasang aksi ketika tombol di-klik
prosesBtn.addEventListener("click", () => {
  // saat tombol diklik, jalankan pemeriksaan kupon:

  const kodeKupon = inputKupon.value.trim().toUpperCase();
  // ambil teks kupon, bersihkan spasi, dan jadikan huruf kapital.

  let persentaseDiskon = 0;
  // siapkan variabel penampung diskon, mula-mula 0%.

  // PERCABANGAN KONDISIONAL DENGAN IF / ELSE:
  if (kodeKupon === "HEMAT") {
    // jika kupon persis sama dengan kata 'HEMAT':
    persentaseDiskon = 0.2; // dapat diskon 20%
    pesanStatusEl.textContent = "Kupon HEMAT aktif! Diskon 20% diberikan.";
    pesanStatusEl.style.color = "green";
  } else if (kodeKupon === "") {
    // jika pengguna tidak mengetik kupon apa pun:
    pesanStatusEl.textContent = "Tidak ada kupon yang digunakan.";
    pesanStatusEl.style.color = "#555";
  } else {
    // jika kupon yang diketik salah atau tidak terdaftar:
    pesanStatusEl.textContent = "Kupon tidak valid atau sudah kedaluwarsa!";
    pesanStatusEl.style.color = "red";
  }

  // Hitung harga akhir:
  const potongan = hargaAwal * persentaseDiskon;
  const bayarAkhir = hargaAwal - potongan;

  totalAkhirEl.textContent = `Rp${bayarAkhir.toLocaleString("id-ID")}`;
  // tampilkan total pembayaran akhir berformat rupiah ke layar.
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan Guard Clauses (Pengecekan Dini)**: Jika kondisi salah, langsung hentikan fungsi di awal menggunakan kata kunci `return` agar kode Anda tidak bertingkat-tingkat terlalu dalam (_Pyramid of Doom_).
2. **Gunakan `??` untuk Nilai Bawaan**: Contoh: `const delay = opsi.delay ?? 300;` agar angka `0` tidak rusak.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Ketik kata `HEMAT` di kotak kupon dan klik tombol, perhatikan harga berubah menjadi Rp80.000.
- [ ] Kosongkan kotak kupon dan klik tombol lagi, perhatikan harga kembali Rp100.000.
- [ ] Ketik kata sembarang (misal: `DISKON100`) dan lihat peringatan warna merah bahwa kupon tidak valid.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mampu membuat percabangan `if`, `else if`, dan `else` untuk mengatur alur logika berbeda di aplikasi Anda**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode ini:

```javascript
let nilaiPengguna = 0;
let hasilA = nilaiPengguna || 10;
let hasilB = nilaiPengguna ?? 10;

// Pertanyaan:
// 1. Berapakah hasilA? Apakah 0 atau 10?
// 2. Berapakah hasilB? Apakah 0 atau 10?
```
