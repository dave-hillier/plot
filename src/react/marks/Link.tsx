import React from "react";
import {useMark} from "../useMark.js";
import {indirectStyleProps, directStyleProps, channelStyleProps, computeTransform, isColorChannel, isColorValue} from "../styles.js";
import type {ChannelSpec} from "../PlotContext.js";

const defaults = {
  ariaLabel: "link",
  fill: "none" as any,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeMiterlimit: 1
};

export interface LinkProps {
  data?: any;
  x1?: any;
  y1?: any;
  x2?: any;
  y2?: any;
  fill?: any;
  stroke?: any;
  strokeWidth?: any;
  strokeOpacity?: any;
  opacity?: any;
  title?: any;
  tip?: any;
  dx?: number;
  dy?: number;
  curve?: any;
  tension?: number;
  className?: string;
  onClick?: (event: React.MouseEvent, datum: any) => void;
  [key: string]: any;
}

export function Link({
  data,
  x,
  y,
  x1: x1Prop,
  y1: y1Prop,
  x2: x2Prop,
  y2: y2Prop,
  stroke,
  strokeWidth,
  strokeOpacity,
  opacity,
  title,
  tip,
  dx = 0,
  dy = 0,
  curve: curveProp,
  tension,
  className,
  onClick,
  channels: extraChannels,
  ...restOptions
}: LinkProps) {
  // Support shorthand: x sets both x1 and x2, y sets both y1 and y2
  const x1 = x1Prop ?? x;
  const y1 = y1Prop ?? y;
  const x2 = x2Prop ?? x;
  const y2 = y2Prop ?? y;

  const channels: Record<string, ChannelSpec> = {
    ...extraChannels,
    x1: {value: x1, scale: "x"},
    y1: {value: y1, scale: "y"},
    x2: {value: x2, scale: "x", optional: true},
    y2: {value: y2, scale: "y", optional: true},
    ...(isColorChannel(stroke)
      ? {stroke: {value: stroke, scale: "auto", optional: true}}
      : {}),
    ...(typeof opacity === "string" || typeof opacity === "function"
      ? {opacity: {value: opacity, scale: "auto", optional: true}}
      : {}),
    ...(title != null ? {title: {value: title, optional: true, filter: null}} : {})
  };

  const markOptions = {
    ...defaults,
    ...restOptions,
    stroke:
      typeof stroke === "string" && isColorValue(stroke)
        ? stroke
        : defaults.stroke,
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

  const {x1: X1, y1: Y1, x2: X2, y2: Y2} = values;

  const transform = computeTransform({dx, dy}, scales);
  const groupProps = {
    ...indirectStyleProps(markOptions, dimensions),
    ...(transform ? {transform} : {})
  };

  return (
    <g {...groupProps}>
      {index.map((i) => (
        <line
          key={i}
          x1={X1[i]}
          y1={Y1[i]}
          x2={X2[i]}
          y2={Y2[i]}
          {...directStyleProps(markOptions)}
          {...channelStyleProps(i, values)}
          onClick={onClick ? (e) => onClick(e, data?.[i]) : undefined}
        >
          {values.title && values.title[i] != null && <title>{`${values.title[i]}`}</title>}
        </line>
      ))}
    </g>
  );
}
