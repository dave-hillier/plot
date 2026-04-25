import React, {useLayoutEffect, useRef, useState, type ReactNode} from "react";
import {plot as imperativePlot} from "../plot.js";
import {PlotContext} from "./PlotContext.js";
import type {MarkFactory} from "./useMark.js";

// The new <Plot> is an Option-B faithful port: it does no rendering of its
// own. Children call useMark to register imperative Mark factories, then
// <Plot> invokes the imperative `plot()` once registrations have settled and
// mounts the resulting <svg> via a single ref.
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

export function Plot({children, title, subtitle, caption, figure, onValue, className, style, ...options}: PlotProps) {
  const marksRef = useRef<Map<string, Registration>>(new Map());
  const legendsRef = useRef<Map<string, LegendRegistration>>(new Map());
  const seenRef = useRef<Set<string>>(new Set());
  const dirtyRef = useRef(false);
  const [, setVersion] = useState(0);

  // Reset the seen set for this render pass; children call registerMark
  // synchronously during their render and the set tracks which ids survived.
  seenRef.current = new Set();

  const registerLegend = (id: string, options: any, host: HTMLElement) => {
    const prev = legendsRef.current.get(id);
    legendsRef.current.set(id, {options, host});
    if (!prev || stableKey(prev.options) !== stableKey(options)) {
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
      // Keep the latest factory closure even when the stamp is unchanged so
      // inline accessor functions stay current without triggering rebuilds.
      prev.factory = factory;
    }
  };

  // After children render, prune unmounted ids and flush a re-render so the
  // imperative-mount effect picks up the new registration set.
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
  const optionsKey = stableKey(options);

  // Mount/replace the imperative SVG whenever the registration set or scalar
  // options change. We re-build on every flush to keep things simple — the
  // imperative `plot()` is fast and the tree is small.
  useLayoutEffect(() => {
    if (!hostRef.current) return;
    const flat: any[] = [];
    for (const {factory} of marksRef.current.values()) {
      const m = factory();
      if (Array.isArray(m)) flat.push(...m);
      else flat.push(m);
    }
    if (!flat.length) {
      hostRef.current.replaceChildren();
      return;
    }
    const svg = imperativePlot({...options, marks: flat, figure: false, style}) as SVGSVGElement;
    if (className) svg.classList.add(className);
    let onInput: (() => void) | null = null;
    if (onValue) {
      onInput = () => onValue((svg as any).value);
      svg.addEventListener("input", onInput);
    }
    hostRef.current.replaceChildren(svg);
    // Render any registered legends that resolve scales from this plot.
    for (const {options: legendOptions, host} of legendsRef.current.values()) {
      const scaleName = typeof legendOptions === "string" ? legendOptions : legendOptions?.scale;
      if (scaleName && typeof (svg as any).legend === "function") {
        const node = (svg as any).legend(scaleName, legendOptions);
        if (node) host.replaceChildren(node);
      }
    }
    return () => {
      if (onInput) svg.removeEventListener("input", onInput);
    };
    // optionsKey captures the JSON shape of `options`; we intentionally don't
    // list `options` itself to avoid spurious rebuilds on identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey, onValue, className, style]);

  const ctx = {registerMark, registerLegend, unregisterLegend};

  // Hidden registration subtree drives normal React reconciliation; children
  // render useMark and emit null. The display:none div keeps them out of
  // layout entirely.
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

// Render a title/subtitle/caption slot. If the value is a DOM Node (e.g. an
// HTMLElement returned from htl), mount it imperatively so React doesn't
// reject it as an invalid child.
function SlotHeader({as: Tag, content, style}: {as: any; content: any; style?: any}) {
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
  // For string content also render via React for SSR friendliness; effect will
  // overwrite for DOM-node content.
  const isNode = content && typeof (content as any).nodeType === "number";
  return <Tag ref={ref} style={style}>{isNode ? null : content}</Tag>;
}

// Hash plot-level scalar option shape so option changes trigger a rebuild.
// Functions are stripped because their identities aren't meaningful here.
function stableKey(options: Record<string, any>): string {
  try {
    return JSON.stringify(options, (_k, v) => (typeof v === "function" ? "[fn]" : v));
  } catch {
    return String(Math.random());
  }
}
