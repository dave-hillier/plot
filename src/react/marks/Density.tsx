import React from "react";
import {contourDensity, geoPath} from "d3";
import {useMark} from "../useMark.js";
import {indirectStyleProps, directStyleProps, isColorChannel, isColorValue} from "../styles.js";
import type {ChannelSpec} from "../PlotContext.js";

const defaults = {
  ariaLabel: "density",
  fill: "none" as any,
  stroke: "currentColor",
  strokeWidth: 1,
  strokeMiterlimit: 1
};

export interface DensityProps {
  data?: any;
  x?: any;
  y?: any;
  weight?: any;
  fill?: any;
  stroke?: any;
  strokeWidth?: any;
  strokeOpacity?: any;
  fillOpacity?: any;
  opacity?: any;
  bandwidth?: number;
  thresholds?: number | number[];
  tip?: any;
  dx?: number;
  dy?: number;
  className?: string;
  [key: string]: any;
}

export function Density({
  data,
  x,
  y,
  weight,
  fill,
  stroke,
  strokeWidth,
  strokeOpacity,
  fillOpacity,
  opacity,
  bandwidth = 20,
  thresholds = 20,
  tip,
  dx = 0,
  dy = 0,
  className,
  channels: extraChannels,
  ...restOptions
}: DensityProps) {
  const channels: Record<string, ChannelSpec> = {
    ...extraChannels,
    x: {value: x, scale: "x"},
    y: {value: y, scale: "y"},
    ...(weight != null ? {weight: {value: weight, optional: true}} : {}),
    ...(isColorChannel(fill) &&
    fill !== "density"
      ? {fill: {value: fill, scale: "auto", optional: true}}
      : {}),
    ...(isColorChannel(stroke) &&
    stroke !== "density"
      ? {stroke: {value: stroke, scale: "auto", optional: true}}
      : {}),
    ...(typeof opacity === "string" || typeof opacity === "function"
      ? {opacity: {value: opacity, scale: "auto", optional: true}}
      : {})
  };

  const useDensityFill = fill === "density";
  const useDensityStroke = stroke === "density";

  const markOptions = {
    ...defaults,
    ...restOptions,
    fill: useDensityFill
      ? "currentColor"
      : typeof fill === "string" && isColorValue(fill)
      ? fill
      : defaults.fill,
    stroke: useDensityStroke
      ? "none"
      : typeof stroke === "string" && isColorValue(stroke)
      ? stroke
      : defaults.stroke,
    strokeWidth: typeof strokeWidth === "number" ? strokeWidth : defaults.strokeWidth,
    dx,
    dy,
    className
  };

  const {values, index, dimensions} = useMark({data, channels, ariaLabel: defaults.ariaLabel, tip, ...markOptions});

  const X = values?.x;
  const Y = values?.y;
  const W = values?.weight;
  const width = dimensions?.width ?? 0;
  const height = dimensions?.height ?? 0;

  // Compute density contours
  let contours: any[] = [];
  if (X && Y && index?.length) {
    const density = contourDensity<number>()
      .x((i) => X[i])
      .y((i) => Y[i])
      .size([width, height])
      .bandwidth(bandwidth);

    if (W) density.weight((i) => W[i]);
    if (typeof thresholds === "number") density.thresholds(thresholds);
    else if (Array.isArray(thresholds)) density.thresholds(thresholds);

    contours = density(index);
  }

  if (!values || !index || !dimensions) return null;

  const path = geoPath();
  const groupProps = indirectStyleProps(markOptions, dimensions);

  return (
    <g {...groupProps}>
      {contours.map((contour: any, j: number) => {
        const d = path(contour);
        if (!d) return null;
        const densityValue = contour.value;
        const maxDensity = contours.length > 0 ? contours[contours.length - 1].value : 1;
        return (
          <path
            key={j}
            d={d}
            {...directStyleProps(markOptions)}
            {...(useDensityFill ? {fillOpacity: fillOpacity ?? densityValue / maxDensity} : {})}
            {...(useDensityStroke ? {stroke: markOptions.stroke, strokeOpacity: densityValue / maxDensity} : {})}
          />
        );
      })}
    </g>
  );
}
