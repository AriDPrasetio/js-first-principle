// 1. Ambil elemen yang dibutuhkan
const inputUsia = document.querySelector("#input-usia");
const cekBtn = document.querySelector("#btn-cek");
const nilaiOut = document.querySelector("#nilai-output");
const tipeOut = document.querySelector("#tipe-output");
// 2. Pasang aksi ketika tombol diklik
cekBtn.addEventListener("click", () => {
  // saat tombol diklik, jalankan perintah berikut ini:
  const nilaiMentah = inputUsia.value;
  // a. ambil value yang tertulis di kotak input.
  // Catatan*: meskipun input bertipe number, hasilnya akan selalu string!
  const hasilTipe = typeof nilaiMentah;
  // b. gunakan operator "typeof" untuk memindai tipe data dari variable nilaiMentah.
  nilaiOut.textContent = `${nilaiMentah}`;
  // c. tampilkan nilai mentah ke layar
  tipeOut.textContent = hasilTipe;
  // d. tampilkan hasil deteksi typeof ke layar
  tipeOut.style.color = "red";
  // e. beri warna merah sebagai bukti visual bahwa input HTML masih berupa string teks.
});
