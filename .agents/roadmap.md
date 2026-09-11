# JavaScript Fundamentals

Repositori ini digunakan untuk mempelajari dan mempraktikkan dasar-dasar
JavaScript secara bertahap, sebagai fondasi sebelum masuk ke React.

## Roadmap JavaScript — Scope Frontend Developer

Sumber: roadmap.sh (JavaScript), digabung dengan roadmap Fase 2 pribadi,
difilter berdasarkan kategori yang paling sering dipakai dalam pekerjaan
frontend developer sehari-hari.

---

### 1. Introduction

- [x] [Apa itu JavaScript, cara menjalankan JavaScript](../docs/01-introduction/apa-itu-javascript-dan-cara-menjalankan-javascript.md)

### 2. Syntax, Data Types & Operators

- [x] [Primitive types (string, number, boolean, undefined, null, Symbol), Object](../docs/02-syntax-datatypes/01-primitive-types-dan-object.md)
- [x] [`typeof` operator](../docs/02-syntax-datatypes/02-typeof-operator.md)
- [x] [Type Casting — Explicit vs Implicit (Coercion vs Conversion)](../docs/02-syntax-datatypes/03-type-casting-coercion-vs-conversion.md)
- [x] [Equality: `==` vs `===` (praktis)](../docs/02-syntax-datatypes/04-equality-strict-vs-loose.md)

### 3. Variables & Scope

- [x] [`var`, `let`, `const`](../docs/03-variables-scope/01-var-let-const.md)
- [x] [Hoisting](../docs/03-variables-scope/02-hoisting.md)
- [x] [Block / Function / Global scope](../docs/03-variables-scope/03-block-function-global-scope.md)
- [x] [Closures & Lexical Scoping](../docs/03-variables-scope/04-closures-dan-lexical-scoping.md)

### 4. Control Flow

- [x] [Conditional statements (if/else, switch)](../docs/04-control-flow/01-conditionals.md)
- [x] [Loops (for, while, for...of, for...in, break/continue)](../docs/04-control-flow/02-loops.md)
- [x] [Exception handling (try/catch/finally, throw, Error Objects)](../docs/04-control-flow/03-exception-handling.md)

### 5. Functions

- [x] [Function declaration vs expression, arrow function](../docs/05-functions/01-declarations-expressions-arrow.md)
- [x] [Default Params, Rest Params](../docs/05-functions/02-params-default-rest.md)
- [x] [Higher-order function](../docs/05-functions/03-higher-order-functions.md)
- [x] [IIFE](../docs/05-functions/04-iife.md)

### 6. `this` Keyword & Context Binding

- [x] [`this` di method, function, alone, event handler, arrow function](../docs/06-this-context/01-this-keyword-binding.md)
- [x] [Explicit Binding — call / apply / bind](../docs/06-this-context/02-explicit-binding-call-apply-bind.md)
- [x] [Function Borrowing](../docs/06-this-context/03-function-borrowing.md)

### 7. Array & Object Methods

- [x] [`map`, `filter`, `reduce`](../docs/07-array-object-methods/01-map-filter-reduce.md)
- [x] [Destructuring](../docs/07-array-object-methods/02-destructuring.md)
- [x] [Spread / Rest](../docs/07-array-object-methods/03-spread-rest.md)

### 8. DOM Manipulation & Events

- [x] [Query selector, event listener](../docs/08-dom-events/01-query-selectors-listeners.md)
- [x] [Event delegation, event bubbling](../docs/08-dom-events/02-event-delegation-bubbling.md)

### 9. Asynchronous JavaScript

- [x] [Event Loop, `setTimeout` / `setInterval`](../docs/09-async-javascript/01-event-loop-timers.md)
- [x] [Callback → Promise → async/await](../docs/09-async-javascript/02-callbacks-promises-async-await.md)

### 10. Fetch API & Error Handling

- [x] [Fetch API dasar & JSON handling](../docs/10-fetch-error-handling/01-fetch-api-json.md)
- [x] [Error handling pada request](../docs/10-fetch-error-handling/02-request-error-handling.md)

### 11. ES Modules

- [x] [`import` / `export`](../docs/11-es-modules/01-es-modules-import-export.md)

### 12. Browser DevTools

- [x] [Debugging issues (breakpoints, console methods)](../docs/12-browser-devtools/01-console-breakpoints-debugging.md)
- [x] [Debugging performance dasar](../docs/12-browser-devtools/02-performance-debugging-dasar.md)

---

## Penting (lanjut setelah Core selesai)

- [ ] Classes (ES6)
- [ ] Object Prototype & Prototypal Inheritance
- [ ] Iterators & Generators
- [ ] Map, Set
- [ ] Recursion
- [ ] LocalStorage / SessionStorage
- [ ] Basic design patterns (module, observer)
- [ ] DSA dasar — intuisi Big-O, latihan array/string ringan

## Di Luar Scope (tidak disertakan dulu)

TypeScript dasar, Web Components / Custom Elements, Regular Expressions,
History/Versions JavaScript, CommonJS, XMLHTTPRequest, BigInt & Bitwise
Operators, Typed Arrays, Equality Algorithms detail (`Object.is`,
`SameValueZero`, dll), Memory Management & Debugging Memory Leaks,
Callback Hell, WeakMap/WeakSet.
