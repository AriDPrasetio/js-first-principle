---
title: "First Principles Deep Dive: Primitive Types dan Object"
tags:
  - javascript
  - first-principles
  - roadmap-js/02-syntax-datatypes
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
  - https://tc39.es/ecma262/#sec-ecmascript-data-types-and-values
---

# First Principles Deep Dive: Primitive Types dan Object

> [!NOTE]
> **The Ground Truth**
>
> Di JavaScript, nilai terbagi menjadi dua kategori fundamental memori: _Primitive_ (nilai atomik yang kekal/immutable dan disalin nilainya secara langsung) serta _Object_ (koleksi pasangan key-value di heap memory yang dimanipulasi melalui alamat referensi/pointer).

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Segala sesuatu di JavaScript adalah objek."
- ✅ **Masalah Sebenarnya (Core Problem)**: JavaScript memiliki 7 tipe data primitif (`string`, `number`, `boolean`, `undefined`, `null`, `symbol`, `bigint`) yang bukan merupakan objek. Ketika kita memanggil metode seperti `'hello'.toUpperCase()`, JavaScript engine melakukan _autoboxing_ sementara membungkus string primitif menjadi objek `String` sesaat untuk mengakses metodenya, lalu membuangnya seketika dari memori.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Immutability Nilai Primitif vs Mutability Objek (ECMA-262 §6.1)**:
   Nilai primitif tidak dapat dimodifikasi di dalam memori. Operasi seperti `'abc' + 'd'` tidak mengubah string `'abc'`, melainkan mengalokasikan entitas string baru `'abcd'` di memori. Sebaliknya, objek menyimpan struktur dinamis di mana propertinya dapat ditambah, dihapus, atau diubah nilainya tanpa mengubah identitas referensi objek tersebut.

2. **Perbedaan Model Evaluasi: Copy by Value vs Copy by Reference**:
   Ketika variabel bernilai primitif dioper atau di-assign (`b = a`), CPU menyalin nilai biner secara langsung ke slot memori baru. Modifikasi pada `b` mustahil memengaruhi `a`. Namun ketika objek di-assign (`b = a`), yang disalin hanyalah alamat pointer memori heap; kedua variabel kini menunjuk ke kantong data fisik yang identik di memori.

3. **Mekanisme Autoboxing (Primitive Wrapper Objects)**:
   Primitif murni tidak memiliki metode atau properti. Ketika sintaks titik (`.`) dipanggil pada tipe primitif, engine secara implisit mengeksekusi abstraksi internal `ToObject(value)`, membaca metode dari prototipe (`String.prototype`), menjalankannya, lalu menghapus pembungkus objek sementara tersebut.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Gunakan tipe primitif untuk data diskrit yang berdiri sendiri (ID, nama, status flag). Ketika mengelola state aplikasi dalam objek, terapkan _immutability pattern_ buatan sendiri (membuat objek referensi baru setiap ada perubahan data) untuk memastikan reaktivitas UI dapat dideteksi secara presisi melalui perbandingan referensi cepat (`prevObj !== nextObj`), bukan membandingkan seluruh properti di dalamnya secara rekursif (_deep equality_).

- **Contoh Konkret**:

  ```javascript
  // 1. Primitive: Copy by Value & Immutability
  let themeMode = "light";
  let activeTheme = themeMode; // Menyalin nilai 'light'
  activeTheme = "dark"; // themeMode tetap 'light'

  // 2. Object: Copy by Reference
  const userProfile = { name: "Kyo", theme: "light" };
  const adminProfile = userProfile; // Menyalin POINTER memori
  adminProfile.theme = "dark"; // userProfile.theme ikut berubah menjadi 'dark'!

  // 3. Rekonstruksi Aman: Immutable State Update (Mencegah Side Effect Referensi)
  function updateTheme(currentProfile, newTheme) {
    // Alokasikan objek baru di Heap Memory alih-alih memutasi langsung
    return {
      ...currentProfile,
      theme: newTheme,
    };
  }

  const updatedUser = updateTheme(userProfile, "high-contrast");
  console.log(userProfile !== updatedUser); // true (referensi memori berbeda)
  ```

- **Mengapa ini lebih baik**:
  Memahami bahwa objek disalin melalui referensi memotong puluhan jam debugging akibat _mutasi tersembunyi (unintended side effects)_ yang sering terjadi pada state UI. Pendekatan ini selaras langsung dengan cara kerja rendering modern: perbandingan kesetaraan referensi `===` berbiaya $O(1)$ dibandingkan perbandingan isi yang bernilai $O(n)$.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Uji coba mutasi primitif di Console: `let str = 'halo'; str[0] = 'k'; console.log(str);` -> buktikan bahwa string tetap `'halo'` karena sifat primitif yang kekal (_immutable_).
- [ ] **Langkah 2**: Deklarasikan objek sederhana, lalu buat salinan dengan operator assignment (`const b = a`) dan buktikan perubahan properti pada `b` merusak nilai pada `a`.
- [ ] **Langkah 3**: Buat salinan aman tanpa mutasi menggunakan spread syntax `{ ...a }` atau `structuredClone(a)` untuk struktur bersarang, lalu verifikasi bahwa `a !== b`.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Dapat menjelaskan secara presisi tanpa ragu mengapa memutasi objek referensi menyebabkan efek samping di tempat lain, dan mampu mengimplementasikan kloning objek secara immutable**.

> [!WARNING]
> **Batas Kepastian**
>
> Gagasan bahwa variabel primitif selalu disimpan di _Call Stack_ sedangkan Objek selalu di _Heap_ adalah **detail implementasi internal V8/SpiderMonkey**, bukan aturan formal spesifikasi ECMA-262. Yang diwajibkan oleh spesifikasi adalah perilakunya (_behavior_), bukan letak arsitektur register fisik CPU.
