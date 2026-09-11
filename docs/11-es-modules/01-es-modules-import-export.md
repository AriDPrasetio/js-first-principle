---
title: "First Principles Deep Dive: ES Modules (import dan export)"
tags:
  - javascript
  - first-principles
  - roadmap-js/11-es-modules
level: intermediate
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - https://tc39.es/ecma262/#sec-modules
  - https://html.spec.whatwg.org/multipage/scripting.html#attr-script-type
---

# First Principles Deep Dive: ES Modules (import dan export)

> [!ABSTRACT] The Ground Truth
> ES Modules adalah sistem graf ketergantungan statis resmi web (*Static Dependency Graph*): modul diuraikan sebelum dieksekusi, diinstansiasi sebagai pengikatan memori hidup (*Live Read-Only Bindings*), dan dievaluasi tepat satu kali sebagai objek tunggal (*Singleton*).

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "`import` dan `export` hanyalah pengganti sintaksis modern dari `require()` dan `module.exports` milik CommonJS di Node.js."
- ✅ **Masalah Sebenarnya (Core Problem)**: `require()` CommonJS bersifat sinkron dan memuat modul secara dinamis saat runtime, yang mustahil diterapkan efisien di browser karena berkas harus diunduh melintasi jaringan internet yang asinkron. ES Modules didesain dari nol dengan arsitektur statis agar browser dapat memetakan dan mengunduh seluruh pohon ketergantungan berkas secara paralel sebelum baris kode pertama dieksekusi.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Tiga Fase Siklus Hidup Modul (ECMA-262 §16.2.1)**:
   Proses pemuatan modul berjalan dalam 3 fase terpisah:
   - **Fase 1: Konstruksi/Parsing (Construction)**: Mengunduh semua berkas `.js` dan memetakan struktur import/export menjadi pohon graf ketergantungan statis (*Module Record*) tanpa menjalankan kodenya.
   - **Fase 2: Instansiasi (Instantiation)**: Mengalokasikan slot memori untuk setiap identifier yang diekspor dan menghubungkannya (*linking*) ke tempat ia diimpor.
   - **Fase 3: Evaluasi (Evaluation)**: Menjalankan kode modul dari daun terdalam pohon graf ke akar, mengisi nilai-nilai aktual ke dalam slot memori.

2. **Mekanisme Pengikatan Hidup (*Live Read-Only Bindings*)**:
   Tidak seperti CommonJS yang menyalin nilai saat diekspor (*copy of value*), ES Modules menggunakan referensi pengikatan hidup (*live binding*). Jika modul pengekspor mengubah nilai variabelnya secara internal, modul pengimpor akan langsung melihat nilai baru tersebut. Namun di sisi modul pengimpor, variabel yang diimpor berstatus **konstan/read-only** dan dilarang dimutasi secara langsung.

3. **Karakteristik Tag `<script type="module">` di Browser**:
   Ketika browser membaca atribut `type="module"`:
   - Kode secara otomatis dieksekusi dalam mode ketat (*Strict Mode*).
   - Variabel tingkat teratas tidak mencemari objek global `window` (terisolasi dalam *Module Scope*).
   - Pemuatan berkas script secara otomatis berperilaku non-blocking persis seperti tag `<script defer>`.
   - Modul bersifat *Singleton*: jika berkas yang sama diimpor oleh 10 modul berbeda, browser hanya mengunduh dan mengeksekusinya **tepat satu kali saja**.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Gunakan **Named Exports (`export const ...`)** sebagai standar utama di seluruh modul aplikasi karena memaksa konsistensi nama dan memudahkan analisis statis bundler (*Tree-Shaking* untuk membuang kode mati). Gunakan **Dynamic Import (`import('./module.js')`)** yang mengembalikan Promise untuk memuat modul besar secara bertahap (*Lazy Loading / Code Splitting*) saat pengguna mengklik komponen tertentu.

- **Contoh Konkret**:

  ```javascript
  // 1. Modul State Antarmuka: theme-service.js
  // Named Export (Mendukung Live Binding & Tree-Shaking)
  export let activeTheme = 'light';

  export function setTheme(newTheme) {
    if (newTheme === 'dark' || newTheme === 'light') {
      activeTheme = newTheme; // Nilai berubah di dalam modul
      console.log(`[ThemeService] Tema diubah menjadi: ${activeTheme}`);
    }
  }

  // ----------------------------------------------------

  // 2. Modul Konsumen: app.js
  import { activeTheme, setTheme } from './theme-service.js';

  console.log(activeTheme); // 'light'
  setTheme('dark');
  console.log(activeTheme); // 'dark' (Bukti LIVE BINDING: modul pengimpor melihat perubahan nilai seketika!)

  // ❌ activeTheme = 'blue'; // CRASH: TypeError: Assignment to constant variable (Read-only di sisi pengimpor)

  // ----------------------------------------------------

  // 3. Dynamic Import untuk Pemuatan Lambat (Lazy Loading Komponen Berat):
  const modalButton = document.getElementById('open-modal-btn');

  modalButton?.addEventListener('click', async () => {
    // Berkas 'modal-dialog.js' baru diunduh dari jaringan saat tombol benar-benar diklik!
    const { renderModal } = await import('./components/modal-dialog.js');
    renderModal();
  });
  ```

- **Mengapa ini lebih baik**:
  Struktur statis memungkinkan analisis dependency tanpa mengeksekusi kode, menghilangkan siklus impor rusak (*circular dependency deadlocks*) yang sering terjadi di CommonJS. Dynamic import memangkas ukuran unduhan awal halaman web secara dramatis.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Hindari `export default` untuk utilitas atau komponen internal; gunakan `export const namaFitur` agar impor selalu menggunakan nama yang presisi dan autocomplete IDE bekerja optimal.
- [ ] **Langkah 2**: Selalu sertakan ekstensi berkas lengkap `.js` pada path impor lokal di peramban (misal `import { x } from './utils.js'`, bukan `./utils`), karena browser murni tidak melakukan penebakan ekstensi berkas secara otomatis.
- [ ] **Langkah 3**: Terapkan *code-splitting* menggunakan `import()` dinamis pada fitur-fitur yang jarang dibuka pengguna (seperti dialog ekspor PDF atau modul kalkulasi grafik).

> [!TIP] Parameter Kesuksesan (Success Metric)
> Topik ini selesai dieksekusi dengan benar jika: **Aplikasi berjalan dengan arsitektur modul mandiri tanpa memaparkan variabel ke `window`, dan modul berat berhasil dimuat secara dinamis hanya saat dibutuhkan**.

> [!WARNING] Batas Kepastian
> Kemampuan menulis impor tanpa ekstensi berkas (`from './utils'`) atau impor dari nama paket (`from 'lodash'`) adalah **perilaku bundler eksternal (seperti Vite, Webpack) atau Import Maps**, bukan kemampuan bawaan default URL resolver browser murni tanpa konfigurasi.
