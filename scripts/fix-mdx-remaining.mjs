import fs from "fs";
import {globSync} from "glob";

const files = globSync("docs/**/*.mdx");
let totalChanges = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf-8");
  const original = content;

  // Fix 1: Triple braces in style attributes
  // {{{borderBottom: ...}}} => {{borderBottom: ...}}
  content = content.replace(/style=\{\{\{([^}]+)\}\}\}/g, "style={{$1}}");

  // Fix 2: Template literal quotes inside style attributes
  // {{borderBottom: "`solid...`"}} => {{borderBottom: `solid...`}}
  content = content.replace(/\{\{([^:]+):\s*"`([^`]+)`"\}\}/g, "{{$1: `$2`}}");

  // Fix 3: Fix PlotRender TODO comments with unclosed strings
  // {/* TODO: <PlotRender options='{ => {/* TODO: <PlotRender (commented out)
  content = content.replace(/\{\/\* TODO: <PlotRender options='\{/g, "{/* TODO: <PlotRender - manually convert */");

  // Fix 4: Find other {*...*} patterns in markdown text and escape them
  // But only if they're not already escaped and not in code blocks
  const lines = content.split("\n");
  const fixedLines = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      fixedLines.push(line);
      continue;
    }

    if (inCodeBlock || line.trim().startsWith("import ") || line.trim().startsWith("//")) {
      fixedLines.push(line);
      continue;
    }

    // Fix unescaped {*...*} patterns in regular markdown text
    // But don't touch code, imports, or already-escaped patterns
    let fixed = line;
    if (fixed.includes("{*") && !fixed.includes("\\{*") && !fixed.includes("<") && !fixed.includes("```")) {
      // Simple heuristic: if line has {*something* ... } pattern and it's markdown text (no JSX)
      fixed = fixed.replace(/(?<!\\)\{(\*[^}]+\*[^}]*)\}/g, "\\{$1\\}");
    }

    fixedLines.push(fixed);
  }
  content = fixedLines.join("\n");

  // Fix 5: Check for any remaining unclosed Plot tags
  // <Plot ... }}\n<Component should be <Plot ... }}>\n<Component
  content = content.replace(/(<Plot[^>]*\}\})\s*\n(\s*<[A-Z])/g, "$1>\n$2");

  // Fix 6: Check for projections.mdx similar issue
  content = content.replace(/(<Plot[^>]*projection="[^"]*"[^>]*)\s*\n(\s*<Geo)/g, "$1>\n$2");

  if (content !== original) {
    fs.writeFileSync(file, content, "utf-8");
    totalChanges++;
    console.log(`Fixed: ${file}`);
  }
}

console.log(`\n✅ Fixed ${totalChanges} files out of ${files.length} total`);
