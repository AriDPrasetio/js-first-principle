// 1. Buat function declaration, expression, dan arrow function
// A. FUNCTION DECLARATION
function hitungDiskonDeclaration(harga) {
  return harga * 0.9;
}
// B. FUNCTION EXPRESSION
const hitungDiskonExpression = function (harga) {
  return harga * 0.8;
};
// C. ARROW FUNCTION
const hitungDiskonArrow = (harga) => harga * 0.7;
// 2. Hubungkan ke elemen HTML
const inputHarga = document.querySelector("#input-harga");
const kotakHasil = document.querySelector("#kotak-hasil");
// 3. Tambahkan aksi ke "#btn-dec" saat di-klik
document.querySelector("#btn-dec").addEventListener("click", () => {
  // NOTE*: 'input.value' selalu bertipe "string"!
  // 3.1. Konversi tipe data secara eksplisit ke Number()
  const harga = Number(inputHarga.value);
  // 3.2. Update teks yang di tampilkan di browser
  kotakHasil.textContent = `Declaration (10%): Rp${hitungDiskonDeclaration(harga).toLocaleString("id-ID")}`;
});
// 4. Tambahkan aksi ke "#btn-exp" saat di-klik
document.querySelector("#btn-exp").addEventListener("click", () => {
  // 4.1. Konversi tipe data secara eksplisit ke Number()
  const harga = Number(inputHarga.value);
  // 4.2. Update teks yang di tampilkan di browser
  kotakHasil.textContent = `Expression (20%): Rp${hitungDiskonExpression(harga).toLocaleString("id-ID")}`;
});
// 5. Tambahkan aksi ke "#btn-arrow" saat di-klik
document.querySelector("#btn-arrow").addEventListener("click", () => {
  // 5.1. Konversi tipe data secara eksplisit ke Number()
  const harga = Number(inputHarga.value);
  // 5.2. Update teks yang di tampilkan di browser
  kotakHasil.textContent = `Arrow Function (30%): Rp${hitungDiskonArrow(harga).toLocaleString("id-ID")}`;
});
