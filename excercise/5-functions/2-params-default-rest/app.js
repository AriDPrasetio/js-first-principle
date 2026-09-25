// 1. FUNGSI DEFAULT & REST PARAMETER
function buatUndangan(namaAcara = "Acara Syukuran", ...daftarTamu) {
  let daftarHtml = "<ul>";
  for (const nama of daftarTamu) {
    daftarHtml += `<li>Tamu Terhormat: ${nama}</li>`;
  }
  daftarHtml += "</ul>";
  return `
    <strong>Undangan Resmi: ${namaAcara}</strong>
    <p>Total Tamu Terdaftar: ${daftarTamu.length} orang</p>
    ${daftarHtml}
    `;
}
// 2. AMBIL ELEMENT HTML YANG DIBUTUHKAN
const inputAcara = document.querySelector("#input-acara");
const inputTamu = document.querySelector("#input-tamu");
const btnCetak = document.querySelector("#btn-cetak");
const wadahHasil = document.querySelector("#wadah-hasil");
// 3. TAMBAHKAN AKSI SAAT TOMBOL DI-KLIK
btnCetak.addEventListener("click", () => {
  const teksAcara = inputAcara.value.trim();
  const judulTerkirim = teksAcara === "" ? undefined : teksAcara;
  const teksTamu = inputTamu.value;
  const listTamu = teksTamu ? teksTamu.split(",").map((t) => t.trim()) : [];
  wadahHasil.innerHTML = buatUndangan(judulTerkirim, ...listTamu);
});
