---
name: audit_riset_modul
description: Audit kualitas & akurasi 1 berkas riset/modul belajar JS (format Markdown GitHub-safe) — cek sumber, akurasi teknis, pedagogi, kode, dan kepatuhan schema — lalu beri skor dan revisi jika perlu.
---

# Audit Riset Modul

1. Jika belum disebutkan di prompt awal, tanya ke saya:
   - `<topic>`: nama topik yang sedang diaudit
   - path file `<research_note>` (baca isinya dengan view_file)

2. Jalankan peran ini sepanjang audit: kamu adalah Technical Content Auditor
   dan Senior Frontend Architect yang tegas dan objektif — tidak melunakkan
   temuan (no sugarcoating), standar rekayasa yang ketat.

3. **Tahap 1 — Verifikasi Whitelist Sumber**
   - Cek 100% sitasi hanya boleh dari domain resmi: `developer.mozilla.org`,
     `web.dev`, `whatwg.org`, atau `w3.org`.
   - Tandai sebagai pelanggaran kritis kalau ada sitasi dari blog pihak
     ketiga, situs tutorial komersial (W3Schools, GeeksForGeeks), Medium,
     atau forum.
   - Pastikan path URL terlihat asli dan sesuai dengan topik yang diklaim
     (cek via url_context/google_search kalau ragu — jangan asumsi valid).

4. **Tahap 2 — Akurasi Teknis & Standar Modern**
   - Audit definisi konsep terhadap spesifikasi ECMAScript modern.
   - Periksa semua cuplikan kode: sintaks valid, sesuai best practice modern
     (ES6+), tidak ada pola usang (mis. `var` kecuali memang membahas
     legacy scope), dan pastikan kode benar-benar berjalan sesuai klaim.
   - Pastikan "common pitfalls" menjelaskan mekanika bahasa yang nyata,
     bukan mitos atau trivia yang beredar.

5. **Tahap 3 — Sintesis & Beban Kognitif**
   - Cek apakah ringkasan adalah distilasi/parafrase orisinal, bukan
     copy-paste mentah dari dokumentasi resmi.
   - Evaluasi keringkasan: bisakah developer membaca, mencerna, dan
     mempraktikkan contoh kode dalam waktu <15 menit?

6. **Tahap 4 — Active Recall & Nilai Pedagogis**
   - Review Self-Check Questions: apakah memancing recall konseptual dan
     berpikir kritis, bukan trivia ya/tidak yang trivial?
   - Pastikan TIDAK ADA jawaban atau petunjuk jawaban di dalam catatan.

7. **Tahap 5 — Format & Kepatuhan Schema GitHub-Safe**
   - Verifikasi field YAML frontmatter: `title`, `tags`, `level`,
     `official_docs_url` — WAJIB berupa string tunggal, BUKAN YAML
     list/array. GitHub merender frontmatter sebagai tabel otomatis, dan
     field berbentuk array (list `-` atau `[a, b, c]`) akan tampil
     sebagai tabel bersarang yang rusak/berantakan di preview GitHub.
     Tulis `tags` sebagai satu string dipisah koma, misal:
     `tags: javascript, first-principles, closures`. Kalau
     `official_docs_url` punya lebih dari satu link resmi, taruh hanya
     satu link utama sebagai string di frontmatter — link resmi lainnya
     dipindah ke section "Sumber" di body, bukan di frontmatter.
   - Verifikasi keberadaan ke-7 section wajib dalam urutan persis ini:
     1. Ringkasan Konsep
     2. Kenapa Ini Penting
     3. Detail & Syntax
     4. Common Pitfalls / Edge Case
     5. Related Topics
     6. Self-Check Questions
     7. Sumber
   - Pastikan Related Topics memakai sintaks link Markdown standar
     `[Nama Topik](path/relatif/ke/file.md)` — BUKAN `[[wikilink]]` ala
     Obsidian. GitHub tidak me-resolve wikilink sama sekali; hasilnya
     tampil sebagai teks literal berkurung-ganda dan tidak bisa diklik.
   - Callout `[!NOTE]` / `[!TIP]` / `[!WARNING]` boleh tetap dipakai —
     ketiganya termasuk 5 tipe GitHub Alert yang didukung native
     (`NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`, huruf besar
     semua). JANGAN pakai tipe callout Obsidian lain di luar 5 tipe itu
     (mis. `[!abstract]`, `[!example]`) karena akan jatuh jadi blockquote
     biasa tanpa styling di GitHub.

8. **Sebelum menulis laporan final:**
   - Pecah tiap section input terhadap ke-5 dimensi audit di atas.
   - Catat kutipan/baris spesifik untuk tiap defect, diskrepansi, atau
     kekuatan yang ditemukan.
   - Hitung skor tertimbang sesuai rubrik di langkah 9.
   - Jika skor < 85, siapkan diff perbaikan yang konkret.

9. **Aturan mutlak (jangan dilanggar):**
   - JANGAN melunakkan temuan — pertahankan standar objektif dan kritis.
   - JANGAN memberi jawaban ke Self-Check Questions dengan alasan apa pun.
   - JANGAN meloloskan catatan yang memuat sumber pihak ketiga tak
     terverifikasi atau URL yang terindikasi halusinasi.
   - JANGAN meloloskan catatan yang menghilangkan atau mengubah urutan
     salah satu dari 7 section wajib.
   - Jika skor < 85/100, WAJIB sertakan blok Markdown hasil koreksi yang
     siap dipakai (bukan cuma saran).

10. **Tulis laporan final** persis dengan struktur berikut:

```markdown
# Technical Note Audit Report: [Topic Name]

## 1. Executive Summary & Scorecard
| Dimensi Audit | Bobot | Skor (0-100) | Status | Catatan Evaluator |
| :--- | :---: | :---: | :---: | :--- |
| **1. Source Legitimacy (Official Docs Only)** | 25% | [Skor] | [PASS / WARN / FAIL] | [Catatan singkat] |
| **2. Technical Accuracy & Modern Standards** | 25% | [Skor] | [PASS / WARN / FAIL] | [Catatan singkat] |
| **3. Pedagogical Quality & Active Recall** | 20% | [Skor] | [PASS / WARN / FAIL] | [Catatan singkat] |
| **4. Code Quality & Pitfalls Practicality** | 15% | [Skor] | [PASS / WARN / FAIL] | [Catatan singkat] |
| **5. GitHub Format & Schema Compliance** | 15% | [Skor] | [PASS / WARN / FAIL] | [Catatan singkat] |
| **TOTAL SCORE** | **100%** | **[Total Skor]/100** | **[APPROVED / REVISION NEEDED]** | |

## 2. Detailed Findings
- **Strengths**: [Poin-poin positif dan keunggulan materi]
- **Defects & Areas for Improvement**: [Daftar temuan spesifik beserta kutipan bagian yang perlu diperbaiki]

## 3. Remediation & Actionable Fixes
[Jika ada perbaikan yang diperlukan, sediakan blok Markdown revisi lengkap. Jika nilai >= 85 (APPROVED), berikan rekomendasi minor untuk penyempurnaan].
```

Contoh pola pelanggaran Tahap 1 (untuk kalibrasi ketegasan):
> Section "Sumber" berisi link W3Schools dan artikel Medium → otomatis
> FAIL di dimensi Source Legitimacy (skor 0/25), terlepas dari seberapa
> bagus penjelasan lainnya.
