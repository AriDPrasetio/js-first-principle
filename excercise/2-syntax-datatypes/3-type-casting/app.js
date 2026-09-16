// 1. Ambil elemen yang dibutuhkan
// ambil elemen kotak input kuantitas berdasarkan ID-nya
const qtyInput = document.querySelector("#qty-input");
// ambil tombol hitung berdasarkan ID-nya
const calcBtn = document.querySelector("#btn-calc");
// ambil elemen penampil bug coercion berdasarkan ID-nya
const bugEl = document.querySelector("#coercion-bug");
// ambil elemen penampil perbaikan conversion berdasarkan ID-nya
const fixedEl = document.querySelector("#conversion-fixed");

// 2. Pasang aksi ketika tombol diklik
// saat tombol diklik, jalankan perintah di dalam blok ini:
calcBtn.addEventListener("click", () => {
  // a. ambil input value
  // Catatan*: nilainya bertipe string, contohnya string "3"
  const inputVal = qtyInput.value;

  // b. buat variable tipe number dengan value 2
  const bonus = 2;

  // --- Masalah*: Implicit Coercion ---
  // c. tambahkan input value dengan bonus
  // Catatan*: karena inputVal bertipe string "3", operator '+' malah menyambung teks menjadi "3" + 2 = "32"
  const buggyResult = inputVal + bonus;

  // d. tampilkan hasil bug ke layar
  bugEl.textContent = `Hasil Coercion: "${inputVal}" + ${bonus} = ${buggyResult} item`;

  // --- Solusi*: Explicit Conversion ---
  // gunakan fungsi "Number()" untuk mengubah string secara eksplisit menjadi tipe number
  const angkaMurni = Number(inputVal);

  // Validasi: cek jika input kosong atau bukan angka yang valid
  // Catatan*: inputVal.trim() === "" diperlukan karena di JS Number("") menghasilkan angka 0, bukan NaN!
  if (inputVal.trim() === "" || Number.isNaN(angkaMurni)) {
    // jika input tidak valid, tampilkan pesan error
    fixedEl.textContent = "Error: Input bukan angka yang valid!";
    // beri warna teks merah sebagai penanda error
    fixedEl.style.color = "#cc0000";
    // hentikan eksekusi fungsi lebih lanjut
    return;
  }

  // hitung hasil yang benar menggunakan tipe data number murni
  const correctResult = angkaMurni + bonus;

  // tampilkan hasil perhitungan yang benar ke layar
  fixedEl.textContent = `Hasil Conversion: ${inputVal} + ${bonus} = ${correctResult} item`;
  fixedEl.style.color = "";
});

