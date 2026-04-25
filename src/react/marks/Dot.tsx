import {useMark, stampOptions} from "../useMark.js";
import {dot, dotX, dotY, circle, hexagon} from "../../marks/dot.js";

export interface DotProps {
  data?: any;
  [key: string]: any;
}

export function Dot({data, ...options}: DotProps) {
  useMark({stamp: stampOptions("dot", data, options), factory: () => dot(data, options)});
  return null;
}

export function DotX({data, ...options}: DotProps) {
  useMark({stamp: stampOptions("dotX", data, options), factory: () => dotX(data, options)});
  return null;
}

export function DotY({data, ...options}: DotProps) {
  useMark({stamp: stampOptions("dotY", data, options), factory: () => dotY(data, options)});
  return null;
}

export function Circle({data, ...options}: DotProps) {
  useMark({stamp: stampOptions("circle", data, options), factory: () => circle(data, options)});
  return null;
}

export function Hexagon({data, ...options}: DotProps) {
  useMark({stamp: stampOptions("hexagon", data, options), factory: () => hexagon(data, options)});
  return null;
}
