import React, {type ReactNode} from "react";
import {TransformContext, useTransformContext, type TransformContextValue} from "../TransformContext.js";
import {stampOptions} from "../useMark.js";
import {bin, binX, binY} from "../../transforms/bin.js";
import type {BinReducer, Thresholds} from "../../transforms/bin.js";
import type {RangeInterval} from "../../interval.js";
import type {ChannelValue} from "../../channel.js";

// Output reducers and bin options shared by every wrapper. Output reducers
// (e.g. y="count") are distinct from the input channels on the mark inside
// the wrapper.
interface BinOutputProps {
  fill?: BinReducer;
  stroke?: BinReducer;
  r?: BinReducer;
  opacity?: BinReducer;
  fillOpacity?: BinReducer;
  strokeOpacity?: BinReducer;
  text?: BinReducer;
  title?: BinReducer;
  href?: BinReducer;
  data?: BinReducer;
  filter?: BinReducer | null;
  sort?: BinReducer | null;
  reverse?: boolean;
  // z is an input channel that subdivides bins, not an output reducer; in
  // the functional API it belongs in the mark options, so it is routed there.
  z?: ChannelValue;
  // Bin configuration; bin's own mergeOptions routes these from the first
  // argument into the mark options, so all config props pass as one object.
  thresholds?: Thresholds;
  interval?: RangeInterval;
  domain?: ((values: any[]) => [any, any]) | [any, any];
  cumulative?: boolean | number;
  children?: ReactNode;
}

export interface BinXProps extends BinOutputProps {
  y?: BinReducer;
  y1?: BinReducer;
  y2?: BinReducer;
}

export interface BinYProps extends BinOutputProps {
  x?: BinReducer;
  x1?: BinReducer;
  x2?: BinReducer;
}

export type BinProps = BinOutputProps;

// The wrapper's z and bin configuration belong in the mark options (the
// transform's second argument); mark-level values win on conflict, matching
// bin's own mergeOptions precedence. Undefined entries are dropped so a bare
// wrapper contributes nothing.
function markSideOptions(config: Record<string, any>, o: Record<string, any>): Record<string, any> {
  const defined: Record<string, any> = {};
  for (const k in config) if (config[k] !== undefined) defined[k] = config[k];
  return {...defined, ...o};
}

// Passing undefined outputs (rather than {}) lets the transform apply its
// no-argument default (e.g. binX() implies y="count"), so a bare wrapper
// behaves exactly like the bare functional call.
function orDefault(outputs: Record<string, any>): Record<string, any> | undefined {
  return Object.keys(outputs).length > 0 ? outputs : undefined;
}

// Transform wrapper pattern: see Stack.tsx. Renders no visual output; the wrap
// runs inside each enclosed mark's factory, per computePlot run.
export function BinX({children, z, thresholds, interval, domain, cumulative, ...outputs}: BinXProps) {
  const parent = useTransformContext();
  const config = {z, thresholds, interval, domain, cumulative};
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(binX(orDefault(outputs), markSideOptions(config, o))),
    stamp: parent.stamp + stampOptions("binX", null, markSideOptions(config, outputs))
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function BinY({children, z, thresholds, interval, domain, cumulative, ...outputs}: BinYProps) {
  const parent = useTransformContext();
  const config = {z, thresholds, interval, domain, cumulative};
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(binY(orDefault(outputs), markSideOptions(config, o))),
    stamp: parent.stamp + stampOptions("binY", null, markSideOptions(config, outputs))
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function Bin({children, z, thresholds, interval, domain, cumulative, ...outputs}: BinProps) {
  const parent = useTransformContext();
  const config = {z, thresholds, interval, domain, cumulative};
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(bin(orDefault(outputs), markSideOptions(config, o))),
    stamp: parent.stamp + stampOptions("bin", null, markSideOptions(config, outputs))
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}
