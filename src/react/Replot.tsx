import {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type ReactElement
} from "react";
import {computePlot} from "../plot.js";
import type {MarkOptions} from "../mark.js";
import {consumeWarnings} from "../warnings.js";
import {PlotContext} from "./PlotContext.js";
import {markEventNames, type MarkEventHandlers, type MarkFactory} from "./useMark.js";
import {PointerRoot, PointerContext} from "./interactions/PointerContext.js";
import {buildAutoLegends, LegendDisplay} from "./legends/Legend.js";
import {createClipRegistry, registerClips, type ClipRegistry} from "./clip.js";
import {FigureLayout} from "./FigureLayout.js";

// <Plot> renders a JSX <svg> populated entirely by each mark's renderJSX();
// there is no imperative (d3-selection) render fallback.
//
// Children's <Mark> components register their factories into marksRef during
// render; a useLayoutEffect then runs computePlot and stores the result in
// state. The component re-renders with <PlotSvg> as a normal React child so
// the JSX tree participates in the parent root's act() scope under JSDOM.
export interface ReplotProps {
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
  clip?: MarkOptions["clip"];
  title?: string;
  subtitle?: string;
  caption?: string;
  // Controls the <figure> wrapper. "auto" (default) wraps only when there's a
  // title/subtitle/caption/legend to show; "always" forces it; "never"
  // suppresses it even when those are present. Booleans are accepted as
  // legacy aliases for "always"/"never".
  figure?: boolean | "auto" | "always" | "never";
  onValue?: (value: any) => void;
  [key: string]: any;
}

interface Registration {
  stamp: string;
  factory: MarkFactory;
  // Handler identities are excluded from the stamp; same-stamp re-registration
  // refreshes them in place so event closures always call the latest ones.
  handlers?: MarkEventHandlers;
}

interface LegendRegistration {
  stamp: string;
  props: Record<string, any>;
}

interface ScaleRegistration {
  stamp: string;
  // Plot-level option key the registration merges into ("x", "y", "color", …,
  // and the scale-adjacent "facet" and "projection" options).
  scaleName: string;
  config: Record<string, any>;
}

interface ResolvedScales {
  scaleDescriptors: Record<string, any>;
  context: any;
  // The options computePlot actually received: the <Plot> props with scale
  // registrations merged in. Legend resolution reads these so scale options
  // declared via components are visible as defaults.
  plotOptions: Record<string, any>;
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

export function Replot({
  children,
  title,
  subtitle,
  caption,
  figure,
  onValue,
  className: classNameProp,
  style,
  ...options
}: ReplotProps) {
  const marksRef = useRef<Map<string, Registration>>(new Map());
  const scalesRef = useRef<Map<string, ScaleRegistration>>(new Map());
  const registrationByMarkRef = useRef<Map<any, Registration>>(new Map());
  const dirtyRef = useRef(false);
  const computedRef = useRef(false);
  const legendsRef = useRef<Map<string, LegendRegistration>>(new Map());
  const pendingLegendOrderRef = useRef<string[]>([]);
  const [version, setVersion] = useState(0);
  const [, setLegendsVersion] = useState(0);
  const [resolved, setResolved] = useState<ResolvedScales | null>(null);
  const [mode, setMode] = useState<Mode>({kind: "empty"});

  // Updates the published scale descriptors only when the set of scale keys
  // changes; identity-only changes mutate in place to avoid re-rendering
  // every <Legend scale="…"> on each plot update.
  const publishResolved = (next: ResolvedScales) => {
    if (resolved && sameScaleKeys(resolved.scaleDescriptors, next.scaleDescriptors)) {
      resolved.scaleDescriptors = next.scaleDescriptors;
      resolved.context = next.context;
      resolved.plotOptions = next.plotOptions;
    } else {
      setResolved(next);
    }
  };

  const registerMark = (id: string, stamp: string, factory: MarkFactory, handlers?: MarkEventHandlers) => {
    const prev = marksRef.current.get(id);
    if (!prev || prev.stamp !== stamp) {
      marksRef.current.set(id, {stamp, factory, handlers});
      dirtyRef.current = true;
    } else {
      prev.factory = factory;
      prev.handlers = handlers;
    }
  };

  // Removal is unmount-driven (useMark's cleanup), NOT inferred from who
  // re-registered this render: when <Plot> re-renders from its own state,
  // unchanged children bail out of rendering and never call registerMark, so
  // any presence-based sweep would wrongly drop live marks. Stable identity
  // (it closes over refs and setVersion only) so useMark's unmount cleanup
  // doesn't re-fire on every render.
  const unregisterMark = useRef((id: string) => {
    if (marksRef.current.delete(id)) setVersion((v) => v + 1);
  }).current;

  // Scale components register like marks: during render, stamped by prop
  // values so a prop change dirties the plot, with same-stamp re-registration
  // refreshing the stored config in place (function identities are excluded
  // from the stamp).
  const registerScale = (id: string, stamp: string, scaleName: string, config: Record<string, any>) => {
    const prev = scalesRef.current.get(id);
    if (!prev || prev.stamp !== stamp) {
      scalesRef.current.set(id, {stamp, scaleName, config});
      dirtyRef.current = true;
    } else {
      prev.config = config;
    }
  };

  // Unmount-driven removal with stable identity, mirroring unregisterMark.
  const unregisterScale = useRef((id: string) => {
    if (scalesRef.current.delete(id)) setVersion((v) => v + 1);
  }).current;

  // Reads the CURRENT handlers for a built mark instance. Stable identity so
  // passing it down doesn't churn props; event closures call it at dispatch
  // time, so a handler-identity update takes effect without any rebuild.
  const getMarkHandlers = useRef(
    (mark: any): MarkEventHandlers | undefined => registrationByMarkRef.current.get(mark)?.handlers
  ).current;

  // Legends register from a layout effect (unlike marks, which register
  // during render): StrictMode's simulated unmount/remount re-registers after
  // its cleanup unregistered, and effect-phase registration may set state
  // directly — so a legend mounted later by a wrapper component (without
  // <Plot> itself re-rendering) still becomes visible. Legend registrations
  // don't feed computePlot, so they bump their own version. A changed stamp
  // stores a fresh registration; same-stamp re-registration only refreshes
  // the stored props (function identities are excluded from the stamp). Each
  // call also records this commit's registration order, which the layout
  // effect below reconciles against the registry: Map insertion order alone
  // would freeze legends at mount order, because React moves keyed instances
  // without remounting them. Last-wins dedupe keeps the order correct under
  // StrictMode double-invocation and heals stale entries from partial
  // commits that <Plot>'s effect never observed.
  const registerLegend = (id: string, stamp: string, props: Record<string, any>) => {
    const pending = pendingLegendOrderRef.current;
    const at = pending.indexOf(id);
    if (at !== -1) pending.splice(at, 1);
    pending.push(id);
    const prev = legendsRef.current.get(id);
    if (!prev || prev.stamp !== stamp) {
      legendsRef.current.set(id, {stamp, props});
      setLegendsVersion((v) => v + 1);
    } else {
      prev.props = props;
    }
  };

  // Unmount-driven removal with stable identity, mirroring unregisterMark.
  const unregisterLegend = useRef((id: string) => {
    if (legendsRef.current.delete(id)) setLegendsVersion((v) => v + 1);
  }).current;

  useLayoutEffect(() => {
    // Child effects run before this one, so the recorded legend registration
    // order is complete for this commit. When every registered legend
    // re-registered (a full re-render of the children), adopt that order —
    // this is what makes reordering keyed <Legend> children reorder the
    // output. Partial commits (a lone legend re-rendered or mounted by its
    // wrapper) can't reveal sibling order, so they keep the existing order,
    // appending new registrations.
    const pendingOrder = pendingLegendOrderRef.current;
    if (pendingOrder.length > 0) {
      pendingLegendOrderRef.current = [];
      const registry = legendsRef.current;
      if (pendingOrder.length === registry.size && pendingOrder.every((id) => registry.has(id))) {
        const ordered = [...registry.keys()];
        if (pendingOrder.some((id, i) => id !== ordered[i])) {
          legendsRef.current = new Map(pendingOrder.map((id) => [id, registry.get(id)!]));
          setLegendsVersion((v) => v + 1);
        }
      }
    }
    if (dirtyRef.current) {
      dirtyRef.current = false;
      // The compute effect below re-runs when version changes, picking up the
      // new registrations. Skip the bump before the first compute: it runs in
      // this same commit anyway, and bumping would compute (and emit
      // warnings) twice on mount.
      if (computedRef.current) setVersion((v) => v + 1);
    }
  });

  const optionsKey = stableKey(options);
  const lastInputsRef = useRef<string | null>(null);
  const onValueRef = useRef(onValue);
  onValueRef.current = onValue;

  useLayoutEffect(() => {
    computedRef.current = true;
    // Registration ids change when children remount without any real change —
    // e.g. when the tree gains a <figure> once auto-legends resolve — bumping
    // version while every stamp stays the same. Recomputing then would be
    // wasted work and would re-emit computePlot warnings, so skip when the
    // effective inputs are unchanged. (onValue identity is excluded, like
    // functions in mark stamps; the onInput closure reads it from a ref.)
    const inputsKey = [
      ...[...marksRef.current.values()].map((r) => r.stamp),
      ...[...scalesRef.current.values()].map((r) => r.stamp),
      optionsKey,
      String(classNameProp),
      stableKey({style}),
      String(!!onValue)
    ].join("\u0000");
    if (inputsKey === lastInputsRef.current) return;
    lastInputsRef.current = inputsKey;
    const flat: any[] = [];
    // Maps each built mark instance to its registration so <MarkSlot> can read
    // the registration's CURRENT handlers at render and event time (handler
    // identity changes refresh the registration without a recompute, so the
    // instances — and this map — stay valid).
    const registrationByMark = new Map<any, Registration>();
    for (const registration of marksRef.current.values()) {
      const m = registration.factory();
      for (const one of Array.isArray(m) ? m : [m]) {
        flat.push(one);
        if (registration.handlers) registrationByMark.set(one, registration);
      }
    }
    registrationByMarkRef.current = registrationByMark;
    // Merge scale-component registrations (<ScaleY>, <ScaleColor>, …) into
    // the plot-level options. Multiple components for the same scale merge in
    // registration order (later wins per key). Precedence on conflict: an
    // explicit object-form prop on <Plot> itself (e.g. y={{type: "log"}})
    // wins over scale components per conflicting key, and a non-object
    // explicit prop (e.g. projection="albers-usa") replaces them entirely.
    let effectiveOptions: Record<string, any> = options;
    if (scalesRef.current.size > 0) {
      effectiveOptions = {...options};
      const merged = new Map<string, Record<string, any>>();
      for (const {scaleName, config} of scalesRef.current.values()) {
        merged.set(scaleName, {...merged.get(scaleName), ...config});
      }
      for (const [scaleName, config] of merged) {
        const explicit = (options as Record<string, any>)[scaleName];
        effectiveOptions[scaleName] =
          explicit === undefined ? config : isPlainOptionsObject(explicit) ? {...config, ...explicit} : explicit;
      }
    }
    let computed: any;
    try {
      // Always run computePlot, even with zero marks: declared position scales
      // (e.g. x={{type: "log", …}}) infer implicit axis marks, so a markless
      // <Plot> can still render axes — matching the imperative plot().
      computed = computePlot({...effectiveOptions, marks: flat, style});
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

    publishResolved({
      scaleDescriptors: computed.scaleDescriptors,
      context: computed.context,
      plotOptions: effectiveOptions
    });

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
          const cb = onValueRef.current;
          if (cb && t && "value" in t) cb(t.value);
        }
      : null;

    const pointerEnabled = computed.marks.some(isPointerConsumer);
    setMode({kind: "jsx", computed, onSvgRef, onInput, pointerEnabled, warnings});
    // version counts mark registration changes (stamp changes, additions,
    // removals), so prop updates on marks after mount re-run computePlot.
  }, [optionsKey, onValue, classNameProp, style, version]);

  const ctx = {
    registerMark,
    unregisterMark,
    registerScale,
    unregisterScale,
    registerLegend,
    unregisterLegend,
    scaleDescriptors: resolved?.scaleDescriptors,
    context: resolved?.context,
    // Prefer the computed effective options (props + scale registrations) so
    // legend defaults see scale options declared via components.
    plotOptions: resolved?.plotOptions ?? options
  };

  // Auto-legends (color/opacity/symbol scales with legend requested) render
  // via the React legend components and force figure mode, matching the
  // imperative plot()'s createLegends behavior.
  const autoLegends = resolved?.scaleDescriptors
    ? buildAutoLegends(resolved.scaleDescriptors, resolved.context, resolved.plotOptions ?? options)
    : [];

  // Explicit <Legend> descendants register via PlotContext (like marks via
  // useMark) and render visibly here as <LegendDisplay>, matching the
  // imperative plot()'s createLegends/exposeLegends placement above the
  // <svg>. The <Legend> instances themselves render null inside the hidden
  // children div, so any composition (memo, wrapper components, fragments)
  // still surfaces the legend. Any registered legend forces figure mode.
  // Registry order tracks the children's render order via the layout-effect
  // reconciliation above, so keyed reorders update the visible order.
  const explicitLegends: ReactElement[] = [...legendsRef.current.entries()].map(([id, r]) => (
    <LegendDisplay key={id} {...r.props} />
  ));

  // "always"/true forces a figure; "never"/false suppresses it; "auto" (or
  // undefined) infers it from whether there's anything to wrap.
  const autoFigure = Boolean(title || subtitle || caption || autoLegends.length > 0 || explicitLegends.length > 0);
  const wantsFigure =
    figure === "always" || figure === true ? true : figure === "never" || figure === false ? false : autoFigure;

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
        getHandlers={getMarkHandlers}
      />
    ) : (
      <div className="plot-host" />
    );

  // The hidden registration div keeps a stable position in the tree across
  // figure-mode changes: if it moved inside <FigureLayout> when a figure
  // appears, React would remount the children subtree, wiping descendant
  // state — a legend mounted by a stateful wrapper would flip figure mode,
  // remount (and so reset) that wrapper, and immediately unregister itself.
  return (
    <PlotContext.Provider value={ctx}>
      {wantsFigure ? (
        <FigureLayout
          title={title}
          subtitle={subtitle}
          caption={caption}
          autoLegends={autoLegends}
          explicitLegends={explicitLegends}
          plotElement={plotElement}
          isJsx={mode.kind === "jsx"}
        />
      ) : (
        <>
          {explicitLegends}
          {plotElement}
        </>
      )}
      <div style={{display: "none"}}>{children}</div>
    </PlotContext.Provider>
  );
}

// Renders the whole plot as a JSX <svg> tree.
function PlotSvg({computed, svgRef, className: classNameProp, onInput, pointerEnabled, warnings, getHandlers}: any) {
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
      {renderMarks(computed, clipReg, getHandlers)}
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

function renderMarks(
  computed: any,
  clipReg: ClipRegistry,
  getHandlers?: (mark: any) => MarkEventHandlers | undefined
): ReactNode[] {
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
      getHandlers={getHandlers}
      markData={getHandlers?.(mark) ? computed.stateByMark.get(mark)?.data : undefined}
    />
  ));
}

// Renders one mark via its renderJSX into pure React SVG. Pointer-consumer
// marks (Tip, crosshair sub-marks) render with an empty index by default;
// PointerRoot will override this on hover to render only the selected datum.
function MarkSlot({mark, index, scales, values, dims, context, clipReg, getHandlers, markData}: any) {
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
  let jsx = mark.renderJSX(arrayIndex, scales, values, dims, context) as ReactElement;
  // Per-mark event handlers attach as React event props (no DOM-structure
  // change): per element when the mark renders one element per datum,
  // mark-level otherwise. Presence changes rebuild the plot (stamped), so
  // this render-time decision stays in sync with the registration.
  const handlers = getHandlers?.(mark);
  if (handlers) jsx = attachMarkHandlers(jsx, arrayIndex, markData, handlers, () => getHandlers(mark));
  return <>{clipReg ? clipReg.wrap(jsx, mark, dims, context) : jsx}</>;
}

// Attaches the registered handlers to a mark's rendered JSX. Marks that
// render one element per datum (dot, bar, rect, cell, text, tick, …) emit
// their per-datum elements as the direct children of the mark's root <g>, in
// filtered-index order — so when the child count matches the index length,
// each child gets handlers with its datum index closed over. Otherwise
// (grouped marks like line/area render one path per series, and some marks
// nest further) the handlers attach at the mark level with datum/index
// undefined. Handler identity is read through `live` at dispatch time, so
// identity-only updates (which don't rebuild the plot) still take effect.
function attachMarkHandlers(
  jsx: ReactElement,
  index: number[] | null,
  data: any,
  attached: MarkEventHandlers,
  live: () => MarkEventHandlers | undefined
): ReactElement {
  if (!isValidElement(jsx)) return jsx;
  const children = Children.toArray((jsx.props as any).children);
  if (index != null && children.length === index.length && children.every((c) => isValidElement(c))) {
    return cloneElement(
      jsx,
      undefined,
      children.map((child, k) =>
        cloneElement(child as ReactElement, handlerProps(attached, live, data?.[index[k]], index[k]))
      )
    );
  }
  return cloneElement(jsx, handlerProps(attached, live, undefined, undefined));
}

function handlerProps(
  attached: MarkEventHandlers,
  live: () => MarkEventHandlers | undefined,
  datum: unknown,
  i: number | undefined
): Record<string, (event: any) => void> {
  const props: Record<string, (event: any) => void> = {};
  for (const type of markEventNames) {
    if (typeof attached[type] !== "function") continue;
    props[type] = (event: any) => {
      const handler = live()?.[type];
      if (typeof handler === "function") handler(event, datum, i);
    };
  }
  return props;
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

// Only plain objects merge per-key with scale registrations; anything else
// (scale shorthand strings/booleans, projection names/factories, class
// instances) is taken wholesale.
function isPlainOptionsObject(v: unknown): v is Record<string, any> {
  if (v === null || typeof v !== "object") return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

function subarray(index: any): any {
  return index.slice ? index.slice() : Array.from(index);
}

function stableKey(options: Record<string, any>): string {
  try {
    return JSON.stringify(options, (_k, v) => (typeof v === "function" ? "[fn]" : v));
  } catch {
    return String(Math.random());
  }
}
