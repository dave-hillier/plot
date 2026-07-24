import {useId, useLayoutEffect, useRef} from "react";
import {usePlotContext} from "./PlotContext.js";
import {useTransformContext} from "./TransformContext.js";
import type {Mark} from "../mark.js";

export type MarkFactory = () => Mark | Mark[];

export interface UseMarkOptions {
  // Mark name folded into the stamp (e.g. "dot").
  name: string;
  // Mark data; a new reference forces a rebuild (contents aren't hashed).
  data?: unknown;
  // Mark options as passed to the component, before transform wrapping.
  options: Record<string, any>;
  // Builds the imperative mark(s). Called per computePlot run with the options
  // after any enclosing transform wrappers have been applied.
  create: (data: any, options: Record<string, any>) => Mark | Mark[];
}

// Registers an imperative mark factory with the enclosing <Plot>. The factory
// closure is re-evaluated each time <Plot> rebuilds, so it can freely close
// over the latest props without forcing a re-registration. Any enclosing
// transform wrapper's wrap is applied inside that re-evaluation — never at
// render time — because transforms allocate lazy column() cells that
// computePlot fills per run.
export function useMark({name, data, options, create}: UseMarkOptions): void {
  const id = useId();
  const {registerMark, unregisterMark} = usePlotContext();
  const transform = useTransformContext();
  // The stamp can't cheaply hash array/object data contents, so track data
  // identity with a sequence number: any new reference bumps the stamp.
  const dataRef = useRef({data, seq: 0});
  if (dataRef.current.data !== data) dataRef.current = {data, seq: dataRef.current.seq + 1};
  const stamp = `${transform.stamp}${stampOptions(name, data, options)}|d${dataRef.current.seq}`;
  registerMark(id, stamp, () => create(data, transform.wrap(options)));
  // Registration happens during render (above) so <Plot> sees the mark before
  // its compute effect; removal is unmount-driven — <Plot> can't infer it,
  // because bailed-out children don't re-register.
  useLayoutEffect(() => () => unregisterMark(id), [unregisterMark, id]);
}

// Build a stable stamp from the mark name, data identity, and options. Option
// primitives (string/number/boolean) are included by value so e.g. a
// thresholds or field-name change forces a rebuild; arrays contribute their
// element values (recursively) so e.g. an explicit thresholds or domain array
// change forces a rebuild too. Plain objects contribute shape only, and
// function identities are EXCLUDED so inline accessors don't force a
// rebuild — the factory closure already captures the latest functions.
export function stampOptions(name: string, data: unknown, options: Record<string, unknown>): string {
  const dataKey = data == null ? "null" : typeof data === "object" ? "obj" : String(data);
  const shape = Object.keys(options)
    .sort()
    .map((k) => `${k}:${stampValue(options[k])}`)
    .join(",");
  return `${name}|${dataKey}|${shape}`;
}

function stampValue(v: unknown): string {
  return v == null
    ? "null"
    : Array.isArray(v)
    ? `[${v.map(stampValue).join(",")}]`
    : typeof v === "string" || typeof v === "number" || typeof v === "boolean"
    ? JSON.stringify(v)
    : v instanceof Date
    ? `date${+v}`
    : typeof v;
}
