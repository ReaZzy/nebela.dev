---
title: "CSS Container Queries: Responsive Components"
description: "Build truly responsive components with CSS Container Queries"
date: 2024-11-20
---

Container queries let components respond to their container's size instead of the viewport. This enables true component-level responsiveness.

## The Old Way: Media Queries

Media queries respond to viewport size:

```css
.card {
  padding: 1rem;
}

@media (min-width: 768px) {
  .card {
    padding: 2rem;
  }
}
```

This works, but what if the card is in a sidebar on a wide screen? It gets desktop styling even though its container is narrow.

## The New Way: Container Queries

Define a container and query its size:

```css
.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}

.card {
  padding: 1rem;
}

@container sidebar (min-width: 400px) {
  .card {
    padding: 2rem;
  }
}
```

Now the card responds to the sidebar's width, not the viewport.

## Practical Example

```html
<div class="container">
  <div class="card">
    <img src="photo.jpg" alt="" />
    <div class="content">
      <h2>Title</h2>
      <p>Description</p>
    </div>
  </div>
</div>
```

```css
.container {
  container-type: inline-size;
}

.card {
  display: flex;
  flex-direction: column;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }

  .card img {
    width: 200px;
  }
}
```

The card layout changes based on its container, making it truly reusable anywhere.

## Browser Support

Container queries are supported in all modern browsers since 2023. Use them today!
