---
title: "Panduan Pemula: Event Bubbling dan Event Delegation di JavaScript"
tags: "javascript, first-principles, roadmap-js/08-dom-events"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling"
---

# Panduan Pemula: Event Bubbling dan Event Delegation di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Setiap kali suatu aksi (seperti klik) terjadi pada elemen anak, sinyal event tersebut tidak berhenti di sana melainkan otomatis melayang naik menembus elemen-elemen induknya ke atas seperti gelembung udara (**Event Bubbling**). Dengan teknik **Event Delegation**, kita cukup menugaskan **satu pendengar interaksi pada wadah induk** untuk mengelola seluruh elemen anak di dalamnya—termasuk elemen baru yang ditambahkan di masa depan.

---

## 1. Analogi Logis: Gelembung Kolam Renang dan Satpam Gerbang Kompleks

Bayangkan dua analogi sederhana berikut:

- **Event Bubbling (Gelembung Udara Menyelam)**:
  Saat Anda meniup gelembung di dasar kolam renang, gelembung itu tidak diam di dasar. Gelembung otomatis melayang naik melewati lapisan air tengah, hingga akhirnya meletus di permukaan kolam.
  Hal serupa terjadi di halaman web: jika Anda mengklik sebuah tombol `<button>` di dalam kartu `<div>`, sinyal klik itu akan naik:
  $$\text{Tombol } \langle\text{button}\rangle \longrightarrow \text{Kartu } \langle\text{div}\rangle \longrightarrow \text{Tubuh } \langle\text{body}\rangle \longrightarrow \text{Dokumen HTML}$$
  Semua elemen di atas tombol tersebut akan ikut "mendengar" bahwa sebuah klik baru saja terjadi!

- **Event Delegation (Satu Satpam di Pintu Gerbang Utama)**:
  Bayangkan sebuah perumahan dengan 100 rumah. Jika pengurus perumahan menyewa 100 satpam untuk berdiri di depan pintu setiap rumah, biayanya sangat boros.
  Solusinya jauh lebih cerdas: cukup sewa **1 orang satpam di pintu gerbang utama perumahan**. Setiap kali ada tamu atau kurir paket datang, satpam gerbang yang memeriksa: _"Bapak mengantarkan paket untuk rumah nomor berapa?"_.
  Di JavaScript: daripada memasang 100 event listener pada 100 tombol hapus, Anda cukup memasang **1 listener pada wadah induknya (`<ul>`)**!

---

## 2. Mengapa JavaScript Didesain Seperti Ini? (First Principles)

### A. Siapa yang Mengklik vs Siapa yang Mendengar? (`target` vs `currentTarget`)
Saat event bubbling melayang naik, objek `event` menyimpan dua informasi krusial yang sering membingungkan pemula:

| Properti Event | Analogi Satpam | Definisi Teknis |
| :--- | :--- | :--- |
| **`event.target`** | Tamu / Orang Asing yang Datang | **Elemen spesifik terdalam yang benar-benar disentuh pengguna** (misal tombol `<button class="btn-hapus">` atau tag `<span>` ikon di dalamnya). |
| **`event.currentTarget`** | Pos Satpam Gerbang | **Elemen pemilik `addEventListener`** tempat sensor dipasang (wadah induk `<ul>`). Nilai ini selalu sama dengan objek tempat listener berada. |

### B. Kunci Rahasia Pencarian: `.closest()`
Saat pengguna mengklik teks atau ikon di dalam tombol, `event.target` bisa saja merupakan tag `<span>` di dalam tombol.
Agar kode kita selalu menemukan elemen tombol pembungkusnya, gunakan metode bawaan:
```javascript
const tombolHapus = event.target.closest(".btn-hapus");
```
Perintah `.closest(".btn-hapus")` bekerja seperti kacamata pintar: ia memeriksa apakah elemen yang disentuh memiliki class `.btn-hapus`. Jika tidak, ia memeriksa elemen induk di atasnya hingga tombol target ditemukan.

### C. Menghentikan Gelembung: `event.stopPropagation()`
Bagaimana jika kita **tidak ingin** sinyal klik melayang naik ke atas?
Contohnya: Di dalam kartu artikel yang bisa diklik untuk membuka berita, terdapat tombol kecil "Suka ❤️". Jika pengunjung mengklik tombol "Suka", kita ingin tombol suka bertambah tanpa memicu pembukaan halaman berita!
```javascript
tombolSuka.addEventListener("click", (event) => {
  event.stopPropagation(); // ⛔ Stop! Jangan biarkan gelembung klik naik ke kartu induk!
  tambahJumlahSuka();
});
```

### D. Jembatan Konsep: Manipulasi DOM Dinamis
Sebelum masuk ke contoh interaktif, ada tiga metode DOM bawaan yang sangat sering bekerja bersama Event Delegation:
1. `document.createElement("li")`: Mencetak elemen HTML baru di memori browser.
2. `wadahInduk.appendChild(elemenBaru)`: Menempelkan elemen baru tersebut ke dalam wadah layar.
3. `elemen.remove()`: Menghapus elemen tersebut dari layar browser seketika.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buktikan kehebatan Event Delegation melalui aplikasi to-do list dinamis. Perhatikan bagaimana tombol hapus pada tugas yang baru diketik langsung aktif bekerja **tanpa** kita perlu memasang listener baru pada tombol tersebut!

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
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      .input-bar {
        display: flex;
        gap: 6px;
        margin-bottom: 12px;
      }
      input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .btn-tambah {
        padding: 8px 14px;
        cursor: pointer;
        background: #0284c7;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: bold;
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
        padding: 4px 10px;
        border-radius: 4px;
        cursor: pointer;
      }
      .status-info {
        margin-top: 12px;
        font-size: 0.8rem;
        color: #475569;
        background: #f1f5f9;
        padding: 6px 8px;
        border-radius: 4px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Daftar Tugas Interaktif</h3>
      <div class="input-bar">
        <input type="text" id="input-tugas" placeholder="Tulis tugas baru..." />
        <button type="button" id="btn-tambah" class="btn-tambah">Tambah</button>
      </div>

      <!-- WADAH INDUK TUNGGAL (SATU-SATUNYA TEMPAT LISTENER DIPASANG) -->
      <ul id="daftar-tugas">
        <li>
          <span>Belajar JavaScript Dasar</span>
          <button type="button" class="btn-hapus">Hapus</button>
        </li>
        <li>
          <span>Praktik DOM Event Bubbling</span>
          <button type="button" class="btn-hapus">Hapus</button>
        </li>
      </ul>

      <div id="status-info" class="status-info">Siap mendeteksi delegasi klik.</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen yang kita perlukan
// ambil element daftar tugas berdasarkan ID-nya, simpan ke variable wadahDaftarTugas
const wadahDaftarTugas = document.querySelector("#daftar-tugas");
// ambil element input tugas berdasarkan ID-nya, simpan ke variable inputTugas
const inputTugas = document.querySelector("#input-tugas");
// ambil element button tambah berdasarkan ID-nya, simpan ke variable tombolTambah
const tombolTambah = document.querySelector("#btn-tambah");
// ambil element status info berdasarkan ID-nya, simpan ke variable statusInfo
const statusInfo = document.querySelector("#status-info");

// ================================================================
// EVENT DELEGATION: CUKUP 1 LISTENER PADA WADAH INDUK (<ul>)
// Listener tunggal ini melayani semua tombol hapus (sekarang & masa depan)
// ================================================================
// saat wadahDaftarTugas di-click, jalankan function berikut:
wadahDaftarTugas.addEventListener("click", (event) => {
  // Inspeksi perbedaan target vs currentTarget:
  // tampilkan target event ke console
  console.log("Elemen yang disentuh jari (target):", event.target);
  // tampilkan target listener ke console
  console.log("Elemen pemilik pos satpam (currentTarget):", event.currentTarget);

  // Periksa apakah elemen yang diklik adalah tombol hapus (atau berada di dalamnya):
  // cari elemen terdekat dengan class btn-hapus, simpan ke variable tombolHapus
  const tombolHapus = event.target.closest(".btn-hapus");

  // Jika yang diklik adalah area teks atau garis putih (bukan tombol hapus), abaikan:
  // jika tombolHapus tidak ditemukan, hentikan eksekusi function
  if (!tombolHapus) return;

  // Jika benar tombol hapus, cari baris <li> pembungkus terdekat:
  // cari elemen terdekat dengan tag li, simpan ke variable barisTugas
  const barisTugas = tombolHapus.closest("li");
  // ambil teks dari elemen span di dalam barisTugas, simpan ke variable teksTugas
  const teksTugas = barisTugas.querySelector("span").textContent;

  // Hapus baris tugas dari struktur DOM browser:
  // hapus element barisTugas dari DOM
  barisTugas.remove();

  // Perbarui pesan status
  // ubah teks konten pada element statusInfo menjadi informasi penghapusan
  statusInfo.textContent = `Tugas "${teksTugas}" berhasil dihapus via Event Delegation!`;
});

// ================================================================
// 2. LOGIKA MENAMBAH TUGAS BARU DINAMIS
// ================================================================
// saat tombolTambah di-click, jalankan function berikut:
tombolTambah.addEventListener("click", () => {
  // bersihkan spasi awal dan akhir dari input, simpan ke variable teks
  const teks = inputTugas.value.trim();
  // jika teks kosong, hentikan eksekusi function
  if (teks === "") return;

  // 1. Buat elemen <li> baru di memori
  // buat elemen list baru, simpan ke variable liBaru
  const liBaru = document.createElement("li");

  // 2. Isi kontennya
  // ubah properti innerHTML pada element liBaru menjadi struktur list item
  liBaru.innerHTML = `
    <span>${teks}</span>
    <button type="button" class="btn-hapus">Hapus</button>
  `;

  // 3. Tempelkan ke wadah induk <ul>
  // tambahkan element liBaru ke dalam wadahDaftarTugas
  wadahDaftarTugas.appendChild(liBaru);

  // 4. Kosongkan input
  // set nilai pada element inputTugas menjadi kosong
  inputTugas.value = "";
  // ubah teks konten pada element statusInfo menjadi informasi penambahan
  statusInfo.textContent = `Tugas baru "${teks}" ditambahkan. Coba hapus!`;

  // CATATAN PENTING:
  // Kita TIDAK PERLU menulis liBaru.querySelector('.btn-hapus').addEventListener(...)!
  // Karena saat tombol hapus baru ini diklik, sinyalnya otomatis melayang naik (bubbling)
  // ke wadahDaftarTugas yang sudah memiliki satpam penjaga di atas!
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan Pola `.closest()` untuk Komponen Kompleks**:
   Di dunia nyata, tombol sering kali diisi gambar SVG atau ikon FontAwesome. Dengan memanggil `event.target.closest(".nama-class")`, Anda terlindungi dari bug di mana pengguna mengklik ikon di tengah tombol dan bukan tombolnya secara langsung.
2. **Gunakan Event Delegation untuk Komponen Dinamis**:
   Gunakan delegasi setiap kali Anda membuat tabel produk, keranjang e-commerce, daftar postingan komentar, atau tab menu navigasi.
3. **Waspadai Kapan Menggunakan `event.stopPropagation()`**:
   Gunakan `stopPropagation()` hanya bila benar-benar diperlukan untuk mencegah interaksi tak diinginkan pada elemen induk. Jangan menggunakannya sembarangan di setiap fungsi karena bisa merusak pelacak analitik (Google Tag Manager) yang bergantung pada bubbling global.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser Anda.
- [ ] Buka DevTools Console (F12).
- [ ] Klik tombol merah **"Hapus"** pada baris pertama $\to$ amati log di console: lihat bagaimana `event.target` merujuk ke `<button>` sedangkan `event.currentTarget` selalu merujuk ke `<ul>`.
- [ ] Tambahkan item baru: ketik `"Belajar Async Await"` lalu klik **"Tambah"**.
- [ ] Klik tombol **"Hapus"** pada item yang baru Anda buat tadi $\to$ perhatikan bahwa item berhasil terhapus seketika tanpa perlu mendaftarkan listener baru!

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti bahwa `event.target` adalah elemen awal pemicu klik, `event.currentTarget` adalah pemilik listener, dan event delegation memanfaatkan bubbling agar 1 listener induk dapat menangani banyak elemen dinamis**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa perbedaan mendasar antara `event.target` (siapa yang memicu) dan `event.currentTarget` (siapa yang mendengarkan)?
2. Mengapa Event Delegation menjadi solusi paling efisien saat kita memiliki daftar panjang yang elemennya bisa terus bertambah atau berkurang secara dinamis?
3. Pada skenario apa Anda perlu memanggil `event.stopPropagation()`?
