// 1. Ambil elemen yang dibutuhkan
// ambil elemen select status berdasarkan ID-nya
const selectEl = document.querySelector("#select-status");
// ambil tombol bandingkan berdasarkan ID-nya
const bandingBtn = document.querySelector("#btn-banding");
// ambil elemen output loose equality berdasarkan ID-nya
const looseOut = document.querySelector("#loose-out");
// ambil elemen output strict equality berdasarkan ID-nya
const strictOut = document.querySelector("#strict-out");

// 2. Pasang aksi ketika tombol diklik
bandingBtn.addEventListener("click", () => {
  // Ambil value dari opsi yang dipilih
  // Ingat*: value dari elemen form/HTML selalu bertipe string, contohnya '0'.
  const selectedValue = selectEl.value;

  // Siapkan nilai pembanding berupa angka murni (tipe number)
  const targetAngka = 0;

  // --- Pengujian dengan loose equality (==) ---
  // Catatan*: loose equality (==) melakukan type coercion (konversi implisit).
  // String '0' diubah menjadi number 0 sebelum dibandingkan, sehingga '0' == 0 menghasilkan TRUE!
  const isLooseEqual = selectedValue == targetAngka;

  // Tampilkan hasil loose equality ke browser dengan warna merah
  looseOut.textContent = `${isLooseEqual} (String dianggap sama dengan Number karena tipe data diabaikan)`;
  looseOut.style.color = "#cc0000";

  // --- Pengujian dengan strict equality (===) ---
  // Catatan*: strict equality (===) membandingkan tipe data DAN nilainya tanpa konversi.
  // Karena tipenya berbeda (string vs number), perbandingan langsung menghasilkan FALSE!
  const isStrictEqual = selectedValue === targetAngka;

  // Tampilkan hasil strict equality ke browser dengan warna hijau
  strictOut.textContent = `${isStrictEqual} (Tepat! Tipe data berbeda: string !== number)`;
  strictOut.style.color = "#008800";
});
