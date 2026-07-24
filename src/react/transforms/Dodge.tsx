import React, {type ReactNode} from "react";
import {TransformContext, useTransformContext, type TransformContextValue} from "../TransformContext.js";
import {stampOptions} from "../useMark.js";
import {dodgeX, dodgeY} from "../../transforms/dodge.js";
import type {ChannelValueSpec} from "../../channel.js";

export interface DodgeXProps {
  // How to orient piles of dodged circles: left (default), middle, or right.
  anchor?: "right" | "left" | "middle";
  padding?: number;
  r?: ChannelValueSpec;
  children?: ReactNode;
}

export interface DodgeYProps {
  // How to orient piles of dodged circles: bottom (default), middle, or top.
  anchor?: "top" | "bottom" | "middle";
  padding?: number;
  r?: ChannelValueSpec;
  children?: ReactNode;
}

// Transform wrapper pattern: see Stack.tsx. Renders no visual output; the wrap
// runs inside each enclosed mark's factory, per computePlot run. Note dodgeX
// is an initializer, so a transform wrapper must not enclose <DodgeX> — the
// underlying transform would then apply after the initializer and throw.
export function DodgeX({children, ...config}: DodgeXProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(dodgeX(config, o)),
    stamp: parent.stamp + stampOptions("dodgeX", null, config)
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

// Transform wrapper pattern: see Stack.tsx. Renders no visual output; the wrap
// runs inside each enclosed mark's factory, per computePlot run. Note dodgeY
// is an initializer, so a transform wrapper must not enclose <DodgeY> — the
// underlying transform would then apply after the initializer and throw.
export function DodgeY({children, ...config}: DodgeYProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(dodgeY(config, o)),
    stamp: parent.stamp + stampOptions("dodgeY", null, config)
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}
