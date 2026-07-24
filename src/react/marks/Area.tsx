import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {area, areaX, areaY} from "../../marks/area.js";
import type {AreaOptions, AreaXOptions, AreaYOptions} from "../../marks/area.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface AreaProps extends MarkProps, AreaOptions {}

export interface AreaXProps extends MarkProps, AreaXOptions {}

export interface AreaYProps extends MarkProps, AreaYOptions {}

export function Area({data, ...options}: AreaProps) {
  useMark({name: "area", data, options, create: (d, o) => (Object.keys(o).length > 0 ? area(d, o) : area(d))});
  return null;
}

export function AreaX({data, ...options}: AreaXProps) {
  useMark({name: "areaX", data, options, create: areaX});
  return null;
}

export function AreaY({data, ...options}: AreaYProps) {
  useMark({name: "areaY", data, options, create: areaY});
  return null;
}
