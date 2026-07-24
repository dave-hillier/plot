import React, {type ReactNode} from "react";
import {TransformContext, useTransformContext, type TransformContextValue} from "../TransformContext.js";
import {stampOptions} from "../useMark.js";
import {mapX, mapY} from "../../transforms/map.js";
import type {Map as MapMethod} from "../../transforms/map.js";

export interface MapXProps {
  // The map method applied to the x, x1, and x2 channels of the mark inside
  // the wrapper — a named implementation such as "cumsum", a function of
  // values, or a mapIndex object.
  map: MapMethod;
  children?: ReactNode;
}

export interface MapYProps {
  map: MapMethod;
  children?: ReactNode;
}

// Transform wrapper pattern: see Stack.tsx. Renders no visual output; the wrap
// runs inside each enclosed mark's factory, per computePlot run.
export function MapX({children, map}: MapXProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(mapX(map, o)),
    stamp: parent.stamp + stampOptions("mapX", null, {map})
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function MapY({children, map}: MapYProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(mapY(map, o)),
    stamp: parent.stamp + stampOptions("mapY", null, {map})
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}
