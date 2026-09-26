---
title: "Panduan Pemula: Primitive Types vs Object di JavaScript"
tags: "javascript, first-principles, roadmap-js/02-syntax-datatypes"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures"
---

# Panduan Pemula: Primitive Types vs Object di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Di JavaScript, data terbagi menjadi dua cara kerja di memori komputer:
>
> 1. **Primitive**: Nilai mandiri yang bersifat kekal (_immutable_) dan selalu disalin terpisah nilainya (_copy-by-value_).
> 2. **Object**: Data bersama yang disimpan di memori heap (_mutable_), di mana variabel hanya memegang "kartu alamat" ke data tersebut (_copy-by-reference_).

---

## 1. Analogi Logis: Fotokopi vs Alamat Rumah

### A. Tipe Primitive (Sistem Fotokopi)

Bayangkan Anda memegang selembar formulir pendaftaran (Variabel A). Rekan Anda memintanya, lalu Anda memfotokopi lembaran tersebut dan memberikannya kepadanya (Variabel B).

- Jika rekan Anda mencoret formulir hasil fotokopinya (Variabel B)...
- **Apakah formulir asli milik Anda (Variabel A) ikut tercoret?**
- **Tentu tidak.** Keduanya adalah lembaran kertas fisik yang terpisah.

Di JavaScript modern, terdapat **7 Tipe Data Primitive Resmi**:

| Tipe Primitive | Contoh Nilai        | Deskripsi Singkat                             |
| :------------- | :------------------ | :-------------------------------------------- |
| `string`       | `"Halo"`, `'Kyo'`   | Teks karakter                                 |
| `number`       | `42`, `3.14`        | Angka bulat maupun desimal                    |
| `boolean`      | `true`, `false`     | Nilai logika kebenaran                        |
| `undefined`    | `undefined`         | Variabel dibuat tapi belum diberi nilai       |
| `null`         | `null`              | Representasi sengaja kosong / tidak ada objek |
| `bigint`       | `9007199254740991n` | Angka raksasa melampaui batas aman `number`   |
| `symbol`       | `Symbol("id")`      | Pengenal unik yang tidak pernah bertabrakan   |

> [!IMPORTANT]
> **Sifat Mutlak Primitif: Kekal (_Immutable_)**
>
> Nilai primitif tidak pernah bisa diubah fisiknya di memori. Jika Anda memiliki `let kata = "kopi"`, lalu mencoba mengubah huruf pertamanya:
>
> ```javascript
> // 1. Ubah huruf pertama pada string (percobaan mutasi)
> // Catatan*: operasi ini tidak berdampak apa-apa karena nilai primitif bersifat immutable
> kata[0] = "t";
> // 2. Tampilkan isi variabel kata ke konsol — nilainya tetap "kopi"
> console.log(kata);
> ```
>
> Mengganti nilai variabel (`kata = "topi"`) bukanlah memutasi teks lama, melainkan membuang nilai lama dan menunjuk ke data baru yang segar di memori.

---

### B. Tipe Object (Sistem Alamat Rumah)

Sekarang bayangkan ada sebuah rumah fisik di dunia nyata.

- Anda menyimpan alamat rumah tersebut di catatan ponsel Anda (Variabel A).
- Rekan Anda juga menyimpan alamat yang sama persis di ponselnya (Variabel B).
- Suatu sore, rekan Anda datang ke rumah tersebut dan mengecat pintunya menjadi warna biru.
- **Saat Anda datang ke rumah itu lewat alamat di ponsel Anda, warna apa pintunya?**
- **Pintunya sudah berwarna biru.** Mengapa? Karena rumah fisiknya hanya ada satu. Ponsel Anda dan rekan Anda tidak menyimpan "rumah", melainkan hanya menyimpan **petunjuk alamat referensi ke rumah yang sama**.

Data berbentuk objek (`{ }`), array (`[ ]`), maupun fungsi (`function`) bekerja seperti ini. Data jenis ini disebut **Object (Reference Type)** dan bersifat **dapat dimutasi (_mutable_)**.

---

## 2. Mengapa Komputer Didesain Seperti Ini? (First Principles)

Alasan utamanya adalah **efisiensi memori komputer**:

1. **Data Primitive itu kecil dan tetap**: Menyimpan angka `50` atau boolean `true` hanya butuh sedikit sekali byte di memori. Komputer tidak keberatan membuat salinan fisik baru berkali-kali karena sangat cepat dan ringan.
2. **Data Object itu besar dan dinamis**: Sebuah profil akun pengguna bisa berisi nama, foto, daftar teman, riwayat belanja, dan puluhan data lain. Jika setiap kali data itu dipinjamkan komputer harus menyalin ulang seluruh isinya dari nol, memori komputer akan cepat penuh dan aplikasi menjadi lambat.
   Oleh karena itu, komputer memilih jalan cerdas: **datanya ditaruh di satu tempat saja di memori (Heap), lalu yang dibagikan cukup alamat penunjuknya (_pointer_) saja.**

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
// 1. Simpan teks "Frontend Dev" ke variabel roleA sebagai contoh tipe data primitive string
let roleA = "Frontend Dev";

// 2. Salin nilai roleA ke variabel roleB — karena bertipe primitive, isi nilainya disalin mandiri
let roleB = roleA;

// 3. Ubah isi roleB menjadi "Tech Lead"
// Catatan*: karena primitive bekerja dengan salinan nilai, roleA tetap "Frontend Dev" — tidak ikut berubah
roleB = "Tech Lead";

// 4. Buat objek userProfile berisi nama dan peran yang diambil dari nilai roleA saat ini
// Catatan*: objek disimpan di memori heap — variabel hanya menyimpan alamat penunjuknya, bukan isinya langsung
const userProfile = {
  name: "Ari",
  role: roleA,
};

// 5. Ambil elemen penampil nama dari halaman berdasarkan ID-nya, simpan ke wadah nameEl
const nameEl = document.querySelector("#user-name");

// 6. Ambil elemen penampil peran dari halaman berdasarkan ID-nya, simpan ke wadah roleEl
const roleEl = document.querySelector("#user-role");

// 7. Ambil elemen tombol dari halaman berdasarkan ID-nya, simpan ke wadah updateBtn
const updateBtn = document.querySelector("#btn-update");

// 8. Tampilkan nama dari objek userProfile ke elemen nameEl di layar
nameEl.textContent = userProfile.name;

// 9. Tampilkan peran dari objek userProfile ke elemen roleEl di layar
roleEl.textContent = userProfile.role;

// 10. Pasang pendengar klik pada tombol updateBtn — blok ini berjalan setiap kali tombol diklik
updateBtn.addEventListener("click", () => {
  // 11. Buat variabel profileAlias yang menunjuk ke alamat objek userProfile yang sama di memori
  // Catatan*: ini bukan salinan baru — keduanya menunjuk ke rumah yang sama, bukan dua rumah berbeda
  const profileAlias = userProfile;

  // 12. Ubah properti role pada profileAlias menjadi nilai roleB ("Tech Lead")
  // Catatan*: karena profileAlias dan userProfile berbagi alamat yang sama, userProfile.role ikut berubah
  profileAlias.role = roleB;

  // 13. Tampilkan isi userProfile.role ke layar — hasilnya sudah berubah, membuktikan mutasi lewat alias
  roleEl.textContent = `${userProfile.role} (Dimutasi lewat profileAlias!)`;

  // 14. Ubah warna teks menjadi hijau sebagai penanda visual bahwa data sudah dimutasi
  roleEl.style.color = "green";
});
```

---

## 4. Solusi Praktis: Cara Membuat Objek Baru yang Terpisah

Jika Anda ingin membuat salinan objek yang benar-benar mandiri (agar perubahan di salinan tidak merusak data aslinya), gunakan **Spread Operator (`...`)**:

> [!NOTE]
> Tanda titik tiga (`...`) bertindak membongkar dan menyalin properti objek satu per satu ke dalam wadah objek baru `{}` di memori. Sintaks praktis ini akan kita bedah lebih dalam di **Bab 07 (Array & Object Methods)**.

```javascript
// 1. Buat objek userProfile dengan properti name dan role
const userProfile = { name: "Ari", role: "Frontend Dev" };

// 2. Buat objek baru userMandiri dengan menyalin semua properti userProfile menggunakan spread operator
// Catatan*: spread (...) membuat salinan mandiri — objek baru menempati alamat memori sendiri yang berbeda
const userMandiri = { ...userProfile };

// 3. Ubah properti role pada salinan mandiri userMandiri menjadi "Product Manager"
userMandiri.role = "Product Manager";

// 4. Cetak role dari userProfile — hasilnya tetap "Frontend Dev" karena salinannya terpisah dari aslinya
console.log(userProfile.role);
// 5. Cetak role dari userMandiri — hasilnya "Product Manager" sesuai perubahan yang baru dilakukan
console.log(userMandiri.role);
```

---

## 5. Checklist Praktik Mandiri

- [x] Buat berkas `index.html` dan `app.js` di komputer Anda, lalu buka `index.html` di browser.
- [x] Klik tombol **"Ubah Peran via Salinan Objek"** dan perhatikan teks peran berubah di layar.
- [x] Buka DevTools (`F12`) $\to$ tab **Console**, ketik `userProfile` dan lihat bahwa properti `role` pada objek asli ikut berubah menjadi `"Tech Lead"`.
- [x] Coba ketik di Console: `let kata = "kucing"; kata[0] = "b"; console.log(kata);` untuk membuktikan sendiri sifat _immutable_ tipe string.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham materi ini jika: **Bisa menjelaskan ke rekan Anda mengapa mengubah `profileAlias.role` bisa membuat data pada `userProfile` aslinya ikut berubah, dan tahu bahwa tipe primitif tidak bisa dimutasi secara langsung di memori**.

---

## 🎯 Uji Pemahaman Mandiri

Coba tebak hasilnya sebelum dijalankan di komputer:

```javascript
// 1. Buat variabel kotaAsal berisi teks "Jakarta"
let kotaAsal = "Jakarta";
// 2. Salin nilai kotaAsal ke variabel kotaTujuan
let kotaTujuan = kotaAsal;
// 3. Ubah nilai kotaTujuan menjadi "Bandung"
kotaTujuan = "Bandung";

// Pertanyaan: Berapakah isi variabel kotaAsal sekarang?
// A. "Jakarta"
// B. "Bandung"
// Mengapa alasannya?
```
