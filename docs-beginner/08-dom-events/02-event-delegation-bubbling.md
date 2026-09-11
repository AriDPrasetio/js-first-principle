---
title: "Panduan Pemula: Event Bubbling dan Event Delegation di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/08-dom-events
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling
  - https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
---

# Panduan Pemula: Event Bubbling dan Event Delegation di JavaScript

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> Klik pada elemen anak akan otomatis melayang naik ke elemen induknya seperti gelembung udara (_Event Bubbling_). Dengan teknik **Event Delegation**, Anda cukup memasang **satu pendengar klik di wadah induk** untuk mengatur ratusan elemen anak di dalamnya.

---

## 1. Analogi Logis: Gelembung Kolam Renang dan Satpam Gerbang

Bayangkan dua situasi di dunia nyata:

- **Event Bubbling (Gelembung Udara Menyelam)**:
  Saat Anda meniup gelembung di dasar kolam, gelembung itu otomatis melayang naik ke atas melewati lapisan air tengah, hingga pecah di permukaan.
  Ketika pengguna mengklik tombol di dalam kartu, sinyal klik itu akan naik: dari tombol $\to$ ke kartu $\to$ ke pembungkus $\to$ hingga ke seluruh halaman web.
- **Event Delegation (Satu Satpam di Pintu Gerbang)**:
  Daripada menyewa 100 satpam untuk menjaga pintu dari 100 rumah satu per satu (sangat boros!), pengurus kompleks cukup menyewa **1 satpam di gerbang utama**. Satpam gerbang ini yang memeriksa tamu yang datang dan bertanya: _"Mau ke rumah nomor berapa?"_.
  Di JavaScript: Anda cukup memasang 1 event listener di tag daftar `<ul>`, dan ia sanggup mengurus klik tombol hapus di ratusan baris item!

---

## 2. Mengapa JavaScript Didesain Seperti Ini? (First Principles)

1. **Hemat Memori Browser**:
   Memasang `addEventListener` ke 500 baris tabel membuat browser harus menyimpan 500 fungsi di memorinya. Dengan Event Delegation, Anda hanya membuat **1 fungsi saja** di tabel induknya.
2. **Otomatis Bekerja untuk Elemen Baru**:
   Jika pengguna menambahkan item to-do baru atau data baru dimuat dari server, Anda tidak perlu repot memasang sensor klik baru lagi. Wadah induk otomatis langsung mengenali klik item baru tersebut!
3. **Kunci Rahasia: `event.target.closest()`**:
   Untuk mengetahui tombol mana yang diklik pengguna di dalam wadah induk, gunakan bantuan `event.target.closest("button")`. Perintah ini mencari tombol terdekat yang disentuh jari pengguna.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat daftar to-do list dinamis di mana tombol hapus tetap bekerja untuk item yang baru ditambahkan, cukup dengan 1 event listener induk:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Event Delegation & Bubbling</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 350px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .input-bar {
        display: flex;
        gap: 6px;
        margin-bottom: 12px;
      }
      input {
        flex: 1;
        padding: 8px;
      }
      .btn-tambah {
        padding: 8px 12px;
        cursor: pointer;
        background: #0284c7;
        color: white;
        border: none;
        border-radius: 4px;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid #eee;
      }
      .btn-hapus {
        background: #ef4444;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Daftar Tugas Mandiri</h3>
      <div class="input-bar">
        <input type="text" id="input-tugas" placeholder="Tulis tugas baru..." />
        <button type="button" id="btn-tambah" class="btn-tambah">Tambah</button>
      </div>

      <!-- WADAH INDUK TUNGGAL TEMPAT LISTENER DIPASANG -->
      <ul id="daftar-tugas">
        <li>
          <span>Belajar JavaScript</span>
          <button type="button" class="btn-hapus">Hapus</button>
        </li>
        <li>
          <span>Praktik DOM Event</span>
          <button type="button" class="btn-hapus">Hapus</button>
        </li>
      </ul>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen yang kita perlukan
const wadahDaftarTugas = document.querySelector("#daftar-tugas");
// ambil wadah induk <ul> daftar tugas.

const inputTugas = document.querySelector("#input-tugas");
// ambil kolom input teks tugas baru.

const tombolTambah = document.querySelector("#btn-tambah");
// ambil tombol tambah tugas.

// ================================================================
// EVENT DELEGATION: CUKUP 1 LISTENER DI WADAH INDUK (<ul>)
// Listener ini menangani seluruh tombol hapus sekarang dan di masa depan!
// ================================================================
wadahDaftarTugas.addEventListener("click", (event) => {
  // Periksa apakah yang diklik adalah (atau berada di dalam) tombol hapus:
  const tombolHapus = event.target.closest(".btn-hapus");

  // Jika yang diklik bukan tombol hapus (misal teks biasa), abaikan:
  if (!tombolHapus) return;

  // Jika benar tombol hapus yang diklik, cari elemen <li> pembungkusnya:
  const barisTugas = tombolHapus.closest("li");
  // temukan tag <li> terdekat ke atas.

  barisTugas.remove();
  // hapus baris tugas tersebut dari layar browser!
});

// 2. Logika Menambah Tugas Baru
tombolTambah.addEventListener("click", () => {
  const teks = inputTugas.value.trim();
  if (teks === "") return;

  // Buat baris <li> baru:
  const liBaru = document.createElement("li");
  liBaru.innerHTML = `
    <span>${teks}</span>
    <button type="button" class="btn-hapus">Hapus</button>
  `;

  // Tempelkan ke wadah induk:
  wadahDaftarTugas.appendChild(liBaru);

  // Kosongkan kembali input:
  inputTugas.value = "";
  // Perhatikan: Kita TIDAK PERLU memasang addEventListener pada tombol hapus baru ini!
  // Karena Event Bubbling akan otomatis meniupkan klik ke wadahDaftarTugas di atas!
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan `.closest(".nama-class")`**:
   Sering kali di dalam tombol ada tag ikon `<span>🗑️</span>`. Jika pengguna mengklik ikonnya, `event.target` adalah `span`. Menggunakan `.closest(".btn-hapus")` menjamin tombol induknya tetap terdeteksi dengan tepat.
2. **Gunakan Event Delegation untuk Daftar yang Berubah-ubah**:
   Jika Anda memiliki tabel belanja, daftar keranjang, atau chat pesan yang itemnya bisa bertambah dan berkurang, **selalu gunakan pola Event Delegation**.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik tombol merah **"Hapus"** pada baris "Belajar JavaScript" $\to$ pastikan baris terhapus.
- [ ] Ketik tugas baru di kotak input (misal: `"Beli Buku"`), lalu klik **"Tambah"**.
- [ ] Sekarang klik tombol **"Hapus"** pada item baru yang baru saja Anda buat. Perhatikan bahwa tombol hapus tersebut langsung aktif bekerja tanpa Anda harus menulis kode listener baru!

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Mengerti bahwa klik pada elemen anak akan melayang naik (_bubbling_), sehingga kita cukup memasang 1 listener di elemen induk (_event delegation_)**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa perbedaan peran antara `event.target` (elemen yang disentuh pengguna) dengan `event.currentTarget` (elemen pemilik listener)?
2. Mengapa memasang satu listener pada elemen pembungkus `<ul>` jauh lebih hemat memori dibandingkan memasang listener pada masing-masing dari 1.000 elemen `<li>` di dalamnya?
