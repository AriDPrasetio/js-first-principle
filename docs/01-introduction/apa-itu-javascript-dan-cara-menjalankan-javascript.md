---
title: "First Principles Deep Dive: Apa itu JavaScript dan Cara Menjalankannya"
tags:
  - javascript
  - first-principles
  - roadmap-js/01-introduction
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript
  - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
  - https://tc39.es/ecma262/
---

# First Principles Deep Dive: Apa itu JavaScript dan Cara Menjalankannya

> [!NOTE]
> **The Ground Truth**
>
> JavaScript adalah mesin komputasi berbasis teks yang tidak dapat berjalan di ruang hampa; ia membutuhkan _host environment_ yang menyediakan model memori, pembaca instruksi (_engine_), dan antarmuka interaksi dunia luar (_host APIs_ seperti DOM atau File System).

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "JavaScript adalah bahasa web yang lambat dan kacau, sehingga kita harus membungkusnya dengan framework kompleks sejak hari pertama agar bisa membangun aplikasi interaktif."
- ✅ **Masalah Sebenarnya (Core Problem)**: Dokumen HTML dan stylesheet CSS pada dasarnya bersifat deklaratif dan statis. Browser membutuhkan sebuah bahasa instruksi prosedural yang dapat mengubah struktur pohon dokumen (_DOM_), bereaksi terhadap peristiwa (_event_), dan memanipulasi memori secara dinamis saat halaman sedang berjalan di layar pengguna.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Pemisahan Antara Spesifikasi Bahasa (ECMA-262) dan Host Environment (WHATWG/Node.js)**:
   JavaScript murni (_ECMAScript_) hanya mendefinisikan tipe data, sintaksis logika, loop, dan struktur memori dasar. Objek seperti `window`, `document`, `fetch`, dan `localStorage` bukan bagian dari JavaScript inti, melainkan _Web APIs_ yang disediakan oleh browser runtime sesuai spesifikasi [WHATWG HTML](https://html.spec.whatwg.org/). Sebaliknya, runtime seperti Node.js menyediakan API seperti `fs` dan `process` tanpa menyediakan `window` atau `document`.

2. **Perilaku Parsing Dokumen dan Karakteristik _Parser-Blocking_**:
   Secara default, ketika parser HTML browser membaca tag `<script src="...">`, proses pembacaan HTML dihentikan total (_parser-blocking_) hingga berkas script selesai diunduh dan dieksekusi ([MDN script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)). Atribut `defer` mengubah jadwal ini: script diunduh secara paralel dan dieksekusi tepat setelah parsing HTML tuntas sebelum event `DOMContentLoaded`. Sebaliknya, `async` mengeksekusi script seketika berkas terunduh tanpa menjamin urutan.

3. **Model Eksekusi Single-Threaded Berbasis Call Stack**:
   Engine JavaScript (seperti V8 di Chromium) mengeksekusi kode baris demi baris pada satu alur komputasi (_call stack_ tunggal). Komputasi berat yang sinkron akan memblokir rendering piksel dan interaksi klik pengguna, karena alur eksekusi script dan pipeline compositing layar berbagi benang kerja utama (_main thread_) di browser.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Gunakan pemisahan dokumen HTML semantik, CSS modular (BEM & Design Tokens), dan muat JavaScript eksternal menggunakan atribut `defer` atau `type="module"`. Dengan cara ini, parser browser menyelesaikan pohon DOM secara penuh sebelum script memanipulasinya, meniadakan bug `null element reference` tanpa memerlukan boilerplate wrapper `window.onload` atau framework berat.

- **Contoh Konkret**:

  ```html
  <!-- index.html -->
  <!DOCTYPE html>
  <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>First Principles: Runtime Execution</title>
      <link rel="stylesheet" href="styles.css" />
      <!-- Non-blocking: diunduh paralel, dieksekusi setelah DOM tree terbentuk sempurna -->
      <script defer src="app.js"></script>
    </head>
    <body>
      <main class="counter-card">
        <h1 class="counter-card__title">State Counter</h1>
        <output
          class="counter-card__display"
          id="counter-value"
          aria-live="polite"
          >0</output
        >
        <button type="button" class="counter-card__button" id="btn-increment">
          Tambah Nilai
        </button>
      </main>
    </body>
  </html>
  ```

  ```javascript
  // app.js
  // Dijalankan tepat saat DOM telah siap karena atribut 'defer'
  const displayElement = document.getElementById("counter-value");
  const incrementButton = document.getElementById("btn-increment");

  let stateCount = 0;

  incrementButton.addEventListener("click", () => {
    stateCount += 1;
    displayElement.textContent = String(stateCount);
  });
  ```

- **Mengapa ini lebih baik**:
  Pendekatan ini menghilangkan kompleksitas build-step pada fase fondasi. Struktur BEM (`.counter-card__display`) menjaga isolasi styling, atribut WAI-ARIA (`aria-live="polite"`) memenuhi target WCAG 2.1 AA agar pembaca layar mengetahui perubahan nilai, dan `defer` menjamin performa rendering _First Contentful Paint (FCP)_ optimal tanpa resiko memblokir parser HTML.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Uji jalankan kode di dua host environment berbeda: ketik `console.log(typeof window)` di tab Console Chrome DevTools (hasil: `'object'`), lalu jalankan baris yang sama di terminal Node.js (`node -e "console.log(typeof window)"` -> hasil: `'undefined'`) untuk membuktikan isolasi host environment.
- [ ] **Langkah 2**: Tempatkan tag `<script defer src="...">` pada `<head>` HTML semantik dan pastikan script dapat membaca elemen DOM tanpa membungkusnya dalam handler `DOMContentLoaded`.
- [ ] **Langkah 3**: Buka Chrome DevTools -> tab **Performance** -> rekam proses pemuatan halaman untuk memverifikasi bahwa proses _Parse HTML_ tidak terinterupsi lama oleh unduhan script.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Script berhasil membaca elemen DOM tanpa error `Cannot read properties of null`, dan profil Performance DevTools membuktikan HTML parsing tidak terblokir oleh pemuatan script**.

> [!WARNING]
> **Batas Kepastian**
>
> Rekomendasi penempatan `<script defer>` di `<head>` vs meletakkan script reguler di bagian akhir sebelum penutup `</body>` adalah **pilihan konvensi arsitektur**, bukan hukum sintaks mutlak. Keduanya menghasilkan ketersediaan elemen DOM yang valid, namun `defer` di `<head>` memulai proses pengunduhan berkas jaringan jauh lebih dini.
