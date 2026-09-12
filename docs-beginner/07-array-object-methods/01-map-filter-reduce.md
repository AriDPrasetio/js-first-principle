---
title: "Panduan Pemula: Mengolah Array dengan map, filter, dan reduce di JavaScript"
tags: "javascript, first-principles, roadmap-js/07-array-object-methods"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map"
---

# Panduan Pemula: Mengolah Array dengan map, filter, dan reduce di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Tiga sekawan pemroses data ini memudahkan Anda mengolah daftar: **`map`** mengubah bentuk setiap barang satu per satu, **`filter`** membuang barang yang tidak lolos syarat, dan **`reduce`** menggabungkan seluruh barang menjadi satu nilai akhir.

---

## 1. Analogi Logis: Dapur Restoran Burger

Bayangkan Anda bekerja di dapur restoran cepat saji dengan sekeranjang bahan:

- **`map` (Mengubah Bentuk 1-ke-1)**:
  Anda punya 3 potong daging sapi mentah. Anda memanggang ketiganya. Hasilnya adalah 3 potong daging sapi matang.
  _(3 bahan masuk $\to$ 3 bahan keluar. Jumlahnya selalu sama, tapi penampilannya berubah)._
- **`filter` (Menyaring dengan Saringan Halus)**:
  Dari sekeranjang kentang, Anda hanya memilih kentang yang ukurannya besar dan membuang kentang busuk.
  _(Hanya yang memenuhi syarat boleh lewat. Jumlah hasil bisa berkurang)._
- **`reduce` (Menyusutkan Banyak Benda Jadi Satu)**:
  Kasir mengumpulkan semua struk belanja dari pagi sampai malam, lalu menjumlahkan semua uangnya menjadi **SATU** angka total pendapatan hari ini.
  _(Banyak barang masuk $\to$ 1 hasil akhir)._

---

## 2. Mengapa JavaScript Menyediakan Ketiganya? (First Principles)

1. **Array Asli Tidak Pernah Dirusak (Immutability)**:
   Saat Anda memakai `.map()` atau `.filter()`, JavaScript membuat lembaran array baru di memori. Data asli Anda tetap aman dan tidak berubah secara tidak sengaja.
2. **Menghapus Kerumitan Loop Manual**:
   Daripada menulis variabel penampung kosong `let hasil = []` lalu membuat loop `for (let i = 0; ...)` yang panjang, Anda cukup menyebutkan niat Anda dengan satu kata kerja yang jelas: _"Tolong petakan (map) daftar harga ini ke format rupiah!"_.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kasir mini toko buah yang mempraktekkan `map`, `filter`, dan `reduce`:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | map, filter, dan reduce</title>
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
        flex-direction: column;
        gap: 6px;
        margin-bottom: 12px;
      }
      button {
        padding: 8px;
        font-size: 0.85rem;
        cursor: pointer;
      }
      ul {
        padding-left: 20px;
        margin: 4px 0 10px 0;
      }
      .kotak-hasil {
        padding: 10px;
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        border-radius: 4px;
        font-weight: bold;
        color: #166534;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Kasir Toko Buah Segar</h3>
      <p>Daftar Barang Asli:</p>
      <ul>
        <li>Apel: Rp 15.000</li>
        <li>Jeruk: Rp 20.000</li>
        <li>Mangga: Rp 30.000</li>
      </ul>

      <div class="btn-group">
        <button type="button" id="btn-map">
          1. Diskon 10% Semua Buah (.map)
        </button>
        <button type="button" id="btn-filter">
          2. Hanya Buah di Bawah 25 Ribu (.filter)
        </button>
        <button type="button" id="btn-reduce">
          3. Hitung Total Semua Belanja (.reduce)
        </button>
      </div>

      <div id="output-layar" class="kotak-hasil">
        Pilih aksi pengolahan data di atas.
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Data daftar buah dalam bentuk Array of Objects
const keranjangBuah = [
  { nama: "Apel", harga: 15000 },
  { nama: "Jeruk", harga: 20000 },
  { nama: "Mangga", harga: 30000 },
];

const tombolMap = document.querySelector("#btn-map");
// ambil tombol untuk operasi map.

const tombolFilter = document.querySelector("#btn-filter");
// ambil tombol untuk operasi filter.

const tombolReduce = document.querySelector("#btn-reduce");
// ambil tombol untuk operasi reduce.

const outputLayar = document.querySelector("#output-layar");
// ambil wadah teks hasil pengolahan.

// ================================================================
// 1. CONTOH .map() -> Mengubah harga setiap buah dengan diskon 10%
// ================================================================
tombolMap.addEventListener("click", () => {
  const buahDiskon = keranjangBuah.map((item) => {
    // kembalikan teks nama buah beserta harga barunya yang sudah dipotong:
    const hargaHemat = item.harga * 0.9;
    return `${item.nama}: Rp ${hargaHemat.toLocaleString("id-ID")}`;
  });

  // tampilkan array hasil pemetaan ke layar:
  outputLayar.innerHTML =
    "Harga Setelah Diskon 10%:<br>" + buahDiskon.join("<br>");
});

// ================================================================
// 2. CONTOH .filter() -> Hanya menyaring buah yang harganya < 25.000
// ================================================================
tombolFilter.addEventListener("click", () => {
  const buahMurah = keranjangBuah.filter((item) => {
    // kembalikan nilai true jika harga di bawah 25000:
    return item.harga < 25000;
  });

  // rangkai nama-nama buah yang lolos saringan:
  const teksHasil = buahMurah
    .map((b) => `${b.nama} (Rp ${b.harga.toLocaleString("id-ID")})`)
    .join(", ");
  outputLayar.innerHTML = `Buah di bawah Rp 25.000:<br>${teksHasil}`;
});

// ================================================================
// 3. CONTOH .reduce() -> Menjumlahkan total harga menjadi SATU angka
// ================================================================
tombolReduce.addEventListener("click", () => {
  // parameter 1: akumulator (kantong celengan penampung jumlah)
  // parameter 2: item buah yang sedang dibaca
  // angka 0 di ujung belakang: nilai modal awal celengan
  const totalBiaya = keranjangBuah.reduce((totalCelengan, item) => {
    return totalCelengan + item.harga;
    // tambahkan harga buah ke dalam celengan.
  }, 0);

  outputLayar.innerHTML = `Total Semua Belanjaan: Rp ${totalBiaya.toLocaleString("id-ID")}`;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu isi nilai awal pada `.reduce()`**:
   Selalu berikan nilai awal (seperti angka `0` untuk penjumlahan atau `[]` untuk array baru) di bagian akhir parameter `.reduce(fn, 0)`. Jika Anda lupa memberi nilai awal dan array dalam keadaan kosong, aplikasi Anda akan mengalami crash fatal!
2. **Jangan gunakan `.map()` jika tidak membutuhkan hasil kembaliannya**:
   Jika Anda hanya ingin menampilkan data tanpa mengubahnya menjadi array baru, gunakan `.forEach()` biasa, bukan `.map()`.
3. **Bisa digabungkan beruntun (_Chaining_)**:
   Anda bisa menggabungkan ketiganya: `keranjang.filter(...).map(...)`.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik tombol **Diskon 10% (.map)** $\to$ amati 3 buah tetap tampil namun harganya berkurang 10%.
- [ ] Klik tombol **Hanya Buah di Bawah 25 Ribu (.filter)** $\to$ amati hanya Apel dan Jeruk yang lolos, Mangga tersaring keluar.
- [ ] Klik tombol **Hitung Total (.reduce)** $\to$ amati ketiga harga disatukan menjadi Rp 65.000.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti kapan harus memakai `map` (mengubah bentuk), `filter` (menyaring), dan `reduce` (menyatukan menjadi satu nilai)**.

---

## 🎯 Uji Pemahaman Mandiri

1. Jika Anda memasukkan array berisi 5 data ke dalam fungsi `.map()`, berapakah jumlah elemen yang ada di dalam array hasil akhirnya? Apakah bisa berkurang menjadi 3?
2. Mengapa kita wajib menyertakan nilai awal (misalnya angka `0`) saat menggunakan fungsi `.reduce()`?
