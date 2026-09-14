// 1. Primitive: pass-by-value (tidak mengubah variable asal)
let roleA = "Frontend Dev";
// simpan teks "Frontend Dev" ke dalam variable roleA.
let roleB = roleA;
// salin value variable roleA ke dalam variable roleB.
roleB = "Tech Lead";
// ubah value roleB menjadi "Tech Lead".
// Catatan*: roleA tidak akan terpengaruh karena tipe primitive menyalin nilai murni, bukan referensi memori.

// 2. Object: pass-by-reference (berbagi alamat memori yang sama)
const userProfile = {
  name: "Ari",
  role: roleA,
};
// buat objek userProfile dengan properti nama "Ari" dan peran dari value roleA ("Frontend Dev").

// 3. Ambil elemen HTML yang dibutuhkan
const nameEl = document.querySelector("#user-name");
const roleEl = document.querySelector("#user-role");
const updateBtn = document.querySelector("#btn-update");
// 4. Render awal ke layar
nameEl.textContent = userProfile.name;
roleEl.textContent = userProfile.role;
// 5. Interaksi tombol
updateBtn.addEventListener("click", () => {
  // saat tombol updateBtn diklik, jalankan perintah di dalam blok ini:
  const profileAlias = userProfile;
  // buat variable baru yang merujuk ke alamat objek userProfile yang sama di memori.
  profileAlias.role = roleB;
  // ubah properti role lewat profileAlias menjadi roleB ("Tech Lead").
  // Catatan*: userProfile.role ikut berubah karena userProfile dan profileAlias memegang remote/alamat objek yang sama! (Variabel roleA sendiri tetap aman/tidak berubah).
  roleEl.textContent = `${userProfile.role} (Dimutasi lewat profileAlias!)`;
  // perbarui teks di layar menggunakan data userProfile asli untuk membuktikan bahwa data aslinya ikut berubah.
  roleEl.style.color = "green";
  // ubah warna teks menjadi hijau sebagai penanda visual perubahan.
});
