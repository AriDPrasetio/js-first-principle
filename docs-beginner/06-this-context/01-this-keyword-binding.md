---
title: "Panduan Pemula: Kata Kunci 'this' dan Aturan Pengikatannya di JavaScript"
tags: "javascript, first-principles, roadmap-js/06-this-context"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this"
---

# Panduan Pemula: Kata Kunci 'this' dan Aturan Pengikatannya di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Kata kunci `this` di JavaScript bekerja persis seperti kata ganti **"Saya"** dalam percakapan: makna "Saya" selalu ditentukan oleh **siapa yang memanggil fungsinya di titik pemanggilan (*call-site*)**, bukan di mana fungsi tersebut ditulis.

---

## 1. Analogi Logis: Kata Ganti "Saya" di Kehidupan Sehari-Hari

Bayangkan Anda mendengar rekaman suara di telepon: *"Rumah saya ada di Jakarta"*:

- Jika yang berbicara di telepon adalah **Andi**, maka kata "saya" merujuk ke rumah Andi.
- Jika yang berbicara adalah **Budi**, maka kata "saya" merujuk ke rumah Budi.
- Kata "saya" tidak terpatri permanen pada naskah kalimatnya, melainkan mengikuti **siapa yang sedang berbicara**.

Di JavaScript:
- Jika sebuah fungsi dipanggil lewat objek: `profilAndi.sapa()`, maka `this` di dalam fungsi otomatis mengarah ke `profilAndi`.
- Tetapi jika fungsi tersebut dipanggil sendirian tanpa pemilik: `sapa()`, JavaScript bingung siapa pemiliknya, dan mengalihkan pembicara ke ruang global (`window` atau `undefined` dalam Strict Mode).

---

## 2. Peta 4 Aturan Penentuan `this` (First Principles)

Bagaimana engine JavaScript menentukan nilai `this`? Ada 4 aturan berurutan (*precedence*):

```
1. new Binding        -> Apakah dipanggil dengan kata kunci 'new'? (this = objek baru)
2. Explicit Binding   -> Apakah dipanggil lewat .call(), .apply(), atau .bind()? (this = target manual)
3. Implicit Binding   -> Apakah dipanggil lewat objek sebelah kiri titik: obj.fn()? (this = obj)
4. Default Binding    -> Dipanggil sendirian: fn()? (this = window / undefined di strict mode)
```

### Fenomena Kehilangan Konteks (*Lost Context*)

Kesalahan terbesar pemula adalah memisahkan fungsi metode dari objek pemiliknya:

```javascript
const profil = {
  nama: "Andi",
  sapa: function() { console.log("Nama saya:", this.nama); }
};

profil.sapa(); // "Nama saya: Andi" (Implicit Binding bekerja!)

const sapaLepas = profil.sapa;
sapaLepas(); // "Nama saya: undefined" (ERROR! Jatuh ke Default Binding karena dipanggil sendirian!)
```

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
        max-width: 340px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .btn-group {
        display: flex;
        gap: 6px;
        margin-bottom: 8px;
      }
      button {
        flex: 1;
        padding: 8px 4px;
        cursor: pointer;
        font-size: 0.8rem;
      }
      .status-box {
        padding: 10px;
        background: #eef2ff;
        border-radius: 4px;
        font-weight: bold;
        color: #3730a3;
        margin-top: 8px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Uji Coba Konteks "this"</h3>
      <div class="btn-group">
        <button type="button" id="btn-andi">Panggil dari Andi</button>
        <button type="button" id="btn-budi">Panggil dari Budi</button>
      </div>
      <button type="button" id="btn-lepas" style="width: 100%; padding: 8px;">Uji Panggilan Terpisah (Lost Context)</button>

      <div id="output-sapaan" class="status-box">Klik salah satu tombol di atas.</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
const tombolAndi = document.querySelector("#btn-andi");
const tombolBudi = document.querySelector("#btn-budi");
const tombolLepas = document.querySelector("#btn-lepas");
const outputSapaan = document.querySelector("#output-sapaan");

// Satu fungsi berbagi logika:
function perkenalkanDiri() {
  return `Halo! Saya ${this.namaLengkap ?? "Tanpa Nama"}, bekerja sebagai ${this.pekerjaan ?? "Tanpa Pekerjaan"}.`;
}

// Dua objek terpisah:
const profilAndi = {
  namaLengkap: "Andi Pratama",
  pekerjaan: "Desainer Web",
  sapa: perkenalkanDiri,
};

const profilBudi = {
  namaLengkap: "Budi Santoso",
  pekerjaan: "Programmer JS",
  sapa: perkenalkanDiri,
};

// 1. Implicit Binding: dipanggil lewat profilAndi
tombolAndi.addEventListener("click", () => {
  outputSapaan.textContent = profilAndi.sapa();
  outputSapaan.style.color = "#3730a3";
});

// 2. Implicit Binding: dipanggil lewat profilBudi
tombolBudi.addEventListener("click", () => {
  outputSapaan.textContent = profilBudi.sapa();
  outputSapaan.style.color = "#3730a3";
});

// 3. Default Binding (Lost Context):
tombolLepas.addEventListener("click", () => {
  // Mencopot fungsi dari objek
  const fungsiSendirian = profilAndi.sapa;
  // Dipanggil sendirian tanpa pemilik di kiri titik:
  outputSapaan.textContent = `Panggilan Terpisah: ${fungsiSendirian()}`;
  outputSapaan.style.color = "#b91c1c";
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Aturan Emas**: Untuk mengetahui apa isi `this`, lihat **tepat di titik kurung pemanggilan `()`**. Jika ada `objek.fungsi()`, maka `this` adalah objek tersebut.
2. **Jangan gunakan Arrow Function sebagai metode objek**:
   ```javascript
   const profil = {
     nama: "Andi",
     // ERROR: Arrow function meminjam this dari luar objek (window)!
     sapa: () => `Saya ${this.nama}`,
   };
   ```
3. **Gunakan Arrow Function untuk Callback di dalam metode**:
   Ketika memasang timer `setTimeout` atau callback array di dalam sebuah metode, arrow function sangat aman karena mempertahankan konteks `this` milik metode induknya.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser, klik **"Panggil dari Andi"** lalu **"Panggil dari Budi"**. Amati bagaimana fungsi `perkenalkanDiri` yang sama bisa merujuk ke data yang berbeda.
- [ ] Klik **"Uji Panggilan Terpisah"** dan amati bagaimana `this.namaLengkap` menjadi kosong karena kehilangan pemilik (*Lost Context*).
- [ ] Buka Console (`F12`), coba panggil fungsi sendirian di console untuk melihat bahwa ia mengarah ke objek global `window`.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti 4 aturan penentuan `this`, paham konsep Implicit Binding (`obj.fn()`), dan menyadari mengapa memisahkan fungsi dari objeknya membuat `this` kehilangan pemilik**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode berikut:

```javascript
const toko = {
  namaToko: "Toko Berkah",
  buka: function() {
    console.log("Buka:", this.namaToko);
  }
};

const aksiBuka = toko.buka;

// Pertanyaan:
// 1. Apakah hasil dari toko.buka()?
// 2. Apakah hasil dari aksiBuka()? Mengapa hasilnya berbeda?
```
