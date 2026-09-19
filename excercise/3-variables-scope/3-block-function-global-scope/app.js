// GLOBAL SCOPE
const namaAplikasi = "Portal Belajar Ari";
// 1. Ambil element HTML yang dibutuhkan
const judulGlobal = document.querySelector("#judul-global");
const pesanPrivat = document.querySelector("#pesan-privat");
const btnBaca = document.querySelector("#btn-baca");
// 2. Tampilkan variable global ke layar langsung
judulGlobal.textContent = namaAplikasi;
// 3. Tambahkan aksi saat tombol di-click
btnBaca.addEventListener("click", () => {
  // FUNCTION SCOPE
  const kodeRahasia = "XYZ-999";
  if (true) {
    // BLOCK SCOPE
    const pesanKamar = `Akses diberikan ke ${namaAplikasi}`;
    pesanPrivat.textContent = `${pesanKamar} | Kode: ${kodeRahasia}`;
  }
  // ERROR! Di luar blok if.
  // jika mencoba membaca 'pesanKamar' di luar BLOCK SCOPE:
  console.log(pesanKamar);
  // Hasilnya: ReferenceError: pesanKamar is not defined setelah menekan tombol 'btnBaca'
});

// ERROR! Di luar blok function.
// Jika mencoba membaca 'kodeRahasia' di luar FUNCTION SCOPE:
console.log(kodeRahasia);
// Hasilnya: ReferenceError: kodeRahasia is not defined
// Akan langsung muncul error saat halaman dimuat tanpa klik tombol 'btnBaca;
