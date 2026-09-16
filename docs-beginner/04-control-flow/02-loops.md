---
title: "Panduan Pemula: Perulangan (Loops) di JavaScript"
tags: "javascript, first-principles, roadmap-js/04-control-flow"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration"
---

# Panduan Pemula: Perulangan (Loops) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Perulangan (*Loop*) adalah cara Anda menyuruh komputer melakukan hal yang sama berkali-kali secara otomatis tanpa menulis perintah berulang-ulang:
>
> - **Loop Klasik `for (let i = 0; ...)`**: Kendali presisi berbasis angka indeks.
> - **Loop Modern `for...of`**: Cara paling bersih dan manusiawi untuk membaca setiap isi elemen Array.
> - **`break` & `continue`**: Rem darurat untuk berhenti total (`break`) atau tombol lewati langkah (`continue`).

---

## 1. Analogi Logis: Ban Berjalan di Pabrik Kemasan

Bayangkan Anda bekerja di pabrik perakitan barang:

- Di depan Anda ada ban berjalan (*conveyor belt*) yang membawa deretan kardus barang belanjaan.
- Anda mengambil kardus ke-1 $\to$ menempelkan stiker $\to$ selesai.
- Anda mengambil kardus ke-2 $\to$ menempelkan stiker $\to$ selesai.
- Proses ini terus berulang otomatis sampai barang terakhir selesai dan ban berhenti.

Di JavaScript:

- **Loop Klasik `for`**: Anda memegang stopwatch penghitung nomor kardus (`kardus ke-0, kardus ke-1, kardus ke-2...`).
- **Loop Modern `for...of`**: Anda langsung mengambil **isi barang** di dalam tiap kardus tanpa pusing memikirkan nomornya.
- **`break`**: Menekan tombol rem darurat pabrik untuk **menghentikan ban seketika**.
- **`continue`**: Melewatkan satu kardus yang penyok/kosong tanpa ditempeli stiker, lalu **langsung meloncat ke kardus berikutnya**.

---

## 2. Membedah Dua Jenis Perulangan Utama (First Principles)

### A. Anatomi Loop Klasik `for` (3 Bagian Mesin)

```javascript
for (let i = 0; i < 5; i++) {
  console.log("Putaran ke:", i);
}
```

Tanda kurung loop `for` memiliki 3 stasiun yang dipisahkan titik koma (`;`):
1. **Inisialisasi (`let i = 0`)**: Membuat variabel penghitung (*counter*), dijalankan **hanya satu kali** di awal.
2. **Kondisi Uji (`i < 5`)**: Diperiksa sebelum setiap putaran. Jika bernilai `true`, kode di dalam kurung kurawal dijalankan. Jika `false`, loop berhenti.
3. **Penaikan Langkah (`i++`)**: Dijalankan di akhir setiap putaran untuk menambah nilai counter sebesar 1 (`i = i + 1`).

**Kapan Memakai Loop Klasik?**
Saat Anda membutuhkan indeks angka secara presisi, ingin melompat per 2 langkah (`i += 2`), atau memutar mundur dari belakang (`let i = daftar.length - 1; i >= 0; i--`).

---

### B. Loop Modern `for...of` (Pilihan Utama untuk Array)

```javascript
const daftarBuah = ["Apel", "Jeruk", "Mangga"];

for (const buah of daftarBuah) {
  console.log("Nama buah:", buah);
}
```

**Mengapa `for...of` Lebih Baik untuk Pemula?**
Anda tidak perlu repot membuat variabel `i`, tidak perlu menghitung `.length`, dan tidak ada risiko salah ketik tanda titik koma. Sintaksnya berbunyi alami seperti bahasa manusia: *"Untuk setiap buah di dalam daftarBuah, lakukan perintah ini"*.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat penyaring daftar barang yang mempraktikkan `for...of`, `continue`, dan `break`:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Perulangan Loops</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      ul {
        padding-left: 20px;
      }
      li {
        margin-bottom: 4px;
      }
      button {
        padding: 8px 12px;
        cursor: pointer;
        width: 100%;
        margin-top: 6px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Daftar Barang Gudang</h3>
      <button type="button" id="btn-tampilkan-semua">Tampilkan Semua (for...of)</button>
      <button type="button" id="btn-filter-stok">Lewatkan Stok Habis (continue)</button>
      <button type="button" id="btn-cari-satu">Cari & Hentikan Pertama (break)</button>
      
      <ul id="daftar-barang"></ul>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// Data daftar inventaris gudang
const inventaris = [
  { nama: "Kopi Hitam", stok: 15 },
  { nama: "Gula Pasir", stok: 0 },  // stok kosong!
  { nama: "Roti Tawar", stok: 8 },
  { nama: "Susu Kotak", stok: 0 },  // stok kosong!
  { nama: "Keju Cheddar", stok: 5 },
];

const listEl = document.querySelector("#daftar-barang");
const btnSemua = document.querySelector("#btn-tampilkan-semua");
const btnFilter = document.querySelector("#btn-filter-stok");
const btnCari = document.querySelector("#btn-cari-satu");

function bersihkanLayar() {
  listEl.innerHTML = "";
}

// 1. Tampilkan Semua Barang dengan for...of
btnSemua.addEventListener("click", () => {
  bersihkanLayar();

  for (const item of inventaris) {
    const li = document.createElement("li");
    li.textContent = `${item.nama} (Stok: ${item.stok})`;
    listEl.appendChild(li);
  }
});

// 2. Lewatkan Barang Stok 0 Menggunakan 'continue'
btnFilter.addEventListener("click", () => {
  bersihkanLayar();

  for (const item of inventaris) {
    if (item.stok === 0) {
      // lewati barang ini dan langsung lompat ke putaran berikutnya
      continue;
    }

    const li = document.createElement("li");
    li.textContent = `✅ ${item.nama} (Tersedia: ${item.stok})`;
    listEl.appendChild(li);
  }
});

// 3. Hentikan Loop Seketika Begitu Ditemukan Menggunakan 'break'
btnCari.addEventListener("click", () => {
  bersihkanLayar();

  for (const item of inventaris) {
    const li = document.createElement("li");
    li.textContent = `Memeriksa: ${item.nama}`;
    listEl.appendChild(li);

    if (item.nama === "Roti Tawar") {
      const liKetemu = document.createElement("li");
      liKetemu.innerHTML = "<strong>🎯 TARGET DITEMUKAN! Loop dihentikan seketika dengan break.</strong>";
      listEl.appendChild(liKetemu);
      // rem darurat: hentikan loop total
      break;
    }
  }
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan `for...of` sebagai pilihan bawaan untuk Array**: Jauh lebih mudah dibaca dan bebas risiko salah indeks.
2. **Gunakan `continue` untuk Mengurangi Kurung Kurawal Bersarang**: Alih-alih membungkus kode panjang di dalam `if (stok > 0) { ... }`, gunakan guard: `if (stok === 0) continue;`.
3. **Gunakan `break` untuk Optimasi Pencarian**: Jangan biarkan loop terus berputar 10.000 kali jika data yang Anda cari sudah berhasil ditemukan pada putaran ke-3.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser, klik tombol **"Tampilkan Semua"** dan amati 5 barang muncul.
- [ ] Klik tombol **"Lewatkan Stok Habis"** dan amati bagaimana barang dengan stok 0 tidak ditampilkan berkat perintah `continue`.
- [ ] Klik tombol **"Cari & Hentikan Pertama"** dan perhatikan bagaimana loop berhenti di "Roti Tawar" tanpa memeriksa barang-barang setelahnya berkat perintah `break`.
- [ ] Buka Console (`F12`), coba ketik loop mundur klasik:
  ```javascript
  for (let i = 3; i >= 1; i--) {
    console.log("Hitung mundur:", i);
  }
  ```

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu 3 bagian mesin loop `for` klasik, tahu keunggulan `for...of` untuk array, dan bisa memanfaatkan `break` serta `continue` untuk mengendalikan jalannya perulangan**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode berikut:

```javascript
const angkaList = [1, 2, 3, 4, 5];

for (const angka of angkaList) {
  if (angka === 2) {
    continue;
  }
  if (angka === 4) {
    break;
  }
  console.log(angka);
}
```

Angka berapakah yang akan tercetak di konsol browser?
- **A. 1, 3**
- **B. 1, 2, 3, 4**
- **C. 1, 3, 4**
- Jelaskan mengapa angka 2 dan angka 4 tidak tercetak!
