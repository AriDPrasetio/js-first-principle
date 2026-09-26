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
> **Closure** adalah "brankas memori" bawaan fungsi: ketika fungsi anak diciptakan di dalam fungsi induk, ia akan selalu menyimpan dan mengingat variabel milik induknya — seperti PIN yang tersimpan di sistem bank — meskipun fungsi induknya sudah selesai dieksekusi.

---

## 1. Analogi Logis: Rekening Bank dengan PIN Rahasia

Bayangkan Anda membuka rekening baru di bank (_Fungsi Induk_). Saat pembukaan rekening, bank membuat **PIN rahasia** (_Variabel Privat_) dan menyimpannya di sistemnya.

1. **Lexical Scoping (Sistem Bank sebagai Tempat Asal)**:
   PIN Anda tersimpan di **sistem bank tempat rekening dibuka** — bukan di ATM yang Anda pakai hari ini. Mesin ATM di mana pun di seluruh Indonesia bisa Anda gunakan, tetapi PIN yang valid tetap mengacu ke data yang ada **di sistem bank asal**.
2. **Closure (Brankas Memori yang Tetap Hidup)**:
   Staf bank yang membuka rekening Anda sudah pindah tugas (_Fungsi Induk selesai dieksekusi_), tetapi **PIN itu tidak ikut hilang**. PIN tersebut tetap hidup di sistem, dan Anda bisa menggunakannya kapan saja melalui "pintu resmi" — yaitu mesin ATM atau teller (_method yang dikembalikan_).

Inilah **Closure**: Fungsi anak menyimpan referensi hidup (_live reference_) terhadap variabel induk tempat ia diciptakan — data itu tetap ada meskipun fungsi induknya sudah selesai.

---

## 2. Mengapa Pemula Perlu Memahami Closure? (First Principles)

Di aplikasi web, ada data sensitif yang **tidak boleh diubah sembarangan oleh pihak luar**:

- Contoh: data skor game, saldo dompet digital, atau status otentikasi.
- Jika Anda menyimpannya di variabel global biasa, siapa pun bisa mengetik `skor = 999999` di DevTools Console untuk berbuat curang.
- Dengan **Closure**, kita bisa menyembunyikan variabel di dalam ruangan tertutup (enkapsulasi), dan hanya menyediakan fungsi resmi untuk membaca atau mengubah nilainya secara terkontrol.

```javascript
// CONTOH DASAR FIRST PRINCIPLES:
// 1. Buat fungsi pembuat brankas bernama buatPenghitung
function buatPenghitung() {
  // 2. Buat wadah hitungan yang tersembunyi di dalam lingkup fungsi ini (privat)
  let hitungan = 0;

  // 3. Kembalikan sebuah fungsi anak yang bertindak sebagai pintu akses resmi
  return function () {
    // 4. Tambahkan 1 ke dalam wadah hitungan
    // Catatan*: Fungsi anak ini terus mengingat wadah hitungan dari fungsi induknya (Closure)
    hitungan = hitungan + 1;
    // 5. Kembalikan isi terbaru dari wadah hitungan
    return hitungan;
  };
}

// 6. Jalankan fungsi pembuat brankas dan simpan fungsi akses resminya ke wadah klikCounter
const klikCounter = buatPenghitung();

// 7. Panggil fungsi akses resmi berulang kali
// Catatan*: Angka akan terus bertambah karena wadah privat masih hidup di memori
console.log(klikCounter());
console.log(klikCounter());
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
// PABRIK SKOR (FUNGSI INDUK PENGHASIL CLOSURE)
// 1. Buat fungsi pembuat pengelola skor yang menerima target elemen HTML
function buatPengelolaSkor(tampilanElemen) {
  // 2. Buat wadah privat nilaiSkor yang hanya ada di dalam fungsi ini
  let nilaiSkor = 0;

  // 3. Buat fungsi privat untuk memperbarui teks angka di layar
  function segarkanLayar() {
    // 4. Tulis isi wadah nilaiSkor ke dalam elemen HTML
    tampilanElemen.textContent = nilaiSkor;
  }

  // 5. Kembalikan objek berisi alat kendali resmi yang bisa dipakai dari luar
  return {
    // 6. Buat alat penambah poin yang menerima jumlah poin tambahan
    tambahPoin: function (tambahan) {
      // 7. Tambahkan poin ke wadah privat nilaiSkor
      nilaiSkor = nilaiSkor + tambahan;
      // 8. Perbarui layar
      segarkanLayar();
    },
    // 9. Buat alat penyetel ulang skor
    resetSkor: function () {
      // 10. Kembalikan nilai wadah privat menjadi 0
      nilaiSkor = 0;
      // 11. Perbarui layar
      segarkanLayar();
    },
  };
}

// MENGHUBUNGKAN KE ELEMEN HTML
// 12. Ambil elemen HTML yang digunakan untuk menampilkan skor
const scoreDisplay = document.querySelector("#score-display");

// 13. Buat alat pengelola skor khusus untuk elemen tersebut dan simpan di wadah scoreTracker
// Catatan*: Wadah nilaiSkor kini hidup di dalam closure milik scoreTracker dan aman dari luar
const scoreTracker = buatPengelolaSkor(scoreDisplay);

// PASANG AKSI TOMBOL
// 14. Pasang aksi pada tombol tambah untuk dijalankan saat diklik
document.querySelector("#btn-add").addEventListener("click", () => {
  // 15. Gunakan alat resmi tambahPoin untuk menyuntikkan 5 poin
  scoreTracker.tambahPoin(5);
});

// 16. Pasang aksi pada tombol reset untuk dijalankan saat diklik
document.querySelector("#btn-reset").addEventListener("click", () => {
  // 17. Gunakan alat resmi resetSkor untuk mengembalikan ke posisi awal
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

- [x] Buka `index.html` di browser dan klik tombol **"+5 Poin"** beberapa kali.
- [x] Klik tombol **"Reset"** dan perhatikan angka kembali ke 0.
- [x] Buka Console browser (`F12`), coba ketik `nilaiSkor = 1000`. Perhatikan bahwa angka skor di layar tidak terpengaruh karena variabel aslinya terlindung di dalam closure.
- [x] Ketik kode dasar di Console:
  ```javascript
  // 1. Buat pabrik pembuat salam yang mengingat kota
  function pembuatSalam(kota) {
    // 2. Kembalikan fungsi yang merakit pesan salam
    return function (nama) {
      // 3. Gunakan wadah nama (dari luar) dan wadah kota (dari fungsi induk)
      return `Halo ${nama} dari ${kota}`;
    };
  }
  
  // 4. Buat pembuat salam khusus untuk kota Bali
  const salamBali = pembuatSalam("Bali");
  
  // 5. Cetak hasil sapaan ke konsol
  // Catatan*: Wadah kota berisi "Bali" tetap diingat berkat closure
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
// 1. Buat fungsi pembuat penyapa yang menyimpan informasi nama kota
function buatPenyapa(namaKota) {
  // 2. Kembalikan fungsi pencetak salam ke konsol
  return function (namaOrang) {
    // 3. Cetak gabungan nama orang dengan nama kota
    console.log(`Halo ${namaOrang}, selamat datang di ${namaKota}!`);
  };
}

// 4. Buat penyapa khusus untuk Bandung
const sapaBandung = buatPenyapa("Bandung");
// 5. Panggil penyapa tersebut untuk menyapa "Kyo"
sapaBandung("Kyo");
```

1. Apakah fungsi `sapaBandung("Kyo")` akan berhasil mencetak salam atau melempar error?
2. Mengapa variabel `namaKota` masih bisa diakses padahal fungsi `buatPenyapa` sudah selesai dieksekusi di baris sebelumnya?

```

```
