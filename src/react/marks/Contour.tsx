import {useMark} from "../useMark.js";
import type {Data} from "../../mark.js";
import {contour} from "../../marks/contour.js";
import type {ContourOptions} from "../../marks/contour.js";

// ContourOptions redeclares fill/fillOpacity (they accept a sampler function),
// which is incompatible with the MarkOptions declarations MarkProps inherits,
// so ContourProps builds on it directly rather than on MarkProps; the index
// signature keeps the surface open for the reasons documented in markProps.ts.
export interface ContourProps extends ContourOptions {
  data?: Data;
  [option: string]: unknown;
}

export function Contour({data, ...options}: ContourProps) {
  useMark({name: "contour", data, options, create: contour});
  return null;
}
