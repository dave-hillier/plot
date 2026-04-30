import React, {useContext, useEffect, useId, useRef} from "react";
import {legend as imperativeLegend, type LegendScales} from "../../legends.js";
// These helpers live in the JS sources but aren't part of the public .d.ts.
// @ts-expect-error untyped JS export
import {createContext} from "../../context.js";
// @ts-expect-error untyped JS export
import {inherit, isScaleOptions} from "../../options.js";
// @ts-expect-error untyped JS export
import {normalizeScale} from "../../scales.js";
import {PlotContext} from "../PlotContext.js";
import {Ramp} from "./Ramp.js";

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
  const ctx = useContext(PlotContext);
  const id = useId();

  // If we're inside a Plot and the legend refers to a named scale, register
  // with the parent so it can resolve via the plot's exposed legend method.
  const scaleName = (props as any)?.scale;
  const usePlotScale = ctx && ctx.registerLegend && typeof scaleName === "string";

  // Try the JSX path for ramp-style color/opacity legends. Falls back to the
  // imperative renderer (mounted via ref below) for cases not yet covered:
  // symbol legends, swatches, opacity-with-filter, plot-scoped registration.
  const jsx = !usePlotScale ? rampJSX(props as any) : null;

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (usePlotScale && ctx && ctx.registerLegend && ctx.unregisterLegend) {
      ctx.registerLegend(id, props, host);
      return () => {
        ctx.unregisterLegend!(id);
        host.replaceChildren();
      };
    }
    if (jsx) {
      // JSX path renders directly via React; no DOM mount needed.
      host.replaceChildren();
      return;
    }
    const node = imperativeLegend(props as any);
    host.replaceChildren(node);
    return () => {
      host.replaceChildren();
    };
    // optionsKey captures the JSON shape of `props`; we intentionally don't
    // list `props` itself to avoid spurious rebuilds on identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey, usePlotScale, jsx != null]);

  return (
    <div ref={ref} className="plot-legend">
      {jsx}
    </div>
  );
}

// Resolves a ramp-eligible color/opacity legend to a <Ramp> element, or null
// if the props don't describe a case the JSX path supports yet. Mirrors the
// dispatch in src/legends.js (legendColor → ramp).
function rampJSX(props: Record<string, any>): React.ReactElement | null {
  const colorOpts = props.color;
  if (!isScaleOptions(colorOpts)) return null;
  const normalized = normalizeScale("color", colorOpts);
  if (normalized.domain === undefined) return null; // no identity legend
  const legendKind = props.legend ?? true;
  const kind = legendKind === true ? (normalized.type === "ordinal" ? "swatches" : "ramp") : `${legendKind}`.toLowerCase();
  if (kind !== "ramp") return null;
  // Inherit options the same way legends.js#legendOptions does, so things
  // like className / document context flow through.
  const context = createContext(props);
  const {className, ...ctxRest} = context as any;
  const merged = inherit(props, {className, ...ctxRest}, {label: colorOpts.label, ticks: colorOpts.ticks, tickFormat: colorOpts.tickFormat}) as any;
  const {legend: _legend, color: _color, ...options} = merged;
  return <Ramp scale={normalized} {...options} />;
}

function stableKey(options: Record<string, any>): string {
  try {
    return JSON.stringify(options, (_k, v) => (typeof v === "function" ? "[fn]" : v));
  } catch {
    return String(Math.random());
  }
}
