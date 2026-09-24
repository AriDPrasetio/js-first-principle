# Glossarium: Versi Pemula

## Modul 01: Introduction

- **Runtime**: Lingkungan tempat JavaScript dijalankan, baik itu di browser (Client-side) maupun komputer/server (Server-side).
- **Client-Side**: Lingkungan eksekusi di browser pengguna yang menangani interaksi, animasi, dan manipulasi DOM.
- **Server-Side**: Lingkungan eksekusi di server (seperti Node.js) yang memiliki akses ke sistem operasi dan sistem file.
- **Parser-blocking**: Peristiwa di mana browser berhenti membaca dokumen HTML karena harus mengunduh dan mengeksekusi sebuah script.
- **Defer**: Atribut pada tag script yang memberi instruksi pada browser untuk mengunduh JavaScript di latar belakang tanpa menghentikan pembacaan struktur HTML.

## Modul 02: Syntax & Data Types

- **Expression**: Satuan kode yang dievaluasi dan menghasilkan sebuah nilai (contoh: operasi matematika atau teks).
- **Statement**: Kalimat instruksi lengkap yang melakukan suatu tindakan dan menggerakkan alur program, bukan menghasilkan nilai langsung.
- **Primitive**: Tipe data dasar yang nilainya bersifat kekal (_immutable_) dan disalin secara independen (_copy-by-value_).
- **Object**: Tipe data referensi yang disimpan di memori heap (_mutable_), di mana variabel memegang petunjuk alamatnya saja (_copy-by-reference_).
- **typeof**: Operator bawaan untuk memeriksa dan mengembalikan string yang mewakili tipe data dari suatu nilai.

## Modul 03: Variables & Scope

- **Hoisting**: Perilaku di mana deklarasi (terutama function) seolah-olah diangkat ke bagian atas cakupan sebelum eksekusi berlanjut.
- **Temporal Dead Zone (TDZ)**: Kondisi saat variabel `let` atau `const` belum dapat diakses sebelum inisialisasinya dijalankan di baris kodenya.
- **Global Scope**: Ruang lingkup terluar tempat variabel dideklarasikan, sehingga dapat diakses oleh bagian kode mana pun.
- **Function Scope**: Cakupan lokal di mana variabel hanya dapat diakses dari dalam fungsi tempat ia dibuat.
- **Block Scope**: Ruang lingkup variabel yang dibatasi oleh sepasang kurung kurawal (seperti di dalam if/else atau loop).
- **Lexical Scoping**: Aturan bahwa sebuah blok kode dapat melihat dan mengakses variabel dari lingkup yang mengelilinginya di penulisan asal.
- **Closure**: Kemampuan fungsi untuk memegang dan mengingat referensi variabel dari cakupan luarnya, bahkan setelah fungsi luarnya selesai dieksekusi.

## Modul 04: Control Flow

- **Initialization**: Tahap persiapan awal variabel (seperti counter) sebelum suatu perulangan (loop) dimulai.
- **Condition**: Syarat pengujian yang akan menentukan apakah sebuah perulangan harus dilanjutkan (jika true) atau dihentikan (jika false).
- **Increment**: Langkah di akhir setiap putaran iterasi untuk menaikkan/menurunkan nilai variabel penghitung.
- **Break**: Perintah paksa untuk keluar dari dalam siklus perulangan secara langsung.

## Modul 05: Functions

- **Function Declaration**: Sintaks pendefinisian fungsi yang mendapatkan keuntungan dari proses _hoisting_ sepenuhnya.
- **Function Expression**: Cara menyimpan fungsi ke dalam variabel; fungsi ini tidak akan di-hoist penuh seperti halnya deklarasi.
- **Arrow Function**: Sintaks ringkas menggunakan panah `=>` untuk menulis fungsi secara lebih singkat.
- **Rest Parameter**: Sintaks `...` di penutup argumen fungsi untuk mengumpulkan seluruh argumen tambahan menjadi satu array.
- **First-Class Function**: Karakteristik JavaScript yang memperlakukan fungsi sebagai nilai biasa yang bisa dioper ke sana ke mari.
- **Higher-Order Function**: Fungsi yang menerima fungsi lain sebagai argumen (callback) atau mengembalikan fungsi sebagai hasil.
- **Callback**: Sebuah fungsi yang dioper ke dalam fungsi lain untuk dipanggil atau dieksekusi pada saat tertentu.

## Modul 06: This Context

- **This**: Kata kunci khusus yang nilainya ditentukan oleh konteks objek mana yang memanggil fungsi tersebut di saat eksekusi.

## Modul 07: Array & Object Methods

- **Spread Operator**: Sintaks `...` yang bertugas membongkar atau menyebarkan elemen Array maupun properti Object ke dalam wadah baru.
- **Destructuring**: Sintaks untuk memecah properti objek atau elemen array agar langsung tersimpan ke dalam variabel-variabel mandiri.
- **Shallow Copy**: Teknik duplikasi objek di mana properti bersarang (nested) masih membagikan alamat memori yang sama dengan aslinya.

## Modul 08: DOM Events

- **Document Object Model (DOM)**: Model antarmuka yang disediakan browser agar JavaScript dapat berinteraksi dengan elemen HTML.
- **Event Bubbling**: Sifat di mana suatu aksi (event) pada elemen terdalam akan merambat dan memicu reaksi elemen-elemen di atasnya secara berurutan.
- **Event Delegation**: Teknik melimpahkan penanganan event ke satu elemen induk yang mewakili interaksi seluruh elemen anaknya berkat sifat bubbling.

## Modul 09: Async Javascript

- **Call Stack**: Tumpukan tugas memori utama di mana kode dieksekusi satu per satu pada jalur tunggal.
- **Web API**: Perangkat tambahan di browser (misalnya fetch atau timer) yang menjalankan proses di latar belakang agar thread utama tidak membeku.
- **Event Loop**: Mekanisme yang memantau Call Stack, lalu memasukkan antrean eksekusi dari latar belakang kembali ke stack saat antrean utama kosong.
- **Single-Threaded**: Arsitektur pemrograman yang hanya menjalankan satu baris tugas dalam satu kurun waktu tanpa multitasking paralel sejati.

## Modul 10: Fetch & Error Handling

- **JSON (JavaScript Object Notation)**: Format transfer data ringan berbasis teks yang kompatibel di lintas bahasa pemrograman.
- **Fetch API**: Fasilitas bawaan modern browser untuk mengirimkan permintaan (HTTP request) ke server mengambil atau mengirim data.
- **Payload**: Teks data JSON atau informasi utama yang disisipkan ke dalam badan request untuk dikirim ke tujuan.

## Modul 11: ES Modules

- **ES Modules (ESM)**: Standar resmi pemecahan kode yang memungkinkan pengembang membagi JavaScript ke berbagai berkas dan memanggilnya dengan keyword import.

## Modul 12: Browser Devtools

- **Breakpoint**: Titik hentian (bisa dengan klik di Sources atau sintaks `debugger;`) yang membuat eksekusi program terhenti seketika untuk dianalisis.
- **Step Over**: Tindakan untuk melompati satu baris instruksi penuh saat proses debugging.
- **Step Into**: Masuk menyelam ke baris awal dalam definisi fungsi yang dipanggil pada baris saat ini.
- **Step Out**: Menyelesaikan sisa jalannya fungsi yang saat ini diamati lalu keluar kembali ke kode utama pemanggilnya.
- **Main Thread**: Jalur kerja utama browser yang mengurus perhitungan serta pembaruan tampilan layar; rentan macet (_Long Task_) akibat komputasi JavaScript yang berat.
