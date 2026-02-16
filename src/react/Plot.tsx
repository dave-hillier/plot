import React, {
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent
} from "react";
import {
  createChannel,
  inferChannelScale,
  formatDefault,
  createDimensions,
  createFacets,
  recreateFacets,
  facetExclude,
  facetGroups,
  facetFilter,
  isScaleOptions,
  dataify,
  map,
  maybeIntervalTransform,
  range,
  createProjection,
  getGeometryChannels,
  hasProjection,
  createScales,
  createScaleFunctions,
  autoScaleRange,
  innerDimensions,
  scaleRegistry,
  maybeClassName,
  defined
} from "../core/index.js";
import {facetTranslator} from "../facet.js";
import {PlotContext, FacetContext} from "./PlotContext.js";
import type {MarkRegistration, MarkState, FacetInfo, PlotContextValue, PointerState} from "./PlotContext.js";
import {
  AxisX as AxisXMark,
  AxisY as AxisYMark,
  GridX as GridXMark,
  GridY as GridYMark,
  AxisFx as AxisFxMark,
  AxisFy as AxisFyMark,
  GridFx as GridFxMark,
  GridFy as GridFyMark
} from "./marks/Axis.js";
import {Tip} from "./interactions/Tip.js";

export interface PlotProps {
  // Dimensions
  width?: number;
  height?: number;
  margin?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  aspectRatio?: number;

  // Scale options (x, y, color, r, fx, fy, etc.)
  x?: any;
  y?: any;
  color?: any;
  opacity?: any;
  r?: any;
  symbol?: any;
  length?: any;
  fx?: any;
  fy?: any;

  // Global scale options
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

  // Projection
  projection?: any;

  // Faceting
  facet?: any;

  // Appearance
  className?: string;
  style?: any;
  ariaLabel?: string;
  ariaDescription?: string;

  // Axes/grid (top-level defaults)
  axis?: any;
  grid?: any;

  // Clipping
  clip?: boolean | "frame" | null;

  // Figure wrapping
  title?: string;
  subtitle?: string;
  caption?: string;
  figure?: boolean;

  // Children (mark components)
  children?: ReactNode;

  // Callbacks for Observable Framework integration
  onValue?: (value: any) => void;
  onPointerMove?: (event: any, data: any) => void;
}

export function Plot({
  children,
  width: widthProp = 640,
  height: heightProp,
  className: classNameProp,
  style,
  ariaLabel,
  ariaDescription,
  title,
  subtitle,
  caption,
  figure: figureProp,
  onValue,
  ...options
}: PlotProps) {
  // Manage mark registrations. We use a ref + counter to trigger re-renders
  // without copying the map on every registration.
  const marksRef = useRef<Map<string, MarkRegistration>>(new Map());
  const [registrationVersion, setRegistrationVersion] = useState(0);

  const className = useMemo(() => maybeClassName(classNameProp), [classNameProp]);

  const registerMark = useCallback((registration: MarkRegistration) => {
    const prev = marksRef.current.get(registration.id);
    // Only update if the registration actually changed
    if (!prev || prev.data !== registration.data || prev.channels !== registration.channels) {
      marksRef.current.set(registration.id, registration);
      // Defer the state update to batch multiple registrations
      setRegistrationVersion((v) => v + 1);
    }
  }, []);

  const unregisterMark = useCallback((id: string) => {
    if (marksRef.current.delete(id)) {
      setRegistrationVersion((v) => v + 1);
    }
  }, []);

  // Compute scales, dimensions, and mark states from all registrations.
  // This is the React equivalent of the monolithic plot() function.
  const computed = useMemo(() => {
    const marks = Array.from(marksRef.current.values());
    if (marks.length === 0) return null;

    // Build the options object that the core functions expect
    const plotOptions: any = {
      ...options,
      width: widthProp,
      height: heightProp,
      marks: [] // not used directly, but some functions check for it
    };

    // Collect channel-by-scale mappings from all marks.
    // This mirrors the logic in plot.js's addScaleChannels.
    const channelsByScale = new Map<string, any[]>();

    // Handle top-level facet option
    const topFacetState = maybeTopFacet(plotOptions.facet, plotOptions);
    if (topFacetState) addScaleChannels(channelsByScale, [{channels: topFacetState.channels}], plotOptions);

    // Initialize marks: create channels and collect scale info
    const markStates = new Map<string, any>();
    const facetStateByMark = new Map<string, any>();

    for (const reg of marks) {
      const data = dataify(reg.data);
      const facets = data != null ? [range(data)] : undefined;

      // Apply transform if present
      let transformedData = data;
      let transformedFacets = facets;
      if (reg.transform) {
        const result = reg.transform(data, facets, plotOptions);
        transformedData = dataify(result.data);
        transformedFacets = result.facets;
      }

      // Create channels from the mark's channel specs
      const channels: Record<string, any> = {};
      for (const [name, spec] of Object.entries(reg.channels)) {
        if (spec.value == null && spec.optional) continue;
        if (spec.value == null) continue;
        const channel = createChannelFromSpec(transformedData, spec, name);
        if (channel) channels[name] = channel;
      }

      // Apply scale transforms
      applyScaleTransforms(channels, plotOptions);

      // Determine facet state
      const facetState = maybeMarkFacetState(reg, topFacetState, plotOptions, transformedData);
      if (facetState) {
        facetStateByMark.set(reg.id, facetState);
        addScaleChannels(channelsByScale, [{channels: facetState.channels}], plotOptions);
      }

      // Collect scale channels
      for (const name in channels) {
        const channel = channels[name];
        const {scale} = channel;
        if (scale != null) {
          if (scale === "projection") {
            if (!hasProjection(plotOptions)) {
              const gx = plotOptions.x?.domain === undefined;
              const gy = plotOptions.y?.domain === undefined;
              if (gx || gy) {
                const [x, y] = getGeometryChannels(channel);
                if (gx) addScaleChannel(channelsByScale, "x", x);
                if (gy) addScaleChannel(channelsByScale, "y", y);
              }
            }
          } else {
            addScaleChannel(channelsByScale, scale, channel);
          }
        }
      }

      markStates.set(reg.id, {
        data: transformedData,
        facets: transformedFacets,
        channels
      });
    }

    // Ensure explicitly declared scales get created
    for (const key of scaleRegistry.keys()) {
      if (isScaleOptions(plotOptions[key]) && key !== "fx" && key !== "fy") {
        if (!channelsByScale.has(key)) channelsByScale.set(key, []);
      }
    }

    // Create facets
    let facets = createFacets(channelsByScale, plotOptions);
    if (facets !== undefined) {
      const topFacetsIndex = topFacetState ? facetFilter(facets, topFacetState) : undefined;
      for (const [markId, facetState] of facetStateByMark) {
        const reg = marksRef.current.get(markId);
        if (!reg) continue;
        if (reg.facet === null || reg.facet === "super") continue;
        facetState.facetsIndex = reg.fx != null || reg.fy != null ? facetFilter(facets, facetState) : topFacetsIndex;
      }

      // Remove empty facets
      const nonEmpty = new Set<number>();
      for (const {facetsIndex} of facetStateByMark.values()) {
        facetsIndex?.forEach((index: any, i: number) => {
          if (index?.length > 0) nonEmpty.add(i);
        });
      }
      facets.forEach(
        0 < nonEmpty.size && nonEmpty.size < facets.length
          ? (f: any, i: number) => (f.empty = !nonEmpty.has(i))
          : (f: any) => (f.empty = false)
      );

      // Handle exclude facet mode
      for (const [markId, facetState] of facetStateByMark) {
        const reg = marksRef.current.get(markId);
        if (reg?.facet === "exclude") {
          facetState.facetsIndex = facetExclude(facetState.facetsIndex);
        }
      }
    }

    // Create scales
    const scaleDescriptors = createScales(channelsByScale, plotOptions);

    // Simulate marks array for dimension calculation (need marginTop etc.)
    const dimensionMarks = marks.map((reg) => ({
      marginTop: reg.options.marginTop || 0,
      marginRight: reg.options.marginRight || 0,
      marginBottom: reg.options.marginBottom || 0,
      marginLeft: reg.options.marginLeft || 0
    }));
    const dimensions = createDimensions(scaleDescriptors, dimensionMarks, plotOptions);
    autoScaleRange(scaleDescriptors, dimensions);

    const scaleFunctions = createScaleFunctions(scaleDescriptors);
    const {fx, fy} = scaleFunctions;
    const subdimensions = fx || fy ? innerDimensions(scaleDescriptors, dimensions) : dimensions;

    // Create projection
    const projection = createProjection(plotOptions, subdimensions);

    // Initializer phase: run after scales are created, before final value computation.
    // Initializers can derive new channels that depend on scale information (e.g., dodge).
    for (const [markId, state] of markStates) {
      const reg = marksRef.current.get(markId);
      if (!reg?.initializer) continue;
      const markDims = reg.facet === "super" ? dimensions : subdimensions;
      const update = reg.initializer(state.data, state.facets, state.channels, scaleFunctions, markDims, {});
      if (update.data !== undefined) state.data = update.data;
      if (update.facets !== undefined) state.facets = update.facets;
      if (update.channels !== undefined) {
        const {fx: _fx, fy: _fy, ...newChannels} = update.channels;
        for (const ch of Object.values(newChannels) as any[]) {
          if (ch.scale != null) inferChannelScale(Object.keys(newChannels).find((k) => newChannels[k] === ch)!, ch);
        }
        Object.assign(state.channels, newChannels);
      }
    }

    // Compute scaled values for each mark
    const computedMarkStates = new Map<string, MarkState>();
    for (const [markId, state] of markStates) {
      const {data, facets: markFacets, channels} = state;

      // Apply scales to channel values
      const values: Record<string, any> = {};
      for (const [name, channel] of Object.entries(channels)) {
        const {scale: scaleName, value} = channel as any;
        const scale = scaleName != null ? scaleFunctions[scaleName] : null;
        values[name] = scale != null ? map(value, scale) : value;
      }
      values.channels = channels;

      // Apply projection if present
      if (projection) {
        for (const cx in channels) {
          const ch = channels[cx] as any;
          if (ch.scale === "x" && /^x|x$/.test(cx)) {
            const cy = cx.replace(/^x|x$/, "y");
            if (cy in channels && (channels[cy] as any).scale === "y") {
              // Project x,y pairs
              const n = values[cx]?.length || 0;
              for (let i = 0; i < n; ++i) {
                if (values[cx][i] != null && values[cy][i] != null) {
                  const projected = projection([values[cx][i], values[cy][i]]);
                  if (projected) {
                    values[cx][i] = projected[0];
                    values[cy][i] = projected[1];
                  }
                }
              }
            }
          }
        }
      }

      // Build index
      const facetState = facetStateByMark.get(markId);
      let index: number[] = [];
      if (data != null) {
        if (facetState?.facetsIndex) {
          // Faceted: use first facet index as default
          index = facetState.facetsIndex[0] ?? range(data);
        } else if (markFacets) {
          index = markFacets[0] ?? range(data);
        } else {
          index = range(data);
        }
      }

      // Apply channel filters (remove indices where channel values are undefined/NaN).
      // This mirrors Mark.filter() in mark.js.
      for (const name in channels) {
        const {filter: channelFilter = defined} = channels[name];
        if (channelFilter !== null) {
          const value = values[name];
          if (value) index = index.filter((i) => channelFilter(value[i]));
        }
      }

      // Apply sort/filter for faceted indices too
      const allFacets = facetState?.facetsIndex ?? markFacets;
      let filteredFacets = allFacets;
      if (allFacets) {
        filteredFacets = allFacets.map((facetIndex: number[]) => {
          if (!facetIndex) return facetIndex;
          let fi = facetIndex;
          for (const name in channels) {
            const {filter: channelFilter = defined} = channels[name];
            if (channelFilter !== null) {
              const value = values[name];
              if (value) fi = fi.filter((i) => channelFilter(value[i]));
            }
          }
          return fi;
        });
      }

      computedMarkStates.set(markId, {
        data,
        facets: filteredFacets,
        channels,
        values,
        index
      });
    }

    // Facet domains and translation
    let facetDomains: any;
    let facetTranslateFn: any = null;
    if (facets !== undefined) {
      facetDomains = {x: fx?.domain(), y: fy?.domain()};
      facets = recreateFacets(facets, facetDomains);
      facetTranslateFn = facetTranslator(fx, fy, dimensions);
    }

    return {
      scaleFunctions,
      scaleDescriptors,
      dimensions,
      subdimensions,
      projection,
      facets: facets as FacetInfo[] | undefined,
      facetDomains,
      facetTranslateFn,
      markStates: computedMarkStates,
      exposedScales: scaleFunctions.scales
    };
  }, [registrationVersion, widthProp, heightProp, options]);

  // Pointer state for interactive marks
  const svgRef = useRef<SVGSVGElement>(null);
  const [pointer, setPointer] = useState<PointerState>({x: null, y: null, active: false});
  const rafRef = useRef<number>(0);

  const handlePointerMove = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = svg.getBoundingClientRect();
      setPointer({x: event.clientX - rect.left, y: event.clientY - rect.top, active: true});
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPointer({x: null, y: null, active: false});
  }, []);

  // Generate a stable clip path ID for frame clipping
  const clipPathId = useId();

  // Build context value
  const contextValue = useMemo<PlotContextValue>(
    () => ({
      registerMark,
      unregisterMark,
      scales: computed?.exposedScales ?? null,
      scaleFunctions: computed?.scaleFunctions ?? null,
      dimensions: computed?.dimensions ?? null,
      projection: computed?.projection ?? null,
      className,
      clipPathId,
      facets: computed?.facets,
      facetTranslate: computed?.facetTranslateFn ?? null,
      getMarkState: (id: string) => computed?.markStates?.get(id),
      pointer,
      dispatchValue: onValue
    }),
    [registerMark, unregisterMark, computed, className, clipPathId, onValue, pointer]
  );

  const {width, height} = computed?.dimensions ?? {width: widthProp, height: heightProp ?? 400};

  // Determine if figure wrapping is needed
  const useFigure = figureProp ?? (title != null || subtitle != null || caption != null);

  // Check whether children already include explicit axis/tip components.
  // Compare by function reference (not .name) so this survives minification.
  const hasExplicitComponents = useMemo(() => {
    let hasX = false,
      hasY = false,
      hasFx = false,
      hasFy = false,
      hasTip = false;
    const tippedMarks: Array<{data: any; x: any; y: any; tip: any; key: any}> = [];
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      const {type, props, key} = child;
      if (type === AxisXMark || type === GridXMark) hasX = true;
      if (type === AxisYMark || type === GridYMark) hasY = true;
      if (type === AxisFxMark || type === GridFxMark) hasFx = true;
      if (type === AxisFyMark || type === GridFyMark) hasFy = true;
      if (type === Tip) hasTip = true;
      // Collect marks with tip prop for implicit tip inference
      if ((props as any)?.tip) {
        tippedMarks.push({
          data: (props as any).data,
          x: (props as any).x,
          y: (props as any).y,
          tip: (props as any).tip,
          key
        });
      }
    });
    return {hasX, hasY, hasFx, hasFy, hasTip, tippedMarks};
  }, [children]);

  // Render implicit axes when the corresponding scale exists and no explicit axis is provided
  const implicitAxes = useMemo(() => {
    if (!computed?.scaleFunctions) return null;
    const axes: ReactNode[] = [];
    if (!hasExplicitComponents.hasX && computed.scaleFunctions.x) {
      axes.push(<ImplicitAxisX key="__implicit-axis-x" />);
    }
    if (!hasExplicitComponents.hasY && computed.scaleFunctions.y) {
      axes.push(<ImplicitAxisY key="__implicit-axis-y" />);
    }
    if (!hasExplicitComponents.hasFx && computed.scaleFunctions.fx) {
      axes.push(<ImplicitAxisFx key="__implicit-axis-fx" />);
    }
    if (!hasExplicitComponents.hasFy && computed.scaleFunctions.fy) {
      axes.push(<ImplicitAxisFy key="__implicit-axis-fy" />);
    }
    return axes.length > 0 ? axes : null;
  }, [computed?.scaleFunctions, hasExplicitComponents]);

  // Render implicit tips for marks with tip={true} or tip={options}
  const implicitTips = useMemo(() => {
    if (hasExplicitComponents.hasTip || hasExplicitComponents.tippedMarks.length === 0) return null;
    return hasExplicitComponents.tippedMarks.map((mark, i) => {
      const tipOptions =
        mark.tip === true ? {} : typeof mark.tip === "string" ? {pointer: mark.tip} : mark.tip;
      return (
        <Tip
          key={`__implicit-tip-${mark.key ?? i}`}
          data={mark.data}
          x={mark.x}
          y={mark.y}
          pointer={tipOptions.pointer}
          preferredAnchor={tipOptions.preferredAnchor}
          {...tipOptions}
        />
      );
    });
  }, [hasExplicitComponents]);

  // Collect warnings from scale computation
  const warnings = useMemo(() => {
    if (!computed) return [];
    const w: string[] = [];
    // Check for data/facet mismatches
    for (const [, reg] of marksRef.current) {
      if (reg.facet === "auto" && options.facet?.data != null && reg.data != null && reg.data !== options.facet.data) {
        const facetData = dataify(options.facet.data);
        const markData = dataify(reg.data);
        if (facetData && markData && facetData.length > 0 && facetData.length === markData.length) {
          w.push(
            `Warning: the ${reg.ariaLabel ?? "mark"} mark appears to use faceted data, but isn't faceted. ` +
              `The mark data has the same length as the facet data and the mark facet option is "auto", but the ` +
              `mark data and facet data are distinct. If this mark should be faceted, set the mark facet option ` +
              `to true; otherwise, suppress this warning by setting the mark facet option to false.`
          );
        }
      }
    }
    // Log warnings to console (matching original Observable Plot behavior)
    for (const msg of w) console.warn(msg);
    return w;
  }, [computed, options.facet]);

  const svg = (
    <PlotContext.Provider value={contextValue}>
      <svg
        ref={svgRef}
        className={className}
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
        fontSize={10}
        textAnchor="middle"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-label={ariaLabel}
        aria-description={ariaDescription}
        style={typeof style === "string" ? undefined : style}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <style>{`:where(.${className}) {
  --plot-background: white;
  display: block;
  height: auto;
  height: intrinsic;
  max-width: 100%;
}
:where(.${className} text),
:where(.${className} tspan) {
  white-space: pre;
}`}</style>
        {computed?.dimensions && (
          <defs>
            <clipPath id={clipPathId}>
              <rect
                x={computed.dimensions.marginLeft}
                y={computed.dimensions.marginTop}
                width={computed.dimensions.width - computed.dimensions.marginLeft - computed.dimensions.marginRight}
                height={computed.dimensions.height - computed.dimensions.marginTop - computed.dimensions.marginBottom}
              />
            </clipPath>
          </defs>
        )}
        {computed?.facets ? (
          // Faceted rendering: render children once per facet, with
          // facet axes (fx/fy) rendered outside the facet groups
          <>
            {implicitAxes}
            {computed.facets.map((facet, fi) => {
              if (facet.empty) return null;
              // Compute the translation for this facet cell
              const {fx, fy} = computed.scaleFunctions!;
              const tx = fx ? fx(facet.x) : 0;
              const ty = fy ? fy(facet.y) : 0;
              return (
                <FacetContext.Provider key={fi} value={{facetIndex: fi, fx: facet.x, fy: facet.y, fi}}>
                  <g transform={`translate(${tx},${ty})`}>
                    {children}
                  </g>
                </FacetContext.Provider>
              );
            })}
            {implicitTips}
          </>
        ) : (
          // Non-faceted rendering
          <>
            {implicitAxes}
            {children}
            {implicitTips}
          </>
        )}
        {warnings.length > 0 && (
          <text
            x={width}
            y={20}
            dy="-1em"
            textAnchor="end"
            fontFamily="initial"
          >
            {"\u26a0\ufe0f"}
            <title>{`${warnings.length} warning${warnings.length === 1 ? "" : "s"}. Please check the console.`}</title>
          </text>
        )}
      </svg>
    </PlotContext.Provider>
  );

  if (!useFigure) return svg;

  return (
    <figure style={{maxWidth: width, margin: "0 auto"}}>
      {title != null && <h2 style={{fontSize: "16px", fontWeight: "bold", margin: "0 0 4px"}}>{title}</h2>}
      {subtitle != null && (
        <h3 style={{fontSize: "12px", fontWeight: "normal", color: "#666", margin: "0 0 8px"}}>{subtitle}</h3>
      )}
      {svg}
      {caption != null && (
        <figcaption style={{fontSize: "12px", color: "#666", marginTop: "4px"}}>{caption}</figcaption>
      )}
    </figure>
  );
}

// --- Implicit axis components ---

function ImplicitAxisX() {
  const {scaleFunctions, scales, dimensions} = useContext(PlotContext);
  if (!scaleFunctions?.x || !dimensions) return null;
  const xScale = scaleFunctions.x;
  const {width, height, marginBottom, marginLeft, marginRight} = dimensions;
  const y = height - marginBottom;
  const tickValues = xScale.ticks ? xScale.ticks() : xScale.domain();
  const tickFormat = xScale.tickFormat ? xScale.tickFormat() : formatDefault;
  const scaleLabel = (scales?.x as any)?.label;
  return (
    <g
      aria-label="x-axis"
      transform={`translate(0,${y})`}
      fill="none"
      fontSize={10}
      fontVariant="tabular-nums"
      textAnchor="middle"
    >
      <line x1={marginLeft} x2={width - marginRight} stroke="currentColor" />
      {tickValues.map((d: any, i: number) => {
        const x = xScale(d);
        if (x == null || !isFinite(x)) return null;
        return (
          <g key={i} transform={`translate(${x},0)`}>
            <line y2={6} stroke="currentColor" />
            <text y={9} dy="0.71em" fill="currentColor">
              {tickFormat(d)}
            </text>
          </g>
        );
      })}
      {scaleLabel != null && (
        <text
          x={(marginLeft + width - marginRight) / 2}
          y={34}
          fill="currentColor"
          textAnchor="middle"
          fontSize={12}
          fontVariant="normal"
        >{`${scaleLabel} →`}</text>
      )}
    </g>
  );
}

function ImplicitAxisY() {
  const {scaleFunctions, scales, dimensions} = useContext(PlotContext);
  if (!scaleFunctions?.y || !dimensions) return null;
  const yScale = scaleFunctions.y;
  const {height, marginTop, marginBottom, marginLeft} = dimensions;
  const x = marginLeft;
  const tickValues = yScale.ticks ? yScale.ticks() : yScale.domain();
  const tickFormat = yScale.tickFormat ? yScale.tickFormat() : formatDefault;
  const scaleLabel = (scales?.y as any)?.label;
  return (
    <g
      aria-label="y-axis"
      transform={`translate(${x},0)`}
      fill="none"
      fontSize={10}
      fontVariant="tabular-nums"
      textAnchor="end"
    >
      <line y1={marginTop} y2={height - marginBottom} stroke="currentColor" />
      {tickValues.map((d: any, i: number) => {
        const y = yScale(d);
        if (y == null || !isFinite(y)) return null;
        return (
          <g key={i} transform={`translate(0,${y})`}>
            <line x2={-6} stroke="currentColor" />
            <text x={-9} dy="0.32em" fill="currentColor">
              {tickFormat(d)}
            </text>
          </g>
        );
      })}
      {scaleLabel != null && (
        <text
          transform={`translate(${-45},${marginTop}) rotate(-90)`}
          fill="currentColor"
          textAnchor="end"
          fontSize={12}
          fontVariant="normal"
        >{`↑ ${scaleLabel}`}</text>
      )}
    </g>
  );
}

function ImplicitAxisFx() {
  const {scaleFunctions, scales, dimensions} = useContext(PlotContext);
  if (!scaleFunctions?.fx || !dimensions) return null;
  const fxScale = scaleFunctions.fx;
  const {width, marginTop, marginLeft, marginRight} = dimensions;
  const y = marginTop;
  const domain = fxScale.domain ? fxScale.domain() : [];
  const tickFormat = formatDefault;
  const bw = fxScale.bandwidth ? fxScale.bandwidth() / 2 : 0;
  const scaleLabel = (scales?.fx as any)?.label;
  return (
    <g
      aria-label="fx-axis"
      transform={`translate(0,${y})`}
      fill="none"
      fontSize={10}
      fontVariant="tabular-nums"
      textAnchor="middle"
    >
      {domain.map((d: any, i: number) => {
        const x = fxScale(d);
        if (x == null || !isFinite(x)) return null;
        return (
          <g key={i} transform={`translate(${x + bw},0)`}>
            <line y2={-6} stroke="currentColor" />
            <text y={-9} fill="currentColor">
              {tickFormat(d)}
            </text>
          </g>
        );
      })}
      {scaleLabel != null && (
        <text
          x={(marginLeft + width - marginRight) / 2}
          y={-28}
          fill="currentColor"
          textAnchor="middle"
          fontSize={12}
          fontVariant="normal"
        >{`${scaleLabel} \u2192`}</text>
      )}
    </g>
  );
}

function ImplicitAxisFy() {
  const {scaleFunctions, scales, dimensions} = useContext(PlotContext);
  if (!scaleFunctions?.fy || !dimensions) return null;
  const fyScale = scaleFunctions.fy;
  const {width, height, marginTop, marginBottom, marginRight} = dimensions;
  const x = width - marginRight;
  const domain = fyScale.domain ? fyScale.domain() : [];
  const tickFormat = formatDefault;
  const bw = fyScale.bandwidth ? fyScale.bandwidth() / 2 : 0;
  const scaleLabel = (scales?.fy as any)?.label;
  return (
    <g
      aria-label="fy-axis"
      transform={`translate(${x},0)`}
      fill="none"
      fontSize={10}
      fontVariant="tabular-nums"
      textAnchor="start"
    >
      {domain.map((d: any, i: number) => {
        const y = fyScale(d);
        if (y == null || !isFinite(y)) return null;
        return (
          <g key={i} transform={`translate(0,${y + bw})`}>
            <line x2={6} stroke="currentColor" />
            <text x={9} dy="0.32em" fill="currentColor">
              {tickFormat(d)}
            </text>
          </g>
        );
      })}
      {scaleLabel != null && (
        <text
          transform={`translate(${45},${marginTop}) rotate(-90)`}
          fill="currentColor"
          textAnchor="end"
          fontSize={12}
          fontVariant="normal"
        >{`\u2191 ${scaleLabel}`}</text>
      )}
    </g>
  );
}

// --- Helper functions (ported from plot.js) ---

function createChannelFromSpec(data: any, spec: any, name: string) {
  const {value, scale, type, filter, hint, label} = spec;
  if (value == null) return null;

  // Resolve the value: can be a string (field name), function, or array
  let resolved;
  if (typeof value === "string") {
    const field = value;
    resolved = data != null ? Array.from(data, (d: any) => d?.[field]) : [];
  } else if (typeof value === "function") {
    resolved = data != null ? Array.from(data, value) : [];
  } else if (Array.isArray(value)) {
    resolved = value;
  } else {
    resolved = data != null ? Array.from(data, () => value) : [];
  }

  const channel: any = {
    scale: scale ?? "auto",
    type,
    value: resolved,
    label: label ?? (typeof value === "string" ? value : undefined),
    filter,
    hint
  };

  return inferChannelScale(name, channel);
}

function applyScaleTransforms(channels: Record<string, any>, options: any) {
  for (const name in channels) {
    const channel = channels[name];
    const {scale, transform: t = true} = channel;
    if (scale == null || !t) continue;
    const scaleOpts = options[scale];
    if (!scaleOpts) continue;
    const {
      type,
      percent,
      interval,
      transform = percent ? (x: any) => (x == null ? NaN : x * 100) : maybeIntervalTransform(interval, type)
    } = scaleOpts;
    if (transform == null) continue;
    channel.value = map(channel.value, transform);
    channel.transform = false;
  }
}

function maybeTopFacet(facet: any, options: any) {
  if (facet == null) return undefined;
  const {x, y} = facet;
  if (x == null && y == null) return undefined;
  const data = dataify(facet.data);
  if (data == null) throw new Error("missing facet data");
  const channels: Record<string, any> = {};
  if (x != null)
    channels.fx =
      createChannelFromSpec(data, {value: x, scale: "fx"}, "fx") ?? createChannel(data, {value: x, scale: "fx"});
  if (y != null)
    channels.fy =
      createChannelFromSpec(data, {value: y, scale: "fy"}, "fy") ?? createChannel(data, {value: y, scale: "fy"});
  applyScaleTransforms(channels, options);
  const groups = facetGroups(data, channels);
  return {channels, groups, data: facet.data};
}

function maybeMarkFacetState(reg: MarkRegistration, topFacetState: any, options: any, data: any) {
  if (reg.facet === null || reg.facet === "super") return undefined;
  const {fx, fy} = reg;
  if (fx != null || fy != null) {
    const facetData = dataify(data ?? fx ?? fy);
    if (!facetData) return undefined;
    const channels: Record<string, any> = {};
    if (fx != null)
      channels.fx =
        createChannelFromSpec(facetData, {value: fx, scale: "fx"}, "fx") ??
        createChannel(facetData, {value: fx, scale: "fx"});
    if (fy != null)
      channels.fy =
        createChannelFromSpec(facetData, {value: fy, scale: "fy"}, "fy") ??
        createChannel(facetData, {value: fy, scale: "fy"});
    applyScaleTransforms(channels, options);
    return {channels, groups: facetGroups(facetData, channels)};
  }
  if (topFacetState === undefined) return undefined;
  const {channels, groups} = topFacetState;
  if (reg.facet !== "auto" || reg.data === topFacetState.data) return {channels, groups};
  return undefined;
}

function addScaleChannels(channelsByScale: Map<string, any[]>, states: any[], options: any) {
  for (const state of states) {
    const channels = state.channels ?? {};
    for (const name in channels) {
      const channel = channels[name];
      const {scale} = channel;
      if (scale != null) {
        if (scale === "projection") {
          if (!hasProjection(options)) {
            const gx = options.x?.domain === undefined;
            const gy = options.y?.domain === undefined;
            if (gx || gy) {
              const [x, y] = getGeometryChannels(channel);
              if (gx) addScaleChannel(channelsByScale, "x", x);
              if (gy) addScaleChannel(channelsByScale, "y", y);
            }
          }
        } else {
          addScaleChannel(channelsByScale, scale, channel);
        }
      }
    }
  }
}

function addScaleChannel(channelsByScale: Map<string, any[]>, scale: string, channel: any) {
  const channels = channelsByScale.get(scale);
  if (channels) channels.push(channel);
  else channelsByScale.set(scale, [channel]);
}
