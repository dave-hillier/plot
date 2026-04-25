import {createContext, useContext} from "react";
import type {MarkFactory} from "./useMark.js";

// New, slim Plot context: just a registry. Marks are registered as opaque
// factories that build imperative Mark instances; <Plot> calls the imperative
// `plot()` to do all rendering. This deliberately replaces the much larger
// legacy context (see PlotContext.legacy.ts), which is being retired.
export interface PlotContextValue {
  registerMark: (id: string, stamp: string, factory: MarkFactory) => void;
}

export const PlotContext = createContext<PlotContextValue | null>(null);

export function usePlotContext(): PlotContextValue {
  const ctx = useContext(PlotContext);
  if (!ctx) throw new Error("Mark used outside <Plot>");
  return ctx;
}
