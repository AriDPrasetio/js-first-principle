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
// 1. Ubah teks "123" menjadi angka — konversi berhasil, menghasilkan angka 123
Number("123");
// 2. Ubah teks "kucing" menjadi angka — konversi gagal, menghasilkan nilai khusus NaN
// Catatan*: NaN (Not-a-Number) bukan error crash — JavaScript mengembalikannya sebagai tanda kegagalan kalkulasi
Number("kucing");
```

Untuk memeriksa apakah suatu perhitungan menghasilkan angka sah atau gagal, gunakan `Number.isNaN()`:

```javascript
// 1. Konversi "kucing" ke angka dulu, hasilnya NaN, lalu periksa apakah itu NaN — hasilnya true
// Catatan*: gunakan Number.isNaN() dan bukan isNaN() — isNaN() yang lama punya hasil tidak terduga
Number.isNaN(Number("kucing"));
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
// 1. Ambil elemen input jumlah beli dari halaman berdasarkan ID-nya, simpan ke wadah qtyInput
const qtyInput = document.querySelector("#qty-input");

// 2. Ambil elemen tombol hitung dari halaman berdasarkan ID-nya, simpan ke wadah calcBtn
const calcBtn = document.querySelector("#btn-calc");

// 3. Ambil elemen penampil bug dari halaman berdasarkan ID-nya, simpan ke wadah bugEl
const bugEl = document.querySelector("#coercion-bug");

// 4. Ambil elemen penampil solusi dari halaman berdasarkan ID-nya, simpan ke wadah fixedEl
const fixedEl = document.querySelector("#conversion-fixed");

// 5. Pasang pendengar klik pada tombol calcBtn — setiap kali diklik, blok ini berjalan
calcBtn.addEventListener("click", () => {
  // 6. Baca nilai yang tertulis di kotak input, simpan ke variabel inputVal
  // Catatan*: nilai dari .value selalu bertipe string — angka "3" yang diketik pengguna dibaca sebagai teks "3"
  const inputVal = qtyInput.value;

  // 7. Simpan angka bonus 2 (bertipe number) ke variabel bonus
  const bonus = 2;

  // BAHAYA IMPLICIT COERCION:
  // 8. Jumlahkan inputVal (string) dengan bonus (number) menggunakan tanda '+'
  // Catatan*: karena salah satunya string, tanda '+' beralih fungsi menjadi penyambung teks — "3" + 2 = "32"
  const buggyResult = inputVal + bonus;

  // 9. Tampilkan hasil yang salah ke layar agar perbedaannya terlihat jelas
  bugEl.textContent = `Bug Coercion ("${inputVal}" + ${bonus}) = ${buggyResult} item (Salah!)`;

  // SOLUSI EKSPLISIT CONVERSION:
  // 10. Ubah teks inputVal menjadi angka murni menggunakan Number() sebelum dijumlahkan
  const angkaMurni = Number(inputVal);

  // 11. Periksa apakah hasil konversi adalah NaN (artinya input bukan angka yang sah)
  if (Number.isNaN(angkaMurni)) {
    // 12. Jika NaN, tampilkan pesan error dan hentikan eksekusi lebih lanjut
    fixedEl.textContent = "Error: Input bukan angka yang valid!";
    fixedEl.style.color = "red";
    return;
  }

  // 13. Hitung total barang menggunakan angkaMurni — kali ini operasinya matematika sungguhan
  const correctResult = angkaMurni + bonus;

  // 14. Tampilkan hasil perhitungan yang benar ke layar
  fixedEl.textContent = `Solusi Conversion (Number("${inputVal}") + ${bonus}) = ${correctResult} item (Benar!)`;
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
  // 1. Evaluasi string kosong — hasilnya false
  Boolean("");
  // 2. Evaluasi string berisi spasi — hasilnya true (ada spasi!)
  Boolean(" ");
  // 3. Evaluasi array kosong — hasilnya true (array kosong tetap Truthy!)
  Boolean([]);
  // 4. Evaluasi objek kosong — hasilnya true (objek kosong tetap Truthy!)
  Boolean({});
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
