// 1. Ambil elemen HTML yang dibutuhkan
// ambil elemen lampu berdasarkan ID-nya
const lampuEl = document.querySelector("#lampu");
// ambil elemen teks status berdasarkan ID-nya
const teksStatusEl = document.querySelector("#teks-status");
// ambil tombol saklar berdasarkan ID-nya
const saklarBtn = document.querySelector("#btn-saklar");

// 2. Simpan status lampu di memori JavaScript
let isLampuMenyala = false;

// 3. Pasang aksi ketika tombol saklar diklik
// saat saklarBtn diklik, jalankan perintah berikut:
saklarBtn.addEventListener("click", () => {
  // balik status logika lampu (toggle true/false)
  isLampuMenyala = !isLampuMenyala;

  // percabangan kondisi: jika lampu dalam status menyala
  if (isLampuMenyala) {
    // ubah warna latar lampu menjadi kuning terang
    lampuEl.style.backgroundColor = "#ffcc00";
    // ubah teks status menjadi "Lampu Menyala!"
    teksStatusEl.textContent = "Lampu Menyala!";
    // ubah label tombol menjadi "Matikan Lampu"
    saklarBtn.textContent = "Matikan Lampu";
  } else {
    // jika lampu dalam status mati, kembalikan warna latar menjadi abu-abu
    lampuEl.style.backgroundColor = "#ccc";
    // kembalikan teks status menjadi "Lampu Sedang Mati"
    teksStatusEl.textContent = "Lampu Sedang Mati";
    // kembalikan label tombol menjadi "Nyalakan Lampu"
    saklarBtn.textContent = "Nyalakan Lampu";
  }
});
