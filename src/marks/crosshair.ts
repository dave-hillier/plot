// renderJSX delegation: Crosshair has no Mark subclass; the `crosshair`,
// `crosshairX`, and `crosshairY` factories return a CompoundMark composed of
// `ruleX`/`ruleY` (Rule) and `text` (Text) sub-marks. Each sub-mark provides
// its own `renderJSX` via its respective Mark class (Rule from the Phase 0
// pilot; Text from Phase 1 unit 7), so JSX rendering of a crosshair is the
// natural composition of its sub-marks' `renderJSX` outputs and requires no
// dedicated implementation here.

import type {ChannelValueSpec} from "../channel.js";
// @ts-ignore -- getSource is declared only in channel.js, not channel.d.ts
import {getSource} from "../channel.js";
import {pointer, pointerX, pointerY} from "../interactions/pointer.js";
import type {CompoundMark, Data, MarkOptions} from "../mark.js";
import {marks} from "../mark.js";
import {initializer} from "../transforms/basic.js";
import {ruleX, ruleY} from "./rule.js";
import {text} from "./text.js";

/** Options for the crosshair mark. */
export interface CrosshairOptions extends MarkOptions {
  /**
   * The horizontal position channel specifying the crosshair’s center,
   * typically bound to the *x* scale.
   */
  x?: ChannelValueSpec;

  /**
   * The vertical position channel specifying the crosshair’s center, typically
   * bound to the *y* scale.
   */
  y?: ChannelValueSpec;

  /**
   * The maximum radius in pixels to determine whether to render the crosshair
   * for closest point; if no point is within this radius to the pointer, the
   * crosshair will be hidden. Defaults to 40 pixels. On crosshairX and
   * crosshairY, only the *x* and *y* distance is considered, respectively.
   */
  maxRadius?: number;

  /**
   * A shorthand for setting both **ruleStroke** and **textFill**; affects the
   * stroke of rules and the fill of texts; defaults to *currentColor*.
   */
  color?: MarkOptions["stroke"];

  /** A shorthand for setting **ruleStrokeOpacity**; defaults to 0.2. */
  opacity?: MarkOptions["opacity"];

  /** The rule **stroke**; defaults to **color**. */
  ruleStroke?: MarkOptions["stroke"];

  /** The rule **strokeOpacity**; defaults to 0.2. */
  ruleStrokeOpacity?: MarkOptions["strokeOpacity"];

  /** The rule **strokeWidth**; defaults to 1. */
  ruleStrokeWidth?: MarkOptions["strokeWidth"];

  /** The text **fill**; defaults to **color**. */
  textFill?: MarkOptions["fill"];

  /** The text **stroke**; defaults to *white* to improve legibility. */
  textStroke?: MarkOptions["stroke"];

  /** The text **strokeOpacity**; defaults to 1. */
  textStrokeOpacity?: MarkOptions["strokeOpacity"];

  /** The text **strokeWidth**; defaults to 5. */
  textStrokeWidth?: MarkOptions["strokeWidth"];
}

/**
 * Returns a new crosshair mark for the given *data* and *options*, drawing
 * horizontal and vertical rules centered at the point closest to the pointer.
 * The corresponding **x** and **y** values are also drawn just outside the
 * bottom and left sides of the frame, respectively, typically on top of the
 * axes. If either **x** or **y** is not specified, the crosshair will be
 * one-dimensional.
 */
export function crosshair(data?: Data, options?: CrosshairOptions): CompoundMark {
  return crosshairK(pointer, data, options);
}

/**
 * Like crosshair, but uses the pointerX transform: the determination of the
 * closest point is heavily weighted by the *x* (horizontal↔︎) position; this
 * should be used for plots where *x* represents the independent variable, such
 * as time in a time-series chart, or the aggregated dimension when grouping or
 * binning.
 */
export function crosshairX(data?: Data, options: CrosshairOptions = {}): CompoundMark {
  return crosshairK(pointerX, data, options);
}

/**
 * Like crosshair, but uses the pointerY transform: the determination of the
 * closest point is heavily weighted by the *y* (vertical↕︎) position; this
 * should be used for plots where *y* represents the independent variable, such
 * as time in a time-series chart, or the aggregated dimension when grouping or
 * binning.
 */
export function crosshairY(data?: Data, options: CrosshairOptions = {}): CompoundMark {
  return crosshairK(pointerY, data, options);
}

function crosshairK(pointer: any, data?: Data, options: CrosshairOptions = {}): CompoundMark {
  const {x, y, maxRadius} = options;
  const p = pointer({px: x, py: y, maxRadius});
  const M = [];
  if (x != null) M.push(ruleX(data, ruleOptions("x", {...p, inset: -6}, options)));
  if (y != null) M.push(ruleY(data, ruleOptions("y", {...p, inset: -6}, options)));
  if (x != null) M.push(text(data, textOptions("x", {...p, dy: 9, frameAnchor: "bottom", lineAnchor: "top"}, options)));
  if (y != null) M.push(text(data, textOptions("y", {...p, dx: -9, frameAnchor: "left", textAnchor: "end"}, options)));
  for (const m of M) m.ariaLabel = `crosshair ${m.ariaLabel}`;
  return marks(...M);
}

function markOptions(
  k: any,
  {channels: pointerChannels, ...pointerOptions}: any,
  {facet, facetAnchor, fx, fy, [k]: p, channels, transform, initializer}: any
) {
  return {
    ...pointerOptions,
    facet,
    facetAnchor,
    fx,
    fy,
    [k]: p,
    channels: {...pointerChannels, ...channels},
    transform,
    initializer: pxpy(k, initializer)
  };
}

// Wrap the initializer, if any, mapping px and py to x and y temporarily (e.g.,
// for hexbin) then mapping back to px and py for rendering.
function pxpy(k: any, i: any) {
  if (i == null) return i;
  return function (this: any, data: any, facets: any, {x: x1, y: y1, px, py, ...c1}: any, ...args: any[]) {
    const {channels: {x, y, ...c} = {}, ...rest} = i.call(this, data, facets, {...c1, x: px, y: py}, ...args);
    return {
      channels: {
        ...c,
        ...(x && {px: x, ...(k === "x" && {x})}),
        ...(y && {py: y, ...(k === "y" && {y})})
      },
      ...rest
    };
  };
}

function ruleOptions(k: any, pointerOptions: any, options: any) {
  const {
    color = "currentColor",
    opacity = 0.2,
    ruleStroke: stroke = color,
    ruleStrokeOpacity: strokeOpacity = opacity,
    ruleStrokeWidth: strokeWidth
  } = options;
  return {
    ...markOptions(k, pointerOptions, options),
    stroke,
    strokeOpacity,
    strokeWidth
  };
}

function textOptions(k: any, pointerOptions: any, options: any) {
  const {
    color = "currentColor",
    textFill: fill = color,
    textFillOpacity: fillOpacity,
    textStroke: stroke = "var(--plot-background)",
    textStrokeOpacity: strokeOpacity,
    textStrokeWidth: strokeWidth = 5
  } = options;
  return {
    ...markOptions(k, pointerOptions, textChannel(k, options)),
    fill,
    fillOpacity,
    stroke,
    strokeOpacity,
    strokeWidth
  };
}

// Rather than aliasing text to have the same definition as x and y, we use an
// initializer to alias the channel values, such that the text channel can be
// derived by an initializer such as hexbin.
function textChannel(source: any, options: any) {
  return initializer(options, (data: any, facets: any, channels: any) => {
    return {channels: {text: {value: getSource(channels, source)?.value}}};
  });
}
