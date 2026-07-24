import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {waffleX, waffleY} from "../../marks/waffle.js";
import type {WaffleXOptions, WaffleYOptions} from "../../marks/waffle.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface WaffleXProps extends MarkProps, WaffleXOptions {}

export interface WaffleYProps extends MarkProps, WaffleYOptions {}

export function WaffleX({data, ...options}: WaffleXProps) {
  useMark({name: "waffleX", data, options, create: waffleX});
  return null;
}

export function WaffleY({data, ...options}: WaffleYProps) {
  useMark({name: "waffleY", data, options, create: waffleY});
  return null;
}
