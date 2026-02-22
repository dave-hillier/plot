import React from "react";
import {area as shapeArea, group} from "d3";
import {useMark} from "../useMark.js";
import {indirectStyleProps, directStyleProps, groupChannelStyleProps, computeTransform, isColorChannel, isColorValue} from "../styles.js";
import {maybeCurveAuto, defined} from "../../core/index.js";
import type {ChannelSpec} from "../PlotContext.js";

const defaults = {
  ariaLabel: "area",
  fill: "currentColor",
  stroke: "none",
  strokeWidth: 1,
  strokeMiterlimit: 1
};

export interface AreaProps {
  data?: any;
  x?: any;
  x1?: any;
  x2?: any;
  y?: any;
  y1?: any;
  y2?: any;
  z?: any;
  fill?: any;
  stroke?: any;
  fillOpacity?: any;
  strokeOpacity?: any;
  strokeWidth?: any;
  opacity?: any;
  curve?: any;
  tension?: number;
  title?: any;
  tip?: any;
  dx?: number;
  dy?: number;
  className?: string;
  [key: string]: any;
}

export function Area({
  data,
  x1,
  x2,
  y1,
  y2,
  z,
  fill,
  stroke,
  fillOpacity,
  strokeOpacity,
  strokeWidth,
  opacity,
  curve: curveProp,
  tension,
  title,
  tip,
  dx = 0,
  dy = 0,
  className,
  ...restOptions
}: AreaProps) {
  const maybeZ = z ?? (typeof fill === "string" && !/^#|^rgb|^hsl|^none|^currentColor/.test(fill) ? fill : undefined);

  const channels: Record<string, ChannelSpec> = {
    x1: {value: x1, scale: "x"},
    x2: {value: x2, scale: "x", optional: true},
    y1: {value: y1, scale: "y"},
    y2: {value: y2, scale: "y", optional: true},
    ...(maybeZ != null ? {z: {value: maybeZ, optional: true}} : {}),
    ...(isColorChannel(fill)
      ? {fill: {value: fill, scale: "auto", optional: true}}
      : {}),
    ...(isColorChannel(stroke)
      ? {stroke: {value: stroke, scale: "auto", optional: true}}
      : {}),
    ...(typeof opacity === "string" || typeof opacity === "function"
      ? {opacity: {value: opacity, scale: "auto", optional: true}}
      : {}),
    ...(title != null ? {title: {value: title, optional: true, filter: null}} : {})
  };

  const curveValue = maybeCurveAuto(curveProp, tension);

  const markOptions = {
    ...defaults,
    ...restOptions,
    fill:
      typeof fill === "string" && isColorValue(fill)
        ? fill
        : defaults.fill,
    stroke: typeof stroke === "string" ? stroke : defaults.stroke,
    strokeWidth: typeof strokeWidth === "number" ? strokeWidth : defaults.strokeWidth,
    dx,
    dy,
    className
  };

  const {values, index, scales, dimensions} = useMark({
    data,
    channels,
    ariaLabel: defaults.ariaLabel,
    tip,
    ...markOptions
  });

  if (!values || !index || !dimensions || !scales) return null;

  const {x1: X1, x2: X2, y1: Y1, y2: Y2, z: Z} = values;

  // Group by z channel
  const groups = (() => {
    if (!index || !X1 || !Y1) return [];
    if (Z) {
      const grouped = group(index, (i: number) => Z[i]);
      return Array.from(grouped.values());
    }
    return [index];
  })();

  const areaGen = shapeArea<number>()
    .curve(curveValue)
    .defined((i: number) => i >= 0 && defined(X1[i]) && defined(Y1[i]))
    .x0((i: number) => X1[i])
    .x1((i: number) => (X2 ? X2[i] : X1[i]))
    .y0((i: number) => Y1[i])
    .y1((i: number) => (Y2 ? Y2[i] : Y1[i]));

  const transform = computeTransform({dx, dy}, scales);
  const groupProps = {
    ...indirectStyleProps(markOptions, dimensions),
    ...(transform ? {transform} : {})
  };

  return (
    <g {...groupProps}>
      {groups.map((g, j) => {
        const d = areaGen(g);
        if (!d) return null;
        const gStyles = groupChannelStyleProps(g, values);
        const dStyles = directStyleProps(markOptions);
        return (
          <path key={j} d={d} {...dStyles} {...gStyles}>
            {values.title && g[0] != null && values.title[g[0]] != null && <title>{`${values.title[g[0]]}`}</title>}
          </path>
        );
      })}
    </g>
  );
}

export function AreaX(props: AreaProps) {
  const {x: x1, x1: x1Prop = x1, x2: x2Prop, y = (d: any, i: number) => i, ...rest} = props;
  return <Area x1={x1Prop} x2={x2Prop} y1={y} y2={y} {...rest} />;
}

export function AreaY(props: AreaProps) {
  const {y: y1, y1: y1Prop = y1, y2: y2Prop, x = (d: any, i: number) => i, ...rest} = props;
  return <Area x1={x} x2={x} y1={y1Prop} y2={y2Prop} {...rest} />;
}
