import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {crosshair, crosshairX, crosshairY} from "../../marks/crosshair.js";
import type {CrosshairOptions} from "../../marks/crosshair.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface CrosshairProps extends MarkProps, CrosshairOptions {}

export function Crosshair({data, ...options}: CrosshairProps) {
  useMark({name: "crosshair", data, options, create: crosshair});
  return null;
}

export function CrosshairX({data, ...options}: CrosshairProps) {
  useMark({name: "crosshairX", data, options, create: crosshairX});
  return null;
}

export function CrosshairY({data, ...options}: CrosshairProps) {
  useMark({name: "crosshairY", data, options, create: crosshairY});
  return null;
}
