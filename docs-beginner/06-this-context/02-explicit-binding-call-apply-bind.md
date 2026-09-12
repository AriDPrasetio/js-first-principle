---
title: "Panduan Pemula: Explicit Binding (call, apply, dan bind) di JavaScript"
tags: "javascript, first-principles, roadmap-js/06-this-context"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call"
---

# Panduan Pemula: Explicit Binding (call, apply, dan bind) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Jika sebelumnya `this` ditentukan otomatis oleh siapa yang memanggilnya, dengan `call`, `apply`, dan `bind` Anda memiliki kendali manual untuk **memaksa** fungsi mengikat objek tertentu sebagai pemilik `this`-nya secara eksplisit.

---

## 1. Analogi Logis: Peminjaman Megafon Suara

Bayangkan Anda memiliki sebuah megafon pengumuman:

- **`.call()` (Bicara Sekarang Juga)**:
  Anda menyodorkan megafon ke Budi: *"Budi, bicara detik ini juga!"*. Parameter tambahan diserahkan satu per satu dengan koma: `.call(budi, "Selamat Pagi", "Jakarta")`.
- **`.apply()` (Bicara Sekarang Juga Menggunakan Daftar Amplop/Array)**:
  Sama persis seperti `call`, perbedaannya bahan ucapannya diserahkan dalam satu amplop daftar tertutup (*Array*): `.apply(budi, ["Selamat Pagi", "Jakarta"])`.
  *(💡 Tips mudah ingat: **A**pply menerima **A**rray, **C**all menerima **C**omma).*
- **`.bind()` (Kunci Permanen untuk Dipakai Nanti)**:
  Anda menempelkan stiker nama permanen berlem super ke megafon itu: *"Mulai sekarang, megafon ini terkunci atas nama Budi selamanya"*. Megafon tidak langsung berbunyi sekarang, melainkan menghasilkan **fungsi kembar baru** yang siap dipanggil kapan saja di masa depan.

---

## 2. Kapan Kita Membutuhkan Ketiganya? (First Principles)

### A. Eksekusi Seketika (`call` & `apply`) vs Eksekusi Nanti (`bind`)
- Gunakan `call` atau `apply` saat Anda ingin **langsung mengeksekusi** fungsi detik itu juga pada sebuah objek data.
- Gunakan `bind` saat Anda memasang fungsi ke tombol klik HTML (`addEventListener`) atau callback timer, di mana eksekusi baru terjadi di masa depan saat pengguna berinteraksi.

### B. Kekuatan Super Ganda `.bind()`: Mengunci Parameter (*Partial Application*)
Selain mengunci `this`, method `.bind()` memiliki kekuatan istimewa: ia bisa **mengunci nilai parameter awal fungsi sekaligus**:

```javascript
function hitungOngkir(kota, beratKg) {
  console.log(`Kirim ke ${kota} seberat ${beratKg}kg`);
}

// Kunci parameter 'kota' menjadi 'Surabaya' sejak awal:
const kirimSurabaya = hitungOngkir.bind(null, "Surabaya");

// Saat dipanggil nanti, kita cukup mengirim sisa parameternya (beratKg):
kirimSurabaya(5); // "Kirim ke Surabaya seberat 5kg"
```

Pola ini disebut **Partial Application** (mengisi sebagian argumen di muka).

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
          3. Kunci Tiket Panitia (Gunakan .bind + Partial Args)
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
const teksNama = document.querySelector("#teks-nama");
const teksZona = document.querySelector("#teks-zona");
const teksPintu = document.querySelector("#teks-pintu");

const tombolCall = document.querySelector("#btn-call");
const tombolApply = document.querySelector("#btn-apply");
const tombolBind = document.querySelector("#btn-bind");

// FUNGSI MANDIRI PENCETAK TIKET:
function cetakTiket(zona, pintu) {
  teksNama.textContent = `Nama: ${this.namaPemesan}`;
  teksZona.textContent = `Zona Kursi: ${zona}`;
  teksPintu.textContent = `Pintu Masuk: ${pintu}`;
}

// Data objek penonton yang tidak punya fungsi sendiri:
const userVIP = { namaPemesan: "Siti Rahma (VIP)" };
const userFestival = { namaPemesan: "Joko Anwar (Festival)" };
const panitiaAcara = { namaPemesan: "Rian (Staff Panitia)" };

// ================================================================
// 1. .call() -> Argumen dipisah dengan koma satu per satu
// ================================================================
tombolCall.addEventListener("click", () => {
  cetakTiket.call(userVIP, "VIP Row A-12", "Gate 1 (Khusus)");
});

// ================================================================
// 2. .apply() -> Argumen dibungkus di dalam satu Array
// ================================================================
tombolApply.addEventListener("click", () => {
  const dataTambahan = ["Festival Barat", "Gate 3 (Umum)"];
  cetakTiket.apply(userFestival, dataTambahan);
});

// ================================================================
// 3. .bind() -> Mengunci 'this' DAN parameter (Partial Application)
// ================================================================
// Di sini .bind mengunci 'panitiaAcara' sebagai this,
// SEKALIGUS mengunci zona "Backstage All-Access" dan pintu "Pintu Kru":
const cetakTiketPanitiaTerkunci = cetakTiket.bind(
  panitiaAcara,
  "Backstage All-Access",
  "Pintu Kru",
);

// Saat tombol diklik, kita langsung panggil fungsi baru yang sudah terkunci ini:
tombolBind.addEventListener("click", cetakTiketPanitiaTerkunci);
```

---

## 4. Solusi Praktis / Best Practice

1. **Jembatan Memori**:
   - **C**all = dipisahkan tanda **C**omma (koma).
   - **A**pply = dibungkus dalam **A**rray.
   - **B**ind = mengikat (**B**ind) fungsi baru untuk nanti.
2. **Kekekalan `.bind()`**: Sekali fungsi diikat dengan `.bind()`, pengikatan `this`-nya terkunci mati permanen. Memanggil `.call()` atau `.apply()` pada fungsi hasil `.bind()` tidak akan bisa memindahkan nilai `this`-nya ke objek lain.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik tombol ke-1 (VIP) $\to$ perhatikan nama berganti menjadi Siti Rahma.
- [ ] Klik tombol ke-2 (Festival) $\to$ perhatikan nama berganti menjadi Joko Anwar lewat array `apply`.
- [ ] Klik tombol ke-3 (Panitia) $\to$ perhatikan tiket berganti menjadi staf panitia Rian secara instan melalui fungsi yang sudah diikat permanen dengan `.bind()`.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Bisa membedakan kapan memakai `.call()`/`.apply()` (langsung jalan) vs `.bind()` (menghasilkan fungsi baru), dan tahu bahwa `.bind()` bisa mengunci nilai argumen awal (*Partial Application*)**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa yang membedakan cara pengiriman argumen antara `.call()` dan `.apply()`?
2. Jika Anda memiliki fungsi `function sambung(a, b) { return a + b; }`, bagaimana cara menggunakan `.bind()` untuk menciptakan fungsi baru yang selalu menambahkan angka `10` ke parameter apa pun yang dikirimkan?
```
