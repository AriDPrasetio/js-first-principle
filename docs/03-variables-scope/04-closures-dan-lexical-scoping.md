---
title: "First Principles Deep Dive: Closures dan Lexical Scoping"
tags: "javascript, first-principles, roadmap-js/03-variables-scope"
level: intermediate
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures"
---

# First Principles Deep Dive: Closures dan Lexical Scoping

> [!NOTE]
> **The Ground Truth**
>
> Closure adalah konsekuensi mekanis dari _Lexical Scoping_: ketika sebuah fungsi lahir, ia menyimpan pointer internal permanen (`[[Environment]]`) ke lingkungan memori tempat ia didefinisikan, sehingga ia dapat terus mengakses variabel induknya meskipun konteks eksekusi induk telah selesai berjalan dan keluar dari Call Stack.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Closure adalah fitur mistis yang rumit dan harus dihindari karena pasti menyebabkan kebocoran memori (_memory leak_)."
- ✅ **Masalah Sebenarnya (Core Problem)**: Fungsi sering kali perlu mempertahankan state privat (_encapsulation_) dan mengingat konfigurasi awal tanpa harus mengekspos variabel tersebut ke publik atau menyimpannya di variabel global yang rawan dimutasi pihak lain.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Prinsip Lexical Scoping (Waktu Tulis, Bukan Waktu Panggil)**:
   Di JavaScript, lingkup data ditentukan secara statis saat kode ditulis (_author-time/lexical_), bukan ditentukan oleh tempat fungsi tersebut dipanggil (_dynamic scope_). Fungsi selalu mengingat di mana ia "dilahirkan".

2. **Pointer Internal `[[Environment]]` (ECMA-262 §10.2.3)**:
   Saat objek fungsi dibentuk di memori, engine menempelkan slot internal tersembunyi bernama `[[Environment]]`. Slot ini memegang referensi ke _Lexical Environment_ aktif saat itu. Kapan pun dan di mana pun fungsi tersebut dipanggil di masa depan, rantai pencarian identifier akan selalu kembali menelusuri `[[Environment]]` tersebut.

3. **Mekanisme Garbage Collection (Mark-and-Sweep)**:
   Biasanya, ketika suatu fungsi selesai dieksekusi, konteksnya di-pop dari _Call Stack_ dan memorinya dibersihkan. Namun, jika ada fungsi anak yang dikembalikan (_returned_) atau disimpan di tempat lain (misal sebagai event handler), pointer `[[Environment]]` fungsi anak tersebut masih mempertahankan referensi hidup ke _Environment Record_ induk. Sesuai algoritma _Mark-and-Sweep_, memori tersebut **masih dapat dijangkau (_reachable_)**, sehingga engine dilarang membuangnya dari memori heap.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Manfaatkan closure untuk membangun _Encapsulated State Factory_ (pabrik komponen atau generator ID) tanpa memerlukan kelas OOP yang kaku atau `this` binding yang membingungkan. Variabel privat di dalam closure benar-benar tidak dapat disentuh oleh kode luar, memberikan jaminan integritas data yang kokoh.

- **Contoh Konkret**:

  ```javascript
  // Skenario: Komponen Counter UI Terenkapsulasi (Bebas Manipulasi Luar)
  function createCounter(initialValue = 0) {
    // Variabel privat di dalam Lexical Environment
    let count = initialValue;

    return {
      increment() {
        count += 1;
        return count;
      },
      decrement() {
        count -= 1;
        return count;
      },
      getValue() {
        // Hanya menyediakan akses baca (read-only)
        return count;
      },
    };
  }

  const userVotes = createCounter(10);

  console.log(userVotes.increment()); // 11
  console.log(userVotes.increment()); // 12
  console.log(userVotes.getValue()); // 12

  // Bukti enkapsulasi total:
  console.log(userVotes.count); // undefined (Variabel count tidak dapat dibajak dari luar!)
  ```

- **Mengapa ini lebih baik**:
  Pola ini menyelesaikan masalah integritas data murni memakai hukum dasar leksikal bahasa. Tidak ada ketergantungan pada simbol rahasia atau konvensi penamaan garis bawah `_privateVar` yang rapuh; engine secara arsitektural mencegah akses langsung dari luar.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Uji di Chrome DevTools -> pasang breakpoint di dalam metode `increment()` -> perhatikan tab _Scope_ di panel samping: amati bagian bertuliskan **Closure (createCounter)** yang memuat variabel `count`.
- [ ] **Langkah 2**: Hindari mempertahankan closure yang memegang referensi ke objek DOM besar yang sudah dihapus dari layar (pastikan melepaskan event listener jika elemen DOM di-unmount agar Garbage Collector dapat membersihkan memori).
- [ ] **Langkah 3**: Terapkan closure untuk fungsi utilitas praktis seperti `debounce()` atau `throttle()` saat menangani input teks pencarian antarmuka.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Mampu membuat modul state privat di mana data hanya dapat dimodifikasi lewat fungsi antarmuka yang ditentukan, tanpa celah pembajakan variabel dari luar**.

> [!WARNING]
> **Batas Kepastian**
>
> Gagasan bahwa "closure boros memori" adalah **mitos yang berlebihan**. Engine V8 modern sangat cerdas melakukan optimasi: variabel di lingkungan luar yang tidak pernah dirujuk oleh fungsi anak akan secara otomatis dipangkas (_pruned_) dan tidak disimpan di dalam closure.
