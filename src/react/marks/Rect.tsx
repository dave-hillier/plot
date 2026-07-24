import {useMark} from "../useMark.js";
import {rect, rectX, rectY} from "../../marks/rect.js";
import {cell, cellX, cellY} from "../../marks/cell.js";

export interface RectProps {
  data?: any;
  [key: string]: any;
}

export function Rect({data, ...options}: RectProps) {
  useMark({name: "rect", data, options, create: rect});
  return null;
}

export function RectX({data, ...options}: RectProps) {
  useMark({name: "rectX", data, options, create: rectX});
  return null;
}

export function RectY({data, ...options}: RectProps) {
  useMark({name: "rectY", data, options, create: rectY});
  return null;
}

export function Cell({data, ...options}: RectProps) {
  useMark({name: "cell", data, options, create: cell});
  return null;
}

export function CellX({data, ...options}: RectProps) {
  useMark({name: "cellX", data, options, create: cellX});
  return null;
}

export function CellY({data, ...options}: RectProps) {
  useMark({name: "cellY", data, options, create: cellY});
  return null;
}
