import fs from "fs";
import {globSync} from "glob";

const files = globSync("docs/**/*.mdx");
let totalChanges = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf-8");
  const original = content;

  // Fix duplicated nested {/* comments
  content = content.replace(/\{\/\*\s*\n\/\/ TODO:.*?\n\{\/\*/g, (match) => {
    return match.replace(/\n\{\/\*/g, "");
  });
  content = content.replace(/\*\/\}\s*\n\*\/\}/g, "*/}");

  // Fix /, MI / back to the original (was mangled by previous regex replacement)
  content = content.replace(/\/ MI \//g, "/, MI /");

  // Fix broken JSX attributes from // comment removal
  // Pattern: sort={(d) => / MI /.test(d.division)={MI /.test(d.division)}
  content = content.replace(/(\([^)]+\) => \/ [^/]+ \/\.test\([^)]+\))=\{\1\}/g, "$1");

  // Fix: remove standalone // comments that are between JSX attributes on their own line
  // These appear after a closing ]} or }} and before the next attribute
  const lines = content.split("\n");
  const fixedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if this line is ONLY a // comment (not in a code block)
    if (trimmed.startsWith("//") && !trimmed.startsWith("// TODO:")) {
      // Check if previous line ends with JSX-like syntax
      const prevLine = i > 0 ? lines[i - 1].trim() : "";
      const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : "";

      // If previous line ends with }] or ]} or }, and next line looks like an attribute
      // then this is likely a comment between JSX attributes - skip it
      if ((prevLine.endsWith("}]") || prevLine.endsWith("]}") || prevLine.endsWith("},")) &&
          (nextLine.match(/^\w+[={]/) || nextLine.includes("="))) {
        // Skip this comment line
        continue;
      }
    }

    // Fix: // comments at end of JSX continuation lines (after ]} or })
    // Pattern: ]} // comment  =>  ]}
    if (line.includes("//") && (line.includes("}]") || line.includes("},"))) {
      const commentPos = line.indexOf("//");
      const beforeComment = line.substring(0, commentPos);

      // Check if we're in JSX context (unclosed tag)
      if (!beforeComment.trim().endsWith(">")) {
        fixedLines.push(beforeComment.trimEnd());
        continue;
      }
    }

    // Fix: dangling // comments inside JSX props that create malformed attributes
    // Pattern: x={{...}} // comment={// comment}>
    if (line.includes("// ") && line.includes("={//")) {
      const match = line.match(/(.*?)\s*\/\/ [^=]+=\{\/\/ .*?\}>/);
      if (match) {
        fixedLines.push(match[1] + ">");
        continue;
      }
    }

    fixedLines.push(line);
  }
  content = fixedLines.join("\n");

  // Fix multi-line JSX with // comments between attributes
  // This handles cases where } // comment appears in the middle of a JSX tag
  content = content.replace(/(\}\s*)\/\/ [^\n]+\n(\s+<)/g, "$1\n$2");
  content = content.replace(/(\}\s*)\/\/ [^\n]+$/gm, "$1");

  // Fix {*name*: *value*} pattern in markdown that causes parse errors
  // This should be \{*name*: *value*\} or just escaped
  content = content.replace(/([^\\])\{(\*\w+\*:\s*\*\w+\*)\}/g, "$1\\{$2\\}");

  // Fix missing closing > on Plot tags
  // Pattern: <Plot ... }}" with newline after, should be <Plot ... }}> with newline
  content = content.replace(/(<Plot[^>]*\}\})"?\s*\n/g, "$1>\n");

  // Fix SVG attributes in inline SVG that weren't caught
  // Look for stroke-width in the middle of content
  content = content.replace(/stroke-width=/g, "strokeWidth=");

  if (content !== original) {
    fs.writeFileSync(file, content, "utf-8");
    totalChanges++;
    console.log(`Fixed: ${file}`);
  }
}

console.log(`\n✅ Fixed ${totalChanges} files out of ${files.length} total`);
