---
title: "Panduan Pemula: Kata Kunci 'this' dan Aturan Pengikatannya di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/06-this-context
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
---

# Panduan Pemula: Kata Kunci 'this' dan Aturan Pengikatannya di JavaScript

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> Kata kunci `this` di JavaScript bekerja persis seperti kata ganti orang **"Saya"** dalam percakapan: siapa yang menjadi "Saya" tergantung pada siapa yang sedang berbicara (siapa yang memanggil fungsinya saat itu).

---

## 1. Analogi Logis: Kata Ganti "Saya" di Kehidupan Sehari-Hari

Bayangkan Anda mendengar kalimat di telepon: _"Rumah saya ada di Jakarta"_:

- Jika yang berbicara adalah **Budi**, maka kata "saya" merujuk ke rumah Budi.
- Jika yang berbicara adalah **Siti**, maka kata "saya" merujuk ke rumah Siti.
- Kata "saya" tidak menempel mati pada kalimatnya, melainkan mengikuti **siapa pembicaranya**.

Di JavaScript:

- Jika sebuah fungsi ada di dalam objek `profilUser` dan dipanggil dengan `profilUser.tampilkanNama()`, maka `this` di dalam fungsi itu otomatis merujuk ke objek `profilUser`!
- Tapi jika fungsi tersebut dipanggil sendirian tanpa pemilik di sebelah kirinya (`tampilkanNama()`), JavaScript bingung dan menganggap pembicaranya adalah ruang kosong (`undefined` atau jendela global `window`).

---

## 2. Mengapa JavaScript Didesain Seperti Ini? (First Principles)

1. **Efisiensi Kode (Berbagi Fungsi Bersama)**:
   Daripada membuat 1.000 fungsi sapaan berbeda untuk 1.000 pengguna, JavaScript cukup membuat 1 fungsi saja. Siapa pun objek yang memanggilnya di sebelah kiri titik (`userA.sapa()` atau `userB.sapa()`), kata `this` akan otomatis mengarah ke pengguna yang bersangkutan.
2. **Aturan "Siapa di Sebelah Kiri Titik?" (Implicit Binding)**:
   Lihat saja baris pemanggilannya: jika ada `pemilik.fungsi()`, maka `this` adalah `pemilik`.
3. **Pengecualian Arrow Function (`() => {}`)**:
   Arrow function **tidak punya kata "Saya" miliknya sendiri**. Dia selalu meminjam makna `this` dari lingkungan di luar tempat ia ditulis.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kartu profil pengguna dan amati bagaimana `this` membaca nama pemilik objek dengan tepat:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Kata Kunci this</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 320px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .btn-group {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      button {
        flex: 1;
        padding: 8px;
        cursor: pointer;
      }
      .status-box {
        padding: 10px;
        background: #eef2ff;
        border-radius: 4px;
        font-weight: bold;
        color: #3730a3;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Uji Coba Konteks "this"</h3>
      <div class="btn-group">
        <button type="button" id="btn-user-andi">Panggil dari Andi</button>
        <button type="button" id="btn-user-budi">Panggil dari Budi</button>
      </div>
      <div id="output-sapaan" class="status-box">
        Klik salah satu tombol di atas.
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen dari HTML
const tombolAndi = document.querySelector("#btn-user-andi");
// ambil tombol untuk memicu profil Andi.

const tombolBudi = document.querySelector("#btn-user-budi");
// ambil tombol untuk memicu profil Budi.

const outputSapaan = document.querySelector("#output-sapaan");
// ambil elemen wadah teks sapaan.

// ================================================================
// SATU FUNGSI BERBAGI YANG MEMAKAI KATA KUNCI 'this'
// ================================================================
function perkenalkanDiri() {
  // kata 'this' akan mengarah ke objek pemilik yang berada di sebelah kiri titik pemanggilan:
  return `Halo! Saya ${this.namaLengkap}, bekerja sebagai ${this.pekerjaan}.`;
}

// ================================================================
// DUA OBJEK BERBEDA DENGAN DATA MASING-MASING
// ================================================================
const profilAndi = {
  namaLengkap: "Andi Pratama",
  pekerjaan: "Desainer Web",
  sapa: perkenalkanDiri, // tempelkan fungsi yang sama ke profil Andi
};

const profilBudi = {
  namaLengkap: "Budi Santoso",
  pekerjaan: "Programmer JavaScript",
  sapa: perkenalkanDiri, // tempelkan fungsi yang sama ke profil Budi
};

// 2. Hubungkan tombol dengan pemanggilan metode
tombolAndi.addEventListener("click", () => {
  // Panggil metode dengan 'profilAndi' di sebelah kiri titik:
  // Otomatis di dalam fungsi, this === profilAndi
  outputSapaan.textContent = profilAndi.sapa();
});

tombolBudi.addEventListener("click", () => {
  // Panggil metode dengan 'profilBudi' di sebelah kiri titik:
  // Otomatis di dalam fungsi, this === profilBudi
  outputSapaan.textContent = profilBudi.sapa();
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Aturan Emas Pemula**: Untuk mengetahui apa isi `this`, cari di mana fungsinya dipanggil dengan tanda kurung `()`. Lihat siapa nama objek di sebelah kiri tanda titiknya.
2. **Jangan gunakan Arrow Function sebagai metode objek**:
   Jika Anda menulis `profil = { nama: "Andi", sapa: () => this.nama }`, `this.nama` akan bernilai `undefined` karena arrow function tidak mengikat dirinya ke objek `profil`.
3. **Gunakan Arrow Function untuk Callback di dalam metode**:
   Jika di dalam metode objek Anda memanggil `setTimeout(() => { this.nama }, 1000)`, arrow function akan sangat membantu karena ia mempertahankan `this` milik objek luarnya!

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik **"Panggil dari Andi"** $\to$ perhatikan sapaan menyebut nama Andi.
- [ ] Klik **"Panggil dari Budi"** $\to$ perhatikan sapaan menyebut nama Budi, meskipun kedua objek memakai fungsi `perkenalkanDiri` yang sama persis.

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Tahu bahwa `this` ditentukan oleh objek yang memanggilnya di sebelah kiri titik (`objek.fungsi()`)**.

---

## 🎯 Uji Pemahaman Mandiri

1. Jika Anda memisahkan fungsi dari objeknya: `const simpanFungsi = profilAndi.sapa; simpanFungsi();` tanpa ada objek di sebelah kiri titik, apa yang terjadi pada nilai `this` di dalam fungsi tersebut?
2. Mengapa Arrow Function (`() => {}`) sangat disukai ketika kita memasang timer `setTimeout` di dalam sebuah komponen?
