---
title: "Panduan Pemula: Expression vs Statement di JavaScript"
tags: "javascript, first-principles, roadmap-js/02-syntax-datatypes"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators"
---

# Panduan Pemula: Expression vs Statement di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Setiap baris kode JavaScript yang Anda tulis selalu terbagi menjadi dua peran:
>
> 1. **Expression (Ekspresi)**: Satuan kode yang **menghasilkan sebuah nilai** (seperti frasa kata yang punya arti/harga).
> 2. **Statement (Pernyataan)**: Kalimat instruksi lengkap yang **melakukan suatu tindakan** (seperti kalimat perintah kepada komputer).

---

## 1. Analogi Logis: Frasa Kata vs Kalimat Perintah

Bayangkan Anda sedang berada di dapur sebuah restoran:

### A. Expression (Frasa Kata / Bahan Baku yang Punya Nilai)

Ketika seseorang berkata: _"Dua butir telur"_ atau _"5 + 5"_, ucapan itu belum memerintahkan apa-apa, tetapi ucapan tersebut **menghasilkan sesuatu yang bernilai**:

- Nilai dari `"Dua butir telur"` adalah bahannya itu sendiri.
- Nilai dari `5 + 5` adalah angka `10`.
- Karena memiliki nilai, ekspresi bisa Anda masukkan ke dalam wadah mangkuk (variabel) atau disodorkan ke koki lain (sebagai argumen fungsi).

### B. Statement (Kalimat Perintah Penuh)

Ketika kepala koki berteriak: _"Rebus telur itu sekarang!"_ atau _"Jika air mendidih, masukkan mi!"_:

- Ini adalah kalimat perintah utuh (_Statement_).
- Kalimat perintah ini **menggerakkan alur kerja**, bukan menghasilkan barang untuk disimpan.
- Anda tidak bisa menyimpan kalimat perintah ke dalam wadah mangkuk. Anda tidak bisa berkata: _"Tampung perintah 'rebus telur' ke dalam piring!"_—itu tidak masuk akal.

---

## 2. Mengapa JavaScript Didesain Seperti Ini? (First Principles)

### 1. Cara Paling Ampuh Membedakannya: "Tes Sisi Kanan Sama Dengan (`=`)"

Aturan emas termudah untuk membedakan Expression vs Statement:

> **Jika suatu kode bisa Anda letakkan di sebelah kanan tanda `const x = ... ;`, maka kode itu adalah EXPRESSION.**  
> Jika kode tersebut memicu error merah di layar saat diletakkan di situ, maka ia adalah **STATEMENT**.

```javascript
// ✅ BISA DITARUH DI KANAN: Semuanya adalah EXPRESSION!
// 1. Simpan angka literal 10 ke variabel a — angka literal langsung menghasilkan nilai
const a = 10;
// 2. Hitung 5 + 5 lalu simpan hasilnya ke variabel b — operasi matematika menghasilkan nilai
const b = 5 + 5;
// 3. Gabungkan dua teks lalu simpan hasilnya ke variabel c — penyambungan teks menghasilkan nilai
const c = "Halo " + "Dunia";
// 4. Panggil Math.random() lalu simpan nilainya ke variabel d — pemanggilan fungsi menghasilkan nilai
const d = Math.random();
// 5. Evaluasi ternary lalu simpan hasilnya ke variabel e — ternary memilih satu dari dua nilai
const e = true ? "Buka" : "Tutup";

// ❌ GAGAL TOTAL: STATEMENT tidak bisa ditaruh di sebelah kanan!
// 6. Coba simpan blok if ke variabel f — memicu error karena if adalah instruksi, bukan nilai
// const f = if (true) { "Buka" }; // ERROR! SyntaxError: Unexpected token 'if'
// 7. Coba simpan pengulangan for ke variabel g — memicu error dengan alasan yang sama
// const g = for (let i = 0; i < 3; i++) {}; // ERROR! SyntaxError
```

### 2. Expression Statement: Mengubah Frasa Menjadi Kalimat

Sebuah ekspresi bisa diubah menjadi satu kalimat instruksi mandiri cukup dengan menambahkan tanda titik koma (`;`) di ujungnya:

```javascript
// 1. Tulis ekspresi '10 + 20' diakhiri titik koma — ekspresi ini menjadi instruksi mandiri (expression statement)
// Catatan*: hasilnya tidak disimpan ke variabel mana pun, nilai 30 langsung dibuang
10 + 20;

// 2. Panggil console.log("Hai") diakhiri titik koma — instruksi ini langsung mencetak teks ke konsol
console.log("Hai");
```

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Salin kode di bawah ini ke dalam satu folder untuk menguji langsung perbedaan keduanya di browser:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Expression vs Statement</title>
    <style>
      body {
        font-family:
          system-ui,
          -apple-system,
          sans-serif;
        padding: 20px;
        background: #f8fafc;
      }
      .card {
        max-width: 420px;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
      .output {
        margin-top: 14px;
        padding: 12px;
        border-radius: 6px;
        background: #e2e8f0;
        font-family: monospace;
        font-size: 14px;
      }
      button {
        padding: 8px 12px;
        margin-top: 8px;
        margin-right: 6px;
        cursor: pointer;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        background: #f1f5f9;
      }
      button:hover {
        background: #e2e8f0;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h3>Laboratorium Expression vs Statement</h3>
      <p>Klik tombol untuk menguji bagaimana JavaScript mengevaluasi kode:</p>

      <button id="btn-expression">Uji Expression (Ternary)</button>
      <button id="btn-statement">Uji Statement (if/else)</button>

      <div id="kotak-hasil" class="output">Klik salah satu tombol...</div>
    </div>

    <script src="app.js"></script>
  </body>
</html>
```

### Berkas 2: `app.js`

```javascript
// 1. Ambil tiga elemen antarmuka dari halaman berdasarkan ID-nya
const tombolExpression = document.getElementById("btn-expression");
const tombolStatement = document.getElementById("btn-statement");
const kotakHasil = document.getElementById("kotak-hasil");

// HOF TIPE 1: PENGUJIAN EXPRESSION
// 2. Pasang pendengar klik pada tombol Expression — blok ini berjalan setiap kali tombol diklik
tombolExpression.addEventListener("click", () => {
  // 3. Simpan angka 14 ke variabel jamSekarang sebagai jam yang sedang disimulasikan
  const jamSekarang = 14;

  // 4. Evaluasi ternary: jika jam antara 9-17 hasilkan "TOKO BUKA", selainnya "TOKO TUTUP"
  // Catatan*: ternary adalah EXPRESSION — hasilnya langsung bisa disimpan ke variabel statusToko
  const statusToko =
    jamSekarang >= 9 && jamSekarang <= 17 ? "TOKO BUKA" : "TOKO TUTUP";

  // 5. Tampilkan nilai statusToko ke dalam kotak hasil di layar
  kotakHasil.innerHTML = `
    <strong>Hasil Expression:</strong><br>
    Nilai langsung disimpan ke variabel: <code>"${statusToko}"</code>
  `;
});

// HOF TIPE 2: PENGUJIAN STATEMENT
// 6. Pasang pendengar klik pada tombol Statement — blok ini berjalan setiap kali tombol diklik
tombolStatement.addEventListener("click", () => {
  // 7. Simpan angka 20 ke variabel jamSekarang sebagai jam yang sedang disimulasikan
  const jamSekarang = 20;
  // 8. Siapkan wadah kosong statusToko yang akan diisi oleh blok if/else di bawah
  let statusToko = "";

  // 9. Jalankan blok if/else untuk menentukan isi statusToko — if/else adalah STATEMENT, bukan ekspresi
  if (jamSekarang >= 9 && jamSekarang <= 17) {
    statusToko = "TOKO BUKA";
  } else {
    statusToko = "TOKO TUTUP";
  }

  // 10. Tampilkan nilai statusToko yang sudah diisi ke dalam kotak hasil di layar
  kotakHasil.innerHTML = `
    <strong>Hasil Statement (if/else):</strong><br>
    Instruksi dijalankan berurutan: <code>"${statusToko}"</code>
  `;
});
```

---

## 4. Checklist Praktik & Uji Pemahaman Mandiri

- [x] Buka DevTools (F12) -> tab **Console**. Ketik `5 * 4`, lalu tekan Enter. Amati bahwa konsol langsung mencetak nilai `20` (ini membuktikan `5 * 4` adalah _Expression_).
- [x] Di konsol yang sama, ketik `if (true) { console.log("hai"); }`. Perhatikan bahwa konsol mengeksekusi instruksinya, tetapi tidak menghasilkan nilai kembalian untuk disimpan.
- [x] Cobalah memasukkan `const x = if (true) { 1 };` di konsol dan perhatikan pesan kesalahan yang muncul.

### 🎯 Kuis Mandiri (Tanpa Intip Jawaban):

1. Mengapa di dalam kurung kurawal JSX React `{ ... }` kita boleh menulis `user.isOnline ? "Aktif" : "Offline"`, tetapi dilarang menulis `{ if (user.isOnline) { "Aktif" } }`?
2. Apakah pemanggilan fungsi `hitungTotal()` termasuk Expression atau Statement? Mengapa?
3. Sebutkan 3 contoh Expression dan 3 contoh Statement yang Anda temui dalam kode sehari-hari!
