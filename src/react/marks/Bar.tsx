import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {barX, barY} from "../../marks/bar.js";
import type {BarXOptions, BarYOptions} from "../../marks/bar.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface BarXProps extends MarkProps, BarXOptions {}

export interface BarYProps extends MarkProps, BarYOptions {}

export function BarX({data, ...options}: BarXProps) {
  useMark({name: "barX", data, options, create: barX});
  return null;
}

export function BarY({data, ...options}: BarYProps) {
  useMark({name: "barY", data, options, create: barY});
  return null;
}
