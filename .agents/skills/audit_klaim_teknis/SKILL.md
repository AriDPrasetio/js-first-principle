---
name: audit_klaim_teknis
description: Audit klaim teknis satu file dokumentasi JavaScript terhadap MDN/ECMA-262/WHATWG, lalu beri verdict akurat/tidak.
---

# Audit Klaim Teknis

1. Tanya ke saya (jika belum disebutkan di prompt awal): path file yang mau diaudit, dan apakah ini file di `docs/` (Deep Dive) atau `docs-beginner/` (Pemula).
2. Baca isi file tersebut dengan view_file.
3. Jika file berasal dari `docs/` (Deep Dive), jalankan proses berikut:
   - Pecah dokumen menjadi daftar klaim teknis yang bisa diverifikasi/salah —
     termasuk: perilaku engine, nama spec/section yang dirujuk, istilah
     internal (mis. [[Environment]], slot internal lain), klaim "ini sudah
     dioptimasi V8" atau semacamnya, dan contoh kode (apakah outputnya benar
     sesuai komentar di kode).
   - Untuk SETIAP klaim, cari dan cek ke MDN Web Docs, spesifikasi ECMA-262
     (tc39.es/ecma262), dan WHATWG HTML/DOM Living Standard. Jangan menjawab
     dari asumsi saja — cari dulu (pakai google_search/url_context), baru
     simpulkan.
   - Klasifikasikan tiap klaim: ✅ Akurat / ⚠️ Overstated-simplifikasi
     berlebihan / ❌ Salah / ❓ Tidak bisa diverifikasi.
   - Untuk ⚠️ dan ❌, jelaskan apa yang salah/berlebihan dan berikan versi
     yang benar beserta nama sumbernya (bukan kutipan panjang — parafrase).
   - Cek juga apakah rujukan nomor section spec di dokumen benar-benar
     merujuk ke bagian yang relevan.
4. Jika file berasal dari `docs-beginner/` (Pemula), cukup fokus dua hal:
   - Apakah analoginya secara akurat merepresentasikan cara kerja
     sebenarnya, atau menyesatkan pada poin tertentu?
   - Telusuri/jalankan kode di dokumen: apakah output yang diklaim di
     komentar kode (misal `// 11`, `// undefined`) benar-benar sesuai
     perilaku JavaScript nyata?
5. Tutup dengan verdict singkat: AMAN dipakai sebagai materi belajar, atau
   PERLU DIREVISI dulu — sertakan daftar poin revisi jika ada.
6. Jangan basa-basi di awal jawaban. Langsung ke daftar klaim dan hasil
   verifikasinya.
