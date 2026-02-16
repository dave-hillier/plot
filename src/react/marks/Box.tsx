import React, {useMemo} from "react";
import {quantile, min, max, group} from "d3";
import {BarX, BarY} from "./Bar.js";
import {RuleX, RuleY} from "./Rule.js";
import {TickX, TickY} from "./Tick.js";
import {Dot} from "./Dot.js";

export interface BoxProps {
  data?: any;
  x?: any;
  y?: any;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  sort?: any;
  r?: number;
  className?: string;
  [key: string]: any;
}

function toAccessor(field: any): (d: any, i: number) => any {
  if (field == null) return (d: any) => d;
  if (typeof field === "function") return field;
  if (typeof field === "string") return (d: any) => d?.[field];
  return (d: any) => d;
}

// Compute box-plot statistics for a set of sorted numeric values.
function boxStats(values: number[]) {
  const sorted = Float64Array.from(values).sort();
  const q1 = quantile(sorted, 0.25)!;
  const q3 = quantile(sorted, 0.75)!;
  const median = quantile(sorted, 0.5)!;
  const iqr = q3 - q1;
  const loFence = q1 - 1.5 * iqr;
  const hiFence = q3 + 1.5 * iqr;
  const lo = min(sorted, (d) => (d >= loFence ? d : NaN))!;
  const hi = max(sorted, (d) => (d <= hiFence ? d : NaN))!;
  return {q1, q3, median, lo, hi, loFence, hiFence};
}

// BoxX renders a horizontal box plot (quartiles along x-axis, grouped by y).
// Computes Q1, Q3, median, whiskers, and outliers from raw data.
export function BoxX({
  data,
  x,
  y,
  fill = "#ccc",
  fillOpacity,
  stroke = "currentColor",
  strokeOpacity,
  strokeWidth = 2,
  sort: sortProp,
  r = 2,
  ...rest
}: BoxProps) {
  const getX = useMemo(() => toAccessor(x ?? ((d: any) => d)), [x]);
  const getY = useMemo(() => toAccessor(y), [y]);

  const {summaries, outliers} = useMemo(() => {
    if (!data) return {summaries: [], outliers: []};
    const grouped =
      y != null ? group(data, (d: any, i: number) => getY(d, i)) : new Map([["__all__", Array.from(data)]]);
    const summaries: any[] = [];
    const outliers: any[] = [];

    for (const [key, items] of grouped) {
      const values = (items as any[]).map((d, i) => getX(d, i)).filter((v: any) => v != null && isFinite(v));
      if (values.length === 0) continue;
      const stats = boxStats(values);
      summaries.push({
        _y: key,
        _q1: stats.q1,
        _q3: stats.q3,
        _median: stats.median,
        _lo: stats.lo,
        _hi: stats.hi
      });

      for (const item of items as any[]) {
        const v = getX(item, 0);
        if (v != null && isFinite(v) && (v < stats.lo || v > stats.hi)) {
          outliers.push({_y: key, _x: v});
        }
      }
    }
    return {summaries, outliers};
  }, [data, getX, getY, y]);

  if (summaries.length === 0) return null;

  const yProp = y != null ? "_y" : undefined;

  return (
    <>
      <RuleY data={summaries} y={yProp} x1="_lo" x2="_hi" stroke={stroke} strokeOpacity={strokeOpacity} {...rest} />
      <BarX data={summaries} y={yProp} x1="_q1" x2="_q3" fill={fill} fillOpacity={fillOpacity} {...rest} />
      <TickX
        data={summaries}
        y={yProp}
        x="_median"
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
        {...rest}
      />
      {outliers.length > 0 && (
        <Dot data={outliers} y={yProp} x="_x" r={r} stroke={stroke} strokeOpacity={strokeOpacity} {...rest} />
      )}
    </>
  );
}

// BoxY renders a vertical box plot (quartiles along y-axis, grouped by x).
// Computes Q1, Q3, median, whiskers, and outliers from raw data.
export function BoxY({
  data,
  x,
  y,
  fill = "#ccc",
  fillOpacity,
  stroke = "currentColor",
  strokeOpacity,
  strokeWidth = 2,
  sort: sortProp,
  r = 2,
  ...rest
}: BoxProps) {
  const getX = useMemo(() => toAccessor(x), [x]);
  const getY = useMemo(() => toAccessor(y ?? ((d: any) => d)), [y]);

  const {summaries, outliers} = useMemo(() => {
    if (!data) return {summaries: [], outliers: []};
    const grouped =
      x != null ? group(data, (d: any, i: number) => getX(d, i)) : new Map([["__all__", Array.from(data)]]);
    const summaries: any[] = [];
    const outliers: any[] = [];

    for (const [key, items] of grouped) {
      const values = (items as any[]).map((d, i) => getY(d, i)).filter((v: any) => v != null && isFinite(v));
      if (values.length === 0) continue;
      const stats = boxStats(values);
      summaries.push({
        _x: key,
        _q1: stats.q1,
        _q3: stats.q3,
        _median: stats.median,
        _lo: stats.lo,
        _hi: stats.hi
      });

      for (const item of items as any[]) {
        const v = getY(item, 0);
        if (v != null && isFinite(v) && (v < stats.lo || v > stats.hi)) {
          outliers.push({_x: key, _y: v});
        }
      }
    }
    return {summaries, outliers};
  }, [data, getX, getY, x]);

  if (summaries.length === 0) return null;

  const xProp = x != null ? "_x" : undefined;

  return (
    <>
      <RuleX data={summaries} x={xProp} y1="_lo" y2="_hi" stroke={stroke} strokeOpacity={strokeOpacity} {...rest} />
      <BarY data={summaries} x={xProp} y1="_q1" y2="_q3" fill={fill} fillOpacity={fillOpacity} {...rest} />
      <TickY
        data={summaries}
        x={xProp}
        y="_median"
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
        {...rest}
      />
      {outliers.length > 0 && (
        <Dot data={outliers} x={xProp} y="_y" r={r} stroke={stroke} strokeOpacity={strokeOpacity} {...rest} />
      )}
    </>
  );
}
