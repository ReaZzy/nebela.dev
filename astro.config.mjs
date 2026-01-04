// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { visit } from "unist-util-visit";

// Custom rehype plugin to add anchors to headings
function rehypeHeadingAnchors() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (["h1", "h2", "h3"].includes(node.tagName)) {
        const text = node.children
          .filter((child) => child.type === "text")
          .map((child) => child.value)
          .join("");

        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");

        node.properties = node.properties || {};
        node.properties.id = id;
        node.properties.className = "heading-with-anchor";

        const anchor = {
          type: "element",
          tagName: "a",
          properties: {
            href: `#${id}`,
            className: "heading-anchor",
            ariaLabel: `Link to ${text}`,
          },
          children: [{ type: "text", value: "#" }],
        };

        node.children.push(anchor);
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://nebela.dev",
  integrations: [react()],

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  markdown: {
    rehypePlugins: [rehypeHeadingAnchors],
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) {
                return "react-vendor";
              }
            }
          },
        },
      },
    },
  },
});
