---
title: "Panduan Pemula: var, let, dan const di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/03-variables-scope
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
---

# Panduan Pemula: var, let, dan const di JavaScript

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> Variabel adalah kotak berlabel untuk menyimpan data di memori komputer:
>
> - **`const`**: Kotak terkunci permanen yang isinya tidak boleh diganti (_Default_ pilihan utama).
> - **`let`**: Kotak fleksibel yang isinya boleh diganti jika nilainya memang perlu berubah.
> - **`var`**: Ember bocor warisan masa lalu yang rawan menimbulkan bug dan sebaiknya ditinggalkan.

---

## 1. Analogi Logis: Tiga Jenis Kotak Penyimpanan

### A. `const` (Kotak Bergembok Permanen)

Bayangkan Anda memasukkan tanggal lahir Anda ke dalam kotak kaca yang digembok.

- Tanggal lahir Anda tidak akan pernah berganti seumur hidup.
- Jika seseorang mencoba membuka kotak dan mengganti isinya dengan tanggal lain, sistem akan membunyikan alarm (_Error: Assignment to constant variable_).

Gunakan `const` untuk 90% variabel di aplikasi Anda: nama elemen HTML, rumus matematika, atau URL API.

---

### B. `let` (Kotak dengan Tutup Terbuka)

Bayangkan wadah skor di papan permainan basket.

- Mula-mula skornya `0`.
- Saat pemain mencetak angka, angka di wadah diubah menjadi `2`, lalu `5`, lalu `10`.
- Mengganti isi kotak ini adalah hal yang wajar dan diizinkan.

Gunakan `let` hanya ketika nilai variabel tersebut memang **pasti akan berubah** (misal: penghitung putaran loop, skor game, status tombol).

---

### C. `var` (Ember yang Bocor Keluar Kamar)

Sebelum tahun 2015, JavaScript hanya punya `var`.

- Masalah besarnya: `var` tidak mengenal dinding kamar (tanda kurung kurawal `{ }`).
- Jika Anda membuat `var` di dalam kamar kecil (seperti di dalam blok `if`), variabel tersebut akan "bocor" keluar ke ruang tamu dan berisiko menimpa variabel lain tanpa sengaja.

---

## 2. Mengapa Pemula Harus Memilih `const` Terlebih Dahulu? (First Principles)

1. **Mencegah Bug Tak Sengaja**: Jika Anda membuat variabel `const totalBiaya = 100000`, Anda punya jaminan mutlak bahwa tidak ada baris kode lain di bawah yang bisa secara tidak sengaja menimpa nilainya.
2. **Catatan Penting untuk Objek**: Kata kunci `const` mengunci **wadahnya**, bukan isi perabot di dalamnya. Jika Anda membuat objek `const mobil = { warna: 'merah' }`, Anda tidak bisa mengganti `mobil = {}`, tetapi Anda tetap bisa mengubah `mobil.warna = 'biru'`.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat papan skor sederhana yang memadukan `const` dan `let`:

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
        max-width: 280px;
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
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="papan-skor">
      <h3>Papan Skor Game</h3>
      <div id="skor-display" class="angka-skor">0</div>
      <button type="button" id="btn-tambah">+1 Poin</button>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Deklarasi dengan const (karena elemen HTML tidak pernah diganti wadahnya)
const skorDisplay = document.querySelector("#skor-display");
// ambil elemen penampil skor HTML, kunci referensinya secara permanen dengan const.

const tambahBtn = document.querySelector("#btn-tambah");
// ambil tombol penambah skor HTML, kunci referensinya dengan const.

// 2. Deklarasi dengan let (karena nilai angka skor akan terus bertambah)
let nilaiSkor = 0;
// buat variabel nilaiSkor dengan let agar angkanya bisa kita perbarui nanti.

// 3. Pasang aksi penambahan poin
tambahBtn.addEventListener("click", () => {
  // saat tombol diklik oleh pengguna, jalankan perintah berikut:

  nilaiSkor = nilaiSkor + 1;
  // perbarui isi variabel nilaiSkor dengan menambahkan angka 1 (ini sah karena memakai let).

  skorDisplay.textContent = nilaiSkor;
  // tampilkan angka skor terbaru ke layar HTML.
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Jadikan `const` sebagai pilihan bawaan (_Default_)**: Setiap kali membuat variabel baru, selalu ketik `const` terlebih dahulu.
2. **Ganti ke `let` hanya jika nilainya perlu diubah**: Jika nanti variabel tersebut memang perlu diisi ulang nilainya (seperti counter di atas), barulah ganti menjadi `let`.
3. **Tinggalkan `var` sepenuhnya**: Jangan gunakan `var` lagi di proyek modern mana pun.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik tombol **"+1 Poin"** beberapa kali.
- [ ] Perhatikan angka di layar bertambah dengan mulus.
- [ ] Buka `app.js`, coba ubah `let nilaiSkor = 0` menjadi `const nilaiSkor = 0`. Simpan dan klik tombolnya di browser. Buka Console (`F12`) dan amati pesan error alarm `TypeError: Assignment to constant variable`. Kembalikan lagi ke `let`.

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Tahu persis kapan harus menggunakan `const` (nilai tetap/elemen DOM) dan kapan menggunakan `let` (nilai dinamis yang bertambah)**.

---

## 🎯 Uji Pemahaman Mandiri

Pilihlah kata kunci yang tepat (`const` atau `let`) untuk situasi berikut:

```javascript
// Situasi 1: Menyimpan tanggal lahir pengguna
___ tanggalLahir = "1998-05-12";

// Situasi 2: Menyimpan jumlah detik countdown yang terus berkurang
___ sisaDetik = 60;

// Situasi 3: Menyimpan tombol submit di halaman web
___ submitBtn = document.querySelector("#btn-submit");
```
