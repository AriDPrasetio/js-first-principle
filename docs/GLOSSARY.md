# Glossarium: Versi Deep Dive

## Modul 01: Introduction

- **Host Environment**: Lingkungan tempat JavaScript dijalankan yang menyediakan memori, engine, dan API tambahan (seperti DOM di browser).
- **Web APIs**: Antarmuka yang disediakan oleh browser (bukan bagian murni dari spesifikasi ECMAScript) seperti `window` dan `document`.
- **Call Stack**: Struktur data alur eksekusi tunggal (single-thread) di mana engine JavaScript menjalankan instruksi kode baris demi baris.

## Modul 02: Syntax & Data Types

- **Expression**: Satuan kode yang dievaluasi oleh engine untuk menghasilkan sebuah nilai tunggal.
- **Statement**: Kalimat instruksi lengkap yang mengarahkan alur kerja komputasi tanpa menghasilkan nilai yang dapat disimpan.
- **Primitive Types**: Tipe data atomik dan _immutable_ seperti string, number, dan boolean yang disalin secara langsung berdasarkan nilai (_copy by value_).
- **Object**: Koleksi pasangan _key-value_ di _heap memory_ yang dimanipulasi dan disalin melalui alamat referensi (_copy by reference_).
- **Autoboxing**: Mekanisme otomatis engine yang membungkus nilai primitif ke dalam objek sementara untuk menjalankan suatu metode.
- **Type Coercion**: Konversi tipe data secara otomatis dan implisit oleh engine saat operator bertemu tipe data yang tidak sesuai.
- **Type Conversion**: Konversi tipe data secara eksplisit yang dilakukan secara sadar oleh developer menggunakan fungsi pembungkus (seperti `Number()` atau `String()`).
- **Strict Equality (===)**: Pengecekan kesetaraan yang membandingkan identitas tipe data dan nilainya secara mutlak tanpa proses kompromi.
- **Loose Equality (==)**: Pengecekan kesetaraan yang menjalankan konversi tipe data otomatis sebelum membandingkan operan yang berbeda tipe.

## Modul 03: Variables & Scope

- **Environment Record**: Struktur penyimpanan pada memori tempat _identifier_ variabel didaftarkan beserta nilainya di setiap lingkup eksekusi.
- **Temporal Dead Zone (TDZ)**: Wilayah kode di mana variabel `let` dan `const` telah terdaftar namun belum diinisialisasi sehingga tidak dapat diakses.
- **Scope Chain**: Rantai penelusuran referensi leksikal yang menghubungkan lingkup (scope) saat ini ke lingkup luar hingga mencapai ranah global.
- **Closure**: Konsekuensi di mana fungsi menyimpan pointer internal permanen ke lingkungannya, sehingga fungsi tersebut tetap mengingat variabel dari tempat ia lahir meski fungsi induk telah selesai dijalankan.

## Modul 04: Control Flow

- **Nullish Coalescing (??)**: Operator logika yang mengevaluasi ekspresi kanan hanya jika nilai di sebelah kiri bernilai murni `null` atau `undefined`.
- **Short-Circuit Evaluation**: Mekanisme di mana evaluasi ekspresi langsung berhenti mengembalikan hasil ketika kondisi telah dapat dipastikan (pada evaluasi `&&` dan `||`).
- **Iteration Protocols**: Kontrak (seperti metode `[Symbol.iterator]`) yang wajib diimplementasikan objek agar dapat diiterasi melalui siklus seperti `for...of`.
- **Call Stack Unwinding**: Proses darurat pembongkaran tumpukan pemanggilan oleh mesin yang terus mencari mundur ke belakang hingga menemukan blok `try/catch`.

## Modul 05: Functions

- **First-Class Object**: Prinsip bahasa di mana fungsi diperlakukan sama dengan data biasa; dapat disimpan di variabel, dioper ke dalam fungsi, maupun dikembalikan nilainya.
- **Higher-Order Function (HOF)**: Fungsi yang mampu menerima satu atau lebih fungsi sebagai parameter input atau mengembalikan fungsi baru sebagai hasil keluaran.
- **Parameter**: _Identifier_ lokal yang dideklarasikan sebagai cetakan saat mendefinisikan bentuk sebuah fungsi.
- **Argument**: Nilai ekspresi nyata yang disuplai oleh pemanggil saat fungsi tersebut sedang dieksekusi.
- **Default Parameters**: Ketentuan mekanisme di mana parameter fungsi mengadopsi nilai cadangan hanya jika argumen dinilai sama dengan `undefined`.
- **Rest Parameters**: Pola sintaksis (`...`) di mana argumen yang berlebih dikumpulkan ke dalam satu instans entitas _array_ murni.
- **IIFE (Immediately Invoked Function Expression)**: Ekspresi deklarasi fungsi dibungkus kurung kelompok yang dijalankan seketika untuk merakit lingkup privat tanpa mencemari ranah luarnya.
- **Arrow Function**: Penulisan fungsi tanpa pengikatan `this` dinamis atau argumen, yang mewarisi referensi dari tempat ia didefinisikan secara leksikal.

## Modul 06: This Context

- **Call-Site**: Titik letak baris program di mana suatu fungsi dipanggil yang nantinya mendikte konteks evaluasi objek.
- **Implicit Binding**: Pengikatan konteks otomatis yang menjadikan objek tepat di sebelah kiri tanda titik (saat pemanggilan) sebagai rujukan variabel `this`.
- **Explicit Binding**: Instruksi pemaksaan injeksi objek tertentu menggunakan operasi bawaan bahasa khusus seperti `.call()`, `.apply()`, atau `.bind()`.
- **Function Borrowing**: Teknik di mana struktur objek meminjam eksekusi metode dari prototipe milik data entitas lain (contohnya meminjam algoritma dari `Array.prototype`).

## Modul 07: Array & Object Methods

- **Pure Function**: Fungsi transformasi yang mengeksekusi operasi tanpa mencemari status data luar dan tidak pernah mengubah _input_ referensi asal (_in-place mutation_).
- **Destructuring**: Pola manipulasi struktur bahasa untuk mengekstrak atau menyalin properti bersarang dan indeks deret ke dalam perwakilan variabel langsung.
- **Shallow Copy**: Model penduplikasian data teratas saja, menyebabkan modifikasi pada sub-objek tingkat dalam tetap menimpa aslinya karena pointer identik.
- **Deep Copy**: Proses penyalinan tuntas suatu grafik struktur data yang memutus bersih seluruh keterikatan alamat dengan referensi induk asalnya.
- **Spread Syntax**: Instruksi pembongkaran koleksi di sisi evaluasi (`...`) yang menebar sisa objek maupun indeks tunggal dalam struktur ruang anyar.

## Modul 08: DOM & Events

- **Event Target**: Antarmuka di bawah struktur Document Object Model yang memampukan penerimaan hingga pengikatan pengamat (_event listener_) reaksi antarmuka.
- **Event Capturing**: Fase hantaran gelombang peristiwa dari elemen teratas (window) bergerak ke dalam mencari elemen dasar tujuan interaksi target.
- **Event Bubbling**: Mekanika propagasi pantulan di mana isyarat reaksi menyebar ke atas berlapis-lapis menyusuri _ancestor_ setelah hantaman elemen terdalam.
- **Event Delegation**: Praktik arsitektur mereduksi alokasi beban dengan menitipkan satu pengendali _listener_ di hierarki atas yang menangkap gelembung pantul beribu turunan sekaligus.

## Modul 09: Async JavaScript

- **Event Loop**: Mekanisme tanpa henti di peramban yang menengahi koordinasi tugas-tugas tumpukan utama dan menjadwalkan ulang respon ke Call Stack asalkan tidak sedang sibuk.
- **Macrotask Queue**: Lini tunggu antrean umum yang memproses penundaan timer maupun interaksi DOM yang menunggu satu alur eksekusi selesai untuk setiap siklus barunya.
- **Microtask Queue**: Jalur lalu lintas instruksi absolut prioritas teratas (seperti serah terima _Promise_) di mana peramban berkewajiban menghabiskannya sepenuhnya sebelum menyentuh pengecatan antarmuka kembali.
- **Promise**: Konstruk mesin status tunggal bertugas menjadi perantara _placeholder_ resolusi dari asinkronisitas masa mendatang (dapat berstatus _pending_, _fulfilled_, _rejected_).
- **Inversion of Control**: Kerentanan pengalihan wewenang kontrol jalannya pemrograman karena callback dieksekusi secara buta oleh pihak perantara ke-tiga.

## Modul 10: Fetch & Error Handling

- **ReadableStream**: Arus saluran biner bertahap pada penerimaan respons di mana pengembang dapat menerjemahkannya sebagian tanpa butuh meload data mentah secara total.
- **Network Error**: Kategori kegagalan putusnya kabel nirkabel secara fisik, penolakan DNS, atau gangguan SSL yang me-reject penanganan _promise_ dari API Fetch seketika.
- **Race Condition**: Risiko saat beberapa antrean operasi paralel tidak diantisipasi batas selesainya yang akan menciptakan tabrakan pada lapisan sinkronisasi status UI.
- **AbortController**: Objek utilitas bawaan standar DOM untuk menengahi batalan komunikasi sinyal pengiriman data secara cepat apabila komponen sudah terlanjur dihancurkan.

## Modul 11: ES Modules

- **Static Dependency Graph**: Arsitektur pohon ketergantungan statik yang mengizinkan peramban menelaah peta seluruh berkas terlebih dahulu tanpa perulangan ekseskusi buta.
- **Live Read-Only Bindings**: Modus _state_ tautan referensi pada antar-modul, di mana objek referensi pengekspor akan langsung terlihat perubahannya pada berkas pengimpor.
- **Tree-Shaking**: Analisis pengeliminasi bongkahan aset berlebih, karena deklarasi _export_ terstruktur dapat dibuang oleh Bundler jika tidak dikonsumsi satupun.
- **Module Scope**: Pembatasan wewenang leksikal otomatis di mana fungsi lapis paling atas terisolasi total agar objek `window` tak tercemar bocoran identifier.

## Modul 12: Browser DevTools

- **Chrome DevTools Protocol (CDP)**: Aturan komunikasi eksternal peramban pengembang yang mampu mensuspensi aliran _Virtual Machine_ JavaScript di detik kapanpun.
- **Breakpoint**: Fitur titik tumpu penghentian eksekusi yang mendestruksi alur berjalannya kode, membuka akses _live state_ kepada segala tumpukan dan properti memori lokal.
- **Critical Rendering Path**: Rangkaian rantai peristiwa hitungan peramban yang memformulasikan _Style_, geometri (_Layout_), pengecatan piksel, dan komposisi berlapis (_Composite_).
- **Layout Thrashing**: Botol leher komputasi lambat kala JavaScript mendikte _layout_ dengan operasi catat dimensi beruntun secara bolak-balik yang memaksa _reflow_ disinggung sinkronis.
