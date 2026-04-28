import {area as shapeArea} from "d3";
import type {ChannelValue, ChannelValueDenseBinSpec, ChannelValueSpec} from "../channel.js";
// @ts-ignore — runtime helper not exposed in companion .d.ts
import {create} from "../context.js";
// @ts-ignore — runtime helper not exposed in companion .d.ts
import {maybeCurve} from "../curve.js";
import type {CurveOptions} from "../curve.js";
import {Mark} from "../mark.js";
import type {Data, MarkOptions} from "../mark.js";
// @ts-ignore — runtime helpers not exposed in companion .d.ts
import {first, indexOf, maybeZ, second} from "../options.js";
// @ts-ignore — runtime helpers not exposed in companion .d.ts
import {applyDirectStyles, applyIndirectStyles, applyTransform, applyGroupedChannelStyles, groupIndex} from "../style.js";
// @ts-ignore — runtime helpers not exposed in companion .d.ts
import {maybeDenseIntervalX, maybeDenseIntervalY} from "../transforms/bin.js";
import type {BinOptions, BinReducer} from "../transforms/bin.js";
// @ts-ignore — runtime helpers not exposed in companion .d.ts
import {maybeIdentityX, maybeIdentityY} from "../transforms/identity.js";
// @ts-ignore — runtime helpers not exposed in companion .d.ts
import {maybeStackX, maybeStackY} from "../transforms/stack.js";
import type {StackOptions} from "../transforms/stack.js";

/** Options for the area, areaX, and areaY marks. */
export interface AreaOptions extends MarkOptions, StackOptions, CurveOptions {
  /**
   * The required primary (starting, often left) horizontal position channel,
   * representing the area’s baseline, typically bound to the *x* scale. For
   * areaX, setting this option disables the implicit stackX transform.
   */
  x1?: ChannelValueSpec;

  /**
   * The optional secondary (ending, often right) horizontal position channel,
   * representing the area’s topline, typically bound to the *x* scale; if not
   * specified, **x1** is used. For areaX, setting this option disables the
   * implicit stackX transform.
   */
  x2?: ChannelValueSpec;

  /**
   * The required primary (starting, often bottom) vertical position channel,
   * representing the area’s baseline, typically bound to the *y* scale. For
   * areaY, setting this option disables the implicit stackY transform.
   */
  y1?: ChannelValueSpec;

  /**
   * The optional secondary (ending, often top) vertical position channel,
   * representing the area’s topline, typically bound to the *y* scale; if not
   * specified, **y1** is used. For areaY, setting this option disables the
   * implicit stackY transform.
   */
  y2?: ChannelValueSpec;

  /**
   * An optional ordinal channel for grouping data into (possibly stacked)
   * series to be drawn as separate areas; defaults to **fill** if a channel, or
   * **stroke** if a channel.
   */
  z?: ChannelValue;
}

/** Options for the areaX mark. */
export interface AreaXOptions extends Omit<AreaOptions, "y1" | "y2">, BinOptions {
  /**
   * The horizontal position (or length) channel, typically bound to the *x*
   * scale.
   *
   * If neither **x1** nor **x2** is specified, an implicit stackX transform is
   * applied and **x** defaults to the identity function, assuming that *data* =
   * [*x₀*, *x₁*, *x₂*, …]. Otherwise, if only one of **x1** or **x2** is
   * specified, the other defaults to **x**, which defaults to zero.
   */
  x?: ChannelValueSpec;

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
   * Plot.areaX(data, {y: "value", interval: 0.5, reduce: "count"})
   * ```
   *
   * To default to zero instead of showing gaps in data, as when the observed
   * value represents a quantity, use the *sum* reducer.
   */
  reduce?: BinReducer;
}

/** Options for the areaY mark. */
export interface AreaYOptions extends Omit<AreaOptions, "x1" | "x2">, BinOptions {
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
   * The vertical position (or length) channel, typically bound to the *y*
   * scale.
   *
   * If neither **y1** nor **y2** is specified, an implicit stackY transform is
   * applied and **y** defaults to the identity function, assuming that *data* =
   * [*y₀*, *y₁*, *y₂*, …]. Otherwise, if only one of **y1** or **y2** is
   * specified, the other defaults to **y**, which defaults to zero.
   */
  y?: ChannelValueSpec;

  /**
   * How to reduce **y** values when the **x** channel is binned with an
   * **interval**; defaults to *first*. For example, for an area chart of the
   * count of records by month:
   *
   * ```js
   * Plot.areaY(records, {x: "Date", interval: "month", reduce: "count"})
   * ```
   *
   * To default to zero instead of showing gaps in data, as when the observed
   * value represents a quantity, use the *sum* reducer.
   */
  reduce?: BinReducer;
}

const defaults = {
  ariaLabel: "area",
  strokeWidth: 1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeMiterlimit: 1
};

/** The area mark. */
export class Area extends Mark {
  z: any;
  curve: any;
  constructor(data: Data | null | undefined, options: any = {}) {
    const {x1, y1, x2, y2, z, curve, tension} = options;
    const channels = {
      x1: {value: x1, scale: "x"},
      y1: {value: y1, scale: "y"},
      x2: {value: x2, scale: "x", optional: true},
      y2: {value: y2, scale: "y", optional: true},
      z: {value: maybeZ(options), optional: true}
    };
    // @ts-ignore — Mark's companion .d.ts omits its constructor signature.
    super(data, channels, options, defaults);
    this.z = z;
    this.curve = maybeCurve(curve, tension);
  }
  filter(index: any): any {
    return index;
  }
  render(index: any, scales: any, channels: any, dimensions: any, context: any): any {
    const {x1: X1, y1: Y1, x2: X2 = X1, y2: Y2 = Y1} = channels;
    return create("svg:g", context)
      .call(applyIndirectStyles, this, dimensions, context)
      .call(applyTransform, this, scales, 0, 0)
      .call((g: any) =>
        g
          .selectAll()
          .data(groupIndex(index, [X1, Y1, X2, Y2], this, channels))
          .enter()
          .append("path")
          .call(applyDirectStyles, this)
          .call(applyGroupedChannelStyles, this, channels)
          .attr(
            "d",
            shapeArea()
              .curve(this.curve)
              .defined((i: any) => i >= 0)
              .x0((i: any) => X1[i])
              .y0((i: any) => Y1[i])
              .x1((i: any) => X2[i])
              .y1((i: any) => Y2[i])
          )
      )
      .node();
  }
}

/**
 * Returns a new area mark with the given *data* and *options*. The area mark is
 * rarely used directly; it is only needed when the baseline and topline have
 * neither *x* nor *y* values in common. Use areaY for a horizontal orientation
 * where the baseline and topline share *x* values, or areaX for a vertical
 * orientation where the baseline and topline share *y* values.
 */
export function area(data?: Data, options?: AreaOptions): Area {
  if (options === undefined) return areaY(data, {x: first, y: second} as any);
  return new Area(data, options);
}

/**
 * Returns a new vertically-oriented area mark for the given *data* and
 * *options*, where the baseline and topline share **y** values, as in a
 * time-series area chart where time goes up↑.
 */
export function areaX(data?: Data, options?: AreaXOptions): Area {
  const {x, y = indexOf, color, stroke = color, fill = color, z = x === fill || x === stroke ? null : undefined, ...rest} = maybeDenseIntervalY(options) as any;
  return new Area(data, maybeStackX(maybeIdentityX({...rest, x, y1: y, y2: undefined, z, stroke, fill}, y === indexOf ? "x2" : "x")));
}

/**
 * Returns a new horizontally-oriented area mark for the given *data* and
 * *options*, where the baseline and topline share **x** values, as in a
 * time-series area chart where time goes right→.
 */
export function areaY(data?: Data, options?: AreaYOptions): Area {
  const {x = indexOf, y, color, stroke = color, fill = color, z = y === fill || y === stroke ? null : undefined, ...rest} = maybeDenseIntervalX(options) as any;
  return new Area(data, maybeStackY(maybeIdentityY({...rest, x1: x, x2: undefined, y, z, stroke, fill}, x === indexOf ? "y2" : "y")));
}
