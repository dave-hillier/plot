import fs from "fs";
import {globSync} from "glob";

const files = globSync("docs/**/*.mdx");
let totalChanges = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf-8");
  const original = content;

  // Fix 1: Remove remaining // comments between JSX attributes (on their own lines)
  const lines = content.split("\n");
  const filtered = [];
  let inJSXTag = false;
  let tagDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track if we're inside a JSX tag
    const openTags = (line.match(/<[A-Z]\w*/g) || []).length;
    const closeTags = (line.match(/<\/[A-Z]\w*>/g) || []).length;
    const selfClose = (line.match(/\/>/g) || []).length;

    tagDepth += openTags - closeTags - selfClose;
    inJSXTag = tagDepth > 0;

    // Skip // comment lines that appear between JSX attributes
    if (trimmed.startsWith("//") && !trimmed.startsWith("// TODO:")) {
      const prevLine = i > 0 ? lines[i - 1] : "";
      const nextLine = i < lines.length - 1 ? lines[i + 1] : "";

      // If we're clearly between JSX attributes, skip the comment
      if (inJSXTag ||
          (prevLine.includes("=") && nextLine.trim().match(/^\w+=/)) ||
          (prevLine.trim().match(/^(x|y|data|fill|stroke|r)\d?="/) && nextLine.trim().match(/^(x|y|data|fill|stroke|r)\d?="/))) {
        continue;
      }
    }

    filtered.push(line);
  }
  content = filtered.join("\n");

  // Fix 2: Fix numeric attributes in SVG tags (should be {12} not =12)
  // Pattern: <svg width=12 height=12 => <svg width={12} height={12}
  content = content.replace(/<svg([^>]*)\s+width=(\d+)/g, "<svg$1 width={$2}");
  content = content.replace(/<svg([^>]*)\s+height=(\d+)/g, "<svg$1 height={$2}");
  // Also fix viewBox with numeric values
  content = content.replace(/viewBox="(-?\d+\s+-?\d+\s+\d+\s+\d+)"/g, 'viewBox="$1"'); // keep as string, it's correct

  // Fix 3: Add missing closing > on Plot tags
  // Pattern: <Plot ... }}\n followed by <Geo or other component
  content = content.replace(/(<Plot[^>]*\}\})\s*\n(\s*<[A-Z])/g, "$1>\n$2");

  // Fix 4: Fix escaped markdown braces that cause parse errors
  // Unescape {*name*: *value*} patterns that appear in markdown text
  // But we need to be careful - only fix them if they're causing errors
  // Look for patterns in bullet points or regular text
  content = content.replace(/- a \\\{(\*[^*]+\*[^}]+)\\\}/g, "- a {$1}");

  // Actually, the error says "Could not parse expression" which means
  // the {*channel*, *order*} is being treated as a JSX expression
  // We need to escape it better or avoid the issue
  // Let's try replacing with backticks
  content = content.replace(/\{(\*\w+\*(?:,\s*\*\w+\*)*)\}/g, "`{$1}`");

  // Fix 5: Clean up double TODO comments
  content = content.replace(/\{\/\* TODO: \{\/\* TODO:/g, "{/* TODO:");

  if (content !== original) {
    fs.writeFileSync(file, content, "utf-8");
    totalChanges++;
    console.log(`Fixed: ${file}`);
  }
}

console.log(`\n✅ Fixed ${totalChanges} files out of ${files.length} total`);
