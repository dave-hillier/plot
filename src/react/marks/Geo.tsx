import React from "react";
import {geoPath, geoGraticule10} from "d3";
import {useMark} from "../useMark.js";
import {usePlotContext} from "../PlotContext.js";
import {xyProjection} from "../../core/index.js";
import {indirectStyleProps, directStyleProps, channelStyleProps, computeTransform, isColorChannel, isColorValue} from "../styles.js";
import type {ChannelSpec} from "../PlotContext.js";

const defaults = {
  ariaLabel: "geo",
  fill: "none" as any,
  stroke: "currentColor",
  strokeWidth: 1
};

export interface GeoProps {
  data?: any;
  geometry?: any;
  r?: any;
  fill?: any;
  stroke?: any;
  strokeWidth?: any;
  strokeOpacity?: any;
  opacity?: any;
  title?: any;
  tip?: any;
  dx?: number;
  dy?: number;
  className?: string;
  [key: string]: any;
}

export function Geo({
  data,
  geometry,
  r,
  fill,
  stroke,
  strokeWidth,
  strokeOpacity,
  opacity,
  title,
  tip,
  dx = 0,
  dy = 0,
  className,
  channels: extraChannels,
  ...restOptions
}: GeoProps) {
  const {projection} = usePlotContext();

  const channels: Record<string, ChannelSpec> = {
    ...extraChannels,
    geometry: {value: geometry ?? ((d: any) => d), scale: "projection", optional: true},
    ...(r != null && (typeof r === "string" || typeof r === "function" || Array.isArray(r))
      ? {r: {value: r, scale: "r", optional: true}}
      : {}),
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

  const markOptions = {
    ...defaults,
    ...restOptions,
    fill:
      typeof fill === "string" && isColorValue(fill)
        ? fill
        : defaults.fill,
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

  if (!values || !index || !dimensions) return null;

  const {geometry: G, r: R} = values;
  const path = geoPath(projection ?? xyProjection(scales ?? {}));

  const transform = computeTransform({dx, dy}, scales ?? {});
  const groupProps = {
    ...indirectStyleProps(markOptions, dimensions),
    ...(transform ? {transform} : {})
  };

  return (
    <g {...groupProps}>
      {index.map((i) => {
        const geo = G?.[i];
        if (!geo) return null;
        if (R) path.pointRadius(R[i]);
        const d = path(geo);
        if (!d) return null;
        return (
          <path key={i} d={d} {...directStyleProps(markOptions)} {...channelStyleProps(i, values)}>
            {values.title && values.title[i] != null && <title>{`${values.title[i]}`}</title>}
          </path>
        );
      })}
    </g>
  );
}

// Sphere helper — renders a full globe outline
export function Sphere({
  stroke = "currentColor",
  strokeWidth = 1,
  fill = "none",
  className,
  ...restOptions
}: Partial<GeoProps>) {
  return (
    <Geo
      data={[{type: "Sphere"}]}
      geometry={(d: any) => d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      className={className}
      {...restOptions}
    />
  );
}

// Graticule helper — renders longitude/latitude grid lines
export function Graticule({
  stroke = "#ccc",
  strokeWidth = 0.5,
  strokeOpacity = 0.5,
  fill = "none",
  className,
  ...restOptions
}: Partial<GeoProps>) {
  const graticuleData = [{type: "MultiLineString", coordinates: geoGraticule10().coordinates}];

  return (
    <Geo
      data={graticuleData}
      geometry={(d: any) => d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      fill={fill}
      className={className}
      {...restOptions}
    />
  );
}
