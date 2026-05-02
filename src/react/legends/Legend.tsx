import React, {useContext, useEffect, useRef} from "react";
import {legend as imperativeLegend, type LegendScales} from "../../legends.js";
// These helpers live in the JS sources but aren't part of the public .d.ts.
// @ts-expect-error untyped JS export
import {createContext} from "../../context.js";
// @ts-expect-error untyped JS export
import {inherit, isScaleOptions} from "../../options.js";
// @ts-expect-error untyped JS export
import {normalizeScale} from "../../scales.js";
import {PlotContext, type PlotContextValue} from "../PlotContext.js";
import {Ramp} from "./Ramp.js";
import {ColorSwatches, Swatches, SymbolSwatches} from "./Swatches.js";

// The Legend façade prefers the React/JSX path (<Ramp>, <Swatches>) and falls
// back to the imperative `legend(options)` for shapes the JSX components don't
// yet cover. Two ways to use it:
//   - Standalone: pass the scale spec via the matching key (e.g.,
//     `color={{...}}`); the dispatch picks the legend type from whichever
//     scale key is present (color, opacity, or symbol).
//   - Plot-scoped: nest inside a <Plot> and use `scale="<name>"` to resolve
//     a named scale from the parent's computed scaleDescriptors.
export type LegendProps = LegendScales;

export function Legend(props: LegendProps) {
  const optionsKey = stableKey(props);
  const ctx = useContext(PlotContext);

  // If we're inside a Plot and the legend refers to a named scale, resolve
  // that scale from the parent's computed scaleDescriptors and route through
  // the JSX legend components — mirroring `exposeLegends`.
  const scaleName = (props as any)?.scale;
  const plotScaleElement =
    typeof scaleName === "string" && ctx?.scaleDescriptors && ctx.scaleDescriptors[scaleName]
      ? renderPlotScopedLegend(scaleName, props, ctx)
      : null;

  // Try the JSX paths in order: swatches first (covers ordinal color, symbol,
  // ordinal/threshold opacity), then ramp (continuous color/opacity). Anything
  // else falls through to the imperative renderer mounted below.
  // If `scale: "<name>"` was passed but the parent <Plot>'s scale descriptors
  // haven't been published yet (first paint, before the layout effect runs),
  // suppress the imperative fallback — `legend({scale: "color"})` would throw.
  // The plot-scoped JSX path will render once `scaleDescriptors` arrives.
  const awaitingPlotScale = typeof scaleName === "string" && plotScaleElement === null;
  const swatchesElement = plotScaleElement === null && isSwatchesLegend(props) ? <Swatches {...props} /> : null;
  const rampElement = plotScaleElement === null && swatchesElement === null ? rampJSX(props as any) : null;
  const jsx = plotScaleElement ?? swatchesElement ?? rampElement;
  const useImperative = jsx === null && !awaitingPlotScale;

  // Imperative mounts go into a separate child div so they can't clobber the
  // React-managed JSX path's children (and vice-versa).
  const impHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, [optionsKey, useImperative]);

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

// Resolves a named-scale legend (e.g. <Legend scale="color">) against the
// parent <Plot>'s computed scaleDescriptors and renders it via Ramp/Swatches.
// Mirrors `exposeLegends(scaleDescriptors, context, defaults)` from
// src/legends.js: it applies the same `inherit(options, context, defaults)`
// merge before dispatching to the right legend kind. Returns null for shapes
// the JSX path doesn't yet cover (continuous opacity ramps, ordinal/threshold
// "ramp" opacity legends — Unit 4 territory).
function renderPlotScopedLegend(
  key: string,
  props: Record<string, any>,
  ctx: PlotContextValue
): React.ReactElement | null {
  if (key !== "color" && key !== "opacity" && key !== "symbol") return null;
  const scale = ctx.scaleDescriptors![key];
  if (!scale) return null;
  const defaults = ctx.plotOptions?.[key];
  const {scale: _scale, ...rest} = props;
  const merged = legendOptions(ctx.context, defaults, rest);

  if (key === "symbol") {
    const resolve = (k: string) => ctx.scaleDescriptors?.[k] ?? null;
    return <SymbolSwatches scale={scale} resolve={resolve} {...merged} />;
  }

  if (key === "color") {
    if (scale.domain === undefined) return null;
    const {legend = true, ...rampOpts} = merged;
    const kind = legend === true ? (scale.type === "ordinal" ? "swatches" : "ramp") : `${legend}`.toLowerCase();
    if (kind === "swatches") return <ColorSwatches scale={scale} {...rampOpts} />;
    if (kind === "ramp") return <Ramp scale={scale} {...rampOpts} />;
    return null;
  }

  // key === "opacity"
  const {type, interpolate} = scale;
  const {legend = true, color = "rgb(0,0,0)", ...rest2} = merged;
  if (type === "ordinal" || type === "threshold") {
    const kind = legend === true ? "swatches" : `${legend}`.toLowerCase();
    if (kind === "swatches") return <ColorSwatches scale={{...scale, color, key: "opacity"}} {...rest2} />;
    // Ordinal/threshold opacity ramp uses a filter — punt to imperative (Unit 4).
    return null;
  }
  if (!interpolate) return null;
  const kind = legend === true ? "ramp" : `${legend}`.toLowerCase();
  if (kind !== "ramp") return null;
  // Continuous opacity ramps: punt to imperative (Unit 4).
  return null;
}

// Mirrors `legendOptions(context, scale, options)` from src/legends.js:
// merges (in order) the user-supplied `options`, the plot's render context
// (className + ambient defaults), and any label/ticks/tickFormat from the
// originating scale options.
function legendOptions(context: any, scale: any, options: any): any {
  if (!context) return {...options};
  const {className, ...rest} = context;
  const {label, ticks, tickFormat} = (scale ?? {}) as Record<string, any>;
  return inherit(options, {className, ...rest}, {label, ticks, tickFormat});
}

function stableKey(options: Record<string, any>): string {
  try {
    return JSON.stringify(options, (_k, v) => (typeof v === "function" ? "[fn]" : v));
  } catch {
    return String(Math.random());
  }
}
