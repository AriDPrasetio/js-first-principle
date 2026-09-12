---
title: "Panduan Pemula: Memilih Elemen dan Menangani Klik (querySelector & addEventListener) di JavaScript"
tags: "javascript, first-principles, roadmap-js/08-dom-events"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector"
---

# Panduan Pemula: Memilih Elemen dan Menangani Klik (querySelector & addEventListener) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> JavaScript membuat halaman web statis menjadi interaktif melalui dua langkah mendasar: **menemukan elemen di layar** (`querySelector` / `querySelectorAll`) dan **memasang sensor pendengar interaksi** (`addEventListener`) yang merespons aksi pengguna (klik, ketikan, gerakan kursor) sembari menerima objek laporan kejadian (`event`).

---

## 1. Analogi Logis: Mengaitkan Tali Boneka, Menekan Bel, dan Surat Laporan

Bayangkan halaman web Anda adalah sebuah panggung pertunjukan boneka:

- **DOM (Pohon Boneka di Layar)**:
  Browser membaca file HTML Anda dan mengubah setiap judul `<h1>`, paragraf `<p>`, dan tombol `<button>` menjadi boneka-boneka objek yang berdiri di atas panggung hierarki.
- **`querySelector` (Tali Pengait Boneka)**:
  Anda melemparkan kail pancing bertali untuk memegang salah satu boneka: `const tombol = document.querySelector("#tombol-buka");`. Sekarang Anda memegang tali kendali boneka tersebut di memori JavaScript.
- **`addEventListener` (Memasang Bel Sensor Gerak)**:
  Anda menempelkan sensor alarm pada boneka tersebut: _"Hei tombol, jika ada penonton yang menyentuh atau mengklik kamu (`"click"`), segera jalankan fungsi ini!"_.
- **Objek `event` (Surat Laporan Kejadian)**:
  Setiap kali bel berbunyi, petugas keamanan otomatis menyodorkan sepucuk surat laporan: _"Perhatian! Kejadian klik baru saja terjadi di koordinat (X: 120, Y: 45), menggunakan tombol kiri mouse, dan menimpa tombol bertuliskan Tambah"_. Surat laporan inilah yang kita tangkap lewat parameter `event` (sering disingkat `e`).

---

## 2. Mengapa Didesain Seperti Ini? (First Principles)

### A. Menggunakan Selektor CSS yang Sudah Anda Kenal
`querySelector` tidak menciptakan sintaks baru; ia memakai aturan penulisan yang sama persis dengan CSS:
- Mengambil berdasarkan ID $\to$ awali tanda pagar (`#nama-id`).
- Mengambil berdasarkan Class $\to$ awali tanda titik (`.nama-class`).
- Mengambil berdasarkan nama tag $\to$ langsung sebutkan tag-nya (`button`, `p`, `h1`).

### B. `querySelector` (Satu) vs `querySelectorAll` (Banyak)
- **`document.querySelector(".btn")`**: Hanya mencari dan mengembalikan **1 elemen pertama** yang cocok. Jika ada 5 tombol berkelas `.btn`, hanya tombol nomor 1 yang diambil. Jika tidak ada yang cocok, mengembalikan `null`.
- **`document.querySelectorAll(".btn")`**: Mengembalikan **seluruh elemen** yang cocok dalam wadah daftar bernama `NodeList`.
  > [!WARNING]
  > **Jebakan Klasik Pemula**: `NodeList` adalah sekumpulan elemen (seperti rak buku), bukan elemen tunggal. Anda **TIDAK BISA** menulis:
  > ```javascript
  > // ❌ ERROR: querySelectorAll menghasilkan NodeList, bukan elemen tunggal!
  > document.querySelectorAll(".btn").addEventListener("click", ...); // TypeError: ...addEventListener is not a function
  > ```
  > Anda harus mengulanginya satu per satu menggunakan `.forEach()`:
  > ```javascript
  > // ✅ BENAR: Pasang listener ke setiap tombol di dalam koleksi
  > document.querySelectorAll(".btn").forEach((tombol) => {
  >   tombol.addEventListener("click", () => console.log("Tombol diklik!"));
  > });
  > ```

### C. Anatomi `addEventListener` dan Objek `event`
Struktur standar memasang sensor adalah:
$$\text{targetElemen}.\text{addEventListener}(\text{"namaEvent"}, (\text{event}) \Rightarrow \{ \dots \})$$
Parameter `event` adalah objek bawaan browser yang berisi informasi tentang aksi tersebut:
- `event.target`: Elemen HTML spesifik yang memicu kejadian.
- `event.type`: Nama event yang sedang berjalan (misal: `"click"`).
- `event.preventDefault()`: Perintah untuk membatalkan perilaku bawaan browser (contoh: mencegah form me-refresh halaman saat disubmit atau mencegah link berpindah URL).

### D. Perbedaan Aman: `.textContent` vs `.innerHTML`
- `.textContent`: Membaca atau menulis murni teks mentah. Karakter tanda panah `<script>` akan dicetak apa adanya sebagai tulisan di layar tanpa dieksekusi.
- `.innerHTML`: Membaca atau menulis teks sebagai kode HTML hidup.
  > [!IMPORTANT]
  > **Bahaya XSS (Cross-Site Scripting)**:
  > XSS adalah celah keamanan di mana pengguna jahat mengetikkan kode JavaScript berbahaya (misalnya: `<img src=x onerror="ambilPasswordSaya()">`) ke dalam kotak formulir komentar. Jika Anda menampilkan teks tersebut ke layar menggunakan `.innerHTML`, script penyerang akan dieksekusi oleh browser korban! Selalu gunakan `.textContent` untuk menampilkan data teks dari pengguna.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kartu penghitung interaktif yang mendukung tombol penambah, tombol pengurang, dan tombol reset, sekaligus memanfaatkan objek `event`:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | querySelector & addEventListener</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 340px;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      .angka {
        font-size: 2.8rem;
        font-weight: bold;
        margin: 12px 0;
        color: #2563eb;
      }
      .btn-group {
        display: flex;
        gap: 8px;
      }
      button {
        flex: 1;
        padding: 10px;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #999;
        background: #f3f4f6;
        font-weight: 500;
      }
      .btn-aksi {
        background: #2563eb;
        color: #fff;
        border: none;
      }
      .info-log {
        margin-top: 14px;
        font-size: 0.85rem;
        color: #64748b;
        background: #f8fafc;
        padding: 8px;
        border-radius: 4px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Penghitung Interaksi</h3>
      <div id="angka-counter" class="angka">0</div>

      <!-- Kumpulan tombol perubahan angka -->
      <div class="btn-group">
        <button type="button" class="btn-aksi" data-delta="-1">Kurang (-1)</button>
        <button type="button" class="btn-aksi" data-delta="1">Tambah (+1)</button>
      </div>

      <div style="margin-top: 8px;">
        <button type="button" id="btn-reset" style="width: 100%;">Reset (0)</button>
      </div>

      <div id="info-log" class="info-log">Belum ada tombol yang diklik.</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// ================================================================
// 1. CARI DAN SIMPAN ELEMEN KE VARIABEL (CACHE DOM SEKALI DI AWAL)
// ================================================================

// Elemen tunggal dipilih dengan document.querySelector:
const displayAngka = document.querySelector("#angka-counter");
const tombolReset = document.querySelector("#btn-reset");
const logInfo = document.querySelector("#info-log");

// Sekumpulan tombol dipilih dengan document.querySelectorAll:
const kumpulanTombolAksi = document.querySelectorAll(".btn-aksi");

// 2. Siapkan data angka di memori
let jumlahHitungan = 0;

// ================================================================
// 3. PASANG SENSOR PADA BANYAK ELEMEN MENGGUNAKAN .forEach()
// ================================================================
kumpulanTombolAksi.forEach((tombol) => {
  // Tangkap objek 'event' pada parameter fungsi callback:
  tombol.addEventListener("click", (event) => {
    // Ambil data-delta dari tombol yang sedang diklik (misal: "1" atau "-1")
    const nilaiPerubahan = Number(event.target.dataset.delta);

    // Update data di memori JavaScript
    jumlahHitungan += nilaiPerubahan;

    // Tampilkan data yang diperbarui ke layar dengan aman (.textContent)
    displayAngka.textContent = jumlahHitungan;

    // Tampilkan informasi laporan kejadian dari event object
    logInfo.textContent = `Aksi: ${event.type} pada tombol "${event.target.textContent}"`;
  });
});

// ================================================================
// 4. PASANG SENSOR PADA TOMBOL RESET TUNGGAL
// ================================================================
tombolReset.addEventListener("click", () => {
  jumlahHitungan = 0;
  displayAngka.textContent = jumlahHitungan;
  logInfo.textContent = "Hitungan di-reset ke 0.";
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu Gunakan Atribut `defer` pada Tag Script**:
   Pasang `<script src="app.js" defer></script>` di dalam tag `<head>`. `defer` memberi tahu browser: _"Unduh file script ini di latar belakang, namun tahan eksekusinya sampai seluruh struktur elemen HTML selesai dibaca dan digambar"_. Ini mencegah error umum `TypeError: Cannot read properties of null (reading 'addEventListener')`.
2. **Pilihlah `.textContent` daripada `.innerHTML`**:
   Kecuali Anda benar-benar berniat merender tag HTML baru yang Anda buat sendiri, selalu gunakan `.textContent` untuk memasukkan teks. Ini adalah benteng pertahanan utama web Anda dari serangan injeksi XSS.
3. **Simpan Referensi DOM di Variabel (Cache)**:
   Mencari elemen ke seluruh pohon DOM memerlukan kalkulasi. Jangan memanggil `document.querySelector("#counter")` berulang-ulang di dalam setiap perulangan atau fungsi klik. Cari sekali di baris teratas file, simpan di `const`, dan gunakan variabel tersebut.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser Anda.
- [ ] Klik tombol **"Tambah (+1)"** dan **"Kurang (-1)"** $\to$ pastikan angka berubah dan teks laporan info di bawah mencatat event yang terjadi.
- [ ] Klik tombol **"Reset (0)"** $\to$ pastikan angka kembali ke 0.
- [ ] Buka Console browser (F12), coba ketik `document.querySelectorAll(".btn-aksi")` $\to$ amati bahwa hasilnya adalah `NodeList(2)`.
- [ ] Coba ketik `document.querySelector("#angka-counter").textContent = "999"` di Console $\to$ perhatikan bagaimana teks di layar berubah seketika.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti bahwa `querySelector` mengambil 1 elemen sedangkan `querySelectorAll` menghasilkan koleksi `NodeList` yang harus diulang dengan `.forEach()`, serta memahami bahwa fungsi di `addEventListener` menerima objek laporan `event`**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa akibatnya jika Anda menjalankan `document.querySelectorAll("button").addEventListener("click", () => {})` secara langsung tanpa loop `.forEach()`?
2. Mengapa penggunaan `.textContent` jauh lebih aman daripada `.innerHTML` ketika kita ingin menampilkan teks yang diketik oleh pengguna?
3. Apa perbedaan informasi yang diberikan oleh `event.target` dibandingkan dengan nama tipe event di `event.type`?
