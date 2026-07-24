import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {boxX, boxY} from "../../marks/box.js";
import type {BoxXOptions, BoxYOptions} from "../../marks/box.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface BoxXProps extends MarkProps, BoxXOptions {}

export interface BoxYProps extends MarkProps, BoxYOptions {}

export function BoxX({data, ...options}: BoxXProps) {
  useMark({name: "boxX", data, options, create: boxX});
  return null;
}

export function BoxY({data, ...options}: BoxYProps) {
  useMark({name: "boxY", data, options, create: boxY});
  return null;
}
