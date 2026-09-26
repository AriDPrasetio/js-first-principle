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
> Perulangan (_Loop_) adalah cara Anda menyuruh komputer melakukan hal yang sama berkali-kali secara otomatis tanpa menulis perintah berulang-ulang:
>
> - **Loop Klasik `for (let i = 0; ...)`**: Kendali presisi berbasis angka indeks.
> - **Loop Modern `for...of`**: Cara paling bersih dan manusiawi untuk membaca setiap isi elemen Array.
> - **`break` & `continue`**: Rem darurat untuk berhenti total (`break`) atau tombol lewati langkah (`continue`).

---

## 1. Analogi Logis: Ban Berjalan di Pabrik Kemasan

Bayangkan Anda bekerja di pabrik perakitan barang:

- Di depan Anda ada ban berjalan (_conveyor belt_) yang membawa deretan kardus barang belanjaan.
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
// 1. Buat penghitung i mulai dari 0, jalankan selama i kurang dari 5, dan tambah i dengan 1 setiap putaran
for (let i = 0; i < 5; i++) {
  // 2. Cetak nomor putaran saat ini ke konsol
  console.log("Putaran ke:", i);
}
```

Tanda kurung loop `for` memiliki 3 stasiun yang dipisahkan titik koma (`;`):

1. **Inisialisasi (`let i = 0`)**: Membuat variabel penghitung (_counter_), dijalankan **hanya satu kali** di awal.
2. **Kondisi Uji (`i < 5`)**: Diperiksa sebelum setiap putaran. Jika bernilai `true`, kode di dalam kurung kurawal dijalankan. Jika `false`, loop berhenti.
3. **Penaikan Langkah (`i++`)**: Dijalankan di akhir setiap putaran untuk menambah nilai counter sebesar 1 (`i = i + 1`).

**Kapan Memakai Loop Klasik?**
Saat Anda membutuhkan indeks angka secara presisi, ingin melompat per 2 langkah (`i += 2`), atau memutar mundur dari belakang (`let i = daftar.length - 1; i >= 0; i--`).

---

### B. Loop Modern `for...of` (Pilihan Utama untuk Array)

```javascript
// 1. Buat wadah konstan daftarBuah dan isi dengan kumpulan nama buah
const daftarBuah = ["Apel", "Jeruk", "Mangga"];

// 2. Untuk setiap buah di dalam daftarBuah, jalankan perintah di dalam blok ini
for (const buah of daftarBuah) {
  // 3. Cetak nama buah ke konsol
  console.log("Nama buah:", buah);
}
```

**Mengapa `for...of` Lebih Baik untuk Pemula?**
Anda tidak perlu repot membuat variabel `i`, tidak perlu menghitung `.length`, dan tidak ada risiko salah ketik tanda titik koma. Sintaksnya berbunyi alami seperti bahasa manusia: _"Untuk setiap buah di dalam daftarBuah, lakukan perintah ini"_.

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
      <button type="button" id="btn-tampilkan-semua">
        Tampilkan Semua (for...of)
      </button>
      <button type="button" id="btn-filter-stok">
        Lewatkan Stok Habis (continue)
      </button>
      <button type="button" id="btn-cari-satu">
        Cari & Hentikan Pertama (break)
      </button>

      <ul id="daftar-barang"></ul>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// Data daftar inventaris gudang
// 1. Buat wadah konstan inventaris dan isi dengan daftar barang (array dari objek)
const inventaris = [
  { nama: "Kopi Hitam", stok: 15 },
  { nama: "Gula Pasir", stok: 0 },
  { nama: "Roti Tawar", stok: 8 },
  { nama: "Susu Kotak", stok: 0 },
  { nama: "Keju Cheddar", stok: 5 },
];

// 2. Ambil elemen-elemen HTML yang dibutuhkan dari halaman dan simpan ke dalam wadah konstan
const listEl = document.querySelector("#daftar-barang");
const btnSemua = document.querySelector("#btn-tampilkan-semua");
const btnFilter = document.querySelector("#btn-filter-stok");
const btnCari = document.querySelector("#btn-cari-satu");

// 3. Buat fungsi pembantu bersihkanLayar untuk mengosongkan isi daftar HTML
function bersihkanLayar() {
  // 4. Hapus seluruh isi elemen listEl
  listEl.innerHTML = "";
}

// Tampilkan Semua Barang dengan for...of
// 5. Pasang aksi pada tombol tampilkan semua untuk dijalankan saat diklik
btnSemua.addEventListener("click", () => {
  // 6. Bersihkan layar sebelum menampilkan data
  bersihkanLayar();

  // 7. Ulangi proses untuk setiap item di dalam inventaris
  for (const item of inventaris) {
    // 8. Buat elemen li (baris daftar) baru
    const li = document.createElement("li");

    // 9. Isi elemen li dengan nama barang dan jumlah stoknya
    li.textContent = `${item.nama} (Stok: ${item.stok})`;

    // 10. Pasang elemen li ke dalam daftar HTML listEl
    listEl.appendChild(li);
  }
});

// Lewatkan Barang Stok 0 Menggunakan 'continue'
// 11. Pasang aksi pada tombol filter stok untuk dijalankan saat diklik
btnFilter.addEventListener("click", () => {
  // 12. Bersihkan layar sebelum menampilkan data
  bersihkanLayar();

  // 13. Ulangi proses untuk setiap item di dalam inventaris
  for (const item of inventaris) {
    // 14. Periksa jika stok item adalah 0
    if (item.stok === 0) {
      // 15. Hentikan putaran saat ini dan langsung lompat ke item berikutnya
      continue;
    }

    // 16. Buat elemen li (baris daftar) baru
    const li = document.createElement("li");

    // 17. Isi elemen li dengan tanda dan info barang
    li.textContent = `✅ ${item.nama} (Tersedia: ${item.stok})`;

    // 18. Pasang elemen li ke dalam daftar HTML listEl
    listEl.appendChild(li);
  }
});

// Hentikan Loop Seketika Begitu Ditemukan Menggunakan 'break'
// 19. Pasang aksi pada tombol cari target untuk dijalankan saat diklik
btnCari.addEventListener("click", () => {
  // 20. Bersihkan layar sebelum mencari data
  bersihkanLayar();

  // 21. Ulangi proses untuk setiap item di dalam inventaris
  for (const item of inventaris) {
    // 22. Buat elemen li pelacak baru
    const li = document.createElement("li");
    // 23. Isi teks elemen li dengan nama barang yang sedang diperiksa
    li.textContent = `Memeriksa: ${item.nama}`;
    // 24. Pasang elemen li ke dalam daftar HTML listEl
    listEl.appendChild(li);

    // 25. Periksa jika nama item cocok dengan "Roti Tawar"
    if (item.nama === "Roti Tawar") {
      // 26. Buat elemen li baru untuk tanda target ditemukan
      const liKetemu = document.createElement("li");
      // 27. Isi elemen li tersebut dengan pesan target
      liKetemu.innerHTML = "<strong>🎯 TARGET DITEMUKAN! Loop dihentikan seketika dengan break.</strong>";
      // 28. Pasang elemen ke dalam daftar HTML listEl
      listEl.appendChild(liKetemu);

      // 29. Hentikan perulangan sepenuhnya
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

- [x] Buka `index.html` di browser, klik tombol **"Tampilkan Semua"** dan amati 5 barang muncul.
- [x] Klik tombol **"Lewatkan Stok Habis"** dan amati bagaimana barang dengan stok 0 tidak ditampilkan berkat perintah `continue`.
- [x] Klik tombol **"Cari & Hentikan Pertama"** dan perhatikan bagaimana loop berhenti di "Roti Tawar" tanpa memeriksa barang-barang setelahnya berkat perintah `break`.
- [x] Buka Console (`F12`), coba ketik loop mundur klasik:
  ```javascript
  // 1. Buat penghitung i mulai dari 3, jalankan selama i >= 1, dan kurangi i setiap putaran
  for (let i = 3; i >= 1; i--) {
    // 2. Cetak hitung mundur ke konsol
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
// 1. Buat wadah angkaList dan isi dengan deretan angka
const angkaList = [1, 2, 3, 4, 5];

// 2. Ulangi proses untuk setiap angka di dalam angkaList
for (const angka of angkaList) {
  // 3. Evaluasi apakah angka bernilai 2, jika iya lewati (continue)
  if (angka === 2) {
    continue;
  }
  // 4. Evaluasi apakah angka bernilai 4, jika iya hentikan total (break)
  if (angka === 4) {
    break;
  }
  // 5. Cetak angka ke konsol
  console.log(angka);
}
```

Angka berapakah yang akan tercetak di konsol browser?

- **A. 1, 3**
- **B. 1, 2, 3, 4**
- **C. 1, 3, 4**
- Jelaskan mengapa angka 2 dan angka 4 tidak tercetak!
