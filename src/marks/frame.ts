import {Fragment, createElement as h, type ReactNode} from "react";
import type {InsetOptions} from "../inset.js";
import type {MarkOptions} from "../mark.js";
import type {RectCornerOptions} from "./rect.js";
import {create} from "../context.js";
import {Mark} from "../mark.js";
import {maybeKeyword, singleton} from "../options.js";
import {applyChannelStyles, applyDirectStyles, applyIndirectStyles, applyTransform} from "../style.js";
import {channelStyleProps, directStyleProps, indirectStyleProps, transformProp} from "../react/styles.js";
import {withHrefWrap, withTitleChild} from "../react/styles-jsx.js";
import {applyRoundedRect, rectInsets, rectRadii, roundedRectPath} from "./rect.js";

/** Options for the frame decoration mark. */
export interface FrameOptions extends MarkOptions, InsetOptions, RectCornerOptions {
  /**
   * If null (default), the rectangular outline of the frame is drawn; otherwise
   * the frame is drawn as a line only on the given side, and the corner radii
   * (**r** *etc.*) and fill (**fill** and **fillOpacity**) options are ignored.
   */
  anchor?: "top" | "right" | "bottom" | "left" | null;
}

const defaults = {
  ariaLabel: "frame",
  fill: "none",
  stroke: "currentColor",
  clip: false
};

const lineDefaults = {
  ariaLabel: "frame",
  fill: null,
  stroke: "currentColor",
  strokeLinecap: "square",
  clip: false
};

/** The frame decoration mark. */
export class Frame extends Mark {
  constructor(options: FrameOptions = {}) {
    const {anchor = null} = options;
    super(singleton, undefined, options, anchor == null ? defaults : lineDefaults);
    this.anchor = maybeKeyword(anchor, "anchor", ["top", "right", "bottom", "left"]);
    rectInsets(this, options);
    if (!anchor) rectRadii(this, options);
  }
  render(index, scales, channels, dimensions, context) {
    const {marginTop, marginRight, marginBottom, marginLeft, width, height} = dimensions;
    const {anchor, insetTop, insetRight, insetBottom, insetLeft} = this;
    const {rx, ry, rx1y1, rx1y2, rx2y1, rx2y2} = this;
    const x1 = marginLeft + insetLeft;
    const x2 = width - marginRight - insetRight;
    const y1 = marginTop + insetTop;
    const y2 = height - marginBottom - insetBottom;
    return create(anchor ? "svg:line" : rx1y1 || rx1y2 || rx2y1 || rx2y2 ? "svg:path" : "svg:rect", context)
      .datum(0)
      .call(applyIndirectStyles, this, dimensions, context)
      .call(applyDirectStyles, this)
      .call(applyChannelStyles, this, channels)
      .call(applyTransform, this, {})
      .call(
        anchor === "left"
          ? (line) => line.attr("x1", x1).attr("x2", x1).attr("y1", y1).attr("y2", y2)
          : anchor === "right"
          ? (line) => line.attr("x1", x2).attr("x2", x2).attr("y1", y1).attr("y2", y2)
          : anchor === "top"
          ? (line) => line.attr("x1", x1).attr("x2", x2).attr("y1", y1).attr("y2", y1)
          : anchor === "bottom"
          ? (line) => line.attr("x1", x1).attr("x2", x2).attr("y1", y2).attr("y2", y2)
          : rx1y1 || rx1y2 || rx2y1 || rx2y2
          ? (path) => path.call(applyRoundedRect, x1, y1, x2, y2, this)
          : (rect) =>
              rect
                .attr("x", x1)
                .attr("y", y1)
                .attr("width", x2 - x1)
                .attr("height", y2 - y1)
                .attr("rx", rx)
                .attr("ry", ry)
      )
      .node();
  }
  renderJSX(this: any, index, scales, channels, dimensions, context): ReactNode {
    const {marginTop, marginRight, marginBottom, marginLeft, width, height} = dimensions;
    const {anchor, insetTop, insetRight, insetBottom, insetLeft} = this;
    const {rx, ry, rx1y1, rx1y2, rx2y1, rx2y2} = this;
    const x1 = marginLeft + insetLeft;
    const x2 = width - marginRight - insetRight;
    const y1 = marginTop + insetTop;
    const y2 = height - marginBottom - insetBottom;
    const indirect = indirectStyleProps(this);
    const direct = directStyleProps(this);
    const channel = channelStyleProps(0, channels);
    const transform = transformProp(this, {});
    const baseProps = {...indirect, ...direct, ...channel, ...transform};
    let element: ReactNode;
    if (anchor === "left") element = h("line", {...baseProps, x1, x2: x1, y1, y2});
    else if (anchor === "right") element = h("line", {...baseProps, x1: x2, x2, y1, y2});
    else if (anchor === "top") element = h("line", {...baseProps, x1, x2, y1, y2: y1});
    else if (anchor === "bottom") element = h("line", {...baseProps, x1, x2, y1: y2, y2});
    else if (rx1y1 || rx1y2 || rx2y1 || rx2y2) {
      element = h("path", {...baseProps, d: roundedRectPath(x1, y1, x2, y2, this)});
    } else {
      element = h("rect", {...baseProps, x: x1, y: y1, width: x2 - x1, height: y2 - y1, rx: rx ?? undefined, ry: ry ?? undefined});
    }
    const titled = withTitleChild(channels, 0, null);
    if (titled) element = h(Fragment, null, element, titled);
    return withHrefWrap(channels, this.target, 0, element);
  }
}

/**
 * Draws a rectangle around the plot’s frame, or if an **anchor** is given, a
 * line on the given side. Useful for visual separation of facets, or in
 * conjunction with axes and grids to fill the frame’s background.
 */
export function frame(options?: FrameOptions): Frame {
  return new Frame(options);
}
