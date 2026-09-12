---
title: "Panduan Pemula: Operator Tiga Titik (Spread dan Rest) di JavaScript"
tags: "javascript, first-principles, roadmap-js/07-array-object-methods"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax"
---

# Panduan Pemula: Operator Tiga Titik (Spread dan Rest) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Tanda tiga titik (`...`) adalah operator bunglon di JavaScript: jika ditaruh di tempat membuat data baru, ia bertindak sebagai **Spread (menaburkan/membuka isi)**; jika ditaruh di tempat menerima variabel, ia bertindak sebagai **Rest (mengemas sisa-sisanya ke dalam wadah)**.

---

## 1. Analogi Logis: Menabur Toples vs Menyapu ke Kardus

Bayangkan Anda memiliki setoples permen:

- **SPREAD (Menaburkan Isi Keluar Toples)**:
  Anda membuka toples permen, lalu menuang isinya ke atas meja pesta agar bercampur dengan permen jenis lain.
  _(Contoh: Menggabungkan dua array `[...buahLokal, ...buahImpor]` atau menyalin objek `{ ...profilLama }`)._
- **REST (Menyapu Sisa ke Dalam Kardus)**:
  Pesta selesai, ada beberapa permen utama yang diambil tamu, lalu Anda menyapu **seluruh sisa** permen yang tersisa masuk ke dalam satu kardus baru.
  _(Contoh: `const [juara1, ...pesertaLain] = daftarLari;`)._

---

## 2. Mengapa Operator Ini Sangat Populer? (First Principles)

1. **Menyalin Objek & Array Tanpa Merusak Data Asli**:
   Sebelum ada spread, menggabungkan dua array membutuhkan perintah rumit `.concat()`. Dengan spread, Anda cukup menulis `[...arrayA, ...arrayB]`.
2. **Aturan "Siapa di Kanan Menang Menimpa"**:
   Saat menggabungkan objek dengan spread, properti yang ditulis belakangan di sisi kanan akan menimpa nilai yang ada di sisi kiri:
   `const akun = { ...akunLama, role: "Admin" };` $\to$ Nilai `role` dijamin berubah menjadi `"Admin"`!

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat penggabung menu makanan dan pembaruan profil status menggunakan operator tiga titik:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Spread dan Rest Operator</title>
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
        gap: 8px;
        margin-bottom: 12px;
      }
      button {
        flex: 1;
        padding: 8px;
        cursor: pointer;
        font-size: 0.8rem;
      }
      .box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 12px;
        border-radius: 6px;
      }
      p {
        margin: 4px 0;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Uji Coba Operator Tiga Titik (...)</h3>
      <div class="btn-group">
        <button type="button" id="btn-spread">
          1. Tabur Gabung Array (Spread)
        </button>
        <button type="button" id="btn-rest">2. Kemas Sisa Tim (Rest)</button>
      </div>
      <div id="kotak-hasil" class="box">Pilih salah satu tombol di atas...</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen HTML
const tombolSpread = document.querySelector("#btn-spread");
// ambil tombol penguji spread.

const tombolRest = document.querySelector("#btn-rest");
// ambil tombol penguji rest.

const kotakHasil = document.querySelector("#kotak-hasil");
// ambil elemen penampil hasil.

// ================================================================
// CONTOH 1: SPREAD (Menabur & Menggabungkan Array)
// ================================================================
tombolSpread.addEventListener("click", () => {
  const makananRingan = ["Keripik", "Kacang"];
  const makananBerat = ["Nasi Goreng", "Sate"];

  // Buka toples kedua array dan satukan ke piring baru:
  const menuLengkap = [...makananRingan, ...makananBerat, "Es Teh Manis"];
  // sebarkan isi makananRingan, sebarkan makananBerat, dan tambah 1 minuman baru.

  kotakHasil.innerHTML = `
    <strong>Hasil Gabungan Menu (Spread):</strong><br>
    ${menuLengkap.join(" • ")}
  `;
});

// ================================================================
// CONTOH 2: REST (Mengambil Juara 1 & Mengemas Sisanya ke Array Baru)
// ================================================================
tombolRest.addEventListener("click", () => {
  const pesertaLomba = ["Andi (Juara 1)", "Budi", "Cici", "Doni", "Eka"];

  // Ambil orang pertama, dan kemas sisa nama ke wadah 'kruCadangan':
  const [pemenangUtama, ...kruCadangan] = pesertaLomba;
  // tanda ... di depan kruCadangan adalah REST (mengumpulkan sisa).

  kotakHasil.innerHTML = `
    <p><strong>Pemenang Utama:</strong> ${pemenangUtama}</p>
    <p><strong>Sisa Peserta (${kruCadangan.length} orang):</strong> ${kruCadangan.join(", ")}</p>
  `;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Catatan Penting: Salinan Dangkal (_Shallow Copy_)**:
   Spread `{ ...dataAsli }` hanya menyalin properti di tingkat terluar. Jika di dalam objek Anda ada objek anak lain `{ data: { skor: 10 } }`, objek anak tersebut masih berbagi alamat memori yang sama.
2. **Posisi Rest Selalu Paling Ujung**:
   Operator rest selalu ditempatkan di posisi paling terakhir `const [a, ...sisa] = list;`. Menaruh rest di tengah `[...sisa, z]` adalah tindakan ilegal dan akan memicu error sintaks.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik tombol **"1. Tabur Gabung Array (Spread)"** $\to$ amati bagaimana dua array berbeda dan satu item tambahan melebur menjadi satu urutan menu utuh.
- [ ] Klik tombol **"2. Kemas Sisa Tim (Rest)"** $\to$ perhatikan nama pemenang pertama terpisah secara bersih dan 4 sisa nama lainnya otomatis terkumpul ke dalam array kru cadangan.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu bahwa `...` saat membongkar array/objek disebut Spread, dan saat mengumpulkan sisa elemen disebut Rest**.

---

## 🎯 Uji Pemahaman Mandiri

1. Jika Anda memiliki objek `const tema = { warna: "biru", ukuran: "sedang" }`, lalu membuat `const temaBaru = { ...tema, warna: "merah" }`, apa warna akhir yang ada di dalam `temaBaru`?
2. Mengapa operator rest `...sisa` dilarang diletakkan di awal atau di tengah-tengah urutan variabel?
