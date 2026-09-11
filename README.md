# JavaScript Fundamentals — First Principles Deep Dive

Kurikulum dan jurnal belajar mandiri untuk menguasai fondasi inti **JavaScript modern (Scope Frontend Developer)** dari nol menggunakan pendekatan **First Principles (Richard Feynman style)** dan **Prinsip Pareto (80/20)**, sebagai landasan kokoh sebelum melangkah ke ekosistem React.

Seluruh materi berakar langsung pada spesifikasi resmi web platform (**ECMA-262 Language Specification**, **WHATWG HTML & DOM**, dan **W3C**), bukan sekadar opini, konvensi industri, atau dogma tren framework.

---

## 🏛️ Kerangka Analisis (First Principles Framework)

Setiap topik di dalam kurikulum ini dibedah menggunakan format baku 4-tahap yang siap diintegrasikan ke dalam **Obsidian Vault**:

1. **The Ground Truth (`[!ABSTRACT]`)**: Esensi mutlak konsep pada level mesin/memori terendah, bebas dari jargon-buzzword.
2. **Dekonstruksi Masalah**: Membedakan antara mitos/asumsi umum industri dengan masalah fundamental yang sebenarnya diselesaikan browser.
3. **Kebenaran Fundamental**: 2–3 prinsip tak terbantahkan yang berakar langsung pada aturan spesifikasi resmi peramban.
4. **Rekonstruksi Logis**: Membangun solusi optimal dari nol murni memakai logika sebab-akibat (Vanilla JS, metodologi CSS BEM, Design Tokens, dan kepatuhan aksesibilitas WCAG 2.1 AA).
5. **Strategi Eksekusi**: Checklist aksi teknis konkret, parameter kesuksesan terukur (`[!TIP]`), dan batas kepastian fakta vs konvensi (`[!WARNING]`).

---

## 🗺️ Peta Kurikulum (12 Modul — 31 Topik)

> [!NOTE]
> Seluruh 31 dokumen materi panduan telah selesai disusun dan siap dipelajari. Pelacakan progres belajar aktif Anda dilakukan melalui checklist di [`.agents/roadmap.md`](./.agents/roadmap.md).

| Modul                                                             | Cakupan Materi                                                                                           | Panduan Belajar | Status Modul |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- | :-------------: | :----------: |
| [**01. Introduction**](./docs/01-introduction/)                   | Runtime JS, Host Environments, HTML Parser-blocking vs `defer`/`async`                                   |    1 Dokumen    |  `Tersedia`  |
| [**02. Syntax & Data Types**](./docs/02-syntax-datatypes/)        | Primitives vs Objects, Stack/Heap, Operator `typeof`, Type Coercion, Equality `===`                      |    4 Dokumen    |  `Tersedia`  |
| [**03. Variables & Scope**](./docs/03-variables-scope/)           | `var`/`let`/`const`, Hoisting, TDZ, Scope Chain, Closures & Lexical Scoping                              |    4 Dokumen    |  `Tersedia`  |
| [**04. Control Flow**](./docs/04-control-flow/)                   | Conditionals (`??`), Iteration Protocols (`for...of`), Exception Handling (`try/catch/finally`)          |    3 Dokumen    |  `Tersedia`  |
| [**05. Functions**](./docs/05-functions/)                         | Declarations vs Expressions, Arrow Functions, Default & Rest Params, HOF, IIFE                           |    4 Dokumen    |  `Tersedia`  |
| [**06. `this` Context**](./docs/06-this-context/)                 | Call-site Binding, Explicit Binding (`call`/`apply`/`bind`), Function Borrowing                          |    3 Dokumen    |  `Tersedia`  |
| [**07. Array & Object Methods**](./docs/07-array-object-methods/) | Pure Transformations (`map`/`filter`/`reduce`), Destructuring, Shallow vs Deep Clone (`structuredClone`) |    3 Dokumen    |  `Tersedia`  |
| [**08. DOM & Events**](./docs/08-dom-events/)                     | DOM Tree C++, Selectors, Event Listeners (`AbortSignal`), Bubbling & Event Delegation                    |    2 Dokumen    |  `Tersedia`  |
| [**09. Async JavaScript**](./docs/09-async-javascript/)           | Event Loop (Macrotask vs Microtask Queue), Promise State Machine, `async/await`                          |    2 Dokumen    |  `Tersedia`  |
| [**10. Fetch & Errors**](./docs/10-fetch-error-handling/)         | Streaming Response, JSON Deserialization, HTTP Status Errors, `AbortController` Timeout                  |    2 Dokumen    |  `Tersedia`  |
| [**11. ES Modules**](./docs/11-es-modules/)                       | Module Record Lifecycle, Live Read-Only Bindings, Static vs Dynamic `import()`                           |    1 Dokumen    |  `Tersedia`  |
| [**12. Browser DevTools**](./docs/12-browser-devtools/)           | Chrome DevTools Protocol, Breakpoints vs Console, Rendering Pipeline & Layout Thrashing                  |    2 Dokumen    |  `Tersedia`  |

👉 **Buka [`.agents/roadmap.md`](./.agents/roadmap.md)** untuk melihat rincian setiap topik dan menandai progres belajar harian Anda.

---

## ⚡ Alur Belajar yang Disarankan (Deliberate Practice)

Untuk menguasai materi secara optimal dan membangun _muscle memory_:

1. **Deep Reading (Pahami Ground Truth)**: Baca berkas modul di `docs/`. Pahami _mengapa_ peramban berperilaku demikian.
2. **Ketik Ulang Kode (Deliberate Typing)**: Jangan salin-tempel. Ketik contoh kode di editor teks dan jalankan.
3. **Eksperimen di DevTools**: Sengaja buat error di konsol untuk menguji batas kepastian (misal: memicu TDZ atau layout thrashing).
4. **Mulai Praktik UI**: Setelah menuntaskan **Modul 08 (DOM & Events)**, mulailah membuat komponen antarmuka mandiri (seperti Accordion, Modal, atau Theme Toggle). Setelah **Modul 10**, mulailah membuat project berbasis API (seperti Weather App atau User Finder).

---

## 📚 Standar & Sumber Resmi

100% materi dalam kurikulum ini diverifikasi terhadap dokumentasi resmi:

- [MDN Web Docs (JavaScript Guide & Reference)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [ECMA-262 ECMAScript Language Specification](https://tc39.es/ecma262/)
- [WHATWG HTML & DOM Living Standards](https://spec.whatwg.org/)
- [web.dev (Performance & Best Practices)](https://web.dev/)
