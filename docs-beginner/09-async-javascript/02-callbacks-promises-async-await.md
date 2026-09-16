---
title: "Panduan Pemula: Evolusi Asinkron (Callback, Promise, dan async/await) di JavaScript"
tags: "javascript, first-principles, roadmap-js/09-async-javascript"
level: beginner
official_docs_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises"
---

# Panduan Pemula: Evolusi Asinkron (Callback, Promise, dan async/await) di JavaScript

> [!NOTE]
> **Inti Konsep (The Ground Truth)**
>
> Mengambil data lewat internet membutuhkan waktu tunggu. Sejarah JavaScript berevolusi melalui 3 generasi penanganan asinkron: dari **Callback** (rentan segitiga bersarang / *Callback Hell*), ke **Promise** (surat janji dengan status *pending*, *fulfilled*, *rejected*), hingga puncaknya pada **`async/await`** (gaya modern yang membuat kode asinkron terbaca rapi dari atas ke bawah seolah-olah kode biasa).

---

## 1. Analogi Logis: Tiga Era Menunggu Pesanan Makanan

Bayangkan cara restoran melayani pesanan Anda sepanjang sejarah:

- **Era 1: Surat Berantai / Titip Pesan (Callback)**:
  Anda memesan makanan, lalu menitipkan catatan nomor telepon: _"Telepon saya jika mie matang. Dari telepon itu, telepon tukang ojek. Dari telepon tukang ojek, telepon satpam rumah..."_. Surat berantai yang bertumpuk ini sangat rumit dan mudah kacau di tengah jalan.
- **Era 2: Pager Getar Restoran (Promise)**:
  Kasir modern memberi Anda sebuah **alat pager kecil (Promise)**.
  Pager ini memiliki 3 status kepastian:
  1. `pending`: Pager diam di meja Anda (makanan sedang dimasak).
  2. `fulfilled` (Sukses): Pager bergetar dan bunyi _Bip!_ (fungsi `resolve()` dipanggil di dapur).
  3. `rejected` (Gagal): Pager menyala merah karena bahan baku habis (fungsi `reject()` dipanggil).
  Anda mendengarkannya dengan `.then(makanan => ...)` dan `.catch(error => ...)`.
- **Era 3: Asisten Pribadi Pintar (`async/await`)**:
  Daripada Anda harus menatap pager terus-menerus, Anda memiliki asisten pribadi. Anda cukup berkata dengan santai:
  _"Tolong tunggu (**`await`**) sampai makanan datang, lalu letakkan di meja saya"_. Jika makanan gagal datang, asisten otomatis menangani masalahnya di blok `catch`.

---

## 2. Mengapa JavaScript Berevolusi? (First Principles)

### A. Tiga Generasi Penanganan Kode Asinkron

#### 1. Generasi Pertama: Callback
Fungsi asinkron lama menerima fungsi lain sebagai argumen penutup:
```javascript
// ❌ Bahaya "Callback Hell" (Pyramid of Doom):
ambilDataUser(id, (user) => {
  ambilPostingan(user.id, (postingan) => {
    ambilKomentar(postingan[0].id, (komentar) => {
      // Semakin menjorok ke kanan dan penanganan error sangat sulit:
      console.log(komentar);
    });
  });
});
```

#### 2. Generasi Kedua: Promise (ES6)
Objek Promise merapikan nesting callback menjadi rantai datar (*chaining*):
```javascript
// ✅ Lebih rapi dengan Promise chaining:
ambilDataUser(id)
  .then((user) => ambilPostingan(user.id))
  .then((postingan) => ambilKomentar(postingan[0].id))
  .then((komentar) => console.log(komentar))
  // 1 catch untuk menangani error dari semua tahap di atas:
  .catch((error) => console.error("Terjadi error:", error));
```

#### 3. Generasi Ketiga: `async` / `await` (ES2017)
*Syntactic sugar* (penyederhana sintaks) di atas Promise. Di balik layar, mesin tetap memakai Promise, tetapi mata manusia membacanya secara alami dari atas ke bawah:
```javascript
// 🚀 Paling intuitif & modern:
async function muatDataLengkap(id) {
  try {
    const user = await ambilDataUser(id);
    const postingan = await ambilPostingan(user.id);
    const komentar = await ambilKomentar(postingan[0].id);
    console.log(komentar);
  } catch (error) {
    console.error("Gagal mengambil data:", error.message);
  }
}
```

### B. Anatomi Pembuatan Promise: Peran `resolve` dan `reject`
Saat membuat janji kustom, Anda memberikan dua kendali fungsi:
$$\text{new Promise}((\text{resolve}, \text{reject}) \Rightarrow \{ \dots \})$$
- Panggil **`resolve(data)`**: Mengubah status Promise dari `pending` menjadi **`fulfilled`** dan mengirimkan data hasil sukses.
- Panggil **`reject(error)`**: Mengubah status Promise dari `pending` menjadi **`rejected`** dan memicu lompatan ke blok penanganan error (`catch`).

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat simulator pengunduh data pengguna yang mendukung **simulasi berhasil** dan **simulasi gagal** untuk melihat bagaimana `resolve`, `reject`, dan blok `try...catch` bekerja:

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | Evolusi Asinkron & async/await</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 360px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      .btn-group {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      button {
        flex: 1;
        padding: 10px;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-weight: bold;
      }
      .btn-sukses {
        background: #0284c7;
        color: white;
        border: none;
      }
      .btn-gagal {
        background: #f43f5e;
        color: white;
        border: none;
      }
      .box {
        padding: 12px;
        border-radius: 6px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        min-height: 60px;
      }
      .loading {
        color: #d97706;
        font-weight: bold;
      }
      .sukses {
        color: #166534;
        background: #f0fdf4;
        border-color: #bbf7d0;
      }
      .error {
        color: #991b1b;
        background: #fef2f2;
        border-color: #fecaca;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Data Profil Server</h3>
      <div class="btn-group">
        <button type="button" id="btn-sukses" class="btn-sukses">Muat Sukses</button>
        <button type="button" id="btn-gagal" class="btn-gagal">Simulasi Gagal</button>
      </div>
      <div id="kotak-profil" class="box">Tekan salah satu tombol untuk simulasi request...</div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen dari HTML
const tombolSukses = document.querySelector("#btn-sukses");
const tombolGagal = document.querySelector("#btn-gagal");
const kotakProfil = document.querySelector("#kotak-profil");

// ================================================================
// PEMBUATAN PROMISE: Meniru request jaringan selama 1.5 detik
// Memperlihatkan kapan resolve() dan kapan reject() dipanggil
// ================================================================
function requestServerSimulasi(harusSukses) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (harusSukses) {
        // Status Promise berubah menjadi FULFILLED
        resolve({
          nama: "Dewi Lestari",
          kota: "Bandung",
          peran: "Frontend Engineer",
        });
      } else {
        // Status Promise berubah menjadi REJECTED
        reject(new Error("Koneksi ke server timeout (504 Gateway Error)"));
      }
    }, 1500);
  });
}

// ================================================================
// KONSUMSI MODERN: async / await dengan try...catch...finally
// ================================================================
async function jalankanPengunduhan(modeSukses) {
  // 1. Set indikator loading
  kotakProfil.className = "box loading";
  kotakProfil.textContent = "⏳ Menghubungi server... Mohon tunggu...";
  tombolSukses.disabled = true;
  tombolGagal.disabled = true;

  try {
    // 2. AWAIT: Tunggu Promise selesai tanpa memblokir thread UI browser
    const hasil = await requestServerSimulasi(modeSukses);

    // 3. Jika resolve(), kode lanjut ke baris ini:
    kotakProfil.className = "box sukses";
    kotakProfil.innerHTML = `
      <strong>Status:</strong> Berhasil Dimuat!<br>
      <strong>Nama:</strong> ${hasil.nama}<br>
      <strong>Kota:</strong> ${hasil.kota}<br>
      <strong>Peran:</strong> ${hasil.peran}
    `;
  } catch (error) {
    // 4. Jika reject(), eksekusi seketika melompat ke blok catch ini:
    kotakProfil.className = "box error";
    kotakProfil.innerHTML = `
      <strong>Status:</strong> Permintaan Gagal!<br>
      <strong>Pesan:</strong> ${error.message}
    `;
  } finally {
    // 5. FINALLY: Selalu dijalankan entah sukses maupun gagal
    tombolSukses.disabled = false;
    tombolGagal.disabled = false;
  }
}

// 2. Pasang pendengar klik
tombolSukses.addEventListener("click", () => jalankanPengunduhan(true));
tombolGagal.addEventListener("click", () => jalankanPengunduhan(false));
```

---

## 4. Solusi Praktis / Best Practice

1. **Gunakan `async/await` Sebagai Pilihan Utama**:
   Dalam penulisan kode modern, pilihlah sintaks `async/await` daripada merangkai `.then()` panjang, karena lebih mudah dibaca dan di-*debug*.
2. **Kapan Memakai `Promise.all()`?**:
   Jika Anda perlu mengambil 3 API sekaligus yang independen (misal: data profil, data cuaca, dan data kurs dollar):
   ```javascript
   // 🚀 Unduh ketiganya secara paralel, selesai bersamaan!
   const [profil, cuaca, kurs] = await Promise.all([
     ambilProfil(),
     ambilCuaca(),
     ambilKurs(),
   ]);
   ```
3. **Aturan Wajib `await`**:
   Kata kunci `await` hanya sah ditulis di dalam fungsi yang memiliki deklarasi kata `async` di awalnya (atau di *top-level* file ES Module).

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik **"Muat Sukses"** $\to$ amati status loading kuning selama 1.5 detik, kemudian kotak hijau sukses muncul dengan detail profil Dewi Lestari.
- [ ] Klik **"Simulasi Gagal"** $\to$ amati status loading, kemudian kotak merah muncul menangkap pesan error yang dilempar dari `reject()`.
- [ ] Perhatikan bahwa kedua tombol terkunci (_disabled_) selama proses berlangsung dan aktif kembali secara otomatis berkat blok `finally`.

> [!TIP]
> **Parameter Pemahaman Anda**
>
> Anda sudah paham jika: **Memahami 3 evolusi (Callback $\to$ Promise $\to$ async/await), 3 status Promise (pending, fulfilled, rejected), dan bagaimana `await` mempermudah pembacaan data di dalam blok `try...catch`**.

---

## 🎯 Uji Pemahaman Mandiri

1. Mengapa teknik Callback bersarang yang berlebihan dijuluki sebagai "Callback Hell" atau "Pyramid of Doom"?
2. Apa perbedaan peran fungsi `resolve()` dan `reject()` saat kita membuat objek `new Promise(...)`?
3. Mengapa blok `finally` sangat ideal digunakan untuk menonaktifkan status loading atau mengaktifkan kembali tombol submit form?
