---
title: "Optimizing React Re-renders with useMemo and useCallback"
description: "Learn how to prevent unnecessary re-renders in React applications using memoization hooks"
date: 2024-12-15
---

React's reconciliation algorithm is efficient, but unnecessary re-renders can still hurt performance. Here's how to optimize them.

## The Problem

Every time a parent component re-renders, all child components re-render too:

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  const config = { theme: "dark" };
  const handleClick = () => console.log("clicked");

  return <Child config={config} onClick={handleClick} />;
}
```

Even if `Child` uses `React.memo`, it still re-renders because `config` and `handleClick` are recreated on every render.

## The Solution

Use `useMemo` for object references and `useCallback` for functions:

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  const config = useMemo(() => ({ theme: "dark" }), []);
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return <Child config={config} onClick={handleClick} />;
}

const Child = memo(({ config, onClick }) => {
  return <button onClick={onClick}>{config.theme}</button>;
});
```

Now `Child` only re-renders when `config` or `onClick` actually change.

## When to Use

Don't optimize prematurely. Use these hooks when:

- Passing props to memoized components
- Dependencies in useEffect cause unnecessary runs
- Creating expensive computed values

Profile first, optimize second.
