import {writeFile} from "fs/promises";
import {fileURLToPath} from "url";
import path from "path";
import loader from "../data/api.data.js";

// The API index is generated from the TypeScript declarations by
// docs/data/api.data.ts, a build-time-only module (it uses ts-morph and the
// filesystem, so it must never be imported by page code). This script runs the
// loader and writes the result as JSON for docs/api.mdx to import; it runs
// before vite in the docs:dev and docs:build scripts.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
process.chdir(root);
const data = await loader.load();
const out = path.join(root, "docs/data/api-index.json");
await writeFile(out, JSON.stringify(data, null, 2));
console.log(`wrote ${out}: ${data.methods.length} methods, ${data.options.length} option groups`);
