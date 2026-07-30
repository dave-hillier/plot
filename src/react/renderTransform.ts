import {type ReactNode} from "react";
import {domToJsx, isDomNode} from "./domToJsx.js";

// Bridges the imperative `render` option (a render transform: DOM in, DOM
// out) into the JSX render paths. The Mark constructor composes
// options.render into an own `render` property — marks define no imperative
// render of their own anymore — so an own function marks a user transform.
// Pointer-driven renders are excluded (the React pointer path re-renders the
// selection itself), as is a mark with a custom renderJSX, which takes
// precedence on the JSX paths.
export function hasRenderTransform(mark: any): boolean {
  return (
    typeof mark?.render === "function" &&
    mark.render.pointer !== true &&
    !Object.prototype.hasOwnProperty.call(mark, "renderJSX")
  );
}

// Executes the composed render transform with a `next` that produces the
// mark's default output as a detached DOM node, honoring the imperative
// contract (index, scales, values, dimensions, context, next). The result is
// converted back to JSX so both the interactive and static paths can inline
// it.
export function renderTransformJSX(
  mark: any,
  index: any,
  scales: any,
  values: any,
  dimensions: any,
  context: any
): ReactNode {
  const next = (i: any, s: any, v: any, d: any, c: any = context) => {
    const jsx = mark.renderJSX(i, s, v, d, c);
    return jsx == null ? null : isDomNode(jsx) ? jsx : jsxToDom(jsx, c.document);
  };
  const out = mark.render.call(mark, index, scales, values, dimensions, context, next);
  if (out == null) return null;
  return isDomNode(out) ? domToJsx(out) : (out as ReactNode);
}

// Builds DOM nodes directly from a JSX tree, in the SVG namespace. This is the
// inverse of domToJsx, and deliberately does not go through
// renderToStaticMarkup: importing react-dom/server here would put the whole
// server renderer in the client bundle of every app that renders a plot, for
// the sake of a path only reached when a mark carries an imperative `render`
// transform (see issue #140).
//
// Only the shapes mark.renderJSX produces are supported — intrinsic elements,
// fragments, arrays and text. A component element would need a renderer;
// buildElement throws rather than emitting something subtly wrong.
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function jsxToDom(jsx: ReactNode, document: Document): Node | null {
  const nodes: Node[] = [];
  appendJsx(nodes, jsx, document);
  if (nodes.length === 1) return nodes[0]!;
  const fragment = document.createDocumentFragment();
  for (const node of nodes) fragment.appendChild(node);
  return fragment;
}

function appendJsx(nodes: Node[], jsx: ReactNode, document: Document): void {
  if (jsx == null || typeof jsx === "boolean") return;
  if (typeof jsx === "string" || typeof jsx === "number") {
    nodes.push(document.createTextNode(String(jsx)));
    return;
  }
  if (Array.isArray(jsx)) {
    for (const child of jsx) appendJsx(nodes, child as ReactNode, document);
    return;
  }
  const element = jsx as {type?: unknown; props?: Record<string, unknown>};
  const {type, props = {}} = element;
  // A fragment contributes its children and nothing of its own.
  if (typeof type !== "string") {
    if (type != null && typeof type !== "function") {
      appendJsx(nodes, props.children as ReactNode, document);
      return;
    }
    throw new Error("render transforms cannot serialize component elements");
  }
  nodes.push(buildElement(type, props, document));
}

function buildElement(type: string, props: Record<string, unknown>, document: Document): Element {
  const node = document.createElementNS(SVG_NAMESPACE, type);
  for (const [name, value] of Object.entries(props)) {
    if (name === "children" || name === "key" || name === "ref") continue;
    if (value == null || value === false || typeof value === "function") continue;
    if (name === "dangerouslySetInnerHTML") {
      node.innerHTML = String((value as {__html?: unknown}).__html ?? "");
      continue;
    }
    node.setAttribute(attributeName(name), name === "style" ? styleText(value) : String(value));
  }
  const children: Node[] = [];
  appendJsx(children, props.children as ReactNode, document);
  for (const child of children) node.appendChild(child);
  return node;
}

// The inverse of domToJsx's reactAttributeName: React's camelCase props map
// back to the hyphenated attributes SVG expects. aria-*/data-* and already
// hyphenated names pass through, as do namespaced ones (xlink:href).
function attributeName(name: string): string {
  if (name === "className") return "class";
  if (name === "htmlFor") return "for";
  if (name.startsWith("aria-") || name.startsWith("data-") || name.includes("-") || name.includes(":")) return name;
  return name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

// React accepts the style prop as an object; the DOM wants a string.
function styleText(value: unknown): string {
  if (typeof value === "string") return value;
  return Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v != null && v !== "")
    .map(([property, v]) => `${property.startsWith("--") ? property : attributeName(property)}: ${v}`)
    .join("; ");
}
