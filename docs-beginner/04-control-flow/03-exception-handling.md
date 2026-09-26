---
title: "Panduan Pemula: Menangani Error (try, catch, finally, Error) di JavaScript"
tags: "javascript, first-principles, roadmap-js/04-control-flow"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch"
---

# Panduan Pemula: Menangani Error (try, catch, finally, Error) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Error handling adalah jaring pengaman kode Anda: saat terjadi kegagalan tak terduga, program Anda tidak mati total (_crash_ membeku), melainkan segera menangkap masalahnya di blok **`catch`**, menampilkan pesan ramah kepada pengguna, dan membereskan sisa pekerjaan di blok **`finally`**.

---

## 1. Analogi Logis: Sirkus Trapeze dan Jaring Pengaman

Bayangkan Anda menonton pertunjukan akrobat sirkus di udara:

- **`try` (Coba lakukan)**: Pemain akrobat melompat di udara. Ini adalah baris kode berisiko yang ingin Anda jalankan (misal memproses input pengguna, membaca format data, atau mengambil data jaringan).
- **`throw` (Terjadi insiden)**: Tangan pemain meleset dari pegangan. Kode menyadari ada yang salah dan secara eksplisit "melemparkan" sinyal bahaya.
- **`catch` (Jaring pengaman)**: Alih-alih jatuh menghantam lantai dan tewas (_program crash_ total), pemain mendarat dengan selamat di atas jaring penahan. Program tetap hidup dan Anda bisa menyapa penonton dengan tenang.
- **`finally` (Pasti dibereskan)**: Mau akrobatnya sukses atau jatuh ke jaring, lampu arena sirkus harus tetap dimatikan dan panggung disapu bersih di akhir pertunjukan.

---

## 2. Mengapa JavaScript Butuh `try...catch`? (First Principles)

### A. Prinsip Pemutusan Alur Instan (_Call Stack Unwinding_)

Ketika terjadi error atau perintah `throw new Error(...)` dieksekusi di dalam blok `try`:

- **Semua baris kode di bawahnya di dalam blok `try` langsung dibatalkan seketika.**
- Alur eksekusi melompat langsung ke kurung kurawal `catch (error)`.
- Jika Anda tidak membungkus kode berisiko dengan `try...catch`, error tersebut akan naik terus sampai ke browser dan menghentikan seluruh program JavaScript di halaman web Anda.

### B. Mengenal 4 Jenis Error Bawaan Browser

Di DevTools Console, Anda pasti sering melihat pesan-pesan error ini:

| Tipe Error Resmi     | Penyebab Umum                               | Contoh Kode Rusak                                               |
| :------------------- | :------------------------------------------ | :-------------------------------------------------------------- |
| **`TypeError`**      | Mengoperasikan data pada tipe yang salah    | `null.toUpperCase()`, `angka()` (memanggil variabel non-fungsi) |
| **`ReferenceError`** | Membaca variabel yang tidak ada atau di TDZ | `console.log(namaGaib)`, membaca `let` sebelum deklarasi        |
| **`SyntaxError`**    | Kesalahan tata bahasa kode JavaScript       | Kurang tanda kurung `)`, salah ketik kata kunci                 |
| **`RangeError`**     | Memberikan angka di luar batas yang sah     | `new Array(-5)` (panjang array tidak boleh negatif)             |

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kalkulator pembagian tagihan makan bersama yang aman dari pembagian angka 0 atau input kosong:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Exception Handling</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 340px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      input,
      button {
        padding: 8px;
        margin-top: 6px;
        width: 100%;
        box-sizing: border-box;
      }
      .kotak-pesan {
        margin-top: 12px;
        padding: 10px;
        border-radius: 4px;
        display: none;
      }
      .kotak-sukses {
        background-color: #e6f4ea;
        color: #137333;
        border: 1px solid #ceead6;
        display: block;
      }
      .kotak-error {
        background-color: #fce8e6;
        color: #c5221f;
        border: 1px solid #fad2cf;
        display: block;
      }
      .status-akhir {
        margin-top: 8px;
        font-size: 0.8rem;
        color: #666;
        text-align: center;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Bagi Tagihan Makan</h3>

      <label for="input-total">Total Tagihan (Rp):</label>
      <input type="number" id="input-total" value="100000" />

      <label for="input-orang" style="margin-top: 8px; display: block;"
        >Jumlah Teman:</label
      >
      <input type="number" id="input-orang" value="4" />

      <button type="button" id="btn-hitung">Hitung Patungan</button>

      <div id="pesan-box" class="kotak-pesan"></div>
      <p id="status-finally" class="status-akhir">-</p>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen-elemen HTML yang dibutuhkan dari halaman dan simpan ke dalam wadah konstan
const totalInput = document.querySelector("#input-total");
const orangInput = document.querySelector("#input-orang");
const hitungBtn = document.querySelector("#btn-hitung");
const pesanBox = document.querySelector("#pesan-box");
const finallyStatus = document.querySelector("#status-finally");

// 2. Pasang aksi pada tombol hitung untuk dijalankan saat diklik
hitungBtn.addEventListener("click", () => {
  // 3. Mulai blok try untuk menjalankan kode berisiko yang bisa memicu error
  try {
    // BLOK TRY: Lakukan operasi berisiko
    // 4. Ambil nilai masukan tagihan, ubah menjadi tipe angka, dan simpan ke wadah totalTagihan
    const totalTagihan = Number(totalInput.value);

    // 5. Ambil nilai masukan jumlah orang, ubah menjadi tipe angka, dan simpan ke wadah jumlahOrang
    const jumlahOrang = Number(orangInput.value);

    // Validasi data input:
    // 6. Periksa jika totalTagihan tidak valid (NaN) atau bernilai kurang dari sama dengan 0
    if (Number.isNaN(totalTagihan) || totalTagihan <= 0) {
      // 7. Hentikan proses secara paksa dan lemparkan error ke blok catch
      // Catatan*: Sisa baris di dalam blok try akan dilewati
      throw new Error("Total tagihan harus berupa angka lebih dari 0!");
    }

    // 8. Periksa jika jumlahOrang tidak valid atau kurang dari sama dengan 0
    if (Number.isNaN(jumlahOrang) || jumlahOrang <= 0) {
      // 9. Lemparkan error ke blok catch
      throw new Error("Jumlah teman harus minimal 1 orang!");
    }

    // Hitung pembagian:
    // 10. Bagikan total tagihan dengan jumlah orang dan simpan ke wadah bayarPerOrang
    const bayarPerOrang = totalTagihan / jumlahOrang;

    // Tampilkan sukses:
    // 11. Ubah tampilan kotak pesan agar berwarna hijau (sukses)
    pesanBox.className = "kotak-pesan kotak-sukses";
    // 12. Tampilkan hasil perhitungan pembagian tagihan ke dalam kotak pesan
    pesanBox.textContent = `Masing-masing membayar: Rp${bayarPerOrang.toLocaleString("id-ID")}`;
  } catch (error) {
    // 13. Tangkap lemparan error dari blok try
    // BLOK CATCH: Jaring pengaman saat throw terjadi
    // 14. Cetak pesan peringatan ke konsol peramban
    console.warn("Terjadi kegagalan input:", error.message);

    // 15. Ubah tampilan kotak pesan agar berwarna merah (gagal)
    pesanBox.className = "kotak-pesan kotak-error";
    // 16. Tampilkan isi pesan error ke dalam kotak pesan
    pesanBox.textContent = `❌ ${error.message}`;
  } finally {
    // 17. Jalankan blok finally terlepas dari keberhasilan maupun kegagalan
    // BLOK FINALLY: Selalu dieksekusi apapun yang terjadi
    // 18. Ambil jam lokal saat ini
    const waktu = new Date().toLocaleTimeString("id-ID");
    // 19. Perbarui teks status waktu agar pengguna tahu proses telah usai
    finallyStatus.textContent = `Operasi selesai diproses pada pukul ${waktu}`;
  }
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu gunakan objek `new Error("pesan")` saat melempar**: Jangan lakukan `throw "gagal"` karena teks biasa tidak mencatat nomor baris dan riwayat asal-usul error (_stack trace_).
2. **Gunakan `finally` untuk Membersihkan Tampilan**: Jika Anda memunculkan animasi loading saat proses dimulai, selalu matikan loading di blok `finally` agar tombol tidak terus berputar ketika terjadi error.
3. **Jangan Menyembunyikan Error Tanpa Penanganan**: Hindari blok `catch (e) {}` kosong. Selalu catat error di konsol atau beri tahu pengguna agar bug tidak tersembunyi.

---

## 5. Checklist Praktik Mandiri

- [x] Buka `index.html` di browser, isi tagihan `100000` dan teman `4`, lalu klik tombol. Pastikan kotak hijau muncul.
- [x] Ubah jumlah teman menjadi `0` atau kosongkan kotaknya, lalu klik tombol. Perhatikan bagaimana program melempar `Error` buatan dan menangkapnya di kotak merah tanpa crash.
- [x] Amati bahwa baris waktu `finally` selalu diperbarui pada kondisi sukses maupun gagal.
- [x] Buka Console (`F12`), coba panggil fungsi yang tidak ada: `window.fungsiAneh()` untuk melihat contoh bawaan `TypeError`.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu fungsi `try`, `catch`, `finally`, mengerti bahwa `throw` langsung melompati sisa baris di dalam `try`, dan tahu jenis-jenis error bawaan seperti `TypeError` dan `ReferenceError`**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa yang akan terjadi pada baris kode di bawah perintah `throw new Error(...)` di dalam blok `try` yang sama? Apakah baris tersebut tetap dijalankan?
2. Jika sebuah fungsi di dalam blok `try` mengeksekusi perintah `return "SUKSES"`, apakah blok `finally` di bawahnya tetap akan dieksekusi oleh JavaScript?

```

```
