import type {ReactNode} from "react";

// Renders a live chart together with its own JSX source in a collapsible
// block. Instances are injected at build time by the remark-plot-source
// plugin; pages never reference this component directly.
export function PlotExample({source, children}: {source: string; children?: ReactNode}) {
  return (
    <div className="plot-example">
      {children}
      <details className="plot-example-code" open>
        <summary>Code</summary>
        <pre>
          <code className="language-jsx">{source}</code>
        </pre>
      </details>
    </div>
  );
}
