---
title: "Panduan Pemula: Type Casting (Coercion vs Conversion) di JavaScript"
tags: "javascript, first-principles, roadmap-js/02-syntax-datatypes"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion"
---

# Panduan Pemula: Type Casting (Coercion vs Conversion) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Type Casting adalah proses mengubah jenis data dari satu tipe ke tipe lain. Jika Anda melakukannya secara sadar, itu disebut **Type Conversion** (Aman dan terprediksi). Jika komputer yang menebak dan mengubahnya otomatis di belakang layar, itu disebut **Type Coercion** (Sering memicu bug tersembunyi).

---

## 1. Analogi Logis: Penerjemah Resmi vs Tebakan Otomatis

### A. Implicit Coercion (Tebakan Otomatis Komputer)

Bayangkan Anda memesan makanan di restoran luar negeri dengan campuran dua bahasa.

- Pelayan restoran **mencoba menebak-nebak sendiri** apa maksud Anda.
- Terkadang tebakannya benar, tetapi sering kali ia salah paham dan membawakan makanan yang sama sekali tidak Anda inginkan.

Inilah **Type Coercion**: JavaScript berusaha "membantu" dengan mengonversi tipe data secara diam-diam saat Anda mengoperasikan dua tipe data yang berlainan.

---

### B. Explicit Conversion (Penerjemah Resmi yang Pasti)

Sekarang bayangkan Anda menyewa seorang penerjemah resmi profesional.

- Anda dengan sengaja dan tegas memerintahkan penerjemah: _"Tolong ubah teks ini menjadi angka murni."_
- Hasilnya terjamin akurat, tidak ada tebak-tebakan, dan sistem menerima data sesuai kontrak.

Inilah **Type Conversion**: Anda secara terang-terangan memanggil fungsi konstruktor standar seperti `Number(input)`, `String(nilai)`, atau `Boolean(kondisi)`.

---

## 2. Mengapa Terjadi Bug Penjumlahan Aneh? (First Principles)

### A. Perilaku Tanda Tambah (`+`) vs Operator Aritmatika Lain

Di JavaScript, tanda tambah (`+`) memiliki **dua fungsi yang bertabrakan**:

1. **Penjumlahan Matematika**: `10 + 5` $\to$ `15`.
2. **Penyambungan Teks (Concatenation)**: `'Halo ' + 'Budi'` $\to$ `'Halo Budi'`.

**Hukum Prioritas String**:
Jika salah satu operan pada tanda `+` adalah string, JavaScript secara otomatis memaksa operan pasangannya menjadi string:

- `'3' + 2` $\to$ menghasilkan `'32'` (Bukan 5!).

Sebaliknya, operator `-`, `*`, dan `/` **tidak memiliki fungsi teks sama sekali**. Karena itu, JavaScript memaksa string menjadi angka:

- `'5' - 2` $\to$ menghasilkan `3`.
- `'10' * '2'` $\to$ menghasilkan `20`.

### B. Bagaimana Jika Konversi Numerik Gagal? (Nilai `NaN`)

Jika Anda memaksa teks non-angka menjadi angka menggunakan `Number()`, JavaScript tidak akan melempar crash error, melainkan mengembalikan nilai khusus **`NaN` (_Not-a-Number_)**:

```javascript
Number("123"); // 123 (Berhasil)
Number("kucing"); // NaN (Gagal menjadi angka yang sah!)
```

Untuk memeriksa apakah suatu perhitungan menghasilkan angka sah atau gagal, gunakan `Number.isNaN()`:

```javascript
Number.isNaN(Number("kucing")); // true
```

### C. 8 Nilai Falsy Resmi di JavaScript

Saat Anda mengonversi nilai apa pun ke tipe logika menggunakan `Boolean(nilai)`, JavaScript memiliki aturan mutlak: **Hanya ada 8 nilai di seluruh JavaScript yang bernilai `false` (_Falsy_)**:

| Nilai Falsy          | Tipe Asal   | Penjelasan                      |
| :------------------- | :---------- | :------------------------------ |
| `false`              | `boolean`   | Nilai boolean salah itu sendiri |
| `0`                  | `number`    | Angka nol positif               |
| `-0`                 | `number`    | Angka nol negatif               |
| `0n`                 | `bigint`    | Angka nol pada BigInt           |
| `""` (string kosong) | `string`    | Teks tanpa karakter sama sekali |
| `null`               | `null`      | Nilai kosong primitif           |
| `undefined`          | `undefined` | Belum diinisialisasi            |
| `NaN`                | `number`    | Hasil kalkulasi angka gagal     |

> [!IMPORTANT]
> **Golden Rule of Truthy**:
> Selain 8 nilai di atas, **seluruh nilai lain di JavaScript adalah `true` (_Truthy_)**—termasuk string spasi `" "`, array kosong `[]`, dan objek kosong `{}`!

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buktikan bahaya Coercion dan solusi Conversion pada keranjang belanja:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Type Casting</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      input,
      button {
        padding: 8px;
        margin-top: 6px;
        width: 100%;
        box-sizing: border-box;
      }
      .hasil {
        margin-top: 12px;
        padding: 8px;
        border-radius: 4px;
        background: #f9f9f9;
      }
      .error-text {
        color: #cc0000;
        font-weight: bold;
      }
      .success-text {
        color: #008800;
        font-weight: bold;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Kalkulator Barang + Bonus</h3>
      <label for="qty-input">Jumlah Beli (Dapat Bonus 2):</label>
      <input type="number" id="qty-input" value="3" />

      <button type="button" id="btn-calc">Hitung Total Barang</button>

      <div class="hasil">
        <p id="coercion-bug" class="error-text">Hasil Coercion: -</p>
        <p id="conversion-fixed" class="success-text">Hasil Conversion: -</p>
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen yang dibutuhkan
const qtyInput = document.querySelector("#qty-input");
// ambil elemen input jumlah beli dengan ID 'qty-input', simpan ke wadah qtyInput.

const calcBtn = document.querySelector("#btn-calc");
// ambil tombol hitung dengan ID 'btn-calc', simpan ke wadah calcBtn.

const bugEl = document.querySelector("#coercion-bug");
// ambil elemen penampil bug dengan ID 'coercion-bug', simpan ke wadah bugEl.

const fixedEl = document.querySelector("#conversion-fixed");
// ambil elemen penampil solusi benar dengan ID 'conversion-fixed', simpan ke wadah fixedEl.

// 2. Pasang aksi ketika tombol hitung diklik
calcBtn.addEventListener("click", () => {
  // saat tombol diklik, jalankan perintah di dalam blok ini:

  const inputVal = qtyInput.value;
  // ambil nilai yang diketik pengguna (ingat: nilainya bertipe string, contohnya teks "3").

  const bonus = 2;
  // bonus tambahan sebanyak 2 barang (bertipe number).

  // BAHAYA IMPLICIT COERCION:
  const buggyResult = inputVal + bonus;
  // karena inputVal bertipe string "3", tanda '+' malah menyambung teks menjadi "3" + 2 = "32".

  bugEl.textContent = `Bug Coercion ("${inputVal}" + ${bonus}) = ${buggyResult} item (Salah!)`;
  // tampilkan hasil salah tersebut ke layar.

  // SOLUSI EKSPLISIT CONVERSION:
  const angkaMurni = Number(inputVal);
  // gunakan fungsi Number() untuk mengubah teks "3" menjadi angka 3 sebelum dijumlahkan.

  if (Number.isNaN(angkaMurni)) {
    fixedEl.textContent = "Error: Input bukan angka yang valid!";
    fixedEl.style.color = "red";
    return;
  }

  const correctResult = angkaMurni + bonus;
  fixedEl.textContent = `Solusi Conversion (Number("${inputVal}") + ${bonus}) = ${correctResult} item (Benar!)`;
  // tampilkan hasil perhitungan matematika yang benar ke layar.
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu gunakan `Number()` untuk data input formulir**: Sebelum menghitung kuantitas atau nominal uang, pastikan data dibungkus `Number(input.value)`.
2. **Gunakan `String()` untuk serialisasi**: Contoh: `String(100)` menghasilkan `"100"`.
3. **Pahami 8 Nilai Falsy untuk Validasi**: Saat Anda menulis `if (namaPengguna)`, ingat bahwa string kosong `""` dianggap bernilai false, sehingga blok `if` tidak akan dijalankan.

---

## 5. Checklist Praktik Mandiri

- [x] Buka `index.html` di browser dan klik tombol **"Hitung Total Barang"**.
- [x] Amati bagaimana hasil Coercion menghasilkan `32 item`, sedangkan Conversion menghasilkan `5 item`.
- [x] Buka DevTools Console (`F12`), coba uji coba tabel kebenaran ini:
  ```javascript
  Boolean(""); // false
  Boolean(" "); // true (ada spasi!)
  Boolean([]); // true (array kosong tetap Truthy!)
  Boolean({}); // true (objek kosong tetap Truthy!)
  ```

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham materi ini jika: **Tidak pernah lagi menjumlahkan nilai dari input formulir tanpa membungkusnya dengan `Number()` terlebih dahulu, dan hafal 8 nilai Falsy di JavaScript**.

---

## 🎯 Uji Pemahaman Mandiri

Coba tebak apa hasil keluaran dari operasi-operasi ini sebelum Anda mencobanya di konsol:

```javascript
let hasilA = "10" - 2;
let hasilB = "10" + 2;
let hasilC = Number("sepuluh");
let hasilD = Boolean([]);

// Pertanyaan:
// 1. Berapakah hasilA?
// 2. Berapakah hasilB?
// 3. Apakah nilai dari hasilC?
// 4. Apakah nilai dari hasilD (true atau false)? Mengapa?
```
