import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {rect, rectX, rectY} from "../../marks/rect.js";
import type {RectOptions, RectXOptions, RectYOptions} from "../../marks/rect.js";
import {cell, cellX, cellY} from "../../marks/cell.js";
import type {CellOptions} from "../../marks/cell.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface RectProps extends MarkProps, RectOptions {}

export interface RectXProps extends MarkProps, RectXOptions {}

export interface RectYProps extends MarkProps, RectYOptions {}

export interface CellProps extends MarkProps, CellOptions {}

export function Rect({data, ...options}: RectProps) {
  useMark({name: "rect", data, options, create: rect});
  return null;
}

export function RectX({data, ...options}: RectXProps) {
  useMark({name: "rectX", data, options, create: rectX});
  return null;
}

export function RectY({data, ...options}: RectYProps) {
  useMark({name: "rectY", data, options, create: rectY});
  return null;
}

export function Cell({data, ...options}: CellProps) {
  useMark({name: "cell", data, options, create: cell});
  return null;
}

export function CellX({data, ...options}: CellProps) {
  useMark({name: "cellX", data, options, create: cellX});
  return null;
}

export function CellY({data, ...options}: CellProps) {
  useMark({name: "cellY", data, options, create: cellY});
  return null;
}
