# JavaScript Fundamentals — First Principles Curriculum

Kurikulum dan jurnal belajar mandiri untuk menguasai fondasi inti **JavaScript modern (Scope Frontend Developer)** dari nol menggunakan pendekatan **First Principles (Richard Feynman style)** dan **Prinsip Pareto (80/20)**, sebagai landasan kokoh sebelum melangkah ke ekosistem React.

Tersedia **dua jalur dokumentasi** yang saling melengkapi:

1. **🌱 Versi Pemula (`docs-beginner/`)**: Dirancang untuk pemula dewasa tanpa jargon rumit. Dilengkapi analogi logis dunia nyata, contoh interaktif minimal (`index.html` + `app.js`), dan komentar baris kode fungsional berbahasa Indonesia.
2. **🔬 Versi First Principles Deep Dive (`docs/`)**: Analisis mendalam berakar langsung pada spesifikasi resmi web platform (**ECMA-262**, **WHATWG HTML & DOM**, dan **W3C**), membongkar arsitektur mesin C++, memori heap/stack, dan dekonstruksi masalah.

---

## 🏛️ Dua Format Panduan

### 1. Jalur Pemula (`docs-beginner/`)

- **Inti Konsep (`[!NOTE]`)**: Esensi 1–2 kalimat tanpa istilah membingungkan.
- **Analogi Logis**: Perumpamaan nyata (misal: fotokopi vs alamat rumah, gelembung kolam renang, kasir kafe).
- **First Principles Ringan**: Menjawab _"Mengapa JavaScript didesain seperti ini?"_.
- **Praktik Interaktif (HTML + JS)**: Kode mini yang langsung bisa dijalankan di browser dengan komentar fungsional manusiawi di setiap baris kodenya.
- **Checklist Praktik & Uji Pemahaman Mandiri**: Pertanyaan penguji pemahaman tanpa bocoran jawaban.

### 2. Jalur Deep Dive (`docs/`)

- **The Ground Truth (`[!NOTE]`)**: Esensi mutlak konsep pada level mesin/memori terendah.
- **Dekonstruksi Masalah**: Membedakan mitos industri vs masalah fundamental yang sebenarnya diselesaikan browser.
- **Kebenaran Fundamental**: 2–3 prinsip baku berakar pada spesifikasi ECMA-262/WHATWG.
- **Rekonstruksi Logis**: Membangun arsitektur solusi optimal dari nol.

---

## 🗺️ Peta Kurikulum (12 Modul — 32 Topik)

> [!NOTE]
> Seluruh 32 topik telah lengkap tersedia baik di versi **Pemula** maupun **Deep Dive**. Pelacakan progres belajar aktif dilakukan melalui checklist di [`.agents/roadmap.md`](./.agents/roadmap.md).

| Modul                          | Topik Materi                                                              |                                         Versi Pemula                                          |                                   Versi Deep Dive                                    |
| :----------------------------- | :------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: |
| **01. Introduction**           | Runtime JS, Host Environment, Parser-blocking, `defer`/`async`            | [Buka](./docs-beginner/01-introduction/apa-itu-javascript-dan-cara-menjalankan-javascript.md) | [Buka](./docs/01-introduction/apa-itu-javascript-dan-cara-menjalankan-javascript.md) |
| **02. Syntax & Data Types**    | Expressions vs Statements, Primitive vs Object, `typeof`, Coercion vs Conversion, Equality `===` |                         [Buka](./docs-beginner/02-syntax-datatypes/)                          |                         [Buka](./docs/02-syntax-datatypes/)                          |
| **03. Variables & Scope**      | `var`/`let`/`const`, Hoisting, Scope Chain, Closures                      |                          [Buka](./docs-beginner/03-variables-scope/)                          |                          [Buka](./docs/03-variables-scope/)                          |
| **04. Control Flow**           | Conditionals (`??`), Loops (`for...of`), Exception Handling (`try/catch`) |                           [Buka](./docs-beginner/04-control-flow/)                            |                           [Buka](./docs/04-control-flow/)                            |
| **05. Functions**              | Declaration vs Expression vs Arrow, Default/Rest, HOF, IIFE               |                             [Buka](./docs-beginner/05-functions/)                             |                             [Buka](./docs/05-functions/)                             |
| **06. `this` Context**         | Binding Rules, Explicit (`call`/`apply`/`bind`), Function Borrowing       |                           [Buka](./docs-beginner/06-this-context/)                            |                           [Buka](./docs/06-this-context/)                            |
| **07. Array & Object Methods** | `map`/`filter`/`reduce`, Destructuring, Spread/Rest                       |                       [Buka](./docs-beginner/07-array-object-methods/)                        |                       [Buka](./docs/07-array-object-methods/)                        |
| **08. DOM & Events**           | `querySelector`, `addEventListener`, Event Delegation & Bubbling          |                            [Buka](./docs-beginner/08-dom-events/)                             |                            [Buka](./docs/08-dom-events/)                             |
| **09. Async JavaScript**       | Event Loop & Timers, Promise & `async/await`                              |                         [Buka](./docs-beginner/09-async-javascript/)                          |                         [Buka](./docs/09-async-javascript/)                          |
| **10. Fetch & Errors**         | Fetch API & JSON, Request Error Handling (`AbortController`)              |                       [Buka](./docs-beginner/10-fetch-error-handling/)                        |                       [Buka](./docs/10-fetch-error-handling/)                        |
| **11. ES Modules**             | ES Modules (`import`/`export`, `<script type="module">`)                  |             [Buka](./docs-beginner/11-es-modules/01-es-modules-import-export.md)              |             [Buka](./docs/11-es-modules/01-es-modules-import-export.md)              |
| **12. Browser DevTools**       | Breakpoints vs Console, Rendering Performance & Layout Thrashing          |                         [Buka](./docs-beginner/12-browser-devtools/)                          |                         [Buka](./docs/12-browser-devtools/)                          |

👉 **Buka [`.agents/roadmap.md`](./.agents/roadmap.md)** untuk melihat rincian setiap topik dan menandai progres belajar harian Anda.

---

## ⚡ Alur Belajar yang Disarankan (Deliberate Practice)

Untuk menguasai materi secara optimal dan membangun _muscle memory_:

1. **Mulai dari Panduan Pemula (`docs-beginner/`)**: Pahami analogi logis dan amati contoh kode interaktifnya.
2. **Ketik Ulang Kode (Deliberate Typing)**: Buat file `index.html` dan `app.js` di komputer Anda, ketik sendiri kodenya, dan buka di browser.
3. **Eksperimen & Uji Pemahaman**: Jawab pertanyaan di bagian _"🎯 Uji Pemahaman Mandiri"_ untuk memperkuat _active recall_.
4. **Perdalam dengan Deep Dive (`docs/`)**: Saat sudah merasa nyaman dengan konsep dasar, baca dokumen terkait di `docs/` untuk memahami cara kerja mesin browser di balik layar.
5. **Mulai Proyek UI Mini**: Setelah menuntaskan **Modul 08 (DOM & Events)** dan **Modul 10 (Fetch)**, Anda sudah siap membangun komponen web interaktif mandiri.

---

## 📚 Standar & Sumber Resmi

100% materi dalam kurikulum ini diverifikasi terhadap dokumentasi resmi:

- [MDN Web Docs (JavaScript Guide & Reference)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [ECMA-262 ECMAScript Language Specification](https://tc39.es/ecma262/)
- [WHATWG HTML & DOM Living Standards](https://spec.whatwg.org/)
- [web.dev (Performance & Best Practices)](https://web.dev/)
