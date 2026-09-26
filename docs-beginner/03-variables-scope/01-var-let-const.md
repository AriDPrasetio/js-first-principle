---
title: "Panduan Pemula: var, let, dan const di JavaScript"
tags: "javascript, first-principles, roadmap-js/03-variables-scope"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let"
---

# Panduan Pemula: var, let, dan const di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Variabel adalah kotak berlabel untuk menyimpan data di memori komputer:
>
> - **`const`**: Kotak terkunci permanen yang isinya tidak boleh diganti nilainya (_Default_ pilihan utama).
> - **`let`**: Kotak fleksibel yang isinya boleh diganti jika nilainya memang perlu berubah (_Re-assignable_).
> - **`var`**: Ember bocor warisan masa lalu yang mengabaikan kurung kurawal `{}` (_Block Scope_) dan rawan menimbulkan bug.

---

## 1. Apa itu Deklarasi Variabel? (Membuat Wadah vs Mengisi Nilai)

Sebelum kita memilih jenis wadah (`const`, `let`, atau `var`), mari pahami dulu apa sebenarnya arti **Deklarasi**:

Bayangkan Anda datang ke tempat penitipan barang di stasiun:
1. **Deklarasi (Declaration)**: Anda mendaftar dan meminta sebuah loker, lalu petugas menempelkan stiker nama Anda di pintu loker itu (`let skor;`). Sekarang komputer tahu bahwa loker bernama `skor` sudah ada di memori, meskipun saat ini isinya masih kosong (`undefined`).
2. **Inisialisasi & Penugasan (Initialization & Assignment)**: Anda membuka pintu loker dan meletakkan barang pertama ke dalamnya (`skor = 10;`).

Ketika Anda menulis sebuah baris lengkap:
```javascript
// 1. Buat wadah konstan totalBelanja dan isi dengan hasil perhitungan 50000 + 25000
const totalBelanja = 50000 + 25000;
```
Di balik layar, Anda sedang memadukan dua konsep dasar:
- **Deklarasi (*Statement*)**: `const totalBelanja` adalah perintah deklarasi untuk memesan tempat permanen di memori.
- **Ekspresi (*Expression*)**: Komputer menghitung ekspresi `50000 + 25000` (menghasilkan nilai `75000`), lalu memasukkan nilai tersebut ke dalam tempat penyimpanan.

---

## 2. Analogi Logis: Tiga Jenis Kotak Penyimpanan

### A. `const` (Kotak Bergembok Permanen)

Bayangkan Anda memasukkan tanggal lahir Anda ke dalam kotak kaca yang digembok.

- Tanggal lahir Anda tidak akan pernah berganti seumur hidup.
- Jika seseorang mencoba membuka kotak dan mengganti isinya dengan tanggal lain, sistem akan membunyikan alarm (_Error: Assignment to constant variable_).
- Gunakan `const` untuk 90% variabel di aplikasi Anda: elemen HTML, konfigurasi API, atau data rumus.

---

### B. `let` (Kotak dengan Tutup Terbuka)

Bayangkan wadah skor di papan permainan basket:

- Mula-mula skornya `0`.
- Saat pemain mencetak angka, angka di wadah diubah menjadi `2`, lalu `5`, lalu `10`.
- Mengganti isi kotak (_re-assignment_) adalah hal yang sah dan diizinkan.
- Gunakan `let` hanya ketika nilai variabel tersebut memang **pasti akan berubah** (misal: penambah skor, counter loop, status saklar).

---

### C. `var` (Ember yang Bocor Keluar Kamar)

Sebelum tahun 2015 (ES6), JavaScript hanya memiliki `var`:

- Masalah besarnya: `var` **tidak mengenal dinding kamar kurung kurawal `{ }`** (_Block Scope_).
- Jika Anda membuat `var` di dalam sebuah blok `if`, variabel tersebut akan "bocor" keluar ke seluruh fungsi atau ruang global, berisiko menimpa variabel lain secara tidak sengaja.

---

## 3. Tabel Perbandingan Karakteristik (First Principles)

| Pembeda                                            |       `const`       |        `let`        |            `var` (Legacy)            |
| :------------------------------------------------- | :-----------------: | :-----------------: | :----------------------------------: |
| **Cakupan Lingkup (_Scope_)**                      | Blok `{ }` tertutup | Blok `{ }` tertutup |  Fungsi / Global (Bocor dari `{}`)   |
| **Boleh Diisi Ulang (_Re-assignment_)?**           |  ❌ Dilarang keras  |    ✅ Diizinkan     |             ✅ Diizinkan             |
| **Boleh Dideklarasikan Ulang (_Re-declaration_)?** |      ❌ Error       |      ❌ Error       |        ✅ Diizinkan (Bahaya!)        |
| **Akses Sebelum Deklarasi**                        |  ❌ Error (_TDZ_)   |  ❌ Error (_TDZ_)   | ⚠️ Bernilai `undefined` (Bisa lolos) |

### Mengapa Pemula Harus Memilih `const` Terlebih Dahulu?

1. **Mencegah Penimpaan Tak Sengaja**: Menjaga data tidak berubah secara acak di tengah ratusan baris kode.
2. **Catatan Penting untuk Objek & Array**: Kata kunci `const` mengunci **wadahnya**, bukan isi perabot di dalamnya:
   ```javascript
   // 1. Buat wadah konstan profil dan isi dengan objek
   const profil = { nama: "Ari" };
   // 2. Ubah properti nama di dalam objek tersebut
   // Catatan*: Isi di dalam objek tetap bisa diubah meskipun menggunakan const
   profil.nama = "Budi";
   // 3. Contoh upaya mengganti seluruh wadah yang akan memicu error
   // profil = { nama: "Joko" };
   ```

---

## 4. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat demonstrasi papan skor dan perbandingan kebocoran variabel `var` vs `let`:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | var, let, const</title>
    <style>
      .papan-skor {
        font-family: sans-serif;
        max-width: 300px;
        padding: 16px;
        border: 2px solid #333;
        border-radius: 8px;
        text-align: center;
      }
      .angka-skor {
        font-size: 36px;
        font-weight: bold;
        color: #0055ff;
        margin: 8px 0;
      }
      button {
        padding: 8px 16px;
        cursor: pointer;
        width: 100%;
        margin-top: 6px;
      }
      .info-box {
        margin-top: 12px;
        padding: 8px;
        font-size: 0.85rem;
        background: #f4f4f4;
        border-radius: 4px;
        text-align: left;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="papan-skor">
      <h3>Papan Skor Game</h3>
      <div id="skor-display" class="angka-skor">0</div>
      <button type="button" id="btn-tambah">+1 Poin (Uji let & const)</button>
      <button type="button" id="btn-uji-bocor">Uji Kebocoran var vs let</button>
      <div id="info-hasil" class="info-box">
        Tekan tombol uji untuk melihat di console.
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen HTML penampil skor berdasarkan ID dan simpan ke wadah konstan skorDisplay
const skorDisplay = document.querySelector("#skor-display");

// 2. Ambil tombol tambah poin berdasarkan ID dan simpan ke wadah konstan tambahBtn
const tambahBtn = document.querySelector("#btn-tambah");

// 3. Ambil tombol uji kebocoran berdasarkan ID dan simpan ke wadah konstan ujiBocorBtn
const ujiBocorBtn = document.querySelector("#btn-uji-bocor");

// 4. Ambil kotak info hasil berdasarkan ID dan simpan ke wadah konstan infoHasilEl
const infoHasilEl = document.querySelector("#info-hasil");

// 5. Buat wadah angka nilaiSkor dan isi awal dengan angka 0
// Catatan*: Gunakan let karena isi wadah ini akan berubah saat tombol diklik
let nilaiSkor = 0;

// 6. Pasang aksi pada tombol tambah untuk dijalankan saat diklik
tambahBtn.addEventListener("click", () => {
  // 7. Tambahkan 1 ke nilaiSkor saat ini
  nilaiSkor = nilaiSkor + 1;

  // 8. Perbarui teks di elemen skorDisplay dengan angka terbaru
  skorDisplay.textContent = nilaiSkor;
});

// Demonstrasi Nyata: Kebocoran var vs Isolasi let
// 9. Pasang aksi pada tombol uji bocor untuk dijalankan saat diklik
ujiBocorBtn.addEventListener("click", () => {
  // 10. Buat ruang lingkup baru menggunakan kurung kurawal if
  if (true) {
    // 11. Buat wadah pesanBocor menggunakan var
    // Catatan*: var mengabaikan kurung kurawal blok ini dan bocor ke luar
    var pesanBocor = "Dibuat di dalam if dengan var!";

    // 12. Buat wadah pesanAman menggunakan let
    // Catatan*: let terkurung rapat di dalam blok ini
    let pesanAman = "Dibuat di dalam if dengan let!";
  }

  // 13. Tampilkan pesanBocor ke konsol
  console.log("Di luar if:", pesanBocor);

  // 14. Coba akses pesanAman yang berada di luar jangkauan
  try {
    // 15. Baris ini akan memicu error karena let terisolasi
    console.log("Di luar if:", pesanAman);
  } catch (error) {
    // 16. Tangkap pesan error dan tampilkan ke konsol
    console.log("let berhasil mengisolasi variabel:", error.message);
  }

  // 17. Tampilkan ringkasan hasil uji coba ke elemen infoHasilEl
  infoHasilEl.textContent = `var bocor keluar blok: "${pesanBocor}". Buka Console (F12) untuk melihat bukti isolasi let.`;
});
```

---

## 5. Solusi Praktis / Best Practice

1. **Jadikan `const` sebagai pilihan bawaan (_Default_)**: Setiap kali membuat variabel baru, selalu ketik `const` terlebih dahulu.
2. **Ganti ke `let` hanya jika nilainya perlu diubah**: Jika nanti variabel tersebut memang perlu diisi ulang nilainya (seperti counter di atas), barulah ganti menjadi `let`.
3. **Tinggalkan `var` sepenuhnya**: Jangan gunakan `var` lagi di proyek modern mana pun karena tidak memiliki _Block Scope_ dan mengizinkan deklarasi ganda yang merusak data.

---

## 6. Checklist Praktik Mandiri

- [x] Buka `index.html` di browser dan klik tombol **"+1 Poin"** beberapa kali.
- [x] Klik tombol **"Uji Kebocoran var vs let"** dan buka Console DevTools (`F12`).
- [x] Perhatikan bagaimana `pesanBocor` bisa terbaca di luar kurung kurawal `if`, sedangkan `pesanAman` melempar `ReferenceError`.
- [x] Coba ketik di Console:
  ```javascript
  // 1. Buat wadah angka dengan var dan isi nilai 10
  var angka = 10;
  // 2. Buat ulang wadah angka dengan var dan isi nilai 20
  // Catatan*: var mengizinkan pembuatan ulang nama yang sama tanpa pesan error
  var angka = 20;
  
  // 3. Buat wadah skor dengan let dan isi nilai 10
  let skor = 10;
  // 4. Buat ulang wadah skor dengan let dan isi nilai 20
  // Catatan*: let akan menolak deklarasi ulang dan menampilkan pesan error
  let skor = 20; // SyntaxError: Identifier 'skor' has already been declared
  ```

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti mengapa `const` adalah pilihan utama, tahu kapan memakai `let`, dan memahami bahaya variabel `var` yang mengabaikan kurung kurawal blok `{}`**.

---

## 🎯 Uji Pemahaman Mandiri

Pilihlah kata kunci yang tepat (`const` atau `let`) untuk situasi berikut:

```javascript
// 1. Simpan tanggal lahir pengguna yang bersifat permanen
___ tanggalLahir = "1998-05-12";

// 2. Simpan jumlah detik countdown yang terus berkurang setiap detik
___ sisaDetik = 60;

// 3. Simpan tombol submit yang diambil dari halaman web
___ submitBtn = document.querySelector("#btn-submit");

// 4. Analisis hasil dari eksekusi baris-baris berikut
// const nama = "Ari";
// nama = "Budi";
// (Apakah berhasil atau menghasilkan error? Error jenis apa?)
```
