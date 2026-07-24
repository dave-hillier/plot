import {defineConfig} from "vite";
import path from "node:path";
import fs from "node:fs";
import meta from "./package.json" with {type: "json"};

// Builds the standalone UMD bundle (dist/replot.umd.js) for <script src>
// usage, as documented in docs/getting-started. Vite is used rather than plain
// rollup because the source is TypeScript/TSX with .js import specifiers, and
// the imperative plot() renders through React, which must be bundled in (a
// script-tag consumer has no module resolution). d3 stays external, matching
// the documented two-script setup (d3.js + plot.js). Run twice: a plain pass
// and a MINIFY=1 pass for the .min.js variant.
const filename = meta.name.split("/").pop();
const minify = process.env.MINIFY === "1";

const copyrights = fs
  .readFileSync(path.resolve(__dirname, "LICENSE"), "utf-8")
  .split(/\n/g)
  .filter((line) => /^copyright\s+/i.test(line))
  .map((line) => line.replace(/^copyright\s+/i, ""));

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: false,
    minify: minify ? "esbuild" : false,
    lib: {
      entry: path.resolve(__dirname, "bundle.js"),
      name: "Plot",
      formats: ["umd"],
      fileName: () => `${filename}.umd${minify ? ".min" : ""}.js`
    },
    rollupOptions: {
      external: ["d3"],
      output: {
        globals: {d3: "d3"},
        banner: `// ${meta.name} v${meta.version} Copyright ${copyrights.join(", ")}`
      }
    }
  }
});
