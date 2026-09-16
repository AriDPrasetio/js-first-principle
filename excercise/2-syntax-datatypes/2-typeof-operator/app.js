// 1. Ambil elemen yang dibutuhkan
// ambil elemen kotak input usia berdasarkan ID-nya
const inputUsia = document.querySelector("#input-usia");
// ambil tombol cek berdasarkan ID-nya
const cekBtn = document.querySelector("#btn-cek");
// ambil elemen penampil nilai output berdasarkan ID-nya
const nilaiOut = document.querySelector("#nilai-output");
// ambil elemen penampil tipe output berdasarkan ID-nya
const tipeOut = document.querySelector("#tipe-output");

// 2. Pasang aksi ketika tombol diklik
// saat tombol cek diklik, jalankan perintah berikut:
cekBtn.addEventListener("click", () => {
  // a. ambil value yang tertulis di kotak input
  // Catatan*: meskipun input bertipe number di HTML, nilainya di JS selalu berupa string!
  const nilaiMentah = inputUsia.value;

  // b. gunakan operator "typeof" untuk memindai tipe data dari variable nilaiMentah
  const hasilTipe = typeof nilaiMentah;

  // c. tampilkan nilai mentah ke layar
  nilaiOut.textContent = `${nilaiMentah}`;

  // d. tampilkan hasil deteksi typeof ke layar
  tipeOut.textContent = hasilTipe;

  // e. beri warna merah sebagai bukti visual bahwa input HTML masih berupa string teks
  tipeOut.style.color = "red";
});

