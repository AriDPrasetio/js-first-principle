---
title: "Panduan Pemula: Primitive Types vs Object di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/02-syntax-datatypes
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
  - https://tc39.es/ecma262/#sec-ecmascript-data-types-and-values
---

# Panduan Pemula: Primitive Types vs Object di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Di JavaScript, data terbagi menjadi dua cara kerja di memori komputer:
>
> 1. **Primitive**: Nilai mandiri yang selalu disalin terpisah (seperti memfotokopi dokumen).
> 2. **Object**: Data bersama yang disimpan di satu tempat, di mana variabel hanya memegang "kartu alamat" ke data tersebut (seperti dua orang yang memegang alamat gedung yang sama).

---

## 1. Analogi Logis: Fotokopi vs Alamat Rumah

### A. Tipe Primitive (Sistem Fotokopi)

Bayangkan Anda memegang selembar formulir pendaftaran (Variabel A). Rekan Anda memintanya, lalu Anda memfotokopi lembaran tersebut dan memberikannya kepadanya (Variabel B).

- Jika rekan Anda mencoret formulir hasil fotokopinya (Variabel B)...
- **Apakah formulir asli milik Anda (Variabel A) ikut tercoret?**
- **Tentu tidak.** Keduanya adalah lembaran kertas fisik yang terpisah.

Data seperti teks (`string`), angka (`number`), dan nilai benar/salah (`boolean`) bekerja persis seperti ini. Data jenis ini disebut **Primitive**.

---

### B. Tipe Object (Sistem Alamat Rumah)

Sekarang bayangkan ada sebuah rumah fisik.

- Anda menyimpan alamat rumah tersebut di catatan ponsel Anda (Variabel A).
- Rekan Anda juga menyimpan alamat yang sama persis di ponselnya (Variabel B).
- Suatu sore, rekan Anda datang ke rumah tersebut dan mengecat pintunya menjadi warna biru.
- **Saat Anda datang ke rumah itu lewat alamat di ponsel Anda, warna apa pintunya?**
- **Pintunya sudah berwarna biru.** Mengapa? Karena rumah fisiknya hanya ada satu. Ponsel Anda dan rekan Anda tidak menyimpan "rumah", melainkan hanya menyimpan **petunjuk alamat ke rumah yang sama**.

Data berbentuk objek (`{ }`) dan array (`[ ]`) bekerja seperti ini. Data jenis ini disebut **Object (Reference Type)**.

---

## 2. Mengapa Komputer Didesain Seperti Ini? (First Principles)

Alasan utamanya adalah **efisiensi memori komputer**:

1. **Data Primitive itu kecil**: Menyimpan angka `50` atau kata `'Budi'` hanya butuh sedikit sekali ruang di memori. Komputer tidak keberatan membuat salinan baru berkali-kali karena sangat cepat dan ringan.
2. **Data Object itu besar dan dinamis**: Sebuah profil akun pengguna bisa berisi nama, alamat, foto, riwayat transaksi, dan puluhan data lain. Jika setiap kali data itu dipinjamkan komputer harus menyalin ulang seluruh isinya dari nol, memori komputer akan cepat penuh dan aplikasi menjadi lambat.
   Oleh karena itu, komputer memilih jalan cerdas: **datanya ditaruh di satu tempat saja di memori, lalu yang dibagikan cukup alamatnya saja.**

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Anda bisa mencoba langsung di browser dengan membuat dua berkas dalam satu folder:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Primitive Types vs Object</title>
    <style>
      .profile-card {
        font-family: sans-serif;
        max-width: 320px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      button {
        padding: 8px 12px;
        cursor: pointer;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="profile-card">
      <p><strong>Nama:</strong> <span id="user-name">-</span></p>
      <p><strong>Peran:</strong> <span id="user-role">-</span></p>
      <button type="button" id="btn-update">
        Ubah Peran via Salinan Objek
      </button>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Primitive: pass-by-value (tidak mengubah variabel asal)
let roleA = "Frontend Dev";
// simpan teks "Frontend Dev" ke dalam variabel roleA.

let roleB = roleA;
// salin isi roleA ke dalam variabel roleB.

roleB = "Tech Lead";
// ubah isi roleB menjadi "Tech Lead". Variabel roleA tetap "Frontend Dev" karena tipe primitive tidak saling terhubung.

// 2. Object: pass-by-reference (berbagi alamat memori yang sama)
const userProfile = {
  name: "Ari",
  role: roleA,
};
// buat objek userProfile dengan properti nama "Ari" dan peran dari nilai roleA ("Frontend Dev").

const nameEl = document.querySelector("#user-name");
// ambil elemen HTML dengan ID "user-name", simpan ke wadah nameEl.

const roleEl = document.querySelector("#user-role");
// ambil elemen HTML dengan ID "user-role", simpan ke wadah roleEl.

const updateBtn = document.querySelector("#btn-update");
// ambil elemen tombol HTML dengan ID "btn-update", simpan ke wadah updateBtn.

// 3. Render awal ke layar
nameEl.textContent = userProfile.name;
// tampilkan nama dari objek userProfile ke dalam teks elemen nameEl di layar.

roleEl.textContent = userProfile.role;
// tampilkan peran dari objek userProfile ke dalam teks elemen roleEl di layar.

// 4. Interaksi tombol (Membuktikan sifat mutasi objek bersama)
updateBtn.addEventListener("click", () => {
  // saat tombol updateBtn diklik, jalankan perintah di dalam blok ini:

  const profileAlias = userProfile;
  // buat variabel baru yang menunjuk ke alamat objek userProfile yang sama di memori.

  profileAlias.role = roleB;
  // ubah peran pada profileAlias menjadi roleB ("Tech Lead"). Tindakan ini otomatis mengubah userProfile.role aslinya.

  roleEl.textContent = `${userProfile.role} (Dimutasi lewat profileAlias!)`;
  // perbarui teks di layar menggunakan data userProfile asli untuk membuktikan bahwa data aslinya ikut berubah.

  roleEl.style.color = "green";
  // ubah warna teks menjadi hijau sebagai penanda visual perubahan.
});
```

---

## 4. Solusi Praktis: Cara Membuat Objek Baru yang Terpisah

Jika Anda ingin membuat salinan objek yang benar-benar mandiri (agar perubahan di salinan tidak merusak data aslinya), gunakan **Spread Operator (`...`)**:

```javascript
const userProfile = { name: "Ari", role: "Frontend Dev" };

// Salin isi userProfile ke dalam objek baru yang terpisah di memori:
const userMandiri = { ...userProfile };

userMandiri.role = "Product Manager";

console.log(userProfile.role); // Tetap "Frontend Dev" (Aman dari mutasi!)
console.log(userMandiri.role); // "Product Manager"
```

---

## 5. Checklist Praktik Mandiri

- [ ] Buat berkas `index.html` dan `app.js` di komputer Anda, lalu buka `index.html` di browser.
- [ ] Klik tombol **"Ubah Peran via Salinan Objek"** dan perhatikan teks peran berubah di layar.
- [ ] Buka DevTools (`F12`) $\to$ tab **Console**, ketik `userProfile` dan lihat bahwa properti `role` pada objek asli ikut berubah menjadi `"Tech Lead"`.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham materi ini jika: **Bisa menjelaskan ke rekan Anda mengapa mengubah `profileAlias.role` bisa membuat data pada `userProfile` aslinya ikut terubah**.

---

## 🎯 Uji Pemahaman Mandiri

Coba tebak hasilnya sebelum dijalankan di komputer:

```javascript
let kotaAsal = "Jakarta";
let kotaTujuan = kotaAsal;
kotaTujuan = "Bandung";

// Pertanyaan: Berapakah isi variabel kotaAsal sekarang?
// A. "Jakarta"
// B. "Bandung"
// Mengapa alasannya?
```
