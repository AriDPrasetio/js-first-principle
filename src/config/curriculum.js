// Inisialisasi Berkas
export const curriculum = [
  {
    id: "01",
    slug: "01-introduction",
    title: "1. Pengenalan JavaScript",
    topics: [
      {
        slug: "apa-itu-javascript-dan-cara-menjalankan-javascript",
        title: "Apa Itu JavaScript dan Cara Menjalankannya",
        paths: {
          beginner:
            "docs-beginner/01-introduction/apa-itu-javascript-dan-cara-menjalankan-javascript.md",
          deepDive:
            "docs/01-introduction/apa-itu-javascript-dan-cara-menjalankan-javascript.md",
        },
      },
    ],
  },
  {
    id: "02",
    slug: "02-syntax-datatypes",
    title: "2. Sintaks dan Tipe Data",
    topics: [
      {
        slug: "00-expressions-vs-statements",
        title: "Expressions vs Statements",
        paths: {
          beginner:
            "docs-beginner/02-syntax-datatypes/00-expressions-vs-statements.md",
          deepDive: "docs/02-syntax-datatypes/00-expressions-vs-statements.md",
        },
      },
      {
        slug: "01-primitive-types-dan-object",
        title: "Primitive Types dan Object",
        paths: {
          beginner:
            "docs-beginner/02-syntax-datatypes/01-primitive-types-dan-object.md",
          deepDive: "docs/02-syntax-datatypes/01-primitive-types-dan-object.md",
        },
      },
      {
        slug: "02-typeof-operator",
        title: "Typeof Operator",
        paths: {
          beginner: "docs-beginner/02-syntax-datatypes/02-typeof-operator.md",
          deepDive: "docs/02-syntax-datatypes/02-typeof-operator.md",
        },
      },
      {
        slug: "03-type-casting-coercion-vs-conversion",
        title: "Coercion vs Conversion",
        paths: {
          beginner:
            "docs-beginner/02-syntax-datatypes/03-type-casting-coercion-vs-conversion.md",
          deepDive:
            "docs/02-syntax-datatypes/03-type-casting-coercion-vs-conversion.md",
        },
      },
      {
        slug: "04-equality-strict-vs-loose",
        title: "Equality (Strict vs Loose)",
        paths: {
          beginner:
            "docs-beginner/02-syntax-datatypes/04-equality-strict-vs-loose.md",
          deepDive: "docs/02-syntax-datatypes/04-equality-strict-vs-loose.md",
        },
      },
    ],
  },
  {
    id: "03",
    slug: "03-variables-scope",
    title: "3. Variables dan Scope",
    topics: [
      {
        slug: "01-var-let-const",
        title: "Var, Let, dan Const",
        paths: {
          beginner: "docs-beginner/03-variables-scope/01-var-let-const.md",
          deepDive: "docs/03-variables-scope/01-var-let-const.md",
        },
      },
      {
        slug: "02-hoisting",
        title: "Hoisting",
        paths: {
          beginner: "docs-beginner/03-variables-scope/02-hoisting.md",
          deepDive: "docs/03-variables-scope/02-hoisting.md",
        },
      },
      {
        slug: "03-block-function-global-scope",
        title: "Block, Function, dan Global Scope",
        paths: {
          beginner:
            "docs-beginner/03-variables-scope/03-block-function-global-scope.md",
          deepDive: "docs/03-variables-scope/03-block-function-global-scope.md",
        },
      },
      {
        slug: "04-closures-dan-lexical-scoping",
        title: "Closures dan Lexical Scoping",
        paths: {
          beginner:
            "docs-beginner/03-variables-scope/04-closures-dan-lexical-scoping.md",
          deepDive:
            "docs/03-variables-scope/04-closures-dan-lexical-scoping.md",
        },
      },
    ],
  },
  {
    id: "04",
    slug: "04-control-flow",
    title: "4. Control Flow",
    topics: [
      {
        slug: "01-conditionals",
        title: "Conditionals",
        paths: {
          beginner: "docs-beginner/04-control-flow/01-conditionals.md",
          deepDive: "docs/04-control-flow/01-conditionals.md",
        },
      },
      {
        slug: "02-loops",
        title: "Loops",
        paths: {
          beginner: "docs-beginner/04-control-flow/02-loops.md",
          deepDive: "docs/04-control-flow/02-loops.md",
        },
      },
      {
        slug: "03-exception-handling",
        title: "Exception Handling",
        paths: {
          beginner: "docs-beginner/04-control-flow/03-exception-handling.md",
          deepDive: "docs/04-control-flow/03-exception-handling.md",
        },
      },
    ],
  },
  {
    id: "05",
    slug: "05-functions",
    title: "5. Functions",
    topics: [
      {
        slug: "01-declarations-expressions-arrow",
        title: "Declarations, Expressions, Arrow",
        paths: {
          beginner:
            "docs-beginner/05-functions/01-declarations-expressions-arrow.md",
          deepDive: "docs/05-functions/01-declarations-expressions-arrow.md",
        },
      },
      {
        slug: "02-params-default-rest",
        title: "Params, Default, Rest",
        paths: {
          beginner: "docs-beginner/05-functions/02-params-default-rest.md",
          deepDive: "docs/05-functions/02-params-default-rest.md",
        },
      },
      {
        slug: "03-higher-order-functions",
        title: "Higher Order Functions",
        paths: {
          beginner: "docs-beginner/05-functions/03-higher-order-functions.md",
          deepDive: "docs/05-functions/03-higher-order-functions.md",
        },
      },
      {
        slug: "04-iife",
        title: "IIFE",
        paths: {
          beginner: "docs-beginner/05-functions/04-iife.md",
          deepDive: "docs/05-functions/04-iife.md",
        },
      },
    ],
  },
  {
    id: "06",
    slug: "06-this-context",
    title: "6. This dan Context",
    topics: [
      {
        slug: "01-this-keyword-binding",
        title: "This Keyword Binding",
        paths: {
          beginner: "docs-beginner/06-this-context/01-this-keyword-binding.md",
          deepDive: "docs/06-this-context/01-this-keyword-binding.md",
        },
      },
      {
        slug: "02-explicit-binding-call-apply-bind",
        title: "Explicit Binding",
        paths: {
          beginner:
            "docs-beginner/06-this-context/02-explicit-binding-call-apply-bind.md",
          deepDive:
            "docs/06-this-context/02-explicit-binding-call-apply-bind.md",
        },
      },
      {
        slug: "03-function-borrowing",
        title: "Function Borrowing",
        paths: {
          beginner: "docs-beginner/06-this-context/03-function-borrowing.md",
          deepDive: "docs/06-this-context/03-function-borrowing.md",
        },
      },
    ],
  },
  {
    id: "07",
    slug: "07-array-object-methods",
    title: "7. Array, dan Object Methods",
    topics: [
      {
        slug: "01-map-filter-reduce",
        title: "Map, Filter, Reduce",
        paths: {
          beginner:
            "docs-beginner/07-array-object-methods/01-map-filter-reduce.md",
          deepDive: "docs/07-array-object-methods/01-map-filter-reduce.md",
        },
      },
      {
        slug: "02-destructuring",
        title: "Destructuring",
        paths: {
          beginner: "docs-beginner/07-array-object-methods/02-destructuring.md",
          deepDive: "docs/07-array-object-methods/02-destructuring.md",
        },
      },
      {
        slug: "03-spread-rest",
        title: "Spread dan Rest",
        paths: {
          beginner: "docs-beginner/07-array-object-methods/03-spread-rest.md",
          deepDive: "docs/07-array-object-methods/03-spread-rest.md",
        },
      },
    ],
  },
  {
    id: "08",
    slug: "08-dom-events",
    title: "8. DOM dan Events",
    topics: [
      {
        slug: "01-query-selectors-listeners",
        title: "Query Selectores dan Listeners",
        paths: {
          beginner:
            "docs-beginner/08-dom-events/01-query-selectors-listeners.md",
          deepDive: "docs/08-dom-events/01-query-selectors-listeners.md",
        },
      },
      {
        slug: "02-event-delegation-bubbling",
        title: "Event Delegation dan Bubbling",
        paths: {
          beginner:
            "docs-beginner/08-dom-events/02-event-delegation-bubbling.md",
          deepDive: "docs/08-dom-events/02-event-delegation-bubbling.md",
        },
      },
    ],
  },
  {
    id: "09",
    slug: "09-async-javascript",
    title: "9. Async JavaScript",
    topics: [
      {
        slug: "01-event-loop-timers",
        title: "Event Loop dan Timers",
        paths: {
          beginner: "docs-beginner/09-async-javascript/01-event-loop-timers.md",
          deepDive: "docs/09-async-javascript/01-event-loop-timers.md",
        },
      },
      {
        slug: "02-callbacks-promises-async-await",
        title: "Callbacks, Promises, dan Async Await",
        paths: {
          beginner:
            "docs-beginner/09-async-javascript/02-callbacks-promises-async-await.md",
          deepDive:
            "docs/09-async-javascript/02-callbacks-promises-async-await.md",
        },
      },
    ],
  },
  {
    id: "10",
    slug: "10-fetch-error-handling",
    title: "10. Fetch API dan Error Handling",
    topics: [
      {
        slug: "01-fetch-api-json",
        title: "Fetch API dan JSON",
        paths: {
          beginner:
            "docs-beginner/10-fetch-error-handling/01-fetch-api-json.md",
          deepDive: "docs/10-fetch-error-handling/01-fetch-api-json.md",
        },
      },
      {
        slug: "02-request-error-handling",
        title: "Request Error Handling",
        paths: {
          beginner:
            "docs-beginner/10-fetch-error-handling/02-request-error-handling.md",
          deepDive: "docs/10-fetch-error-handling/02-request-error-handling.md",
        },
      },
    ],
  },
  {
    id: "11",
    slug: "11-es-modules",
    title: "11. ES Modules",
    topics: [
      {
        slug: "01-es-modules-import-export",
        title: "ES Modules Import dan Export",
        paths: {
          beginner:
            "docs-beginner/11-es-modules/01-es-modules-import-export.md",
          deepDive: "docs/11-es-modules/01-es-modules-import-export.md",
        },
      },
    ],
  },
  {
    id: "12",
    slug: "12-browser-devtools",
    title: "12. Browser DevTools",
    topics: [
      {
        slug: "01-console-breakpoints-debugging",
        title: "Console dan Breakpoints Debugging",
        paths: {
          beginner:
            "docs-beginner/12-browser-devtools/01-console-breakpoints-debugging.md",
          deepDive:
            "docs/12-browser-devtools/01-console-breakpoints-debugging.md",
        },
      },
      {
        slug: "02-performance-debugging-dasar",
        title: "Performance Debugging Dasar",
        paths: {
          beginner:
            "docs-beginner/12-browser-devtools/02-performance-debugging-dasar.md",
          deepDive:
            "docs/12-browser-devtools/02-performance-debugging-dasar.md",
        },
      },
    ],
  },
];

// fungsi getTopicBySlug
export function getTopicBySlug(moduleSlug, topicSlug) {
  const foundModule = curriculum.find((m) => m.slug === moduleSlug);
  if (!foundModule) return null;
  const foundTopic = foundModule.topics.find((t) => t.slug === topicSlug);
  return foundTopic || null;
}
// fungsi getAllTopics
export function getAllTopics() {
  return curriculum.reduce((acc, currModule) => {
    const topicsWithModuleInfo = currModule.topics.map((topic) => ({
      ...topic,
      moduleSlug: currModule.slug,
      moduleTitle: currModule.title,
    }));
    return [...acc, ...topicsWithModuleInfo];
  }, []);
}
