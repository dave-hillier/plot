import React, {type ReactNode} from "react";
import {TransformContext, useTransformContext, type TransformContextValue} from "../TransformContext.js";
import {stampOptions} from "../useMark.js";
import {selectFirst, selectLast, selectMinX, selectMinY, selectMaxX, selectMaxY} from "../../transforms/select.js";

export interface SelectFirstProps {
  children?: ReactNode;
}

export interface SelectLastProps {
  children?: ReactNode;
}

export interface SelectMinXProps {
  children?: ReactNode;
}

export interface SelectMinYProps {
  children?: ReactNode;
}

export interface SelectMaxXProps {
  children?: ReactNode;
}

export interface SelectMaxYProps {
  children?: ReactNode;
}

// Transform wrapper pattern: see Stack.tsx. The select transforms take no
// configuration of their own — grouping (z) and channels come from the mark
// options — so these wrappers carry only children.
export function SelectFirst({children}: SelectFirstProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(selectFirst(o)),
    stamp: parent.stamp + stampOptions("selectFirst", null, {})
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function SelectLast({children}: SelectLastProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(selectLast(o)),
    stamp: parent.stamp + stampOptions("selectLast", null, {})
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function SelectMinX({children}: SelectMinXProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(selectMinX(o)),
    stamp: parent.stamp + stampOptions("selectMinX", null, {})
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function SelectMinY({children}: SelectMinYProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(selectMinY(o)),
    stamp: parent.stamp + stampOptions("selectMinY", null, {})
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function SelectMaxX({children}: SelectMaxXProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(selectMaxX(o)),
    stamp: parent.stamp + stampOptions("selectMaxX", null, {})
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function SelectMaxY({children}: SelectMaxYProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(selectMaxY(o)),
    stamp: parent.stamp + stampOptions("selectMaxY", null, {})
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}
