import React, {useId} from "react";
import {usePlotContext} from "../PlotContext.js";
import {formatDefault} from "../../core/index.js";

export interface LegendProps {
  scale?: "color" | "opacity" | "symbol" | "r";
  label?: string;
  tickSize?: number;
  ticks?: number;
  tickFormat?: (d: any) => string;
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  className?: string;
}

// Symbol shapes as SVG path data (d3 symbol paths, centered at origin, size ~64)
const symbolPaths: Record<string, string> = {
  circle: "M4.514,0A4.514,4.514,0,1,1,-4.514,0A4.514,4.514,0,1,1,4.514,0",
  cross: "M-3.5,-1.167H-1.167V-3.5H1.167V-1.167H3.5V1.167H1.167V3.5H-1.167V1.167H-3.5Z",
  diamond: "M0,-4.655L2.691,0L0,4.655L-2.691,0Z",
  square: "M-3.5,-3.5H3.5V3.5H-3.5Z",
  star: "M0,-4.7L1.06,-1.45L4.47,-1.45L1.71,0.55L2.76,3.8L0,1.8L-2.76,3.8L-1.71,0.55L-4.47,-1.45L-1.06,-1.45Z",
  triangle: "M0,-4.2L3.64,2.1L-3.64,2.1Z",
  wye: "M0.58,0.33L0.58,3.5H-0.58V0.33L-2.83,1.63L-3.41,0.62L-1.16,-0.68L-3.41,-1.99L-2.83,-3L-0.58,-1.69V-3.5H0.58V-1.69L2.83,-3L3.41,-1.99L1.16,-0.68L3.41,0.62L2.83,1.63Z"
};

// Legend component supporting color swatches, continuous ramps, symbol legends,
// and opacity legends. Renders pure SVG (<g> elements) so it is valid inside
// <Plot>'s <svg> tree. Place inside <Plot> as a child, or wrap in your own <svg>.
export function Legend({
  scale: scaleName = "color",
  label: labelProp,
  tickSize = 15,
  ticks: tickCount,
  tickFormat: tickFormatFn,
  width: widthProp,
  height: heightProp = 33,
  marginTop = 5,
  marginRight: _marginRight = 0,
  marginBottom = 16,
  marginLeft = 0,
  className
}: LegendProps) {
  const {scales, scaleFunctions} = usePlotContext();
  const gradientId = useId();
  if (!scales) return null;

  const scaleInfo = (scales as any)?.[scaleName];
  if (!scaleInfo) return null;

  const {domain, range, type, label: scaleLabel} = scaleInfo;
  const labelText = labelProp ?? scaleLabel;
  const format = tickFormatFn ?? formatDefault;

  // Symbol legend (discrete symbols rendered as pure SVG)
  if (scaleName === "symbol") {
    const itemWidth = 60;
    const labelOffset = labelText ? 14 : 0;

    return (
      <g className={className} aria-label="symbol-legend" fontSize={10} fontFamily="system-ui, sans-serif">
        {labelText && <text fontWeight="bold" dy="0.71em" fill="currentColor">{`${labelText}`}</text>}
        {domain?.map((d: any, i: number) => {
          const symbolName = range ? range[i % range.length] : "circle";
          const pathD = symbolPaths[symbolName] ?? symbolPaths.circle;
          const x = i * itemWidth;
          return (
            <g key={i} transform={`translate(${x},${labelOffset})`}>
              <path d={pathD} transform={`translate(${tickSize / 2},${tickSize / 2})`} fill="currentColor" />
              <text x={tickSize + 3} y={tickSize / 2} dy="0.32em" fill="currentColor">{`${format(d)}`}</text>
            </g>
          );
        })}
      </g>
    );
  }

  // Opacity legend (continuous ramp)
  if (scaleName === "opacity") {
    const rampWidth = widthProp ?? 240;
    const rampHeight = heightProp - marginTop - marginBottom;
    const opacityScale = scaleFunctions?.opacity;
    const n = tickCount ?? 5;
    const ticks =
      domain && domain.length >= 2
        ? Array.from({length: n}, (_, i) => domain[0] + (i / (n - 1)) * (domain[domain.length - 1] - domain[0]))
        : domain ?? [];

    const labelOffset = labelText ? 14 : 0;

    return (
      <g className={className} aria-label="opacity-legend">
        {labelText && (
          <text fontSize={10} fontFamily="system-ui, sans-serif" dy="0.71em" fill="currentColor">{`${labelText}`}</text>
        )}
        <defs>
          <linearGradient id={gradientId}>
            {Array.from({length: 10}, (_, i) => {
              const t = i / 9;
              const value = domain[0] + t * (domain[domain.length - 1] - domain[0]);
              const opacity = opacityScale ? opacityScale(value) : t;
              return <stop key={i} offset={`${t * 100}%`} stopColor="currentColor" stopOpacity={opacity} />;
            })}
          </linearGradient>
        </defs>
        <rect
          x={marginLeft}
          y={marginTop + labelOffset}
          width={rampWidth}
          height={rampHeight}
          fill={`url(#${gradientId})`}
        />
        <g
          transform={`translate(0,${heightProp - marginBottom + labelOffset})`}
          fontSize={10}
          fontFamily="system-ui, sans-serif"
        >
          {ticks.map((d: any, i: number) => {
            const x = marginLeft + (i / (ticks.length - 1)) * rampWidth;
            return (
              <text
                key={i}
                x={x}
                textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"}
                dy="0.71em"
                fill="currentColor"
              >
                {`${format(d)}`}
              </text>
            );
          })}
        </g>
      </g>
    );
  }

  // Discrete legend (color swatches) for ordinal/categorical or small domains
  if (type === "ordinal" || type === "categorical" || (domain?.length <= 10 && !isContinuousType(type))) {
    const itemWidth = 60;
    const labelOffset = labelText ? 14 : 0;

    return (
      <g className={className} aria-label="color-legend" fontSize={10} fontFamily="system-ui, sans-serif">
        {labelText && <text fontWeight="bold" dy="0.71em" fill="currentColor">{`${labelText}`}</text>}
        {domain?.map((d: any, i: number) => {
          const color = range ? range[i % range.length] : scaleInfo.apply?.(d);
          const x = i * itemWidth;
          return (
            <g key={i} transform={`translate(${x},${labelOffset})`}>
              <rect width={tickSize} height={tickSize} fill={color} />
              <text x={tickSize + 3} y={tickSize / 2} dy="0.32em" fill="currentColor">{`${format(d)}`}</text>
            </g>
          );
        })}
      </g>
    );
  }

  // Continuous legend (color ramp) with tick labels
  const rampWidth = widthProp ?? 240;
  const rampHeight = heightProp - marginTop - marginBottom;
  const n = tickCount ?? 5;
  const ticks =
    domain && domain.length >= 2
      ? Array.from({length: n}, (_, i) => domain[0] + (i / (n - 1)) * (domain[domain.length - 1] - domain[0]))
      : domain ?? [];

  const labelOffset = labelText ? 14 : 0;

  return (
    <g className={className} aria-label="color-legend">
      {labelText && (
        <text fontSize={10} fontFamily="system-ui, sans-serif" dy="0.71em" fill="currentColor">{`${labelText}`}</text>
      )}
      <defs>
        <linearGradient id={gradientId}>
          {domain &&
            domain.length >= 2 &&
            Array.from({length: 10}, (_, i) => {
              const t = i / 9;
              const value = domain[0] + t * (domain[domain.length - 1] - domain[0]);
              const color = scaleInfo.apply?.(value) ?? "#ccc";
              return <stop key={i} offset={`${t * 100}%`} stopColor={color} />;
            })}
        </linearGradient>
      </defs>
      <rect
        x={marginLeft}
        y={marginTop + labelOffset}
        width={rampWidth}
        height={rampHeight}
        fill={`url(#${gradientId})`}
      />
      <g
        transform={`translate(0,${heightProp - marginBottom + labelOffset})`}
        fontSize={10}
        fontFamily="system-ui, sans-serif"
      >
        {ticks.map((d: any, i: number) => {
          const x = marginLeft + (i / (ticks.length - 1)) * rampWidth;
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={0} y2={4} stroke="currentColor" />
              <text
                x={x}
                textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"}
                dy="0.71em"
                y={6}
                fill="currentColor"
              >
                {`${format(d)}`}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}

function isContinuousType(type: string): boolean {
  return [
    "linear",
    "pow",
    "sqrt",
    "log",
    "symlog",
    "utc",
    "time",
    "sequential",
    "diverging",
    "cyclical",
    "threshold",
    "quantile",
    "quantize"
  ].includes(type);
}
