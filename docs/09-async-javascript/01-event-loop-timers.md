---
title: "First Principles Deep Dive: Event Loop dan Web Timers (Macrotasks vs Microtasks)"
tags:
  - javascript
  - first-principles
  - roadmap-js/09-async-javascript
level: intermediate
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop
  - https://html.spec.whatwg.org/multipage/webappapis.html#event-loops
  - https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
---

# First Principles Deep Dive: Event Loop dan Web Timers (Macrotasks vs Microtasks)

> [!NOTE]
> **The Ground Truth**
>
> JavaScript adalah mesin _single-threaded_ yang tidak pernah menunggu; ia mendelegasikan operasi lambat ke benang kerja browser (_Web APIs_) dan mengoordinasikan eksekusi callback kembali ke Call Stack melalui dua antrean prioritas mutlak: _Microtask Queue_ (prioritas utama tanpa kompromi) dan _Macrotask Queue_ (antrean giliran reguler).

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "`setTimeout(fn, 1000)` menjamin fungsi akan berjalan persis 1.000 milidetik kemudian, dan `setTimeout(fn, 0)` akan mengeksekusi fungsi secara instan tanpa jeda."
- ✅ **Masalah Sebenarnya (Core Problem)**: Parameter waktu di `setTimeout` hanyalah **batas ambang minimal penjadwalan (_minimum delay threshold_)**, bukan garansi waktu eksekusi. Browser hanya memindahkan callback ke antrean _Macrotask_ setelah waktu habis; jika Call Stack sedang sibuk memproses komputasi berat, callback akan tertahan dan terlambat dieksekusi.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Siklus Putaran Event Loop (WHATWG HTML §8.1.6)**:
   Alur kerja loop peristiwa browser berjalan dalam siklus berulang yang ketat:
   - Jalankan satu tugas sinkron hingga _Call Stack_ kosong.
   - **Kuras Habis Antrean Microtask (_Drain Microtask Queue_)**: Jalankan semua microtask (Promise, `queueMicrotask`) hingga antrean benar-benar kosong. Jika microtask menambahkan microtask baru, ia akan langsung dijalankan di siklus yang sama.
   - **Fase Render Layar (_Update the Rendering_)**: Browser menghitung ulang Style, Layout, dan mengecat piksel ke layar (_Paint/Composite_).
   - Ambil **SATU** tugas dari antrean _Macrotask Queue_ (`setTimeout`, `setInterval`, I/O), dorong ke Call Stack, lalu ulangi siklus dari awal.

2. **Perbedaan Mutlak: Macrotask vs Microtask**:
   - **Microtasks**: Callback dari `Promise.then/catch/finally`, `queueMicrotask()`, dan `MutationObserver`.
   - **Macrotasks (Tasks)**: Callback dari `setTimeout`, `setInterval`, event klik DOM, dan respons jaringan.
     _Microtask selalu mendahului Macrotask_ dalam urutan eksekusi setelah tumpukan sinkron tuntas.

3. **Ancaman Pembekuan UI (_UI Starvation_) oleh Microtask Rekursif**:
   Karena peramban wajib menguras antrean microtask sebelum masuk ke fase render layar, perulangan rekursif microtask yang tidak terkontrol (`Promise.resolve().then(loop)`) akan membekukan antarmuka pengguna secara permanen (_infinite loop_) dan mencegah layar memperbarui frame tampilan.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Pahami urutan prioritas eksekusi untuk menjadwalkan komputasi antarmuka:
  - Gunakan **`Promise` / `queueMicrotask`** jika Anda butuh memperbarui state data segera setelah logika saat ini tuntas, namun sebelum browser merender perubahan tersebut ke layar.
  - Gunakan **`setTimeout(fn, 0)`** jika Anda memiliki tugas kalkulasi yang cukup berat dan ingin secara sukarela memberikan giliran kepada browser untuk merender layar (_yield to main thread_) terlebih dahulu agar animasi tidak patah.

- **Contoh Konkret**:

  ```javascript
  // Demonstrasi Urutan First Principles:
  console.log("1. [Sinkron] Mulai");

  // Macrotask (dijadwalkan di Web APIs Timer):
  setTimeout(() => {
    console.log("4. [Macrotask] Callback setTimeout selesai");
  }, 0);

  // Microtask (antrean prioritas utama):
  Promise.resolve().then(() => {
    console.log("3. [Microtask] Callback Promise selesai");
  });

  console.log("2. [Sinkron] Selesai");

  // Urutan Output di Konsol:
  // 1. [Sinkron] Mulai
  // 2. [Sinkron] Selesai
  // 3. [Microtask] Callback Promise selesai (Microtask dikuras dulu!)
  // 4. [Macrotask] Callback setTimeout selesai (Baru giliran macrotask)

  // Contoh Praktis Pemecahan Beban Kerja (Yield to Main Thread):
  function processMassiveDataInChunks(items, processItem) {
    let index = 0;

    function step() {
      const startTime = performance.now();
      // Proses chunk data selama maksimal 10 milidetik agar frame rate (16.6ms) tetap mulus:
      while (index < items.length && performance.now() - startTime < 10) {
        processItem(items[index]);
        index++;
      }

      if (index < items.length) {
        // Serahkan giliran ke browser untuk merender layar, lanjutkan chunk berikutnya di macrotask:
        setTimeout(step, 0);
      } else {
        console.log("Seluruh pemrosesan tuntas tanpa membuat UI membeku!");
      }
    }

    step();
  }
  ```

- **Mengapa ini lebih baik**:
  Memahami pemisahan Macrotask dan Render Phase memungkinkan developer memproses ribuan data tanpa memerlukan _Web Worker_ rumit untuk skenario ringan, serta mencegah aplikasi mengalami freeze antarmuka.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Uji coba urutan log di atas di Console DevTools browser dan terminal Node.js untuk memverifikasi konsistensi perilaku event loop.
- [ ] **Langkah 2**: Jangan pernah mengandalkan interval presisi pada `setInterval` untuk animasi visual; selalu gunakan `requestAnimationFrame(callback)` yang tersinkronisasi langsung dengan refresh rate monitor layar browser (60Hz / 120Hz).
- [ ] **Langkah 3**: Simpan ID timer (`const timerId = setTimeout(...)`) dan selalu sediakan `clearTimeout(timerId)` jika komponen antarmuka ditutup sebelum timer sempat dieksekusi.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Mampu memprediksi 100% urutan log output dari kode yang mencampurkan komputasi sinkron, Promise, dan setTimeout tanpa menebak-nebak**.

> [!WARNING]
> **Batas Kepastian**
>
> Ambang batas `setTimeout(fn, 0)` di browser sebenarnya memiliki batas klem minimum (_minimum clamp timeout_) sebesar **4 milidetik** setelah terjadi sarang pemanggilan timer bertingkat sebanyak 5 tingkat berturut-turut, sesuai pasal 8.5.2 spesifikasi WHATWG HTML.
