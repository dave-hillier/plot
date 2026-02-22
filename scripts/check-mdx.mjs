import {compile} from "@mdx-js/mdx";
import fs from "fs";
import {globSync} from "glob";

const files = globSync("docs/**/*.mdx");
const categories = {};

for (const file of files) {
  try {
    const content = fs.readFileSync(file, "utf-8");
    await compile(content, {jsx: true});
  } catch (e) {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");

    let lineNum = e.line || -1;
    let lineContent = lineNum > 0 ? (lines[lineNum - 1] || "") : "";

    const msgShort = e.message.split("\n")[0].slice(0, 80);
    const key = msgShort.slice(0, 60);
    if (!categories[key]) categories[key] = [];
    categories[key].push({file, line: lineNum, lineContent: lineContent.slice(0, 140)});
  }
}

for (const [cat, items] of Object.entries(categories)) {
  console.log(`\n=== ${cat} (${items.length} files) ===`);
  for (const item of items.slice(0, 4)) {
    console.log(`  ${item.file}:${item.line}`);
    if (item.lineContent) console.log(`    ${item.lineContent}`);
  }
  if (items.length > 4) console.log(`  ... and ${items.length - 4} more`);
}

console.log(`\n${Object.values(categories).flat().length} files with errors out of ${files.length}`);
