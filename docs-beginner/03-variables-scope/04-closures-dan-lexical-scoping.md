---
title: "Panduan Pemula: Closures dan Lexical Scoping di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/03-variables-scope
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
---

# Panduan Pemula: Closures dan Lexical Scoping di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Closure adalah "ransel ingatan" bawaan fungsi: ketika sebuah fungsi anak dibuat di dalam fungsi induk, ia akan selalu mengingat dan membawa variabel milik induknya ke mana pun ia pergi, meskipun fungsi induknya sudah selesai dieksekusi.

---

## 1. Analogi Logis: Ransel Bekal Saat Keluar Rumah

Bayangkan Anda tinggal bersama orang tua Anda di rumah (Fungsi Induk):

- Sebelum Anda berangkat merantau ke luar kota (Fungsi Anak), orang tua Anda membekali Anda sebuah **ransel berisi resep masakan keluarga** (Variabel Privat).
- Meskipun Anda sudah berada jauh dari rumah bertahun-tahun kemudian, **Anda tetap bisa membuka ransel itu kapan saja untuk membaca resep masakan tersebut.**

Inilah **Closure**:
Fungsi anak menyimpan kenangan (_referensi memori_) terhadap variabel induk tempat ia dilahirkan.

---

## 2. Mengapa Pemula Membutuhkan Closure? (First Principles)

Di aplikasi nyata, ada data yang **tidak boleh diubah sembarangan oleh pihak luar**:

- Misalnya: data skor game, saldo rekening dompet digital, atau token keamanan.
- Jika Anda menyimpannya di variabel global biasa, siapa pun (atau script iklan lain) bisa mengetik `skor = 999999` di konsol browser untuk berbuat curang.
- Dengan **Closure**, kita bisa menyembunyikan variabel di dalam ruangan tertutup, dan hanya menyediakan tombol resmi (_fungsi antarmuka_) untuk menambah atau mengurangi nilainya.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat pencatat skor game yang aman dari kecurangan luar:

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
function createScoreManager(displayElement, initialScore = 0) {
  // fungsi induk ini membungkus variabel 'score' agar terlindungi rapat:

  let score = initialScore;
  // variabel privat: TIDAK BISA disentuh atau diubah langsung dari luar!

  function updateDOM() {
    // fungsi pembantu untuk memperbarui teks di layar HTML:
    displayElement.textContent = score;
  }

  // Mengembalikan objek berisi tombol-tombol kendali resmi:
  return {
    addPoint(points = 1) {
      // fungsi anak ini mengingat variabel 'score' lewat Closure:
      score = score + points;
      updateDOM();
    },
    resetScore() {
      // fungsi anak ini juga mengingat variabel 'score':
      score = initialScore;
      updateDOM();
    },
  };
}

// 2. MENGHUBUNGKAN KE TAMPILAN HTML
const scoreDisplay = document.querySelector("#score-display");
// ambil elemen penampil angka skor di layar.

const scoreTracker = createScoreManager(scoreDisplay, 0);
// buat pencatat skor baru dengan modal awal 0 poin.

// 3. PASANG EVENT LISTENER KE TOMBOL
document.querySelector("#btn-add").addEventListener("click", () => {
  // saat tombol '+5 Poin' diklik, panggil fungsi resmi penambah poin:
  scoreTracker.addPoint(5);
});

document.querySelector("#btn-reset").addEventListener("click", () => {
  // saat tombol 'Reset' diklik, panggil fungsi resmi reset poin:
  scoreTracker.resetScore();
});

// BUKTI ENKAPSULASI PRIVAT CLOSURE:
// Coba ketik di Console: console.log(score);
// Hasilnya: ReferenceError: score is not defined!
// Variabel score aman terkunci di dalam closure dan tidak bisa dibajak dari luar.
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan Factory Function berbasis Closure**: Ini adalah cara paling elegan di JavaScript untuk membuat modul yang memiliki data privat tanpa memerlukan class OOP yang rumit.
2. **Jangan khawatir berlebihan soal memori**: Engine peramban modern sangat pintar membersihkan variabel di dalam closure yang sudah tidak lagi dipakai.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik tombol **"+5 Poin"** beberapa kali.
- [ ] Klik tombol **"Reset"** dan perhatikan angka kembali ke 0.
- [ ] Buka Console browser (`F12`), coba ketik `score = 1000`. Perhatikan bahwa tampilan angka di kartu game Anda tidak terpengaruh sama sekali karena nilai skor aslinya tersembunyi di dalam closure!

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Menyadari bahwa fungsi anak tetap bisa mengingat dan mengubah variabel milik fungsi induknya, meskipun fungsi induk tersebut sudah selesai dijalankan**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode pencipta salam ini:

```javascript
function buatPenyapa(namaKota) {
  return function (namaOrang) {
    console.log(`Halo ${namaOrang}, selamat datang di ${namaKota}!`);
  };
}

const sapaBandung = buatPenyapa("Bandung");
sapaBandung("Kyo");
```

Apakah fungsi `sapaBandung("Kyo")` akan:

- **A. Berhasil mencetak "Halo Kyo, selamat datang di Bandung!"**
- **B. Gagal karena namaKota sudah hilang dari memori?**
