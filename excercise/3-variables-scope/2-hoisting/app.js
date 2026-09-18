// ============================================================
// BUKTI HOISTING FUNGSI NORMAL:
// Memanggil fungsi jalankanAplikasi() di baris PALING ATAS,
// padahal deklarasi fungsinya baru dituli di bagian BAWAH!
// =============================================================

// jalankan fuction 'jalankanAplikasi', ini berjalan normal karena function declaration di-hoist
jalankanAplikasi();

// =============================================================
// DEKLARASI FUNGSI FORMAL (DIANGKAT LENGKAP OLEH ENGINE)
// =============================================================

// deklarasi function 'jalankanAplikasi' yang berisi logika utama program
function jalankanAplikasi() {
  // ambil element tombol sapa berdasarkan ID-nya, simpan ke variable sapaBtn
  const sapaBtn = document.querySelector("#btn-sapa");
  // ambil element tombol uji TDZ berdasarkan ID-nya, simpan ke variable tdzBtn
  const tdzBtn = document.querySelector("#btn-tdz");
  // ambil element penampil pesan berdasarkan ID-nya, simpan ke variable pesanEl
  const pesanEl = document.querySelector("#teks-pesan");

  // saat sapaBtn di-click, jalankan fungsi berikut:
  sapaBtn.addEventListener("click", () => {
    // perbarui teks di dalam element 'pesanEl' dengan hasil dari pemanggilan function 'buatSalam'.
    pesanEl.textContent = buatSalam("Kyo");
  });

  // saat tdzBtn di-click, jalankan fungsi berikut:
  tdzBtn.addEventListener("click", () => {
    // CATAT 1 (var): var di-hoist tapi hanya dengan nilai 'undefined'
    // cetak nilai dari variable 'namaLama' sebelum baris deklarasinya untuk membuktikan 'var' berisi undefined.
    console.log("Nilai var sebelum deklarasi:", namaLama);
    // buat variable 'namaLama' menggunakan 'var' dan isi dengan string "Kyo (var)".
    var namaLama = "Kyo (var)";

    // CATAT 2 (let): 'let' berada di TDZ sebellum deklarasi.
    // coba eksekusi block kode berikut, tangkap error jika ada:
    try {
      // cetak nilai dari variable 'namaBaru' sebelum dideklarasikan untuk memicu error TDZ.
      console.log("Mencoba membaca let sebelum deklarasi:", namaBaru);
    } catch (err) {
      // jika terjadi error TDZ, tamplikan pesan error ke console
      console.log("Alarm TDZ berbunyi:", err.message);
    }
    // buat variable 'namaBaru' menggunakan let dan isi dengan string "Ari (let)".
    let namaBaru = "Ari (let)";

    // perbarui teks di dalam element pesanEl untuk mengindikasikan uji coba selesai
    pesanEl.textContent =
      "Uji coba selesai! Buka DevTools (F12) untuk melihat perbandingannya.";
  });
}

// deklarasi function 'buatSalam' yang menerima parameter namaPengguna untuk memformat teks salam
function buatSalam(namaPengguna) {
  // kembalikan string sapaan yang digunakan dengan argumen 'namaPengguna'
  return `Halo, ${namaPengguna}! Selamat datang di aplikasi.`;
}
