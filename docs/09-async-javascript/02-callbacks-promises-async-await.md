---
title: "First Principles Deep Dive: Dari Callback ke Promise dan async/await"
tags: "javascript, first-principles, roadmap-js/09-async-javascript"
level: intermediate
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises"
---

# First Principles Deep Dive: Dari Callback ke Promise dan async/await

> [!NOTE]
> **The Ground Truth**
>
> `Promise` adalah mesin status terhingga (_Finite State Machine_) berstatus kekal yang merebut kembali kontrol eksekusi dari callback pihak ketiga; sedangkan `async/await` adalah gula sintaksis berbasis generator yang menunda eksekusi fungsi lokal tanpa memblokir benang utama peramban.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "`async/await` mengubah eksekusi JavaScript menjadi sinkron dan berjalan di multi-thread."
- ✅ **Masalah Sebenarnya (Core Problem)**: JavaScript tetap berjalan di satu benang tunggal (_single-thread_). Kata kunci `await` tidak pernah menghentikan CPU; ia hanya menangguhkan (_pauses_) fungsi lokal tersebut dan segera menyerahkan giliran eksekusi kembali ke _Event Loop_. Pola ini memecahkan masalah legendaris _Inversion of Control_ (kehilangan kontrol eksekusi pada callback lama) dan piramida kode bersarang (_Callback Hell_).

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Mesin Status Terhingga `Promise` (ECMA-262 §27.5)**:
   Sebuah instans Promise hanya dapat berada di salah satu dari **tiga status mutually exclusive**:
   - `pending`: Operasi masih berlangsung di latar belakang.
   - `fulfilled`: Operasi sukses menghasilkan nilai (_value_).
   - `rejected`: Operasi gagal menghasilkan alasan (_reason_).
     Perpindahan status **bersifat satu arah dan permanen (_immutable settlement_)**. Sekali sebuah Promise resolved atau rejected, status dan nilainya terkunci selamanya; ia mustahil berubah status untuk kedua kalinya.

2. **Resolusi Masalah _Inversion of Control_**:
   Pada callback kuno, kita menyerahkan fungsi kita ke pihak ketiga (misal library analitik) dengan harapan mereka akan memanggilnya tepat satu kali. Namun mereka bisa saja memanggilnya 0 kali, 5 kali, atau memanggilnya secara sinkron. Kontrak spesifikasi Promise menjamin bahwa callback `.then()` **pasti dipanggil asinkron melalui antrean Microtask** dan **tepat satu kali saja**.

3. **Mekanisme Penangguhan dan Pelanjutan `async/await`**:
   Fungsi yang ditandai `async` **selalu mengembalikan Promise secara otomatis**. Saat baris `await promise` dicapai, engine mendaftarkan kelanjutan fungsi tersebut ke antrean _Microtask_, lalu segera keluar (_yield_) dari fungsi tersebut sehingga Call Stack bebas menjalankan kode lainnya. Begitu Promise tersebut selesai, sisa tubuh fungsi dilanjutkan kembali.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Gunakan sintaks `async/await` yang bersih dikombinasikan dengan blok `try/catch/finally` untuk alur sekuensial. Namun, hindari jebakan _Serial Waterfall_ (menunggu satu per satu secara berurutan ketika tugas-tugas tersebut sebenarnya tidak saling bergantung); gunakan kombinator konkurensi resmi **`Promise.all()`** atau **`Promise.allSettled()`** untuk menjalankan operasi paralel.

- **Contoh Konkret**:

  ```javascript
  // Skenario: Mengambil Data Profil dan Riwayat Notifikasi Pengguna Secara Konkuren
  async function fetchUserData(userId) {
    // ❌ Anti-Pattern: Serial Waterfall (Menunggu satu per satu, membuang waktu jaringan):
    // const profile = await fetchUserProfile(userId);   // Menunggu 200ms
    // const alerts = await fetchUserAlerts(userId);     // Menunggu 200ms lagi (Total 400ms!)

    try {
      // ✅ Rekonstruksi Konkurensi First Principles (Berjalan Paralel):
      // Kedua permintaan HTTP diluncurkan ke jaringan detik itu juga!
      const profilePromise = fetch(`/api/users/${userId}`).then((res) => {
        if (!res.ok) throw new Error("Profil gagal dimuat");
        return res.json();
      });

      const alertsPromise = fetch(`/api/users/${userId}/alerts`).then((res) => {
        if (!res.ok) throw new Error("Notifikasi gagal dimuat");
        return res.json();
      });

      // Tunggu kedua Promise selesai bersamaan di Microtask Queue:
      const [profileData, alertsData] = await Promise.all([
        profilePromise,
        alertsPromise,
      ]);

      return {
        user: profileData,
        alerts: alertsData,
      };
    } catch (error) {
      console.error("[Error Pipeline Asinkron]:", error.message);
      // Lempar kembali error atau kembalikan state fallback antarmuka
      return null;
    }
  }

  // Penggunaan dengan status loading antarmuka:
  async function renderDashboard() {
    const data = await fetchUserData(101);
    if (data) {
      console.log("UI Siap dirender dengan data paralel!");
    }
  }

  renderDashboard();
  ```

- **Mengapa ini lebih baik**:
  Memahami bahwa Promise adalah objek status yang dapat dibuat sebelum di-`await` memungkinkan kita meluncurkan banyak request jaringan secara bersamaan (_parallel fetching_), memangkas waktu pemuatan antarmuka pengguna hingga 50% atau lebih.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Audit seluruh kode `await`: jika ada dua atau lebih baris `await` berurutan yang tidak saling bergantung, satukan dengan `Promise.all()` atau `Promise.allSettled()`.
- [ ] **Langkah 2**: Manfaatkan `Promise.allSettled()` jika Anda ingin memuat beberapa widget dasbor di mana kegagalan satu widget tidak boleh membatalkan widget lainnya (_fail-tolerant dashboard_).
- [ ] **Langkah 3**: Selalu bungkus pemanggilan `await` di dalam blok `try/catch` untuk mencegah error yang tidak tertangani (_Unhandled Promise Rejection_).

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Operasi jaringan independen berjalan secara paralel dan tidak ada unhandled promise rejection yang bocor ke console**.

> [!WARNING]
> **Batas Kepastian**
>
> Memakai `await` di dalam loop `array.forEach()` adalah **kesalahan umum di industri**: `.forEach` tidak menunggu eksekusi Promise di dalamnya selesai. Untuk menjalankan iterasi asinkron berurutan, gunakan loop bahasa native `for...of`, atau gunakan `Promise.all(array.map(...))` untuk eksekusi paralel.
