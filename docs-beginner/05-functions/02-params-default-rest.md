---
title: "Panduan Pemula: Parameter Default dan Rest Parameter di JavaScript"
tags: "javascript, first-principles, roadmap-js/05-functions"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters"
---

# Panduan Pemula: Parameter Default dan Rest Parameter di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> - **Default Parameter (`param = nilai`)**: Memberikan nilai cadangan otomatis jika pemanggil fungsi tidak menyuplai argumen atau bernilai `undefined`.
> - **Rest Parameter (`...sisa`)**: Mengumpulkan sejumlah argumen tersisa yang tidak terbatas ke dalam **satu wadah Array**.

---

## 1. Analogi Logis: Pesan Makanan Cepat Saji

### A. Default Parameter (Paket Standar)
Bayangkan Anda memesan paket nasi burger di kasir cepat saji:
- Pelayan bertanya: *"Mau minum apa?"*.
- Jika Anda tidak menyebut minuman apa pun (*tidak mengirim parameter*), sistem restoran otomatis menyajikan **Teh Manis Dingin** (*Default*).
- Namun jika Anda menyebut: *"Es Jeruk"*, maka Es Jeruk yang disajikan menggantikan teh standar.

```javascript
function pesanMenu(makanan, minuman = "Teh Manis") {
  return `${makanan} ditemani ${minuman}`;
}
pesanMenu("Burger"); // "Burger ditemani Teh Manis"
```

---

### B. Rest Parameter vs Spread Operator (Membedakan Dua Titik Tiga)

> [!IMPORTANT]
> **Perbedaan Mutlak Tanda Titik Tiga (`...`)**:
> - **Rest Parameter** (Di Dalam Kurung Definisi Fungsi): Mengumpulkan banyak bahan terpisah menjadi **1 bungkus Array**.
> - **Spread Operator** (Di Titik Pemanggilan Fungsi): Membuka 1 bungkus Array menjadi **argumen-argumen terpisah**.

```javascript
// REST PARAMETER (Membungkus):
function buatPaket(namaPaket, ...daftarBarang) {
  // daftarBarang sekarang adalah Array: ["Buku", "Pulpen", "Penggaris"]
  console.log(daftarBarang.length);
}

// SPREAD OPERATOR (Membuka):
const belanjaan = ["Buku", "Pulpen", "Penggaris"];
// Membuka isi array menjadi argumen menggunakan spread operator
buatPaket("Alat Tulis", ...belanjaan);
```

---

## 2. Mengapa JavaScript Didesain Seperti Ini? (First Principles)

1. **Menghapus Pengecekan Manual**:
   Dulu kita harus menulis `minuman = minuman || "Teh Manis"`, yang rentan rusak jika parameter bernilai `0` atau `false`. Default parameter modern hanya aktif jika nilainya strictly `undefined`.
2. **Menghapus Objek Kuno `arguments`**:
   Sebelum ES6, menangani jumlah parameter dinamis mengandalkan objek pseudo-array `arguments` yang tidak memiliki metode array modern. Dengan `...rest`, variabel yang dihasilkan adalah **Array sejati** yang siap diolah dengan loop `for...of`.
3. **Aturan Posisi Rest**: Rest parameter **wajib diletakkan di posisi paling terakhir**. Tidak boleh ada parameter lain setelah tanda `...rest`.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

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
      input, button {
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
      <input type="text" id="input-acara" placeholder="Default: Acara Syukuran" />

      <label for="input-tamu" style="margin-top: 8px; display: block;">Nama Tamu (Pisahkan koma):</label>
      <input type="text" id="input-tamu" value="Ari, Kyo, Budi" />

      <button type="button" id="btn-cetak">Cetak Undangan</button>

      <div class="hasil-box" id="wadah-hasil">Hasil undangan akan muncul di sini.</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. FUNGSI DENGAN DEFAULT & REST PARAMETER:
// namaAcara memiliki nilai default 'Acara Syukuran'
// ...daftarTamu mengumpulkan seluruh nama tamu ke dalam satu Array
// deklarasi function buatUndangan yang menerima parameter namaAcara (dengan default) dan rest parameter daftarTamu
function buatUndangan(namaAcara = "Acara Syukuran", ...daftarTamu) {
  // buat dan simpan teks "<ul>" ke dalam variable daftarHtml
  let daftarHtml = "<ul>";

  // loop melalui setiap nama dalam array daftarTamu
  for (const nama of daftarTamu) {
    // tambahkan element <li> berisi nama tamu ke dalam string daftarHtml
    daftarHtml += `<li>Tamu Terhormat: ${nama}</li>`;
  }
  // tutup tag "<ul>" dengan menambahkannya ke dalam string daftarHtml
  daftarHtml += "</ul>";

  // kembalikan template literal berisi undangan resmi, jumlah tamu, dan daftarHtml
  return `
    <strong>Undangan Resmi: ${namaAcara}</strong>
    <p>Total Tamu Terdaftar: ${daftarTamu.length} orang</p>
    ${daftarHtml}
  `;
}

// 2. Hubungkan ke Tombol HTML:
// ambil element input berdasarkan ID-nya, simpan ke variable acaraInput
const acaraInput = document.querySelector("#input-acara");
// ambil element input tamu berdasarkan ID-nya, simpan ke variable tamuInput
const tamuInput = document.querySelector("#input-tamu");
// ambil element button cetak berdasarkan ID-nya, simpan ke variable cetakBtn
const cetakBtn = document.querySelector("#btn-cetak");
// ambil element wadah hasil berdasarkan ID-nya, simpan ke variable hasilWadah
const hasilWadah = document.querySelector("#wadah-hasil");

// saat cetakBtn di-click, jalankan arrow function berikut:
cetakBtn.addEventListener("click", () => {
  // ambil value dari acaraInput, hilangkan spasi ekstra, dan simpan ke variable teksAcara
  const teksAcara = acaraInput.value.trim();
  // Jika input kosong, kita kirim undefined agar Default Parameter aktif!
  // jika teksAcara kosong, set judulTerkirim menjadi undefined, jika tidak, set menjadi teksAcara
  const judulTerkirim = teksAcara === "" ? undefined : teksAcara;

  // Baca daftar tamu dari teks dipisah koma:
  // simpan value dari tamuInput ke dalam variable teksTamu
  const teksTamu = tamuInput.value;
  // jika teksTamu ada isinya, pisahkan berdasarkan koma dan bersihkan spasi tiap nama lalu jadikan array, jika kosong set menjadi array kosong
  const listTamu = teksTamu ? teksTamu.split(",").map((t) => t.trim()) : [];

  // Panggil fungsi menggunakan SPREAD OPERATOR (...) untuk membuka array listTamu:
  // perbarui innerHTML dari hasilWadah dengan memanggil buatUndangan menggunakan judulTerkirim dan menyebarkan array listTamu
  hasilWadah.innerHTML = buatUndangan(judulTerkirim, ...listTamu);
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Selalu Letakkan Rest Parameter di Akhir**: `function hitung(kali, ...angka)` sah, tetapi `function hitung(...angka, kali)` akan menghasilkan error fatal `SyntaxError: Rest parameter must be last`.
2. **Kirim `undefined` untuk Mengaktifkan Default Parameter**: Jika Anda secara eksplisit mengirim `null`, nilai default **tidak akan aktif** karena `null` dianggap nilai sah.
3. **Bedakan Istilah**: Selalu ingat bahwa `...` saat mendefinisikan fungsi adalah **Rest** (mengumpulkan), sedangkan `...` saat memanggil fungsi atau membuat array adalah **Spread** (menyebarkan).

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik **"Cetak Undangan"**.
- [ ] Kosongkan kolom nama acara, lalu klik cetak lagi. Amati bagaimana nama acara otomatis berubah menjadi `"Acara Syukuran"` berkat default parameter.
- [ ] Tambahkan beberapa nama tamu baru di kolom teks dipisah koma, perhatikan jumlah total tamu bertambah secara otomatis berkat rest parameter.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu cara menentukan nilai default pada parameter fungsi, dan bisa membedakan peran Rest Parameter (mengumpulkan) vs Spread Operator (menyebarkan)**.

---

## 🎯 Uji Pemahaman Mandiri

Perhatikan kode berikut:

```javascript
function cetakTim(kapten = "Anonim", ...anggota) {
  console.log("Kapten:", kapten);
  console.log("Anggota:", anggota);
}

cetakTim(undefined, "Budi", "Siti", "Joko");
```

1. Apakah nilai dari parameter `kapten` yang tercetak di konsol?
2. Berapakah panjang array (`.length`) dari parameter `anggota`?
3. Mengapa penulisan `function cetakTim(...anggota, kapten)` dilarang di JavaScript?
```
