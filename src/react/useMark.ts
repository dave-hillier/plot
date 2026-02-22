import {useId, useEffect} from "react";
import {usePlotContext, useFacetContext} from "./PlotContext.js";
import type {ChannelSpec, MarkState} from "./PlotContext.js";

export interface UseMarkOptions {
  data?: any;
  channels: Record<string, ChannelSpec>;
  transform?: any;
  initializer?: any;
  facet?: string | null | boolean;
  fx?: any;
  fy?: any;
  sort?: any;
  tip?: any;
  render?: any;
  ariaLabel?: string;
  // Style options (passed through to the mark)
  [key: string]: any;
}

export interface UseMarkResult {
  // Null during registration phase; populated during render phase
  state: MarkState | null;
  // Convenience accessors
  values: Record<string, any> | null;
  index: number[] | null;
  scales: Record<string, any> | null;
  dimensions: import("./PlotContext.js").Dimensions | null;
  // The facet context, if within a faceted render
  facetInfo: import("./PlotContext.js").FacetContextValue | null;
}

// Compute a stable channel signature that doesn't depend on object identity.
// This prevents re-registration when wrapper components (e.g., DotX, LineX)
// recreate identical channel objects with new function references on every render.
function channelStamp(channels: Record<string, ChannelSpec>): string {
  return Object.entries(channels)
    .map(([name, spec]) => {
      const v = spec.value;
      const valueType =
        v == null ? "null" : typeof v === "string" ? `s:${v}` : typeof v;
      return `${name}:${valueType}:${spec.scale ?? ""}`;
    })
    .sort()
    .join("|");
}

// The core hook used by all mark components.
// Handles registration with Plot and provides computed scaled values.
export function useMark(options: UseMarkOptions): UseMarkResult {
  const id = useId();
  const {registerMark, unregisterMark, scaleFunctions, dimensions, getMarkState} = usePlotContext();
  const facetInfo = useFacetContext();

  const {data, channels, transform, initializer, facet, fx, fy, sort, ariaLabel} = options;

  // Use a stable stamp instead of the channels object reference as a dep.
  // This avoids infinite re-registration loops when wrapper components like
  // DotX create new (but equivalent) inline default functions each render.
  const stamp = channelStamp(channels);

  // Register this mark with the Plot component.
  // registerMark only writes to a ref (no setState), so it's safe to call
  // during render. Plot flushes pending updates via useLayoutEffect after
  // all children have rendered.
  registerMark({
    id,
    data,
    channels,
    channelStamp: stamp,
    options,
    transform,
    initializer,
    facet: facet === true ? "include" : facet === false ? null : (facet as string) ?? "auto",
    fx,
    fy,
    sort,
    ariaLabel
  });

  // Unregister on unmount.
  useEffect(() => {
    return () => unregisterMark(id);
  }, [id, unregisterMark]);

  // If scales haven't been computed yet, we're in the registration phase.
  if (!scaleFunctions || !dimensions) {
    return {state: null, values: null, index: null, scales: null, dimensions: null, facetInfo};
  }

  // Get the computed state for this mark.
  const state = getMarkState(id);
  if (!state) {
    return {state: null, values: null, index: null, scales: scaleFunctions, dimensions, facetInfo};
  }

  // Determine the appropriate index based on facet context.
  let index = state.index;
  if (facetInfo && state.facets) {
    index = state.facets[facetInfo.facetIndex] ?? [];
  }

  // Return scaleFunctions (actual d3 scales) as `scales` so marks can
  // call methods like .bandwidth(), .domain(), etc.
  return {
    state,
    values: state.values,
    index,
    scales: scaleFunctions,
    dimensions,
    facetInfo
  };
}
