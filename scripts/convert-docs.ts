/**
 * Convert VitePress .md docs to React MDX docs.
 *
 * Usage: tsx scripts/convert-docs.ts [file.md ...]
 *
 * If no files are given, converts all docs/*.md and docs/**\/*.md files
 * (excluding data files, .vitepress, and already-converted .mdx).
 */

import fs from "node:fs";
import path from "node:path";
import {glob} from "glob";

// ─── Imperative → React component name mapping ───────────────────────────
// Maps `Plot.<name>(...)` to the React component name.
// Lowercase imperative names → PascalCase React components.
const MARK_MAP: Record<string, string> = {
  dot: "Dot",
  dotX: "DotX",
  dotY: "DotY",
  circle: "Circle",
  hexagon: "Hexagon",
  line: "Line",
  lineX: "LineX",
  lineY: "LineY",
  area: "Area",
  areaX: "AreaX",
  areaY: "AreaY",
  barX: "BarX",
  barY: "BarY",
  rect: "Rect",
  rectX: "RectX",
  rectY: "RectY",
  cell: "Cell",
  cellX: "CellX",
  cellY: "CellY",
  ruleX: "RuleX",
  ruleY: "RuleY",
  text: "Text",
  textX: "TextX",
  textY: "TextY",
  tickX: "TickX",
  tickY: "TickY",
  frame: "Frame",
  link: "Link",
  arrow: "Arrow",
  vector: "Vector",
  vectorX: "VectorX",
  vectorY: "VectorY",
  spike: "Spike",
  image: "Image",
  geo: "Geo",
  sphere: "Sphere",
  graticule: "Graticule",
  delaunayLink: "DelaunayLink",
  delaunayMesh: "DelaunayMesh",
  hull: "Hull",
  voronoi: "Voronoi",
  voronoiMesh: "VoronoiMesh",
  density: "Density",
  contour: "Contour",
  raster: "Raster",
  hexgrid: "Hexgrid",
  boxX: "BoxX",
  boxY: "BoxY",
  tree: "TreeMark",
  cluster: "ClusterMark",
  bollingerX: "BollingerX",
  bollingerY: "BollingerY",
  differenceX: "DifferenceX",
  differenceY: "DifferenceY",
  linearRegressionX: "LinearRegressionX",
  linearRegressionY: "LinearRegressionY",
  waffleX: "WaffleX",
  waffleY: "WaffleY",
  axisX: "AxisX",
  axisY: "AxisY",
  gridX: "GridX",
  gridY: "GridY",
  axisFx: "AxisFx",
  axisFy: "AxisFy",
  gridFx: "GridFx",
  gridFy: "GridFy",
  tip: "Tip",
  crosshair: "Crosshair",
  crosshairX: "CrosshairX",
  crosshairY: "CrosshairY",
  auto: "Auto",
};

// Transforms that remain as function calls (spread onto mark components)
const TRANSFORMS = new Set([
  "bin", "binX", "binY",
  "group", "groupX", "groupY", "groupZ",
  "stackX", "stackX1", "stackX2", "stackY", "stackY1", "stackY2",
  "dodgeX", "dodgeY",
  "normalizeX", "normalizeY", "normalize",
  "windowX", "windowY", "window",
  "mapX", "mapY", "map",
  "selectFirst", "selectLast", "selectMaxX", "selectMaxY", "selectMinX", "selectMinY", "select",
  "hexbin",
  "shiftX", "shiftY",
  "centroid", "geoCentroid",
  "filter", "sort", "reverse", "shuffle",
  "treeNode", "treeLink",
  "find",
  "bollinger",
]);

// ─── VitePress data → import mapping ─────────────────────────────────────
// Maps `import foo from "../data/foo.ts"` to correct MDX import path
function fixDataImportPath(importPath: string, fileDir: string): string {
  // Already a relative path to data — keep it, just adjust depth if needed
  return importPath;
}

// ─── Vue ref/shallowRef → React useState ─────────────────────────────────
interface StateDecl {
  name: string;
  initialValue: string;
  setterName: string;
}

interface AsyncLoad {
  varName: string;
  loadExpr: string;
}

interface ComputedDecl {
  name: string;
  expr: string;
}

interface ScriptSetupParsed {
  imports: string[];
  states: StateDecl[];
  asyncLoads: AsyncLoad[];
  computed: ComputedDecl[];
  rawLines: string[];
}

function parseScriptSetup(block: string): ScriptSetupParsed {
  const result: ScriptSetupParsed = {imports: [], states: [], asyncLoads: [], computed: [], rawLines: []};
  const lines = block.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "<script setup>" || trimmed === "</script>") continue;

    // Skip Vue imports
    if (/^import\s+.*from\s+["']vue["']/.test(trimmed)) continue;
    if (/^import\s+\*\s+as\s+Plot\s+from\s+["']replot["']/.test(trimmed)) continue;

    // Keep d3 and other imports
    if (/^import\s/.test(trimmed)) {
      // Rewrite data imports to remove .data suffix if present
      const rewritten = trimmed.replace(/from\s+["'](.+?)["']/, (_, p) => {
        return `from "${p}"`;
      });
      result.imports.push(rewritten);
      continue;
    }

    // const foo = shallowRef([]) or ref(value)
    const refMatch = trimmed.match(/^const\s+(\w+)\s*=\s*(?:shallowRef|ref)\((.+)\)\s*;?\s*$/);
    if (refMatch) {
      const [, name, init] = refMatch;
      result.states.push({
        name,
        initialValue: init,
        setterName: `set${name[0].toUpperCase()}${name.slice(1)}`
      });
      continue;
    }

    // computed
    const computedMatch = trimmed.match(/^const\s+(\w+)\s*=\s*computed\(\(\)\s*=>\s*(.+)\)\s*;?\s*$/);
    if (computedMatch) {
      result.computed.push({name: computedMatch[1], expr: computedMatch[2]});
      continue;
    }

    // Multi-line computed – just flag for manual review
    if (/computed\(/.test(trimmed)) {
      result.rawLines.push(`// TODO: convert computed: ${trimmed}`);
      continue;
    }

    // onMounted block – extract async loads
    if (/^onMounted\(/.test(trimmed)) {
      // Parse the whole onMounted block from lines
      continue; // handled below
    }

    // d3.csv/json loading patterns (inside onMounted)
    const loadMatch = trimmed.match(/d3\.\w+\(["'](.+?)["'](?:,\s*\w+(?:\.\w+)*)?\)\.then\(\(?(?:data|\w+)\)?\s*=>\s*\(?(\w+)\.value\s*=\s*(?:data|\w+)\)?\)/);
    if (loadMatch) {
      result.asyncLoads.push({
        varName: loadMatch[2],
        loadExpr: trimmed.replace(/\.then\(.*/, "")
      });
      continue;
    }

    // Skip onMounted boilerplate lines
    if (/^onMounted|^\}\);?\s*$|^\(\)\s*=>\s*\{/.test(trimmed)) continue;

    // Anything else
    if (trimmed !== "{" && trimmed !== "}") {
      result.rawLines.push(`// TODO: manually convert: ${trimmed}`);
    }
  }

  return result;
}

// ─── Convert a :::plot code block to React JSX ──────────────────────────
interface ConvertedPlot {
  jsx: string;
  reactImports: Set<string>;
  warnings: string[];
}

function convertPlotBlock(code: string): ConvertedPlot {
  const reactImports = new Set<string>();
  const warnings: string[] = [];

  // Apply the same transformations as markdown-it-plot.ts
  code = code.replace(/\bMath\.random\b/g, "d3.randomLcg(42)");
  code = code.replace(/\bd3\.(random(?!Lcg)\w+)\b/g, "d3.$1.source(d3.randomLcg(42))");
  code = code.replace(/\bd3\.shuffle\b/g, "d3.shuffler(d3.randomLcg(42))");

  const trimmed = code.trim();

  // Case 1: Plot.plot({...})
  if (/^Plot\.plot\(/.test(trimmed)) {
    const result = convertPlotPlotCall(trimmed, reactImports, warnings);
    if (result) return {jsx: result, reactImports, warnings};
  }

  // Case 2: mark.plot({...}) — e.g., Plot.dot(data, opts).plot({...})
  // Exclude Plot.plot() which is handled above
  const plotMethodMatch = !(/^Plot\.plot\(/.test(trimmed)) ? trimmed.match(/^(.+?)\.plot\(([\s\S]*)\)$/) : null;
  if (plotMethodMatch) {
    const [, markExpr, plotOptsStr] = plotMethodMatch;
    const markJsx = convertMarkExpr(markExpr, reactImports, warnings);
    const plotProps = plotOptsStr.trim() ? convertObjectToProps(plotOptsStr.trim(), reactImports) : "";
    reactImports.add("Plot");
    return {
      jsx: `<Plot${plotProps}>\n  ${markJsx}\n</Plot>`,
      reactImports,
      warnings
    };
  }

  // Fallback: can't convert automatically
  warnings.push(`Could not auto-convert: ${trimmed.slice(0, 80)}...`);
  return {jsx: `{/* TODO: manually convert */}\n{/* ${escapeJsxComment(trimmed)} */}`, reactImports, warnings};
}

function convertPlotPlotCall(code: string, imports: Set<string>, warnings: string[]): string | null {
  // Extract the options object from Plot.plot({...})
  // This is tricky because of nested braces. Use a simple brace counter.
  const start = code.indexOf("(");
  if (start < 0) return null;

  const inner = extractBalancedParens(code, start);
  if (!inner) return null;

  imports.add("Plot");

  // Extract the marks array using balanced bracket matching
  const marksIdx = inner.indexOf("marks:");
  if (marksIdx < 0) {
    warnings.push("Plot.plot() without marks array — manual review needed");
    return `{/* TODO: Plot.plot(${inner.slice(0, 60)}...) */}`;
  }

  // Find the opening [ after "marks:"
  const bracketStart = inner.indexOf("[", marksIdx);
  if (bracketStart < 0) {
    warnings.push("Plot.plot() marks is not an array — manual review needed");
    return `{/* TODO: Plot.plot(${inner.slice(0, 60)}...) */}`;
  }

  const marksContent = extractBalancedBrackets(inner, bracketStart);
  if (!marksContent) {
    warnings.push("Could not extract marks array — manual review needed");
    return `{/* TODO: Plot.plot(${inner.slice(0, 60)}...) */}`;
  }

  // Find the full marks: [...] range to remove it from options
  const marksEnd = bracketStart + marksContent.length + 2; // +2 for [ and ]
  const beforeMarks = inner.slice(0, marksIdx).replace(/,\s*$/, "");
  const afterMarks = inner.slice(marksEnd).replace(/^\s*,?/, "");
  const optionsWithoutMarks = (beforeMarks + afterMarks).trim();

  // Convert each mark in the marks array
  const markExprs = splitTopLevelComma(marksContent);
  const markJsxParts: string[] = [];

  for (const expr of markExprs) {
    const trimExpr = expr.trim();
    if (!trimExpr) continue;
    markJsxParts.push(convertMarkExpr(trimExpr, imports, warnings));
  }

  // Convert remaining options to props on <Plot>
  let plotProps = "";
  if (optionsWithoutMarks) {
    // Remove surrounding braces if present
    let opts = optionsWithoutMarks;
    if (opts.startsWith("{")) opts = opts.slice(1);
    if (opts.endsWith("}")) opts = opts.slice(0, -1);
    plotProps = convertObjectLiteralToProps(opts.trim(), imports);
  }

  const marksJsx = markJsxParts.map(m => `  ${m}`).join("\n");
  return `<Plot${plotProps}>\n${marksJsx}\n</Plot>`;
}

function convertMarkExpr(expr: string, imports: Set<string>, warnings: string[]): string {
  const trimExpr = expr.trim();

  // Handle Plot.markName(data, options) or Plot.markName(options)
  const markMatch = trimExpr.match(/^Plot\.(\w+)\(([\s\S]*)$/);
  if (!markMatch) {
    // Could be a conditional or variable reference
    warnings.push(`Non-Plot mark expression: ${trimExpr.slice(0, 60)}`);
    return `{/* TODO: ${escapeJsxComment(trimExpr)} */}`;
  }

  const [, fnName, rest] = markMatch;
  // Remove trailing paren
  const argsStr = rest.replace(/\)\s*$/, "");

  // Check if this is a mark or a transform
  const reactName = MARK_MAP[fnName];
  if (!reactName) {
    // Might be a transform wrapping - like Plot.binX(...)
    if (TRANSFORMS.has(fnName)) {
      warnings.push(`Transform used as top-level mark: Plot.${fnName}(...) — needs manual review`);
      return `{/* TODO: Plot.${fnName}(...) */}`;
    }
    warnings.push(`Unknown Plot function: Plot.${fnName}`);
    return `{/* TODO: Plot.${fnName}(...) */}`;
  }

  imports.add(reactName);

  // Parse arguments: first arg is data, second is options
  // But some marks have transform wrappers: Plot.dot(data, Plot.stackY({...}))
  const args = splitTopLevelComma(argsStr);

  if (args.length === 0) {
    // No args — e.g., Plot.frame()
    return `<${reactName} />`;
  }

  if (args.length === 1) {
    const arg = args[0].trim();
    // Could be just data or just options
    if (arg.startsWith("{")) {
      // Options object
      const props = convertObjectLiteralToProps(stripBraces(arg), imports);
      return `<${reactName}${props} />`;
    }
    // Data only
    return `<${reactName} data={${arg}} />`;
  }

  // Two args: data and options
  const dataArg = args[0].trim();
  const optsArg = args[1].trim();

  // Check if options is a transform: Plot.binX({...}, {...})
  const transformMatch = optsArg.match(/^Plot\.(\w+)\(([\s\S]*)\)$/);
  if (transformMatch && TRANSFORMS.has(transformMatch[1])) {
    const transformName = transformMatch[1];
    imports.add(transformName);
    return `<${reactName} data={${dataArg}} {...${transformName}(${transformMatch[2]})} />`;
  }

  // Regular options object
  if (optsArg.startsWith("{")) {
    const props = convertObjectLiteralToProps(stripBraces(optsArg), imports);
    return `<${reactName} data={${dataArg}}${props} />`;
  }

  // Variable reference or other expression
  return `<${reactName} data={${dataArg}} {...${optsArg}} />`;
}

// ─── Object literal → JSX props conversion ──────────────────────────────

function convertObjectLiteralToProps(objContent: string, imports: Set<string>): string {
  if (!objContent.trim()) return "";

  // Split by top-level commas in the object
  const entries = splitTopLevelComma(objContent);
  const props: string[] = [];

  for (const entry of entries) {
    const trimEntry = entry.trim();
    if (!trimEntry) continue;

    // key: value
    const colonIdx = findTopLevelColon(trimEntry);
    if (colonIdx < 0) {
      // Shorthand property or spread
      if (trimEntry.startsWith("...")) {
        props.push(` {...${trimEntry.slice(3)}}`);
      } else {
        props.push(` ${trimEntry}={${trimEntry}}`);
      }
      continue;
    }

    const key = trimEntry.slice(0, colonIdx).trim();
    const value = trimEntry.slice(colonIdx + 1).trim();

    // String values
    if (/^"[^"]*"$/.test(value) || /^'[^']*'$/.test(value)) {
      props.push(` ${key}=${value.replace(/'/g, '"')}`);
      continue;
    }

    // Boolean true
    if (value === "true") {
      props.push(` ${key}`);
      continue;
    }

    // Number
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      props.push(` ${key}={${value}}`);
      continue;
    }

    // Object values need double braces in JSX
    if (value.startsWith("{")) {
      props.push(` ${key}={${value}}`);
    } else {
      props.push(` ${key}={${value}}`);
    }
  }

  return props.join("");
}

function convertObjectToProps(objStr: string, imports: Set<string>): string {
  let inner = objStr.trim();
  if (inner.startsWith("(")) inner = inner.slice(1);
  if (inner.endsWith(")")) inner = inner.slice(0, -1);
  if (inner.startsWith("{")) inner = inner.slice(1);
  if (inner.endsWith("}")) inner = inner.slice(0, -1);
  return convertObjectLiteralToProps(inner.trim(), imports);
}

// ─── Utility functions ───────────────────────────────────────────────────

function extractBalancedBrackets(str: string, openIdx: number): string | null {
  let depth = 0;
  let inString: string | null = null;
  let escaped = false;
  for (let i = openIdx; i < str.length; i++) {
    const ch = str[i];
    if (escaped) { escaped = false; continue; }
    if (ch === "\\") { escaped = true; continue; }
    if (inString) { if (ch === inString) inString = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { inString = ch; continue; }
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) return str.slice(openIdx + 1, i);
    }
  }
  return null;
}

function extractBalancedParens(str: string, openIdx: number): string | null {
  let depth = 0;
  let inString: string | null = null;
  let escaped = false;
  for (let i = openIdx; i < str.length; i++) {
    const ch = str[i];
    if (escaped) { escaped = false; continue; }
    if (ch === "\\") { escaped = true; continue; }
    if (inString) { if (ch === inString) inString = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { inString = ch; continue; }
    if (ch === "(") depth++;
    else if (ch === ")") {
      depth--;
      if (depth === 0) return str.slice(openIdx + 1, i);
    }
  }
  return null;
}

function splitTopLevelComma(str: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  let inString: string | null = null;
  let escaped = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (escaped) {
      current += ch;
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      current += ch;
      escaped = true;
      continue;
    }
    if (inString) {
      current += ch;
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      current += ch;
      continue;
    }
    if (ch === "(" || ch === "[" || ch === "{") {
      depth++;
      current += ch;
      continue;
    }
    if (ch === ")" || ch === "]" || ch === "}") {
      depth--;
      current += ch;
      continue;
    }
    if (ch === "," && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += ch;
  }

  if (current.trim()) parts.push(current);
  return parts;
}

function findTopLevelColon(str: string): number {
  let depth = 0;
  let inString: string | null = null;
  let escaped = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (escaped) { escaped = false; continue; }
    if (ch === "\\") { escaped = true; continue; }
    if (inString) { if (ch === inString) inString = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { inString = ch; continue; }
    if (ch === "(" || ch === "[" || ch === "{") { depth++; continue; }
    if (ch === ")" || ch === "]" || ch === "}") { depth--; continue; }
    if (ch === ":" && depth === 0) return i;
  }
  return -1;
}

function stripBraces(s: string): string {
  const t = s.trim();
  if (t.startsWith("{") && t.endsWith("}")) return t.slice(1, -1).trim();
  return t;
}

function escapeJsxComment(s: string): string {
  return s.replace(/\*\//g, "*\\/").replace(/\/\*/g, "\\/*");
}

// ─── Convert interactive HTML controls ──────────────────────────────────

function convertVueControls(html: string): string {
  // v-model checkbox
  html = html.replace(
    /<input\s+type="checkbox"\s+v-model="(\w+)"\s*\/?>/g,
    '<input type="checkbox" checked={$1} onChange={(e) => set$1(e.target.checked)} />'
  );
  // v-model select
  html = html.replace(
    /<select\s+v-model="(\w+)">/g,
    '<select value={$1} onChange={(e) => set$1(e.target.value)}>'
  );
  // v-model.number for range inputs
  html = html.replace(
    /<input\s+type="range"\s+([^>]*)v-model(?:\.number)?="(\w+)"([^>]*)\/?>/g,
    '<input type="range" $1value={$2} onChange={(e) => set$2(Number(e.target.value))}$3 />'
  );
  // v-model radio
  html = html.replace(
    /<input\s+type="radio"\s+([^>]*)v-model="(\w+)"\s+value="([^"]*)"([^>]*)\/?>/g,
    '<input type="radio" $1checked={$2 === "$3"} onChange={() => set$2("$3")}$4 />'
  );
  // Generic v-model on input
  html = html.replace(
    /<input\s+([^>]*)v-model(?:\.number)?="(\w+)"([^>]*)\/?>/g,
    '<input $1value={$2} onChange={(e) => set$2(e.target.value)}$3 />'
  );
  // Fix setter names to proper camelCase
  html = html.replace(/set(\w)/g, (_, c) => `set${c.toUpperCase()}`);
  // class= → className=
  html = html.replace(/\bclass="/g, 'className="');
  return html;
}

// ─── Main conversion function ────────────────────────────────────────────

interface ConversionResult {
  mdx: string;
  warnings: string[];
}

function convertFile(mdContent: string, filePath: string): ConversionResult {
  const warnings: string[] = [];
  const allReactImports = new Set<string>();
  const needsUseState = new Set<string>();
  const needsUseEffect = false;
  let hasAsyncLoads = false;

  // 1. Extract <script setup> block
  const scriptMatch = mdContent.match(/<script setup>([\s\S]*?)<\/script>/);
  let scriptParsed: ScriptSetupParsed | null = null;
  let bodyContent = mdContent;

  if (scriptMatch) {
    scriptParsed = parseScriptSetup(scriptMatch[1]);
    bodyContent = mdContent.replace(/<script setup>[\s\S]*?<\/script>\s*/, "");

    for (const s of scriptParsed.states) {
      needsUseState.add(s.name);
    }
    if (scriptParsed.asyncLoads.length > 0) {
      hasAsyncLoads = true;
    }
  }

  // 2. Remove frontmatter
  bodyContent = bodyContent.replace(/^---[\s\S]*?---\s*/, "");

  // 3. Convert :::plot blocks
  const plotBlockRegex = /:::plot(?:\s+[^\n]*)?\n```(?:js|js-vue)\n([\s\S]*?)```\n:::/g;
  bodyContent = bodyContent.replace(plotBlockRegex, (match, code) => {
    const converted = convertPlotBlock(code.trim());
    for (const imp of converted.reactImports) allReactImports.add(imp);
    warnings.push(...converted.warnings);
    return converted.jsx;
  });

  // 4. Convert :::code-group blocks to plain code blocks
  bodyContent = bodyContent.replace(/:::code-group\n/g, "");
  bodyContent = bodyContent.replace(/\n:::\s*$/gm, "");
  // Remove remaining ::: directives
  bodyContent = bodyContent.replace(/^:::.*$/gm, "");

  // 5. Convert Vue-style HTML controls
  bodyContent = convertVueControls(bodyContent);

  // 6. Fix Vue-style template expressions (only in markdown text, not in JSX)
  // Vue uses {{expr}} for interpolation, but JSX uses {expr}.
  // Only convert if preceded by non-= character (JSX props use ={{...}})
  bodyContent = bodyContent.replace(/(?<!=)\{\{([^}]+)\}\}(?!\})/g, "{$1}");

  // 7. Fix HTML style attributes for JSX
  bodyContent = bodyContent.replace(
    /style="([^"]*)"/g,
    (_, styleStr) => {
      // Convert CSS string to JSX style object
      const props = styleStr.split(";").filter(Boolean).map((prop: string) => {
        const [key, ...vals] = prop.split(":");
        const jsKey = key.trim().replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
        return `${jsKey}: "${vals.join(":").trim()}"`;
      });
      return `style={{${props.join(", ")}}}`;
    }
  );

  // 8. Build import section
  const importLines: string[] = [];

  // React components from replot/react
  if (allReactImports.size > 0) {
    const sorted = [...allReactImports].sort();
    importLines.push(`import {${sorted.join(", ")}} from "replot/react";`);
  }

  // d3 if used
  if (bodyContent.includes("d3.") || scriptParsed?.imports.some(i => i.includes("d3"))) {
    importLines.push('import * as d3 from "d3";');
  }

  // useState/useEffect if needed
  const reactHooks: string[] = [];
  if (needsUseState.size > 0) reactHooks.push("useState");
  if (hasAsyncLoads) reactHooks.push("useEffect");
  if (reactHooks.length > 0) {
    importLines.push(`import {${reactHooks.join(", ")}} from "react";`);
  }

  // Data imports from script setup
  if (scriptParsed) {
    for (const imp of scriptParsed.imports) {
      if (!imp.includes("d3")) {
        importLines.push(imp);
      }
    }
  }

  // 9. Assemble MDX
  let mdx = "";
  if (importLines.length > 0) {
    mdx += importLines.join("\n") + "\n\n";
  }

  // Add state declarations and computed values as exported component if needed
  if (scriptParsed && (scriptParsed.states.length > 0 || scriptParsed.asyncLoads.length > 0)) {
    // Flag for manual wrapping — interactive pages need a wrapper component
    warnings.push("Page has state/async loads — needs manual wrapper component");
  }

  // Add TODO comments for unconverted lines
  if (scriptParsed?.rawLines.length) {
    for (const line of scriptParsed.rawLines) {
      mdx += line + "\n";
    }
    mdx += "\n";
  }

  mdx += bodyContent.trim() + "\n";

  return {mdx, warnings};
}

// ─── CLI entry point ─────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  let files: string[];

  if (args.length > 0) {
    files = args;
  } else {
    // Find all .md files in docs/, excluding .vitepress and data
    const allMd = await glob("docs/**/*.md", {
      ignore: ["docs/.vitepress/**", "docs/data/**", "docs/public/**"],
      cwd: process.cwd()
    });
    files = allMd.filter(f => !f.endsWith(".data.ts"));
  }

  let totalWarnings = 0;
  let totalConverted = 0;

  for (const file of files) {
    const absPath = path.resolve(file);
    if (!fs.existsSync(absPath)) {
      console.error(`File not found: ${absPath}`);
      continue;
    }

    const content = fs.readFileSync(absPath, "utf-8");

    // Skip files that don't have plot blocks or script setup
    if (!content.includes(":::plot") && !content.includes("<script setup>")) {
      // Still convert to .mdx for consistency but just rename
      const mdxPath = absPath.replace(/\.md$/, ".mdx");
      // Remove frontmatter and :::code-group directives
      let cleaned = content.replace(/^---[\s\S]*?---\s*/, "");
      cleaned = cleaned.replace(/:::code-group\n/g, "");
      cleaned = cleaned.replace(/^:::(?!plot).*$/gm, "");
      fs.writeFileSync(mdxPath, cleaned);
      console.log(`  Copied: ${file} → ${file.replace(/\.md$/, ".mdx")} (no plots)`);
      totalConverted++;
      continue;
    }

    const result = convertFile(content, absPath);
    const mdxPath = absPath.replace(/\.md$/, ".mdx");
    fs.writeFileSync(mdxPath, result.mdx);

    totalConverted++;
    if (result.warnings.length > 0) {
      totalWarnings += result.warnings.length;
      console.log(`  Converted: ${file} → ${file.replace(/\.md$/, ".mdx")} (${result.warnings.length} warnings)`);
      for (const w of result.warnings) {
        console.log(`    ⚠ ${w}`);
      }
    } else {
      console.log(`  Converted: ${file} → ${file.replace(/\.md$/, ".mdx")}`);
    }
  }

  console.log(`\nDone. ${totalConverted} files converted, ${totalWarnings} warnings.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
