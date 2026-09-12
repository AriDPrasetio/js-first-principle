---
title: "First Principles Deep Dive: Array Transformation (map, filter, reduce)"
tags: "javascript, first-principles, roadmap-js/07-array-object-methods"
level: intermediate
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map"
---

# First Principles Deep Dive: Array Transformation (map, filter, reduce)

> [!NOTE]
> **The Ground Truth**
>
> `map`, `filter`, dan `reduce` adalah operator aljabar transformasi data murni yang memproses larik (_array_) tanpa memutasi array aslinya: `map` memetakan dimensi 1-ke-1, `filter` menyaring subset data berbasis predikat kebenaran, dan `reduce` melipat (_fold_) deret data menjadi satu entitas nilai akumulasi.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Loop `for` manual sudah usang dan terlarang; kita wajib merangkai rantai panjang `.map().filter().reduce()` di setiap manipulasi data agar kode terlihat modern."
- ✅ **Masalah Sebenarnya (Core Problem)**: Loop imperatif manual (`for`) rentan terhadap mutasi data tak disengaja (_in-place mutation_) dan variabel penampung sementara yang mengotori scope. Namun, merangkai `.filter().map()` pada dataset masif mengalokasikan array perantara di memori heap pada setiap tahapannya. Kuncinya adalah memahami kapan transformasi deklaratif murni dibutuhkan dan kapan satu lintasan _folding_ `reduce` lebih efisien.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Jaminan Immutability Array Asal (ECMA-262 §23.1.3)**:
   Ketiga metode ini dijamin oleh spesifikasi **tidak pernah memutasi array pemanggil aslinya**. `map` dan `filter` selalu mengalokasikan instans array baru di heap memory, memastikan integritas data sumber tetap terjaga murni (_pure function principle_).

2. **Perbedaan Matematika Tiga Transformasi**:
   - **`map` (Proyeksi 1-ke-1)**: Mengubah setiap elemen dengan fungsi transformer. Ukuran array keluaran selalu tepat sama dengan ukuran array masukan ($N \to N$).
   - **`filter` (Subseleksi $N \to M$)**: Menguji setiap elemen dengan fungsi predikat boolean. Ukuran keluaran adalah subset ($0 \le M \le N$).
   - **`reduce` (Penyusutan/Folding $N \to 1$)**: Menggabungkan seluruh elemen melalui akumulator. Keluaran bisa berupa satu tipe data apa pun (angka, objek kamus, atau struktur pohon baru).

3. **Bahaya Peniadaan `initialValue` pada `reduce`**:
   Jika argumen `initialValue` tidak disertakan pada `.reduce()`:
   - Engine mengambil elemen indeks `0` sebagai akumulator awal dan memulai loop dari indeks `1`.
   - **Namun jika array pemanggil dalam keadaan kosong (`[]`)**, engine secara spesifikasi wajib melempar crash fatal: `TypeError: Reduce of empty array with no initial value`. Menyertakan nilai awal adalah kewajiban deterministik.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Gunakan `map` murni untuk transformasi tampilan UI (misal mengonversi daftar produk mentah dari API menjadi elemen markup HTML). Selalu sertakan `initialValue` pada setiap pemanggilan `reduce`. Jika butuh melakukan filter sekaligus transformasi dalam satu lintasan data besar, gunakan `reduce` untuk menghindari alokasi memori ganda.

- **Contoh Konkret**:

  ```javascript
  // Skenario: Pipeline Pemrosesan Keranjang Belanja UI
  const rawCartItems = [
    { id: 101, name: "Kaos Polos", price: 75000, quantity: 2, inStock: true },
    {
      id: 102,
      name: "Topi Snapback",
      price: 45000,
      quantity: 1,
      inStock: false,
    },
    {
      id: 103,
      name: "Celana Jeans",
      price: 210000,
      quantity: 1,
      inStock: true,
    },
  ];

  // 1. FILTER: Saring hanya item yang tersedia stoknya
  const availableItems = rawCartItems.filter((item) => item.inStock);

  // 2. MAP: Transformasikan data menjadi markup HTML ramah aksesibilitas
  const cartMarkupList = availableItems.map((item) => {
    return `
      <li class="c-cart__item" data-item-id="${item.id}">
        <span class="c-cart__name">${item.name}</span>
        <span class="c-cart__price">Rp${item.price.toLocaleString("id-ID")}</span>
      </li>
    `;
  });

  // 3. REDUCE: Hitung total biaya belanja secara deterministik (WAJIB isi initialValue = 0)
  const grandTotal = availableItems.reduce((accumulator, item) => {
    return accumulator + item.price * item.quantity;
  }, 0); // 0 adalah initialValue pencegah crash saat cart kosong!

  console.log("Total Pembayaran: Rp" + grandTotal); // Rp360.000
  ```

- **Mengapa ini lebih baik**:
  Data asli `rawCartItems` tidak pernah tersentuh mutasi. Kode menjadi deklaratif, mudah dibaca, dan tidak ada variabel `let total = 0` yang terpapar di luar cakupan fungsi.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Pasang aturan linter ESLint atau kebiasaan pribadi: **tidak pernah menulis `.reduce()` tanpa parameter kedua (initialValue)**.
- [ ] **Langkah 2**: Hindari memicu efek samping (_side effects_) di dalam `.map()`; jika tujuan kita hanya mengeksekusi operasi (misal menempelkan event listener atau `console.log`), gunakan `.forEach()` atau `for...of`, bukan `.map()`.
- [ ] **Langkah 3**: Uji ketahanan array kosong: jalankan `[].reduce((a, b) => a + b, 0)` (sukses menghasilkan 0) vs `[].reduce((a, b) => a + b)` (crash TypeError) untuk membuktikan kebenaran fundamental nilai awal.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Pipeline transformasi data array tidak menghasilkan efek samping mutasi pada data asli dan kebal dari crash runtime saat menerima array kosong**.

> [!WARNING]
> **Batas Kepastian**
>
> Rantai panjang seperti `.filter().map().filter().map()` adalah **gaya deklaratif yang elegan secara visual**, namun memiliki penalti alokasi memori berlebih untuk dataset dengan puluhan ribu item. Untuk performa ekstrem, satu loop imperatif atau satu lintasan `reduce` tetap menjadi pilihan arsitektur yang lebih optimal.
