import type {ChannelValueIntervalSpec, ChannelValueSpec} from "../channel.js";
import type {InsetOptions} from "../inset.js";
import type {Interval} from "../interval.js";
import type {Data, MarkOptions} from "../mark.js";
import type {MarkerOptions} from "../marker.js";
import {create} from "../context.js";
import {Mark, withTip} from "../mark.js";
import {applyMarkers, markers} from "../marker.js";
import {identity, number} from "../options.js";
import {isCollapsed} from "../scales.js";
import {applyChannelStyles, applyDirectStyles, applyIndirectStyles, applyTransform, offset} from "../style.js";
import {maybeIntervalX, maybeIntervalY} from "../transforms/interval.js";

/** Options for the ruleX and ruleY marks. */
interface RuleOptions extends MarkOptions, MarkerOptions {
  /**
   * How to convert a continuous value (**y** for ruleX, or **x** for ruleY)
   * into an interval (**y1** and **y2** for ruleX, or **x1** and **x2** for
   * ruleY); one of:
   *
   * - an object that implements *floor*, *offset*, and *range* methods
   * - a named time interval such as *day* (for date intervals)
   * - a number (for number intervals), defining intervals at integer multiples of *n*
   *
   * For example, to bin Apple’s daily stock price by month, plotting a sequence
   * of barcodes showing monthly distributions:
   *
   * ```js
   * Plot.ruleY(aapl, {x: "Date", y: "Close", interval: "month"})
   * ```
   */
  interval?: Interval;
}

/** Options for the ruleX mark. */
export interface RuleXOptions extends RuleOptions, Omit<InsetOptions, "insetLeft" | "insetRight"> {
  /**
   * The horizontal position of the tick; an optional channel bound to the *x*
   * scale. If not specified, the rule will be horizontally centered in the
   * plot’s frame.
   */
  x?: ChannelValueSpec;

  /**
   * Shorthand for specifying both the primary and secondary vertical position
   * of the tick as the bounds of the containing interval; can only be used in
   * conjunction with the **interval** option.
   */
  y?: ChannelValueIntervalSpec;

  /**
   * The primary (starting, often bottom) vertical position of the tick; a
   * channel bound to the *y* scale.
   *
   * If *y* represents ordinal values, use a tickX mark instead.
   */
  y1?: ChannelValueSpec;

  /**
   * The secondary (ending, often top) vertical position of the tick; a channel
   * bound to the *y* scale.
   *
   * If *y* represents ordinal values, use a tickX mark instead.
   */
  y2?: ChannelValueSpec;
}

/** Options for the ruleY mark. */
export interface RuleYOptions extends RuleOptions, Omit<InsetOptions, "insetTop" | "insetBottom"> {
  /**
   * Shorthand for specifying both the primary and secondary horizontal position
   * of the tick as the bounds of the containing interval; can only be used in
   * conjunction with the **interval** option.
   */
  x?: ChannelValueIntervalSpec;

  /**
   * The primary (starting, often left) horizontal position of the tick; a
   * channel bound to the *x* scale.
   *
   * If *x* represents ordinal values, use a tickY mark instead.
   */
  x1?: ChannelValueSpec;

  /**
   * The secondary (ending, often right) horizontal position of the tick; a
   * channel bound to the *x* scale.
   *
   * If *x* represents ordinal values, use a tickY mark instead.
   */
  x2?: ChannelValueSpec;

  /**
   * The vertical position of the tick; an optional channel bound to the *y*
   * scale. If not specified, the rule will be vertically centered in the plot’s
   * frame.
   */
  y?: ChannelValueSpec;
}

const defaults = {
  ariaLabel: "rule",
  fill: null,
  stroke: "currentColor"
};

/** The ruleX mark. */
export class RuleX extends Mark {
  constructor(data?: Data, options: RuleXOptions = {}) {
    const {x, y1, y2, inset = 0, insetTop = inset, insetBottom = inset} = options;
    super(
      data,
      {
        x: {value: x, scale: "x", optional: true},
        y1: {value: y1, scale: "y", optional: true},
        y2: {value: y2, scale: "y", optional: true}
      },
      withTip(options, "x"),
      defaults
    );
    this.insetTop = number(insetTop);
    this.insetBottom = number(insetBottom);
    markers(this, options);
  }
  render(index, scales, channels, dimensions, context) {
    const {x, y} = scales;
    const {x: X, y1: Y1, y2: Y2} = channels;
    const {width, height, marginTop, marginRight, marginLeft, marginBottom} = dimensions;
    const {insetTop, insetBottom} = this;
    return create("svg:g", context)
      .call(applyIndirectStyles, this, dimensions, context)
      .call(applyTransform, this, {x: X && x}, offset, 0)
      .call((g) =>
        g
          .selectAll()
          .data(index)
          .enter()
          .append("line")
          .call(applyDirectStyles, this)
          .attr("x1", X ? (i) => X[i] : (marginLeft + width - marginRight) / 2)
          .attr("x2", X ? (i) => X[i] : (marginLeft + width - marginRight) / 2)
          .attr("y1", Y1 && !isCollapsed(y) ? (i) => Y1[i] + insetTop : marginTop + insetTop)
          .attr(
            "y2",
            Y2 && !isCollapsed(y)
              ? y.bandwidth
                ? (i) => Y2[i] + y.bandwidth() - insetBottom
                : (i) => Y2[i] - insetBottom
              : height - marginBottom - insetBottom
          )
          .call(applyChannelStyles, this, channels)
          .call(applyMarkers, this, channels, context)
      )
      .node();
  }
}

/** The ruleY mark. */
export class RuleY extends Mark {
  constructor(data?: Data, options: RuleYOptions = {}) {
    const {x1, x2, y, inset = 0, insetRight = inset, insetLeft = inset} = options;
    super(
      data,
      {
        y: {value: y, scale: "y", optional: true},
        x1: {value: x1, scale: "x", optional: true},
        x2: {value: x2, scale: "x", optional: true}
      },
      withTip(options, "y"),
      defaults
    );
    this.insetRight = number(insetRight);
    this.insetLeft = number(insetLeft);
    markers(this, options);
  }
  render(index, scales, channels, dimensions, context) {
    const {x, y} = scales;
    const {y: Y, x1: X1, x2: X2} = channels;
    const {width, height, marginTop, marginRight, marginLeft, marginBottom} = dimensions;
    const {insetLeft, insetRight} = this;
    return create("svg:g", context)
      .call(applyIndirectStyles, this, dimensions, context)
      .call(applyTransform, this, {y: Y && y}, 0, offset)
      .call((g) =>
        g
          .selectAll()
          .data(index)
          .enter()
          .append("line")
          .call(applyDirectStyles, this)
          .attr("x1", X1 && !isCollapsed(x) ? (i) => X1[i] + insetLeft : marginLeft + insetLeft)
          .attr(
            "x2",
            X2 && !isCollapsed(x)
              ? x.bandwidth
                ? (i) => X2[i] + x.bandwidth() - insetRight
                : (i) => X2[i] - insetRight
              : width - marginRight - insetRight
          )
          .attr("y1", Y ? (i) => Y[i] : (marginTop + height - marginBottom) / 2)
          .attr("y2", Y ? (i) => Y[i] : (marginTop + height - marginBottom) / 2)
          .call(applyChannelStyles, this, channels)
          .call(applyMarkers, this, channels, context)
      )
      .node();
  }
}

/**
 * Returns a new horizontally-positioned ruleX mark (a vertical line, |) for the
 * given *data* and *options*. The **x** channel specifies the rule’s horizontal
 * position and defaults to identity, assuming that *data* = [*x₀*, *x₁*, *x₂*,
 * …]; the optional **y1** and **y2** channels specify its vertical extent. For
 * example, for a candlestick chart of Apple’s daily stock price:
 *
 * ```js
 * Plot.ruleX(aapl, {x: "Date", y1: "Open", y2: "Close"})
 * ```
 *
 * The ruleX mark is often used to highlight specific *x* values. For example,
 * to draw a rule at *x* = 0:
 *
 * ```js
 * Plot.ruleX([0])
 * ```
 *
 * If *y* represents ordinal values, use a tickX mark instead.
 */
export function ruleX(data?: Data, options?: RuleXOptions): RuleX {
  // eslint-disable-next-line prefer-const
  let {x = identity, y, y1, y2, ...rest} = maybeIntervalY(options);
  [y1, y2] = maybeOptionalZero(y, y1, y2);
  return new RuleX(data, {...rest, x, y1, y2});
}

/**
 * Returns a new vertically-positioned ruleY mark (a horizontal line, —) for the
 * given *data* and *options*. The **y** channel specifies the vertical position
 * of the rule and defaults to identity, assuming that *data* = [*y₀*, *y₁*,
 * *y₂*, …]; the optional **x1** and **x2** channels specify its horizontal
 * extent. For example, to bin Apple’s daily stock price by month, plotting a
 * sequence of barcodes showing monthly distributions:
 *
 * ```js
 * Plot.ruleY(aapl, {x: "Date", y: "Close", interval: "month"})
 * ```
 *
 * The ruleY mark is often used to highlight specific *y* values. For example,
 * to draw a rule at *y* = 0:
 *
 * ```js
 * Plot.ruleY([0])
 * ```
 *
 * If *x* represents ordinal values, use a tickY mark instead.
 */
export function ruleY(data?: Data, options?: RuleYOptions): RuleY {
  // eslint-disable-next-line prefer-const
  let {y = identity, x, x1, x2, ...rest} = maybeIntervalX(options);
  [x1, x2] = maybeOptionalZero(x, x1, x2);
  return new RuleY(data, {...rest, y, x1, x2});
}

// For marks specified either as [0, x] or [x1, x2], or nothing.
function maybeOptionalZero(x, x1, x2) {
  if (x == null) {
    if (x1 === undefined) {
      if (x2 !== undefined) return [0, x2];
    } else {
      if (x2 === undefined) return [0, x1];
    }
  } else if (x1 === undefined) {
    return x2 === undefined ? [0, x] : [x, x2];
  } else if (x2 === undefined) {
    return [x, x1];
  }
  return [x1, x2];
}
