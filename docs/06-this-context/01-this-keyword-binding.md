---
title: "First Principles Deep Dive: Kata Kunci this dan Aturan Binding"
tags: "javascript, first-principles, roadmap-js/06-this-context"
level: intermediate
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this"
---

# First Principles Deep Dive: Kata Kunci this dan Aturan Binding

> [!NOTE]
> **The Ground Truth**
>
> Kata kunci `this` bukanlah pengikatan statis yang terikat pada tubuh fungsi; `this` adalah konteks dinamis yang ditentukan oleh cara fungsi tersebut dipanggil pada titik pemanggilannya (_Call-Site_), kecuali pada Arrow Function yang mewarisinya secara leksikal.

---

## 1. Dekonstruksi Masalah (Membongkar Asumsi)

_Sebelum mengeksekusi, kita pisahkan noise dari masalah inti._

- ❌ **Asumsi/Konvensi Industri**: "`this` selalu merujuk pada fungsi itu sendiri atau objek di mana fungsi tersebut ditulis."
- ✅ **Masalah Sebenarnya (Core Problem)**: Metode objek sering kali dipisahkan dari objek induknya saat dijadikan callback (misal event listener atau timer). Tanpa pemahaman aturan _Call-Site_, referensi konteks objek asal akan terlepas (_lost context_), menyebabkan `this` tiba-tiba bernilai `undefined` atau merujuk ke objek global `window`.

---

## 2. Kebenaran Fundamental (First Principles)

_Elemen dasar berikut berakar pada spesifikasi web / perilaku browser yang tidak terbantahkan:_

1. **Evaluasi Titik Pemanggilan (_Call-Site Evaluation_) dan Tipe Referensi**:
   Saat kita memanggil `user.getNama()`, engine mengevaluasi ekspresi tersebut menjadi spesifikasi internal bernama _Reference Record_. Reference Record mencatat `baseValue` (yaitu objek `user`). Karena ada titik pemanggilan properti, engine menetapkan `this` bernilai `user` (_Implicit Binding_). Jika metode tersebut disimpan ke variabel terpisah (`const fn = user.getNama; fn()`), _Reference Record_ terputus, dan eksekusi jatuh ke aturan default.

2. **Empat Aturan Prioritas Pengikatan `this`**:
   Sesuai spesifikasi ECMA-262, penentuan nilai `this` memiliki urutan hierarki mutlak:
   - **Prioritas 1 (New Binding)**: Dipanggil dengan `new` -> `this` adalah objek baru yang baru saja diinstansiasi.
   - **Prioritas 2 (Explicit Binding)**: Dipanggil via `.call()`, `.apply()`, atau dibungkus `.bind()` -> `this` dipaksa ke objek target.
   - **Prioritas 3 (Implicit Binding)**: Dipanggil melalui properti objek (`obj.method()`) -> `this` adalah objek konteksnya.
   - **Prioritas 4 (Default Binding)**: Dipanggil mandiri (`fn()`) -> `this` bernilai `undefined` pada _Strict Mode_ (atau objek global `window` pada non-strict mode).

3. **Pengecualian Mutlak: Arrow Function**:
   Arrow function **sama sekali tidak memiliki mekanisme pengikatan `this` dinamis**. Nilai `this` di dalam arrow function diselesaikan murni dari rantai leksikal (_Lexical Scope_) tempat fungsi didefinisikan saat kode ditulis.

---

## 3. Rekonstruksi Logis

_Solusi dibangun dari nol berdasarkan Kebenaran Fundamental di atas — bukan dari dogma "best practice"._

- **Pendekatan Optimal**:
  Saat merancang handler event antarmuka atau callback asinkron di dalam metode komponen, gunakan **Arrow Function** untuk mempertahankan konteks instans komponen tanpa perlu memanggil `.bind(this)` berulang-ulang. Pada event handler DOM murni, pahami bahwa browser secara default mengikat `this` ke `event.currentTarget`.

- **Contoh Konkret**:

  ```javascript
  // Skenario: Komponen Tombol Antarmuka Pengguna
  class ToggleButtonComponent {
    constructor(elementId) {
      this.element = document.getElementById(elementId);
      this.isActive = false;

      // Inisialisasi event listener
      this.initEvents();
    }

    initEvents() {
      // ❌ Masalah Kehilangan Konteks (Metode biasa sebagai callback):
      // this.element.addEventListener('click', this.handleClick);
      // Di dalam handleClick biasa, 'this' akan mengarah ke elemen DOM tombol, BUKAN class ini!

      // ✅ Rekonstruksi Aman dengan Arrow Function (Mempertahankan Leksikal 'this'):
      this.element.addEventListener("click", (event) => {
        this.handleClick(event);
      });
    }

    handleClick(event) {
      // 'this' dijamin 100% merujuk ke instans ToggleButtonComponent
      this.isActive = !this.isActive;
      this.updateUI();
    }

    updateUI() {
      this.element.setAttribute("aria-pressed", String(this.isActive));
      console.log(`Status komponen: ${this.isActive ? "Aktif" : "Non-aktif"}`);
    }
  }
  ```

- **Mengapa ini lebih baik**:
  Mengetahui bahwa arrow function mewarisi `this` secara leksikal memutus rantai masalah _this-binding loss_. Penggunaan pembungkus arrow function pada listener DOM memberikan akses ganda yang jelas: objek komponen diakses via `this`, sedangkan elemen HTML diakses via parameter eksplisit `event.currentTarget`.

---

## 4. Strategi Eksekusi (Bottom-Up Actions)

_Checklist teknis untuk mewujudkan pendekatan optimal, disesuaikan skill level saya saat ini:_

- [ ] **Langkah 1**: Uji di Console: buat objek `{ val: 42, getVal() { return this.val; } }`. Panggil `obj.getVal()` (hasil: 42), lalu simpan ke variabel `const f = obj.getVal; f()` (hasil: `undefined` atau TypeError) untuk membuktikan hilangnya implicit binding.
- [ ] **Langkah 2**: Aktifkan `'use strict';` di setiap file (atau gunakan ES Modules yang otomatis berstatus strict mode) agar pemanggilan fungsi default mengembalikan `undefined` ketimbang mencemari `window`.
- [ ] **Langkah 3**: Saat membutuhkan delegasi event DOM, gunakan parameter eksplisit `event.target` (elemen yang diklik) dan `event.currentTarget` (elemen pemilik listener) alih-alih mengandalkan `this`.

> [!TIP]
> **Parameter Kesuksesan (Success Metric)**
>
> Topik ini selesai dieksekusi dengan benar jika: **Tidak ada lagi error `TypeError: Cannot read properties of undefined (reading '...')` saat sebuah metode objek dioper sebagai callback**.

> [!WARNING]
> **Batas Kepastian**
>
> Kebiasaan mengikat konteks di konstruktor class (`this.fn = this.fn.bind(this)`) adalah **pola warisan dari era React Class Component awal**. Di JavaScript modern, penggunaan _arrow method_ di body class (`fn = () => {}`) atau inline arrow wrapper adalah pendekatan yang jauh lebih dominan dan ringkas.
