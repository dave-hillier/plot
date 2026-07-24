import React, {type ReactNode} from "react";
import {TransformContext, useTransformContext, type TransformContextValue} from "../TransformContext.js";
import {stampOptions} from "../useMark.js";
import {stackX, stackX1, stackX2, stackY, stackY1, stackY2} from "../../transforms/stack.js";
import type {StackOffset, StackOrder} from "../../transforms/stack.js";

export interface StackYProps {
  offset?: StackOffset | null;
  order?: StackOrder | null;
  reverse?: boolean;
  children?: ReactNode;
}

// All stack variants share the same configuration options.
export type StackXProps = StackYProps;
export type StackX1Props = StackYProps;
export type StackX2Props = StackYProps;
export type StackY1Props = StackYProps;
export type StackY2Props = StackYProps;

// Transform wrapper pattern: render only a TransformContext.Provider around
// children, composing with the parent context — parent.wrap outermost — so
// nesting order maps onto functional call order (<BinX><StackY><Mark/>… is
// binX(outputs, stackY(cfg, o))). The wrap is invoked by useMark inside the
// mark factory (per computePlot run), never here at render time. The stamp is
// value-inclusive so a config change rebuilds the enclosed marks.
export function StackY({children, ...config}: StackYProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(stackY(config, o)),
    stamp: parent.stamp + stampOptions("stackY", null, config)
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

// Transform wrapper pattern: see StackY above.
export function StackY1({children, ...config}: StackY1Props) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(stackY1(config, o)),
    stamp: parent.stamp + stampOptions("stackY1", null, config)
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

// Transform wrapper pattern: see StackY above.
export function StackY2({children, ...config}: StackY2Props) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(stackY2(config, o)),
    stamp: parent.stamp + stampOptions("stackY2", null, config)
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

// Transform wrapper pattern: see StackY above.
export function StackX({children, ...config}: StackXProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(stackX(config, o)),
    stamp: parent.stamp + stampOptions("stackX", null, config)
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

// Transform wrapper pattern: see StackY above.
export function StackX1({children, ...config}: StackX1Props) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(stackX1(config, o)),
    stamp: parent.stamp + stampOptions("stackX1", null, config)
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

// Transform wrapper pattern: see StackY above.
export function StackX2({children, ...config}: StackX2Props) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(stackX2(config, o)),
    stamp: parent.stamp + stampOptions("stackX2", null, config)
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}
