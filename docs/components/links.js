import {readdir, readFile, stat} from "fs/promises";

// MDX pages carry import/export statements and JSX tags that are not prose;
// remove them so header, anchor, and link extraction sees only the markdown.
// Explicit anchors written as {/* {#name} */} comments survive tag removal.
function stripMdx(text) {
  return text.replace(/^(?:import|export) [^\n]*\n/gm, "").replace(/<\/?[A-Za-z][^<>]*>/g, "");
}

// Anchors can be derived from headers, or explicitly written as {#names}.
export function getAnchors(text) {
  text = stripMdx(text);
  const anchors = [];
  for (const [, header] of text.matchAll(/^#+ ([*\w][*().,\w\d -]+)\n/gm)) {
    anchors.push(
      header
        .replace(/[^\w\d\s]+/g, " ")
        .trim()
        .replace(/ +/g, "-")
        .toLowerCase()
    );
  }
  for (const [, anchor] of text.matchAll(/ \{#([\w\d-]+)\}/g)) {
    anchors.push(anchor);
  }
  return anchors;
}

// Internal links.
export function getLinks(file, text) {
  text = stripMdx(text);
  const links = [];
  for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const [, link] = match;
    if (/^\w+:/.test(link)) continue; // absolute link with protocol
    const {pathname, hash} = new URL(link, new URL(file, "https://example.com/"));
    links.push({pathname, hash});
  }
  return links;
}

// In source files, ignore comments.
export async function readMarkdownSource(f) {
  return (await readFile(f, "utf8")).replaceAll(/<!-- .*? -->/gs, "");
}

// Recursively find all files with the given extension in the directory.
export async function* readMarkdownFiles(root, extension = ".md", subpath = "/") {
  for (const fname of await readdir(root + subpath)) {
    if (!fname.includes(".") && (await stat(root + subpath + fname)).isDirectory()) {
      yield* readMarkdownFiles(root, extension, subpath + fname + "/");
    } else if (fname.endsWith(extension)) {
      yield subpath + fname;
    }
  }
}
