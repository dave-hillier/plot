import {createElement as h, type ReactNode} from "react";
import type {ChannelValue, ChannelValueSpec} from "../channel.js";
// @ts-ignore - internal helper not in .d.ts
import {create} from "../context.js";
import {indirectStyleProps, directStyleProps, transformProp, groupChannelStyleProps} from "../react/styles.js";
import {withHrefWrap, withTitleChild} from "../react/styles-jsx.js";
import type {CurveOptions} from "../curve.js";
import type {CompoundMark, Data, MarkOptions} from "../mark.js";
import {marks} from "../mark.js";
// @ts-ignore - internal helpers not in .d.ts
import {composeRender, withTip} from "../mark.js";
import {identity, indexOf} from "../options.js";
// @ts-ignore - internal helpers not in .d.ts
import {isNoneish, labelof, maybeColorChannel, maybeValue, valueof} from "../options.js";
// @ts-ignore - internal helper not in .d.ts
import {inferScaleOrder} from "../scales.js";
// @ts-ignore - internal helper not in .d.ts
import {getClipId} from "../style.js";
import {area} from "./area.js";
import {line} from "./line.js";

/** Options for the difference mark. */
export interface DifferenceOptions extends MarkOptions, CurveOptions {
  /**
   * The comparison horizontal position channel, typically bound to the *x*
   * scale; if not specified, **x** is used. For differenceX, defaults to zero
   * if only one *x* and *y* channel is specified.
   */
  x1?: ChannelValueSpec;

  /**
   * The primary horizontal position channel, typically bound to the *x* scale;
   * if not specified, **x1** is used.
   */
  x2?: ChannelValueSpec;

  /** The horizontal position channel, typically bound to the *x* scale. */
  x?: ChannelValueSpec;

  /**
   * The comparison vertical position channel, typically bound to the *y* scale;
   * if not specified, **y** is used. For differenceY, defaults to zero if only
   * one *x* and *y* channel is specified.
   */
  y1?: ChannelValueSpec;

  /**
   * The primary vertical position channel, typically bound to the *y* scale;
   * if not specified, **y1** is used.
   */
  y2?: ChannelValueSpec;

  /** The vertical position channel, typically bound to the *y* scale. */
  y?: ChannelValueSpec;

  /**
   * The fill color when the primary value is greater than the secondary value;
   * defaults to green.
   */
  positiveFill?: ChannelValueSpec;

  /**
   * The fill color when the primary value is less than the secondary value;
   * defaults to blue.
   */
  negativeFill?: ChannelValueSpec;

  /** The fill opacity; defaults to 1. */
  fillOpacity?: number;

  /**
   * The fill opacity when the primary value is greater than the secondary
   * value; defaults to **fillOpacity**.
   */
  positiveFillOpacity?: number;

  /**
   * The fill opacity when the primary value is less than the secondary value;
   * defaults to **fillOpacity**.
   */
  negativeFillOpacity?: number;

  /**
   * An optional ordinal channel for grouping data into series to be drawn as
   * separate areas; defaults to **stroke**, if a channel.
   */
  z?: ChannelValue;
}

/**
 * Returns a new horizontal difference mark for the given the specified *data*
 * and *options*, as in a time-series chart where time goes down↓ (or up↑).
 *
 * The mark is a composite of a positive area, negative area, and line. The
 * positive area extends from the left of the frame to the line, and is clipped
 * by the area extending from the comparison to the right of the frame. The
 * negative area conversely extends from the right of the frame to the line, and
 * is clipped by the area extending from the comparison to the left of the
 * frame.
 */
export function differenceX(data?: Data, options?: DifferenceOptions): CompoundMark {
  return differenceK("x", data, options);
}

/**
 * Returns a new vertical difference mark for the given the specified *data* and
 * *options*, as in a time-series chart where time goes right→ (or ←left).
 *
 * The mark is a composite of a positive area, negative area, and line. The
 * positive area extends from the bottom of the frame to the line, and is
 * clipped by the area extending from the comparison to the top of the frame.
 * The negative area conversely extends from the top of the frame to the line,
 * and is clipped by the area extending from the comparison to the bottom of the
 * frame.
 */
export function differenceY(data?: Data, options?: DifferenceOptions): CompoundMark {
  return differenceK("y", data, options);
}

function differenceK(
  k: "x" | "y",
  data: Data | undefined,
  {
    x1,
    x2,
    y1,
    y2,
    x = x1 === undefined && x2 === undefined ? (k === "y" ? indexOf : identity) : undefined,
    y = y1 === undefined && y2 === undefined ? (k === "x" ? indexOf : identity) : undefined,
    fill, // ignored
    positiveFill = "#3ca951",
    negativeFill = "#4269d0",
    fillOpacity = 1,
    positiveFillOpacity = fillOpacity,
    negativeFillOpacity = fillOpacity,
    stroke,
    strokeOpacity,
    z = maybeColorChannel(stroke)[0],
    clip, // optional additional clip for area
    tip,
    render,
    ...options
  }: any = {}
): CompoundMark {
  [x1, x2] = memoTuple(x, x1, x2);
  [y1, y2] = memoTuple(y, y1, y2);
  if (x1 === x2 && y1 === y2) {
    if (k === "y") y1 = memo(0);
    else x1 = memo(0);
  }
  ({tip} = withTip({tip}, k === "y" ? "x" : "y"));
  return marks(
    !isNoneish(positiveFill)
      ? Object.assign(
          area(data, {
            x1,
            x2,
            y1,
            y2,
            z,
            fill: positiveFill,
            fillOpacity: positiveFillOpacity,
            render: composeRender(render, clipDifference(k, true)),
            clip,
            ...options
          }),
          {ariaLabel: "positive difference"}
        )
      : null,
    !isNoneish(negativeFill)
      ? Object.assign(
          area(data, {
            x1,
            x2,
            y1,
            y2,
            z,
            fill: negativeFill,
            fillOpacity: negativeFillOpacity,
            render: composeRender(render, clipDifference(k, false)),
            clip,
            ...options
          }),
          {ariaLabel: "negative difference"}
        )
      : null,
    line(data, {
      x: x2,
      y: y2,
      z,
      stroke,
      strokeOpacity,
      tip,
      clip: true,
      ...options
    })
  );
}

function memoTuple(x: any, x1: any, x2: any) {
  if (x1 === undefined && x2 === undefined) {
    // {x} → [x, x]
    x1 = x2 = memo(x);
  } else if (x1 === undefined) {
    // {x2} → [x2, x2]
    // {x, x2} → [x, x2]
    x2 = memo(x2);
    x1 = x === undefined ? x2 : memo(x);
  } else if (x2 === undefined) {
    // {x1} → [x1, x1]
    // {x, x1} → [x1, x]
    x1 = memo(x1);
    x2 = x === undefined ? x1 : memo(x);
  } else {
    // {x1, x2} → [x1, x2]
    x1 = memo(x1);
    x2 = memo(x2);
  }
  return [x1, x2];
}

function memo(v: any) {
  let V: any;
  const {value, label = labelof(value)} = maybeValue(v);
  return {transform: (data: any) => V || (V = valueof(data, value)), label};
}

// JSX-mode parallel to clipDifference. The imperative version recursively
// invokes `next()` (the underlying area's imperative render) twice, splicing
// individual <path> children out of one resulting <g> into freshly minted
// <clipPath> elements and rewriting clip-path references on siblings of the
// other. Reproducing that without a JSX-aware `next` continuation, and
// without violating React's "DOM children come from props" model, requires
// pipeline support we have not yet built. Defer per Phase 1 unit 19 rule.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function clipDifferenceJSX(this: any, _k: "x" | "y", _positive: boolean) {
  return (
    _index: any,
    _scales: any,
    _channels: any,
    _dimensions: any,
    _context: any,
    _next: any
  ): ReactNode => {
    // Touch the JSX style helpers so that future implementations have them
    // pre-imported and the import surface matches sibling ported marks.
    void indirectStyleProps;
    void directStyleProps;
    void transformProp;
    void groupChannelStyleProps;
    void withHrefWrap;
    void withTitleChild;
    void h;
    throw new Error("Difference.renderJSX: clipPath registration deferred");
  };
}

function clipDifference(k: "x" | "y", positive: boolean) {
  const f = k === "x" ? "y" : "x"; // f is the flipped dimension
  const f1 = `${f}1`;
  const f2 = `${f}2`;
  const k1 = `${k}1`;
  const k2 = `${k}2`;
  return (index: any, scales: any, channels: any, dimensions: any, context: any, next: any) => {
    const {[f1]: F1, [f2]: F2} = channels;
    const K1 = new Float32Array(F1.length);
    const K2 = new Float32Array(F2.length);
    const m = dimensions[k === "y" ? "height" : "width"];
    (positive === inferScaleOrder(scales[k]) < 0 ? K1 : K2).fill(m);
    const oc = next(index, scales, {...channels, [f2]: F1, [k2]: K2}, dimensions, context);
    const og = next(index, scales, {...channels, [f1]: F2, [k1]: K1}, dimensions, context);
    const c = oc.querySelector("g") ?? oc; // applyClip
    const g = og.querySelector("g") ?? og; // applyClip
    for (let i = 0; c.firstChild; i += 2) {
      const id = getClipId();
      const clipPath = create("svg:clipPath", context).attr("id", id).node();
      clipPath.appendChild(c.firstChild);
      g.childNodes[i].setAttribute("clip-path", `url(#${id})`);
      g.insertBefore(clipPath, g.childNodes[i]);
    }
    return og;
  };
}
