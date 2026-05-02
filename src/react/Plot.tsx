import React, {createElement, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode} from "react";
import {plot as imperativePlot, computePlot} from "../plot.js";
import {PlotContext} from "./PlotContext.js";
import type {MarkFactory} from "./useMark.js";
import {PointerRoot, PointerContext} from "./interactions/PointerContext.js";

// <Plot> renders a JSX <svg> populated by each mark's renderJSX(). For marks
// whose renderJSX throws or is missing, we fall back to mounting the
// imperative render() output via a ref + appendChild so existing
// imperative-only marks keep working during the migration.
//
// Children's <Mark> components register their factories into marksRef during
// render; a useLayoutEffect then runs computePlot and stores the result in
// state. The component re-renders with <PlotSvg> as a normal React child so
// the JSX tree participates in the parent root's act() scope under JSDOM.
// Imperative escape hatches (Tip pointer plumbing, computePlot failures)
// mount their SVG into a separate ref-managed host div.
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
  | {kind: "jsx"; computed: any; onSvgRef: (svg: SVGSVGElement | null) => void; onInput: ((e: Event) => void) | null; pointerEnabled: boolean}
  | {kind: "imperative"; svg: SVGSVGElement};

export function Plot({children, title, subtitle, caption, figure, onValue, className: classNameProp, style, ...options}: PlotProps) {
  const marksRef = useRef<Map<string, Registration>>(new Map());
  const seenRef = useRef<Set<string>>(new Set());
  const dirtyRef = useRef(false);
  const [, setVersion] = useState(0);
  const [resolved, setResolved] = useState<ResolvedScales | null>(null);
  const [mode, setMode] = useState<Mode>({kind: "empty"});
  const imperativeHostRef = useRef<HTMLDivElement>(null);

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
    if (!flat.length) {
      setMode((prev) => (prev.kind === "empty" ? prev : {kind: "empty"}));
      return;
    }

    let computed: any;
    try {
      computed = computePlot({...options, marks: flat, style});
    } catch (e) {
      console.warn("Plot: computePlot failed, falling back to imperative.", e);
      const svg = imperativePlot({...options, marks: flat, figure: false, style}) as SVGSVGElement;
      if (classNameProp) svg.classList.add(classNameProp);
      setMode({kind: "imperative", svg});
      return;
    }

    publishResolved({scaleDescriptors: computed.scaleDescriptors, context: computed.context});

    const onSvgRef = (svg: SVGSVGElement | null) => {
      if (!svg) return;
      // Expose scale on the svg, matching imperative API.
      (svg as any).scale = computed.scales?.scales ?? null;
      if (classNameProp) svg.classList.add(classNameProp);
    };

    const onInput = onValue
      ? (e: Event) => {
          const t = e.target as any;
          if (t && "value" in t) onValue(t.value);
        }
      : null;

    const pointerEnabled = computed.marks.some(isPointerConsumer);
    setMode({kind: "jsx", computed, onSvgRef, onInput, pointerEnabled});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey, onValue, classNameProp, style]);

  // Mount the imperatively-built SVG into the host div when in imperative
  // mode. We deliberately do NOT clear children in cleanup: the test harness
  // captures `container.firstElementChild` and reads `outerHTML` after the
  // root unmounts, which would race with a cleanup that empties the host.
  // React's reconciler clears the host's children when transitioning out of
  // imperative mode (the conditional renders different JSX for the next
  // mode), and host children are also dropped naturally on unmount.
  useLayoutEffect(() => {
    if (mode.kind !== "imperative") return;
    const host = imperativeHostRef.current;
    if (!host) return;
    host.replaceChildren(mode.svg);
  }, [mode]);

  const ctx = {
    registerMark,
    scaleDescriptors: resolved?.scaleDescriptors,
    context: resolved?.context,
    plotOptions: options
  };

  const wantsFigure = figure ?? Boolean(title || subtitle || caption);

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
      />
    ) : mode.kind === "imperative" ? (
      <div ref={imperativeHostRef} className="plot-host" />
    ) : (
      <div className="plot-host" />
    );

  const hiddenChildren = <div style={{display: "none"}}>{children}</div>;

  if (!wantsFigure) {
    return (
      <PlotContext.Provider value={ctx}>
        {plotElement}
        {hiddenChildren}
      </PlotContext.Provider>
    );
  }

  return (
    <PlotContext.Provider value={ctx}>
      <figure style={{maxWidth: 640, margin: "0 auto"}}>
        {title != null && <SlotHeader as="h2" content={title} style={{fontSize: "16px", fontWeight: "bold", margin: "0 0 4px"}} />}
        {subtitle != null && <SlotHeader as="h3" content={subtitle} style={{fontSize: "12px", fontWeight: "normal", color: "#666", margin: "0 0 8px"}} />}
        {mode.kind === "jsx" ? <div className="plot-host">{plotElement}</div> : plotElement}
        {caption != null && <SlotHeader as="figcaption" content={caption} style={{fontSize: "12px", color: "#666", marginTop: "4px"}} />}
        {hiddenChildren}
      </figure>
    </PlotContext.Provider>
  );
}

// Renders the whole plot as a JSX <svg> tree.
function PlotSvg({computed, svgRef, className: classNameProp, onInput, pointerEnabled}: any) {
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
  const inner = (
    <>
      <style>{styleText}</style>
      {renderMarks(computed)}
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

function renderMarks(computed: any): ReactNode[] {
  const {marks, stateByMark, facetStateByMark, scales, superdimensions, subdimensions, context, facets, facetDomains, facetTranslate} = computed;
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
      out.push(<MarkSlot key={i} mark={mark} index={index} scales={scales} values={values} dims={superdimensions} context={context} />);
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
        facetMarks.push(<MarkSlot key={f.i} mark={mark} index={index} scales={scales} values={values} dims={subdimensions} context={context} facet={f} facetTranslate={facetTranslate} />);
      }
      if (facetMarks.length > 0) {
        out.push(<g key={i}>{facetMarks}</g>);
      }
    }
  });
  return out;
}

// Renders one mark, preferring renderJSX and falling back to mounting
// imperative render() output via a ref. Pointer-consumer marks (Tip,
// crosshair sub-marks) render with an empty index by default; PointerRoot
// will override this on hover to render only the selected datum.
function MarkSlot({mark, index, scales, values, dims, context, facet, facetTranslate}: any) {
  const groupRef = useRef<SVGGElement | null>(null);
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
    if ((index as any).fx !== undefined) (empty.fx = (index as any).fx), (empty.fy = (index as any).fy), (empty.fi = (index as any).fi);
    if (sel?.i != null) {
      const filled: any = [sel.i];
      filled.fx = (index as any).fx; filled.fy = (index as any).fy; filled.fi = (index as any).fi;
      renderIndex = filled;
    } else {
      renderIndex = empty;
    }
  }

  // Try renderJSX first.
  let jsx: ReactNode = null;
  let useFallback = false;
  if (typeof mark.renderJSX === "function") {
    try {
      // Coerce index to a plain Array. Marks call (index as number[]).map(...)
      // but `index` is often a TypedArray (e.g. Uint32Array); its .map()
      // coerces returned React elements back to numbers, corrupting output.
      const arrayIndex = renderIndex == null || !ArrayBuffer.isView(renderIndex)
        ? renderIndex
        : Object.assign(Array.from(renderIndex as any), {fx: (renderIndex as any).fx, fy: (renderIndex as any).fy, fi: (renderIndex as any).fi});
      jsx = mark.renderJSX(arrayIndex, scales, values, dims, context);
    } catch (e) {
      useFallback = true;
    }
  } else {
    useFallback = true;
  }

  useLayoutEffect(() => {
    if (!useFallback) return;
    const g = groupRef.current;
    if (!g) return;
    g.replaceChildren();
    const node = mark.render(renderIndex, scales, values, dims, context);
    if (node != null) {
      // Move attributes from the rendered <g> onto our slot, then re-parent
      // its children — matching the imperative pipeline's behavior of using
      // a single <g> per mark.
      if ((node as Element).tagName === "g") {
        for (const a of Array.from((node as Element).attributes)) {
          g.setAttribute(a.name, a.value);
        }
        while ((node as Element).firstChild) g.appendChild((node as Element).firstChild!);
      } else {
        g.appendChild(node);
      }
    }
    if (facet && facetTranslate) facetTranslate.call(g, facet);
    return () => {
      if (g) g.replaceChildren();
    };
  });

  if (useFallback) return <g ref={groupRef as any} />;
  // Return the JSX directly. Most marks' renderJSX returns a <g> wrapper
  // already; we don't add another to keep the DOM structure identical to
  // the imperative output.
  return <>{jsx}</>;
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

function isPointerConsumer(mark: any): boolean {
  if (mark == null) return false;
  if (mark.constructor?.name === "Tip") return true;
  if (mark.ariaLabel === "tip") return true;
  if (typeof mark.ariaLabel === "string" && mark.ariaLabel.startsWith("crosshair ")) return true;
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
  return <Tag ref={ref} style={styleProp}>{isNode ? null : content}</Tag>;
}

function stableKey(options: Record<string, any>): string {
  try {
    return JSON.stringify(options, (_k, v) => (typeof v === "function" ? "[fn]" : v));
  } catch {
    return String(Math.random());
  }
}
