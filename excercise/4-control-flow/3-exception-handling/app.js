// 1. Ambil element yang dibutuhkan
const totalInput = document.querySelector("#input-total");
const orangInput = document.querySelector("#input-orang");
const btnHitung = document.querySelector("#btn-hitung");
const pesanBox = document.querySelector("#pesan-box");
const finalStatus = document.querySelector("#status-final");

// 2. Pasang aksi saat tombol diklik
btnHitung.addEventListener("click", () => {
  try {
    const totalTagihan = Number(totalInput.value);
    const jumlahOrang = Number(orangInput.value);
    if (Number.isNaN(totalTagihan) || totalTagihan <= 0) {
      throw new Error("Total tagihan harus berupa angka lebih dari 0!");
    }
    if (Number.isNaN(jumlahOrang) || jumlahOrang <= 0) {
      throw new Error("Jumlah teman harus miniamal 1 orang!");
    }
    const bayarPerOrang = totalTagihan / jumlahOrang;
    pesanBox.className = "kotak-pesan kotak-sukses";
    pesanBox.textContent = `Masing-masing membayar: Rp${bayarPerOrang.toLocaleString("id-ID")}`;
  } catch (error) {
    console.warn("Terjadi kegagalan input:", error.message);
    pesanBox.className = "kotak-pesan kotak-error";
    pesanBox.textContent = `❌ ${error.message}`;
  } finally {
    const waktu = new Date().toLocaleTimeString("id-ID");
    finalStatus.textContent = `Operasi selesai diproses pada pukul ${waktu}`;
  }
});
