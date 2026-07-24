import assert from "assert";
import {readMarkdownFiles, readMarkdownSource, getAnchors, getLinks} from "../docs/components/links.js";

it("documentation links point to existing internal anchors", async () => {
  const root = "docs";

  // Crawl all shipped pages, read their links and anchors.
  const anchors = new Map();
  const links = [];
  for await (const file of readMarkdownFiles(root, ".mdx")) {
    const text = await readMarkdownSource(root + file);
    anchors.set(file, getAnchors(text));
    for (const {pathname, hash} of getLinks(file, text)) {
      links.push({source: file, target: pathname, hash});
    }
  }

  // Check for broken links.
  let errors = [];
  for (let {source, target, hash} of links) {
    let page;
    if (target.endsWith(".mdx")) {
      page = target; // hash-only links resolve to the source page itself
    } else {
      if (!target.endsWith(".md")) {
        errors.push(`- ${source} points to ${target} instead of ${target}.md.`);
        target += ".md";
      }
      // Cross-page links use the .md convention; the shipped page is the .mdx twin.
      page = `${target}x`;
    }
    if (!anchors.has(page)) {
      errors.push(`- ${source} points to missing page ${target}.`);
      continue;
    }
    if (!hash || anchors.get(page).includes(hash.slice(1))) continue;
    errors.push(`- ${source} points to missing ${target}${hash}.`);
  }
  assert(errors.length === 0, new Error(`${errors.length} broken links:\n${errors.join("\n")}`));
});
