---
title: "First Principles Deep Dive: Event Delegation dan Event Bubbling"
tags:
  - javascript
  - first-principles
  - roadmap-js/08-dom-events
level: intermediate
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling
  - https://dom.spec.whatwg.org/#dispatching-events
  - https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
---

# First Principles Deep Dive: Event Delegation dan Event Bubbling

> [!NOTE]
> **The Ground Truth**
>
> Event di DOM merambat melalui pohon dokumen dalam tiga fase fisik (Capturing $\to$ Target $\to$ Bubbling); _Event Delegation_ adalah pola arsitektur yang memanfaatkan fase bubbling untuk menangani interaksi ratusan elemen anak hanya melalui satu listener tunggal pada elemen induk (_$O(1)$ memory allocation_).

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "Setiap kali kita merender elemen tombol atau item daftar baru, kita wajib memasang `addEventListener('click')` langsung pada masing-masing elemen tersebut."
- ✅ **Masalah Sebenarnya (Core Problem)**: Memasang 1.000 listener pada 1.000 item daftar produk memboroskan ribuan alokasi memori fungsi closure dan mewajibkan pendaftaran ulang setiap kali ada item baru yang ditambahkan via API. Karena peramban secara otomatis meniupkan event ke atas (_bubbling_) hingga ke puncak dokumen, satu listener di induk sudah cukup untuk menangkap semuanya.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Tiga Fase Perambatan Event (WHATWG DOM §2.9 - Dispatch Phase)**:
   Setiap interaksi pengguna (misal klik mouse) memicu siklus perambatan terstandarisasi:
   - **Fase 1 (Capture Phase)**: Sinyal event meluncur turun dari puncak pohon dokumen (`window` $\to$ `document` $\to$ `<body>`) menuju elemen target.
   - **Fase 2 (Target Phase)**: Sinyal tiba pada elemen paling dalam yang diklik pengguna.
   - **Fase 3 (Bubbling Phase)**: Sinyal memantul dan merambat naik (_bubble up_) menembus setiap elemen leluhur (_ancestor nodes_) hingga kembali ke `window`. Sebagian besar event antarmuka bergelembung, kecuali beberapa event khusus seperti `focus`, `blur`, dan `mouseenter`.

2. **Pembedaan Presisi: `event.target` vs `event.currentTarget`**:
   - `event.target`: Elemen fisik paling spesifik yang diklik pengguna (misal ikon `<span>` atau tag `<strong>` di dalam sebuah tombol).
   - `event.currentTarget`: Elemen pemilik sah tempat `addEventListener` tersebut dipasang (yaitu kontainer induk).

3. **Peran Metode Penelusuran `Element.prototype.closest()`**:
   Karena `event.target` sering kali berupa elemen anak terkecil (seperti teks atau ikon), metode bawaan `target.closest(selector)` adalah algoritma browser resmi untuk memanjat pohon DOM dari elemen target ke atas hingga menemukan kontainer komponen yang kita tuju.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Terapkan pola **Event Delegation**: pasang satu event listener pada elemen pembungkus daftar (`<ul>` atau `<main>`), lalu gunakan `event.target.closest('.c-list__item')` untuk menentukan elemen mana yang berinteraksi. Elemen anak yang ditambahkan secara dinamis di masa depan akan otomatis langsung aktif tanpa perlu kode pendaftaran tambahan sama sekali!

- **Contoh Konkret**:

  ```javascript
  // Skenario: Daftar Belanja Dinamis (1 Listener untuk Ribuan Item)
  const cartContainer = document.querySelector(".c-cart-list");

  // Pasang HANYA 1 listener pada elemen induk kontainer:
  cartContainer.addEventListener("click", (event) => {
    // 1. Panjat pohon dari elemen yang diklik ke tombol aksi terdekat
    const actionButton = event.target.closest("[data-action]");

    // Jika area yang diklik bukan tombol aksi (misal spasi kosong di kontainer), abaikan!
    if (!actionButton || !cartContainer.contains(actionButton)) {
      return;
    }

    // 2. Ambil elemen baris produk pemilik tombol
    const itemRow = actionButton.closest(".c-cart-list__item");
    const itemId = itemRow?.dataset.id;
    const actionType = actionButton.dataset.action;

    // 3. Tangani aksi secara terpusat
    if (actionType === "delete") {
      console.log(`Menghapus produk ID: ${itemId}`);
      itemRow.remove(); // Menghapus elemen tanpa takut memory leak listener!
    } else if (actionType === "increment") {
      console.log(`Menambah kuantitas produk ID: ${itemId}`);
    }
  });

  // Simulasi penambahan item dinamis di masa depan (Otomatis langsung berfungsi!):
  const newItem = document.createElement("li");
  newItem.className = "c-cart-list__item";
  newItem.dataset.id = "999";
  newItem.innerHTML = `
    <span>Barang Baru Ditambahkan</span>
    <button type="button" data-action="delete">Hapus</button>
  `;
  cartContainer.appendChild(newItem);
  ```

- **Mengapa ini lebih baik**:
  Penghematan memori dari $O(N)$ menjadi $O(1)$. Saat baris produk dihapus (`itemRow.remove()`), tidak ada event listener mengambang yang tertinggal karena listener menempel pada kontainer induk yang tetap hidup.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Audit kode daftar/tabel: hapus perulangan `items.forEach(el => el.addEventListener(...))` dan gantikan dengan satu listener pada kontainer induknya.
- [ ] **Langkah 2**: Selalu gunakan `event.target.closest('selector')` di baris pertama delegasi untuk mengatasi klik pada elemen bersarang (ikon SVG atau tag format teks di dalam tombol).
- [ ] **Langkah 3**: Gunakan `event.stopPropagation()` hanya jika benar-benar ada alasan arsitektur spesifik (misal menghentikan klik pada modal pop-up agar tidak memicu penutup latar belakang), jangan gunakan secara sembarangan karena akan mematikan sistem analitik atau delegasi di tingkat atas.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Elemen baru yang ditambahkan ke DOM secara dinamis dapat langsung merespons aksi klik tanpa perlu mendaftarkan listener baru secara manual**.

> [!WARNING]
> **Batas Kepastian**
>
> Memasang delegasi di tingkat paling atas (`document.body`) secara berlebihan untuk semua komponen aplikasi dapat menyebabkan overhead pemeriksaan selektor CSS di setiap klik. **Praktik terbaik First Principles adalah memasang delegasi pada kontainer komponen terdekat**, bukan langsung pada objek `document`.
