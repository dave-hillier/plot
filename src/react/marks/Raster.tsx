import {useMark} from "../useMark.js";
import type {Data} from "../../mark.js";
import {raster} from "../../marks/raster.js";
import type {RasterOptions} from "../../marks/raster.js";

// RasterOptions redeclares fill/fillOpacity (they accept a sampler function),
// which is incompatible with the MarkOptions declarations MarkProps inherits,
// so RasterProps builds on it directly rather than on MarkProps; the index
// signature keeps the surface open for the reasons documented in markProps.ts.
export interface RasterProps extends RasterOptions {
  data?: Data;
  [option: string]: unknown;
}

export function Raster({data, ...options}: RasterProps) {
  useMark({name: "raster", data, options, create: raster});
  return null;
}
