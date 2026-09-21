// 1. Ambil elemen HTML yang dibutuhkan
const selectMember = document.querySelector("#select-member");
const inputQty = document.querySelector("#input-qty");
const btnProses = document.querySelector("#btn-proses");
const pesanStatusEl = document.querySelector("#pesan-status");
const totalAkhirEl = document.querySelector("#total-akhir");
// simpan harga satuan
const hargaSatuan = 50000;

// 2 TENTUKAN DISKON MENGGUNAKAN SWITCH
// 2.1. Tambahkan aksi saat tombol diklik
btnProses.addEventListener("click", () => {
  // 2.2.ambil value dari dropdown member yang dipilih
  const levelMember = selectMember.value;
  // 2.3.buat presentaseDiskon dan beri nilai awal 0
  let persentaseDiskon = 0;
  switch (levelMember) {
    case "PLATINUM":
      persentaseDiskon = 0.3; // 30%
      break; // WAJIB! Kunci rem (break;) agar tidak melorot ke case berikutnya.
    case "GOLD":
      persentaseDiskon = 0.2; // 20%
      break;
    case "SILVER":
      persentaseDiskon = 0.1; // 10%
      break;
    case "REGULER":
    default:
      persentaseDiskon = 0.0; // default tanpa diskon
      break;
  }
  // 3. GUNAKAN OPERATOR ?? UNTUK NILAI DEFAULT
  const inputMentah = inputQty.value.trim(); // menghilangkan 'spasi' di awal/akhir nilai(value)
  const kuantitasAngka = inputMentah === "" ? undefined : Number(inputMentah);
  const kuantitasFinal = kuantitasAngka ?? 1;
  // 4. HITUNG TOTAL
  const totalKotor = hargaSatuan * kuantitasFinal;
  const potongan = totalKotor * persentaseDiskon;
  const bayarAkhir = totalKotor - potongan;
  // 5. PERBARUI TEKS
  pesanStatusEl.textContent = `Level: ${levelMember} | Diskon: ${persentaseDiskon * 100}% | Jumlah: ${kuantitasFinal} item`;
  totalAkhirEl.textContent = `Rp${bayarAkhir.toLocaleString("id-ID")}`;
});
