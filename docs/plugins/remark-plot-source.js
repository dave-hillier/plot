// Wraps every top-level <Plot> example in a <PlotExample> element whose
// children are the live chart followed by a jsx code fence holding the
// example's own JSX text, sliced from the page source. The fence goes through
// the normal code pipeline (syntax highlighting, copy button), so every
// example shows the React syntax without hand-maintained duplicate fences.
// Only top-level JSX flow elements are wrapped; <Plot> inside expressions
// (IIFEs, layouts) renders chart-only as before.
export default function remarkPlotSource() {
  return (tree, file) => {
    const source = String(file.value);
    tree.children = tree.children.map((node) => {
      if (node.type !== "mdxJsxFlowElement" || (node.name !== "Replot" && node.name !== "Plot")) return node;
      const {start, end} = node.position ?? {};
      if (start?.offset == null || end?.offset == null) return node;
      const text = source.slice(start.offset, end.offset).trimEnd();
      return {
        type: "mdxJsxFlowElement",
        name: "PlotExample",
        attributes: [],
        children: [node, {type: "code", lang: "jsx", value: text}]
      };
    });
  };
}
