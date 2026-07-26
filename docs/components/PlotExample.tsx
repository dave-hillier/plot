import {Children, type ReactNode} from "react";

// Renders a live chart together with its own JSX source in a collapsible
// block. Instances are injected at build time by the remark-plot-source
// plugin — the first child is the chart and the rest is its highlighted code
// fence; pages never reference this component directly.
export function PlotExample({children}: {children?: ReactNode}) {
  const [chart, ...code] = Children.toArray(children);
  return (
    <div className="plot-example">
      {chart}
      <details className="plot-example-code" open>
        <summary>Code</summary>
        {code}
      </details>
    </div>
  );
}
