import {useId} from "react";
import {usePlotContext} from "./PlotContext.js";
import type {Mark} from "../mark.js";

export type MarkFactory = () => Mark | Mark[];

export interface UseMarkOptions {
  stamp: string;
  factory: MarkFactory;
}

// Registers an imperative mark factory with the enclosing <Plot>. The factory
// closure is re-evaluated each time <Plot> rebuilds, so it can freely close
// over the latest props without forcing a re-registration.
export function useMark({stamp, factory}: UseMarkOptions): void {
  const id = useId();
  const {registerMark} = usePlotContext();
  registerMark(id, stamp, factory);
}

// Build a stable stamp from the mark name, data identity, and option key/typeof
// shape. Function identities are EXCLUDED so inline accessors don't force a
// rebuild — the factory closure already captures the latest functions.
export function stampOptions(name: string, data: unknown, options: Record<string, unknown>): string {
  const dataKey = data == null ? "null" : typeof data === "object" ? "obj" : String(data);
  const shape = Object.keys(options)
    .sort()
    .map((k) => {
      const v = options[k];
      const t = v == null ? "null" : Array.isArray(v) ? "arr" : typeof v;
      return `${k}:${t}`;
    })
    .join(",");
  return `${name}|${dataKey}|${shape}`;
}
