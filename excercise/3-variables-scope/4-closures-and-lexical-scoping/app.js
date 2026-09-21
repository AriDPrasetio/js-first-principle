// 1. PABRIK SKOR (FUNGSI INDUK PENGHASIL CLOSURE)
function buatPengelolaSkor(tampilanElemen) {
  let nilaiSkor = 0;

  function segarkanLayar() {
    tampilanElemen.textContent = nilaiSkor;
  }
  return {
    tambahPoin: function (tambahan) {
      nilaiSkor = nilaiSkor + tambahan;
      segarkanLayar();
    },
    resetSkor: function () {
      nilaiSkor = 0;
      segarkanLayar();
    },
  };
}

// 2. HUBUNGKAN KE ELEMEN HTML
const scoreDisplay = document.querySelector("#score-display");
const scoreTracker = buatPengelolaSkor(scoreDisplay);
// 3. PASANG AKSI TOMBOL
document.querySelector("#btn-add").addEventListener("click", () => {
  scoreTracker.tambahPoin(5);
});
document.querySelector("#btn-reset").addEventListener("click", () => {
  scoreTracker.resetSkor();
});
