import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {line, lineX, lineY} from "../../marks/line.js";
import type {LineOptions, LineXOptions, LineYOptions} from "../../marks/line.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface LineProps extends MarkProps, LineOptions {}

export interface LineXProps extends MarkProps, LineXOptions {}

export interface LineYProps extends MarkProps, LineYOptions {}

export function Line({data, ...options}: LineProps) {
  useMark({name: "line", data, options, create: line});
  return null;
}

export function LineX({data, ...options}: LineXProps) {
  useMark({name: "lineX", data, options, create: lineX});
  return null;
}

export function LineY({data, ...options}: LineYProps) {
  useMark({name: "lineY", data, options, create: lineY});
  return null;
}
