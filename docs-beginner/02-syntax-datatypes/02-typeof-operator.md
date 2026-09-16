---
title: "Panduan Pemula: Operator typeof di JavaScript"
tags: "javascript, first-principles, roadmap-js/02-syntax-datatypes"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof"
---

# Panduan Pemula: Operator typeof di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Operator `typeof` adalah alat pemindai cepat (_scanner_) bawaan JavaScript yang membaca sebuah ekspresi dan mengembalikan kategori tipe datanya dalam bentuk **string teks resmi**.

---

## 1. Analogi Logis: Pemindai Barcode di Kasir Supermarket

Bayangkan Anda bekerja sebagai kasir di supermarket:

- Di meja kasir ada alat pemindai (_barcode scanner_).
- Saat Anda memindai sebotol susu, layar kasir memunculkan kategori: `"Minuman"`.
- Saat Anda memindai sebungkus apel, layar kasir memunculkan kategori: `"Buah"`.

Operator `typeof` bekerja persis seperti alat pemindai tersebut: Anda meletakkan nilai apa pun di belakangnya, dan ia akan menjawab dengan salah satu dari **8 label string resmi JavaScript**:

| Input Uji        | Hasil `typeof` | Catatan Penting                                                           |
| :--------------- | :------------- | :------------------------------------------------------------------------ |
| `"Halo"`         | `"string"`     | Teks karakter                                                             |
| `42` / `3.14`    | `"number"`     | Angka bulat / desimal                                                     |
| `NaN`            | `"number"`     | _Not-a-Number_ tetap tergolong angka di spesifikasi IEEE 754!             |
| `true` / `false` | `"boolean"`    | Logika benar/salah                                                        |
| `undefined`      | `"undefined"`  | Belum diinisialisasi nilainya                                             |
| `Symbol("id")`   | `"symbol"`     | Identifier unik                                                           |
| `100n`           | `"bigint"`     | Bilangan bulat raksasa                                                    |
| `function() {}`  | `"function"`   | Objek fungsi khusus yang bisa dipanggil                                   |
| `{}` / `[]`      | `"object"`     | Objek biasa maupun Array                                                  |
| `null`           | `"object"`     | **Bug historis 1995!** Bukan objek sejati melainkan nilai primitif kosong |

---

## 2. Mengapa Membutuhkan `typeof`? (First Principles)

Di JavaScript, variabel tidak terikat pada satu tipe data (_dynamically typed_). Dua alasan fundamental mengapa `typeof` operator dibutuhkan:

1. **Fakta Kritis Input HTML**: Ketika pengguna mengetik angka di form HTML (meskipun tag HTML bertuliskan `<input type="number">`), browser **SELALU membaca properti `.value` tersebut sebagai teks (`string`)**! Jika tidak dicek dan dikonversi, `"10" + "5"` akan menjadi `"105"` (penyambungan teks).
2. **Pemeriksaan Aman Variabel yang Belum Dibuat (_Undeclared Safety Check_)**:
   Jika Anda mencoba membaca variabel yang tidak pernah dideklarasikan, browser akan melempar error fatal:
   ```javascript
   console.log(variabelGaib); // Error: ReferenceError: variabelGaib is not defined
   ```
   Namun `typeof` memiliki kekebalan khusus—ia adalah satu-satunya operator yang aman memeriksa variabel asing tanpa memicu crash:
   ```javascript
   if (typeof variabelGaib === "undefined") {
     console.log("Aman! Variabel belum tersedia.");
   }
   ```

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat pendeteksi tipe data input formulir:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Operator typeof</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 340px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      input,
      button {
        padding: 8px;
        margin-top: 8px;
        width: 100%;
        box-sizing: border-box;
      }
      .hasil-box {
        margin-top: 12px;
        padding: 8px;
        background: #f4f4f4;
        border-radius: 4px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Pendeteksi Tipe Data Input</h3>
      <label for="input-usia">Masukkan Usia Anda:</label>
      <input type="number" id="input-usia" value="25" />

      <button type="button" id="btn-cek">Cek Tipe Data via typeof</button>

      <div class="hasil-box">
        <p>Nilai Mentah: <strong id="nilai-output">-</strong></p>
        <p>Tipe Asli dari Input: <strong id="tipe-output">-</strong></p>
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen HTML yang dibutuhkan
// ambil elemen kotak isian input berdasarkan ID-nya
const usiaInput = document.querySelector("#input-usia");

// ambil elemen tombol berdasarkan ID-nya
const cekBtn = document.querySelector("#btn-cek");

// ambil elemen penampil nilai berdasarkan ID-nya
const nilaiOut = document.querySelector("#nilai-output");

// ambil elemen penampil tipe berdasarkan ID-nya
const tipeOut = document.querySelector("#tipe-output");

// 2. Pasang aksi ketika tombol diklik
// saat tombol diklik, jalankan fungsi berikut:
cekBtn.addEventListener("click", () => {
  // baca nilai yang sedang tertulis di kotak input (meskipun input bertipe number, hasilnya selalu string!)
  const nilaiMentah = usiaInput.value;

  // gunakan operator typeof untuk memindai tipe data dari variabel nilaiMentah
  const hasilTipe = typeof nilaiMentah;

  // tampilkan nilai mentah ke layar dengan tanda petik agar terlihat bahwa ini teks
  nilaiOut.textContent = `"${nilaiMentah}"`;

  // tampilkan hasil deteksi typeof ke layar (akan memunculkan kata 'string')
  tipeOut.textContent = hasilTipe;

  // beri warna merah sebagai bukti visual bahwa input HTML masih berupa string teks
  tipeOut.style.color = "red";
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan `Array.isArray(data)` untuk mengecek Array**:
   Karena di JavaScript Array adalah turunan dari Objek, `typeof [1, 2, 3]` selalu menghasilkan `"object"`. Untuk memastikan sebuah data adalah deret array asli, gunakan fungsi bawaan:
   ```javascript
   Array.isArray([1, 2, 3]); // true
   Array.isArray({ nama: "Ari" }); // false
   ```
2. **Hati-hati dengan `null`**:
   Karena `typeof null` menghasilkan `"object"`, selalu periksa kebenaran objek dengan mengecek nilainya bukan `null`:
   ```javascript
   if (typeof data === "object" && data !== null) {
     // Aman! Benar-benar sebuah objek, bukan null.
   }
   ```

---

## 5. Checklist Praktik Mandiri

- [x] Buka `index.html` di browser dan klik tombol **"Cek Tipe Data"**.
- [x] Perhatikan bahwa meskipun inputnya angka `25`, `typeof` tetap menjawab `"string"`.
- [x] Buka Console browser (`F12`), ketik `typeof null` dan amati hasilnya `"object"`.
- [x] Ketik `typeof NaN` di Console dan amati bahwa hasilnya adalah `"number"`.
- [x] Ketik `typeof variabelTakPernahDibuat` dan buktikan tidak terjadi error crash.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Menyadari bahwa seluruh nilai dari input form HTML selalu dibaca sebagai teks (`string`), dan tahu 8 string resmi hasil kembalian `typeof`**.

---

## 🎯 Uji Pemahaman Mandiri

Tebak apa hasil keluaran dari perintah berikut sebelum Anda mencobanya di DevTools Console:

```javascript
// Pertanyaan:
// 1. Apakah hasil dari typeof "JavaScript"?
// 2. Apakah hasil dari typeof (10 / "kucing")? (Petunjuk: 10 / "kucing" menghasilkan NaN)
// 3. Apakah hasil dari typeof null? Mengapa?
// 4. Bagaimana cara membedakan secara pasti antara array [1, 2] dengan objek biasa { a: 1 }?
```
