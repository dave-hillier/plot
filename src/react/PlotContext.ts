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
