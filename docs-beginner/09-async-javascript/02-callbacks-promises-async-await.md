---
title: "Panduan Pemula: Memahami Promise dan async/await di JavaScript"
tags:
  - javascript
  - first-principles
  - roadmap-js/09-async-javascript
level: beginner
official_docs_url:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
---

# Panduan Pemula: Memahami Promise dan async/await di JavaScript

> [!ABSTRACT] Inti Konsep (The Ground Truth)
> Mengambil data lewat internet membutuhkan waktu. **`Promise`** adalah sebuah "surat janji" bahwa data akan datang (sukses atau gagal), sedangkan **`async/await`** adalah cara modern paling nyaman untuk membaca surat janji tersebut seolah-olah seperti kode biasa dari atas ke bawah.

---

## 1. Analogi Logis: Pager Getar Antrean Makanan

Bayangkan Anda memesan makanan di gerai restoran modern:

- **Menerima Janji (Promise)**:
  Setelah Anda membayar di kasir, kasir memberikan Anda sebuah **alat pager kecil kotak hitam**. Pager ini adalah janji (_Promise_) bahwa makanan Anda sedang diproses di dapur.
- **Tiga Status Pager (Status Promise)**:
  1. **`pending` (Menunggu)**: Pager diam di tangan Anda saat makanan masih dimasak.
  2. **`fulfilled` (Janji Terpenuhi / Sukses)**: Pager bergetar dan berbunyi _Bip-bip!_ tanda makanan siap diambil.
  3. **`rejected` (Janji Batal / Gagal)**: Pelayan datang meminta maaf karena bahan makanan habis.
- **Gaya Modern: `async/await`**:
  Daripada Anda harus menatap pager terus-menerus dengan `.then()` dan `.catch()`, Anda cukup menyuruh asisten Anda:
  _"Tolong tunggu (**`await`**) sampai pager bergetar, lalu bawakan makanannya ke meja saya!"_.

---

## 2. Mengapa JavaScript Berevolusi ke `async/await`? (First Principles)

1. **Menghapus "Neraka Callback" (_Callback Hell_)**:
   Di masa lalu, mengambil data bertahap (ambil user $\to$ ambil postingan $\to$ ambil komentar) membuat kode bergeser ke kanan membentuk segitiga runcing yang sangat sulit dibaca.
2. **Keterbacaan yang Rapi dari Atas ke Bawah**:
   Dengan `async/await`, kode asinkron tampak persis seperti kode biasa.
3. **Menggunakan `try...catch` yang Sudah Dikenal**:
   Jika server internet down atau koneksi putus (_rejected_), Anda bisa menangkapnya menggunakan blok `try...catch` yang ramah tanpa sintaks asing tambahan.

---

## 3. Contoh Praktik Interaktif (HTML + JavaScript)

Mari kita buat pengunduh profil pengguna simulasi yang menggunakan `async/await` lengkap dengan indikator proses (_loading_):

### Berkas 1: `index.html`

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Latihan | async/await dan Promise</title>
    <style>
      .card {
        font-family: sans-serif;
        max-width: 340px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      button {
        padding: 10px;
        cursor: pointer;
        width: 100%;
        margin-bottom: 12px;
      }
      .box {
        padding: 12px;
        border-radius: 6px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        min-height: 48px;
      }
      .loading {
        color: #d97706;
        font-weight: bold;
      }
      .sukses {
        color: #15803d;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <div class="card">
      <h3>Data Profil Server</h3>
      <button type="button" id="btn-muat">
        Muat Profil Pengguna (async/await)
      </button>
      <div id="kotak-profil" class="box">
        Tekan tombol untuk mengambil data...
      </div>
    </div>
  </body>
</html>
```

---

### Berkas 2: `app.js`

```javascript
// 1. Ambil elemen dari HTML
const tombolMuat = document.querySelector("#btn-muat");
// ambil tombol pemuat profil.

const kotakProfil = document.querySelector("#kotak-profil");
// ambil wadah teks penampil profil.

// ================================================================
// SIMULASI PROMISE: Meniru pengunduhan data server selama 2 detik
// ================================================================
function unduhDataDariServer() {
  // buat surat janji (Promise):
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // setelah 2 detik menunggu di latar belakang, tepati janji:
      const dataSukses = {
        nama: "Dewi Lestari",
        kota: "Bandung",
        peran: "UI Designer",
      };
      resolve(dataSukses);
      // kirim data ke pemegang surat janji.
    }, 2000);
  });
}

// ================================================================
// ASYNC / AWAIT: Cara modern membaca data Promise dari atas ke bawah
// ================================================================
async function prosesAmbilProfil() {
  // 1. Beri tahu pengguna bahwa proses sedang berjalan:
  kotakProfil.innerHTML =
    '<span class="loading">⏳ Sedang menghubungi server... Mohon tunggu...</span>';
  tombolMuat.disabled = true; // kunci tombol sementara agar tidak diklik dua kali

  try {
    // 2. AWAIT: Tunggu sampai Promise di atas selesai mengirim data:
    const profil = await unduhDataDariServer();
    // JavaScript berhenti di baris ini selama 2 detik tanpa membuat browser macet!

    // 3. Setelah data tiba, tampilkan ke layar HTML:
    kotakProfil.className = "box sukses";
    kotakProfil.innerHTML = `
      <strong>Nama:</strong> ${profil.nama}<br>
      <strong>Kota:</strong> ${profil.kota}<br>
      <strong>Peran:</strong> ${profil.peran}
    `;
  } catch (error) {
    // Jika koneksi server gagal atau terputus:
    kotakProfil.textContent = `Gagal memuat data: ${error.message}`;
  } finally {
    // Aktifkan kembali tombol di akhir proses:
    tombolMuat.disabled = false;
  }
}

// 2. Pasang aksi pada tombol
tombolMuat.addEventListener("click", () => {
  // Panggil fungsi async saat tombol diklik:
  prosesAmbilProfil();
});
```

---

## 4. Solusi Praktis / Best Practice

1. **Kata kunci `await` HANYA boleh ditulis di dalam fungsi bertanda `async`**:
   Jika Anda menulis `await` di fungsi biasa tanpa kata `async` di depannya, browser akan memunculkan pesan error sintaks.
2. **Selalu bungkus `await` di dalam `try...catch`**:
   Karena jaringan internet bisa putus sewaktu-waktu, selalu bungkus pemanggilan `await` di dalam blok `try...catch` agar aplikasi Anda tidak mogok secara mengejutkan.
3. **Kombinasi `Promise.all()` untuk Kecepatan Tinggi**:
   Jika Anda butuh mengambil 3 data berbeda yang tidak saling menunggu, gunakan `await Promise.all([unduhA(), unduhB(), unduhC()])` agar ketiga data diunduh secara bersamaan sekaligus!

---

## 5. Checklist Praktik Mandiri

- [ ] Buka `index.html` di browser.
- [ ] Klik tombol **"Muat Profil Pengguna"**.
- [ ] Amati pesan berubah menjadi teks kuning: `"⏳ Sedang menghubungi server..."` dan tombol terkunci (_disabled_).
- [ ] Setelah 2 detik berlalu, amati teks profil Dewi Lestari muncul di layar dan tombol kembali aktif.

> [!TIP] Parameter Pemahaman Anda
> Anda sudah paham jika: **Mengerti bahwa `async/await` memudahkan kita menunggu data asinkron dari Promise menggunakan urutan baris kode biasa yang rapi**.

---

## 🎯 Uji Pemahaman Mandiri

1. Apa 3 status mutlak yang bisa dialami oleh sebuah objek `Promise`?
2. Apakah kata kunci `await` membuat seluruh komputer dan tab browser Anda membeku saat menunggu server? Mengapa browser tetap responsif?
