import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkPlotSource from "./plugins/remark-plot-source.js";
import path from "node:path";

export default defineConfig({
  root: path.resolve(__dirname),
  publicDir: path.resolve(__dirname, "public"),
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [remarkGfm, remarkFrontmatter, remarkPlotSource]
      })
    },
    react({include: /\.(mdx|js|jsx|ts|tsx)$/})
  ],
  resolve: {
    alias: {
      "replot/react": path.resolve(__dirname, "../src/react/index.tsx"),
      replot: path.resolve(__dirname, "../src/index.js")
    },
    dedupe: ["react", "react-dom"]
  },
  optimizeDeps: {
    exclude: ["fsevents"]
  },
  server: {
    port: 3000
  },
  build: {
    outDir: path.resolve(__dirname, "../dist-docs"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/react") || id.includes("/node_modules/scheduler")) return "react-vendor";
          if (id.includes("/node_modules/d3") || id.includes("/node_modules/internmap")) return "d3-vendor";
        }
      }
    }
  }
});
