---
title: "Panduan Pemula: Melacak Bug dengan Console dan Breakpoint di Browser"
tags: "javascript, first-principles, roadmap-js/12-browser-devtools"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Debugging_JavaScript"
---

# Panduan Pemula: Melacak Bug dengan Console dan Breakpoint di Browser

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Menemukan kesalahan kode (*Debugging*) tidak harus dilakukan dengan menebak-nebak: gunakan **ragam metode `console`** (`console.table`, `console.warn`, `console.error`) untuk inspeksi cepat, atau gunakan **Breakpoint** (baik lewat kata kunci `debugger;` maupun klik nomor baris di tab **Sources**) untuk membekukan waktu di browser dan memeriksa isi variabel secara presisi baris demi baris.

---

## 1. Analogi Logis: Kamera Foto vs Remote Pembeku Waktu

Bayangkan Anda seorang detektif yang sedang mengusut kasus misterius:

```
[ Mode Investigasi ]
       │
       ├─► 1. console.log() (Kamera Foto Jarak Jauh)
       │    └─ Hanya menjepret satu momen statis di teks konsol.
       │
       └─► 2. Breakpoint / debugger; (Remote Pembeku Waktu)
            ├─ Browser berhenti membeku seketika di baris target!
            ├─ Buka panel Scope untuk mengintip seluruh variabel di memori.
            └─ Melangkah satu per satu (Step Over / Step Into).
```

1. **`console.log()` (Memotret dari Jarak Jauh)**:
   Anda menjepret foto untuk melihat isi variabel di satu momen. Hasilnya hanya selembar foto teks statis di jendela Console.
2. **Breakpoint & `debugger;` (Remote Penghenti Waktu Ajaib)**:
   Anda menekan tombol pembeku waktu: **seluruh browser berhenti membeku seketika tepat di baris tersebut!**
   Animasi berhenti, klik tertahan, dan Anda bisa mengarahkan kursor mouse ke variabel mana pun untuk mengintip nilainya, memeriksa riwayat panggilan fungsi (*Call Stack*), dan melangkah perlahan satu baris demi satu baris (*Stepping*).

---

## 2. Fitur DevTools Penting yang Wajib Dikuasai (First Principles)

### A. Ragam Metode Objek `console`

Jangan hanya terpaku pada `console.log()`! Browser menyediakan metode yang jauh lebih tepat guna:

| Perintah Console | Tampilan di DevTools | Kapan Sebaiknya Digunakan? |
| :--- | :--- | :--- |
| **`console.log(data)`** | Teks putih/hitam standar | Informasi umum alur program. |
| **`console.warn(pesan)`** | Latar kuning dengan ikon tanda seru ⚠️ | Peringatan kondisi yang kurang ideal namun aplikasi masih bisa berjalan. |
| **`console.error(pesan)`** | Latar merah dengan tanda silang ❌ | Kesalahan fatal; otomatis mencetak asal berkas dan nomor baris (*stack trace*). |
| **`console.table(data)`** | **Tabel kolom & baris rapi** (seperti Excel) | Menampilkan *Array of Objects* atau struktur data berulang. |
| **`console.dir(elemen)`** | Pohon JSON properti interaktif | Menginspeksi seluruh properti internal dari suatu elemen HTML atau objek rumit. |

### B. Dua Cara Memasang Breakpoint

1. **Cara Kode: Kata Kunci `debugger;`**:
   Tuliskan `debugger;` di dalam kode JavaScript Anda. Jika jendela Developer Tools (F12) sedang terbuka, browser otomatis membeku tepat di baris itu ketika fungsi dijalankan.
2. **Cara GUI DevTools (Line Breakpoint di Tab Sources)**:
   Anda bisa memasang breakpoint **tanpa perlu mengedit file kode asli**:
   - Buka DevTools (`F12`) $\to$ klik tab **Sources**.
   - Buka berkas `app.js` pada panel navigasi di sebelah kiri.
   - **Klik nomor baris** di tepi kiri (*gutter*). Sebuah pita biru/panah akan muncul menandai bahwa breakpoint telah dipasang di baris tersebut!

### C. Empat Tombol Kendali Saat Browser Membeku (*Stepping*)

Saat browser berhenti di breakpoint, deretan tombol kendali di pojok kanan atas DevTools menjadi aktif:

```
[ ▶ Resume (F8) ]   [ ↷ Step Over (F10) ]   [ ⤓ Step Into (F11) ]   [ ⤒ Step Out (Shift+F11) ]
```

- **Resume (F8 / Tombol Play Biru)**: Lanjutkan jalannya program dengan kecepatan penuh sampai menemui breakpoint berikutnya.
- **Step Over (F10)**: Jalankan baris saat ini dan melangkah maju ke baris berikutnya (tidak masuk menyelam ke dalam fungsi lain).
- **Step Into (F11)**: Jika baris saat ini memanggil sebuah fungsi, masuklah ke baris pertama di dalam fungsi tersebut.
- **Step Out (Shift + F11)**: Jalankan sisa fungsi saat ini sampai selesai dan langsung kembali ke fungsi pemanggilnya di atas.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kasir toko yang mendemonstrasikan `console.table`, `console.dir`, dan simulasi remote pembeku waktu:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Console & Breakpoints</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 380px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      .btn-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }
      button {
        padding: 10px;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #999;
        font-weight: 500;
        text-align: left;
      }
      #btn-tabel { background: #e0e7ff; }
      #btn-dir { background: #fef3c7; }
      #btn-debug { background: #fee2e2; border-color: #ef4444; font-weight: bold; }
      .instruksi {
        font-size: 0.85rem;
        color: #475569;
        line-height: 1.4;
        padding: 8px;
        background: #f8fafc;
        border-radius: 4px;
        margin-bottom: 12px;
      }
      .status {
        padding: 8px;
        background: #f1f5f9;
        border-radius: 4px;
        font-size: 0.9rem;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Uji Coba Debugging Browser</h3>
      <div class="instruksi">
        <strong>PENTING:</strong> Tekan tombol keyboard <code>F12</code> untuk membuka jendela DevTools browser sebelum menekan tombol di bawah!
      </div>
      <div class="btn-group">
        <button type="button" id="btn-tabel">
          1. Cetak Tabel Pesanan (console.table)
        </button>
        <button type="button" id="btn-dir">
          2. Inspeksi Elemen DOM (console.dir)
        </button>
        <button type="button" id="btn-debug">
          3. Bekukan Eksekusi (debugger;)
        </button>
      </div>
      <div id="kotak-status" class="status">Buka tab Console (F12) untuk melihat hasilnya.</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Data daftar pesanan toko
const daftarPesanan = [
  { id: 101, menu: "Kopi Susu Gula Aren", harga: 18000, jumlah: 2 },
  { id: 102, menu: "Croissant Cokelat", harga: 22000, jumlah: 1 },
  { id: 103, menu: "Air Mineral Botol", harga: 6000, jumlah: 3 },
];

const tombolTabel = document.querySelector("#btn-tabel");
const tombolDir = document.querySelector("#btn-dir");
const tombolDebug = document.querySelector("#btn-debug");
const kotakStatus = document.querySelector("#kotak-status");

// ================================================================
// FITUR 1: console.table() & console.warn()
// ================================================================
tombolTabel.addEventListener("click", () => {
  console.log("--- Daftar Pesanan Pembeli ---");
  // Cetak dalam bentuk tabel tabular:
  console.table(daftarPesanan);

  // Berikan peringatan jika ada item yang harganya di atas 20.000:
  daftarPesanan.forEach((item) => {
    if (item.harga > 20000) {
      console.warn(`Menu premium terdeteksi: ${item.menu} (Rp ${item.harga})`);
    }
  });

  kotakStatus.textContent = "✅ Tabel dan warning dicetak di tab Console!";
});

// ================================================================
// FITUR 2: console.dir() UNTUK INSPEKSI POHON ELEMEN DOM
// ================================================================
tombolDir.addEventListener("click", () => {
  console.log("--- Inspeksi Properti Tombol ---");
  // console.log mencetak tag HTML, sedangkan console.dir membuka pohon propertinya:
  console.dir(tombolDir);

  kotakStatus.textContent = "✅ Pohon properti tombol dicetak via console.dir!";
});

// ================================================================
// FITUR 3: KATA KUNCI debugger; DAN STEPPING CONTROL
// ================================================================
tombolDebug.addEventListener("click", () => {
  kotakStatus.textContent = "⏳ Memproses kalkulasi tagihan...";

  let totalTagihan = 0;

  for (let i = 0; i < daftarPesanan.length; i++) {
    const item = daftarPesanan[i];
    const subtotal = item.harga * item.jumlah;

    // ============================================================
    // JIKA JENDELA F12 TERBUKA, BROWSER MEMBEKU DI BARIS INI!
    // Amati panel Scope di sisi kanan DevTools:
    // Cek nilai 'item', 'subtotal', dan 'totalTagihan'.
    // Tekan F10 (Step Over) untuk melangkah ke iterasi berikutnya!
    // ============================================================
    debugger;

    totalTagihan += subtotal;
  }

  kotakStatus.textContent = `Total Tagihan: Rp ${totalTagihan.toLocaleString("id-ID")}`;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu Bersihkan Kata Kunci `debugger;` Sebelum Rilis**:
   Jika kata `debugger;` tidak sengaja tertinggal di produksi, setiap pengguna atau pengembang lain yang membuka F12 akan mengalami aplikasi membeku secara mengejutkan.
2. **Gunakan Conditional Breakpoint di Tab Sources**:
   Di tab Sources, Anda bisa klik kanan pada nomor baris $\to$ pilih **Add conditional breakpoint...** $\to$ masukkan kondisi misal `item.harga > 20000`. Browser hanya akan berhenti jika kondisi tersebut terpenuhi!
3. **Manfaatkan Panel "Scope"**:
   Saat browser berhenti membeku, jangan menebak nilai variabel. Lihat panel **Scope** di sebelah kanan: variabel `Local` dan `Global` tercantum dengan nilai aslinya saat detik itu.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di Google Chrome atau Mozilla Firefox.
- [ ] Buka jendela DevTools dengan menekan **`F12`**, lalu arahkan ke tab **Console**.
- [ ] Klik tombol **"1. Cetak Tabel Pesanan (console.table)"** $\to$ amati tabel rapi dan peringatan warna kuning (`console.warn`).
- [ ] Klik tombol **"2. Inspeksi Elemen DOM (console.dir)"** $\to$ klik tanda panah segitiga untuk membuka seluruh properti internal tombol.
- [ ] Beralih ke tab **Sources**, lalu klik tombol **"3. Bekukan Eksekusi (debugger;)"** $\to$ amati browser membeku!
- [ ] Tekan tombol keyboard **`F10`** beberapa kali untuk melangkah satu baris ke bawah, sambil memperhatikan variabel `subtotal` yang bertambah di panel **Scope**.
- [ ] Tekan tombol **`F8`** untuk melanjutkan eksekusi secara normal hingga selesai.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu menggunakan `console.table`, tahu cara menghentikan browser dengan `debugger;` atau Line Breakpoint di tab Sources, dan mampu melangkah dengan tombol Stepping (F10/F8)**.

---

## 🎯 Uji Pemahaman Mandiri

1. Kapan Anda sebaiknya menggunakan `console.table()` alih-alih `console.log()` biasa?
2. Apa perbedaan cara kerja antara tombol **Step Over (F10)** dengan tombol **Step Into (F11)** saat browser sedang berhenti di sebuah breakpoint?
3. Mengapa kata kunci `debugger;` tidak disarankan ditinggalkan di dalam kode produksi yang sudah dipublikasikan ke publik?
