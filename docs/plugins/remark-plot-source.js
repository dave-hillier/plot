// Wraps every top-level <Plot> example in a <PlotExample source="…"> element,
// where source is the example's own JSX text sliced from the page source. The
// PlotExample component (provided app-wide via MDXProvider) renders the live
// chart with its source in a collapsible code block, so every example shows
// the React syntax without hand-maintained duplicate fences. Only top-level
// JSX flow elements are wrapped; <Plot> inside expressions (IIFEs, layouts)
// renders chart-only as before.
export default function remarkPlotSource() {
  return (tree, file) => {
    const source = String(file.value);
    tree.children = tree.children.map((node) => {
      if (node.type !== "mdxJsxFlowElement" || node.name !== "Plot") return node;
      const {start, end} = node.position ?? {};
      if (start?.offset == null || end?.offset == null) return node;
      const text = source.slice(start.offset, end.offset).trimEnd();
      return {
        type: "mdxJsxFlowElement",
        name: "PlotExample",
        attributes: [{type: "mdxJsxAttribute", name: "source", value: text}],
        children: [node]
      };
    });
  };
}
