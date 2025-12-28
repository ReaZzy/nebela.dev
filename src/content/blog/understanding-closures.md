---
title: "Understanding JavaScript Closures"
description: "A deep dive into closures and how they work in JavaScript"
date: 2024-12-01
---

Closures are one of JavaScript's most powerful features. They allow functions to access variables from their outer scope even after that scope has finished executing.

## What is a Closure?

A closure is created when a function is defined inside another function:

```javascript
function outer() {
  const message = "Hello";

  function inner() {
    console.log(message);
  }

  return inner;
}

const greet = outer();
greet(); // "Hello"
```

Even though `outer()` has finished executing, `inner()` still has access to `message`.

## Practical Example: Private Variables

Closures enable data privacy in JavaScript:

```javascript
function createCounter() {
  let count = 0;

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
console.log(counter.getCount()); // 2
console.log(counter.count); // undefined - private!
```

The `count` variable is only accessible through the returned methods.

## Common Pitfall: Loops

Be careful with closures in loops:

```javascript
// ❌ Wrong
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Logs: 3, 3, 3

// ✅ Correct
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Logs: 0, 1, 2
```

Using `let` creates a new binding for each iteration, while `var` doesn't.
