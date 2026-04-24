import React from "react";
import {AreaX, AreaY} from "./Area.js";
import {LineX, LineY} from "./Line.js";
// @ts-expect-error — JS module without .d.ts
import {map} from "../../transforms/map.js";
// @ts-expect-error — JS module without .d.ts
import {window as windowTransform} from "../../transforms/window.js";
import {deviation, mean} from "d3";

const defaults = {
  n: 20,
  k: 2,
  opacity: 0.2,
  strict: true,
  anchor: "end"
};

export interface BollingerProps {
  data?: any;
  x?: any;
  y?: any;
  x1?: any;
  x2?: any;
  y1?: any;
  y2?: any;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  n?: number;
  k?: number;
  strict?: boolean;
  anchor?: string;
  className?: string;
  [key: string]: any;
}

function bollingerWindow({n = defaults.n, k = 0, strict = defaults.strict, anchor = defaults.anchor}: any = {}) {
  return windowTransform({k: n, reduce: (Y: number[]) => mean(Y)! + k * (deviation(Y) || 0), strict, anchor});
}

function isNoneish(value: any) {
  return value == null || `${value}`.toLowerCase() === "none";
}

// BollingerX: composes AreaX (bands) + LineX (center) with a window-based
// rolling mean±k*stddev transform on the x channel.
export function BollingerX({
  data,
  x,
  y,
  n = defaults.n,
  k = defaults.k,
  strict = defaults.strict,
  anchor = defaults.anchor,
  fill = "currentColor",
  fillOpacity = defaults.opacity,
  stroke = "currentColor",
  strokeWidth = 1.5,
  strokeOpacity,
  className,
  ...rest
}: BollingerProps) {
  const windowOpts = {n, strict, anchor};
  const bandOpts = map(
    {x1: bollingerWindow({...windowOpts, k: -k}), x2: bollingerWindow({...windowOpts, k})},
    {x1: x, x2: x, y, ...rest}
  );
  const lineOpts = map({x: bollingerWindow(windowOpts)}, {x, y, ...rest});
  return (
    <>
      {!isNoneish(fill) && (
        <AreaX
          data={data}
          {...bandOpts}
          fill={fill}
          fillOpacity={fillOpacity}
          className={className}
        />
      )}
      {!isNoneish(stroke) && (
        <LineX
          data={data}
          {...lineOpts}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          className={className}
        />
      )}
    </>
  );
}

// BollingerY: composes AreaY (bands) + LineY (center) with a window-based
// rolling mean±k*stddev transform on the y channel.
export function BollingerY({
  data,
  x,
  y,
  n = defaults.n,
  k = defaults.k,
  strict = defaults.strict,
  anchor = defaults.anchor,
  fill = "currentColor",
  fillOpacity = defaults.opacity,
  stroke = "currentColor",
  strokeWidth = 1.5,
  strokeOpacity,
  className,
  ...rest
}: BollingerProps) {
  const windowOpts = {n, strict, anchor};
  const bandOpts = map(
    {y1: bollingerWindow({...windowOpts, k: -k}), y2: bollingerWindow({...windowOpts, k})},
    {x, y1: y, y2: y, ...rest}
  );
  const lineOpts = map({y: bollingerWindow(windowOpts)}, {x, y, ...rest});
  return (
    <>
      {!isNoneish(fill) && (
        <AreaY
          data={data}
          {...bandOpts}
          fill={fill}
          fillOpacity={fillOpacity}
          className={className}
        />
      )}
      {!isNoneish(stroke) && (
        <LineY
          data={data}
          {...lineOpts}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          className={className}
        />
      )}
    </>
  );
}
