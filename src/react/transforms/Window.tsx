import React, {type ReactNode} from "react";
import {TransformContext, useTransformContext, type TransformContextValue} from "../TransformContext.js";
import {stampOptions} from "../useMark.js";
import {windowX, windowY} from "../../transforms/window.js";
import type {WindowReducer} from "../../transforms/window.js";

export interface WindowXProps {
  // The window size (number of consecutive values), including the current one.
  k: number;
  reduce?: WindowReducer;
  anchor?: "start" | "middle" | "end";
  strict?: boolean;
  children?: ReactNode;
}

export interface WindowYProps {
  k: number;
  reduce?: WindowReducer;
  anchor?: "start" | "middle" | "end";
  strict?: boolean;
  children?: ReactNode;
}

// Transform wrapper pattern: see Stack.tsx. Renders no visual output; the wrap
// runs inside each enclosed mark's factory, per computePlot run.
export function WindowX({children, ...config}: WindowXProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(windowX(config, o)),
    stamp: parent.stamp + stampOptions("windowX", null, config)
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function WindowY({children, ...config}: WindowYProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(windowY(config, o)),
    stamp: parent.stamp + stampOptions("windowY", null, config)
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}
