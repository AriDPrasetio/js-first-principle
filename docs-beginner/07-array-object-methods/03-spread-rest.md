---
title: "Panduan Pemula: Operator Tiga Titik (Spread dan Rest) di JavaScript"
tags: "javascript, first-principles, roadmap-js/07-array-object-methods"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax"
---

# Panduan Pemula: Operator Tiga Titik (Spread dan Rest) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Tanda tiga titik (`...`) adalah operator bunglon di JavaScript:
>
> - **Spread (Menabur/Membuka)**: Membongkar isi Array atau Objek ke dalam wadah baru.
> - **Rest (Mengumpulkan/Mengemas)**: Menyapu seluruh elemen yang tersisa ke dalam satu wadah Array atau Objek.

---

## 1. Analogi Logis: Menabur Toples vs Menyapu ke Kardus

Bayangkan Anda memiliki setoples permen:

- **SPREAD (Menaburkan Isi Keluar Toples)**:
  Anda membuka toples permen, lalu menuang isinya ke atas meja pesta agar bercampur dengan permen jenis lain.
  *(Contoh: Menggabungkan dua array `[...buahLokal, ...buahImpor]` atau menyalin objek `{ ...profilLama }`).*
- **REST (Menyapu Sisa ke Dalam Kardus)**:
  Pesta selesai, ada permen utama yang diambil tamu, lalu Anda menyapu **seluruh permen yang tersisa** masuk ke dalam satu kardus baru.
  *(Contoh: `const [juara1, ...pesertaLain] = daftarLari;` atau `const { pass, ...profilAman } = akun;`).*

---

## 2. Mengapa Operator Ini Sangat Populer? (First Principles)

1. **Menyalin Objek & Array Tanpa Merusak Data Asli**:
   Dengan spread, Anda tidak lagi memerlukan perintah panjang seperti `.concat()` atau `Object.assign()`. Anda cukup menulis `[...arrayA, ...arrayB]` atau `{ ...objA, ...objB }`.
2. **Aturan "Siapa di Kanan Menang Menimpa"**:
   Saat menggabungkan objek dengan spread, properti yang ditulis belakangan di sisi kanan akan menimpa nilai yang ada di sisi kiri:
   ```javascript
   const akunLama = { nama: "Ari", role: "User" };
   const akunBaru = { ...akunLama, role: "Admin" };
   console.log(akunBaru.role); // "Admin" (Nilai lama berhasil ditimpa dengan aman!)
   ```

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat demonstrasi Array Spread, Array Rest, dan Object Spread/Rest:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Spread dan Rest Operator</title>
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
        cursor: pointer;
        font-size: 0.85rem;
      }
      .box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 12px;
        border-radius: 6px;
      }
      p {
        margin: 4px 0;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Uji Coba Operator Tiga Titik (...)</h3>
      <div class="btn-group">
        <button type="button" id="btn-spread">1. Tabur Gabung Array (Spread)</button>
        <button type="button" id="btn-rest">2. Kemas Sisa Tim (Array Rest)</button>
        <button type="button" id="btn-obj">3. Update Objek Aman (Object Spread & Rest)</button>
      </div>
      <div id="kotak-hasil" class="box">Pilih salah satu tombol di atas...</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// ambil element button spread berdasarkan ID-nya, simpan ke variable tombolSpread
const tombolSpread = document.querySelector("#btn-spread");
// ambil element button rest berdasarkan ID-nya, simpan ke variable tombolRest
const tombolRest = document.querySelector("#btn-rest");
// ambil element button object berdasarkan ID-nya, simpan ke variable tombolObj
const tombolObj = document.querySelector("#btn-obj");
// ambil element kotak hasil berdasarkan ID-nya, simpan ke variable kotakHasil
const kotakHasil = document.querySelector("#kotak-hasil");

// 1. ARRAY SPREAD:
// saat tombolSpread di-click, jalankan function berikut:
tombolSpread.addEventListener("click", () => {
  // simpan array berisi daftar makanan ringan ke dalam variable makananRingan
  const makananRingan = [
    // simpan string "Keripik" ke elemen array
    "Keripik", 
    // simpan string "Kacang" ke elemen array
    "Kacang"
  ];
  // simpan array berisi daftar makanan berat ke dalam variable makananBerat
  const makananBerat = [
    // simpan string "Nasi Goreng" ke elemen array
    "Nasi Goreng", 
    // simpan string "Sate" ke elemen array
    "Sate"
  ];
  // simpan array baru hasil penggabungan makananRingan, makananBerat, dan teks ke dalam variable menuLengkap menggunakan spread
  const menuLengkap = [
    // tebar elemen array makananRingan ke sini
    ...makananRingan, 
    // tebar elemen array makananBerat ke sini
    ...makananBerat, 
    // tambahkan string "Es Teh" ke elemen terakhir
    "Es Teh"
  ];

  // ubah properti innerHTML pada element kotakHasil menjadi teks gabungan menuLengkap
  kotakHasil.innerHTML = `
    <strong>Hasil Gabungan Menu (Array Spread):</strong><br>
    ${menuLengkap.join(" • ")}
  `;
});

// 2. ARRAY REST:
// saat tombolRest di-click, jalankan function berikut:
tombolRest.addEventListener("click", () => {
  // simpan array berisi daftar peserta ke dalam variable pesertaLomba
  const pesertaLomba = [
    // simpan string nama ke elemen array
    "Andi (Juara 1)", 
    "Budi", 
    "Cici", 
    "Doni"
  ];
  // bongkar elemen pertama dan kumpulkan sisa elemen ke dalam array kruCadangan menggunakan rest
  const [
    // ekstrak elemen pertama ke variable pemenangUtama
    pemenangUtama, 
    // kumpulkan sisa elemen array ke variable kruCadangan
    ...kruCadangan
  ] = pesertaLomba;

  // ubah properti innerHTML pada element kotakHasil menjadi teks informasi pemenang dan sisa peserta
  kotakHasil.innerHTML = `
    <p><strong>Pemenang Utama:</strong> ${pemenangUtama}</p>
    <p><strong>Sisa Peserta (${kruCadangan.length} orang):</strong> ${kruCadangan.join(", ")}</p>
  `;
});

// 3. OBJECT SPREAD & OBJECT REST:
// saat tombolObj di-click, jalankan function berikut:
tombolObj.addEventListener("click", () => {
  // simpan object data akun ke dalam variable akunAsal
  const akunAsal = {
    // simpan string "ari_dev" ke property username
    username: "ari_dev",
    // simpan string "ari@example.com" ke property email
    email: "ari@example.com",
    // simpan string "rahasia123" ke property kataSandi
    kataSandi: "rahasia123",
    // simpan string "User" ke property role
    role: "User",
  };

  // Gunakan Object Spread untuk memperbarui role:
  // simpan object baru hasil salinan akunAsal dan penimpaan role ke dalam variable akunUpdate
  const akunUpdate = { 
    // tebar seluruh property dari object akunAsal ke sini
    ...akunAsal, 
    // timpa nilai role menjadi "SuperAdmin"
    role: "SuperAdmin" 
  };

  // Gunakan Object Rest untuk menyembunyikan kata sandi sebelum ditampilkan:
  // bongkar properti kataSandi dan kumpulkan sisa properti ke dalam object akunAman
  const { 
    // ekstrak properti kataSandi ke variable kataSandi
    kataSandi, 
    // kumpulkan sisa properti lainnya ke object akunAman
    ...akunAman 
  } = akunUpdate;

  // ubah properti innerHTML pada element kotakHasil menjadi teks informasi akun yang aman
  kotakHasil.innerHTML = `
    <p><strong>Username:</strong> ${akunAman.username}</p>
    <p><strong>Role Baru:</strong> ${akunAman.role}</p>
    <p><em>(Kata sandi berhasil dipisahkan via Object Rest!)</em></p>
  `;
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Waspada Salinan Dangkal (*Shallow Copy*)**:
   Spread `{ ...dataAsli }` hanya menyalin di tingkat terluar. Jika di dalamnya terdapat objek anak bersarang `{ detail: { skor: 10 } }`, objek anak tersebut masih berbagi alamat memori yang sama.
2. **Solusi Salinan Dalam (*Deep Copy*) Modern**:
   Jika Anda membutuhkan salinan murni yang benar-benar mandiri sampai ke tingkat terdalam, gunakan fungsi standar modern web platform:
   ```javascript
   const salinanMurni = structuredClone(objekBersarang);
   ```
3. **Posisi Rest Selalu Terakhir**: Operator rest wajib berada di urutan penutup: `const [a, ...sisa] = arr;`. Menaruh rest di tengah `[...sisa, z]` adalah kesalahan sintaks.

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser dan klik tombol **"1. Tabur Gabung Array"**.
- [ ] Klik tombol **"2. Kemas Sisa Tim"** dan perhatikan bagaimana pemenang dan sisa tim terpisah rapi.
- [ ] Klik tombol **"3. Update Objek Aman"** dan amati bagaimana role terupdate serta properti sensitif kata sandi disingkirkan lewat object rest.
- [ ] Buka Console (`F12`), coba uji fungsi duplikasi murni `structuredClone`:
  ```javascript
  const asli = { profil: { nama: "Andi" } };
  const klon = structuredClone(asli);
  klon.profil.nama = "Budi";
  console.log(asli.profil.nama); // Tetap "Andi"! Aman 100% dari mutasi.
  ```

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Tahu membedakan Spread vs Rest baik pada Array maupun Objek, memahami aturan penimpaan properti sisi kanan, dan tahu fungsi `structuredClone()` untuk kloning mendalam**.

---

## 🎯 Uji Pemahaman Mandiri

1. Jika Anda memiliki objek `const tema = { warna: "biru", ukuran: "sedang" }`, lalu membuat `const temaBaru = { ...tema, warna: "merah" }`, apakah nilai properti `warna` di dalam `temaBaru`?
2. Bagaimana cara memisahkan properti rahasia `password` dari objek akun menggunakan *Object Rest* agar sisa propertinya aman dikirim ke layar?
```
