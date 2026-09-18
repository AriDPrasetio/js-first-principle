---
title: "Panduan Pemula: Closures dan Lexical Scoping di JavaScript"
tags: "javascript, first-principles, roadmap-js/03-variables-scope"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures"
---

# Panduan Pemula: Closures dan Lexical Scoping di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> **Lexical Scope** berarti letak fisik di mana Anda menulis fungsi menentukan variabel apa saja yang bisa diaksesnya.
> **Closure** adalah "ransel ingatan" bawaan fungsi: ketika fungsi anak dilahirkan di dalam fungsi induk, ia akan selalu mengingat dan membawa variabel milik induknya ke mana pun ia pergi, meskipun fungsi induknya sudah selesai dieksekusi.

---

## 1. Analogi Logis: Ransel Bekal Saat Keluar Rumah

Bayangkan Anda tinggal bersama orang tua Anda di rumah (*Fungsi Induk*):

1. **Lexical Scoping (Tempat Lahir yang Nyata)**:
   Karena kamar Anda berada di dalam rumah orang tua Anda, Anda secara sah berhak menggunakan fasilitas di rumah tersebut. Hak akses ini ditentukan oleh **di mana letak rumah tempat Anda lahir**, bukan di mana Anda sedang nongkrong hari ini.
2. **Closure (Ransel Bekal Warisan)**:
   Sebelum Anda berangkat merantau (*Fungsi Anak dikembalikan keluar*), orang tua Anda membekali sebuah **ransel berisi resep keluarga** (*Variabel Privat*).
   Meskipun Anda sudah tinggal di kota lain bertahun-tahun kemudian, **Anda tetap bisa membuka ransel itu kapan saja untuk membaca dan memperbarui resep tersebut.**

Inilah **Closure**: Fungsi anak menyimpan referensi hidup (*live reference*) terhadap variabel induk tempat ia diciptakan.

---

## 2. Mengapa Pemula Membutuhkan Closure? (First Principles)

Di aplikasi web, ada data sensitif yang **tidak boleh diubah sembarangan oleh pihak luar**:

- Contoh: data skor game, saldo dompet digital, atau status otentikasi.
- Jika Anda menyimpannya di variabel global biasa, siapa pun bisa mengetik `skor = 999999` di DevTools Console untuk berbuat curang.
- Dengan **Closure**, kita bisa menyembunyikan variabel di dalam ruangan tertutup (enkapsulasi), dan hanya menyediakan fungsi resmi untuk membaca atau mengubah nilainya secara terkontrol.

```javascript
// CONTOH DASAR FIRST PRINCIPLES:
function buatPenghitung() {
  // variabel privat terkunci
  let hitungan = 0;

  return function() {
    // mengingat dan menambah variabel induk
    hitungan = hitungan + 1;
    return hitungan;
  };
}

const klikCounter = buatPenghitung();
console.log(klikCounter()); // 1
console.log(klikCounter()); // 2
// Variabel 'hitungan' tidak bisa dibajak dari luar!
```

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat pencatat skor game privat yang tahan dari intervensi luar:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Closure</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 300px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        text-align: center;
      }
      .skor {
        font-size: 32px;
        font-weight: bold;
        color: #0077cc;
        margin: 12px 0;
      }
      button {
        padding: 8px 12px;
        cursor: pointer;
        margin: 4px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Pencatat Skor Privat</h3>
      <div id="score-display" class="skor">0</div>
      <button type="button" id="btn-add">+5 Poin</button>
      <button type="button" id="btn-reset">Reset</button>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. PABRIK SKOR (FUNGSI INDUK PENGHASIL CLOSURE)
// deklarasi function buatPengelolaSkor yang menerima parameter tampilanElemen
function buatPengelolaSkor(tampilanElemen) {
  // Variabel privat: terkunci aman di dalam closure
  // buat variable nilaiSkor dan isi dengan number 0
  let nilaiSkor = 0;

  // deklarasi function segarkanLayar untuk memperbarui tampilan
  function segarkanLayar() {
    // perbarui teks di dalam element tampilanElemen dengan value dari nilaiSkor
    tampilanElemen.textContent = nilaiSkor;
  }

  // Mengembalikan kumpulan fungsi kendali resmi:
  // kembalikan sebuah object berisi method tambahPoin dan resetSkor yang memiliki akses ke nilaiSkor
  return {
    // deklarasi method tambahPoin yang menerima parameter tambahan
    tambahPoin: function (tambahan) {
      // tambahkan nilaiSkor saat ini dengan parameter tambahan
      nilaiSkor = nilaiSkor + tambahan;
      // panggil function segarkanLayar untuk memperbarui UI
      segarkanLayar();
    },
    // deklarasi method resetSkor untuk mengembalikan skor ke 0
    resetSkor: function () {
      // ubah nilaiSkor kembali menjadi 0
      nilaiSkor = 0;
      // panggil function segarkanLayar untuk memperbarui UI
      segarkanLayar();
    },
  };
}

// 2. MENGHUBUNGKAN KE ELEMEN HTML
// ambil element penampil skor berdasarkan ID-nya, simpan ke variable scoreDisplay
const scoreDisplay = document.querySelector("#score-display");

// jalankan function buatPengelolaSkor dengan argumen scoreDisplay, simpan object hasilnya ke variable scoreTracker
const scoreTracker = buatPengelolaSkor(scoreDisplay);

// 3. PASANG AKSI TOMBOL
// saat element tombol tambah di-click, jalankan function berikut:
document.querySelector("#btn-add").addEventListener("click", () => {
  // panggil method tambahPoin dari object scoreTracker dengan argumen 5
  scoreTracker.tambahPoin(5);
});

// saat element tombol reset di-click, jalankan function berikut:
document.querySelector("#btn-reset").addEventListener("click", () => {
  // panggil method resetSkor dari object scoreTracker
  scoreTracker.resetSkor();
});
```

// BUKTI KEAMANAN CLOSURE:
// Coba ketik di Console browser: console.log(nilaiSkor);
// Hasilnya: ReferenceError: nilaiSkor is not defined!
// Nilai skor terenkapsulasi murni di dalam closure.

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan Factory Function berbasis Closure**: Pola ini adalah cara paling bersih di JavaScript untuk membuat modul privat tanpa memerlukan arsitektur class yang berbelit-belit.
2. **Ketahui Kapan Closure Tercipta**: Setiap kali sebuah fungsi didefinisikan di dalam fungsi lain, fungsi dalam tersebut otomatis membentuk closure atas variabel-variabel di sekitarnya.
3. **Pahami Live Binding**: Closure tidak sekadar memfotokopi data sekali saat dibuat; ia memegang referensi hidup ke variabel tersebut sehingga perubahan nilai di masa mendatang akan selalu tercermin.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik tombol **"+5 Poin"** beberapa kali.
- [ ] Klik tombol **"Reset"** dan perhatikan angka kembali ke 0.
- [ ] Buka Console browser (`F12`), coba ketik `nilaiSkor = 1000`. Perhatikan bahwa angka skor di layar tidak terpengaruh karena variabel aslinya terlindung di dalam closure.
- [ ] Ketik kode dasar di Console:
  ```javascript
  function pembuatSalam(kota) {
    return function(nama) { return `Halo ${nama} dari ${kota}`; };
  }
  const salamBali = pembuatSalam("Bali");
  // Amati bagaimana "Bali" tetap diingat!
  console.log(salamBali("Kyo"));
  ```

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti bahwa Lexical Scope menentukan wilayah berdasarkan letak penulisan kode, dan Closure memungkinkan fungsi anak mengingat variabel induknya di mana pun fungsi anak itu dipanggil**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode pencipta salam berikut:

```javascript
function buatPenyapa(namaKota) {
  return function (namaOrang) {
    console.log(`Halo ${namaOrang}, selamat datang di ${namaKota}!`);
  };
}

const sapaBandung = buatPenyapa("Bandung");
sapaBandung("Kyo");
```

1. Apakah fungsi `sapaBandung("Kyo")` akan berhasil mencetak salam atau melempar error?
2. Mengapa variabel `namaKota` masih bisa diakses padahal fungsi `buatPenyapa` sudah selesai dieksekusi di baris sebelumnya?
```
