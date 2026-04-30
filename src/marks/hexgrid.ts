import {createElement as h, type ReactNode} from "react";
// @ts-ignore
import {create} from "../context.js";
import type {MarkOptions, RenderableMark} from "../mark.js";
import {Mark} from "../mark.js";
// @ts-ignore
import {number, singleton} from "../options.js";
// @ts-ignore
import {applyChannelStyles, applyDirectStyles, applyIndirectStyles, applyTransform, offset} from "../style.js";
// @ts-ignore
import {sqrt4_3} from "../symbol.js";
// @ts-ignore
import {ox, oy} from "../transforms/hexbin.js";
import {indirectStyleProps, directStyleProps, transformProp} from "../react/styles.js";

/** Options for the hexgrid mark. */
export interface HexgridOptions extends MarkOptions {
  /**
   * The distance between centers of neighboring hexagons, in pixels; defaults
   * to 20. Should match the **binWidth** of the hexbin transform.
   */
  binWidth?: number;
}

const defaults = {
  ariaLabel: "hexgrid",
  fill: "none",
  stroke: "currentColor",
  strokeOpacity: 0.1
};

/**
 * The hexgrid decoration mark complements the hexbin transform, showing the
 * outlines of all hexagons spanning the frame with a default **stroke** of
 * *currentColor* and a default **strokeOpacity** of 0.1, similar to the the
 * default axis grids. For example:
 *
 * ```js
 * Plot.plot({
 *   marks: [
 *     Plot.hexagon(Plot.hexbin({fill: "count"}, {binWidth: 12, x: "weight", y: "economy"})),
 *     Plot.hexgrid({binWidth: 12})
 *   ]
 * })
 * ```
 *
 * Note that the **binWidth** option of the hexgrid mark should match that of
 * the hexbin transform. The grid is clipped by the frame. This is a stroke-only
 * mark, and **fill** is not supported; to fill the frame, use the frame mark.
 */
export function hexgrid(options?: HexgridOptions): Hexgrid {
  return new Hexgrid(options);
}

/** The hexgrid mark. */
export class Hexgrid extends Mark {
  binWidth: number;
  constructor({binWidth = 20, clip = true, ...options}: any = {}) {
    // @ts-ignore - Mark base constructor is not typed in mark.d.ts
    super(singleton, undefined, {clip, ...options}, defaults);
    this.binWidth = number(binWidth);
  }
  render(index: any, scales: any, channels: any, dimensions: any, context: any) {
    const {binWidth} = this;
    const {marginTop, marginRight, marginBottom, marginLeft, width, height} = dimensions;
    const x0 = marginLeft - ox,
      x1 = width - marginRight - ox,
      y0 = marginTop - oy,
      y1 = height - marginBottom - oy,
      rx = binWidth / 2,
      ry = rx * sqrt4_3,
      hy = ry / 2,
      wx = rx * 2,
      wy = ry * 1.5,
      i0 = Math.floor(x0 / wx),
      i1 = Math.ceil(x1 / wx),
      j0 = Math.floor((y0 + hy) / wy),
      j1 = Math.ceil((y1 - hy) / wy) + 1,
      path = `m0,${round(-ry)}l${round(rx)},${round(hy)}v${round(ry)}l${round(-rx)},${round(hy)}`;
    let d = path;
    for (let j = j0; j < j1; ++j) {
      for (let i = i0; i < i1; ++i) {
        d += `M${round(i * wx + (j & 1) * rx)},${round(j * wy)}${path}`;
      }
    }
    return create("svg:g", context)
      .datum(0)
      .call(applyIndirectStyles, this, dimensions, context)
      .call(applyTransform, this, {}, offset + ox, offset + oy)
      .call((g: any) => g.append("path").call(applyDirectStyles, this).call(applyChannelStyles, this, channels).attr("d", d))
      .node();
  }
  renderJSX(this: any, _index: any, _scales: any, _channels: any, dimensions: any, _context: any): ReactNode {
    const {binWidth} = this;
    const {marginTop, marginRight, marginBottom, marginLeft, width, height} = dimensions;
    const x0 = marginLeft - ox,
      x1 = width - marginRight - ox,
      y0 = marginTop - oy,
      y1 = height - marginBottom - oy,
      rx = binWidth / 2,
      ry = rx * sqrt4_3,
      hy = ry / 2,
      wx = rx * 2,
      wy = ry * 1.5,
      i0 = Math.floor(x0 / wx),
      i1 = Math.ceil(x1 / wx),
      j0 = Math.floor((y0 + hy) / wy),
      j1 = Math.ceil((y1 - hy) / wy) + 1,
      path = `m0,${round(-ry)}l${round(rx)},${round(hy)}v${round(ry)}l${round(-rx)},${round(hy)}`;
    let d = path;
    for (let j = j0; j < j1; ++j) {
      for (let i = i0; i < i1; ++i) {
        d += `M${round(i * wx + (j & 1) * rx)},${round(j * wy)}${path}`;
      }
    }
    const indirect = indirectStyleProps(this);
    const direct = directStyleProps(this);
    const transform = transformProp(this, {}, offset + ox, offset + oy);
    return h("g", {...indirect, ...transform}, h("path", {...direct, d}));
  }
}

function round(x: number) {
  return Math.round(x * 1e3) / 1e3;
}
