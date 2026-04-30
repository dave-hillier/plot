import {InternSet, extent, format, utcFormat} from "d3";
import {formatDefault} from "../format.js";
import type {CompoundMark, Data, MarkOptions} from "../mark.js";
import {marks} from "../mark.js";
import {radians} from "../math.js";
import {arrayify, constant, identity, keyword, number, range, valueof} from "../options.js";
import {isIterable, isNoneish, isTemporal, isInterval} from "../options.js";
import {maybeColorChannel, maybeNumberChannel, maybeRangeInterval} from "../options.js";
import type {ScaleOptions} from "../scales.js";
import {inferScaleOrder} from "../scales.js";
import {offset} from "../style.js";
import {generalizeTimeInterval, inferTimeFormat, intervalDuration} from "../time.js";
import {initializer} from "../transforms/basic.js";
import {warn} from "../warnings.js";
import type {RuleX, RuleXOptions, RuleY, RuleYOptions} from "./rule.js";
import {ruleX, ruleY} from "./rule.js";
import type {TextOptions} from "./text.js";
import {text, textX, textY} from "./text.js";
import type {TickXOptions, TickYOptions} from "./tick.js";
import {vectorX, vectorY} from "./vector.js";

/** The subset of scale options for grids. */
type GridScaleOptions = Pick<ScaleOptions, "interval" | "ticks" | "tickSpacing">;

/** The subset of scale options for axes. */
type AxisScaleOptions = Pick<ScaleOptions, "tickSize" | "tickPadding" | "tickFormat" | "tickRotate" | "label" | "labelOffset" | "labelAnchor" | "labelArrow">; // prettier-ignore

/** Options for the grid marks. */
export interface GridOptions extends GridScaleOptions {
  /**
   * The side of the frame on which to place the axis: *top* or *bottom* for
   * horizontal axes (axisX and axisFx) and their associated vertical grids
   * (gridX and gridFx), or *left* or *right* for vertical axes (axisY and
   * axisFY) and their associated horizontal grids (gridY and gridFy).
   *
   * The default **anchor** depends on the associated scale:
   *
   * - *x* - *bottom*
   * - *y* - *left*
   * - *fx* - *top* if there is a *bottom* *x* axis, and otherwise *bottom*
   * - *fy* - *right* if there is a *left* *y* axis, and otherwise *right*
   *
   * For grids, the **anchor** also affects the extent of grid lines when the
   * opposite dimension is specified (**x** for gridY and **y** for gridX). For
   * example, to draw a horizontal gridY between the *right* edge of the frame
   * and the specified **x** value:
   *
   * ```js
   * Plot.gridY({x: (y) => aapl.find((d) => d.Close >= y)?.Date, anchor: "right"})
   * ```
   */
  anchor?: "top" | "right" | "bottom" | "left";

  /**
   * A shorthand for setting both **fill** and **stroke**; affects the stroke of
   * tick vectors and grid rules, and the fill of tick texts and axis label
   * texts; defaults to *currentColor*.
   */
  color?: MarkOptions["stroke"];

  /**
   * A shorthand for setting both **fillOpacity** and **strokeOpacity**; affects
   * the stroke opacity of tick vectors and grid rules, and the fill opacity of
   * tick texts and axis label texts; defaults to 1 for axes and 0.1 for grids.
   */
  opacity?: MarkOptions["opacity"];
}

/** Options for the axis marks. */
export interface AxisOptions extends GridOptions, MarkOptions, TextOptions, AxisScaleOptions {
  /** The tick text **stroke**, say for a *white* outline to improve legibility; defaults to null. */
  textStroke?: MarkOptions["stroke"];
  /** The tick text **strokeOpacity**; defaults to 1; has no effect unless **textStroke** is set. */
  textStrokeOpacity?: MarkOptions["strokeOpacity"];
  /** The tick text **strokeWidth**; defaults to 4; has no effect unless **textStroke** is set. */
  textStrokeWidth?: MarkOptions["strokeWidth"];
}

/** Options for the axisX and axisFx marks. */
export interface AxisXOptions extends AxisOptions, TickXOptions {}

/** Options for the axisY and axisFy marks. */
export interface AxisYOptions extends AxisOptions, TickYOptions {}

/** Options for the gridX and gridFx marks. */
export interface GridXOptions extends GridOptions, Omit<RuleXOptions, "interval"> {}

/** Options for the gridY and gridFy marks. */
export interface GridYOptions extends GridOptions, Omit<RuleYOptions, "interval"> {}

// axisX/axisY/axisFx/axisFy and gridX/gridY/gridFx/gridFy are compound marks
// that delegate rendering to vectorX/vectorY (tick lines), textX/textY (tick
// labels and axis labels), and ruleX/ruleY (grids). There is no Mark subclass
// to port here; the JSX paths are invoked through the sub-marks' renderJSX
// methods (Vector.renderJSX, Text.renderJSX, RuleX.renderJSX, RuleY.renderJSX).

function maybeData(data: any, options: any): [any, any] {
  if (arguments.length < 2 && !isIterable(data)) (options = data), (data = null);
  if (options === undefined) options = {};
  return [data, options];
}

function maybeAnchor({anchor}: any = {}, anchors: any): any {
  return anchor === undefined ? anchors[0] : keyword(anchor, "anchor", anchors);
}

function anchorY(options: any): any {
  return maybeAnchor(options, ["left", "right"]);
}

function anchorFy(options: any): any {
  return maybeAnchor(options, ["right", "left"]);
}

function anchorX(options: any): any {
  return maybeAnchor(options, ["bottom", "top"]);
}

function anchorFx(options: any): any {
  return maybeAnchor(options, ["top", "bottom"]);
}

export function axisY(data?: Data, options?: AxisYOptions): CompoundMark;
export function axisY(options?: AxisYOptions): CompoundMark;
export function axisY(...args: any[]): CompoundMark {
  const [data, options] = maybeData(...(args as [any, any]));
  return axisKy("y", anchorY(options), data, options);
}

export function axisFy(data?: Data, options?: AxisYOptions): CompoundMark;
export function axisFy(options?: AxisYOptions): CompoundMark;
export function axisFy(...args: any[]): CompoundMark {
  const [data, options] = maybeData(...(args as [any, any]));
  return axisKy("fy", anchorFy(options), data, options);
}

export function axisX(data?: Data, options?: AxisXOptions): CompoundMark;
export function axisX(options?: AxisXOptions): CompoundMark;
export function axisX(...args: any[]): CompoundMark {
  const [data, options] = maybeData(...(args as [any, any]));
  return axisKx("x", anchorX(options), data, options);
}

export function axisFx(data?: Data, options?: AxisXOptions): CompoundMark;
export function axisFx(options?: AxisXOptions): CompoundMark;
export function axisFx(...args: any[]): CompoundMark {
  const [data, options] = maybeData(...(args as [any, any]));
  return axisKx("fx", anchorFx(options), data, options);
}

function axisKy(
  k: any,
  anchor: any,
  data: any,
  {
    color = "currentColor",
    opacity = 1,
    stroke = color,
    strokeOpacity = opacity,
    strokeWidth = 1,
    fill = color,
    fillOpacity = opacity,
    textAnchor,
    textStroke,
    textStrokeOpacity,
    textStrokeWidth,
    tickSize = k === "y" ? 6 : 0,
    tickPadding,
    tickRotate,
    x,
    margin,
    marginTop = margin === undefined ? 20 : margin,
    marginRight = margin === undefined ? (anchor === "right" ? 40 : 0) : margin,
    marginBottom = margin === undefined ? 20 : margin,
    marginLeft = margin === undefined ? (anchor === "left" ? 40 : 0) : margin,
    label,
    labelAnchor,
    labelArrow,
    labelOffset,
    ariaLabel = `${k}-axis`,
    ...options
  }: any
): any {
  tickSize = number(tickSize);
  tickPadding = number(tickPadding);
  tickRotate = number(tickRotate);
  if (labelAnchor !== undefined) labelAnchor = keyword(labelAnchor, "labelAnchor", ["center", "top", "bottom"]);
  labelArrow = maybeLabelArrow(labelArrow);
  return marks(
    tickSize && !isNoneish(stroke)
      ? axisTickKy(k, anchor, data, {
          stroke,
          strokeOpacity,
          strokeWidth,
          tickSize,
          tickPadding,
          tickRotate,
          x,
          ariaLabel,
          ...options
        })
      : null,
    !isNoneish(fill)
      ? axisTextKy(k, anchor, data, {
          fill,
          fillOpacity,
          stroke: textStroke,
          strokeOpacity: textStrokeOpacity,
          strokeWidth: textStrokeWidth,
          textAnchor,
          tickSize,
          tickPadding,
          tickRotate,
          x,
          marginTop,
          marginRight,
          marginBottom,
          marginLeft,
          ariaLabel,
          ...options
        })
      : null,
    !isNoneish(fill) && label !== null
      ? text(
          [],
          labelOptions(
            {fill, fillOpacity, ...options},
            function (this: any, data: any, facets: any, channels: any, scales: any, dimensions: any) {
              const scale = scales[k];
              const {marginTop, marginRight, marginBottom, marginLeft} = (k === "y" && dimensions.inset) || dimensions;
              const cla = labelAnchor ?? (scale.bandwidth ? "center" : "top");
              const clo = labelOffset ?? (anchor === "right" ? marginRight : marginLeft) - 3;
              if (cla === "center") {
                this.textAnchor = undefined; // middle
                this.lineAnchor = anchor === "right" ? "bottom" : "top";
                this.frameAnchor = anchor;
                this.rotate = -90;
              } else {
                this.textAnchor = anchor === "right" ? "end" : "start";
                this.lineAnchor = cla;
                this.frameAnchor = `${cla}-${anchor}`;
                this.rotate = 0;
              }
              this.dy = cla === "top" ? 3 - marginTop : cla === "bottom" ? marginBottom - 3 : 0;
              this.dx = anchor === "right" ? clo : -clo;
              this.ariaLabel = `${ariaLabel} label`;
              return {
                facets: [[0]],
                channels: {text: {value: [formatAxisLabel(k, scale, {anchor, label, labelAnchor: cla, labelArrow})]}}
              };
            }
          )
        )
      : null
  );
}

function axisKx(
  k: any,
  anchor: any,
  data: any,
  {
    color = "currentColor",
    opacity = 1,
    stroke = color,
    strokeOpacity = opacity,
    strokeWidth = 1,
    fill = color,
    fillOpacity = opacity,
    textAnchor,
    textStroke,
    textStrokeOpacity,
    textStrokeWidth,
    tickSize = k === "x" ? 6 : 0,
    tickPadding,
    tickRotate,
    y,
    margin,
    marginTop = margin === undefined ? (anchor === "top" ? 30 : 0) : margin,
    marginRight = margin === undefined ? 20 : margin,
    marginBottom = margin === undefined ? (anchor === "bottom" ? 30 : 0) : margin,
    marginLeft = margin === undefined ? 20 : margin,
    label,
    labelAnchor,
    labelArrow,
    labelOffset,
    ariaLabel = `${k}-axis`,
    ...options
  }: any
): any {
  tickSize = number(tickSize);
  tickPadding = number(tickPadding);
  tickRotate = number(tickRotate);
  if (labelAnchor !== undefined) labelAnchor = keyword(labelAnchor, "labelAnchor", ["center", "left", "right"]);
  labelArrow = maybeLabelArrow(labelArrow);
  return marks(
    tickSize && !isNoneish(stroke)
      ? axisTickKx(k, anchor, data, {
          stroke,
          strokeOpacity,
          strokeWidth,
          tickSize,
          tickPadding,
          tickRotate,
          y,
          ariaLabel,
          ...options
        })
      : null,
    !isNoneish(fill)
      ? axisTextKx(k, anchor, data, {
          fill,
          fillOpacity,
          stroke: textStroke,
          strokeOpacity: textStrokeOpacity,
          strokeWidth: textStrokeWidth,
          textAnchor,
          tickSize,
          tickPadding,
          tickRotate,
          y,
          marginTop,
          marginRight,
          marginBottom,
          marginLeft,
          ariaLabel,
          ...options
        })
      : null,
    !isNoneish(fill) && label !== null
      ? text(
          [],
          labelOptions(
            {fill, fillOpacity, ...options},
            function (this: any, data: any, facets: any, channels: any, scales: any, dimensions: any) {
              const scale = scales[k];
              const {marginTop, marginRight, marginBottom, marginLeft} = (k === "x" && dimensions.inset) || dimensions;
              const cla = labelAnchor ?? (scale.bandwidth ? "center" : "right");
              const clo = labelOffset ?? (anchor === "top" ? marginTop : marginBottom) - 3;
              if (cla === "center") {
                this.frameAnchor = anchor;
                this.textAnchor = undefined; // middle
              } else {
                this.frameAnchor = `${anchor}-${cla}`;
                this.textAnchor = cla === "right" ? "end" : "start";
              }
              this.lineAnchor = anchor;
              this.dy = anchor === "top" ? -clo : clo;
              this.dx = cla === "right" ? marginRight - 3 : cla === "left" ? 3 - marginLeft : 0;
              this.ariaLabel = `${ariaLabel} label`;
              return {
                facets: [[0]],
                channels: {text: {value: [formatAxisLabel(k, scale, {anchor, label, labelAnchor: cla, labelArrow})]}}
              };
            }
          )
        )
      : null
  );
}

function axisTickKy(
  k: any,
  anchor: any,
  data: any,
  {
    strokeWidth = 1,
    strokeLinecap = null,
    strokeLinejoin = null,
    facetAnchor = anchor + (k === "y" ? "-empty" : ""),
    frameAnchor = anchor,
    tickSize,
    inset = 0,
    insetLeft = inset,
    insetRight = inset,
    dx = 0,
    y = k === "y" ? undefined : null,
    ariaLabel,
    ...options
  }: any
): any {
  return axisMark(
    vectorY,
    k,
    data,
    {
      ariaLabel: `${ariaLabel} tick`,
      ariaHidden: true
    },
    {
      strokeWidth,
      strokeLinecap,
      strokeLinejoin,
      facetAnchor,
      frameAnchor,
      y,
      ...options,
      dx: anchor === "left" ? +dx - offset + +insetLeft : +dx + offset - insetRight,
      anchor: "start",
      length: tickSize,
      shape: anchor === "left" ? shapeTickLeft : shapeTickRight
    }
  );
}

function axisTickKx(
  k: any,
  anchor: any,
  data: any,
  {
    strokeWidth = 1,
    strokeLinecap = null,
    strokeLinejoin = null,
    facetAnchor = anchor + (k === "x" ? "-empty" : ""),
    frameAnchor = anchor,
    tickSize,
    inset = 0,
    insetTop = inset,
    insetBottom = inset,
    dy = 0,
    x = k === "x" ? undefined : null,
    ariaLabel,
    ...options
  }: any
): any {
  return axisMark(
    vectorX,
    k,
    data,
    {
      ariaLabel: `${ariaLabel} tick`,
      ariaHidden: true
    },
    {
      strokeWidth,
      strokeLinejoin,
      strokeLinecap,
      facetAnchor,
      frameAnchor,
      x,
      ...options,
      dy: anchor === "bottom" ? +dy - offset - insetBottom : +dy + offset + +insetTop,
      anchor: "start",
      length: tickSize,
      shape: anchor === "bottom" ? shapeTickBottom : shapeTickTop
    }
  );
}

function axisTextKy(
  k: any,
  anchor: any,
  data: any,
  {
    facetAnchor = anchor + (k === "y" ? "-empty" : ""),
    frameAnchor = anchor,
    tickSize,
    tickRotate = 0,
    tickPadding = Math.max(3, 9 - tickSize) + (Math.abs(tickRotate) > 60 ? 4 * Math.cos(tickRotate * radians) : 0),
    text,
    textAnchor = Math.abs(tickRotate) > 60 ? "middle" : anchor === "left" ? "end" : "start",
    lineAnchor = tickRotate > 60 ? "top" : tickRotate < -60 ? "bottom" : "middle",
    fontVariant,
    inset = 0,
    insetLeft = inset,
    insetRight = inset,
    dx = 0,
    ariaLabel,
    y = k === "y" ? undefined : null,
    ...options
  }: any
): any {
  return axisMark(
    textY,
    k,
    data,
    {ariaLabel: `${ariaLabel} tick label`},
    {
      facetAnchor,
      frameAnchor,
      text,
      textAnchor,
      lineAnchor,
      fontVariant,
      rotate: tickRotate,
      y,
      ...options,
      dx: anchor === "left" ? +dx - tickSize - tickPadding + +insetLeft : +dx + +tickSize + +tickPadding - insetRight
    },
    function (this: any, scale: any, data: any, ticks: any, tickFormat: any, channels: any) {
      if (fontVariant === undefined) this.fontVariant = inferFontVariant(scale);
      if (text === undefined) channels.text = inferTextChannel(scale, data, ticks, tickFormat, anchor);
    }
  );
}

function axisTextKx(
  k: any,
  anchor: any,
  data: any,
  {
    facetAnchor = anchor + (k === "x" ? "-empty" : ""),
    frameAnchor = anchor,
    tickSize,
    tickRotate = 0,
    tickPadding = Math.max(3, 9 - tickSize) + (Math.abs(tickRotate) >= 10 ? 4 * Math.cos(tickRotate * radians) : 0),
    text,
    textAnchor = Math.abs(tickRotate) >= 10
      ? ((tickRotate < 0) as any) ^ ((anchor === "bottom") as any)
        ? "start"
        : "end"
      : "middle",
    lineAnchor = Math.abs(tickRotate) >= 10 ? "middle" : anchor === "bottom" ? "top" : "bottom",
    fontVariant,
    inset = 0,
    insetTop = inset,
    insetBottom = inset,
    dy = 0,
    x = k === "x" ? undefined : null,
    ariaLabel,
    ...options
  }: any
): any {
  return axisMark(
    textX,
    k,
    data,
    {ariaLabel: `${ariaLabel} tick label`},
    {
      facetAnchor,
      frameAnchor,
      text: text === undefined ? null : text,
      textAnchor,
      lineAnchor,
      fontVariant,
      rotate: tickRotate,
      x,
      ...options,
      dy: anchor === "bottom" ? +dy + +tickSize + +tickPadding - insetBottom : +dy - tickSize - tickPadding + +insetTop
    },
    function (this: any, scale: any, data: any, ticks: any, tickFormat: any, channels: any) {
      if (fontVariant === undefined) this.fontVariant = inferFontVariant(scale);
      if (text === undefined) channels.text = inferTextChannel(scale, data, ticks, tickFormat, anchor);
    }
  );
}

export function gridY(data?: Data, options?: GridYOptions): RuleY;
export function gridY(options?: GridYOptions): RuleY;
export function gridY(...args: any[]): RuleY {
  const [data, options] = maybeData(...(args as [any, any]));
  return gridKy("y", anchorY(options), data, options);
}

export function gridFy(data?: Data, options?: GridYOptions): RuleY;
export function gridFy(options?: GridYOptions): RuleY;
export function gridFy(...args: any[]): RuleY {
  const [data, options] = maybeData(...(args as [any, any]));
  return gridKy("fy", anchorFy(options), data, options);
}

export function gridX(data?: Data, options?: GridXOptions): RuleX;
export function gridX(options?: GridXOptions): RuleX;
export function gridX(...args: any[]): RuleX {
  const [data, options] = maybeData(...(args as [any, any]));
  return gridKx("x", anchorX(options), data, options);
}

export function gridFx(data?: Data, options?: GridXOptions): RuleX;
export function gridFx(options?: GridXOptions): RuleX;
export function gridFx(...args: any[]): RuleX {
  const [data, options] = maybeData(...(args as [any, any]));
  return gridKx("fx", anchorFx(options), data, options);
}

function gridKy(
  k: any,
  anchor: any,
  data: any,
  {
    y = k === "y" ? undefined : null,
    x = null,
    x1 = anchor === "left" ? x : null,
    x2 = anchor === "right" ? x : null,
    ariaLabel = `${k}-grid`,
    ariaHidden = true,
    ...options
  }: any
): any {
  return axisMark(ruleY, k, data, {ariaLabel, ariaHidden}, {y, x1, x2, ...gridDefaults(options)});
}

function gridKx(
  k: any,
  anchor: any,
  data: any,
  {
    x = k === "x" ? undefined : null,
    y = null,
    y1 = anchor === "top" ? y : null,
    y2 = anchor === "bottom" ? y : null,
    ariaLabel = `${k}-grid`,
    ariaHidden = true,
    ...options
  }: any
): any {
  return axisMark(ruleX, k, data, {ariaLabel, ariaHidden}, {x, y1, y2, ...gridDefaults(options)});
}

function gridDefaults({
  color = "currentColor",
  opacity = 0.1,
  stroke = color,
  strokeOpacity = opacity,
  strokeWidth = 1,
  ...options
}: any): any {
  return {stroke, strokeOpacity, strokeWidth, ...options};
}

function labelOptions(
  {
    fill,
    fillOpacity,
    fontFamily,
    fontSize,
    fontStyle,
    fontVariant,
    fontWeight,
    monospace,
    pointerEvents,
    shapeRendering,
    clip = false
  }: any,
  initializer: any
): any {
  // Only propagate these options if constant.
  [, fill] = maybeColorChannel(fill);
  [, fillOpacity] = maybeNumberChannel(fillOpacity);
  return {
    facet: "super",
    x: null,
    y: null,
    fill,
    fillOpacity,
    fontFamily,
    fontSize,
    fontStyle,
    fontVariant,
    fontWeight,
    monospace,
    pointerEvents,
    shapeRendering,
    clip,
    initializer
  };
}

function axisMark(mark: any, k: any, data: any, properties: any, options: any, initialize?: any): any {
  let channels: any;

  function axisInitializer(
    this: any,
    data: any,
    facets: any,
    _channels: any,
    scales: any,
    dimensions: any,
    context: any
  ): any {
    const initializeFacets = data == null && (k === "fx" || k === "fy");
    const {[k]: scale} = scales;
    if (!scale) throw new Error(`missing scale: ${k}`);
    const domain = scale.domain();
    let {interval, ticks, tickFormat, tickSpacing = k === "x" ? 80 : 35} = options;
    // For a scale with a temporal domain, also allow the ticks to be specified
    // as a string which is promoted to a time interval. In the case of ordinal
    // scales, the interval is interpreted as UTC.
    if (typeof ticks === "string" && hasTemporalDomain(scale)) (interval = ticks), (ticks = undefined);
    // The interval axis option is an alternative method of specifying ticks;
    // for example, for a numeric scale, ticks = 5 means “about 5 ticks” whereas
    // interval = 5 means “ticks every 5 units”. (This is not to be confused
    // with the interval scale option, which affects the scale’s behavior!)
    // Lastly use the tickSpacing option to infer the desired tick count.
    if (ticks === undefined) ticks = maybeRangeInterval(interval, scale.type) ?? inferTickCount(scale, tickSpacing);
    if (data == null) {
      if (isIterable(ticks)) {
        // Use explicit ticks, if specified.
        data = arrayify(ticks);
      } else if (isInterval(ticks)) {
        // Use the tick interval, if specified.
        data = inclusiveRange(ticks, ...(extent(domain) as [any, any]));
      } else if (scale.interval) {
        // If the scale interval is a standard time interval such as "day", we
        // may be able to generalize the scale interval it to a larger aligned
        // time interval to create the desired number of ticks.
        let interval = scale.interval;
        if (scale.ticks) {
          const [min, max] = extent(domain) as [any, any];
          const n = (max - min) / interval[intervalDuration]; // current tick count
          // We don’t explicitly check that given interval is a time interval;
          // in that case the generalized interval will be undefined, just like
          // a nonstandard interval. TODO Generalize integer intervals, too.
          interval = generalizeTimeInterval(interval, n / ticks) ?? interval;
          data = inclusiveRange(interval, min, max);
        } else {
          data = domain;
          const n = data.length; // current tick count
          interval = generalizeTimeInterval(interval, n / ticks) ?? interval;
          if (interval !== scale.interval) data = inclusiveRange(interval, ...(extent(data) as [any, any]));
        }
        if (interval === scale.interval) {
          // If we weren’t able to generalize the scale’s interval, compute the
          // positive number n such that taking every nth value from the scale’s
          // domain produces as close as possible to the desired number of
          // ticks. For example, if the domain has 100 values and 5 ticks are
          // desired, n = 20.
          const n = Math.round(data.length / ticks);
          if (n > 1) data = data.filter((d: any, i: any) => i % n === 0);
        }
      } else if (scale.ticks) {
        data = scale.ticks(ticks);
      } else {
        // For ordinal scales, the domain will already be generated using the
        // scale’s interval, if any.
        data = domain;
      }
      if (!scale.ticks && data.length && data !== domain) {
        // For ordinal scales, intersect the ticks with the scale domain since
        // the scale is only defined on its domain. If all of the ticks are
        // removed, then warn that the ticks and scale domain may be misaligned
        // (e.g., "year" ticks and "4 weeks" interval).
        const domainSet = new InternSet(domain);
        data = data.filter((d: any) => domainSet.has(d));
        if (!data.length) warn(`Warning: the ${k}-axis ticks appear to not align with the scale domain, resulting in no ticks. Try different ticks?`); // prettier-ignore
      }
      if (k === "y" || k === "x") {
        facets = [range(data)];
      } else {
        channels[k] = {scale: k, value: identity};
      }
    }
    initialize?.call(this, scale, data, ticks, tickFormat, channels);
    const initializedChannels = Object.fromEntries(
      Object.entries(channels).map(([name, channel]: any) => {
        return [name, {...channel, value: valueof(data, channel.value)}];
      })
    );
    if (initializeFacets) facets = context.filterFacets(data, initializedChannels);
    return {data, facets, channels: initializedChannels};
  }

  // Apply any basic initializers after the axis initializer computes the ticks.
  const basicInitializer = (initializer as any)(options).initializer;
  const m = mark(data, (initializer as any)({...options, initializer: axisInitializer}, basicInitializer));
  if (data == null) {
    channels = m.channels;
    m.channels = {};
  } else {
    channels = {};
  }
  if (properties !== undefined) Object.assign(m, properties);
  if (m.clip === undefined) m.clip = false; // don’t clip axes by default
  return m;
}

function inferTickCount(scale: any, tickSpacing: any): any {
  const [min, max] = extent(scale.range()) as [any, any];
  return (max - min) / tickSpacing;
}

function inferTextChannel(scale: any, data: any, ticks: any, tickFormat: any, anchor: any): any {
  return {value: inferTickFormat(scale, data, ticks, tickFormat, anchor)};
}

// D3’s ordinal scales simply use toString by default, but if the ordinal scale
// domain (or ticks) are numbers or dates (say because we’re applying a time
// interval to the ordinal scale), we want Plot’s default formatter. And for
// time ticks, we want to use the multi-line time format (e.g., Jan 26) if
// possible, or the default ISO format (2014-01-26). TODO We need a better way
// to infer whether the ordinal scale is UTC or local time.
export function inferTickFormat(scale: any, data: any, ticks: any, tickFormat: any, anchor: any): any {
  return typeof tickFormat === "function" && !(scale.type === "log" && scale.tickFormat)
    ? tickFormat
    : tickFormat === undefined && data && isTemporal(data)
    ? inferTimeFormat(scale.type, data, anchor) ?? formatDefault
    : scale.tickFormat
    ? scale.tickFormat(typeof ticks === "number" ? ticks : null, tickFormat)
    : typeof tickFormat === "string" && scale.domain().length > 0
    ? (isTemporal(scale.domain()) ? utcFormat : format)(tickFormat)
    : tickFormat === undefined
    ? formatDefault
    : constant(tickFormat);
}

function inclusiveRange(interval: any, min: any, max: any): any {
  return interval.range(min, interval.offset(interval.floor(max)));
}

const shapeTickBottom = {
  draw(context: any, l: any) {
    context.moveTo(0, 0);
    context.lineTo(0, l);
  }
};

const shapeTickTop = {
  draw(context: any, l: any) {
    context.moveTo(0, 0);
    context.lineTo(0, -l);
  }
};

const shapeTickLeft = {
  draw(context: any, l: any) {
    context.moveTo(0, 0);
    context.lineTo(-l, 0);
  }
};

const shapeTickRight = {
  draw(context: any, l: any) {
    context.moveTo(0, 0);
    context.lineTo(l, 0);
  }
};

// TODO Unify this with the other inferFontVariant; here we only have a scale
// function rather than a scale descriptor.
function inferFontVariant(scale: any): any {
  return scale.bandwidth && !scale.interval ? undefined : "tabular-nums";
}

// Takes the scale label, and if this is not an ordinal scale and the label was
// inferred from an associated channel, adds an orientation-appropriate arrow.
function formatAxisLabel(k: any, scale: any, {anchor, label = scale.label, labelAnchor, labelArrow}: any = {}): any {
  if (label == null || (label.inferred && hasTemporalDomain(scale) && /^(date|time|year)$/i.test(label))) return;
  label = String(label); // coerce to a string after checking if inferred
  if (labelArrow === "auto") labelArrow = (!scale.bandwidth || scale.interval) && !/[↑↓→←]/.test(label);
  if (!labelArrow) return label;
  if (labelArrow === true) {
    const order = inferScaleOrder(scale);
    if (order)
      labelArrow =
        /x$/.test(k) || labelAnchor === "center"
          ? /x$/.test(k) === order < 0
            ? "left"
            : "right"
          : order < 0
          ? "up"
          : "down";
  }
  switch (labelArrow) {
    case "left":
      return `← ${label}`;
    case "right":
      return `${label} →`;
    case "up":
      return anchor === "right" ? `${label} ↑` : `↑ ${label}`;
    case "down":
      return anchor === "right" ? `${label} ↓` : `↓ ${label}`;
  }
  return label;
}

function maybeLabelArrow(labelArrow: any = "auto"): any {
  return isNoneish(labelArrow)
    ? false
    : typeof labelArrow === "boolean"
    ? labelArrow
    : keyword(labelArrow, "labelArrow", ["auto", "up", "right", "down", "left"]);
}

function hasTemporalDomain(scale: any): any {
  return isTemporal(scale.domain());
}
