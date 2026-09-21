// DATA DAFTAR INVENTARIS GUDANG
// buat array dengan kumpulan objek inventaris
const inventaris = [
  { nama: "Kopi Hitam", stok: 15 },
  { nama: "Gula Pasir", stok: 0 }, // stok kosong!
  { nama: "Roti Tawar", stok: 8 },
  { nama: "Susu Kotak", stok: 0 }, // stok kosong!
  { nama: "Keju Cheddar", stok: 5 },
];
// Ambil elemen HTMl yang dibutuhkan berdasarkan ID
const listEl = document.querySelector("#daftar-barang");
const btnSemua = document.querySelector("#btn-tampilkan-semua");
const btnFilter = document.querySelector("#btn-filter-stok");
const btnCari = document.querySelector("#btn-cari-satu");
// deklarasi function bersihkanLayar untuk mereset daftar list HTML
function bersihkanLayar() {
  listEl.innerHTML = "";
}
// Tampilkan semua barang dengan (for...of)
btnSemua.addEventListener("click", () => {
  bersihkanLayar();
  for (const item of inventaris) {
    const li = document.createElement("li");
    li.textContent = `${item.nama} (Stok: ${item.stok})`;
    listEl.appendChild(li);
  }
});
// Lewatkan barang dengan stok 0 (kosong) menggunakan 'continue'
btnFilter.addEventListener("click", () => {
  bersihkanLayar();
  for (const item of inventaris) {
    if (item.stok === 0) {
      continue;
    }
    const li = document.createElement("li");
    li.textContent = `${item.nama} (Tersedia: ${item.stok})`;
    listEl.appendChild(li);
  }
});
// Hentikan loop seketika, begitu ditemukan penggunaan 'break'
btnCari.addEventListener("click", () => {
  bersihkanLayar();
  for (const item of inventaris) {
    const li = document.createElement("li");
    li.textContent = `Memeriksa: ${item.nama}`;
    listEl.appendChild(li);
    if (item.nama === "Roti Tawar") {
      const liKetemu = document.createElement("li");
      liKetemu.innerHTML =
        "<strong>TARGET DITEMUKAN! Loop dihentikan seketika dengan <code>break</code>.</strong>";
      listEl.appendChild(liKetemu);
      break;
    }
  }
});
