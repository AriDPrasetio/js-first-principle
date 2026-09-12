---
title: "First Principles Deep Dive: DOM Query Selectors dan Event Listeners"
tags: "javascript, first-principles, roadmap-js/08-dom-events"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector"
---

# First Principles Deep Dive: DOM Query Selectors dan Event Listeners

> [!NOTE]
> **The Ground Truth**
>
> DOM bukan bagian dari bahasa JavaScript, melainkan struktur pohon representasi dokumen di memori C++ peramban; manipulasi elemen dan penempelan event listener adalah komunikasi lintas batas (_cross-boundary bridge_) antara runtime script dan mesin render browser.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Memanipulasi DOM dengan JavaScript vanilla itu lambat dan ketinggalan zaman, sehingga kita wajib selalu memakai Virtual DOM milik framework."
- ✅ **Masalah Sebenarnya (Core Problem)**: Operasi DOM JavaScript murni sebenarnya sangat cepat. Yang mahal adalah **biaya reflow dan repaint peramban** jika developer melakukan query DOM berulang-ulang di dalam loop atau mengubah style geometri elemen secara ceroboh. Memahami antarmuka `querySelector` dan opsi `addEventListener` modern menghasilkan aplikasi yang secepat atau bahkan lebih cepat daripada framework.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Jembatan Web IDL dan Biaya Penelusuran Pohon DOM (WHATWG DOM Standard)**:
   Setiap kali kita memanggil `document.querySelector('.c-card')`, engine JavaScript harus menyeberangi jembatan bahasa (_context crossing_) ke mesin C++ browser untuk menelusuri pohon node dokumen menggunakan parser selektor CSS. Operasi ini mengembalikan antarmuka `Element` atau `null` jika tidak ditemukan. `querySelectorAll` mengembalikan `NodeList` statis (snapshot saat pemanggilan), berbeda dengan metode lama `getElementsByClassName` yang mengembalikan koleksi hidup (_live HTMLCollection_).

2. **Antarmuka Universal `EventTarget` (Spesifikasi DOM §2.6)**:
   Setiap node DOM mewarisi antarmuka `EventTarget`. Pendaftaran interaksi dilakukan melalui:
   `target.addEventListener(type, listener, options)`.
   Objek `options` modern menyediakan kontrol perilaku fundamental:
   - `capture`: mendengarkan di fase penangkapan (_capturing phase_).
   - `once: true`: browser secara otomatis mencopot listener segera setelah event pertama kali terpicu.
   - `passive: true`: menjamin bahwa listener tidak akan memanggil `event.preventDefault()`, memungkinkan benang compositing browser (_Compositor Thread_) menjalankan scrolling layar 60fps seketika tanpa tertahan eksekusi JavaScript.
   - `signal`: menghubungkan siklus hidup listener ke `AbortSignal` untuk pembersihan massal.

3. **Retensi Memori dan Kebocoran Elemen DOM (_Detached DOM Nodes_)**:
   Jika sebuah elemen DOM dicopot dari layar HTML tetapi fungsi listener-nya masih terdaftar dan memegang closure ke memori, elemen tersebut menjadi _Detached DOM Node_. Garbage Collector dilarang membuangnya, memicu kebocoran memori tersembunyi yang membuat tab browser semakin lambat.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Terapkan prinsip _Cache DOM References_: lakukan query elemen sekali saja di awal saat inisialisasi modul, simpan referensinya ke variabel `const`, dan jangan pernah melakukan `document.querySelector` di dalam event listener klik berulang. Manfaatkan opsi `{ signal }` dari `AbortController` untuk mencopot puluhan event listener sekaligus saat komponen dihancurkan (_unmount_).

- **Contoh Konkret**:

  ```javascript
  // Skenario: Komponen Panel Tab Aksesibel dengan Manajemen Siklus Hidup
  function initTabPanel(containerSelector) {
    // 1. Cache referensi DOM sekali di awal (hemat biaya penelusuran pohon C++)
    const container = document.querySelector(containerSelector);
    if (!container) return; // Guard clause jika elemen tidak ada di dokumen

    const tabButtons = container.querySelectorAll('[role="tab"]');
    const tabPanels = container.querySelectorAll('[role="tabpanel"]');

    // Buat AbortController untuk pembersihan listener secara deterministik
    const lifecycleController = new AbortController();
    const { signal } = lifecycleController;

    // Pasang listener dengan signal opsi modern
    tabButtons.forEach((button) => {
      button.addEventListener(
        "click",
        (event) => {
          const targetPanelId = button.getAttribute("aria-controls");
          activateTab(button, targetPanelId);
        },
        { signal },
      ); // Jika signal diaborsi, listener otomatis terlepas dari memori!
    });

    function activateTab(activeBtn, targetPanelId) {
      // Perbarui atribut ARIA untuk pembaca layar (WCAG 2.1 AA)
      tabButtons.forEach((btn) =>
        btn.setAttribute("aria-selected", String(btn === activeBtn)),
      );
      tabPanels.forEach((panel) => {
        panel.hidden = panel.id !== targetPanelId;
      });
    }

    // Kembalikan metode teardown untuk mencegah detached DOM memory leak
    return function destroy() {
      lifecycleController.abort(); // Melepaskan seluruh listener dalam satu instruksi!
      console.log("Seluruh listener tab berhasil dibersihkan dari memori.");
    };
  }

  // Inisialisasi:
  const teardownTabs = initTabPanel(".c-tabs");
  // Saat halaman berganti: teardownTabs();
  ```

- **Mengapa ini lebih baik**:
  Caching referensi DOM menghilangkan penelusuran pohon berulang. Pembersihan event berbasis `AbortSignal` menyelesaikan masalah kebocoran memori tanpa mengharuskan developer menyimpan referensi fungsi callback anonim untuk dipanggil satu per satu di `removeEventListener`.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Audit seluruh `addEventListener('scroll', ...)` atau `'touchmove'`: selalu sertakan opsi `{ passive: true }` agar peramban tidak memblokir kelancaran animasi gulir layar.
- [ ] **Langkah 2**: Berhenti mencari elemen dengan `document.querySelector` di dalam loop atau di dalam tubuh handler klik; cari elemen di level modul luar dan gunakan variabel referensi cache.
- [ ] **Langkah 3**: Buka DevTools -> tab **Memory** -> ambil _Heap Snapshot_ -> cari kata kunci "Detached" untuk memverifikasi tidak ada node DOM mengambang yang tertahan oleh closure listener yang lupa dilepas.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Tidak ada pemanggilan `querySelector` berulang pada setiap aksi klik, dan seluruh listener dapat dicopot bersih menggunakan `AbortController`**.

> [!WARNING]
> **Batas Kepastian**
>
> Memilih antara `querySelector` (menggunakan parser CSS) vs metode lama `getElementById` (pencarian langsung via hash table internal ID): `getElementById` secara mikrodetik sedikit lebih cepat, namun `querySelector` jauh lebih fleksibel dan standar di industri modern. Perbedaan performanya tidak signifikan untuk 99% aplikasi web.
