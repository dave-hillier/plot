import fs from "fs";
import {globSync} from "glob";

const files = globSync("docs/**/*.mdx");
let totalChanges = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf-8");
  const original = content;

  // Fix 1: Remove VitePress heading anchors {#...}
  // Pattern: On lines starting with #, remove ` {#...}` at end of line
  content = content.replace(/^(#+\s+.*?)\s+\{#[^}]+\}\s*$/gm, "$1");

  // Fix 2: Fix `// TODO: manually convert:` blocks at top of files
  // Wrap consecutive `// TODO:` lines in {/* ... */}
  const lines = content.split("\n");
  const newLines = [];
  let i = 0;

  while (i < lines.length) {
    // Check if this is a TODO comment line (but not already wrapped)
    if (lines[i].trim().startsWith("// TODO:") && !lines[i - 1]?.includes("{/*")) {
      // Find consecutive TODO lines
      const todoLines = [];
      while (i < lines.length && lines[i].trim().startsWith("// TODO:")) {
        todoLines.push(lines[i]);
        i++;
      }
      // Wrap them in JSX comment
      newLines.push("{/*");
      newLines.push(...todoLines);
      newLines.push("*/}");
    } else {
      newLines.push(lines[i]);
      i++;
    }
  }
  content = newLines.join("\n");

  // Fix 3: Fix inline `//` comments in JSX tags - IMPROVED VERSION
  // We need to be more careful here. Only remove // comments from inside JSX tags
  // Look for lines that have unclosed JSX tags (< without matching >) and remove // comments
  const fixedLines = content.split("\n").map((line, idx) => {
    // Skip lines that are already comments, imports, or code blocks
    if (line.trim().startsWith("//") ||
        line.trim().startsWith("import") ||
        line.trim().startsWith("```") ||
        line.trim().startsWith("{/*")) {
      return line;
    }

    // Only process lines that look like JSX with attributes
    // Check for pattern like: <Tag ... // comment
    if (line.includes("<") && line.includes("//")) {
      // Find the position of // and check if it's in a JSX context
      const commentPos = line.indexOf("//");
      const beforeComment = line.substring(0, commentPos);

      // Check if we're inside a JSX tag (has < but no closing >)
      const lastOpenTag = beforeComment.lastIndexOf("<");
      const lastCloseTag = beforeComment.lastIndexOf(">");

      if (lastOpenTag > lastCloseTag) {
        // We're inside a JSX tag, check if // is outside strings and expressions

        // Count quotes to see if we're in a string
        const doubleQuotes = (beforeComment.match(/"/g) || []).length;
        const singleQuotes = (beforeComment.match(/'/g) || []).length;
        const backticks = (beforeComment.match(/`/g) || []).length;

        // Count braces to see if we're in an expression
        const openBraces = (beforeComment.match(/\{/g) || []).length;
        const closeBraces = (beforeComment.match(/\}/g) || []).length;

        // If quotes and braces are balanced, we're outside strings/expressions
        if (doubleQuotes % 2 === 0 && singleQuotes % 2 === 0 &&
            backticks % 2 === 0 && openBraces === closeBraces) {
          // Safe to remove the // comment
          return beforeComment.trimEnd();
        }
      }
    }

    return line;
  });
  content = fixedLines.join("\n");

  // Fix 4: Fix `:attr=` Vue binding leftovers - IMPROVED
  // Only replace : prefix when it's clearly a Vue binding inside JSX
  // Pattern: space or < followed by :attributeName=
  content = content.replace(/([<\s]):(\w+)=/g, "$1$2=");

  // Fix 5: Fix SVG attributes - convert kebab-case to camelCase in JSX
  content = content.replace(/stroke-width=/g, "strokeWidth=");
  content = content.replace(/stroke-dasharray=/g, "strokeDasharray=");
  content = content.replace(/fill-opacity=/g, "fillOpacity=");
  content = content.replace(/stroke-opacity=/g, "strokeOpacity=");

  // Fix 6: Fix `<Plot (` pattern - these are broken IIFE conversions
  content = content.replace(/<Plot\s+\(/g, "{/* TODO: manually convert this plot */}\n{/* <Plot ( */}");

  // Fix 7: Remove <style> blocks (including <style module>)
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "");

  // Fix 8: Comment out <PlotRender references
  content = content.replace(/<PlotRender\b/g, "{/* TODO: <PlotRender");
  content = content.replace(/<\/PlotRender>/g, "</PlotRender> */}");

  // Fix 9: Remove <template> blocks (VitePress specific)
  content = content.replace(/<template>[\s\S]*?<\/template>/g, "");

  // Fix 10: Remove v-for and v-if attributes (Vue directives)
  content = content.replace(/\s+v-for="[^"]*"/g, "");
  content = content.replace(/\s+v-if="[^"]*"/g, "");

  // Fix 11: Fix broken regex patterns in JSX
  // Pattern: /} something /.test becomes / something /.test
  content = content.replace(/\/\}\s+([^/]+)\s+\/\.test/g, "/ $1 /.test");

  // Fix 12: Fix className with $ interpolation
  // className="$style.oneline" should just be a string
  content = content.replace(/className="\$style\.(\w+)"/g, 'className="$1"');

  // Fix 13: Fix template literal interpolations in attributes
  // href="`${href}#${name}`" should be href={`${href}#${name}`}
  content = content.replace(/(\w+)="`([^`]*\$\{[^`]*)`"/g, "$1={`$2`}");

  // Fix 14: Fix href="href" to href={href}
  content = content.replace(/href="href"/g, "href={href}");

  // Fix 15: Fix unclosed Plot tags (missing >)
  // Look for <Plot ... r={{...}}" with no closing >
  content = content.replace(/(<Plot[^>]*\}\})(\s+<)/g, "$1>$2");

  if (content !== original) {
    fs.writeFileSync(file, content, "utf-8");
    totalChanges++;
    console.log(`Fixed: ${file}`);
  }
}

console.log(`\n✅ Fixed ${totalChanges} files out of ${files.length} total`);
