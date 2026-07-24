import React, {type ReactNode} from "react";
import {TransformContext, useTransformContext, type TransformContextValue} from "../TransformContext.js";
import {stampOptions} from "../useMark.js";
import {hexbin} from "../../transforms/hexbin.js";
import type {GroupReducer} from "../../transforms/group.js";

export interface HexbinProps {
  // Output reducers (e.g. fill="count") — distinct from the input channels on
  // the mark inside the wrapper. When none are given, hexbin defaults to
  // fill="count".
  fill?: GroupReducer;
  stroke?: GroupReducer;
  r?: GroupReducer;
  opacity?: GroupReducer;
  fillOpacity?: GroupReducer;
  strokeOpacity?: GroupReducer;
  text?: GroupReducer;
  title?: GroupReducer;
  href?: GroupReducer;
  // The distance between centers of neighboring hexagons, in pixels; hexbin
  // routes this from the mark options, so it merges into the wrapped options.
  binWidth?: number;
  children?: ReactNode;
}

// Transform wrapper pattern: see Stack.tsx. Renders no visual output; the wrap
// runs inside each enclosed mark's factory, per computePlot run. Note hexbin
// is an initializer, so a transform wrapper must not enclose <Hexbin> — the
// underlying transform would then apply after the initializer and throw.
export function Hexbin({children, binWidth, ...config}: HexbinProps) {
  const parent = useTransformContext();
  const outputs = Object.keys(config).length > 0 ? config : undefined;
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(hexbin(outputs, binWidth === undefined ? o : {...o, binWidth})),
    stamp: parent.stamp + stampOptions("hexbin", null, {binWidth, ...config})
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}
