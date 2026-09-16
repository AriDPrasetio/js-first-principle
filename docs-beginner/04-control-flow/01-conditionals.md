---
title: "Panduan Pemula: Percabangan Kondisional (if/else, switch, ??) di JavaScript"
tags: "javascript, first-principles, roadmap-js/04-control-flow"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else"
---

# Panduan Pemula: Percabangan Kondisional (if/else, switch, ??) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Percabangan adalah "rambu persimpangan jalan" di program Anda:
>
> 1. **`if/else` & Ternary (`? :`)**: Menguji kondisi benar (*truthy*) atau salah (*falsy*).
> 2. **`switch`**: Memilih satu dari banyak jalur diskrit yang sudah pasti nilainya.
> 3. **`??` (Nullish Coalescing)**: Menetapkan nilai cadangan hanya jika data strictly bernilai `null` atau `undefined`.

---

## 1. Tiga Analogi Logis Pengambil Keputusan

### A. `if / else if / else` (Palang Pintu Otomatis Parkir)
Bayangkan palang pintu di gedung parkir:
- **Jika (`if`)** tiket parkir sudah dibayar lunas $\to$ palang terbuka hijau.
- **Atau jika (`else if`)** memiliki kartu parkir khusus langganan $\to$ palang terbuka biru.
- **Selain itu (`else`)** $\to$ palang tetap tertutup dan alarm berbunyi.

Cocok untuk: Menguji rentang angka atau kondisi majemuk (misal: `skor >= 80 && skor <= 100`).

---

### B. `switch` (Papan Tombol Lift Gedung Bertingkat)
Bayangkan Anda masuk ke dalam lift gedung perkantoran yang memiliki tombol Lantai 1, 2, 3, dan 4:
- Anda menekan tombol lantai tujuan Anda: `case 3`.
- Lift langsung meluncur ke Lantai 3 dan berhenti di sana karena ada pintu rem (**`break`**).
- **Hukum Jatuh Bebas (*Fall-Through*)**: Jika Anda lupa menaruh rem `break`, lift akan terus meluncur ke lantai di bawahnya tanpa berhenti!
- **`default`**: Jika seseorang menekan angka lantai yang tidak terdaftar di tombol gedung, lift menuju ke lantai lobi dasar (*default*).

Cocok untuk: Membandingkan **satu variabel tunggal dengan banyak opsi nilai pasti** (misal: kode kupon, status pesanan, peran akun).

---

### C. Operator Ternary (`kondisi ? ya : tidak`)
Bentuk ringkas 1 baris untuk `if/else` sederhana:
```javascript
const statusAkses = usia >= 17 ? "Dewasa" : "Anak-anak";
```

---

## 2. Mengapa Pemula Wajib Tahu Operator `??`? (First Principles)

Sering kali kita ingin memberikan **nilai cadangan (*fallback*)** jika pengguna tidak mengisi sesuatu:

1. **Bahaya Operator Lama `||` (Logical OR)**:
   Dulu pengembang memakai: `let jumlah = input || 1`.
   **Masalah Fatal**: Di JavaScript, angka `0` dianggap bernilai salah (*Falsy*). Jika pengguna sengaja memesan `0` barang, operator `||` keliru menganggap data itu tidak ada dan menimpanya menjadi `1`!
2. **Kecerdasan Modern Operator `??` (Nullish Coalescing)**:
   Operator `??` **HANYA** mengganti nilai jika datanya benar-benar kosong melompong (`null` atau `undefined`). Angka `0`, boolean `false`, dan teks `""` tetap dihormati dan tidak akan ditimpa!

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kalkulator diskon yang mengombinasikan `switch` untuk level member dan `??` untuk kuantitas default:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Percabangan Kondisional</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      select, input, button {
        padding: 8px;
        margin-top: 6px;
        width: 100%;
        box-sizing: border-box;
      }
      .hasil-box {
        margin-top: 12px;
        padding: 8px;
        background: #f4f4f4;
        border-radius: 4px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Kalkulator Diskon Member</h3>
      
      <label for="select-member">Tingkat Membership:</label>
      <select id="select-member">
        <option value="REGULER">Member Reguler (0%)</option>
        <option value="SILVER">Member Silver (10%)</option>
        <option value="GOLD">Member Gold (20%)</option>
        <option value="PLATINUM">Member Platinum (30%)</option>
      </select>

      <label for="input-qty" style="margin-top: 8px; display: block;">Jumlah Barang (Kosongkan untuk Default):</label>
      <input type="number" id="input-qty" placeholder="Default: 1 barang" />

      <button type="button" id="btn-proses">Hitung Total Bayar</button>

      <div class="hasil-box">
        <p id="pesan-status">Status: Belum dihitung</p>
        <p>Total Akhir: <strong id="total-akhir">Rp0</strong></p>
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen HTML
const memberSelect = document.querySelector("#select-member");
const qtyInput = document.querySelector("#input-qty");
const prosesBtn = document.querySelector("#btn-proses");
const pesanStatusEl = document.querySelector("#pesan-status");
const totalAkhirEl = document.querySelector("#total-akhir");

const hargaSatuan = 50000;

prosesBtn.addEventListener("click", () => {
  const levelMember = memberSelect.value;

  // 2. TENTUKAN DISKON MENGGUNAKAN SWITCH:
  let persentaseDiskon = 0;

  switch (levelMember) {
    case "PLATINUM":
      // diskon 30%
      persentaseDiskon = 0.3;
      // Wajib: kunci rem agar tidak melorot ke case berikutnya
      break;
    case "GOLD":
      // diskon 20%
      persentaseDiskon = 0.2;
      break;
    case "SILVER":
      // diskon 10%
      persentaseDiskon = 0.1;
      break;
    case "REGULER":
    default:
      persentaseDiskon = 0.0;
      break;
  }

  // 3. GUNAKAN OPERATOR ?? UNTUK NILAI DEFAULT:
  // Jika input kosong, qtyInput.value bernilai ""; kita konversi menjadi angka atau undefined
  const inputMentah = qtyInput.value.trim();
  const kuantitasAngka = inputMentah === "" ? undefined : Number(inputMentah);
  
  // Menggunakan ?? untuk menjamin default 1 jika input undefined:
  const kuantitasFinal = kuantitasAngka ?? 1;

  // Hitung total:
  const totalKotor = hargaSatuan * kuantitasFinal;
  const potongan = totalKotor * persentaseDiskon;
  const bayarAkhir = totalKotor - potongan;

  pesanStatusEl.textContent = `Level: ${levelMember} | Diskon: ${persentaseDiskon * 100}% | Jumlah: ${kuantitasFinal} item`;
  totalAkhirEl.textContent = `Rp${bayarAkhir.toLocaleString("id-ID")}`;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan `if/else` untuk Evaluasi Rentang**: Misal `nilai >= 90` atau kondisi gabungan dengan logika `&&` dan `||`.
2. **Gunakan `switch` untuk Opsi Pilihan Pasti**: Jika membandingkan nilai teks/status tertentu (`"SUKSES"`, `"PENDING"`, `"GAGAL"`), `switch` jauh lebih bersih daripada rentetan `if / else if / else if`.
3. **Jangan Lupa Kata Kunci `break`**: Tanpa `break`, JavaScript mengeksekusi seluruh blok di bawahnya meskipun kondisinya tidak cocok (*fall-through*).
4. **Gunakan `??` daripada `||` untuk Nilai Bawaan**: Agar angka `0` atau string kosong `""` tidak tertimpa tanpa sengaja.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser, pilih **Member Gold**, biarkan jumlah barang kosong, lalu klik tombol.
- [ ] Perhatikan diskon 20% aktif dan jumlah barang otomatis terisi 1 berkat operator `??`.
- [ ] Isi jumlah barang dengan angka `0`, lalu klik hitung. Perhatikan bahwa angka 0 tetap dihormati dan tidak tertimpa menjadi 1!
- [ ] Buka `app.js`, coba hapus salah satu kata `break;` di dalam `switch` untuk melihat apa yang terjadi dengan diskon yang dihitung.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu kapan harus memakai `if/else` vs `switch`, memahami pentingnya `break` di dalam `switch`, dan tahu keunggulan operator `??` dalam menjaga keutuhan angka 0**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa yang akan terjadi jika Anda lupa menuliskan kata kunci `break` di dalam sebuah `case` pada pernyataan `switch`?
2. Perhatikan potongan kode ini:
   ```javascript
   let stokBarang = 0;
   let hasilA = stokBarang || 10;
   let hasilB = stokBarang ?? 10;
   ```
   Berapakah nilai `hasilA` dan `hasilB`? Mengapa hasilnya berbeda?
```
