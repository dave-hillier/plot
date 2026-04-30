import React, {createElement, useLayoutEffect, useRef, useState, type ReactNode} from "react";
import {createRoot, type Root} from "react-dom/client";
import {plot as imperativePlot, computePlot} from "../plot.js";
// @ts-expect-error legends.js is untyped
import {exposeLegends} from "../legends.js";
import {PlotContext} from "./PlotContext.js";
import type {MarkFactory} from "./useMark.js";

// <Plot> renders a JSX <svg> populated by each mark's renderJSX(). For marks
// whose renderJSX throws or is missing, we fall back to mounting the
// imperative render() output via a ref + appendChild so existing
// imperative-only marks keep working during the migration.
//
// The whole svg tree is rendered through a single createRoot. computePlot()
// produces the pre-render state (scales, dimensions, facets, per-mark
// channels) so this component can iterate marks and call renderJSX without
// re-implementing the imperative pipeline.
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

interface LegendRegistration {
  options: any;
  host: HTMLElement;
}

export function Plot({children, title, subtitle, caption, figure, onValue, className: classNameProp, style, ...options}: PlotProps) {
  const marksRef = useRef<Map<string, Registration>>(new Map());
  const legendsRef = useRef<Map<string, LegendRegistration>>(new Map());
  const seenRef = useRef<Set<string>>(new Set());
  const dirtyRef = useRef(false);
  const [, setVersion] = useState(0);

  seenRef.current = new Set();

  const registerLegend = (id: string, opts: any, host: HTMLElement) => {
    const prev = legendsRef.current.get(id);
    legendsRef.current.set(id, {options: opts, host});
    if (!prev || stableKey(prev.options) !== stableKey(opts)) {
      setVersion((v) => v + 1);
    }
  };
  const unregisterLegend = (id: string) => {
    if (legendsRef.current.delete(id)) setVersion((v) => v + 1);
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

  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);
  const optionsKey = stableKey(options);

  useLayoutEffect(() => {
    if (!hostRef.current) return;
    const flat: any[] = [];
    for (const {factory} of marksRef.current.values()) {
      const m = factory();
      if (Array.isArray(m)) flat.push(...m);
      else flat.push(m);
    }
    if (!flat.length) {
      if (rootRef.current) rootRef.current.unmount(), (rootRef.current = null);
      hostRef.current.replaceChildren();
      return;
    }

    let computed: any;
    try {
      computed = computePlot({...options, marks: flat, style});
    } catch (e) {
      console.warn("Plot: computePlot failed, falling back to imperative.", e);
      const svg = imperativePlot({...options, marks: flat, figure: false, style}) as SVGSVGElement;
      if (classNameProp) svg.classList.add(classNameProp);
      hostRef.current.replaceChildren(svg);
      mountLegends(svg, legendsRef.current);
      return;
    }

    if (!rootRef.current) {
      // Ensure the host has no leftover imperative children.
      hostRef.current.replaceChildren();
      rootRef.current = createRoot(hostRef.current);
    }

    const onSvgRef = (svg: SVGSVGElement | null) => {
      if (!svg) return;
      // Expose scale + legend on the svg, matching imperative API.
      (svg as any).scale = computed.scales?.scales ?? null;
      if (typeof exposeLegends === "function") {
        (svg as any).legend = exposeLegends(computed.scaleDescriptors, computed.context, options);
      }
      if (classNameProp) svg.classList.add(classNameProp);
      mountLegends(svg, legendsRef.current);
    };

    let onInput: ((e: Event) => void) | null = null;
    if (onValue) {
      onInput = (e) => {
        const t = e.target as any;
        if (t && "value" in t) onValue(t.value);
      };
    }

    rootRef.current.render(<PlotSvg computed={computed} svgRef={onSvgRef} className={classNameProp} style={style} onInput={onInput} />);

    return () => {
      // Don't unmount — keep the root alive so subsequent updates reuse it.
      // The cleanup happens implicitly when the component unmounts via the
      // unmount effect below.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey, onValue, classNameProp, style]);

  // Unmount the React root when <Plot> unmounts.
  useLayoutEffect(() => {
    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
    };
  }, []);

  const ctx = {registerMark, registerLegend, unregisterLegend};

  const wrap = (
    <PlotContext.Provider value={ctx}>
      <div ref={hostRef} className="plot-host" />
      <div style={{display: "none"}}>{children}</div>
    </PlotContext.Provider>
  );

  const wantsFigure = figure ?? Boolean(title || subtitle || caption);
  if (!wantsFigure) return wrap;

  return (
    <figure style={{maxWidth: 640, margin: "0 auto"}}>
      {title != null && <SlotHeader as="h2" content={title} style={{fontSize: "16px", fontWeight: "bold", margin: "0 0 4px"}} />}
      {subtitle != null && <SlotHeader as="h3" content={subtitle} style={{fontSize: "12px", fontWeight: "normal", color: "#666", margin: "0 0 8px"}} />}
      {wrap}
      {caption != null && <SlotHeader as="figcaption" content={caption} style={{fontSize: "12px", color: "#666", marginTop: "4px"}} />}
    </figure>
  );
}

// Renders the whole plot as a JSX <svg> tree.
function PlotSvg({computed, svgRef, className: classNameProp, style: styleOpt, onInput}: any) {
  const {className, ariaLabel, ariaDescription, dimensions} = computed;
  const {width, height} = dimensions;
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
  const inlineStyle = typeof styleOpt === "object" && styleOpt !== null && !Array.isArray(styleOpt) ? styleOpt : undefined;
  const inlineStyleString = typeof styleOpt === "string" ? styleOpt : undefined;
  return (
    <svg
      ref={svgRef as any}
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
      style={inlineStyle as any}
      data-style={inlineStyleString}
      onInput={onInput ?? undefined}
    >
      <style>{styleText}</style>
      {renderMarks(computed)}
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
// imperative render() output via a ref.
function MarkSlot({mark, index, scales, values, dims, context, facet, facetTranslate}: any) {
  const groupRef = useRef<SVGGElement | null>(null);
  // Try renderJSX first.
  let jsx: ReactNode = null;
  let useFallback = false;
  if (typeof mark.renderJSX === "function") {
    try {
      // Coerce index to a plain Array. Marks call (index as number[]).map(...)
      // but `index` is often a TypedArray (e.g. Uint32Array); its .map()
      // coerces returned React elements back to numbers, corrupting output.
      const arrayIndex = index == null || !ArrayBuffer.isView(index)
        ? index
        : Object.assign(Array.from(index as any), {fx: (index as any).fx, fy: (index as any).fy, fi: (index as any).fi});
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
    const node = mark.render(index, scales, values, dims, context);
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

function mountLegends(svg: SVGSVGElement, legends: Map<string, LegendRegistration>) {
  for (const {options: legendOptions, host} of legends.values()) {
    const scaleName = typeof legendOptions === "string" ? legendOptions : legendOptions?.scale;
    if (scaleName && typeof (svg as any).legend === "function") {
      const node = (svg as any).legend(scaleName, legendOptions);
      if (node) host.replaceChildren(node);
    }
  }
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
