---
title: "First Principles Deep Dive: Operator Spread dan Rest (...)"
tags: "javascript, first-principles, roadmap-js/07-array-object-methods"
level: intermediate
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax"
---

# First Principles Deep Dive: Operator Spread dan Rest (...)

> [!NOTE]
> **The Ground Truth**
>
> Tiga titik `...` adalah operator konteks ganda di mana perannya ditentukan oleh lokasi: di sisi ekspresi ia membongkar (_Spread_) elemen keluar dari wadahnya, sedangkan di sisi deklarasi pola ia mengumpulkan (_Rest_) sisa elemen masuk ke dalam satu wadah baru.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Menyalin objek atau array menggunakan spread (`{ ...obj }` atau `[ ...arr ]`) menghasilkan salinan mandiri yang kebal terhadap segala mutasi data."
- ✅ **Masalah Sebenarnya (Core Problem)**: Spread hanya melakukan _Shallow Copy_ (penyalinan dangkal pada level properti pertama). Jika objek tersebut memiliki array atau objek bersarang di dalamnya, yang disalin pada level dalam hanyalah alamat pointer memorinya. Mutasi pada objek bersarang akan tetap merusak objek aslinya. Untuk kloning mendalam yang sejati, browser menyediakan API native `structuredClone()`.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Dualitas Semantik Sintaks `...`**:
   - **Spread (Membongkar)**: Berada di posisi nilai ekspresi. Contoh: `[1, ...[2, 3]]` atau `fn(...args)`. Ia membongkar koleksi menjadi elemen terpisah.
   - **Rest (Mengumpulkan)**: Berada di posisi penampung variabel / pola destructuring. Contoh: `function(...args)` atau `const [first, ...others] = list`. Ia memampatkan elemen yang tersisa ke dalam array atau objek baru.

2. **Mekanisme Shallow Copy pada Object Spread (ECMA-262 §13.2.5.5)**:
   Saat mengeksekusi `{ ...source }`, engine mengekstrak daftar kunci sendiri yang dapat dienumerasi (_enumerable own properties_). Nilai primitif disalin nilainya, tetapi nilai berupa objek/array hanya disalin referensi pointernya.

3. **Aturan Urutan Timpa Properti (_Property Overwrite Order_)**:
   Pada penyusunan objek dengan spread, urutan leksikal dari kiri ke kanan menentukan pemenang: **properti yang dideklarasikan belakangan akan menimpa properti dengan nama yang sama di sebelah kirinya**.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Manfaatkan sifat urutan timpa spread untuk membuat pola _Configuration Merge_ yang elegan: pasang nilai default di sebelah kiri, lalu sebarkan opsi pengguna di sebelah kanan. Jika data memiliki struktur bersarang yang kompleks dan membutuhkan jaminan bebas mutasi menyeluruh, gunakan API browser standar `structuredClone(state)` alih-alih merangkai spread bersarang yang rapuh.

- **Contoh Konkret**:

  ```javascript
  // 1. Pola Penggabungan Konfigurasi Aman dengan Spread:
  const defaultButtonStyles = {
    padding: "8px 16px",
    borderRadius: "4px",
    variant: "solid",
    theme: { color: "#0055ff" }, // Objek bersarang!
  };

  const userCustomStyles = {
    variant: "outline", // Menimpa properti variant
    theme: { color: "#ff3300" }, // Menimpa pointer theme
  };

  // Penggabungan tingkat pertama (Shallow Merge):
  const finalStyles = {
    ...defaultButtonStyles,
    ...userCustomStyles,
    cursor: "pointer", // Menambahkan properti baru di akhir
  };

  console.log(finalStyles.variant); // 'outline' (Berhasil ditimpa!)

  // 2. Bahaya Shallow Copy vs Solusi structuredClone():
  const originalState = {
    user: "Kyo",
    permissions: ["read", "write"],
  };

  // Salinan dangkal (Shallow Copy):
  const shallowCopy = { ...originalState };
  shallowCopy.permissions.push("delete"); // ⚠️ Merusak array permissions di originalState!
  console.log(originalState.permissions.length); // 3 (Ikut berubah karena pointer sama!)

  // ✅ Solusi First Principles untuk Deep Copy (API Web Standar):
  const deepState = structuredClone(originalState);
  deepState.permissions.push("admin");
  console.log(originalState.permissions.includes("admin")); // false (Aman 100%!)
  ```

- **Mengapa ini lebih baik**:
  Menyadari batas _shallow copy_ menyelamatkan developer dari bug state korup yang sangat sulit dilacak. Mengetahui keberadaan `structuredClone()` meniadakan kebutuhan pustaka eksternal seperti Lodash `cloneDeep` atau trik kotor `JSON.parse(JSON.stringify())` yang merusak tipe data Date dan Map.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Uji coba kloning array dengan spread: `const b = [...a]`. Buktikan bahwa `b !== a`, tetapi jika `a[0]` adalah objek, `b[0] === a[0]`.
- [ ] **Langkah 2**: Manfaatkan rest parameter di destructuring untuk mengekstrak properti yang tidak diinginkan: `const { password, ...safeUser } = userProfile;`.
- [ ] **Langkah 3**: Gunakan `structuredClone()` untuk seluruh operasi duplikasi _state tree_ bersarang di aplikasi frontend.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Mampu membedakan dengan tepat kapan cukup menggunakan spread shallow copy dan kapan wajib menggunakan `structuredClone()` untuk mencegah mutasi state bersarang**.

> [!WARNING]
> **Batas Kepastian**
>
> Meskipun `structuredClone()` didukung di semua browser modern dan Node.js 17+, ia **tidak dapat mengkloning fungsi atau elemen DOM Node** (akan melempar `DOMException: DataCloneError`). Untuk objek yang mengandung fungsi, gunakan pola modular murni tanpa state bersama.
