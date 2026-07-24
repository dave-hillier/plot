import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {arrow} from "../../marks/arrow.js";
import type {ArrowOptions} from "../../marks/arrow.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface ArrowProps extends MarkProps, ArrowOptions {}

export function Arrow({data, ...options}: ArrowProps) {
  useMark({name: "arrow", data, options, create: arrow});
  return null;
}
