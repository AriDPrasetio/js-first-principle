// 1. Ambil elemen HTML yang dibutuhkan
const lampuEl = document.querySelector("#lampu");
const teksStatusEl = document.querySelector("#teks-status");
const saklarBtn = document.querySelector("#btn-saklar");

// 2. Simpan status lampu di memori JavaScript
let isLampuMenyala = false;

// 3. Pasang aksi ketika tombol saklar diklik
saklarBtn.addEventListener("click", () => {
  // saklarBtn tambahkan aksi "click" lalu jalankan perintah berikut ini:
  isLampuMenyala = !isLampuMenyala;

  if (isLampuMenyala) {
    // jika lampu menyala:
    lampuEl.style.backgroundColor = "#ffcc00";
    // ubah warna lampu menjadi kuning terang.
    teksStatusEl.textContent = "Lampu Menyala!";
    // ubah teks status menjadi "Matikan Lampu";
    saklarBtn.textContent = "Matikan Lampu";
    // ubah label tombol menjadi "Matikan Lampu"
  } else {
    // tapi jika lampu mati:
    lampuEl.style.backgroundColor = "#ccc";
    // kembalikan warna lampu menjadi abu-abu.
    teksStatusEl.textContent = "Lampu Sedang Mati";
    // kembalikan teks status menjadi "Lampu Sedang Mati"
    saklarBtn.textContent = "Nyalakan Lampu";
    // kembalikan label tombol menjadi "Nyalakan Lampu"
  }
});
