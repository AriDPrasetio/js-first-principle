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

## 1. Analogi Logis: Tiga Jenis Kotak Penyimpanan

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

## 2. Tabel Perbandingan Karakteristik (First Principles)

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
   const profil = { nama: "Ari" };
   // ✅ Boleh! Isi properti di dalam objek boleh diubah
   profil.nama = "Budi";
   // ❌ Error! Wadah profil tidak boleh diganti objek baru:
   // profil = { nama: "Joko" };
   ```

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

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
// 1. Deklarasi dengan const (karena elemen HTML tidak pernah diganti wadahnya)
const skorDisplay = document.querySelector("#skor-display");
const tambahBtn = document.querySelector("#btn-tambah");
const ujiBocorBtn = document.querySelector("#btn-uji-bocor");
const infoHasilEl = document.querySelector("#info-hasil");

// 2. Deklarasi dengan let (karena nilai angka skor akan terus bertambah)
let nilaiSkor = 0;

// 3. Pasang aksi penambahan poin
tambahBtn.addEventListener("click", () => {
  // sah karena let mengizinkan penugasan ulang (re-assignment)
  nilaiSkor = nilaiSkor + 1;
  skorDisplay.textContent = nilaiSkor;
});

// 4. Demonstrasi Nyata: Kebocoran var vs Isolasi let
ujiBocorBtn.addEventListener("click", () => {
  if (true) {
    // var tidak mengenal block scope
    var pesanBocor = "Saya dibuat di dalam if dengan var!";
    // let terisolasi ketat di dalam block scope ini
    let pesanAman = "Saya dibuat di dalam if dengan let!";
  }

  // DI LUAR BLOK IF:
  // var bocor keluar blok: "Saya dibuat di dalam if dengan var!"
  console.log("Di luar if:", pesanBocor);

  try {
    console.log("Di luar if:", pesanAman);
  } catch (error) {
    // let berhasil mengisolasi variabel (ReferenceError: pesanAman is not defined)
    console.log("let berhasil mengisolasi variabel:", error.message);
  }

  infoHasilEl.textContent = `var bocor keluar blok: "${pesanBocor}". Buka Console (F12) untuk melihat bukti isolasi let.`;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Jadikan `const` sebagai pilihan bawaan (_Default_)**: Setiap kali membuat variabel baru, selalu ketik `const` terlebih dahulu.
2. **Ganti ke `let` hanya jika nilainya perlu diubah**: Jika nanti variabel tersebut memang perlu diisi ulang nilainya (seperti counter di atas), barulah ganti menjadi `let`.
3. **Tinggalkan `var` sepenuhnya**: Jangan gunakan `var` lagi di proyek modern mana pun karena tidak memiliki _Block Scope_ dan mengizinkan deklarasi ganda yang merusak data.

---

## 5. Checklist Praktik Mandiri

- [x] Buka `index.html` di browser dan klik tombol **"+1 Poin"** beberapa kali.
- [x] Klik tombol **"Uji Kebocoran var vs let"** dan buka Console DevTools (`F12`).
- [x] Perhatikan bagaimana `pesanBocor` bisa terbaca di luar kurung kurawal `if`, sedangkan `pesanAman` melempar `ReferenceError`.
- [x] Coba ketik di Console:
  ```javascript
  var angka = 10;
  // Boleh tanpa error di var (rawan tertimpa!)
  var angka = 20;
  let skor = 10;
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
// Situasi 1: Menyimpan tanggal lahir pengguna yang bersifat permanen
___ tanggalLahir = "1998-05-12";

// Situasi 2: Menyimpan jumlah detik countdown yang terus berkurang setiap detik
___ sisaDetik = 60;

// Situasi 3: Menyimpan tombol submit di halaman web
___ submitBtn = document.querySelector("#btn-submit");

// Situasi 4: Apa yang terjadi jika baris ini dijalankan:
// const nama = "Ari";
// nama = "Budi";
// Apakah berhasil atau menghasilkan error? Error jenis apa?
```
