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
const a = 10; // Angka literal adalah ekspresi
const b = 5 + 5; // Operasi matematika adalah ekspresi
const c = "Halo " + "Dunia"; // Penggabungan teks adalah ekspresi
const d = Math.random(); // Pemanggilan fungsi menghasilkan nilai (ekspresi)
const e = true ? "Buka" : "Tutup"; // Ternary menghasilkan nilai (ekspresi)

// ❌ GAGAL TOTAL: STATEMENT tidak bisa ditaruh di sebelah kanan!
// const f = if (true) { "Buka" }; // ERROR! SyntaxError: Unexpected token 'if'
// const g = for (let i = 0; i < 3; i++) {}; // ERROR! SyntaxError
```

### 2. Expression Statement: Mengubah Frasa Menjadi Kalimat

Sebuah ekspresi bisa diubah menjadi satu kalimat instruksi mandiri cukup dengan menambahkan tanda titik koma (`;`) di ujungnya:

```javascript
// '10 + 20' adalah Expression (menghasilkan 30)
// '10 + 20;' adalah Expression Statement (perintah mandiri untuk menghitung)
10 + 20;

// 'console.log("Hai")' adalah Expression (pemanggilan fungsi)
// Ditambah ';' menjadi Expression Statement (perintah eksekusi cetak teks)
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
// Menangkap elemen antarmuka
const tombolExpression = document.getElementById("btn-expression");
const tombolStatement = document.getElementById("btn-statement");
const kotakHasil = document.getElementById("kotak-hasil");

// 1. PENGUJIAN EXPRESSION:
// Ternary operator adalah EXPRESSION karena menghasilkan nilai yang langsung
// bisa disimpan ke variabel 'statusToko'.
tombolExpression.addEventListener("click", () => {
  const jamSekarang = 14;

  // Sisi kanan tanda '=' mengevaluasi nilai secara langsung:
  const statusToko =
    jamSekarang >= 9 && jamSekarang <= 17 ? "TOKO BUKA" : "TOKO TUTUP";

  kotakHasil.innerHTML = `
    <strong>Hasil Expression:</strong><br>
    Nilai langsung disimpan ke variabel: <code>"${statusToko}"</code>
  `;
});

// 2. PENGUJIAN STATEMENT:
// 'if...else' adalah STATEMENT. Ia tidak menghasilkan nilai langsung, melainkan
// menjalankan blok instruksi di dalamnya.
tombolStatement.addEventListener("click", () => {
  const jamSekarang = 20;
  let statusToko = ""; // Siapkan variabel penampung terlebih dahulu

  // Statement mengendalikan ke mana alur logika harus melompat:
  if (jamSekarang >= 9 && jamSekarang <= 17) {
    statusToko = "TOKO BUKA";
  } else {
    statusToko = "TOKO TUTUP";
  }

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
