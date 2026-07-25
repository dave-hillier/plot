// Assigns ids to headings so in-page anchors resolve. The id comes from an
// explicit {/* {#name} */} anchor comment on the heading when present (the
// convention validated by docs/components/links.js), otherwise from the
// heading text using the same slug rules as getAnchors, so rendered ids always
// match the anchors the link checker and API index validate against.
export default function remarkHeadingIds() {
  return (tree) => {
    visit(tree);
  };
}

function visit(node) {
  if (node.type === "heading") assignId(node);
  if (node.children) for (const child of node.children) visit(child);
}

function assignId(heading) {
  let id;
  let text = "";
  for (const child of heading.children ?? []) {
    if (child.type === "mdxTextExpression") {
      const m = /\{#([\w-]+)\}/.exec(child.value ?? "");
      if (m && id === undefined) id = m[1];
    } else {
      text += textOf(child);
    }
  }
  if (id === undefined) {
    id = text
      .replace(/[^\w\d\s]+/g, " ")
      .trim()
      .replace(/ +/g, "-")
      .toLowerCase();
  }
  if (!id) return;
  heading.data ??= {};
  heading.data.hProperties = {...heading.data.hProperties, id};
}

function textOf(node) {
  if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
  // Skip badges and other JSX inside headings, matching getAnchors.
  if (node.type === "mdxJsxTextElement") return "";
  if (node.children) return node.children.map(textOf).join("");
  return "";
}
