---
title: "First Principles Deep Dive: Parameter vs Argument, Default Parameters, dan Rest Parameters"
tags: "javascript, first-principles, roadmap-js/05-functions"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters"
---

# First Principles Deep Dive: Parameter vs Argument, Default Parameters, dan Rest Parameters

> [!NOTE]
> **The Ground Truth**
>
> Parameter fungsi adalah deklarasi formal slot memori lokal pada definisi fungsi, sedangkan Argumen adalah entitas nilai aktual yang dievaluasi dan disuplai oleh pemanggil saat waktu eksekusi (`[[Call]]`); _Default Parameters_ mengevaluasi nilai cadangan HANYA jika argumen bernilai `undefined`, sedangkan _Rest Parameters_ mengumpulkan sisa argumen tak terbatas ke dalam instans objek Array sejati.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Parameter dan argumen adalah istilah yang sama dan bisa saling menggantikan, serta default parameter akan aktif jika kita mengirimkan nilai falsy apa pun (seperti `null` atau string kosong `""`)."
- ✅ **Masalah Sebenarnya (Core Problem)**: Parameter adalah cetakan identifier di *Environment Record*, sedangkan argumen adalah nilai konkret di *Call Stack*. Terkait nilai cadangan, spesifikasi secara ketat menetapkan bahwa **hanya nilai `undefined`** (atau argumen yang tidak dilewatkan) yang memicu evaluasi nilai default. Memberikan `null` sengaja dianggap sebagai nilai eksplisit yang sah (_intentional absence of value_), sehingga default parameter tidak akan pernah tersentuh.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Distingsi Formal: Parameter vs Argument (ECMA-262 §10.2.11 & §15.1)**:
   - **Parameter (_Formal Parameter List_)**: Identifier lokal yang dideklarasikan saat mendefinisikan fungsi (misal: `function simpanData(key, value)` -> `key` dan `value` adalah parameter). Mereka bertindak sebagai variabel lokal di dalam *Lexical Environment* fungsi.
   - **Argument (_Arguments List_)**: Nilai ekspresi nyata yang dikirimkan pemanggil saat fungsi dipanggil (misal: `simpanData("tema", "gelap")` -> `"tema"` dan `"gelap"` adalah argumen).
   - Saat engine memanggil fungsi melalui operasi internal `[[Call]](thisArgument, argumentsList)`, engine menjalankan *Argument Binding Initialization*, memetakan setiap argumen dari kiri ke kanan ke parameter formal yang bersesuaian. Jika jumlah argumen lebih sedikit daripada parameter, sisa parameter diinisialisasi dengan `undefined`.

2. **Kondisi Pemicu Default Parameter (ECMA-262 §15.1.1)**:
   Engine mengevaluasi argumen ke dalam parameter dari kiri ke kanan. Jika operan bernilai persis `=== undefined`, barulah ekspresi default di sisi kanan dievaluasi saat waktu pemanggilan (_call-time_). Nilai falsy lain (`null`, `0`, `false`, `""`) **tidak memicu** default parameter.

3. **Ruang Lingkup Parameter Antara (_Intermediate Parameter Scope_)**:
   Ketika sebuah fungsi memiliki parameter default, engine membuat _Lexical Environment_ perantara khusus untuk parameter, terpisah dari _Environment Record_ tubuh fungsi. Parameter di kanan dapat merujuk parameter di kirinya, namun tidak dapat mengakses variabel lokal di dalam tubuh fungsi.

4. **Rest Parameters (`...rest`) vs Objek Kuno `arguments`**:
   - `arguments` adalah objek pseudo-array warisan lama yang tidak memiliki metode bawaan seperti `.map()` atau `.filter()`, dan tidak tersedia di dalam arrow function.
   - Rest Parameters (`...args`) menginstansiasi objek `Array` resmi di heap memory yang menampung seluruh sisa argumen dan dapat langsung memanfaatkan seluruh metode `Array.prototype`.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Pahami dengan jelas batas antara *definisi fungsi* (tempat parameter berada) dan *pemanggilan fungsi* (tempat argumen dikirim). Gunakan sintaks _Default Parameters_ bawaan bahasa alih-alih melakukan penugasan manual di dalam tubuh fungsi (`opts = opts || {}`). Manfaatkan _Rest Parameters_ untuk membangun fungsi variadik (fungsi dengan jumlah parameter fleksibel) seperti agregator angka atau penggabung class CSS dinamis.

- **Contoh Konkret**:

  ```javascript
  // 1. ANATOMI: PARAMETER VS ARGUMEN
  // 'blockName', 'modifier', dan '...extraClasses' adalah PARAMETER (tempat penampung):
  function createBemClasses(blockName, modifier = "default", ...extraClasses) {
    // 1. modifier bernilai 'default' HANYA jika dioper undefined atau dilewati
    // 2. extraClasses adalah instans Array sejati: Array.isArray(extraClasses) === true

    const baseClass = `${blockName}--${modifier}`;

    // Langsung gunakan metode array tanpa Array.prototype.slice.call()!
    const validExtras = extraClasses.filter(
      (cls) => typeof cls === "string" && cls.trim() !== "",
    );

    return [baseClass, ...validExtras].join(" ");
  }

  // 2. SAAT PEMANGGILAN: NILAI NYATA YANG DIOPER ADALAH ARGUMEN
  // "c-button" adalah ARGUMEN:
  console.log(createBemClasses("c-button"));
  // 'c-button--default' (Default parameter terpicu)

  // "c-button", "primary", "u-margin-top-sm", "is-loading" adalah ARGUMEN:
  console.log(
    createBemClasses("c-button", "primary", "u-margin-top-sm", "is-loading"),
  );
  // 'c-button--primary u-margin-top-sm is-loading' (Rest parameter mengumpulkan sisa argumen)

  // Perbedaan krusial undefined vs null:
  console.log(createBemClasses("c-card", null));
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

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Fungsi dapat menerima argumen variabel tanpa objek `arguments`, dan default parameter tidak pernah gagal akibat salah mengantisipasi nilai `null`**.

> [!WARNING]
> **Batas Kepastian**
>
> Parameter default yang bergantung pada fungsi eksternal (misal: `function log(time = Date.now())`) dievaluasi ulang di setiap pemanggilan; ini **perilaku standar spesifikasi JavaScript**, berbeda dengan bahasa seperti Python di mana argumen default dievaluasi sekali saja saat kompilasi file.
