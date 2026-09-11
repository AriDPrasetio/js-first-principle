---
title: "First Principles Deep Dive: Default Parameters dan Rest Parameters"
tags:
  - javascript
  - first-principles
  - roadmap-js/05-functions
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
  - https://tc39.es/ecma262/#sec-function-definitions
---

# First Principles Deep Dive: Default Parameters dan Rest Parameters

> [!ABSTRACT] The Ground Truth
> Parameter fungsi adalah deklarasi slot memori lokal yang diisi saat pemanggilan; *Default Parameters* mengevaluasi nilai cadangan HANYA jika argumen bernilai `undefined`, sedangkan *Rest Parameters* mengumpulkan sisa argumen tak terbatas ke dalam instans objek Array sejati.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Default parameter akan aktif jika kita memberikan nilai kosong apa pun (termasuk `null` atau string kosong `""`)."
- ✅ **Masalah Sebenarnya (Core Problem)**: Spesifikasi secara ketat menetapkan bahwa **hanya nilai `undefined`** (atau argumen yang tidak dilewatkan) yang memicu evaluasi nilai default. Memberikan `null` sengaja dianggap sebagai nilai eksplisit yang sah (*intentional absence of value*), sehingga default parameter tidak akan pernah tersentuh.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Kondisi Pemicu Default Parameter (ECMA-262 §15.1.1)**:
   Engine mengevaluasi argumen ke dalam parameter dari kiri ke kanan. Jika operan bernilai persis `=== undefined`, barulah ekspresi default di sisi kanan dievaluasi saat waktu pemanggilan (*call-time*). Nilai falsy lain (`null`, `0`, `false`, `""`) **tidak memicu** default parameter.

2. **Ruang Lingkup Parameter Antara (*Intermediate Parameter Scope*)**:
   Ketika sebuah fungsi memiliki parameter default, engine membuat *Lexical Environment* perantara khusus untuk parameter, terpisah dari *Environment Record* tubuh fungsi. Parameter di kanan dapat merujuk parameter di kirinya, namun tidak dapat mengakses variabel lokal di dalam tubuh fungsi.

3. **Rest Parameters (`...rest`) vs Objek Kuno `arguments`**:
   - `arguments` adalah objek pseudo-array warisan lama yang tidak memiliki metode bawaan seperti `.map()` atau `.filter()`, dan tidak tersedia di dalam arrow function.
   - Rest Parameters (`...args`) menginstansiasi objek `Array` resmi di heap memory yang menampung seluruh sisa argumen dan dapat langsung memanfaatkan seluruh metode `Array.prototype`.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Gunakan sintaks *Default Parameters* bawaan bahasa alih-alih melakukan penugasan manual di dalam tubuh fungsi (`opts = opts || {}`). Manfaatkan *Rest Parameters* untuk membangun fungsi variadik (fungsi dengan jumlah parameter fleksibel) seperti agregator angka atau penggabung class CSS dinamis.

- **Contoh Konkret**:

  ```javascript
  // Skenario: Utilitas Pembuat Kelas CSS BEM Dinamis
  function createBemClasses(blockName, modifier = 'default', ...extraClasses) {
    // 1. modifier bernilai 'default' HANYA jika dioper undefined atau dilewati
    // 2. extraClasses adalah instans Array sejati: Array.isArray(extraClasses) === true

    const baseClass = `${blockName}--${modifier}`;

    // Langsung gunakan metode array tanpa Array.prototype.slice.call()!
    const validExtras = extraClasses.filter(cls => typeof cls === 'string' && cls.trim() !== '');

    return [baseClass, ...validExtras].join(' ');
  }

  // Uji Coba:
  console.log(createBemClasses('c-button')); 
  // 'c-button--default' (Default parameter terpicu)

  console.log(createBemClasses('c-button', 'primary', 'u-margin-top-sm', 'is-loading')); 
  // 'c-button--primary u-margin-top-sm is-loading' (Rest parameter mengumpulkan sisa kelas)

  // Perbedaan krusial undefined vs null:
  console.log(createBemClasses('c-card', null)); 
  // 'c-card--null' (Default TIDAK terpicu karena null adalah nilai eksplisit!)
  ```

- **Mengapa ini lebih baik**:
  Menghilangkan kode boilerplate defensif di baris pertama setiap fungsi. Rest parameters menjamin tipe data yang dikembalikan selalu berupa array murni, menyingkirkan konversi kikuk `Array.from(arguments)`.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Singkirkan seluruh ketergantungan pada objek `arguments` di codebase; gantikan dengan sintaks rest parameter `(...args)`.
- [ ] **Langkah 2**: Selalu tempatkan parameter dengan nilai default di urutan paling kanan dari daftar parameter fungsi agar pemanggil tidak perlu sengaja mengirim `undefined` untuk melewatinya.
- [ ] **Langkah 3**: Ingat aturan posisi rest parameter: `...rest` WAJIB berada di posisi parameter paling terakhir; menaruh parameter lain setelah rest akan memicu `SyntaxError: Rest parameter must be last formal parameter`.

> [!TIP] Parameter Kesuksesan (Success Metric)
> Topik ini selesai dieksekusi dengan benar jika: **Fungsi dapat menerima argumen variabel tanpa objek `arguments`, dan default parameter tidak pernah gagal akibat salah mengantisipasi nilai `null`**.

> [!WARNING] Batas Kepastian
> Parameter default yang bergantung pada fungsi eksternal (misal: `function log(time = Date.now())`) dievaluasi ulang di setiap pemanggilan; ini **perilaku standar spesifikasi JavaScript**, berbeda dengan bahasa seperti Python di mana argumen default dievaluasi sekali saja saat kompilasi file.
