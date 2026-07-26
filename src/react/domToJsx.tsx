import {createElement as h, Fragment, type ReactNode} from "react";

// Converts a detached DOM node (as produced by htl's svg`…` in a function
// mark) into React elements, so the JSX render paths can inline raw SVG —
// e.g. <defs> with gradients or patterns — without touching the live DOM.

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const DOCUMENT_FRAGMENT_NODE = 11;

export function isDomNode(value: unknown): value is Node {
  return value != null && typeof value === "object" && typeof (value as Node).nodeType === "number";
}

export function domToJsx(node: Node, key?: string | number): ReactNode {
  switch (node.nodeType) {
    case ELEMENT_NODE: {
      const element = node as Element;
      const props: Record<string, unknown> = {key};
      for (const {name, value} of element.attributes) props[reactAttributeName(name)] = attributeValue(name, value);
      const children = [...element.childNodes].map((child, i) => domToJsx(child, i));
      return h(element.tagName, props, ...children);
    }
    case TEXT_NODE:
      return node.nodeValue;
    case DOCUMENT_FRAGMENT_NODE:
      return h(Fragment, {key}, ...[...node.childNodes].map((child, i) => domToJsx(child, i)));
  }
  return null; // comments, processing instructions, …
}

function reactAttributeName(name: string): string {
  return name === "class" ? "className" : name === "for" ? "htmlFor" : name;
}

// React requires the style prop to be an object; other attributes pass
// through verbatim (React renders unrecognized attributes as-is).
function attributeValue(name: string, value: string): unknown {
  if (name !== "style") return value;
  const style: Record<string, string> = {};
  for (const declaration of value.split(";")) {
    const colon = declaration.indexOf(":");
    if (colon === -1) continue;
    const property = declaration.slice(0, colon).trim();
    if (!property) continue;
    style[property.startsWith("--") ? property : camelCase(property)] = declaration.slice(colon + 1).trim();
  }
  return style;
}

function camelCase(property: string): string {
  return property.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}
