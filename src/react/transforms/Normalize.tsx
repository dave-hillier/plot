import React, {type ReactNode} from "react";
import {TransformContext, useTransformContext, type TransformContextValue} from "../TransformContext.js";
import {stampOptions} from "../useMark.js";
import {normalizeX, normalizeY} from "../../transforms/normalize.js";
import type {NormalizeBasis} from "../../transforms/normalize.js";

export interface NormalizeXProps {
  // How to normalize series values; defaults to first.
  basis?: NormalizeBasis;
  children?: ReactNode;
}

export interface NormalizeYProps {
  basis?: NormalizeBasis;
  children?: ReactNode;
}

// Transform wrapper pattern: see Stack.tsx. Renders no visual output; the wrap
// runs inside each enclosed mark's factory, per computePlot run.
export function NormalizeX({children, basis}: NormalizeXProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(normalizeX(basis, o)),
    stamp: parent.stamp + stampOptions("normalizeX", null, {basis})
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function NormalizeY({children, basis}: NormalizeYProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(normalizeY(basis, o)),
    stamp: parent.stamp + stampOptions("normalizeY", null, {basis})
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}
