---
title: "Panduan Pemula: Parameter Default dan Rest Parameter di JavaScript"
tags: "javascript, first-principles, roadmap-js/05-functions"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters"
---

# Panduan Pemula: Default Parameter dan Rest Parameter di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> - **Default Parameter (`param = nilai`)**: Memberikan nilai cadangan otomatis jika pemanggil fungsi tidak menyuplai argumen atau bernilai `undefined`.
> - **Rest Parameter (`...sisa`)**: Mengumpulkan sejumlah argumen tersisa yang tidak terbatas ke dalam **satu wadah Array**.

---

## 1. Perbedaan Mendasar: Parameter vs Argumen (Cetakan vs Isi)

Banyak pemula sering tertukar antara kata **Parameter** dan **Argumen**. Keduanya memiliki peran dan posisi yang sangat berbeda:

- **Parameter (Cetakan / Tempat Kosong)**:
  Parameter adalah nama variabel penampung yang Anda deklarasikan di dalam tanda kurung **saat membuat (mendefinisikan) fungsi**. Ia bertindak seperti kolom formulir kosong: `Nama: [ ... ]`.
- **Argumen (Bahan / Nilai Nyata)**:
  Argumen adalah data nilai aktual yang Anda masukkan ke dalam tanda kurung **saat menjalankan (memanggil) fungsi**. Ia adalah tulisan asli yang Anda isikan ke dalam kolom formulir tersebut: `"Aria"`.

```javascript
// 1. Buat fungsi sapaPengguna dengan dua penampung kosong: nama dan usia.
function sapaPengguna(nama, usia) {
  // 2. Kembalikan kalimat gabungan yang menyisipkan nilai nama dan usia.
  return `Halo, saya ${nama}, berumur ${usia} tahun.`;
}

// 1. Jalankan fungsi sapaPengguna dengan mengirim nilai nyata "Aria" dan 25.
sapaPengguna("Aria", 25);
```

---

## 2. Analogi Logis: Pesan Makanan Cepat Saji (Default & Rest)

### A. Default Parameter (Paket Standar)

Bayangkan Anda memesan paket nasi burger di kasir cepat saji:

- Pelayan bertanya: _"Mau minum apa?"_.
- Jika Anda tidak menyebut minuman apa pun (_tidak mengirim parameter_), sistem restoran otomatis menyajikan **Teh Manis Dingin** (_Default_).
- Namun jika Anda menyebut: _"Es Jeruk"_, maka Es Jeruk yang disajikan menggantikan teh standar.

```javascript
// 1. Buat fungsi pesanMenu dengan penampung makanan wajib dan minuman cadangan.
function pesanMenu(makanan, minuman = "Teh Manis") {
  // 2. Kembalikan kalimat pesanan yang menggabungkan nama makanan dan minuman.
  return `${makanan} ditemani ${minuman}`;
}
// 1. Panggil fungsi dengan satu porsi argumen saja — minuman otomatis mengambil "Teh Manis".
pesanMenu("Burger"); // "Burger ditemani Teh Manis"
```

---

### B. Rest Parameter vs Spread Operator (Membedakan Dua Titik Tiga)

> [!IMPORTANT]
> **Perbedaan Mutlak Tanda Titik Tiga (`...`)**:
>
> - **Rest Parameter** (Di Dalam Kurung Definisi Fungsi): Mengumpulkan banyak bahan terpisah menjadi **1 bungkus Array**.
> - **Spread Operator** (Di Titik Pemanggilan Fungsi): Membuka 1 bungkus Array menjadi **argumen-argumen terpisah**.

```javascript
// REST PARAMETER (Membungkus):
// 1. Buat fungsi buatPaket yang menerima namaPaket, lalu kumpulkan sisanya ke dalam ...daftarBarang.
function buatPaket(namaPaket, ...daftarBarang) {
  // Catatan*: daftarBarang di dalam sini otomatis menjadi Array sejati.
  // 2. Cetak jumlah barang yang berhasil dikumpulkan ke layar.
  console.log(daftarBarang.length);
}

// SPREAD OPERATOR (Membuka):
// 1. Buat daftar nama barang ke dalam wadah array belanjaan.
const belanjaan = ["Buku", "Pulpen", "Penggaris"];
// 2. Jalankan fungsi buatPaket, gunakan tiga titik (...) untuk mengeluarkan isi array belanjaan menjadi bahan terpisah.
buatPaket("Alat Tulis", ...belanjaan);
```

---

## 3. Mengapa JavaScript Didesain Seperti Ini? (First Principles)

1. **Menghapus Pengecekan Manual**:
   Dulu kita harus menulis `minuman = minuman || "Teh Manis"`, yang rentan rusak jika parameter bernilai `0` atau `false`. Default parameter modern hanya aktif jika nilainya strictly `undefined`.
2. **Menghapus Objek Kuno `arguments`**:
   Sebelum ES6, menangani jumlah parameter dinamis mengandalkan objek pseudo-array `arguments` yang tidak memiliki metode array modern. Dengan `...rest`, variabel yang dihasilkan adalah **Array sejati** yang siap diolah dengan loop `for...of`.
3. **Aturan Posisi Rest**: Rest parameter **wajib diletakkan di posisi paling terakhir**. Tidak boleh ada parameter lain setelah tanda `...rest`.

---

## 4. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat pencetak kartu undangan yang menerima judul acara dan daftar tamu tak terbatas:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Default & Rest Parameter</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 360px;
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
      .hasil-box {
        margin-top: 12px;
        padding: 10px;
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
      }
      ul {
        margin: 6px 0 0 0;
        padding-left: 20px;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Pembuat Undangan Acara</h3>

      <label for="input-acara">Nama Acara (Boleh Kosong):</label>
      <input
        type="text"
        id="input-acara"
        placeholder="Default: Acara Syukuran"
      />

      <label for="input-tamu" style="margin-top: 8px; display: block;"
        >Nama Tamu (Pisahkan koma):</label
      >
      <input type="text" id="input-tamu" value="Ari, Kyo, Budi" />

      <button type="button" id="btn-cetak">Cetak Undangan</button>

      <div class="hasil-box" id="wadah-hasil">
        Hasil undangan akan muncul di sini.
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. FUNGSI DENGAN DEFAULT & REST PARAMETER:
// 1. Buat fungsi buatUndangan dengan judul cadangan dan ...daftarTamu untuk menampung sisa argumen.
function buatUndangan(namaAcara = "Acara Syukuran", ...daftarTamu) {
  // 2. Siapkan teks pembuka daftar HTML dan simpan ke variabel daftarHtml.
  let daftarHtml = "<ul>";

  // 3. Putar setiap nama di dalam wadah daftarTamu satu per satu.
  for (const nama of daftarTamu) {
    // 4. Tambahkan baris baru berisi nama tamu ke dalam teks daftarHtml.
    daftarHtml += `<li>Tamu Terhormat: ${nama}</li>`;
  }
  // 5. Tambahkan teks penutup daftar HTML di bagian paling akhir.
  daftarHtml += "</ul>";

  // 6. Kembalikan kerangka utuh undangan beserta daftar nama tamu.
  return `
    <strong>Undangan Resmi: ${namaAcara}</strong>
    <p>Total Tamu Terdaftar: ${daftarTamu.length} orang</p>
    ${daftarHtml}
  `;
}

// 2. Hubungkan ke Tombol HTML:
// 1. Ambil elemen masukan acara dari dokumen HTML lalu simpan ke acaraInput.
const acaraInput = document.querySelector("#input-acara");
// 2. Ambil elemen masukan tamu dari dokumen HTML lalu simpan ke tamuInput.
const tamuInput = document.querySelector("#input-tamu");
// 3. Ambil elemen tombol cetak dari dokumen HTML lalu simpan ke cetakBtn.
const cetakBtn = document.querySelector("#btn-cetak");
// 4. Ambil kotak wadah hasil dari dokumen HTML lalu simpan ke hasilWadah.
const hasilWadah = document.querySelector("#wadah-hasil");

// 1. Tambahkan pendeteksi klik pada tombol cetak.
cetakBtn.addEventListener("click", () => {
  // 2. Baca isi kotak acara dan hilangkan spasi sisa di ujung teks.
  const teksAcara = acaraInput.value.trim();
  // 3. Jadikan nilai kosong sebagai undefined agar nilai cadangan (default) aktif saat dikirim.
  // Catatan*: Nilai null tidak akan mengaktifkan default parameter, harus undefined.
  const judulTerkirim = teksAcara === "" ? undefined : teksAcara;

  // 4. Baca isi kotak tamu dari halaman HTML.
  const teksTamu = tamuInput.value;
  // 5. Belah teks berdasarkan koma untuk menghasilkan daftar tamu.
  const listTamu = teksTamu ? teksTamu.split(",").map((t) => t.trim()) : [];

  // 6. Jalankan fungsi dengan judul dan uraian daftar tamu, lalu cetak hasilnya ke dalam kotak HTML.
  hasilWadah.innerHTML = buatUndangan(judulTerkirim, ...listTamu);
});
```

---

## 5. Solusi Praktis / Best Practice

1. **Selalu Letakkan Rest Parameter di Akhir**: `function hitung(kali, ...angka)` sah, tetapi `function hitung(...angka, kali)` akan menghasilkan error fatal `SyntaxError: Rest parameter must be last`.
2. **Kirim `undefined` untuk Mengaktifkan Default Parameter**: Jika Anda secara eksplisit mengirim `null`, nilai default **tidak akan aktif** karena `null` dianggap nilai sah.
3. **Bedakan Istilah**: Selalu ingat bahwa `...` saat mendefinisikan fungsi adalah **Rest** (mengumpulkan), sedangkan `...` saat memanggil fungsi atau membuat array adalah **Spread** (menyebarkan).

---

## 6. Checklist Praktik Mandiri

- [x] Buka `index.html` di browser dan klik **"Cetak Undangan"**.
- [x] Kosongkan kolom nama acara, lalu klik cetak lagi. Amati bagaimana nama acara otomatis berubah menjadi `"Acara Syukuran"` berkat default parameter.
- [x] Tambahkan beberapa nama tamu baru di kolom teks dipisah koma, perhatikan jumlah total tamu bertambah secara otomatis berkat rest parameter.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu cara menentukan nilai default pada parameter fungsi, dan bisa membedakan peran Rest Parameter (mengumpulkan) vs Spread Operator (menyebarkan)**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode berikut:

```javascript
// 1. Buat fungsi cetakTim dengan nama kapten cadangan dan daftar anggota tak terbatas.
function cetakTim(kapten = "Anonim", ...anggota) {
  // 2. Cetak nama kapten ke layar.
  console.log("Kapten:", kapten);
  // 3. Cetak susunan anggota ke layar.
  console.log("Anggota:", anggota);
}

// 1. Jalankan fungsi dengan mengosongkan nama kapten (undefined) untuk memicu nilai default.
cetakTim(undefined, "Budi", "Siti", "Joko");
```

1. Apakah nilai dari parameter `kapten` yang tercetak di konsol?
2. Berapakah panjang array (`.length`) dari parameter `anggota`?
3. Mengapa penulisan `function cetakTim(...anggota, kapten)` dilarang di JavaScript?

```

```
