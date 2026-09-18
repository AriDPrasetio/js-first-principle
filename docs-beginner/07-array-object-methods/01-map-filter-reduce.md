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
> Tiga sekawan pemroses data ini memudahkan Anda mengolah daftar:
>
> - **`map`**: Mengubah bentuk setiap item satu per satu (panjang hasil selalu sama dengan panjang asal).
> - **`filter`**: Menyaring item berdasarkan syarat kebenaran boolean (panjang hasil bisa berkurang).
> - **`reduce`**: Menyusutkan seluruh deret item menjadi **satu nilai akhir** (angka, teks, atau objek baru).

---

## 1. Analogi Logis: Dapur Restoran Burger

Bayangkan Anda bekerja di dapur restoran cepat saji:

- **`map` (Mengubah Bentuk 1-ke-1)**:
  Anda punya 3 potong daging mentah. Anda memanggang ketiganya. Hasilnya adalah 3 potong daging matang.
  *(3 bahan masuk $\to$ 3 hasil matang keluar).*
- **`filter` (Saringan Bahan Baku)**:
  Dari sekeranjang kentang, Anda hanya meloloskan kentang yang berukuran besar dan membuang kentang busuk.
  *(Hanya yang memenuhi kriteria boolean `true` yang lolos).*
- **`reduce` (Menghitung Total Kasir)**:
  Kasir mengumpulkan seluruh struk belanja dari pagi sampai malam, lalu mengakumulasikan seluruh uangnya ke dalam laci menjadi **SATU** angka total omset harian.
  *(Banyak data $\to$ 1 nilai akhir).*

---

## 2. Anatomi Pemanggilan Callback (First Principles)

Ketiga metode ini adalah *Higher-Order Functions* yang menerima fungsi callback. Pahami kontrak nilai balikan (*return value*) masing-masing:

### A. Kontrak `.map(callback)`
Fungsi callback menerima `(item, index)`. **Nilai apa pun yang Anda `return` akan menjadi elemen baru di array hasil**:
```javascript
const angka = [1, 2, 3];
const kaliDua = angka.map((item) => item * 2); // [2, 4, 6]
```

### B. Kontrak `.filter(callback)`
Fungsi callback menerima `(item, index)`. **Wajib mengembalikan nilai boolean (`true`/`false`)**:
- Kembalikan `true` jika ingin mempertahankan item.
- Kembalikan `false` jika ingin membuangnya.
```javascript
const angka = [10, 25, 5];
const lolos = angka.filter((item) => item >= 10); // [10, 25]
```

### C. Kontrak `.reduce(callback, initialValue)`
Fungsi callback menerima `(akumulator, item)`. **Nilai `return` pada putaran saat ini akan menjadi nilai `akumulator` untuk putaran berikutnya**:
```javascript
const harga = [10, 20, 30];
const total = harga.reduce((celengan, item) => celengan + item, 0); // 60
```

> [!WARNING]
> **Kausalitas Fatal: Mengapa Wajib Memberi Nilai Awal `initialValue`?**
> Jika Anda tidak memberi nilai awal (misal angka `0`), JavaScript secara otomatis mengambil elemen indeks `0` sebagai modal awal dan memulai loop dari indeks `1`.
> **Bahayanya**: Jika array ternyata kosong `[]`, tidak ada elemen indeks 0 di memori, sehingga JavaScript langsung crash melempar `TypeError: Reduce of empty array with no initial value`!

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kasir mini toko buah yang mempraktikkan `map`, `filter`, dan `reduce`:

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
// simpan array of objects berisi daftar buah dan harga ke dalam variable keranjangBuah
const keranjangBuah = [
  { 
    // simpan string "Apel" ke property nama
    nama: "Apel", 
    // simpan number 15000 ke property harga
    harga: 15000 
  },
  { 
    // simpan string "Jeruk" ke property nama
    nama: "Jeruk", 
    // simpan number 20000 ke property harga
    harga: 20000 
  },
  { 
    // simpan string "Mangga" ke property nama
    nama: "Mangga", 
    // simpan number 30000 ke property harga
    harga: 30000 
  },
];

// ambil element button map berdasarkan ID-nya, simpan ke variable tombolMap
const tombolMap = document.querySelector("#btn-map");
// ambil element button filter berdasarkan ID-nya, simpan ke variable tombolFilter
const tombolFilter = document.querySelector("#btn-filter");
// ambil element button reduce berdasarkan ID-nya, simpan ke variable tombolReduce
const tombolReduce = document.querySelector("#btn-reduce");
// ambil element output layar berdasarkan ID-nya, simpan ke variable outputLayar
const outputLayar = document.querySelector("#output-layar");

// Catatan utilitas:
// .toLocaleString("id-ID") memformat angka menjadi format rupiah (misal 15000 -> 15.000)
// .join("<br>") merangkai deret array teks menjadi satu string dipisah baris baru HTML

// 1. .map() -> Mengubah harga setiap buah
// saat tombolMap di-click, jalankan function berikut:
tombolMap.addEventListener("click", () => {
  // simpan array baru hasil pengubahan data keranjangBuah ke dalam variable buahDiskon
  const buahDiskon = keranjangBuah.map((item) => {
    // simpan kalkulasi diskon 10% dari harga item ke dalam variable hargaHemat
    const hargaHemat = item.harga * 0.9;
    // kembalikan string yang berisi nama buah dan harga diskon
    return `${item.nama}: Rp ${hargaHemat.toLocaleString("id-ID")}`;
  });

  // ubah properti innerHTML pada element outputLayar menjadi teks dan hasil gabungan array buahDiskon
  outputLayar.innerHTML = "Harga Diskon 10%:<br>" + buahDiskon.join("<br>");
});

// 2. .filter() -> Menyaring buah harga < 25.000
// saat tombolFilter di-click, jalankan function berikut:
tombolFilter.addEventListener("click", () => {
  // simpan array baru hasil penyaringan keranjangBuah ke dalam variable buahMurah
  const buahMurah = keranjangBuah.filter((item) => {
    // predikat boolean: kembalikan true jika harga < 25000
    // kembalikan true jika harga dari item kurang dari 25000
    return item.harga < 25000;
  });

  // simpan array string hasil pemetaan array buahMurah ke dalam variable barisTeks
  const barisTeks = buahMurah.map((b) => `${b.nama} (Rp ${b.harga.toLocaleString("id-ID")})`);
  // ubah properti innerHTML pada element outputLayar menjadi string teks daftar buah murah
  outputLayar.innerHTML = `Buah di bawah Rp 25.000:<br>` + barisTeks.join("<br>");
});

// 3. .reduce() -> Menjumlahkan total harga
// saat tombolReduce di-click, jalankan function berikut:
tombolReduce.addEventListener("click", () => {
  // Modal awal celengan diset 0:
  // simpan satu nilai akhir dari total harga seluruh item di keranjangBuah ke dalam variable totalBiaya
  const totalBiaya = keranjangBuah.reduce((celengan, item) => {
    // kembalikan hasil penjumlahan nilai akumulator celengan dengan harga item saat ini
    return celengan + item.harga;
  }, 0);

  // ubah properti innerHTML pada element outputLayar menjadi string teks hasil total belanja
  outputLayar.innerHTML = `Total Semua Belanjaan: Rp ${totalBiaya.toLocaleString("id-ID")}`;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu Berikan Nilai Awal pada `.reduce()`**: Selalu tuliskan `0`, `""`, atau `[]` di parameter kedua untuk mencegah error crash pada array kosong.
2. **Jangan Gunakan `.map()` Jika Tidak Membutuhkan Hasilnya**: Jika Anda hanya ingin mencetak log tanpa memproduksi array baru, gunakan `for...of` atau `.forEach()`.
3. **Array Asli Tidak Berubah (*Immutable*)**: `.map()` dan `.filter()` menghasilkan array baru yang terpisah, menjaga integritas data asli Anda.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan uji ketiga tombolnya.
- [ ] Perhatikan bahwa data asli `keranjangBuah` tetap utuh saat Anda menekan tombol berkali-kali.
- [ ] Buka Console (`F12`), coba jalankan `.reduce()` tanpa modal awal pada array kosong:
  ```javascript
  // Amati error TypeError yang muncul jika tanpa nilai awal:
  [].reduce((acc, curr) => acc + curr);
  ```

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu kontrak return callback pada `map` (nilai baru), `filter` (boolean), dan `reduce` (akumulator berikutnya), serta mengerti mengapa `reduce` mewajibkan modal awal**.

---

## 🎯 Uji Pemahaman Mandiri

1. Jika Anda memasukkan array berisi 4 data ke dalam fungsi `.map()`, berapakah jumlah elemen array hasil kembaliannya? Bisakah berkurang menjadi 2?
2. Mengapa pemanggilan `[].reduce((acc, x) => acc + x)` menghasilkan crash error fatal di JavaScript?
```
