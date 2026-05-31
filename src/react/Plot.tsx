import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type ReactElement
} from "react";
import {computePlot} from "../plot.js";
import {consumeWarnings} from "../warnings.js";
import {PlotContext} from "./PlotContext.js";
import type {MarkFactory} from "./useMark.js";
import {PointerRoot, PointerContext} from "./interactions/PointerContext.js";
import {buildAutoLegends, Legend} from "./legends/Legend.js";
import {createClipRegistry, registerClips, type ClipRegistry} from "./clip.js";

// <Plot> renders a JSX <svg> populated entirely by each mark's renderJSX();
// there is no imperative (d3-selection) render fallback.
//
// Children's <Mark> components register their factories into marksRef during
// render; a useLayoutEffect then runs computePlot and stores the result in
// state. The component re-renders with <PlotSvg> as a normal React child so
// the JSX tree participates in the parent root's act() scope under JSDOM.
export interface PlotProps {
  children?: ReactNode;
  width?: number;
  height?: number;
  margin?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  aspectRatio?: number | boolean;
  x?: any;
  y?: any;
  color?: any;
  opacity?: any;
  r?: any;
  symbol?: any;
  length?: any;
  fx?: any;
  fy?: any;
  inset?: number;
  insetTop?: number;
  insetRight?: number;
  insetBottom?: number;
  insetLeft?: number;
  round?: boolean;
  nice?: boolean | number;
  clamp?: boolean;
  zero?: boolean;
  align?: number;
  padding?: number;
  label?: string;
  projection?: any;
  facet?: any;
  className?: string;
  style?: any;
  ariaLabel?: string;
  ariaDescription?: string;
  axis?: any;
  grid?: any;
  clip?: boolean | "frame" | null;
  title?: string;
  subtitle?: string;
  caption?: string;
  figure?: boolean;
  onValue?: (value: any) => void;
  [key: string]: any;
}

interface Registration {
  stamp: string;
  factory: MarkFactory;
}

interface ResolvedScales {
  scaleDescriptors: Record<string, any>;
  context: any;
}

type Mode =
  | {kind: "empty"}
  | {
      kind: "jsx";
      computed: any;
      onSvgRef: (svg: SVGSVGElement | null) => void;
      onInput: ((e: Event) => void) | null;
      pointerEnabled: boolean;
      warnings: number;
    };

export function Plot({
  children,
  title,
  subtitle,
  caption,
  figure,
  onValue,
  className: classNameProp,
  style,
  ...options
}: PlotProps) {
  const marksRef = useRef<Map<string, Registration>>(new Map());
  const seenRef = useRef<Set<string>>(new Set());
  const dirtyRef = useRef(false);
  const [, setVersion] = useState(0);
  const [resolved, setResolved] = useState<ResolvedScales | null>(null);
  const [mode, setMode] = useState<Mode>({kind: "empty"});

  seenRef.current = new Set();

  // Updates the published scale descriptors only when the set of scale keys
  // changes; identity-only changes mutate in place to avoid re-rendering
  // every <Legend scale="…"> on each plot update.
  const publishResolved = (next: ResolvedScales) => {
    if (resolved && sameScaleKeys(resolved.scaleDescriptors, next.scaleDescriptors)) {
      resolved.scaleDescriptors = next.scaleDescriptors;
      resolved.context = next.context;
    } else {
      setResolved(next);
    }
  };

  const registerMark = (id: string, stamp: string, factory: MarkFactory) => {
    seenRef.current.add(id);
    const prev = marksRef.current.get(id);
    if (!prev || prev.stamp !== stamp) {
      marksRef.current.set(id, {stamp, factory});
      dirtyRef.current = true;
    } else {
      prev.factory = factory;
    }
  };

  useLayoutEffect(() => {
    for (const id of marksRef.current.keys()) {
      if (!seenRef.current.has(id)) {
        marksRef.current.delete(id);
        dirtyRef.current = true;
      }
    }
    if (dirtyRef.current) {
      dirtyRef.current = false;
      setVersion((v) => v + 1);
    }
  });

  const optionsKey = stableKey(options);

  useLayoutEffect(() => {
    const flat: any[] = [];
    for (const {factory} of marksRef.current.values()) {
      const m = factory();
      if (Array.isArray(m)) flat.push(...m);
      else flat.push(m);
    }
    let computed: any;
    try {
      // Always run computePlot, even with zero marks: declared position scales
      // (e.g. x={{type: "log", …}}) infer implicit axis marks, so a markless
      // <Plot> can still render axes — matching the imperative plot().
      computed = computePlot({...options, marks: flat, style});
    } catch (e) {
      console.error("Plot: computePlot failed.", e);
      setMode((prev) => (prev.kind === "empty" ? prev : {kind: "empty"}));
      return;
    }

    // Nothing to render (no marks and no inferred axes); keep the empty host.
    if (!computed.marks.length) {
      setMode((prev) => (prev.kind === "empty" ? prev : {kind: "empty"}));
      return;
    }

    publishResolved({scaleDescriptors: computed.scaleDescriptors, context: computed.context});

    // Drain the global warning counter just as the imperative plot() does, so
    // the warn() dedupe state (lastMessage) doesn't leak across plots and we
    // can render the ⚠️ indicator. computePlot emits warnings during mark
    // initialization above.
    const warnings = consumeWarnings();

    const onSvgRef = (svg: SVGSVGElement | null) => {
      if (!svg) return;
      // Expose scale on the svg, matching imperative API.
      (svg as any).scale = computed.scales?.scales ?? null;
      if (classNameProp) svg.classList.add(classNameProp);
      // Apply the plot-level style option to the <svg>, mirroring
      // applyInlineStyles on the imperative path (string or object).
      if (typeof style === "string") svg.setAttribute("style", style);
      else if (style != null) Object.assign(svg.style, style as any);
    };

    const onInput = onValue
      ? (e: Event) => {
          const t = e.target as any;
          if (t && "value" in t) onValue(t.value);
        }
      : null;

    const pointerEnabled = computed.marks.some(isPointerConsumer);
    setMode({kind: "jsx", computed, onSvgRef, onInput, pointerEnabled, warnings});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey, onValue, classNameProp, style]);

  const ctx = {
    registerMark,
    scaleDescriptors: resolved?.scaleDescriptors,
    context: resolved?.context,
    plotOptions: options
  };

  // Auto-legends (color/opacity/symbol scales with legend requested) render
  // via the React legend components and force figure mode, matching the
  // imperative plot()'s createLegends behavior.
  const autoLegends = resolved?.scaleDescriptors
    ? buildAutoLegends(resolved.scaleDescriptors, resolved.context, options)
    : [];

  // Explicit <Legend> children (e.g. <Legend scale="color">) are promoted out
  // of the hidden children div and rendered visibly inside the figure, matching
  // the imperative plot()'s createLegends/exposeLegends placement above the
  // <svg>. Any present explicit legend forces figure mode; the remaining
  // children (marks) stay in the hidden div for registration.
  const explicitLegends: ReactElement[] = [];
  const otherChildren: ReactNode[] = [];
  React.Children.forEach(children, (child, i) => {
    if (React.isValidElement(child) && child.type === Legend) {
      explicitLegends.push(React.cloneElement(child as ReactElement, {key: `legend-${i}`}));
    } else {
      otherChildren.push(child);
    }
  });

  const wantsFigure =
    figure ?? Boolean(title || subtitle || caption || autoLegends.length > 0 || explicitLegends.length > 0);

  // In figure mode, wrap the plot in a div.plot-host inside the figure to
  // match the imperative API's structure (figure > h2/h3 > div.plot-host > svg
  // > figcaption). In non-figure mode, return the SVG directly (matching the
  // existing .svg-snapshot test expectations) or the imperatively-mounted
  // host div.
  const plotElement =
    mode.kind === "jsx" ? (
      <PlotSvg
        computed={mode.computed}
        svgRef={mode.onSvgRef}
        className={classNameProp}
        onInput={mode.onInput}
        pointerEnabled={mode.pointerEnabled}
        warnings={mode.warnings}
      />
    ) : (
      <div className="plot-host" />
    );

  const hiddenChildren = <div style={{display: "none"}}>{otherChildren}</div>;

  if (!wantsFigure) {
    return (
      <PlotContext.Provider value={ctx}>
        {explicitLegends}
        {plotElement}
        {hiddenChildren}
      </PlotContext.Provider>
    );
  }

  return (
    <PlotContext.Provider value={ctx}>
      <figure style={{maxWidth: 640, margin: "0 auto"}}>
        {title != null && (
          <SlotHeader as="h2" content={title} style={{fontSize: "16px", fontWeight: "bold", margin: "0 0 4px"}} />
        )}
        {subtitle != null && (
          <SlotHeader
            as="h3"
            content={subtitle}
            style={{fontSize: "12px", fontWeight: "normal", color: "#666", margin: "0 0 8px"}}
          />
        )}
        {autoLegends}
        {explicitLegends}
        {mode.kind === "jsx" ? <div className="plot-host">{plotElement}</div> : plotElement}
        {caption != null && (
          <SlotHeader as="figcaption" content={caption} style={{fontSize: "12px", color: "#666", marginTop: "4px"}} />
        )}
        {hiddenChildren}
      </figure>
    </PlotContext.Provider>
  );
}

// Renders the whole plot as a JSX <svg> tree.
function PlotSvg({computed, svgRef, className: classNameProp, onInput, pointerEnabled, warnings}: any) {
  const {className, ariaLabel, ariaDescription, dimensions} = computed;
  const {width, height} = dimensions;
  const internalSvgRef = useRef<SVGSVGElement | null>(null);
  const setSvgRef = (el: SVGSVGElement | null) => {
    internalSvgRef.current = el;
    if (typeof svgRef === "function") svgRef(el);
  };
  const styleText = `:where(.${className}) {
  --plot-background: white;
  display: block;
  height: auto;
  height: intrinsic;
  max-width: 100%;
}
:where(.${className} text),
:where(.${className} tspan) {
  white-space: pre;
}`;
  // Render the ⚠️ warning indicator after the marks, matching the imperative
  // plot() (font-family="initial" fixes emoji rendering in Chrome).
  const warningIndicator =
    warnings > 0 ? (
      <text x={width} y={20} dy="-1em" textAnchor="end" fontFamily="initial">
        {"⚠️"}
        <title>{`${warnings.toLocaleString("en-US")} warning${
          warnings === 1 ? "" : "s"
        }. Please check the console.`}</title>
      </text>
    ) : null;
  // Allocate clip-path defs up front (pre-pass) so they're known before the
  // marks that reference them are rendered, then render them in the <svg>.
  const clipReg = createClipRegistry();
  registerClips(computed, clipReg);
  const inner = (
    <>
      <style>{styleText}</style>
      {clipReg.defs}
      {renderMarks(computed, clipReg)}
      {warningIndicator}
    </>
  );
  return (
    <svg
      ref={setSvgRef}
      className={[className, classNameProp].filter(Boolean).join(" ") || undefined}
      fill="currentColor"
      fontFamily="system-ui, sans-serif"
      fontSize={10}
      textAnchor="middle"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-label={ariaLabel ?? undefined}
      aria-description={ariaDescription ?? undefined}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      onInput={onInput ?? undefined}
    >
      {pointerEnabled ? <PointerRoot svgRef={internalSvgRef}>{inner}</PointerRoot> : inner}
    </svg>
  );
}

// Computes the per-facet transform string by invoking the imperative
// facetTranslator against a minimal element shim (it sets a "transform"
// attribute for <g> hosts). Returns undefined when there is no offset.
function facetTransform(facetTranslate: any, f: any): string | undefined {
  if (typeof facetTranslate !== "function") return undefined;
  let transform: string | undefined;
  facetTranslate.call(
    {
      tagName: "g",
      setAttribute: (k: string, v: string) => {
        if (k === "transform") transform = v;
      }
    },
    f
  );
  return transform;
}

// A callback that renders one mark instance (a mark at a given facet/index)
// to a ReactNode. Shared between the interactive React path (<MarkSlot>) and
// the static renderer used by the imperative plot() entry point.
export type RenderOne = (
  mark: any,
  index: any,
  values: any,
  dims: any,
  scales: any,
  context: any,
  key: string
) => ReactNode;

// Walks the computed marks, resolving each mark's per-facet index and (for
// faceted marks) wrapping each facet in a <g transform> at its cell. The
// per-mark rendering is delegated to `renderOne` so the interactive and
// static paths share identical structure.
export function renderMarksWith(computed: any, renderOne: RenderOne): ReactNode[] {
  const {
    marks,
    stateByMark,
    facetStateByMark,
    scales,
    superdimensions,
    subdimensions,
    context,
    facets,
    facetDomains,
    facetTranslate
  } = computed;
  const out: ReactNode[] = [];
  marks.forEach((mark: any, i: number) => {
    const {channels, values, facets: indexes} = stateByMark.get(mark);
    if (facets === undefined || mark.facet === "super") {
      let index: any = null;
      if (indexes) {
        index = indexes[0];
        index = mark.filter(index, channels, values);
        if (index.length === 0) return;
      }
      const node = renderOne(mark, index, values, superdimensions, scales, context, `${i}`);
      if (node != null) out.push(node);
    } else {
      const facetMarks: ReactNode[] = [];
      for (const f of facets) {
        if (!(mark.facetAnchor?.(facets, facetDomains, f) ?? !f.empty)) continue;
        let index: any = null;
        if (indexes) {
          const faceted = facetStateByMark.has(mark);
          index = indexes[faceted ? f.i : 0];
          index = mark.filter(index, channels, values);
          if (index.length === 0) continue;
          if (!faceted && index === indexes[0]) index = subarray(index);
          (index.fx = f.x), (index.fy = f.y), (index.fi = f.i);
        }
        const inner = renderOne(mark, index, values, subdimensions, scales, context, `${i}-${f.i}`);
        if (inner == null) continue;
        // Translate each facet's marks to its cell, mirroring the imperative
        // pipeline's per-facet <g transform> (facetTranslator). Without this
        // wrapper every facet would render at the same origin (overlapping).
        facetMarks.push(
          <g key={f.i} transform={facetTransform(facetTranslate, f)}>
            {inner}
          </g>
        );
      }
      if (facetMarks.length > 0) {
        out.push(<g key={i}>{facetMarks}</g>);
      }
    }
  });
  return out;
}

function renderMarks(computed: any, clipReg: ClipRegistry): ReactNode[] {
  return renderMarksWith(computed, (mark, index, values, dims, scales, context, key) => (
    <MarkSlot
      key={key}
      mark={mark}
      index={index}
      scales={scales}
      values={values}
      dims={dims}
      context={context}
      clipReg={clipReg}
    />
  ));
}

// Renders one mark via its renderJSX into pure React SVG. Pointer-consumer
// marks (Tip, crosshair sub-marks) render with an empty index by default;
// PointerRoot will override this on hover to render only the selected datum.
function MarkSlot({mark, index, scales, values, dims, context, clipReg}: any) {
  const pointerCtx = useContext(PointerContext);
  const pointerConsumer = isPointerConsumer(mark);

  // For pointer-consumer marks, replace the data index with the currently-
  // selected index (or empty when nothing is hovered). The selection key
  // identifies this mark's registration in PointerRoot.
  const fi = (index as any)?.fi ?? null;
  const regId = pointerConsumer ? pointerRegistrationId(mark, fi) : null;

  useEffect(() => {
    if (!pointerCtx || !pointerConsumer || regId == null || index == null || index.length === 0) return;
    return pointerCtx.register({id: regId, index, values, fi, kx: 1, ky: 1, maxRadius: 40});
  }, [pointerCtx, pointerConsumer, regId, index, values, fi]);

  let renderIndex = index;
  if (pointerConsumer && index != null) {
    const sel = pointerCtx && regId ? pointerCtx.selectionFor(regId) : null;
    const empty: any = [];
    if ((index as any).fx !== undefined)
      (empty.fx = (index as any).fx), (empty.fy = (index as any).fy), (empty.fi = (index as any).fi);
    if (sel?.i != null) {
      const filled: any = [sel.i];
      filled.fx = (index as any).fx;
      filled.fy = (index as any).fy;
      filled.fi = (index as any).fi;
      renderIndex = filled;
    } else {
      renderIndex = empty;
    }
  }

  if (typeof mark.renderJSX !== "function") return null;
  // Coerce index to a plain Array. Marks call (index as number[]).map(...)
  // but `index` is often a TypedArray (e.g. Uint32Array); its .map() coerces
  // returned React elements back to numbers, corrupting output.
  const arrayIndex =
    renderIndex == null || !ArrayBuffer.isView(renderIndex)
      ? renderIndex
      : Object.assign(Array.from(renderIndex as any), {
          fx: (renderIndex as any).fx,
          fy: (renderIndex as any).fy,
          fi: (renderIndex as any).fi
        });
  // renderJSX usually returns its own <g> wrapper; we don't add another, to
  // keep the DOM structure identical to the imperative output. Clip wrapping
  // (frame/geo) is applied via the clip registry.
  const jsx = mark.renderJSX(arrayIndex, scales, values, dims, context) as ReactElement;
  return <>{clipReg ? clipReg.wrap(jsx, mark, dims, context) : jsx}</>;
}

// Marks driven by the pointer interaction. Their render is wrapped by
// pointer.js's composeRender (which manages an internal "selected index"
// via D3 event subscriptions on the imperative path). On the React path,
// PointerRoot tracks the selection in React state; pointer-consumer marks
// render with an empty index by default and are overridden to render the
// selected datum when PointerRoot reports a hit.
// Stable id for a pointer registration. Combines aria-label and facet so
// each (mark, facet) pair gets its own slot; the ariaLabel is sufficient
// to disambiguate Tip from crosshair sub-marks within a single Plot.
function pointerRegistrationId(mark: any, fi: number | null): string {
  return `${mark.ariaLabel ?? mark.constructor?.name ?? "?"}#${fi ?? "-"}`;
}

export function isPointerConsumer(mark: any): boolean {
  if (mark == null) return false;
  if (mark.constructor?.name === "Tip") return true;
  if (mark.ariaLabel === "tip") return true;
  if (typeof mark.ariaLabel === "string" && mark.ariaLabel.startsWith("crosshair ")) return true;
  // Pointer-wrapped marks (Plot.pointer/pointerX/pointerY) tag their render
  // function; such marks render only the pointer-selected datum, so they start
  // empty until hover. (A bare `render` function alone is not enough — custom
  // render-prop marks have one too.)
  if (typeof mark.render === "function" && mark.render.pointer === true) return true;
  return false;
}

function sameScaleKeys(a: Record<string, any> | undefined, b: Record<string, any> | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (!(k in b)) return false;
  return true;
}

function subarray(index: any): any {
  return index.slice ? index.slice() : Array.from(index);
}

function SlotHeader({as: Tag, content, style: styleProp}: {as: any; content: any; style?: any}) {
  const ref = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (content && typeof (content as any).nodeType === "number") {
      el.replaceChildren(content as Node);
    } else {
      el.replaceChildren();
      if (content != null) el.appendChild(document.createTextNode(String(content)));
    }
  }, [content]);
  const isNode = content && typeof (content as any).nodeType === "number";
  return (
    <Tag ref={ref} style={styleProp}>
      {isNode ? null : content}
    </Tag>
  );
}

function stableKey(options: Record<string, any>): string {
  try {
    return JSON.stringify(options, (_k, v) => (typeof v === "function" ? "[fn]" : v));
  } catch {
    return String(Math.random());
  }
}
