import {useMark} from "../useMark.js";
import type {Data} from "../../mark.js";
import {auto} from "../../marks/auto.js";
import type {AutoOptions} from "../../marks/auto.js";

// AutoOptions does not extend MarkOptions, and its fx/fy accept wrapper
// objects that MarkOptions' fx/fy do not, so AutoProps builds on it directly
// rather than on MarkProps; the index signature keeps the surface open for
// the reasons documented in markProps.ts.
export interface AutoProps extends AutoOptions {
  data?: Data;
  [option: string]: unknown;
}

export function Auto({data, ...options}: AutoProps) {
  useMark({name: "auto", data, options, create: auto});
  return null;
}
