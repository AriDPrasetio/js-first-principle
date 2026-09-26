---
title: "Panduan Pemula: Kesetaraan Strict (===) vs Loose (==) di JavaScript"
tags: "javascript, first-principles, roadmap-js/02-syntax-datatypes"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality"
---

# Panduan Pemula: Equality - Strict (===) vs Loose (==) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Operator `===` (_Strict Equality_) membandingkan tipe data DAN nilainya secara jujur tanpa manipulasi. Operator `==` (_Loose Equality_) mencoba mengubah-ubah tipe data di belakang layar (_coercion_) sebelum membandingkan, sering kali menghasilkan kesimpulan keliru yang membahayakan alur program.

---

## 1. Analogi Logis: Petugas Imigrasi Bandara

### A. Operator `===` (Pemeriksaan Ketat & Disiplin)

Bayangkan petugas imigrasi yang sangat disiplin di bandara internasional:

- Anda harus menunjukkan identitas asli: **KTP asli** dan **Paspor asli**.
- Jika Anda membawa fotokopi atau format dokumen yang tidak sesuai, petugas langsung menolak: _"Maaf, tipenya berbeda, tidak boleh lewat."_

Inilah `===` (_Strict Equality_): Jika tipe datanya berbeda (misal teks `"0"` vs angka `0`), ia langsung menjawab **`false`**. Begitu pula kebalikannya, operator **`!==`** (_Strict Inequality_) memastikan kedua nilai tidak identik baik dari segi tipe maupun nilai.

---

### B. Operator `==` (Penjaga yang Terlalu Banyak Kompromi)

Sekarang bayangkan penjaga yang serba mentolerir:

- Anda tidak membawa paspor, hanya membawa secarik kertas coret-coretan. Penjaga berkata: _"Ah tidak apa-apa, kertas ini saya anggap mirip paspor saja ya."_
- Akibatnya, orang yang tidak berhak bisa lolos masuk.

Inilah `==` (_Loose Equality_): Ia memaksakan konversi tipe data otomatis sampai ketemu kemiripan semu. Misalnya, angka `0` dianggap sama dengan teks kosong `""` atau teks `"0"`.

---

## 2. Mengapa Ini Penting untuk Pemula? (First Principles)

### A. Jebakan Form Input Web

Di antarmuka web, dropdown pilihan (`<select>`) selalu mengembalikan nilai bertipe string:

- Opsi pertama mengembalikan teks `"0"`.
- Jika Anda mengecek status akun memakai `== false`:
  JavaScript mengonversi teks `"0"` menjadi `false` (`"0" == false` bernilai `true`!). Akibatnya, pengguna level 0 keliru dianggap nonaktif.
- Dengan `===`, teks `"0"` dan boolean `false` tidak akan tertukar karena tipe datanya berbeda (`string` vs `boolean`).

### B. Bagaimana `===` Membandingkan Objek dan Array?

Banyak pemula terkejut saat membandingkan dua objek atau array yang isinya tampak sama persis:

```javascript
// 1. Bandingkan dua objek berbeda yang isinya sama persis — hasilnya FALSE
// Catatan*: meskipun isinya identik, keduanya adalah objek baru yang menempati alamat memori berbeda
console.log({ id: 1 } === { id: 1 });
// 2. Bandingkan dua array berbeda yang kosong — hasilnya juga FALSE karena alasan yang sama
console.log([] === []);
```

**Mengapa `false`?**
Ingat First Principle dari Bab 2.1: Objek dan Array adalah **Reference Type**.
Operator `===` pada objek **tidak memeriksa isi propertinya**, melainkan memeriksa **apakah kedua variabel menunjuk ke alamat memori fisik yang sama di heap**:

```javascript
// 1. Buat objek userA berisi properti nama
const userA = { nama: "Ari" };
// 2. Salin alamat memori userA ke userB
const userB = userA;

// 3. Bandingkan userA dan userB dengan strict equality — hasilnya TRUE karena menunjuk ke memori yang sama
console.log(userA === userB);
```

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buktikan perbedaan perbandingan ini pada pemilihan status akun:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Strict vs Loose Equality</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      select,
      button {
        padding: 8px;
        margin-top: 8px;
        width: 100%;
        box-sizing: border-box;
      }
      .box {
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
      <h3>Pilih Status Pengguna:</h3>
      <select id="select-status">
        <option value="0">Tingkat 0 (Teks "0")</option>
        <option value="1">Tingkat 1 (Teks "1")</option>
      </select>

      <button type="button" id="btn-banding">Bandingkan dengan Angka 0</button>

      <div class="box">
        <p>Hasil Loose (== 0): <strong id="loose-out">-</strong></p>
        <p>Hasil Strict (=== 0): <strong id="strict-out">-</strong></p>
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen dropdown pilihan dari halaman berdasarkan ID-nya, simpan ke wadah selectEl
const selectEl = document.querySelector("#select-status");

// 2. Ambil tombol bandingkan dari halaman berdasarkan ID-nya, simpan ke wadah bandingBtn
const bandingBtn = document.querySelector("#btn-banding");

// 3. Ambil elemen penampil hasil loose equality dari halaman berdasarkan ID-nya, simpan ke wadah looseOut
const looseOut = document.querySelector("#loose-out");

// 4. Ambil elemen penampil hasil strict equality dari halaman berdasarkan ID-nya, simpan ke wadah strictOut
const strictOut = document.querySelector("#strict-out");

// 5. Pasang pendengar klik pada tombol bandingBtn — setiap kali diklik, blok ini berjalan
bandingBtn.addEventListener("click", () => {
  // 6. Baca nilai opsi yang dipilih, simpan ke variabel selectedValue
  // Catatan*: nilai ini bertipe string (contohnya teks "0")
  const selectedValue = selectEl.value;

  // 7. Simpan angka murni 0 (bertipe number) ke dalam variabel targetAngka
  const targetAngka = 0;

  // PENGUJIAN LOOSE EQUALITY (==):
  // 8. Periksa kesamaan loose antara selectedValue dan targetAngka, simpan hasilnya ke isLooseEqual
  const isLooseEqual = selectedValue == targetAngka;

  // 9. Tampilkan hasil perbandingan loose ke layar beserta penjelasannya
  looseOut.textContent = `${isLooseEqual} (Teks dipaksa dianggap sama dengan Angka)`;
  
  // 10. Ubah warna teks pada elemen looseOut menjadi merah
  looseOut.style.color = "red";

  // PENGUJIAN STRICT EQUALITY (===):
  // 11. Periksa kesamaan strict antara selectedValue dan targetAngka, simpan hasilnya ke isStrictEqual
  const isStrictEqual = selectedValue === targetAngka;

  // 12. Tampilkan hasil perbandingan strict ke layar beserta penjelasannya
  strictOut.textContent = `${isStrictEqual} (Tepat! Tipe data berbeda string !== number)`;
  
  // 13. Ubah warna teks pada elemen strictOut menjadi hijau
  strictOut.style.color = "green";
});
```

---

## 4. Solusi Praktis / Golden Rule

> [!TIP]
> **Aturan Emas JavaScript Modern**
>
> **Gunakan selalu `===` (dan pasangannya `!==`) di seluruh kode Anda tanpa kecuali.**
> Lupakan keberadaan `==` dan `!=`. Dengan membiasakan diri menggunakan tiga simbol (`===` / `!==`), Anda otomatis melenyapkan 99% potensi bug akibat konversi tipe data tak terduga.

---

## 5. Checklist Praktik Mandiri

- [x] Buka `index.html` di browser dan klik tombol **"Bandingkan dengan Angka 0"**.
- [x] Perhatikan bahwa `==` menghasilkan `true` (karena teks dikonversi jadi angka), sedangkan `===` menghasilkan `false` (karena tidak dikonversi).
- [x] Buka Console (`F12`), coba uji perbandingan objek:
  ```javascript
  const boxA = { warna: "merah" };
  const boxB = { warna: "merah" };
  // 1. Bandingkan dua objek dengan isi yang sama — hasilnya false karena alamat memori berbeda
  console.log(boxA === boxB);
  ```

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti mengapa `===` lebih aman daripada `==`, dan paham bahwa dua objek baru `{}` tidak pernah sama karena menempati alamat memori berbeda**.

---

## 🎯 Uji Pemahaman Mandiri

Coba tebak apakah hasilnya `true` atau `false`:

```javascript
let nilaiA = 100;
let nilaiB = "100";
let list1 = [1, 2];
let list2 = [1, 2];

// Pertanyaan:
// 1. Apakah hasil dari (nilaiA == nilaiB)?
// 2. Apakah hasil dari (nilaiA === nilaiB)?
// 3. Apakah hasil dari (list1 === list2)? Mengapa?
// 4. Manakah operator perbandingan yang wajib digunakan di kode aplikasi nyata?
```
