---
title: "Panduan Pemula: Menangani Error (try, catch, finally, Error) di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/04-control-flow
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
---

# Panduan Pemula: Menangani Error (try, catch, finally, Error) di JavaScript

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> Error handling adalah jaring pengaman kode Anda: saat ada kesalahan mendadak, program Anda tidak akan mati total (_crash_), melainkan segera menangkap masalahnya dan tetap menampilkan pesan yang sopan kepada pengguna.

---

## 1. Analogi Logis: Sirkus Trapeze dan Jaring Pengaman

Bayangkan Anda menonton pertunjukan akrobat sirkus di udara:

- **`try` (Coba lakukan)**: Pemain akrobat melompat di udara. Ini adalah baris kode berisiko yang ingin Anda jalankan (misal membaca input pengguna atau mengolah data).
- **`throw` (Terjadi insiden)**: Tangan pemain meleset dari pegangan. Kode menyadari ada yang salah dan "melemparkan" sinyal bahaya.
- **`catch` (Jaring pengaman)**: Alih-alih jatuh menghantam lantai dan tewas (_program crash_ membeku), pemain jatuh dengan aman di atas jaring penahan. Program tetap hidup dan Anda bisa menyapa penonton dengan tenang.
- **`finally` (Pasti dibereskan)**: Mau akrobatnya sukses atau jatuh ke jaring, lampu panggung harus tetap dimatikan dan panggung disapu bersih di akhir pertunjukan.

---

## 2. Mengapa JavaScript Butuh `try...catch`? (First Principles)

1. **JavaScript di Browser Bersifat _Single-Threaded_ (Satu Jalur)**:
   Browser hanya punya satu jalur utama untuk mengeksekusi JavaScript. Jika terjadi error fatal yang tidak ditangkap, seluruh skrip di halaman itu akan langsung mogok. Tombol-tombol lain bisa ikut tidak berfungsi!
2. **Membedakan Error Terduga vs Kerusakan Parah**:
   Dengan `try...catch`, Anda bisa menangkap kesalahan input pengguna yang salah ketik (misalnya memasukkan format teks padahal diminta angka) tanpa membuat browser memunculkan layar merah rusak di konsol.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat kalkulator pembagian dengan jaring pengaman agar tidak terjadi pembagian dengan angka 0 atau input kosong:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Menangani Error (try...catch)</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 320px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        margin-bottom: 8px;
      }
      button {
        padding: 8px 12px;
        cursor: pointer;
        width: 100%;
        margin-bottom: 8px;
      }
      .pesan {
        padding: 8px;
        border-radius: 4px;
        font-weight: bold;
      }
      .sukses {
        background-color: #d4edda;
        color: #155724;
      }
      .error {
        background-color: #f8d7da;
        color: #721c24;
      }
      .status {
        font-size: 0.85rem;
        color: #666;
        margin-top: 8px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Pembagian Uang Kas</h3>
      <input
        type="number"
        id="input-total"
        placeholder="Total Uang (contoh: 100000)"
      />
      <input
        type="number"
        id="input-orang"
        placeholder="Jumlah Orang (contoh: 4)"
      />
      <button type="button" id="btn-hitung">Hitung Bagian per Orang</button>
      <div id="kotak-hasil" class="pesan">Silakan masukkan angka.</div>
      <div id="status-proses" class="status">Status: Menunggu aksi...</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil semua elemen penting dari HTML
const inputTotal = document.querySelector("#input-total");
// ambil kolom input total uang.

const inputOrang = document.querySelector("#input-orang");
// ambil kolom input jumlah orang.

const tombolHitung = document.querySelector("#btn-hitung");
// ambil tombol hitung pembagian.

const kotakHasil = document.querySelector("#kotak-hasil");
// ambil elemen penampil hasil atau pesan error.

const statusProses = document.querySelector("#status-proses");
// ambil elemen penampil status proses pembersihan.

// 2. Pasang aksi saat tombol di-klik
tombolHitung.addEventListener("click", () => {
  // ==========================================
  // BLOK TRY: MENCOBA MENJALANKAN KODE BERISIKO
  // ==========================================
  try {
    const total = Number(inputTotal.value);
    // ubah teks input total menjadi angka murni.

    const jumlahOrang = Number(inputOrang.value);
    // ubah teks input jumlah orang menjadi angka murni.

    // Pemeriksaan 1: Apakah salah satu input kosong?
    if (inputTotal.value.trim() === "" || inputOrang.value.trim() === "") {
      throw new Error("Kedua kolom harus diisi angka!");
      // jika kosong, lempar sinyal error resmi dengan pesan penjelasan.
    }

    // Pemeriksaan 2: Apakah pembagi bernilai 0 atau negatif?
    if (jumlahOrang <= 0) {
      throw new Error("Jumlah orang harus lebih dari 0!");
      // lempar error karena pembagian dengan 0 tidak valid.
    }

    // Jika lolos semua pemeriksaan, hitung hasilnya:
    const hasilBagi = total / jumlahOrang;
    // lakukan operasi matematika pembagian.

    kotakHasil.textContent = `Masing-masing dapat: Rp ${hasilBagi.toLocaleString("id-ID")}`;
    // tampilkan hasil perhitungan berformat rupiah.

    kotakHasil.className = "pesan sukses";
    // ubah warna kotak menjadi hijau tanda sukses.
  } catch (err) {
    // ==========================================
    // BLOK CATCH: JARING PENANGKAP ERROR
    // ==========================================
    // err adalah objek yang dilempar dari 'throw new Error()' di atas:
    kotakHasil.textContent = `Peringatan: ${err.message}`;
    // tampilkan pesan kesalahan kepada pengguna tanpa merusak aplikasi.

    kotakHasil.className = "pesan error";
    // ubah warna kotak menjadi merah tanda ada kesalahan input.
  } finally {
    // ==========================================
    // BLOK FINALLY: SELALU DIJALANKAN DI AKHIR
    // ==========================================
    statusProses.textContent = `Status: Selesai diproses pada ${new Date().toLocaleTimeString("id-ID")}`;
    // selalu perbarui waktu proses terakhir, baik sukses maupun error.
  }
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu gunakan `new Error("pesan")` saat melempar**: Jangan lakukan `throw "gagal"` karena teks biasa tidak mencatat nomor baris dan riwayat asal-usul error (_stack trace_).
2. **Gunakan `finally` untuk mereset tampilan**: Jika Anda menampilkan animasi putar (_loading spinner_) saat memproses data, selalu matikan _loading spinner_ di dalam blok `finally` agar tombol tidak terus berputar saat terjadi error.
3. **Jangan menyembunyikan error tanpa penanganan**: Jangan biarkan blok `catch` kosong tanpa menampilkan pesan atau mencatatnya di `console.warn()`. Jika error disembunyikan, Anda tidak akan tahu kenapa aplikasi tidak berfungsi.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser, isi total `100000` dan orang `4`, lalu klik tombol. Pastikan kotak berwarna hijau.
- [ ] Kosongkan kolom jumlah orang atau isi dengan angka `0`, lalu klik tombol. Perhatikan bagaimana kotak berubah menjadi merah dengan pesan yang jelas tanpa membuat browser macet.
- [ ] Perhatikan teks status waktu di bagian paling bawah: teks tersebut selalu diperbarui berkat blok `finally`.

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Tahu kapan harus membungkus kode dengan `try...catch` dan paham bahwa blok `finally` pasti dieksekusi apapun yang terjadi di `try` atau `catch`**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa yang akan terjadi pada aplikasi web Anda jika terjadi error fatal di dalam kode JavaScript tetapi Anda **tidak** menggunakan `try...catch`?
2. Jika di dalam blok `try` sebuah fungsi terdapat perintah `return "sukses"`, apakah blok `finally` yang ada di bawahnya tetap akan dijalankan oleh JavaScript sebelum fungsi tersebut selesai?
