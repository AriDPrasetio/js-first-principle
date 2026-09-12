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
> Perulangan (_Loop_) adalah cara Anda menyuruh komputer melakukan hal yang sama berkali-kali secara otomatis: membaca daftar barang satu per satu sampai barang terakhir, tanpa Anda harus mengetik perintahnya berulang-ulang.

---

## 1. Analogi Logis: Ban Berjalan di Pabrik Kemasan

Bayangkan Anda bekerja di pabrik perakitan barang:

- Di depan Anda ada ban berjalan (_conveyor belt_) yang membawa 5 buah kardus mainan.
- Anda mengambil kardus ke-1 $\to$ menempelkan stiker $\to$ selesai.
- Anda mengambil kardus ke-2 $\to$ menempelkan stiker $\to$ selesai.
- Proses ini terus berulang otomatis sampai kardus ke-5 selesai dan ban berhenti.

Di JavaScript:

- **`for...of`**: Seperti mengambil **isi** setiap kardus satu per satu (pilihan utama untuk Array!).
- **`break`**: Seperti menekan tombol rem darurat di pabrik untuk menghentikan ban seketika.
- **`continue`**: Seperti melewatkan satu kardus yang penyok tanpa ditempeli stiker, lalu langsung mengambil kardus berikutnya.

---

## 2. Mengapa Pemula Harus Memilih `for...of`? (First Principles)

Di JavaScript ada banyak jenis perulangan:

1. Loop klasik `for (let i = 0; i < 5; i++)` $\to$ bagus tapi panjang dan rawan salah ketik tanda titik koma.
2. Loop objek `for...in` $\to$ digunakan untuk membaca nama kunci properti objek, bukan untuk array.
3. **Loop modern `for...of` $\to$ Paling bersih, paling manusiawi, dan paling minim resiko bug.** Anda cukup bilang: _"Untuk setiap buah di dalam keranjangBuah, lakukan perintah ini."_

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat pembuat daftar belanja otomatis menggunakan perulangan:

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
        max-width: 320px;
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
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Daftar Barang Belanja</h3>
      <button type="button" id="btn-tampilkan">Tampilkan Semua Barang</button>
      <ul id="daftar-barang"></ul>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Data daftar belanjaan berupa Array
const daftarBelanja = ["Kopi", "Gula Pasir", "Roti Tawar", "Susu UHT"];
// buat kumpulan data teks belanjaan.

const tombolTampilkan = document.querySelector("#btn-tampilkan");
// ambil tombol tampilkan dari HTML.

const listContainer = document.querySelector("#daftar-barang");
// ambil elemen wadah daftar <ul> dari HTML.

// 2. Pasang aksi saat tombol diklik
tombolTampilkan.addEventListener("click", () => {
  // bersihkan isi daftar lama agar tidak menumpuk dobel saat tombol diklik lagi:
  listContainer.innerHTML = "";

  // ==========================================
  // PERULANGAN DENGAN FOR...OF (SANGAT MUDAH DIBACA)
  // ==========================================
  for (const namaBarang of daftarBelanja) {
    // untuk setiap item di dalam daftarBelanja, lakukan:

    const itemBaru = document.createElement("li");
    // buat elemen tag <li> baru di memori browser.

    itemBaru.textContent = `Beli: ${namaBarang}`;
    // isi teks di dalam tag <li> dengan nama barang yang sedang diulang.

    listContainer.appendChild(itemBaru);
    // tempelkan tag <li> tersebut ke dalam wadah <ul> di layar.
  }
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan `for...of` untuk data Array**: Sangat mudah dibaca dan mendukung kata kunci `break` jika Anda ingin menghentikan pencarian di tengah jalan.
2. **Jangan gunakan `for...in` pada Array**: `for...in` menghasilkan urutan indeks berupa teks (`"0"`, `"1"`) dan bisa membaca properti asing dari prototipe. Gunakan `for...in` hanya saat memeriksa properti pada Objek biasa `{}`.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik tombol **"Tampilkan Semua Barang"**.
- [ ] Perhatikan bagaimana 4 baris item muncul secara otomatis dalam hitungan milidetik.
- [ ] Buka `app.js`, tambahkan barang baru ke dalam array `daftarBelanja` (misal `"Mentega"`), simpan, dan klik tombol lagi di browser.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Bisa menggunakan `for (const item of array)` untuk membaca dan menampilkan seluruh isi deret data ke layar**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode berikut:

```javascript
const angkaList = [1, 2, 3, 4, 5];

for (const angka of angkaList) {
  if (angka === 3) {
    break; // Rem darurat!
  }
  console.log(angka);
}
```

Angka berapakah yang akan tercetak di konsol sebelum loop berhenti?

- **A. 1, 2, 3, 4, 5**
- **B. 1, 2**
- **C. 3 saja**
