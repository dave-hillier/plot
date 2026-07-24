import {useMark} from "../useMark.js";
import {dot, dotX, dotY, circle, hexagon} from "../../marks/dot.js";

export interface DotProps {
  data?: any;
  [key: string]: any;
}

export function Dot({data, ...options}: DotProps) {
  useMark({name: "dot", data, options, create: dot});
  return null;
}

export function DotX({data, ...options}: DotProps) {
  useMark({name: "dotX", data, options, create: dotX});
  return null;
}

export function DotY({data, ...options}: DotProps) {
  useMark({name: "dotY", data, options, create: dotY});
  return null;
}

export function Circle({data, ...options}: DotProps) {
  useMark({name: "circle", data, options, create: circle});
  return null;
}

export function Hexagon({data, ...options}: DotProps) {
  useMark({name: "hexagon", data, options, create: hexagon});
  return null;
}
