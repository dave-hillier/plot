import {createContext, useContext} from "react";
import type {MarkFactory} from "./useMark.js";

export interface Dimensions {
  width: number;
  height: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  facet?: {
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
  };
}

// Slim Plot context: just a registry. Marks are registered as opaque
// factories that build imperative Mark instances; <Plot> calls the imperative
// `plot()` to do all rendering.
export interface PlotContextValue {
  registerMark: (id: string, stamp: string, factory: MarkFactory) => void;
  // Removes a mark's registration; called from useMark's unmount cleanup.
  // Identity is stable across <Plot> renders.
  unregisterMark: (id: string) => void;
  // Explicit <Legend> descendants register their props here (like marks via
  // registerMark) so <Plot> can render them visibly in the figure slot no
  // matter how they're composed (memo, wrapper components, fragments).
  // Absent outside <Plot>, where <Legend> renders standalone.
  registerLegend?: (id: string, stamp: string, props: Record<string, any>) => void;
  // Removes a legend's registration; called from Legend's unmount cleanup.
  // Identity is stable across <Plot> renders.
  unregisterLegend?: (id: string) => void;
  // Resolved scale descriptors and render context from the parent Plot's
  // computePlot() pass. Populated after the first render; descendants like
  // <Legend scale="color"> read named scales out of this map.
  scaleDescriptors?: Record<string, any>;
  context?: any;
  // Options passed to the parent <Plot> (used as defaults when resolving
  // scale-name legends, mirroring `exposeLegends(..., defaults)`).
  plotOptions?: Record<string, any>;
}

export const PlotContext = createContext<PlotContextValue | null>(null);

export function usePlotContext(): PlotContextValue {
  const ctx = useContext(PlotContext);
  if (!ctx) throw new Error("Mark used outside <Plot>");
  return ctx;
}
