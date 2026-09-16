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
console.log({ id: 1 } === { id: 1 }); // FALSE!
console.log([] === []); // FALSE!
```

**Mengapa `false`?**
Ingat First Principle dari Bab 2.1: Objek dan Array adalah **Reference Type**.
Operator `===` pada objek **tidak memeriksa isi propertinya**, melainkan memeriksa **apakah kedua variabel menunjuk ke alamat memori fisik yang sama di heap**:

```javascript
const userA = { nama: "Ari" };
const userB = userA; // Menyalin alamat memori yang sama

console.log(userA === userB); // TRUE! (Keduanya menunjuk ke alamat fisik yang identik)
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
// 1. Ambil elemen yang dibutuhkan
const selectEl = document.querySelector("#select-status");
// ambil elemen dropdown pilihan dengan ID 'select-status', simpan ke wadah selectEl.

const bandingBtn = document.querySelector("#btn-banding");
// ambil tombol bandingkan dengan ID 'btn-banding', simpan ke wadah bandingBtn.

const looseOut = document.querySelector("#loose-out");
// ambil elemen penampil hasil loose dengan ID 'loose-out', simpan ke wadah looseOut.

const strictOut = document.querySelector("#strict-out");
// ambil elemen penampil hasil strict dengan ID 'strict-out', simpan ke wadah strictOut.

// 2. Pasang aksi ketika tombol diklik
bandingBtn.addEventListener("click", () => {
  // saat tombol diklik, jalankan fungsi perbandingan berikut:

  const selectedValue = selectEl.value;
  // ambil nilai opsi yang dipilih (ingat: bernilai string, contohnya teks "0").

  const targetAngka = 0;
  // angka murni nol (bertipe number).

  // 1. Pengujian dengan Loose Equality (==):
  const isLooseEqual = selectedValue == targetAngka;
  // tanda '==' memaksa teks "0" diubah menjadi angka 0, sehingga "0" == 0 dianggap TRUE!

  looseOut.textContent = `${isLooseEqual} (Teks dipaksa dianggap sama dengan Angka)`;
  looseOut.style.color = "red";

  // 2. Pengujian dengan Strict Equality (===):
  const isStrictEqual = selectedValue === targetAngka;
  // tanda '===' melihat teks "0" dan angka 0 memiliki tipe berbeda, sehingga menghasilkan FALSE!

  strictOut.textContent = `${isStrictEqual} (Tepat! Tipe data berbeda string !== number)`;
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

- [ ] Buka `index.html` di browser dan klik tombol **"Bandingkan dengan Angka 0"**.
- [ ] Perhatikan bahwa `==` menghasilkan `true` (karena teks dipaksa jadi angka), sedangkan `===` menghasilkan `false` (karena aman dan jujur).
- [ ] Buka Console (`F12`), coba uji perbandingan objek:
  ```javascript
  const boxA = { warna: "merah" };
  const boxB = { warna: "merah" };
  console.log(boxA === boxB); // Amati hasilnya false!
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
