// 1. Ambil elemen yang dibutuhkan
const qtyInput = document.querySelector("#qty-input");
const calcBtn = document.querySelector("#btn-calc");
const bugEl = document.querySelector("#coercion-bug");
const fixedEl = document.querySelector("#conversion-fixed");
// 2. Pasang aksi ketika tombol diklik
calcBtn.addEventListener("click", () => {
  // saat tombol diklik, jalankan perintah di dalam blok ini:
  const inputVal = qtyInput.value;
  // a. ambil input value.
  // Catatan*: nilanya bertipe string, contohnya string "3".
  const bonus = 2;
  // b. buat variable tipe number dengan value 2.

  // --- Masalah*: Implicit Coercion ---
  const buggyResult = inputVal + bonus;
  // c. tambahkan input value dengan bonus.
  // Catatan*: karena inputVal bertipe string "3", tanda '+' malah menyambung teks menjadi "3" + 2 = "32".
  bugEl.textContent = `Hasil Coercion: "${inputVal}" + ${bonus} = ${buggyResult} item`;
  // d. tampilkan hasil ke layar.

  // --- Solusi*: Explicit Conversion ---
  const angkaMurni = Number(inputVal);
  // gunakan fungsi "Number()" untuk mengubah string secara explicit menjadi tipe number.
  // Validasi: cek jika input kosong atau bukan angka yang valid
  // Catatan*: inputVal.trim === "" diperlukan karena di JS Number("") menghkasilkan angka 0, bukan NaN!
  if (inputVal.trim() === "" || Number.isNaN(angkaMurni)) {
    // a. jika "angkaMurni" bukan angka yang valid:
    fixedEl.textContent = "Error: Input bukan angka yang valid!";
    // b. tampilkan pesan error
    fixedEl.style.color = "#cc0000";
    // c. beri warna merah
    return;
    // d. hentikan eksekusi kode di sini.
  }

  const correctResult = angkaMurni + bonus;
  fixedEl.textContent = `Hasil Conversion: ${inputVal} + ${bonus} = ${correctResult} item`;
});
