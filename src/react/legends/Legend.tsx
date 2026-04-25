import React, {useEffect, useRef} from "react";
import {legend as imperativeLegend, type LegendScales} from "../../legends.js";

// The Legend façade delegates to the imperative `legend(options)` API. Pass the
// scale spec directly via the matching key (e.g., `color={{...}}`); the
// imperative API picks the legend type from whichever scale key is present
// (color, opacity, or symbol). The returned DOM node (an <svg> ramp or an HTML
// swatches container) is mounted into a host <div> via a ref.
//
// Note: this component is standalone — it does not read scales from <Plot>
// context. To show a legend tied to a plot's color scale, pass the same scale
// options to both <Plot color={...}> and <Legend color={...}>.
export type LegendProps = LegendScales;

export function Legend(props: LegendProps) {
  const ref = useRef<HTMLDivElement>(null);
  const optionsKey = stableKey(props);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const node = imperativeLegend(props as any);
    host.replaceChildren(node);
    return () => {
      host.replaceChildren();
    };
    // optionsKey captures the JSON shape of `props`; we intentionally don't
    // list `props` itself to avoid spurious rebuilds on identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey]);

  return <div ref={ref} className="plot-legend" />;
}

function stableKey(options: Record<string, any>): string {
  try {
    return JSON.stringify(options, (_k, v) => (typeof v === "function" ? "[fn]" : v));
  } catch {
    return String(Math.random());
  }
}
