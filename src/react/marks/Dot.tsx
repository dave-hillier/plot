import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {dot, dotX, dotY, circle, hexagon} from "../../marks/dot.js";
import type {DotOptions, DotXOptions, DotYOptions} from "../../marks/dot.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface DotProps extends MarkProps, DotOptions {}

export interface DotXProps extends MarkProps, DotXOptions {}

export interface DotYProps extends MarkProps, DotYOptions {}

// circle and hexagon fix the symbol, so it is omitted from the declared
// props; the open index signature still admits it (typed unknown), and the
// mark overrides any value passed.
export interface CircleProps extends MarkProps, Omit<DotOptions, "symbol"> {}

export interface HexagonProps extends MarkProps, Omit<DotOptions, "symbol"> {}

export function Dot({data, ...options}: DotProps) {
  useMark({name: "dot", data, options, create: dot});
  return null;
}

export function DotX({data, ...options}: DotXProps) {
  useMark({name: "dotX", data, options, create: dotX});
  return null;
}

export function DotY({data, ...options}: DotYProps) {
  useMark({name: "dotY", data, options, create: dotY});
  return null;
}

export function Circle({data, ...options}: CircleProps) {
  useMark({name: "circle", data, options, create: circle});
  return null;
}

export function Hexagon({data, ...options}: HexagonProps) {
  useMark({name: "hexagon", data, options, create: hexagon});
  return null;
}
