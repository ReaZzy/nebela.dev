// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://nebela.dev",
  integrations: [react()],

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
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

  adapter: cloudflare()
});