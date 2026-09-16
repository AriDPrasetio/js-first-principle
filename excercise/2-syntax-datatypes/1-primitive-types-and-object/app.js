// 1. Primitive: pass-by-value (tidak mengubah variable asal)
// simpan teks "Frontend Dev" ke dalam variable roleA
let roleA = "Frontend Dev";

// salin value variable roleA ke dalam variable roleB
let roleB = roleA;

// ubah value roleB menjadi "Tech Lead"
// Catatan*: roleA tidak akan terpengaruh karena tipe primitive menyalin nilai murni, bukan referensi memori
roleB = "Tech Lead";

// 2. Object: pass-by-reference (berbagi alamat memori yang sama)
// buat objek userProfile dengan properti nama "Ari" dan peran dari value roleA ("Frontend Dev")
const userProfile = {
  name: "Ari",
  role: roleA,
};

// 3. Ambil elemen HTML yang dibutuhkan
// ambil elemen nama pengguna berdasarkan ID-nya
const nameEl = document.querySelector("#user-name");
// ambil elemen peran pengguna berdasarkan ID-nya
const roleEl = document.querySelector("#user-role");
// ambil tombol pembaruan data berdasarkan ID-nya
const updateBtn = document.querySelector("#btn-update");

// 4. Render awal ke layar
// tampilkan nama awal dari userProfile ke layar
nameEl.textContent = userProfile.name;
// tampilkan peran awal dari userProfile ke layar
roleEl.textContent = userProfile.role;

// 5. Interaksi tombol
// saat tombol updateBtn diklik, jalankan perintah di dalam blok ini:
updateBtn.addEventListener("click", () => {
  // buat variable baru yang merujuk ke alamat objek userProfile yang sama di memori
  const profileAlias = userProfile;

  // ubah properti role lewat profileAlias menjadi roleB ("Tech Lead")
  // Catatan*: userProfile.role ikut berubah karena userProfile dan profileAlias memegang remote/alamat objek yang sama! (Variabel roleA sendiri tetap aman/tidak berubah).
  profileAlias.role = roleB;

  // perbarui teks di layar menggunakan data userProfile asli untuk membuktikan bahwa data aslinya ikut berubah
  roleEl.textContent = `${userProfile.role} (Dimutasi lewat profileAlias!)`;

  // ubah warna teks menjadi hijau sebagai penanda visual perubahan
  roleEl.style.color = "green";
});
