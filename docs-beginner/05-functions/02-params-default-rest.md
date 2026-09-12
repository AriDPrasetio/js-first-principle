---
title: "Panduan Pemula: Parameter Default dan Rest Parameter di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/05-functions
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
---

# Panduan Pemula: Parameter Default dan Rest Parameter di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Parameter fungsi ibarat lubang corong masukan pada mesin. **Default Parameter** menyediakan bahan cadangan otomatis jika pengguna lupa memasukkan bahan, sedangkan **Rest Parameter (`...`)** adalah kantong ajaib yang bisa menampung berapapun banyaknya bahan tambahan ke dalam satu daftar (_array_).

---

## 1. Analogi Logis: Pesan Makanan Cepat Saji

Bayangkan Anda memesan paket makanan di restoran cepat saji:

- **Parameter Biasa**: Kasir menanyakan menu utama Anda (misalnya `"Burger Ayam"`).
- **Default Parameter (Nilai Cadangan Otomatis)**: Kasir bertanya: _"Mau minum apa?"_. Jika Anda diam saja atau tidak memilih apa-apa, kasir otomatis memberikan `"Air Mineral"` sebagai minuman bawaan standar. Tapi jika Anda minta `"Es Teh"`, kasir akan memberikan pesanan Anda.
- **Rest Parameter (`...tambahanToping`)**: Kasir bertanya: _"Ada tambahan camilan lain?"_. Anda bisa menyebut 1, 3, atau 10 jenis camilan sekaligus (`"Kentang"`, `"Nugget"`, `"Es Krim"`). Semua pesanan tambahan ini akan dimasukkan ke dalam satu kantong kresek besar yang sama (_Array_).

---

## 2. Mengapa JavaScript Didesain Seperti Ini? (First Principles)

1. **Menghindari Bug `undefined`**:
   Jika Anda membuat fungsi penerima nama `sapaUser(nama)` dan pengguna memanggilnya tanpa parameter `sapaUser()`, di masa lalu nama akan tercetak sebagai `"Halo undefined"`. Dengan Default Parameter `function sapaUser(nama = "Tamu")`, tampilan aplikasi Anda tetap rapi.
2. **Kapan Default Parameter Aktif?**:
   Default parameter HANYA bekerja jika nilainya kosong atau diisi `undefined`. Jika Anda sengaja mengirimkan `null`, JavaScript menganggap itu adalah pilihan sadar Anda, sehingga nilai default TIDAK akan dipakai.
3. **Rest Parameter Adalah Array Asli**:
   Tanda tiga titik (`...namaVariabel`) di parameter terakhir akan otomatis mengumpulkan semua argumen sisa menjadi satu Array murni yang siap diolah dengan `.join()`, `.forEach()`, atau `.length`.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat pembuat kartu undangan acara yang bisa menyapa tuan rumah dengan pesan default dan menampung daftar nama tamu sebanyak apa pun:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Default & Rest Parameters</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 360px;
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
      .undangan {
        background: #fdf6e2;
        border: 1px dashed #d6a843;
        padding: 12px;
        border-radius: 6px;
      }
      .undangan h4 {
        margin-top: 0;
        color: #845a08;
      }
      ul {
        padding-left: 20px;
        margin: 4px 0 0 0;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Pembuat Undangan Rapat</h3>
      <input
        type="text"
        id="input-judul"
        placeholder="Judul Acara (Boleh kosong = 'Rapat Tim')"
      />
      <input
        type="text"
        id="input-tamu"
        placeholder="Nama Tamu (pisahkan dengan koma: Budi, Siti, Joko)"
      />
      <button type="button" id="btn-buat">Cetak Kartu Undangan</button>
      <div id="wadah-undangan" class="undangan">Undangan belum dibuat.</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen dari HTML
const inputJudul = document.querySelector("#input-judul");
// ambil kolom teks nama acara.

const inputTamu = document.querySelector("#input-tamu");
// ambil kolom teks daftar nama tamu.

const tombolBuat = document.querySelector("#btn-buat");
// ambil tombol untuk memproses pembuatan undangan.

const wadahUndangan = document.querySelector("#wadah-undangan");
// ambil wadah kotak tampilan kartu undangan.

// ================================================================
// FUNGSI DENGAN DEFAULT PARAMETER DAN REST PARAMETERS
// ================================================================
// judulAcara = "Rapat Tim"  --> DEFAULT PARAMETER (nilai cadangan jika judul kosong)
// ...daftarTamu             --> REST PARAMETER (menampung semua nama tamu ke dalam Array)
function buatUndangan(judulAcara = "Rapat Tim", ...daftarTamu) {
  // bersihkan tampilan lama:
  wadahUndangan.innerHTML = "";

  // buat judul acara:
  const elemenJudul = document.createElement("h4");
  elemenJudul.textContent = `Acara: ${judulAcara}`;
  wadahUndangan.appendChild(elemenJudul);

  // buat teks info jumlah tamu:
  const infoTamu = document.createElement("p");
  infoTamu.textContent = `Total Hadir: ${daftarTamu.length} Orang`;
  // gunakan .length dari Array rest parameter.
  wadahUndangan.appendChild(infoTamu);

  // buat daftar nama menggunakan elemen <ul> dan <li>:
  const listTamu = document.createElement("ul");
  for (const nama of daftarTamu) {
    // perulangan membaca setiap item di dalam array daftarTamu:
    const item = document.createElement("li");
    item.textContent = nama;
    listTamu.appendChild(item);
  }
  wadahUndangan.appendChild(listTamu);
}

// 2. Hubungkan tombol dengan pemanggilan fungsi
tombolBuat.addEventListener("click", () => {
  const teksJudul = inputJudul.value.trim();
  // ambil teks judul yang sudah dibersihkan dari spasi liar.

  const teksTamu = inputTamu.value.trim();
  // ambil teks daftar tamu.

  // Pecah teks tamu berdasarkan koma menjadi potongan kata:
  const susunanTamu = teksTamu
    ? teksTamu.split(",").map((t) => t.trim())
    : ["Tamu Anonim"];
  // ubah "Budi, Siti" menjadi array ["Budi", "Siti"].

  // Jika input judul dikosongkan pengguna, kirim undefined agar nilai default aktif:
  const judulYangDikirim = teksJudul !== "" ? teksJudul : undefined;

  // Panggil fungsi dengan menyebarkan tamu menggunakan operator rest:
  buatUndangan(judulYangDikirim, ...susunanTamu);
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Rest Parameter harus selalu berada di posisi paling akhir**:
   Penulisan `function demo(...sisa, nama)` adalah salah dan dilarang di JavaScript. Posisi yang benar adalah `function demo(nama, ...sisa)`.
2. **Hanya satu Rest Parameter per fungsi**: Anda tidak bisa membuat `function test(...a, ...b)`.
3. **Gunakan Default Parameter dibanding `||`**:
   Hindari cara lama seperti `nama = nama || "Anonim"` karena cara lama itu akan menimpa angka `0` atau string kosong `""` yang sebenarnya sah.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser, biarkan kolom Judul Acara **kosong**, lalu isi kolom nama tamu dengan `Ani, Budi, Charles`.
- [ ] Klik tombol **"Cetak Kartu Undangan"**. Perhatikan bahwa judul otomatis terisi `"Acara: Rapat Tim"` (karena Default Parameter aktif).
- [ ] Sekarang ketik judul `"Ulang Tahun"` dan klik tombol lagi. Perhatikan bagaimana nilai cadangan digantikan oleh judul ketikan Anda.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Mengerti bahwa `nama = "Default"` hanya bekerja saat parameter kosong/undefined, dan tanda `...` di parameter fungsi berguna menampung sisa argumen menjadi satu Array**.

---

## 🎯 Uji Pemahaman Mandiri

1. Jika Anda memanggil `sapaUser(null)` pada fungsi `function sapaUser(nama = "Kawan") { return nama; }`, apakah fungsi akan mengembalikan `"Kawan"` ataukah `null`?
2. Apa tipe data dari wadah `angka` pada fungsi `function total(...angka) {}` ketika dipanggil? Apakah sebuah Object biasa ataukah sebuah Array?
