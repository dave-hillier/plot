import React, {type ReactNode} from "react";
import {TransformContext, useTransformContext, type TransformContextValue} from "../TransformContext.js";
import {stampOptions} from "../useMark.js";
import {shiftX, shiftY} from "../../transforms/shift.js";
import type {Interval} from "../../interval.js";

export interface ShiftXProps {
  // How far to shift the input x channel when deriving x1 and x2 — a number,
  // a named time interval such as "quarter", or an interval implementation.
  interval: Interval;
  children?: ReactNode;
}

export interface ShiftYProps {
  interval: Interval;
  children?: ReactNode;
}

// Transform wrapper pattern: see Stack.tsx. Renders no visual output; the wrap
// runs inside each enclosed mark's factory, per computePlot run.
export function ShiftX({children, interval}: ShiftXProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(shiftX(interval, o)),
    stamp: parent.stamp + stampOptions("shiftX", null, {interval})
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function ShiftY({children, interval}: ShiftYProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(shiftY(interval, o)),
    stamp: parent.stamp + stampOptions("shiftY", null, {interval})
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}
