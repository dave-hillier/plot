import React, {useId} from "react";
import {useMark} from "../useMark.js";
import type {ChannelSpec} from "../PlotContext.js";

export interface DifferenceProps {
  data?: any;
  x?: any;
  x1?: any;
  x2?: any;
  y?: any;
  y1?: any;
  y2?: any;
  positiveFill?: string;
  negativeFill?: string;
  positiveFillOpacity?: number;
  negativeFillOpacity?: number;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeDasharray?: string;
  curve?: string;
  className?: string;
  [key: string]: any;
}

// Build an SVG area path: follows `top` values left-to-right,
// then `bottom` values right-to-left, closing the shape.
function areaPath(X: any[], top: any[], bottom: any[]): string {
  const n = X.length;
  if (n === 0) return "";
  const parts: string[] = [`M${X[0]},${top[0]}`];
  for (let i = 1; i < n; ++i) parts.push(`L${X[i]},${top[i]}`);
  for (let i = n - 1; i >= 0; --i) parts.push(`L${X[i]},${bottom[i]}`);
  parts.push("Z");
  return parts.join("");
}

// DifferenceY renders the difference between two y-series as filled areas
// with proper clip-path masking. Positive differences (y1 > y2 in data,
// y1 above y2 on screen) use positiveFill; negative uses negativeFill.
export function DifferenceY({
  data,
  x,
  y1,
  y2,
  y,
  positiveFill = "#3ca951",
  negativeFill = "#4269d0",
  fillOpacity = 1,
  positiveFillOpacity = fillOpacity,
  negativeFillOpacity = fillOpacity,
  stroke = "currentColor",
  strokeWidth = 1,
  strokeOpacity,
  className,
  ...rest
}: DifferenceProps) {
  const positiveClipId = useId();
  const negativeClipId = useId();

  // If y is provided but y1/y2 aren't, use y as y2 and default y1 to 0
  const effectiveY1 = y1 ?? (y !== undefined && y2 === undefined ? y : y1);
  const effectiveY2 = y2 ?? y;

  const channels: Record<string, ChannelSpec> = {
    x: {value: x, scale: "x"},
    y1: {value: effectiveY1 ?? 0, scale: "y"},
    y2: {value: effectiveY2, scale: "y"}
  };

  const markOptions = {ariaLabel: "difference", fill: "none", stroke: "none", className, ...rest};

  const {values, index, dimensions} = useMark({data, channels, ...markOptions});

  if (!values || !index || !dimensions || index.length === 0) return null;

  const {x: X, y1: Y1, y2: Y2} = values;
  if (!X || !Y1 || !Y2) return null;

  const {height} = dimensions;
  const n = index.length;

  // Sort by x position for proper path ordering
  const sorted = index.slice().sort((a, b) => (X[a] ?? 0) - (X[b] ?? 0));

  const sx = sorted.map((i) => X[i]);
  const sy1 = sorted.map((i) => Y1[i]);
  const sy2 = sorted.map((i) => Y2[i]);

  // Main area: the fill between y1 and y2
  const mainPath = areaPath(sx, sy1, sy2);

  // Positive clip: area from y=0 (top) down to y1 line.
  // Intersection with the main area shows where y1 < y2 on screen (y1 > y2 in data).
  const posClipPath = areaPath(sx, Array(n).fill(0), sy1);

  // Negative clip: area from y1 line down to y=height (bottom).
  // Intersection with the main area shows where y2 < y1 on screen (y2 > y1 in data).
  const negClipPath = areaPath(sx, sy1, Array(n).fill(height));

  // Line paths
  const line1Path = sorted.map((i, j) => `${j === 0 ? "M" : "L"}${X[i]},${Y1[i]}`).join("");
  const line2Path = sorted.map((i, j) => `${j === 0 ? "M" : "L"}${X[i]},${Y2[i]}`).join("");

  return (
    <g aria-label="difference" className={className}>
      <defs>
        <clipPath id={positiveClipId}>
          <path d={posClipPath} />
        </clipPath>
        <clipPath id={negativeClipId}>
          <path d={negClipPath} />
        </clipPath>
      </defs>
      <path
        d={mainPath}
        fill={positiveFill}
        fillOpacity={positiveFillOpacity}
        clipPath={`url(#${positiveClipId})`}
        aria-label="positive difference"
      />
      <path
        d={mainPath}
        fill={negativeFill}
        fillOpacity={negativeFillOpacity}
        clipPath={`url(#${negativeClipId})`}
        aria-label="negative difference"
      />
      <path d={line2Path} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeOpacity={strokeOpacity} strokeDasharray="2,2" />
      <path d={line1Path} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeOpacity={strokeOpacity} />
    </g>
  );
}

// DifferenceX renders the difference between two x-series as filled areas.
export function DifferenceX({
  data,
  x1,
  x2,
  x,
  y,
  positiveFill = "#3ca951",
  negativeFill = "#4269d0",
  fillOpacity = 1,
  positiveFillOpacity = fillOpacity,
  negativeFillOpacity = fillOpacity,
  stroke = "currentColor",
  strokeWidth = 1,
  strokeOpacity,
  className,
  ...rest
}: DifferenceProps) {
  const positiveClipId = useId();
  const negativeClipId = useId();

  const effectiveX1 = x1 ?? (x !== undefined && x2 === undefined ? x : x1);
  const effectiveX2 = x2 ?? x;

  const channels: Record<string, ChannelSpec> = {
    y: {value: y, scale: "y"},
    x1: {value: effectiveX1 ?? 0, scale: "x"},
    x2: {value: effectiveX2, scale: "x"}
  };

  const markOptions = {ariaLabel: "difference", fill: "none", stroke: "none", className, ...rest};

  const {values, index, dimensions} = useMark({data, channels, ...markOptions});

  if (!values || !index || !dimensions || index.length === 0) return null;

  const {y: Y, x1: X1, x2: X2} = values;
  if (!Y || !X1 || !X2) return null;

  const {width} = dimensions;
  const n = index.length;

  const sorted = index.slice().sort((a, b) => (Y[a] ?? 0) - (Y[b] ?? 0));

  const sy = sorted.map((i) => Y[i]);
  const sx1 = sorted.map((i) => X1[i]);
  const sx2 = sorted.map((i) => X2[i]);

  // For horizontal difference, the "area" paths use y as the sweep axis
  // and x1/x2 as the bounds.
  const mainPath = (() => {
    if (n === 0) return "";
    const parts: string[] = [`M${sx1[0]},${sy[0]}`];
    for (let i = 1; i < n; ++i) parts.push(`L${sx1[i]},${sy[i]}`);
    for (let i = n - 1; i >= 0; --i) parts.push(`L${sx2[i]},${sy[i]}`);
    parts.push("Z");
    return parts.join("");
  })();

  // Positive clip: from x=0 (left) to x1 line
  const posClipPath = (() => {
    if (n === 0) return "";
    const parts: string[] = [`M${0},${sy[0]}`];
    for (let i = 1; i < n; ++i) parts.push(`L${0},${sy[i]}`);
    for (let i = n - 1; i >= 0; --i) parts.push(`L${sx1[i]},${sy[i]}`);
    parts.push("Z");
    return parts.join("");
  })();

  // Negative clip: from x1 line to x=width (right)
  const negClipPath = (() => {
    if (n === 0) return "";
    const parts: string[] = [`M${sx1[0]},${sy[0]}`];
    for (let i = 1; i < n; ++i) parts.push(`L${sx1[i]},${sy[i]}`);
    for (let i = n - 1; i >= 0; --i) parts.push(`L${width},${sy[i]}`);
    parts.push("Z");
    return parts.join("");
  })();

  const line1Path = sorted.map((i, j) => `${j === 0 ? "M" : "L"}${X1[i]},${Y[i]}`).join("");
  const line2Path = sorted.map((i, j) => `${j === 0 ? "M" : "L"}${X2[i]},${Y[i]}`).join("");

  return (
    <g aria-label="difference" className={className}>
      <defs>
        <clipPath id={positiveClipId}>
          <path d={posClipPath} />
        </clipPath>
        <clipPath id={negativeClipId}>
          <path d={negClipPath} />
        </clipPath>
      </defs>
      <path
        d={mainPath}
        fill={positiveFill}
        fillOpacity={positiveFillOpacity}
        clipPath={`url(#${positiveClipId})`}
        aria-label="positive difference"
      />
      <path
        d={mainPath}
        fill={negativeFill}
        fillOpacity={negativeFillOpacity}
        clipPath={`url(#${negativeClipId})`}
        aria-label="negative difference"
      />
      <path d={line2Path} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeOpacity={strokeOpacity} strokeDasharray="2,2" />
      <path d={line1Path} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeOpacity={strokeOpacity} />
    </g>
  );
}
