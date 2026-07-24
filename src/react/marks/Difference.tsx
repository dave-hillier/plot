import {useMark} from "../useMark.js";
import type {Data} from "../../mark.js";
import {differenceX, differenceY} from "../../marks/difference.js";
import type {DifferenceOptions} from "../../marks/difference.js";

// DifferenceOptions narrows fillOpacity to a constant number, which is
// incompatible with the MarkOptions declaration MarkProps inherits, so
// DifferenceProps builds on it directly rather than on MarkProps; the index
// signature keeps the surface open for the reasons documented in markProps.ts.
export interface DifferenceProps extends DifferenceOptions {
  data?: Data;
  [option: string]: unknown;
}

export function DifferenceX({data, ...options}: DifferenceProps) {
  useMark({name: "differenceX", data, options, create: differenceX});
  return null;
}

export function DifferenceY({data, ...options}: DifferenceProps) {
  useMark({name: "differenceY", data, options, create: differenceY});
  return null;
}
