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
import {Swatches} from "./Swatches.js";

// The Legend façade prefers the React/JSX path (<Ramp>, <Swatches>) and falls
// back to the imperative `legend(options)` for cases the JSX components don't
// yet cover (e.g. plot-scoped registration). Pass the scale spec directly via
// the matching key (e.g., `color={{...}}`); the dispatch picks the legend type
// from whichever scale key is present (color, opacity, or symbol).
//
// Note: this component is standalone — it does not read scales from <Plot>
// context. To show a legend tied to a plot's color scale, pass the same scale
// options to both <Plot color={...}> and <Legend color={...}>.
export type LegendProps = LegendScales;

export function Legend(props: LegendProps) {
  const optionsKey = stableKey(props);
  const ctx = useContext(PlotContext);
  const id = useId();

  // If we're inside a Plot and the legend refers to a named scale, register
  // with the parent so it can resolve via the plot's exposed legend method.
  const scaleName = (props as any)?.scale;
  const usePlotScale = ctx && ctx.registerLegend && typeof scaleName === "string";

  // Try the JSX paths in order: swatches first (covers ordinal color, symbol,
  // ordinal/threshold opacity), then ramp (continuous color/opacity). Anything
  // else falls through to the imperative renderer mounted below.
  const swatchesElement = !usePlotScale && isSwatchesLegend(props) ? <Swatches {...props} /> : null;
  const rampElement = !usePlotScale && swatchesElement === null ? rampJSX(props as any) : null;
  const jsx = swatchesElement ?? rampElement;
  const useImperative = !usePlotScale && jsx === null;

  // Imperative mounts go into a separate child div so they can't clobber the
  // React-managed JSX path's children (and vice-versa).
  const impHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (usePlotScale && ctx && ctx.registerLegend && ctx.unregisterLegend) {
      const host = impHostRef.current;
      if (!host) return;
      ctx.registerLegend(id, props, host);
      return () => {
        ctx.unregisterLegend!(id);
        host.replaceChildren();
      };
    }
    if (!useImperative) {
      // JSX path: clear the imperative slot so a previous imperative render
      // doesn't linger after switching to JSX.
      if (impHostRef.current) impHostRef.current.replaceChildren();
      return;
    }
    const host = impHostRef.current;
    if (!host) return;
    const node = imperativeLegend(props as any);
    host.replaceChildren(node);
    return () => {
      host.replaceChildren();
    };
    // optionsKey captures the JSON shape of `props`; we intentionally don't
    // list `props` itself to avoid spurious rebuilds on identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey, usePlotScale, useImperative]);

  return (
    <div className="plot-legend">
      {jsx}
      <div ref={impHostRef} style={{display: "contents"}} />
    </div>
  );
}

// True when the legend props describe a swatches-style legend that the JSX
// `<Swatches>` component can render: any symbol scale, an ordinal-or-explicit
// "swatches" color scale, or an ordinal/threshold opacity scale (default
// "swatches"). All other shapes fall through to the ramp/imperative path.
function isSwatchesLegend(props: LegendScales): boolean {
  const p = props as any;
  if (isScaleOptions(p.symbol)) return true;
  if (isScaleOptions(p.color)) {
    const t = p.color.type;
    const explicit = p.legend !== undefined && p.legend !== true ? `${p.legend}`.toLowerCase() : null;
    if (explicit === "swatches") return true;
    if (explicit === "ramp") return false;
    return t === "ordinal";
  }
  if (isScaleOptions(p.opacity)) {
    const t = p.opacity.type;
    if (t !== "ordinal" && t !== "threshold") return false;
    const explicit = p.legend !== undefined && p.legend !== true ? `${p.legend}`.toLowerCase() : null;
    return explicit === null || explicit === "swatches";
  }
  return false;
}

// Resolves a ramp-eligible color/opacity legend to a <Ramp> element, or null
// if the props don't describe a case the JSX path supports yet.
function rampJSX(props: Record<string, any>): React.ReactElement | null {
  const colorOpts = props.color;
  if (!isScaleOptions(colorOpts)) return null;
  const normalized = normalizeScale("color", colorOpts);
  if (normalized.domain === undefined) return null; // no identity legend
  const legendKind = props.legend ?? true;
  const kind = legendKind === true ? (normalized.type === "ordinal" ? "swatches" : "ramp") : `${legendKind}`.toLowerCase();
  if (kind !== "ramp") return null;
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
