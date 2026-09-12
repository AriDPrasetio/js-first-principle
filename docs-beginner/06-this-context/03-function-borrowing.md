---
title: "Panduan Pemula: Meminjam Fungsi (Function Borrowing) di JavaScript"
tags: "javascript, first-principles, roadmap-js/06-this-context"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call"
---

# Panduan Pemula: Meminjam Fungsi (Function Borrowing) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Function Borrowing adalah teknik di mana suatu objek atau kumpulan data meminjam fungsi milik objek lain lewat `.call()` atau `.apply()`, tanpa Anda harus menulis ulang fungsi tersebut dari nol (*Duck Typing*).

---

## 1. Analogi Logis: Meminjam Pompa Ban Tetangga

### A. Peminjaman Fungsi Antar-Objek Biasa
Bayangkan Anda memiliki sepeda di rumah:
- Anda ingin mengukur kecepatan sepeda, tetapi sepeda Anda tidak punya speedometer.
- Tetangga Anda memiliki mobil canggih yang punya alat speedometer.
- Apakah Anda harus membeli mobil baru hanya untuk memakai alatnya? Tentu tidak!
- Anda cukup meminjam speedometer tetangga dan menerapkannya ke sepeda Anda:

```javascript
const mobil = {
  merek: "Toyota",
  laju: function(kecepatan) {
    return `${this.merek} melaju pada kecepatan ${kecepatan} km/jam`;
  }
};

const sepeda = { merek: "Polygon" };

// Sepeda meminjam fungsi milik mobil menggunakan .call:
console.log(mobil.laju.call(sepeda, 25)); 
// "Polygon melaju pada kecepatan 25 km/jam"
```

---

### B. Meminjam dari Perpustakaan Induk Array (`Array.prototype`)
Sekarang, bayangkan kumpulan tombol HTML di browser (`NodeList`).
- `NodeList` memiliki indeks angka `0, 1, 2` dan `.length`, mirip seperti Array.
- Namun ia **bukan Array murni**, sehingga tidak memiliki metode bawaan `.map()`.
- Kita bisa meminjam fungsi `.map` dari buku cetakan induk Array: **`Array.prototype.map`** (atau jalan pintas `[].map`).

> [!NOTE]
> **Apa itu `.prototype`?**
> Bayangkan `Array.prototype` sebagai **buku manual induk pabrik**. Di sanalah JavaScript menyimpan seluruh resep resmi Array seperti `.map`, `.filter`, dan `.slice`. Kita akan membedah prototipe lebih mendalam di tingkat lanjut.

---

## 2. Mengapa Ini Bekerja? (First Principles: Duck Typing)

Di JavaScript berlaku filosofi **"Duck Typing"** (*"Jika ia berjalan seperti bebek dan bersuara seperti bebek, maka ia adalah bebek"*):
Metode-metode Array tidak peduli apakah data Anda dibuat dengan tanda kurung siku `[]` asli atau objek DOM. Selama data Anda memiliki:
1. Properti angka indeks (`0, 1, 2, ...`)
2. Properti panjang deret (`length`)

Maka fungsi-fungsi Array bersedia memproses data Anda layaknya array asli!

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita ambil elemen daftar belanja dari halaman HTML, lalu pinjam metode Array untuk mengolah teksnya:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Meminjam Fungsi (Function Borrowing)</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 350px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      ul {
        padding-left: 20px;
      }
      li {
        margin-bottom: 4px;
      }
      button {
        padding: 8px 12px;
        cursor: pointer;
        width: 100%;
        margin-bottom: 8px;
      }
      .output {
        padding: 10px;
        background-color: #f1f5f9;
        border-radius: 4px;
        font-weight: bold;
        color: #1e293b;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Daftar Menu Makanan</h3>
      <ul id="daftar-menu">
        <li class="item-menu">Nasi Goreng</li>
        <li class="item-menu">Mie Ayam</li>
        <li class="item-menu">Sate Ayam</li>
        <li class="item-menu">Es Teh Manis</li>
      </ul>

      <button type="button" id="btn-pinjam">
        Gabungkan Menu (Pinjam Array.map)
      </button>
      <div id="wadah-hasil" class="output">Menu belum digabung.</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
const tombolPinjam = document.querySelector("#btn-pinjam");
const wadahHasil = document.querySelector("#wadah-hasil");

tombolPinjam.addEventListener("click", () => {
  // Ambil semua elemen <li> (bertipe NodeList, bukan Array sejati):
  const kumpulanLi = document.querySelectorAll(".item-menu");

  // ================================================================
  // PINJAM METODE: Array.prototype.map.call(kumpulanLi, callback)
  // Atau versi ringkas: [].map.call(kumpulanLi, callback)
  // ================================================================
  const daftarTeksMenu = [].map.call(kumpulanLi, (elemenLi) => {
    return elemenLi.textContent;
  });

  // Gabungkan array hasil olahan menjadi satu string rapi:
  const kalimatMenu = daftarTeksMenu.join(" + ");

  wadahHasil.textContent = `Paket Hemat: ${kalimatMenu}`;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan `Array.from()` di Kode Modern**:
   Meminjam fungsi dengan `.call()` sangat penting untuk memahami cara kerja engine JS dan saat membaca kode pustaka lawas. Namun di aplikasi modern, ubah saja langsung menjadi array murni:
   ```javascript
   const arrayMurni = Array.from(kumpulanLi);
   const teksMenu = arrayMurni.map((li) => li.textContent);
   ```
2. **Pengganti Modern untuk `hasOwnProperty`**:
   Alih-alih menulis peminjaman kuno: `Object.prototype.hasOwnProperty.call(obj, "kunci")`, JavaScript modern (ES2022) menyediakan metode bawaan yang jauh lebih bersih:
   ```javascript
   Object.hasOwn(obj, "kunci"); // true / false
   ```

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik tombol **"Gabungkan Menu"**.
- [ ] Perhatikan teks berhasil dirangkai menjadi `Paket Hemat: Nasi Goreng + Mie Ayam + Sate Ayam + Es Teh Manis`.
- [ ] Buka Console browser (`F12`), coba ketik `document.querySelectorAll(".item-menu").map` dan amati hasilnya adalah `undefined` (membuktikan bahwa NodeList memang aslinya tidak punya fungsi `.map`).

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti prinsip peminjaman fungsi antar-objek maupun peminjaman generic methods dari `Array.prototype`, serta tahu alternatif modern `Array.from()`**.

---

## 🎯 Uji Pemahaman Mandiri

1. Mengapa objek buatan sendiri `{ 0: "apel", 1: "jeruk", length: 2 }` bisa meminjam fungsi `Array.prototype.join.call(obj, ", ")` dan menghasilkan teks `"apel, jeruk"`?
2. Apakah cara modern yang direkomendasikan untuk mengubah `NodeList` menjadi Array sejati tanpa perlu meminjam fungsi secara manual?
```
