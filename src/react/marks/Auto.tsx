import React from "react";
import {autoSpec} from "../../marks/auto.js";
import {Dot} from "./Dot.js";
import {Line, LineX, LineY} from "./Line.js";
import {Area, AreaX, AreaY} from "./Area.js";
import {BarX, BarY} from "./Bar.js";
import {Rect, RectX, RectY, Cell} from "./Rect.js";
import {RuleX, RuleY} from "./Rule.js";
import {Frame} from "./Frame.js";

export interface AutoProps {
  data: any;
  x?: any;
  y?: any;
  color?: any;
  size?: any;
  fx?: any;
  fy?: any;
  mark?: "dot" | "line" | "area" | "rule" | "bar";
  tip?: any;
  [key: string]: any;
}

// Map from autoSpec markImpl names to React components
const markImpls: Record<string, React.ComponentType<any>> = {
  dot: Dot,
  line: Line,
  lineX: LineX,
  lineY: LineY,
  areaX: AreaX,
  areaY: AreaY,
  ruleX: RuleX,
  ruleY: RuleY,
  barX: BarX,
  barY: BarY,
  rect: Rect,
  rectX: RectX,
  rectY: RectY,
  cell: Cell
};

/**
 * Auto mark component: automatically selects the appropriate mark type
 * based on the provided data and channel types.
 *
 * This is the React component wrapper for Observable Plot's `auto()` function.
 *
 * Usage:
 *   <Auto data={data} x="weight" y="height" />
 *   <Auto data={data} x="date" y="value" mark="area" />
 *   <Auto data={data} x="category" color="group" />
 */
export function Auto({data, x, y, color, size, fx, fy, mark, tip, ...rest}: AutoProps) {
  // Build the options object that autoSpec expects
  const options: any = {x, y, fx, fy, mark};
  if (color != null) options.color = color;
  if (size != null) options.size = size;

  // autoSpec returns internal properties (markImpl, markOptions, etc.) that
  // are not included in the AutoSpec type declaration, so we cast to any.
  const spec: any = autoSpec(data, options);
  const {
    x: {zero: xZero},
    y: {zero: yZero},
    markOptions,
    colorMode
  } = spec;

  const MarkComponent = markImpls[spec.markImpl];
  if (!MarkComponent) return null;

  // Build the mark props
  const markProps: any = {
    data,
    ...rest,
    ...(tip != null ? {tip} : {}),
    x: markOptions.x ?? undefined,
    y: markOptions.y ?? undefined,
    fx: markOptions.fx ?? undefined,
    fy: markOptions.fy ?? undefined,
    r: markOptions.r ?? undefined,
    z: markOptions.z
  };

  // Apply color mode (fill or stroke)
  if (markOptions[colorMode] != null) {
    markProps[colorMode] = markOptions[colorMode];
  }

  // Determine rendering order: stroked marks get rules before, filled marks after
  const frames = fx != null || fy != null ? <Frame stroke="currentColor" /> : null;
  const xRule = xZero ? <RuleX data={[0]} /> : null;
  const yRule = yZero ? <RuleY data={[0]} /> : null;

  if (colorMode === "stroke") {
    return (
      <>
        {frames}
        {xRule}
        {yRule}
        <MarkComponent {...markProps} />
      </>
    );
  } else {
    return (
      <>
        {frames}
        <MarkComponent {...markProps} />
        {xRule}
        {yRule}
      </>
    );
  }
}
