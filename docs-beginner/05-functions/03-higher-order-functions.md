---
title: "Panduan Pemula: Higher-Order Functions (HOF) di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/05-functions
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#higher-order_functions
---

# Panduan Pemula: Higher-Order Functions (HOF) di JavaScript

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> Higher-Order Function (HOF) adalah fungsi super: ia bisa menerima fungsi lain sebagai bahan masukan (_parameter/callback_), atau menghasilkan fungsi baru sebagai keluarannya.

---

## 1. Analogi Logis: Manajer Pabrik dan Pekerja Spesialis

Bayangkan sebuah pabrik perakitan:

- **Manajer Pabrik (Higher-Order Function)**: Dia bertugas menjalankan ban berjalan, mengambil setiap barang satu per satu dari rak, lalu memanggil pekerja spesialis untuk mengerjakan barang itu.
- **Pekerja Spesialis (Callback Function)**:
  - Pekerja A tugasnya: mewarnai barang jadi **Merah**.
  - Pekerja B tugasnya: menempelkan **Stiker Bintang**.
- Sang Manajer tidak perlu tahu cara mencampur cat merah atau cara memotong stiker. Manajer cukup menyediakan alur jalannya, lalu menyuruh: _"Hei Pekerja A, kerjakan barang ini!"_.

---

## 2. Mengapa JavaScript Didesain Seperti Ini? (First Principles)

1. **Fungsi Diperlakukan Seperti Benda Nyata (_First-Class Citizen_)**:
   Di JavaScript, fungsi tidak berbeda dengan angka atau teks string. Fungsi bisa disimpan ke variabel, dimasukkan ke dalam kotak, dikirim sebagai argumen ke fungsi lain, atau dikembalikan sebagai hadiah.
2. **Jangan Mengulang Logika Perulangan (Don't Repeat Yourself)**:
   Daripada Anda menulis loop `for` berkali-kali hanya untuk mengubah huruf besar, lalu menulis loop `for` lagi untuk memberi stiker, Anda cukup membuat 1 fungsi pengolah (HOF), dan memberikan perintah perubahannya dari luar sesuai selera.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat pengubah daftar nama dengan mesin utama (HOF) yang bisa menerima fungsi pengubah huruf besar, huruf kecil, atau penambah emotikon:

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
        max-width: 350px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .btn-group {
        display: flex;
        gap: 4px;
        margin-bottom: 12px;
      }
      button {
        flex: 1;
        padding: 8px 4px;
        font-size: 0.75rem;
        cursor: pointer;
      }
      ul {
        padding-left: 20px;
      }
      li {
        margin-bottom: 4px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Pabrik Pengolah Nama Tamu</h3>
      <p>Daftar asli: <em>andi, budi, cici</em></p>

      <div class="btn-group">
        <button type="button" id="btn-kapital">Huruf Besar</button>
        <button type="button" id="btn-bintang">Beri Bintang ⭐</button>
        <button type="button" id="btn-halo">Sapa "Halo"</button>
      </div>

      <h4>Hasil Olahan:</h4>
      <ul id="daftar-hasil"></ul>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Data daftar nama mentah
const daftarNama = ["andi", "budi", "cici"];
// daftar nama dalam huruf kecil biasa.

const tombolKapital = document.querySelector("#btn-kapital");
// ambil tombol pengubah huruf besar.

const tombolBintang = document.querySelector("#btn-bintang");
// ambil tombol penambah bintang.

const tombolHalo = document.querySelector("#btn-halo");
// ambil tombol sapa halo.

const listHasil = document.querySelector("#daftar-hasil");
// ambil wadah daftar <ul> di HTML.

// ================================================================
// INILAH HIGHER-ORDER FUNCTION (Fungsi Tingkat Tinggi)
// Ia menerima bahan data (daftarArray) dan fungsi pekerja (fungsiPengubah)
// ================================================================
function olahDanTampilkan(daftarArray, fungsiPengubah) {
  // bersihkan tampilan lama:
  listHasil.innerHTML = "";

  for (const item of daftarArray) {
    // Manajer menjalankan perintah fungsi pekerja pada setiap item:
    const hasilUbah = fungsiPengubah(item);
    // panggil fungsi pekerja yang dikirimkan lewat parameter.

    // Tempelkan hasil olahan ke layar:
    const barisBaru = document.createElement("li");
    barisBaru.textContent = hasilUbah;
    listHasil.appendChild(barisBaru);
  }
}

// ================================================================
// TIGA FUNGSI PEKERJA SPESIALIS (Fungsi Callback)
// Masing-masing fungsi hanya fokus mengubah satu kata saja
// ================================================================
function jadiKapital(teks) {
  return teks.toUpperCase();
  // ubah teks menjadi HURUF BESAR SEMUA.
}

function beriBintang(teks) {
  return `⭐ ${teks} ⭐`;
  // bungkus teks dengan emoji bintang.
}

function beriSalam(teks) {
  return `Halo, Selamat Datang ${teks}!`;
  // rangkai teks menjadi kalimat sapaan ramah.
}

// 2. Hubungkan tombol dengan memanggil HOF dan memberikan fungsinya
tombolKapital.addEventListener("click", () => {
  // Kirim fungsi jadiKapital ke dalam olahDanTampilkan:
  olahDanTampilkan(daftarNama, jadiKapital);
});

tombolBintang.addEventListener("click", () => {
  // Kirim fungsi beriBintang ke dalam olahDanTampilkan:
  olahDanTampilkan(daftarNama, beriBintang);
});

tombolHalo.addEventListener("click", () => {
  // Kirim fungsi beriSalam ke dalam olahDanTampilkan:
  olahDanTampilkan(daftarNama, beriSalam);
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Jangan letakkan tanda kurung `()` saat mengirim fungsi sebagai argumen**:
   Tuliskan namanya saja: `olahDanTampilkan(daftarNama, jadiKapital)`. Jika Anda menulis `jadiKapital()`, fungsinya akan langsung dijalankan di detik itu juga sebelum sempat diserahkan ke manajer!
2. **Kapan menggunakan HOF bawaan JavaScript**:
   Metode array populer seperti `.map()`, `.filter()`, dan `.forEach()` semuanya adalah Higher-Order Function bawaan browser yang sangat berguna dan wajib dikuasai pemula.
3. **Fungsi Callback Tanpa Nama (_Anonymous Function_)**:
   Anda juga bisa langsung memasukkan arrow function ringkas tanpa membuat fungsi terpisah: `olahDanTampilkan(daftarNama, (t) => `ID: ${t}`)`.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik ketiga tombol secara bergantian. Perhatikan bagaimana daftar nama berubah format seketika sesuai spesialisnya masing-masing.
- [ ] Amati di file `app.js` bahwa fungsi `olahDanTampilkan` hanya dibuat satu kali, tetapi perilakunya bisa sangat fleksibel berkat parameter fungsi yang diterimanya.

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Mengerti bahwa fungsi di JavaScript bisa dikirimkan ke dalam fungsi lain layaknya Anda mengirim variabel angka atau string biasa**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa perbedaan antara menulis `tombol.addEventListener("click", jalankanAksi)` dengan menulis `tombol.addEventListener("click", jalankanAksi())`? Kenapa tanda kurung membuat perbedaannya sangat besar?
2. Mengapa metode bawaan array seperti `.filter()` disebut sebagai Higher-Order Function?
