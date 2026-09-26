---
name: tambah_komentar_pedagogis
description: Tambahkan komentar penjelasan pedagogis di atas setiap baris/unit logika kode pada file dokumentasi JS, mendukung mode batch (beberapa file), tanpa mengubah struktur kode asli.
---

# Tambah Komentar Pedagogis

## Tujuan

Menambahkan komentar penjelasan di atas **setiap baris kode** (atau setiap
blok logis untuk baris yang saling berkaitan erat) pada contoh kode di
dokumentasi, agar pembaca pemula bisa memahami **apa yang terjadi di balik
layar** tanpa harus menebak. Skill ini mendukung pemrosesan beberapa file sekaligus (batch).

---

## Aturan Format

1. **Posisi komentar**
   Selalu di atas baris kode yang dijelaskan, bukan di samping (inline di
   akhir baris) — kecuali baris sangat pendek dengan komentar yang sangat
   singkat.

2. **Bahasa**
   Bahasa Indonesia, gaya percakapan santai tapi tetap teknis-akurat.
   Hindari istilah yang tidak dijelaskan.

3. **Isi komentar**
   Jelaskan **apa yang dilakukan baris tersebut**, bukan mendefinisikan
   ulang teori umum. Kalau ada perilaku yang tidak intuitif (misal:
   pass-by-reference, hoisting, function belum dieksekusi saat
   dideklarasikan), tambahkan catatan singkat dengan prefix `Catatan*:`.

4. **Satu unit logika = satu blok komentar**
   Kalau ada 2–3 baris yang maknanya hanya utuh kalau dibaca bersama
   (misal: pembukaan `for` dan isi block-nya), boleh digabung — tapi tetap
   letakkan komentar tepat di atas baris pertamanya.

5. **Level kerumitan komentar mengikuti level target pembaca**
   - **`docs-beginner/`** → bahasa paling sederhana, hindari istilah asing
     tanpa penjelasan (contoh: "wadah kosong" alih-alih langsung "array
     kosong" tanpa konteks), boleh tambahkan analogi ringan.
   - **`docs/`** (intermediate+) → boleh lebih padat dan teknis, asumsikan
     pembaca sudah paham dasar.

6. **Jangan mengubah logika atau struktur kode aslinya**
   Tugas agent murni menambahkan komentar, bukan me-refactor.

7. **Pertahankan komentar heading/section yang sudah ada**
   Misal `// HOF TIPE 1: ...` — letakkan di atas komentar penjelasan baris
   pertama di bagian itu, bukan menggantikannya.

8. **Konsisten**
   Pertahankan pola kalimat komentar yang sama di seluruh dokumen (misal
   kalau pakai kalimat perintah seperti "ambil...", "buat...",
   "simpan...", pertahankan pola itu di semua baris).

9. **Hindari Kata Ganti Orang**
   DILARANG KERAS menggunakan kata ganti orang seperti "kita", "anda", "kamu", atau "saya". Gunakan bahasa netral/objektif (contoh: ubah "kita buat wadah kosong" menjadi "buat wadah kosong" atau "disiapkan wadah kosong").

10. **Gunakan Penomoran Berurutan (Sequential Numbering)**
    Berikan nomor urut pada komentar (`// 1.`, `// 2.`, `// 3.`, dst.) untuk mengilustrasikan urutan langkah eksekusi kode, sehingga pembaca dapat mengikuti alur logika secara sistematis. Nomor berlanjut sepanjang satu fungsi atau blok logika utama.

---

## Langkah Kerja untuk Agent

1. Jika belum disebutkan di prompt awal, tanya ke saya: target file/folder yang akan diproses.
2. Identifikasi semua file markdown target yang diminta. Untuk **setiap file**, lakukan langkah-langkah berikut secara berurutan:
3. Baca isi file dokumentasi target (misal dengan `view_file`), lalu identifikasi semua blok kode contoh (kode dalam fenced code block).
4. Cek apakah file berada di folder `docs-beginner/` atau `docs/` untuk menentukan level bahasa komentar.
5. Tulis ulang/modifikasi blok kode tersebut dengan komentar di atas tiap baris/unit logika sesuai Aturan Format.
6. Setelah komentar ditambahkan, baca ulang urutan komentarnya sebagai **narasi** — pastikan kalau dibaca berurutan dari atas ke bawah, alurnya masuk akal seperti cerita, bukan potongan-potongan lepas.
7. Jangan menambahkan penjelasan di luar blok kode (di luar comment) kecuali diminta terpisah — tugas ini fokus ke komentar dalam kode saja.
8. Kalau ada baris yang perilakunya berpotensi membingungkan pemula (referensi vs value, async, scope, dsb), tandai dengan `Catatan*:`.

---

## Contoh: Level `docs-beginner/`

```javascript
// buat variable namaPeserta berisi kumpulan (array) 3 nama
const namaPeserta = ["ari", "dwi", "prasetio"];

// cari elemen HTML dengan id "daftar-hasil", nanti dipakai untuk
// menampilkan hasil
const listHasil = document.querySelector("#daftar-hasil");

// buat function bernama prosesDaftar
// function ini punya 2 "bahan" (parameter):
// - deretData -> kumpulan data yang mau diolah
// - fungsiPengubah -> function lain yang nanti dikirim dari luar
function prosesDaftar(deretData, fungsiPengubah) {

  // siapkan wadah kosong untuk menampung hasil olahan nanti
  const hasilBaru = [];

  // lakukan perulangan sebanyak jumlah data di deretData
  for (const item of deretData) {

    // jalankan fungsiPengubah dengan "item" sebagai inputnya,
    // lalu simpan hasilnya ke dalam hasilBaru
    hasilBaru.push(fungsiPengubah(item));
  }

  // setelah semua data selesai diproses, kembalikan hasilnya
  return hasilBaru;
}
```

## Contoh: Level `docs/` (intermediate+)

```javascript
// HOF TIPE 1: MENERIMA CALLBACK FUNCTION SEBAGAI BAHAN
// simpan array berisi 3 string ke dalam variable namaPeserta
const namaPeserta = ["ari", "dwi", "prasetio"];
// ambil elemen HTML tempat hasil akan ditampilkan berdasarkan ID-nya
const listHasil = document.querySelector("#daftar-hasil");

// deklarasikan function prosesDaftar dengan 2 parameter:
// deretData (array yang mau diproses) dan fungsiPengubah (function lain
// yang dikirim dari luar)
// Catatan*: baris ini hanya mendaftarkan function ke memory, isinya
// belum dijalankan
function prosesDaftar(deretData, fungsiPengubah) {
  // buat array kosong baru untuk menampung hasil olahan
  const hasilBaru = [];

  // ulangi proses untuk setiap item di dalam deretData
  for (const item of deretData) {
    // panggil fungsiPengubah dengan item saat ini sebagai input,
    // lalu masukkan (push) hasil baliknya ke dalam hasilBaru
    // Catatan*: prosesDaftar tidak tahu isi logika fungsiPengubah —
    // ia hanya menjalankannya
    hasilBaru.push(fungsiPengubah(item));
  }

  // kembalikan array hasilBaru ke pemanggil function
  return hasilBaru;
}
```

---

## Checklist Sebelum Selesai (Untuk Setiap File)

- [ ] Setiap baris kode punya komentar penjelasan di atasnya
- [ ] Bahasa komentar sesuai level folder (`docs-beginner/` vs `docs/`)
- [ ] `Catatan*:` ditambahkan untuk perilaku yang tidak intuitif
- [ ] Logika/struktur kode asli tidak berubah
- [ ] Komentar heading/section asli dipertahankan
- [ ] Kalau dibaca berurutan, komentar membentuk narasi yang masuk akal
- [ ] Gaya kalimat komentar konsisten di seluruh dokumen
