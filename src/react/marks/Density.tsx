import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {density} from "../../marks/density.js";
import type {DensityOptions} from "../../marks/density.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface DensityProps extends MarkProps, DensityOptions {}

export function Density({data, ...options}: DensityProps) {
  useMark({name: "density", data, options, create: density});
  return null;
}
