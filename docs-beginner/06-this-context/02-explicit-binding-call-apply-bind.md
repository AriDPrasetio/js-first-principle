---
title: "Panduan Pemula: Explicit Binding (call, apply, dan bind) di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/06-this-context
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
---

# Panduan Pemula: Explicit Binding (call, apply, dan bind) di JavaScript

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> Jika sebelumnya `this` ditentukan otomatis oleh siapa yang memanggilnya, dengan `call`, `apply`, dan `bind` Anda bisa **memaksa** fungsi untuk menganggap objek tertentu sebagai pemilik `this`-nya secara sengaja.

---

## 1. Analogi Logis: Peminjaman Megafon Suara

Bayangkan Anda memiliki sebuah megafon pengumuman:

- **`.call()` (Bicara Sekarang Juga)**:
  Anda menyodorkan megafon ke Budi: _"Budi, bicara detik ini juga!"_. Parameter tambahan diserahkan satu per satu dengan koma: `.call(budi, "Selamat Pagi", "Jakarta")`.
- **`.apply()` (Bicara Sekarang Juga Menggunakan Daftar Amplop/Array)**:
  Sama persis seperti `call`, perbedaannya hanya bahan ucapannya diserahkan dalam satu amplop daftar tertutup (_Array_): `.apply(budi, ["Selamat Pagi", "Jakarta"])`.
  _(💡 Tips mudah ingat: **A**pply menerima **A**rray)._
- **`.bind()` (Kunci Permanen untuk Dipakai Nanti)**:
  Anda menempelkan stiker nama permanen berlem super ke megafon itu: _"Mulai sekarang, megafon ini terkunci atas nama Budi selamanya"_. Megafon tidak langsung berbunyi sekarang, melainkan menghasilkan **fungsi kembar baru** yang siap dipanggil kapan saja di masa depan.

---

## 2. Kapan Kita Membutuhkan Ketiganya? (First Principles)

1. **`call` & `apply` $\to$ Eksekusi Langsung Seketika**:
   Dipakai saat Anda ingin langsung menjalankan fungsi saat itu juga pada sebuah data objek tanpa perlu menempelkan fungsi tersebut ke dalam objeknya.
2. **`bind` $\to$ Eksekusi Nanti di Masa Depan**:
   Sangat penting saat memasang fungsi ke tombol klik HTML (`addEventListener`). Tanpa `bind()`, saat tombol diklik oleh pengguna, browser sering kali mengalihkan nilai `this` menjadi tombol HTML, bukan objek data Anda. `bind()` mengunci pemilik aslinya!

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat pencetak tiket konser yang memanfaatkan satu fungsi cetak untuk beberapa penonton:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | call, apply, dan bind</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .btn-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 12px;
      }
      button {
        padding: 8px;
        font-size: 0.85rem;
        cursor: pointer;
      }
      .tiket {
        background: #fefce8;
        border: 1px dashed #ca8a04;
        padding: 12px;
        border-radius: 6px;
      }
      .tiket h4 {
        margin: 0 0 6px 0;
        color: #a16207;
      }
      p {
        margin: 4px 0;
        font-size: 0.9rem;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Pencetak Tiket Konser</h3>
      <div class="btn-group">
        <button type="button" id="btn-call">
          1. Cetak Tiket VIP (Gunakan .call)
        </button>
        <button type="button" id="btn-apply">
          2. Cetak Tiket Festival (Gunakan .apply)
        </button>
        <button type="button" id="btn-bind">
          3. Kunci Tiket Panitia (Gunakan .bind)
        </button>
      </div>
      <div id="kotak-tiket" class="tiket">
        <h4>Tiket Masuk</h4>
        <p id="teks-nama">Nama: -</p>
        <p id="teks-zona">Zona Kursi: -</p>
        <p id="teks-pintu">Pintu Masuk: -</p>
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen teks tiket dari HTML
const teksNama = document.querySelector("#teks-nama");
// ambil elemen teks nama penonton di tiket.

const teksZona = document.querySelector("#teks-zona");
// ambil elemen teks zona kursi di tiket.

const teksPintu = document.querySelector("#teks-pintu");
// ambil elemen teks pintu masuk di tiket.

const tombolCall = document.querySelector("#btn-call");
// ambil tombol call.

const tombolApply = document.querySelector("#btn-apply");
// ambil tombol apply.

const tombolBind = document.querySelector("#btn-bind");
// ambil tombol bind.

// ================================================================
// FUNGSI MANDIRI PENCETAK TIKET
// Fungsi ini menggunakan 'this.namaPemesan'
// ================================================================
function cetakTiket(zona, pintu) {
  // ubah teks di antarmuka tiket HTML:
  teksNama.textContent = `Nama: ${this.namaPemesan}`;
  teksZona.textContent = `Zona Kursi: ${zona}`;
  teksPintu.textContent = `Pintu Masuk: ${pintu}`;
}

// Data objek penonton yang tidak punya fungsi sendiri:
const userVIP = { namaPemesan: "Siti Rahma (VIP)" };
const userFestival = { namaPemesan: "Joko Anwar (Festival)" };
const panitiaAcara = { namaPemesan: "Rian (Staff Panitia)" };

// ================================================================
// PENGGUNAAN 1: .call() -> Mengoper argumen dengan koma satu per satu
// ================================================================
tombolCall.addEventListener("click", () => {
  // paksa 'this' menjadi userVIP, lalu kirim zona dan pintu:
  cetakTiket.call(userVIP, "VIP Row A-12", "Gate 1 (Khusus)");
});

// ================================================================
// PENGGUNAAN 2: .apply() -> Mengoper argumen di dalam Array [...]
// ================================================================
tombolApply.addEventListener("click", () => {
  const dataTambahan = ["Festival Barat", "Gate 3 (Umum)"];
  // paksa 'this' menjadi userFestival, kirim parameter lewat Array:
  cetakTiket.apply(userFestival, dataTambahan);
});

// ================================================================
// PENGGUNAAN 3: .bind() -> Mengunci objek secara permanen untuk fungsi baru
// ================================================================
// Buat fungsi baru yang sudah terkunci mati ke objek panitiaAcara:
const cetakTiketPanitiaTerkunci = cetakTiket.bind(
  panitiaAcara,
  "Backstage All-Access",
  "Pintu Kru",
);

// Saat tombol di-klik, cukup panggil fungsi hasil kuncian tanpa parameter lagi:
tombolBind.addEventListener("click", cetakTiketPanitiaTerkunci);
```

---

## 4. Solusi Praktis / Best Practice

1. **Ingat Jembatan Keledai**:
   - **C**all = dipisahkan tanda **C**omma (koma).
   - **A**pply = dibungkus dalam **A**rray.
   - **B**ind = mengikat (**B**ind) fungsi baru untuk nanti.
2. **Jangan panggil `.bind()` dua kali**:
   Sekali fungsi diikat dengan `.bind()`, nilai `this`-nya terkunci permanen. Mengikatnya lagi untuk kedua kalinya tidak akan mengubah siapa pemilik pertamanya.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik tombol ke-1 (VIP) $\to$ perhatikan nama berganti menjadi Siti Rahma.
- [ ] Klik tombol ke-2 (Festival) $\to$ perhatikan nama berganti menjadi Joko Anwar.
- [ ] Klik tombol ke-3 (Panitia) $\to$ perhatikan tiket berganti menjadi staf panitia Rian secara instan melalui fungsi yang sudah diikat permanen dengan `.bind()`.

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Bisa membedakan kapan menggunakan `.call()`/`.apply()` (eksekusi langsung detik itu juga) vs `.bind()` (menciptakan fungsi terikat untuk dijalankan nanti)**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa yang membedakan cara pengiriman argumen antara `.call()` dan `.apply()`?
2. Jika sebuah fungsi sudah dikunci menggunakan `.bind(objekA)`, apakah kita bisa mengubah `this`-nya menjadi `objekB` dengan memanggil `.call(objekB)`?
