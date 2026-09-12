---
title: "First Principles Deep Dive: Block, Function, dan Global Scope"
tags:
  - javascript
  - first-principles
  - roadmap-js/03-variables-scope
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Glossary/Scope
  - https://tc39.es/ecma262/#sec-lexical-environments
---

# First Principles Deep Dive: Block, Function, dan Global Scope

> [!NOTE]
> **The Ground Truth**
>
> Scope adalah struktur data pohon di memori (_Scope Chain_) di mana setiap blok kode memiliki catatan lingkungannya sendiri (_Environment Record_) beserta tautan penunjuk (_outer reference_) ke lingkungan pembungkusnya, menentukan batas aksesibilitas dan masa hidup variabel.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Scope hanyalah pembatas visibilitas kode abstrak yang diatur otomatis oleh runtime."
- ✅ **Masalah Sebenarnya (Core Problem)**: Tanpa batas isolasi memori, setiap bagian program dapat secara tidak sengaja menimpa variabel di bagian lain (_namespace pollution_ & _variable collision_). Engine membutuhkan sistem rantai referensi satu arah (_Scope Chain_) agar sebuah fungsi dapat mengakses data luarnya tanpa membiarkan lingkungan luar mengacak-acak data lokal di dalamnya.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Anatomi Lingkungan Leksikal (Lexical Environment - ECMA-262 §9.1)**:
   Setiap kali eksekusi memasuki konteks baru, engine membentuk _Lexical Environment_ yang memuat dua komponen fisik:
   - **Environment Record**: Tempat penyimpanan identifier lokal beserta nilainya.
   - **Outer Environment Reference (`[[OuterEnv]]`)**: Pointer alamat yang menunjuk langsung ke _Lexical Environment_ tempat kode tersebut didefinisikan secara tekstual.

2. **Mekanisme Resolusi Identifier (_Scope Chain Resolution_)**:
   Ketika suatu variabel dibaca, engine mencari namanya di _Environment Record_ saat ini. Jika tidak ditemukan, engine menelusuri pointer `[[OuterEnv]]` ke lingkungan luar satu per satu secara hierarkis sampai ke _Global Environment_. Jika di tingkat global tetap tidak ditemukan, engine melempar `ReferenceError: [variable] is not defined`. Penelusuran ini bersifat searah: **dari dalam ke luar**, tidak pernah dari luar ke dalam.

3. **Hierarki Tiga Lingkup: Global, Function, dan Block**:
   - **Global Scope**: Lingkup paling luar yang hidup sepanjang tab browser terbuka.
   - **Function Scope**: Lingkup privat yang dibuat setiap kali fungsi dieksekusi.
   - **Block Scope**: Lingkup independen yang tercipta di antara sepasang kurung kurawal `{}` khusus untuk identifier `let` dan `const`.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Terapkan prinsip _Least Privilege of Data_: tempatkan variabel pada lingkup paling sempit yang memungkinkan. Jangan pernah menaruh variabel di Global Scope. Gunakan _Block Scope_ di dalam loop atau conditional untuk membatasi variabel sementara, dan manfaatkan ES Modules (`type="module"`) agar file script memiliki _Module Scope_ sendiri yang terisolasi total dari `window`.

- **Contoh Konkret**:

  ```javascript
  // Skenario: Menghindari Tabrakan Variabel di Loop UI
  const themeButtons = ["light", "dark", "system"];

  // ❌ Masalah dengan var (Tidak mengenal Block Scope):
  for (var i = 0; i < themeButtons.length; i++) {
    // Variabel 'i' bocor ke luar loop!
  }
  console.log(i); // 3 (Mencemari scope luar)

  // ✅ Solusi Block Scope dengan let:
  for (let j = 0; j < themeButtons.length; j++) {
    const themeName = themeButtons[j];
    // 'j' dan 'themeName' terisolasi di dalam blok putaran loop ini saja
  }
  // console.log(j); // ReferenceError: j is not defined (Memori bersih!)

  // Resolusi Scope Chain (Dari Dalam ke Luar):
  const globalAppTitle = "Dashboard Antarmuka";

  function renderHeader() {
    const sectionName = "Header Utama";

    function createBadge() {
      // Menemukan sectionName di outer env, globalAppTitle di global env
      return `[${globalAppTitle}] -> ${sectionName}`;
    }

    return createBadge();
  }

  console.log(renderHeader());
  ```

- **Mengapa ini lebih baik**:
  Isolasi blok memastikan variabel sementara segera eligible untuk dibersihkan oleh _Garbage Collector_ setelah blok selesai dieksekusi, mencegah kebocoran memori dan bug konflik nama saat aplikasi membesar.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Buka Chrome DevTools -> tab **Sources** -> buat fungsi bersarang, lalu amati panel kanan **Scope** (perhatikan bagaimana browser mengelompokkan variabel ke kategori _Local_, _Block_, _Closure_, dan _Global_).
- [ ] **Langkah 2**: Bungkus seluruh script aplikasi dalam tag `<script type="module">` sehingga variabel tingkat teratas tidak menempel pada objek global `window`.
- [ ] **Langkah 3**: Hindari penggunaan nama variabel yang sama di scope lokal dengan scope luar (_variable shadowing_) agar alur pembacaan data tetap jelas dan tidak membingungkan anggota tim.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Objek `window` di browser bersih dari variabel kustom aplikasi, dan tidak ada variabel sementara loop yang bocor keluar blok**.

> [!WARNING]
> **Batas Kepastian**
>
> Penggunaan kurung kurawal mandiri `{ ... }` untuk membuat block scope tanpa keyword `if` atau `for` adalah **fitur sintaks resmi JavaScript yang valid**, namun jarang digunakan di industri karena konvensi tim biasanya lebih menyukai pemisahan logika melalui fungsi terdedikasi.
