import {ascending, InternSet} from "d3";
import type {ChannelValue} from "../channel.js";
import type {CompoundMark, Data} from "../mark.js";
import {marks} from "../mark.js";
// @ts-expect-error -- some symbols are declared only in options.js, not options.d.ts
import {isColor, isNumeric, isObject, isOptions, isOrdinal, labelof, valueof} from "../options.js";
import type {Reducer} from "../reducer.js";
import type {BinOptions} from "../transforms/bin.js";
import {bin, binX, binY} from "../transforms/bin.js";
import {group, groupX, groupY} from "../transforms/group.js";
import {areaX, areaY} from "./area.js";
import {barX, barY} from "./bar.js";
import {cell} from "./cell.js";
import {dot} from "./dot.js";
import {frame} from "./frame.js";
import {line, lineX, lineY} from "./line.js";
import {rect, rectX, rectY} from "./rect.js";
import {ruleX, ruleY} from "./rule.js";

/** Options for the auto mark. */
export interface AutoOptions {
  /**
   * The horizontal position channel (**value**) and reducer (**reduce**).
   *
   * The **x** channel is required if a **y** channel is not specified;
   * otherwise it is optional.
   *
   * If an **x** **reduce** is specified, a **y** channel is required and a
   * **y** reduce is not allowed; the **y** channel will be grouped, and the
   * reducer will be applied to each group’s associated **x** channel values (if
   * any). If a **y** channel is set, but no **x** channel, the **x** **reduce**
   * defaults to *count* to produce a histogram by grouping on **y**; disable
   * this by setting the **x** **reduce** to null.
   *
   * The **zero** option, if true, draws a vertical rule at *x* = 0, and ensures
   * that the default *x* scale domain includes 0.
   */
  x?: ChannelValue | Reducer | ({value?: ChannelValue; reduce?: Reducer | null; zero?: boolean} & BinOptions);

  /**
   * The vertical position channel (**value**) and reducer (**reduce**).
   *
   * The **y** channel is required if an **x** channel is not specified;
   * otherwise it is optional.
   *
   * If a **y** **reduce** is specified, an **x** channel is required, and an
   * **x** reduce is not allowed; the **x** channel will be grouped, and the
   * reducer will be applied to each group’s associated **y** channel values (if
   * any). If a **x** channel is set, but no **y** channel, the **y** **reduce**
   * defaults to *count* to produce a histogram by grouping on **x**; disable
   * this by setting the **y** **reduce** to null.
   *
   * The **zero** option, if true, draws a horizontal rule at *y* = 0, and
   * ensures that the default *y* scale domain includes 0.
   */
  y?: ChannelValue | Reducer | ({value?: ChannelValue; reduce?: Reducer | null; zero?: boolean} & BinOptions);

  /**
   * The color channel (**value**) and reducer (**reduce**), or a constant color
   * such as *red* for aesthetics (**color**). This option corresponds to the
   * **stroke** channel for dots, lines, and rules, and the **fill** channel for
   * areas and bars. If a color channel or reducer is specified, the constant
   * color is ignored.
   *
   * If neither a **x** nor **y** **reduce** is specified, but a **color**
   * **reduce** is specified, both the **x** and **y** channels (if any) will be
   * grouped, and the reducer will be applied to each group’s associated
   * **color** channel values (if any), say to produce a heatmap.
   */
  color?: ChannelValue | Reducer | {value?: ChannelValue; reduce?: Reducer | null; color?: string};

  /**
   * The size channel (**value**) and reducer (**reduce**). This option
   * corresponds to the **r** channel for dots; it may correspond to the
   * **length** of vectors in the future.
   *
   * If neither a **x** nor **y** **reduce** is specified, but a **size**
   * **reduce** is specified, both the **x** and **y** channels (if any) will be
   * grouped, and the reducer will be applied to each group’s associated
   * **size** channel values (if any), say to produce a binned scatterplot.
   */
  size?: ChannelValue | Reducer | {value?: ChannelValue; reduce?: Reducer | null};

  /**
   * The horizontal facet position channel (**value**), for mark-level faceting,
   * bound to the *fx* scale.
   */
  fx?: ChannelValue | {value?: ChannelValue};

  /**
   * The vertical facet position channel (**value**), for mark-level faceting,
   * bound to the *fy* scale.
   */
  fy?: ChannelValue | {value?: ChannelValue};

  /**
   * The desired mark type; one of:
   *
   * - *area* - an area
   * - *bar* - a rect, cell, or bar (depending on the data type)
   * - *dot* - a dot
   * - *line* - a line
   * - *rule* - a rule
   *
   * Whenever possible, avoid setting the mark type; the default mark type
   * should usually suffice, and setting an explicit mark type may lead to a
   * nonsensical plot (especially if you change other options).
   */
  mark?: "area" | "bar" | "dot" | "line" | "rule";
}

/**
 * An auto options object with nothing left undefined, as returned by
 * Plot.autoSpec; the mark type, reducers, and other options will be populated.
 */
export interface AutoSpec extends AutoOptions {
  x: {value: ChannelValue; reduce: Reducer | null; zero: boolean} & BinOptions;
  y: {value: ChannelValue; reduce: Reducer | null; zero: boolean} & BinOptions;
  color: {value: ChannelValue; reduce: Reducer | null; color?: string};
  size: {value: ChannelValue; reduce: Reducer | null};
  fx: ChannelValue;
  fy: ChannelValue;
  mark: NonNullable<AutoOptions["mark"]>;
}

/**
 * Returns a fully-specified *options* object for the auto mark, with nothing
 * left undefined. This is mostly for internal use, but can be used to “lock
 * down” the specification of an auto mark or to interrogate its behavior. For
 * example, if you say
 *
 * ```js
 * Plot.autoSpec(penguins, {x: "body_mass_g"})
 * ```
 *
 * the returned object will have **y** set to {value: null, reduce: *count*} and
 * **mark** set to *bar*, telling you that a histogram will be rendered.
 */
export function autoSpec(data?: Data, options?: AutoOptions): AutoSpec {
  options = normalizeOptions(options) as AutoOptions;

  // Greedily materialize columns for type inference; we’ll need them anyway to
  // plot! Note that we don’t apply any type inference to the fx and fy
  // channels, if present; these are always ordinal (at least for now).
  const {x, y, color, size}: any = options;
  const X = materializeValue(data, x);
  const Y = materializeValue(data, y);
  const C = materializeValue(data, color);
  const S = materializeValue(data, size);

  // Compute the default options.
  const {
    fx,
    fy,
    x: {value: xValue, reduce: xReduceOption, zero: xZeroOption, ...xOptions},
    y: {value: yValue, reduce: yReduceOption, zero: yZeroOption, ...yOptions},
    color: {value: colorValue, color: colorColor, reduce: colorReduce},
    size: {value: sizeValue, reduce: sizeReduceOption}, // TODO constant radius?
    mark: markOption
  }: any = options;
  let xReduce = xReduceOption;
  let yReduce = yReduceOption;
  let xZero = xZeroOption;
  let yZero = yZeroOption;
  let sizeReduce = sizeReduceOption;
  let mark = markOption;

  // Determine the default reducer, if any.
  if (xReduce === undefined)
    xReduce = yReduce == null && xValue == null && sizeValue == null && yValue != null ? "count" : null;
  if (yReduce === undefined)
    yReduce = xReduce == null && yValue == null && sizeValue == null && xValue != null ? "count" : null;

  // Determine the default size reducer, if any.
  if (
    sizeReduce === undefined &&
    sizeValue == null &&
    colorReduce == null &&
    xReduce == null &&
    yReduce == null &&
    (xValue == null || isOrdinal(X)) &&
    (yValue == null || isOrdinal(Y))
  ) {
    sizeReduce = "count";
  }

  // Determine the default zero-ness.
  if (xZero === undefined) xZero = isZeroReducer(xReduce) ? true : undefined;
  if (yZero === undefined) yZero = isZeroReducer(yReduce) ? true : undefined;

  // TODO Shorthand: array of primitives should result in a histogram
  if (xValue == null && yValue == null) throw new Error("must specify x or y");
  if (xReduce != null && yValue == null) throw new Error("reducing x requires y");
  if (yReduce != null && xValue == null) throw new Error("reducing y requires x");

  // Determine the default mark type.
  if (mark === undefined) {
    mark =
      sizeValue != null || sizeReduce != null
        ? "dot"
        : isZeroReducer(xReduce) || isZeroReducer(yReduce) || colorReduce != null // histogram or heatmap
        ? "bar"
        : xValue != null && yValue != null
        ? isOrdinal(X) || isOrdinal(Y) || (xReduce == null && yReduce == null && !isMonotonic(X) && !isMonotonic(Y))
          ? "dot"
          : "line"
        : xValue != null || yValue != null
        ? "rule"
        : null;
  }

  let Z: any; // may be set to null to disable series-by-color for line and area
  let colorMode: any; // "fill" or "stroke"

  // Determine the mark implementation.
  let markImpl: any;
  switch (mark) {
    case "dot":
      markImpl = dot;
      colorMode = "stroke";
      break;
    case "line":
      markImpl =
        (X && Y) || xReduce != null || yReduce != null // same logic as area (see below), but default to line
          ? yZero || yReduce != null || (X && isMonotonic(X))
            ? lineY
            : xZero || xReduce != null || (Y && isMonotonic(Y))
            ? lineX
            : line
          : X // 1d line by index
          ? lineX
          : lineY;
      colorMode = "stroke";
      if (isHighCardinality(C)) Z = null; // TODO only if z not set by user
      break;
    case "area":
      markImpl = !(yZero || yReduce != null) && (xZero || xReduce != null || (Y && isMonotonic(Y))) ? areaX : areaY; // favor areaY if unsure
      colorMode = "fill";
      if (isHighCardinality(C)) Z = null; // TODO only if z not set by user
      break;
    case "rule":
      markImpl = X ? ruleX : ruleY;
      colorMode = "stroke";
      break;
    case "bar":
      markImpl =
        xReduce != null // bin or group on y
          ? isOrdinal(Y)
            ? isSelectReducer(xReduce) && X && isOrdinal(X)
              ? cell
              : barX
            : rectX
          : yReduce != null // bin or group on x
          ? isOrdinal(X)
            ? isSelectReducer(yReduce) && Y && isOrdinal(Y)
              ? cell
              : barY
            : rectY
          : colorReduce != null || sizeReduce != null // bin or group on both x and y
          ? X && isOrdinal(X) && Y && isOrdinal(Y)
            ? cell
            : X && isOrdinal(X)
            ? barY
            : Y && isOrdinal(Y)
            ? barX
            : rect
          : X && isNumeric(X) && !(Y && isNumeric(Y))
          ? barX // if y is temporal, treat as ordinal
          : Y && isNumeric(Y) && !(X && isNumeric(X))
          ? barY // if x is temporal, treat as ordinal
          : cell;
      colorMode = "fill";
      break;
    default:
      throw new Error(`invalid mark: ${mark}`);
  }

  // Determine the mark options.
  const markOptions: any = {
    fx,
    fy,
    x: X ?? undefined, // treat null x as undefined for implicit stack
    y: Y ?? undefined, // treat null y as undefined for implicit stack
    [colorMode]: C ?? colorColor,
    z: Z,
    r: S ?? undefined, // treat null size as undefined for default constant radius
    tip: true
  };
  let transformImpl: any;
  const transformOptions: any = {[colorMode]: colorReduce ?? undefined, r: sizeReduce ?? undefined};
  if (xReduce != null && yReduce != null) {
    throw new Error(`cannot reduce both x and y`); // for now at least
  } else if (yReduce != null) {
    transformOptions.y = yReduce;
    transformImpl = isOrdinal(X) ? groupX : binX;
  } else if (xReduce != null) {
    transformOptions.x = xReduce;
    transformImpl = isOrdinal(Y) ? groupY : binY;
  } else if (colorReduce != null || sizeReduce != null) {
    if (X && Y) {
      transformImpl = isOrdinal(X) && isOrdinal(Y) ? group : isOrdinal(X) ? binY : isOrdinal(Y) ? binX : bin;
    } else if (X) {
      transformImpl = isOrdinal(X) ? groupX : binX;
    } else if (Y) {
      transformImpl = isOrdinal(Y) ? groupY : binY;
    }
  }

  // When using the bin transform, pass through additional options (e.g., thresholds).
  if (transformImpl === bin || transformImpl === binX) markOptions.x = {value: X, ...xOptions};
  if (transformImpl === bin || transformImpl === binY) markOptions.y = {value: Y, ...yOptions};

  // If zero-ness is not specified, default based on whether the resolved mark
  // type will include a zero baseline.
  if (xZero === undefined)
    xZero =
      X &&
      !(transformImpl === bin || transformImpl === binX) &&
      (markImpl === barX || markImpl === areaX || markImpl === rectX || markImpl === ruleY);
  if (yZero === undefined)
    yZero =
      Y &&
      !(transformImpl === bin || transformImpl === binY) &&
      (markImpl === barY || markImpl === areaY || markImpl === rectY || markImpl === ruleX);

  return {
    fx: fx ?? null,
    fy: fy ?? null,
    x: {
      value: xValue ?? null,
      reduce: xReduce ?? null,
      zero: !!xZero,
      ...xOptions
    },
    y: {
      value: yValue ?? null,
      reduce: yReduce ?? null,
      zero: !!yZero,
      ...yOptions
    },
    color: {
      value: colorValue ?? null,
      reduce: colorReduce ?? null,
      ...(colorColor !== undefined && {color: colorColor})
    },
    size: {
      value: sizeValue ?? null,
      reduce: sizeReduce ?? null
    },
    mark,
    markImpl: implNames[markImpl],
    markOptions,
    transformImpl: implNames[transformImpl],
    transformOptions,
    colorMode
  } as any;
}

/**
 * Returns a new mark whose implementation is chosen dynamically to best
 * represent the dimensions of the given *data* specified in *options*,
 * according to a few simple heuristics. The auto mark seeks to provide a useful
 * initial plot as quickly as possible through opinionated defaults, and to
 * accelerate exploratory analysis by letting you refine views with minimal
 * changes to code. For example, for a histogram of penguins binned by weight:
 *
 * ```js
 * Plot.auto(penguins, {x: "body_mass_g"})
 * ```
 *
 * JSX rendering note: the auto mark is a compound mark — it does not render
 * itself. Instead, it inspects the data and options to choose an appropriate
 * underlying mark implementation (for example {@link dot}, {@link line},
 * {@link barX}, {@link rectY}, etc.) along with optional {@link frame} and
 * {@link ruleX}/{@link ruleY} decorations, and returns the resulting marks
 * array. JSX (React) rendering is therefore delegated entirely to the chosen
 * sub-marks via their own `renderJSX` methods; auto itself has no
 * `renderJSX` method and contributes no SVG output of its own.
 */
export function auto(data?: Data, options?: AutoOptions): CompoundMark {
  const spec: any = autoSpec(data, options);
  const {
    fx,
    fy,
    x: {zero: xZero},
    y: {zero: yZero},
    markOptions,
    transformOptions,
    colorMode
  } = spec;
  const markImpl = (impls as any)[spec.markImpl];
  const transformImpl = (impls as any)[spec.transformImpl];
  // In the case of filled marks (particularly bars and areas) the frame and
  // rules should come after the mark; in the case of stroked marks
  // (particularly dots and lines) they should come before the mark.
  const frames = fx != null || fy != null ? frame({strokeOpacity: 0.1}) : null;
  const rules = [xZero ? ruleX([0]) : null, yZero ? ruleY([0]) : null];
  const mark = markImpl(data, transformImpl ? transformImpl(transformOptions, markOptions) : markOptions);
  return colorMode === "stroke" ? marks(frames, rules, mark) : marks(frames, mark, rules);
}

// TODO What about sorted within series?
function isMonotonic(values: any) {
  let previous;
  let previousOrder;
  for (const value of values) {
    if (value == null) continue;
    if (previous === undefined) {
      previous = value;
      continue;
    }
    const order = Math.sign(ascending(previous, value));
    if (!order) continue; // skip zero, NaN
    if (previousOrder !== undefined && order !== previousOrder) return false;
    previous = value;
    previousOrder = order;
  }
  return true;
}

// Allow x and y and other dimensions to be specified as shorthand field names
// (but note that they can also be specified as a {transform} object such as
// Plot.identity). We don’t support reducers for the faceting, but for symmetry
// with x and y we allow facets to be specified as {value} objects.
function normalizeOptions({x, y, color, size, fx, fy, mark}: any = {}) {
  if (!isOptions(x)) x = makeOptions(x);
  if (!isOptions(y)) y = makeOptions(y);
  if (!isOptions(color)) color = isColor(color) ? {color} : makeOptions(color);
  if (!isOptions(size)) size = makeOptions(size);
  if (isOptions(fx)) ({value: fx} = makeOptions(fx));
  if (isOptions(fy)) ({value: fy} = makeOptions(fy));
  if (mark != null) mark = `${mark}`.toLowerCase();
  return {x, y, color, size, fx, fy, mark};
}

// To apply heuristics based on the data types (values), realize the columns. We
// could maybe look at the data.schema here, but Plot’s behavior depends on the
// actual values anyway, so this probably is what we want.
function materializeValue(data: any, options: any) {
  const V = valueof(data, options.value);
  if (V) (V as any).label = labelof(options.value);
  return V;
}

function makeOptions(value: any) {
  return isReducer(value) ? {reduce: value} : {value};
}

// The distinct, count, sum, and proportion reducers are additive (stackable).
function isZeroReducer(reduce: any) {
  return /^(?:distinct|count|sum|proportion)$/i.test(reduce);
}

// The first, last, and mode reducers preserve the type of the aggregated values.
function isSelectReducer(reduce: any) {
  return /^(?:first|last|mode)$/i.test(reduce);
}

// https://github.com/observablehq/plot/blob/818562649280e155136f730fc496e0b3d15ae464/src/transforms/group.js#L236
function isReducer(reduce: any) {
  if (reduce == null) return false;
  if (typeof reduce.reduceIndex === "function") return true;
  if (typeof reduce.reduce === "function" && isObject(reduce)) return true; // N.B. array.reduce
  if (/^p\d{2}$/i.test(reduce)) return true;
  switch (`${reduce}`.toLowerCase()) {
    case "first":
    case "last":
    case "count":
    case "distinct":
    case "sum":
    case "proportion":
    case "proportion-facet": // TODO remove me?
    case "deviation":
    case "min":
    case "min-index": // TODO remove me?
    case "max":
    case "max-index": // TODO remove me?
    case "mean":
    case "median":
    case "variance":
    case "mode":
      // These are technically reducers, but I think we’d want to treat them as fields?
      // case "x":
      // case "x1":
      // case "x2":
      // case "y":
      // case "y1":
      // case "y2":
      return true;
  }
  return false;
}

function isHighCardinality(value: any) {
  return value ? new InternSet(value).size > value.length >> 1 : false;
}

const impls = {
  dot,
  line,
  lineX,
  lineY,
  areaX,
  areaY,
  ruleX,
  ruleY,
  barX,
  barY,
  rect,
  rectX,
  rectY,
  cell,
  bin,
  binX,
  binY,
  group,
  groupX,
  groupY
};

// Instead of returning the mark or transform implementation directly, we return
// the implementation name to facilitate code compilation (“eject to explicit
// marks”). An implementation-to-name mapping needs to live somewhere for
// compilation, and by having it in Plot we can more easily introduce a new mark
// or transform implementation in Plot.auto without having to synchronize a
// downstream change in the compiler.
const implNames: any = Object.fromEntries(Object.entries(impls).map(([name, impl]) => [impl, name]));
