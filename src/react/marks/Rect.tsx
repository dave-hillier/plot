import {useMark, stampOptions} from "../useMark.js";
import {rect, rectX, rectY} from "../../marks/rect.js";
import {cell, cellX, cellY} from "../../marks/cell.js";

export interface RectProps {
  data?: any;
  [key: string]: any;
}

export function Rect({data, ...options}: RectProps) {
  useMark({stamp: stampOptions("rect", data, options), factory: () => rect(data, options)});
  return null;
}

export function RectX({data, ...options}: RectProps) {
  useMark({stamp: stampOptions("rectX", data, options), factory: () => rectX(data, options)});
  return null;
}

export function RectY({data, ...options}: RectProps) {
  useMark({stamp: stampOptions("rectY", data, options), factory: () => rectY(data, options)});
  return null;
}

export function Cell({data, ...options}: RectProps) {
  useMark({stamp: stampOptions("cell", data, options), factory: () => cell(data, options)});
  return null;
}

export function CellX({data, ...options}: RectProps) {
  useMark({stamp: stampOptions("cellX", data, options), factory: () => cellX(data, options)});
  return null;
}

export function CellY({data, ...options}: RectProps) {
  useMark({stamp: stampOptions("cellY", data, options), factory: () => cellY(data, options)});
  return null;
}
