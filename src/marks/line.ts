import {line as shapeLine} from "d3";
import {createElement as h, Fragment, type ReactNode} from "react";
import {markerToJSX} from "../react/Markers.js";
import type {ChannelValue, ChannelValueDenseBinSpec, ChannelValueSpec} from "../channel.js";
// @ts-ignore — runtime exports from ../context.js not declared in its .d.ts
import {create} from "../context.js";
import {
  directStyleProps,
  groupChannelStyleProps,
  indirectStyleProps,
  transformProp
} from "../react/styles.js";
import {withHrefWrap, withTitleChild} from "../react/styles-jsx.js";
// @ts-ignore — runtime exports from ../curve.js not declared in its .d.ts
import {curveAuto, maybeCurveAuto} from "../curve.js";
import type {CurveAutoOptions} from "../curve.js";
import {Mark} from "../mark.js";
import type {Data, MarkOptions} from "../mark.js";
// @ts-ignore — runtime exports from ../marker.js not declared in its .d.ts
import {applyGroupedMarkers, markers} from "../marker.js";
import type {MarkerOptions} from "../marker.js";
// @ts-ignore — runtime exports from ../options.js not declared in its .d.ts
import {coerceNumbers, indexOf, identity, maybeTuple, maybeZ} from "../options.js";
import {
  // @ts-ignore — runtime exports from ../style.js not declared in its .d.ts
  applyDirectStyles,
  // @ts-ignore
  applyIndirectStyles,
  // @ts-ignore
  applyTransform,
  // @ts-ignore
  applyGroupedChannelStyles,
  // @ts-ignore
  groupIndex
} from "../style.js";
// @ts-ignore — runtime exports from ../transforms/bin.js not declared in its .d.ts
import {maybeDenseIntervalX, maybeDenseIntervalY} from "../transforms/bin.js";
import type {BinOptions, BinReducer} from "../transforms/bin.js";

/** Options for the line mark. */
export interface LineOptions extends MarkOptions, MarkerOptions, CurveAutoOptions {
  /**
   * The required horizontal position channel, typically bound to the *x* scale.
   */
  x?: ChannelValueSpec;

  /**
   * The required vertical position channel, typically bound to the *y* scale.
   */
  y?: ChannelValueSpec;

  /**
   * An optional ordinal channel for grouping data into (possibly stacked)
   * series to be drawn as separate lines. If not specified, it defaults to
   * **fill** if a channel, or **stroke** if a channel.
   */
  z?: ChannelValue;
}

/** Options for the lineX mark. */
export interface LineXOptions extends LineOptions, BinOptions {
  /**
   * The vertical position channel, typically bound to the *y* scale; defaults
   * to the zero-based index of the data [0, 1, 2, …].
   *
   * If an **interval** is specified, **y** values are binned accordingly,
   * allowing zeroes for empty bins instead of interpolating across gaps. This
   * is recommended to “regularize” sampled data; for example, if your data
   * represents timestamped observations and you expect one observation per day,
   * use *day* as the **interval**.
   */
  y?: ChannelValueDenseBinSpec;

  /**
   * How to reduce **x** values when the **y** channel is binned with an
   * **interval**; defaults to *first*. For example, to create a vertical
   * density plot (count of *y* values binned every 0.5):
   *
   * ```js
   * Plot.lineX(data, {y: "value", interval: 0.5, reduce: "count"})
   * ```
   *
   * To default to zero instead of showing gaps in data, as when the observed
   * value represents a quantity, use the *sum* reducer.
   */
  reduce?: BinReducer;
}

/** Options for the lineY mark. */
export interface LineYOptions extends LineOptions, BinOptions {
  /**
   * The horizontal position channel, typically bound to the *x* scale; defaults
   * to the zero-based index of the data [0, 1, 2, …].
   *
   * If an **interval** is specified, **x** values are binned accordingly,
   * allowing zeroes for empty bins instead of interpolating across gaps. This
   * is recommended to “regularize” sampled data; for example, if your data
   * represents timestamped observations and you expect one observation per day,
   * use *day* as the **interval**.
   */
  x?: ChannelValueDenseBinSpec;

  /**
   * How to reduce **y** values when the **x** channel is binned with an
   * **interval**; defaults to *first*. For example, for a line chart of the
   * count of records by month:
   *
   * ```js
   * Plot.lineY(records, {x: "Date", interval: "month", reduce: "count"})
   * ```
   *
   * To default to zero instead of showing gaps in data, as when the observed
   * value represents a quantity, use the *sum* reducer.
   */
  reduce?: BinReducer;
}

const defaults = {
  ariaLabel: "line",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeMiterlimit: 1
};

/** The line mark. */
export class Line extends Mark {
  z: any;
  curve: any;
  constructor(data?: Data, options: LineOptions = {}) {
    const {x, y, z, curve, tension} = options;
    super(
      // @ts-ignore — Mark constructor signature in .d.ts elides runtime args
      data,
      {
        x: {value: x, scale: "x"},
        y: {value: y, scale: "y"},
        z: {value: maybeZ(options), optional: true}
      },
      options,
      defaults
    );
    this.z = z;
    this.curve = maybeCurveAuto(curve, tension);
    markers(this, options);
  }
  filter(index: any) {
    return index;
  }
  project(channels: any, values: any, context: any) {
    // For the auto curve, projection is handled at render.
    if (this.curve !== curveAuto) {
      // @ts-ignore — Mark.project not declared in .d.ts surface
      super.project(channels, values, context);
    }
  }
  render(index: any, scales: any, channels: any, dimensions: any, context: any) {
    const {x: X, y: Y} = channels;
    const {curve} = this;
    return create("svg:g", context)
      .call(applyIndirectStyles, this, dimensions, context)
      .call(applyTransform, this, scales)
      .call((g) =>
        g
          .selectAll()
          .data(groupIndex(index, [X, Y], this, channels))
          .enter()
          .append("path")
          .call(applyDirectStyles, this)
          .call(applyGroupedChannelStyles, this, channels)
          .call(applyGroupedMarkers, this, channels, context)
          .attr(
            "d",
            curve === curveAuto && context.projection
              ? sphereLine(context.path(), X, Y)
              : shapeLine<any>()
                  .curve(curve)
                  .defined((i) => i >= 0)
                  .x((i) => X[i])
                  .y((i) => Y[i])
          )
      )
      .node();
  }
  renderJSX(this: any, index: any, scales: any, channels: any, dimensions: any, context: any): ReactNode {
    const {x: X, y: Y, stroke: S} = channels;
    const {curve} = this;
    const indirect = indirectStyleProps(this, dimensions);
    const transform = transformProp(this, scales);
    const direct = directStyleProps(this);
    const dOf =
      curve === curveAuto && context.projection
        ? sphereLine(context.path(), X, Y)
        : shapeLine<any>()
            .curve(curve)
            .defined((i: number) => i >= 0)
            .x((i: number) => X[i])
            .y((i: number) => Y[i]);
    const markerDefs = new Map<string, ReactNode>();
    const markerAttrsFor = (color: any) => {
      const out: Record<string, string> = {};
      for (const [opt, attr] of [
        [this.markerStart, "markerStart"],
        [this.markerMid, "markerMid"],
        [this.markerEnd, "markerEnd"]
      ] as const) {
        if (!opt) continue;
        const m = markerToJSX(opt, color);
        if (!m) continue;
        if (!markerDefs.has(m.id)) markerDefs.set(m.id, m.defJSX);
        out[attr] = m.urlRef;
      }
      return out;
    };
    const groups = [...groupIndex(index, [X, Y], this, channels)] as number[][];
    const paths = groups.map((G, k) => {
      const channel = groupChannelStyleProps(G, channels);
      const i = G[0];
      const color = S ? S[i] : this.stroke;
      const markerAttrs = markerAttrsFor(color);
      const titled = withTitleChild(channels, i, null);
      const pathEl = h("path", {key: k, ...direct, ...channel, ...markerAttrs, d: dOf(G)}, titled);
      return withHrefWrap(channels, this.target, i, pathEl);
    });
    const defs = markerDefs.size > 0
      ? h("defs", {key: "__defs"}, ...Array.from(markerDefs.entries()).map(([id, def]) => h(Fragment, {key: id}, def)))
      : null;
    return h("g", {...indirect, ...transform}, defs, ...paths);
  }
}

function sphereLine(path: any, X: any, Y: any) {
  X = coerceNumbers(X);
  Y = coerceNumbers(Y);
  return (I: any) => {
    let line = [];
    const lines = [line];
    for (const i of I) {
      // Check for undefined value; see groupIndex.
      if (i === -1) {
        line = [];
        lines.push(line);
      } else {
        line.push([X[i], Y[i]]);
      }
    }
    return path({type: "MultiLineString", coordinates: lines});
  };
}

/**
 * Returns a new line mark for the given *data* and *options* by connecting
 * control points. If neither the **x** nor **y** options are specified, *data*
 * is assumed to be an array of pairs [[*x₀*, *y₀*], [*x₁*, *y₁*], [*x₂*, *y₂*],
 * …] such that **x** = [*x₀*, *x₁*, *x₂*, …] and **y** = [*y₀*, *y₁*, *y₂*, …].
 *
 * Points along the line are connected in input order. If there are multiple
 * series via the **z**, **fill**, or **stroke** channel, series are drawn in
 * input order such that the last series is drawn on top. Typically *data* is
 * already in sorted order, such as chronological for time series; if needed,
 * consider a **sort** transform.
 *
 * If any **x** or **y** values are invalid (undefined, null, or NaN), the line
 * will be interrupted, resulting in a break that divides the line shape into
 * multiple segments. If a line segment consists of only a single point, it may
 * appear invisible unless rendered with rounded or square line caps. In
 * addition, some curves such as *cardinal-open* only render a visible segment
 * if it contains multiple points.
 *
 * Variable aesthetic channels are supported: if the **stroke** is defined as a
 * channel, the line will be broken into contiguous overlapping segments when
 * the stroke color changes; the stroke color will apply to the interval
 * spanning the current data point and the following data point. This behavior
 * also applies to the **fill**, **fillOpacity**, **strokeOpacity**,
 * **strokeWidth**, **opacity**, **href**, **title**, and **ariaLabel**
 * channels. When any of these channels are used, setting an explicit **z**
 * channel (possibly to null) is strongly recommended.
 */
export function line(data?: Data, {x, y, ...options}: LineOptions = {}): Line {
  [x, y] = maybeTuple(x, y);
  return new Line(data, {...options, x, y});
}

/**
 * Like line, except that **x** defaults to the identity function assuming that
 * *data* = [*x₀*, *x₁*, *x₂*, …] and **y** defaults to the zero-based index [0,
 * 1, 2, …]. For example, to draw a vertical line chart of a temperature series:
 *
 * ```js
 * Plot.lineX(observations, {x: "temperature"})
 * ```
 *
 * The **interval** option is recommended to “regularize” sampled data via an
 * implicit binY transform. For example, if your data represents timestamped
 * temperature measurements and you expect one sample per day, use *day* as the
 * interval:
 *
 * ```js
 * Plot.lineX(observations, {y: "date", x: "temperature", interval: "day"})
 * ```
 */
export function lineX(data?: Data, options: LineXOptions = {}): Line {
  const {x = identity, y = indexOf, stroke, z = stroke === x ? null : undefined, ...rest} = maybeDenseIntervalY(options);
  return new Line(data, {...rest, x, y, z, stroke});
}

/**
 * Like line, except **y** defaults to the identity function and assumes that
 * *data* = [*y₀*, *y₁*, *y₂*, …] and **x** defaults to the zero-based index [0,
 * 1, 2, …]. For example, to draw a horizontal line chart of a temperature
 * series:
 *
 * ```js
 * Plot.lineY(observations, {y: "temperature"})
 * ```
 *
 * The **interval** option is recommended to “regularize” sampled data via an
 * implicit binX transform. For example, if your data represents timestamped
 * temperature measurements and you expect one sample per day, use *day* as the
 * interval:
 *
 * ```js
 * Plot.lineY(observations, {x: "date", y: "temperature", interval: "day"})
 * ```
 */
export function lineY(data?: Data, options: LineYOptions = {}): Line {
  const {x = indexOf, y = identity, stroke, z = stroke === y ? null : undefined, ...rest} = maybeDenseIntervalX(options);
  return new Line(data, {...rest, x, y, z, stroke});
}
