import {execSync} from "node:child_process";
import {existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";

// The getting-started download links are served from docs/public/plot.js and
// docs/public/plot.min.js, which are symlinks into dist/. docs:build runs
// yarn bundle unconditionally, but doing so on every docs:dev start would slow
// dev startup, so this guard builds the UMD bundle only when either target is
// missing; it runs before vite in the docs:dev script.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const targets = ["dist/replot.umd.js", "dist/replot.umd.min.js"];
const missing = targets.filter((target) => !existsSync(path.join(root, target)));

if (missing.length > 0) {
  console.log(`missing ${missing.join(", ")}; running yarn bundle`);
  execSync("yarn bundle", {cwd: root, stdio: "inherit"});
} else {
  console.log(`found ${targets.join(", ")}; skipping yarn bundle`);
}
