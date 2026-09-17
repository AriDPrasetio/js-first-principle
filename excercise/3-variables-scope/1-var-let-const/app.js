// 1. Ambil elemen yang dibutuhkan
// Catatan*: deklarasi dengan 'const' (karena elemen HTML tidak pernah diganti wadahnya)
const skorDisplay = document.querySelector("#skor-display");
// ambil elemen penampil skor berdasarkan ID-nya.
const tambahBtn = document.querySelector("#btn-tambah");
// ambil tombol "tambah" berdasarkan ID-nya.
const ujiBocorBtn = document.querySelector("#btn-uji-bocor");
// ambil tombol "uji bocor" berdasarkan ID-nya.
const infoHasil = document.querySelector("#info-hasil");
// ambil elemen info hasil berdasarkan ID-nya.

// 2. Deklarasi nilai skor
// Catatan*: gunakan 'let' (karena nilai skor akan terus bertambah)
// inisialisasi variabel skor dengan nilai awal 0.
let nilaiSkor = 0;

// 3. Pasang aksi ketika tombol diklik
// saat tombol tambah diklik, jalankan perintah berikut ini:
tambahBtn.addEventListener("click", () => {
  // tambahkan 1 ke nilai skor saat ini.
  nilaiSkor = nilaiSkor + 1;
  // perbarui tampilan skor di layar dengan nilai terbaru.
  skorDisplay.textContent = nilaiSkor;
});

// 4. Demonstrasi nyata: kebocoran var vs isolasi let
// saat tombol uji bocor diklik, jalankan perintah berikut ini:
ujiBocorBtn.addEventListener("click", () => {
  // masuk ke dalam blok if (selalu true, hanya untuk membuat block scope).
  if (true) {
    // Catatan*: var tidak mengenal block scope — variabel ini akan bocor keluar blok if.
    var pesanBocor = "Saya dibuat di dalam if dengan var!";
    // Catatan*: let terikat ketat pada blok ini — tidak bisa diakses dari luar.
    let pesanAman = "Saya dibuat di dalam if dengan let!";
  }
  // DI LUAR BLOCK if:
  // var bocor — masih bisa diakses di sini meskipun dideklarasikan di dalam blok.
  console.log("di luar if:", pesanBocor);

  try {
    // coba akses variabel let di luar bloknya — ini akan melempar ReferenceError.
    console.log("Di luar if:", pesanAman);
  } catch (error) {
    // tangkap ReferenceError sebagai bukti bahwa let berhasil mengisolasi variabel.
    console.log("let berhasil mengisolasi variabel:", error.message);
  }

  // perbarui teks info hasil di layar dan arahkan user membuka DevTools.
  infoHasil.textContent = `var bocor keluar blok: "${pesanBocor}". Buka console (F12) untuk melihat bukti isolasi let.`;
});
