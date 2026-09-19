// 1. Ambil elemen yang dibutuhkan
const btnExpression = document.querySelector("#btn-expression");
const btnStatement = document.querySelector("#btn-statement");
const kotakHasil = document.querySelector("#kotak-hasil");

// 2. PENGUJIAN EXPRESSION:
// Ternary operator adalah EXPRESSION karena menghasilkan nilai yang langsung bisa disimpan di variable 'statusToko'
btnExpression.addEventListener("click", () => {
  const jamSekarang = 14;
  // sisi kanan tanda '=' mengevaluasi nilai secara langsung:
  const statusToko =
    jamSekarang >= 9 && jamSekarang <= 17 ? "TOKO BUKA" : "TOKO TUTUP";
  kotakHasil.innerHTML = `
    <strong>Hasil Expression (Ternary):</strong><br>
    Nilai langsung disimpan ke variable: <code>"${statusToko}"</code>`;
});

// 3. PENGUJIAN STATEMENT:
// 'if...else' adalah STATEMENT. Ia tidak menghasilkan nilai langsung, melainkan menjalankan blok instruksi di dalamnya.
btnStatement.addEventListener("click", () => {
  const jamSekarang = 20;
  let statusToko = ""; // Siapkan variable penampung terlebih dahulu

  // Statement mengendalikan ke mana alur logika harus melompat:
  if (jamSekarang >= 9 && jamSekarang <= 17) {
    statusToko = "TOKO BUKA";
  } else {
    statusToko = "TOKO TUTUP";
  }

  kotakHasil.innerHTML = `
    <strong>Hasil Statement (if/else):</strong><br>
    Instruksi dijalankan berurutan: <code>"${statusToko}"</code>`;
});
